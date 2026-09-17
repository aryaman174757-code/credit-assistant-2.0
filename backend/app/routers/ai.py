from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, FinancialProfile, AIReport
from app.schemas.schemas import AIAdvisorRequest, AIAdvisorOut
from app.services.ai_advisor import AIAdvisorService
from app.services.security_service import SecurityService

router = APIRouter(prefix="/ai", tags=["AI Advisor"])

@router.post("/analyze", response_model=AIAdvisorOut)
def analyze_finances(
    req: AIAdvisorRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    if not profile:
        profile = FinancialProfile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    ai_result = AIAdvisorService.generate_explainable_advisor_report(
        profile=profile,
        user=user,
        language=req.language,
        custom_question=req.custom_question
    )
    
    report = AIReport(
        user_id=user.id,
        summary=ai_result["summary"],
        strengths=ai_result["strengths"],
        weaknesses=ai_result["weaknesses"],
        risk_analysis=ai_result["risk_analysis"],
        roadmap=ai_result["roadmap"],
        timeline=ai_result["timeline"],
        explainable_reasoning=ai_result["explainable_reasoning"],
        language=ai_result.get("language", "en")
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    SecurityService.log_audit(db, user.id, "AI_DIAGNOSIS_GENERATED", details=f"Generated AI roadmap in language: {req.language}")
    
    return {
        "id": report.id,
        "summary": report.summary,
        "strengths": report.strengths,
        "weaknesses": report.weaknesses,
        "risk_analysis": report.risk_analysis,
        "roadmap": report.roadmap,
        "timeline": report.timeline,
        "explainable_reasoning": report.explainable_reasoning,
        "language": report.language,
        "created_at": report.created_at
    }

@router.get("/latest", response_model=AIAdvisorOut)
def get_latest_report(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = db.query(AIReport).filter(AIReport.user_id == user.id).order_by(AIReport.created_at.desc()).first()
    if not report:
        # Generate initial report on the fly
        profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
        if not profile:
            profile = FinancialProfile(user_id=user.id)
            db.add(profile)
            db.commit()
            db.refresh(profile)
            
        ai_result = AIAdvisorService.generate_explainable_advisor_report(profile=profile, user=user, language="en")
        report = AIReport(
            user_id=user.id,
            summary=ai_result["summary"],
            strengths=ai_result["strengths"],
            weaknesses=ai_result["weaknesses"],
            risk_analysis=ai_result["risk_analysis"],
            roadmap=ai_result["roadmap"],
            timeline=ai_result["timeline"],
            explainable_reasoning=ai_result["explainable_reasoning"],
            language="en"
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        
    return {
        "id": report.id,
        "summary": report.summary,
        "strengths": report.strengths,
        "weaknesses": report.weaknesses,
        "risk_analysis": report.risk_analysis,
        "roadmap": report.roadmap,
        "timeline": report.timeline,
        "explainable_reasoning": report.explainable_reasoning,
        "language": report.language,
        "created_at": report.created_at
    }
