from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, FinancialProfile, LoanCalculation
from app.schemas.schemas import (
    EMICalculationRequest, EMICalculationOut,
    LoanEligibilityRequest, LoanEligibilityOut
)
from app.services.emi_calculator import EMICalculatorService
from app.services.security_service import SecurityService

router = APIRouter(prefix="/calculator", tags=["Calculators & Loans"])

@router.post("/emi", response_model=EMICalculationOut)
def calculate_emi(
    req: EMICalculationRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    income = profile.monthly_income if profile else 85000.0
    existing_emi = profile.existing_emi if profile else 15000.0
    
    result = EMICalculatorService.calculate_emi(
        loan_amount=req.loan_amount,
        interest_rate=req.interest_rate,
        tenure_months=req.tenure_months,
        monthly_income=income,
        existing_emi=existing_emi,
        loan_type=req.loan_type
    )
    
    # Save calculation audit
    calc = LoanCalculation(
        user_id=user.id,
        loan_type=req.loan_type,
        loan_amount=req.loan_amount,
        interest_rate=req.interest_rate,
        tenure_months=req.tenure_months,
        monthly_emi=result["monthly_emi"],
        total_interest=result["total_interest"],
        total_payment=result["total_payment"],
        foir_percentage=result["foir_percentage"],
        is_affordable=result["is_affordable"],
        risk_level=result["risk_level"]
    )
    db.add(calc)
    db.commit()
    
    SecurityService.log_audit(db, user.id, "EMI_CALCULATED", details=f"Calculated {req.loan_type} for ?{req.loan_amount:,.0f}")
    return result

@router.post("/loan-eligibility", response_model=LoanEligibilityOut)
def estimate_eligibility(
    req: LoanEligibilityRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    income = profile.monthly_income if profile else 85000.0
    existing_emi = profile.existing_emi if profile else 15000.0
    credit_score = profile.credit_score if profile else 742
    
    result = EMICalculatorService.estimate_loan_eligibility(
        monthly_income=income,
        existing_emi=existing_emi,
        credit_score=credit_score,
        loan_type=req.loan_type,
        tenure_years=req.tenure_years,
        custom_interest_rate=req.custom_interest_rate
    )
    
    SecurityService.log_audit(db, user.id, "LOAN_ELIGIBILITY_CHECK", details=f"Checked eligibility for {req.loan_type}")
    return result
