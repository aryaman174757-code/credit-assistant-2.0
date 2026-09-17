from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, FinancialProfile
from app.schemas.schemas import InvestmentReadinessOut
from app.services.investment_readiness import InvestmentReadinessService
from app.services.security_service import SecurityService

router = APIRouter(prefix="/investment", tags=["Investment Readiness"])

@router.get("/readiness", response_model=InvestmentReadinessOut)
def get_investment_readiness(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    if not profile:
        profile = FinancialProfile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    result = InvestmentReadinessService.calculate_readiness(profile)
    SecurityService.log_audit(db, user.id, "INVESTMENT_READINESS_CHECKED", details=f"Calculated readiness score: {result['readiness_score']}/100")
    return result
