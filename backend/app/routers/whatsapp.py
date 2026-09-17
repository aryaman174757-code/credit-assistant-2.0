from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, FinancialProfile
from app.schemas.schemas import WhatsAppReminderRequest, WhatsAppReminderOut
from app.services.whatsapp_service import WhatsAppService
from app.services.security_service import SecurityService

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp Reminders"])

@router.post("/send-reminder", response_model=WhatsAppReminderOut)
def trigger_whatsapp_reminder(req: WhatsAppReminderRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    data = {
        "user_name": user.full_name,
        "emi_amount": profile.existing_emi if profile else 15000.0,
        "credit_score": profile.credit_score if profile else 742,
        "utilization": f"{profile.credit_utilization if profile else 29}%",
        "health_score": profile.financial_health_index if profile else 78.5,
        "custom_note": req.custom_note or "Routine alert"
    }
    result = WhatsAppService.generate_reminder_payload(
        reminder_type=req.reminder_type,
        phone_number=req.phone_number,
        user_name=user.full_name,
        data=data
    )
    SecurityService.log_audit(db, user.id, "WHATSAPP_ALERT_DISPATCHED", details=f"Dispatched {req.reminder_type} to {req.phone_number}")
    return result
