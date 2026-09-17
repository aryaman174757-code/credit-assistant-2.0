from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, FamilyMember, FinancialProfile
from app.schemas.schemas import FamilyMemberCreate, FamilyMemberOut, FamilyHouseholdAnalytics
from app.services.security_service import SecurityService

router = APIRouter(prefix="/family", tags=["Family Financial Dashboard"])

@router.get("/household", response_model=FamilyHouseholdAnalytics)
def get_household_analytics(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    members = db.query(FamilyMember).filter(FamilyMember.user_id == user.id).all()
    if not members:
        seeds = [
            ("Pooja Sharma", "Spouse", 65000.0, 24000.0, 765, 20000.0),
            ("Aarav Sharma", "Child - Education Fund", 0.0, 8000.0, 0, 5000.0),
            ("Ramesh Sharma", "Parent - Retiree Pension", 28000.0, 12000.0, 720, 5000.0)
        ]
        for name, rel, inc, exp, cs, sav in seeds:
            fm = FamilyMember(
                user_id=user.id,
                name=name,
                relation=rel,
                monthly_income=inc,
                monthly_expense=exp,
                credit_score=cs,
                contribution_to_savings=sav
            )
            db.add(fm)
        db.commit()
        members = db.query(FamilyMember).filter(FamilyMember.user_id == user.id).all()
        
    user_inc = profile.monthly_income if profile else 85000.0
    user_exp = profile.monthly_expenses if profile else 32000.0
    user_cs = profile.credit_score if profile else 742
    
    total_inc = user_inc + sum(m.monthly_income for m in members)
    total_exp = user_exp + sum(m.monthly_expense for m in members)
    total_sav = max(0.0, total_inc - total_exp)
    
    adult_scores = [m.credit_score for m in members if m.credit_score > 300] + [user_cs]
    avg_score = round(sum(adult_scores) / max(len(adult_scores), 1), 1)
    
    return {
        "total_household_income": total_inc,
        "total_household_expenses": total_exp,
        "total_household_savings": total_sav,
        "average_credit_score": avg_score,
        "members": members
    }

@router.post("/members", response_model=FamilyMemberOut)
def add_family_member(data: FamilyMemberCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fm = FamilyMember(
        user_id=user.id,
        name=data.name,
        relation=data.relation,
        monthly_income=data.monthly_income,
        monthly_expense=data.monthly_expense,
        credit_score=data.credit_score,
        contribution_to_savings=data.contribution_to_savings
    )
    db.add(fm)
    db.commit()
    db.refresh(fm)
    SecurityService.log_audit(db, user.id, "FAMILY_MEMBER_ADDED", details=f"Added {data.name} ({data.relation})")
    return fm

@router.delete("/members/{member_id}")
def delete_family_member(member_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fm = db.query(FamilyMember).filter(FamilyMember.id == member_id, FamilyMember.user_id == user.id).first()
    if not fm:
        raise HTTPException(status_code=404, detail="Family member not found")
    db.delete(fm)
    db.commit()
    return {"status": "success", "message": "Family member removed"}
