from datetime import datetime
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, EmailStr, Field

# --- Auth & User ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone_number: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str = Field(..., min_length=6)

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserOut(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Financial Profile ---
class FinancialProfileBase(BaseModel):
    age: int = 28
    occupation: str = "Software Professional"
    monthly_income: float = 85000.0
    monthly_expenses: float = 32000.0
    existing_emi: float = 15000.0
    total_debt: float = 240000.0
    credit_score: int = 742
    credit_limit: float = 200000.0
    used_credit: float = 58000.0
    emergency_fund: float = 150000.0
    savings_goal: float = 500000.0

class FinancialProfileCreate(FinancialProfileBase):
    pass

class FinancialProfileUpdate(BaseModel):
    age: Optional[int] = None
    occupation: Optional[str] = None
    monthly_income: Optional[float] = None
    monthly_expenses: Optional[float] = None
    existing_emi: Optional[float] = None
    total_debt: Optional[float] = None
    credit_score: Optional[int] = None
    credit_limit: Optional[float] = None
    used_credit: Optional[float] = None
    emergency_fund: Optional[float] = None
    savings_goal: Optional[float] = None

class FinancialProfileOut(FinancialProfileBase):
    id: int
    user_id: int
    dti_ratio: float
    credit_utilization: float
    disposable_income: float
    financial_health_index: float
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Credit Score & Prediction ---
class CreditHistoryOut(BaseModel):
    id: int
    score: int
    payment_history_score: float
    utilization_rate: float
    dti: float
    inquiries_count: int
    recorded_at: datetime
    simulated: bool
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class CreditPredictionRequest(BaseModel):
    months_ahead: int = 6
    simulated_payment_discipline: float = 100.0
    simulated_debt_paydown: float = 0.0
    simulated_utilization_target: Optional[float] = None
    new_inquiries: int = 0

class TrajectoryPoint(BaseModel):
    month_name: str
    month_offset: int
    projected_score: int
    confidence: float
    milestone: Optional[str] = None

class CreditPredictionOut(BaseModel):
    current_score: int
    projected_3_month: int
    projected_6_month: int
    improvement_points: int
    improvement_percentage: float
    confidence_score: float
    trajectory: List[TrajectoryPoint]
    key_drivers: List[Dict[str, Any]]
    recommendations: List[str]

# --- Calculator & EMI ---
class EMICalculationRequest(BaseModel):
    loan_type: str = "Personal Loan"
    loan_amount: float
    interest_rate: float
    tenure_months: int

class AmortizationMonth(BaseModel):
    month: int
    emi: float
    principal: float
    interest: float
    balance: float

class EMICalculationOut(BaseModel):
    loan_type: str
    loan_amount: float
    interest_rate: float
    tenure_months: int
    monthly_emi: float
    total_interest: float
    total_payment: float
    foir_percentage: float
    is_affordable: bool
    risk_level: str
    max_recommended_emi: float
    amortization_schedule: List[AmortizationMonth]

class LoanEligibilityRequest(BaseModel):
    loan_type: str = "Home Loan"
    tenure_years: int = 20
    custom_interest_rate: Optional[float] = None

class LoanEligibilityOut(BaseModel):
    loan_type: str
    max_eligible_loan: float
    safe_borrowing_limit: float
    max_affordable_emi: float
    current_dti: float
    projected_dti: float
    risk_level: str
    eligibility_status: str
    insights: List[str]
    tips: List[str]

# --- Expense Intelligence ---
class TransactionCreate(BaseModel):
    amount: float
    date: Optional[datetime] = None
    merchant: str
    category: Optional[str] = "Shopping"
    type: str = "debit"
    payment_mode: Optional[str] = "UPI"
    notes: Optional[str] = None

class TransactionOut(BaseModel):
    id: int
    user_id: int
    amount: float
    date: datetime
    merchant: str
    category: str
    type: str
    payment_mode: str
    is_flagged_fraud: bool
    fraud_reason: Optional[str] = None
    source: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CategoryExpenseSummary(BaseModel):
    category: str
    total_amount: float
    percentage: float
    transaction_count: int

class ExpenseIntelligenceOut(BaseModel):
    total_monthly_spend: float
    total_monthly_income: float
    net_savings: float
    savings_rate_percentage: float
    highest_expense_category: str
    category_breakdown: List[CategoryExpenseSummary]
    spending_spikes: List[str]
    ai_recommendations: List[str]

# --- OCR Center ---
class OCRParsedTransaction(BaseModel):
    date: str
    merchant: str
    amount: float
    category: str
    type: str

class OCRUploadResponse(BaseModel):
    document_id: int
    filename: str
    document_type: str
    status: str
    total_extracted: int
    extracted_transactions: List[OCRParsedTransaction]
    raw_preview_text: str

# --- Savings Planner ---
class SavingsGoalCreate(BaseModel):
    title: str
    category: str = "Emergency Fund"
    target_amount: float
    current_amount: float = 0.0
    target_date: datetime

class SavingsGoalUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    target_date: Optional[datetime] = None
    is_completed: Optional[bool] = None

class SavingsGoalOut(BaseModel):
    id: int
    user_id: int
    title: str
    category: str
    target_amount: float
    current_amount: float
    progress_percentage: float
    target_date: datetime
    monthly_target: float
    weekly_target: float
    daily_target: float
    is_completed: bool
    days_remaining: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI Advisor & XAI ---
class XAIExplainableItem(BaseModel):
    problem: str
    reason: str
    action: str
    expected_impact: str

class AIAdvisorRequest(BaseModel):
    language: str = "en"
    custom_question: Optional[str] = None

class AIAdvisorOut(BaseModel):
    id: int
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    risk_analysis: Dict[str, Any]
    roadmap: List[Dict[str, Any]]
    timeline: str
    explainable_reasoning: List[XAIExplainableItem]
    language: str
    created_at: datetime

# --- Fraud Engine ---
class FraudAlertOut(BaseModel):
    id: int
    user_id: int
    transaction_id: Optional[int] = None
    alert_type: str
    severity: str
    description: str
    suggested_action: str
    is_resolved: bool
    resolution_note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class FraudResolveRequest(BaseModel):
    resolution_note: str

# --- Investment Readiness ---
class InvestmentReadinessOut(BaseModel):
    readiness_score: int
    readiness_level: str
    emergency_fund_months: float
    debt_stability_rating: str
    recommended_allocation: Dict[str, float]
    actionable_steps: List[str]
    disclaimer: str

# --- Family Dashboard ---
class FamilyMemberCreate(BaseModel):
    name: str
    relation: str
    monthly_income: float = 0.0
    monthly_expense: float = 0.0
    credit_score: int = 700
    contribution_to_savings: float = 0.0

class FamilyMemberOut(BaseModel):
    id: int
    user_id: int
    name: str
    relation: str
    monthly_income: float
    monthly_expense: float
    credit_score: int
    contribution_to_savings: float
    created_at: datetime

    class Config:
        from_attributes = True

class FamilyHouseholdAnalytics(BaseModel):
    total_household_income: float
    total_household_expenses: float
    total_household_savings: float
    average_credit_score: float
    members: List[FamilyMemberOut]

# --- WhatsApp Reminder ---
class WhatsAppReminderRequest(BaseModel):
    reminder_type: str
    phone_number: str
    custom_note: Optional[str] = None

class WhatsAppReminderOut(BaseModel):
    status: str
    dispatched_at: datetime
    recipient: str
    template_name: str
    rendered_message: str
    meta_cloud_payload: Dict[str, Any]

# --- Security Center & Audit ---
class AuditLogOut(BaseModel):
    id: int
    action: str
    ip_address: str
    user_agent: str
    details: Optional[str] = None
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True

class SecuritySessionOut(BaseModel):
    id: int
    device_name: str
    ip_address: str
    location: str
    is_active: bool
    last_active: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class SecurityCenterOut(BaseModel):
    security_score: int
    mfa_enabled: bool
    active_sessions_count: int
    failed_logins_last_24h: int
    threat_level: str
    active_sessions: List[SecuritySessionOut]
    recent_audit_logs: List[AuditLogOut]
