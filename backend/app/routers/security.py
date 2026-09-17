from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, SecuritySession, AuditLog
from app.schemas.schemas import SecurityCenterOut
from app.services.security_service import SecurityService

router = APIRouter(prefix="/security", tags=["Security Center"])

@router.get("/center", response_model=SecurityCenterOut)
def get_security_center_data(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(SecuritySession).filter(SecuritySession.user_id == user.id, SecuritySession.is_active == True).all()
    if not sessions:
        s = SecuritySession(
            user_id=user.id,
            session_token="curr_active_session_token",
            device_name="Chrome on Windows 11",
            ip_address="127.0.0.1",
            location="Mumbai, India",
            is_active=True
        )
        db.add(s)
        db.commit()
        sessions = [s]
        
    recent_logs = db.query(AuditLog).filter(AuditLog.user_id == user.id).order_by(AuditLog.timestamp.desc()).limit(15).all()
    if not recent_logs:
        SecurityService.log_audit(db, user.id, "SECURITY_AUDIT_INITIALIZED", details="SecureShield engine initialized")
        recent_logs = db.query(AuditLog).filter(AuditLog.user_id == user.id).order_by(AuditLog.timestamp.desc()).limit(15).all()
        
    failed_logins = db.query(AuditLog).filter(AuditLog.action == "LOGIN_FAILED", AuditLog.status == "FAILED").count()
    sec_info = SecurityService.calculate_security_score(user, sessions, failed_logins)
    
    return {
        "security_score": sec_info["security_score"],
        "mfa_enabled": sec_info["mfa_enabled"],
        "active_sessions_count": sec_info["active_sessions_count"],
        "failed_logins_last_24h": sec_info["failed_logins_last_24h"],
        "threat_level": sec_info["threat_level"],
        "active_sessions": sessions,
        "recent_audit_logs": recent_logs
    }

@router.post("/logout-all")
def logout_all_sessions(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(SecuritySession).filter(SecuritySession.user_id == user.id).update({"is_active": False})
    db.commit()
    SecurityService.log_audit(db, user.id, "LOGOUT_ALL_DEVICES", details="Terminated all active user sessions")
    return {"status": "success", "message": "All active device sessions have been securely terminated"}

@router.post("/toggle-mfa")
def toggle_mfa(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.mfa_enabled = not user.mfa_enabled
    user.updated_at = datetime.utcnow()
    db.commit()
    state_str = "enabled" if user.mfa_enabled else "disabled"
    SecurityService.log_audit(db, user.id, "MFA_TOGGLED", details=f"MFA status changed to: {user.mfa_enabled}")
    return {"mfa_enabled": user.mfa_enabled, "message": f"MFA has been {state_str}"}
