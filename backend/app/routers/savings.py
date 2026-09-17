from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, SavingsGoal
from app.schemas.schemas import SavingsGoalCreate, SavingsGoalUpdate, SavingsGoalOut
from app.services.security_service import SecurityService

router = APIRouter(prefix="/savings", tags=["Savings Planner"])

def enrich_goal(g: SavingsGoal) -> dict:
    remaining_amt = max(0.0, g.target_amount - g.current_amount)
    progress_pct = round((g.current_amount / max(g.target_amount, 1.0)) * 100.0, 1)
    
    now = datetime.utcnow()
    diff_days = max(1, (g.target_date - now).days)
    diff_months = max(1.0, diff_days / 30.0)
    diff_weeks = max(1.0, diff_days / 7.0)
    
    monthly = round(remaining_amt / diff_months, 2)
    weekly = round(remaining_amt / diff_weeks, 2)
    daily = round(remaining_amt / float(diff_days), 2)
    
    return {
        "id": g.id,
        "user_id": g.user_id,
        "title": g.title,
        "category": g.category,
        "target_amount": g.target_amount,
        "current_amount": g.current_amount,
        "progress_percentage": progress_pct,
        "target_date": g.target_date,
        "monthly_target": monthly,
        "weekly_target": weekly,
        "daily_target": daily,
        "is_completed": g.is_completed or (g.current_amount >= g.target_amount),
        "days_remaining": diff_days,
        "created_at": g.created_at
    }

@router.get("/", response_model=List[SavingsGoalOut])
def list_savings_goals(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    goals = db.query(SavingsGoal).filter(SavingsGoal.user_id == user.id).all()
    if not goals:
        # Seed initial goals
        now = datetime.utcnow()
        seeds = [
            ("Emergency Reserve (6 Months)", "Emergency Fund", 250000.0, 150000.0, now + timedelta(days=180)),
            ("Electric Vehicle Downpayment", "Vehicle", 150000.0, 60000.0, now + timedelta(days=240)),
            ("Annual International Vacation", "Vacation", 120000.0, 45000.0, now + timedelta(days=300))
        ]
        for title, cat, target, curr, t_date in seeds:
            g = SavingsGoal(
                user_id=user.id,
                title=title,
                category=cat,
                target_amount=target,
                current_amount=curr,
                target_date=t_date
            )
            db.add(g)
        db.commit()
        goals = db.query(SavingsGoal).filter(SavingsGoal.user_id == user.id).all()
        
    return [enrich_goal(g) for g in goals]

@router.post("/", response_model=SavingsGoalOut)
def create_goal(
    goal_in: SavingsGoalCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = SavingsGoal(
        user_id=user.id,
        title=goal_in.title,
        category=goal_in.category,
        target_amount=goal_in.target_amount,
        current_amount=goal_in.current_amount,
        target_date=goal_in.target_date
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    
    SecurityService.log_audit(db, user.id, "SAVINGS_GOAL_CREATED", details=f"Created goal '{goal.title}' for ?{goal.target_amount:,.0f}")
    return enrich_goal(goal)

@router.put("/{goal_id}", response_model=SavingsGoalOut)
def update_goal(
    goal_id: int,
    data: SavingsGoalUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id, SavingsGoal.user_id == user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    for k, v in data.dict(exclude_unset=True).items():
        setattr(goal, k, v)
        
    goal.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(goal)
    return enrich_goal(goal)

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id, SavingsGoal.user_id == user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"status": "success", "message": "Goal removed"}
