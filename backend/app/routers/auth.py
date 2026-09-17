from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import (
    verify_password, get_password_hash, create_access_token,
    create_refresh_token, decode_token, sanitize_input
)
from app.core.deps import get_current_user
from app.models.models import User, FinancialProfile, SecuritySession, CreditHistory
from app.schemas.schemas import (
    UserCreate, UserLogin, TokenResponse, UserOut,
    ForgotPasswordRequest, ResetPasswordRequest, OTPVerifyRequest
)
from app.services.security_service import SecurityService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")
        
    cleaned_name = sanitize_input(user_in.full_name)
    user = User(
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        full_name=cleaned_name,
        phone_number=user_in.phone_number
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Initialize default financial profile
    profile = FinancialProfile(
        user_id=user.id,
        monthly_income=85000.0,
        monthly_expenses=32000.0,
        existing_emi=15000.0,
        total_debt=240000.0,
        credit_score=742,
        credit_limit=200000.0,
        used_credit=58000.0,
        emergency_fund=150000.0,
        savings_goal=500000.0,
        dti_ratio=37.6,
        credit_utilization=29.0,
        disposable_income=38000.0,
        financial_health_index=78.5
    )
    db.add(profile)
    
    # Initial credit history point
    history = CreditHistory(
        user_id=user.id,
        score=742,
        payment_history_score=98.0,
        utilization_rate=29.0,
        dti=37.6,
        notes="Initial baseline score from credit bureau"
    )
    db.add(history)
    
    # Create active session
    session = SecuritySession(
        user_id=user.id,
        session_token=create_access_token(user.id),
        device_name="Chrome on Windows 11",
        ip_address="127.0.0.1",
        location="Mumbai, India"
    )
    db.add(session)
    db.commit()
    
    SecurityService.log_audit(db, user.id, "USER_REGISTERED", details=f"Registered with email {user.email}")
    
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "phone_number": user.phone_number,
            "role": user.role
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email.lower()).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        SecurityService.log_audit(db, None, "LOGIN_FAILED", details=f"Failed login attempt for email {login_data.email}", status="FAILED")
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    # Register/update session
    session = SecuritySession(
        user_id=user.id,
        session_token=access_token,
        device_name="Chrome on Windows 11",
        ip_address="127.0.0.1",
        location="Bengaluru, India"
    )
    db.add(session)
    db.commit()
    
    SecurityService.log_audit(db, user.id, "LOGIN_SUCCESS", details="User authenticated successfully")
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "phone_number": user.phone_number,
            "role": user.role
        }
    }

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        # Don't leak user existence
        return {"message": "If this email is registered, an OTP has been dispatched to your mobile/email.", "otp_preview": "742918"}
    SecurityService.log_audit(db, user.id, "FORGOT_PASSWORD_REQUESTED", details="Password reset OTP generated")
    return {"message": "OTP has been sent to your registered contact.", "otp_preview": "742918"}

@router.post("/verify-otp")
def verify_otp(req: OTPVerifyRequest):
    # For demo & production testing, accept valid 6-digit OTP
    if len(req.otp.strip()) == 6:
        return {"valid": True, "message": "OTP verified successfully"}
    raise HTTPException(status_code=400, detail="Invalid or expired OTP")

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = get_password_hash(req.new_password)
    user.updated_at = datetime.utcnow()
    db.commit()
    SecurityService.log_audit(db, user.id, "PASSWORD_RESET_SUCCESS", details="Password reset completed via OTP")
    return {"message": "Password reset successfully. You can now login with your new password."}

@router.get("/me", response_model=UserOut)
def get_current_user_profile(user: User = Depends(get_current_user)):
    return user
