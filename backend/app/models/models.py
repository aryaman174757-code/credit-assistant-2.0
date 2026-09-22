from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    role = Column(String(50), default="user")
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("FinancialProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    credit_histories = relationship("CreditHistory", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    savings_goals = relationship("SavingsGoal", back_populates="user", cascade="all, delete-orphan")
    loan_calculations = relationship("LoanCalculation", back_populates="user", cascade="all, delete-orphan")
    ai_reports = relationship("AIReport", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("DocumentRecord", back_populates="user", cascade="all, delete-orphan")
    fraud_alerts = relationship("FraudAlert", back_populates="user", cascade="all, delete-orphan")
    family_members = relationship("FamilyMember", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")
    security_sessions = relationship("SecuritySession", back_populates="user", cascade="all, delete-orphan")


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    age = Column(Integer, default=28)
    occupation = Column(String(100), default="Software Professional")
    monthly_income = Column(Float, default=85000.0)
    monthly_expenses = Column(Float, default=32000.0)
    existing_emi = Column(Float, default=15000.0)
    total_debt = Column(Float, default=240000.0)
    credit_score = Column(Integer, default=742)
    credit_limit = Column(Float, default=200000.0)
    used_credit = Column(Float, default=58000.0)
    emergency_fund = Column(Float, default=150000.0)
    savings_goal = Column(Float, default=500000.0)
    
    dti_ratio = Column(Float, default=37.6)
    credit_utilization = Column(Float, default=29.0)
    disposable_income = Column(Float, default=38000.0)
    financial_health_index = Column(Float, default=78.5)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class CreditHistory(Base):
    __tablename__ = "credit_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False)
    payment_history_score = Column(Float, default=98.0)
    utilization_rate = Column(Float, default=29.0)
    dti = Column(Float, default=37.6)
    inquiries_count = Column(Integer, default=1)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    simulated = Column(Boolean, default=False)
    notes = Column(String(255), nullable=True)

    user = relationship("User", back_populates="credit_histories")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    merchant = Column(String(255), nullable=False)
    category = Column(String(100), default="Shopping")
    type = Column(String(20), default="debit")
    payment_mode = Column(String(50), default="UPI")
    is_flagged_fraud = Column(Boolean, default=False)
    fraud_reason = Column(String(255), nullable=True)
    source = Column(String(50), default="manual")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")


class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="Emergency Fund")
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    target_date = Column(DateTime, nullable=False)
    monthly_target = Column(Float, default=0.0)
    weekly_target = Column(Float, default=0.0)
    daily_target = Column(Float, default=0.0)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="savings_goals")


class LoanCalculation(Base):
    __tablename__ = "loan_calculations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    loan_type = Column(String(50), default="Home Loan")
    loan_amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    tenure_months = Column(Integer, nullable=False)
    monthly_emi = Column(Float, nullable=False)
    total_interest = Column(Float, nullable=False)
    total_payment = Column(Float, nullable=False)
    foir_percentage = Column(Float, default=0.0)
    is_affordable = Column(Boolean, default=True)
    risk_level = Column(String(50), default="Low Risk")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="loan_calculations")


class AIReport(Base):
    __tablename__ = "ai_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    summary = Column(Text, nullable=False)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    risk_analysis = Column(JSON, default=dict)
    roadmap = Column(JSON, default=list)
    timeline = Column(String(255), default="3-6 Months")
    explainable_reasoning = Column(JSON, default=list)
    language = Column(String(10), default="en")
    raw_prompt_sanitized = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ai_reports")


class DocumentRecord(Base):
    __tablename__ = "document_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(Integer, default=0)
    document_type = Column(String(50), default="Bank Statement")
    status = Column(String(50), default="Processed")
    extracted_transactions_count = Column(Integer, default=0)
    parsed_metadata = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="documents")


class FraudAlert(Base):
    __tablename__ = "fraud_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    transaction_id = Column(Integer, nullable=True)
    alert_type = Column(String(100), nullable=False)
    severity = Column(String(20), default="Medium")
    description = Column(Text, nullable=False)
    suggested_action = Column(Text, nullable=False)
    is_resolved = Column(Boolean, default=False)
    resolution_note = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="fraud_alerts")


class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    relation = Column(String(50), nullable=False)
    monthly_income = Column(Float, default=0.0)
    monthly_expense = Column(Float, default=0.0)
    credit_score = Column(Integer, default=700)
    contribution_to_savings = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="family_members")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    action = Column(String(100), nullable=False)
    ip_address = Column(String(100), default="127.0.0.1")
    user_agent = Column(String(255), default="Mozilla/5.0")
    details = Column(Text, nullable=True)
    status = Column(String(20), default="SUCCESS")
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")


class SecuritySession(Base):
    __tablename__ = "security_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_token = Column(String(500), index=True, nullable=False)
    device_name = Column(String(100), default="Chrome on Windows 11")
    ip_address = Column(String(100), default="127.0.0.1")
    location = Column(String(100), default="Mumbai, India")
    is_active = Column(Boolean, default=True)
    last_active = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="security_sessions")
