from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, FraudAlert
from app.schemas.schemas import FraudAlertOut, FraudResolveRequest
from app.services.security_service import SecurityService

router = APIRouter(prefix="/fraud", tags=["Fraud Monitor"])

@router.get("/alerts", response_model=List[FraudAlertOut])
def list_fraud_alerts(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    alerts = db.query(FraudAlert).filter(FraudAlert.user_id == user.id).order_by(FraudAlert.created_at.desc()).all()
    if not alerts:
        # Seed realistic security advisory alerts
        seeds = [
            ("Spending Spike Anomaly", "Medium", "Transaction of ?18,500.00 at 'Croma Electronics' is 3.8x your average retail expense.", "Verify if this high-value appliance purchase was authorized."),
            ("Location Jump Detected", "Low", "Login session initiated from IP in Singapore while prior transaction was from Mumbai.", "Enable Multi-Factor Authentication (MFA) to lock account access.")
        ]
        for a_type, sev, desc, act in seeds:
            fa = FraudAlert(
                user_id=user.id,
                alert_type=a_type,
                severity=sev,
                description=desc,
                suggested_action=act,
                is_resolved=False
            )
            db.add(fa)
        db.commit()
        alerts = db.query(FraudAlert).filter(FraudAlert.user_id == user.id).order_by(FraudAlert.created_at.desc()).all()
    return alerts

@router.post("/alerts/{alert_id}/resolve", response_model=FraudAlertOut)
def resolve_fraud_alert(
    alert_id: int,
    req: FraudResolveRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(FraudAlert).filter(FraudAlert.id == alert_id, FraudAlert.user_id == user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert.is_resolved = True
    alert.resolution_note = req.resolution_note
    db.commit()
    db.refresh(alert)
    
    SecurityService.log_audit(db, user.id, "FRAUD_ALERT_RESOLVED", details=f"Resolved alert {alert_id}: {req.resolution_note}")
    return alert
