from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, FinancialProfile
from app.schemas.schemas import FinancialProfileOut, FinancialProfileUpdate
from app.services.security_service import SecurityService

router = APIRouter(prefix="/profile", tags=["Financial Profile"])

def calculate_derived_metrics(profile: FinancialProfile):
    income = max(1.0, profile.monthly_income)
    expenses = profile.monthly_expenses
    emi = profile.existing_emi
    limit = max(1.0, profile.credit_limit)
    used = profile.used_credit
    
    # 1. DTI Ratio: ((Existing EMI + 5% of CC used) / Monthly Income) * 100
    monthly_debt_service = emi + (used * 0.05)
    dti = round((monthly_debt_service / income) * 100.0, 1)
    
    # 2. Credit Utilization: (Used Credit / Credit Limit) * 100
    utilization = round((used / limit) * 100.0, 1)
    
    # 3. Disposable Income: Monthly Income - Living Expenses - EMI
    disposable = round(max(0.0, income - expenses - emi), 2)
    
    # 4. Financial Health Index (0-100)
    score = 0.0
    # Credit Score component (max 30 pts)
    cs = profile.credit_score
    if cs >= 780: score += 30
    elif cs >= 720: score += 25
    elif cs >= 650: score += 15
    else: score += 5
    
    # DTI component (max 25 pts)
    if dti <= 30: score += 25
    elif dti <= 40: score += 18
    elif dti <= 50: score += 10
    else: score += 2
    
    # Utilization component (max 25 pts)
    if utilization <= 30: score += 25
    elif utilization <= 50: score += 15
    elif utilization <= 75: score += 8
    else: score += 2
    
    # Savings / Emergency coverage component (max 20 pts)
    burn = expenses + emi
    months_cover = profile.emergency_fund / max(burn, 1.0)
    if months_cover >= 6: score += 20
    elif months_cover >= 3: score += 14
    elif months_cover >= 1: score += 8
    else: score += 2
    
    profile.dti_ratio = dti
    profile.credit_utilization = utilization
    profile.disposable_income = disposable
    profile.financial_health_index = round(score, 1)

@router.get("/", response_model=FinancialProfileOut)
def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    if not profile:
        profile = FinancialProfile(user_id=user.id)
        calculate_derived_metrics(profile)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.post("/", response_model=FinancialProfileOut)
def update_profile(
    data: FinancialProfileUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    if not profile:
        profile = FinancialProfile(user_id=user.id)
        db.add(profile)
        
    for field, value in data.dict(exclude_unset=True).items():
        setattr(profile, field, value)
        
    calculate_derived_metrics(profile)
    profile.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(profile)
    
    SecurityService.log_audit(db, user.id, "PROFILE_UPDATED", details="Updated financial parameters and recalculation performed")
    return profile
