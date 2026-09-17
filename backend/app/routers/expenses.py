from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, FinancialProfile, Transaction, FraudAlert
from app.schemas.schemas import TransactionCreate, TransactionOut, ExpenseIntelligenceOut
from app.services.expense_intelligence import ExpenseIntelligenceService
from app.services.fraud_engine import FraudEngineService
from app.services.security_service import SecurityService

router = APIRouter(prefix="/expenses", tags=["Expense Intelligence"])

@router.get("/", response_model=List[TransactionOut])
def list_transactions(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    txns = db.query(Transaction).filter(Transaction.user_id == user.id).order_by(Transaction.date.desc()).all()
    if not txns:
        # Seed realistic initial transactions
        seeds = [
            ("Swiggy Bangalore", 540.0, "Food & Dining", "debit", "UPI"),
            ("Amazon India Retail", 3499.0, "Shopping & Lifestyle", "debit", "Credit Card"),
            ("BESCOM Power Supply", 1820.0, "Utilities & Bills", "debit", "NetBanking"),
            ("Uber Mobility Trip", 380.0, "Travel & Commute", "debit", "UPI"),
            ("Apollo Pharmacy Dues", 750.0, "Healthcare & Medical", "debit", "UPI"),
            ("Netflix Entertainment", 649.0, "Entertainment & Leisure", "debit", "Credit Card"),
            ("House Rent NEFT Transfer", 18000.0, "Rent & Housing", "debit", "NetBanking"),
            ("Tech Salary Credit", 85000.0, "Investments & Savings", "credit", "NetBanking")
        ]
        for merch, amt, cat, t_type, p_mode in seeds:
            t = Transaction(
                user_id=user.id,
                merchant=merch,
                amount=amt,
                category=cat,
                type=t_type,
                payment_mode=p_mode,
                source="manual",
                date=datetime.utcnow()
            )
            db.add(t)
        db.commit()
        txns = db.query(Transaction).filter(Transaction.user_id == user.id).order_by(Transaction.date.desc()).all()
    return txns

@router.post("/", response_model=TransactionOut)
def create_transaction(
    txn_in: TransactionCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    auto_cat = txn_in.category or ExpenseIntelligenceService.categorize_merchant(txn_in.merchant)
    
    txn = Transaction(
        user_id=user.id,
        amount=txn_in.amount,
        merchant=txn_in.merchant,
        category=auto_cat,
        type=txn_in.type,
        payment_mode=txn_in.payment_mode or "UPI",
        notes=txn_in.notes,
        source="manual",
        date=txn_in.date or datetime.utcnow()
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    
    # Run Fraud Engine Inspection
    recent_txns = db.query(Transaction).filter(Transaction.user_id == user.id).order_by(Transaction.date.desc()).limit(20).all()
    fraud_finding = FraudEngineService.inspect_transaction(txn, recent_txns, profile.monthly_income if profile else 85000.0)
    
    if fraud_finding:
        txn.is_flagged_fraud = True
        txn.fraud_reason = fraud_finding["description"]
        alert = FraudAlert(
            user_id=user.id,
            transaction_id=txn.id,
            alert_type=fraud_finding["alert_type"],
            severity=fraud_finding["severity"],
            description=fraud_finding["description"],
            suggested_action=fraud_finding["suggested_action"]
        )
        db.add(alert)
        db.commit()
        db.refresh(txn)
        
    SecurityService.log_audit(db, user.id, "TRANSACTION_RECORDED", details=f"Added transaction of ?{txn.amount:,.2f} at {txn.merchant}")
    return txn

@router.get("/intelligence", response_model=ExpenseIntelligenceOut)
def get_expense_intelligence(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    txns = db.query(Transaction).filter(Transaction.user_id == user.id).all()
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    return ExpenseIntelligenceService.analyze_expenses(txns, profile)

@router.delete("/{txn_id}")
def delete_transaction(txn_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    txn = db.query(Transaction).filter(Transaction.id == txn_id, Transaction.user_id == user.id).first()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(txn)
    db.commit()
    return {"status": "success", "message": "Transaction deleted"}
