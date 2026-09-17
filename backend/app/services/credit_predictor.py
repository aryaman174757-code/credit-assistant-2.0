import math
from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.models.models import FinancialProfile

class CreditPredictorService:
    @staticmethod
    def predict_score_trajectory(
        profile: FinancialProfile,
        months_ahead: int = 6,
        payment_discipline: float = 100.0,
        debt_paydown: float = 0.0,
        simulated_utilization_target: float = None,
        new_inquiries: int = 0
    ) -> Dict[str, Any]:
        current_score = profile.credit_score if profile and profile.credit_score else 742
        current_utilization = profile.credit_utilization if profile and profile.credit_utilization else 29.0
        income = profile.monthly_income if profile and profile.monthly_income else 85000.0
        limit = profile.credit_limit if profile and profile.credit_limit else 200000.0
        
        target_util = simulated_utilization_target if simulated_utilization_target is not None else current_utilization
        
        # 1. Payment discipline impact: up to +25 points over 6 months if 100%, negative if < 80%
        payment_impact_per_month = 4.0 * (payment_discipline / 100.0) if payment_discipline >= 95.0 else -8.0 * ((100.0 - payment_discipline) / 20.0)
        
        # 2. Utilization impact
        util_diff = current_utilization - target_util
        util_impact_total = (util_diff * 0.8) if util_diff > 0 else (util_diff * 1.2)
        
        # 3. Debt Paydown impact
        debt_paydown_gain = min(35.0, (debt_paydown / max(income, 10000.0)) * 15.0)
        
        # 4. Inquiries penalty: -7 points per hard inquiry
        inquiry_penalty = new_inquiries * 7.0
        
        trajectory: List[Dict[str, Any]] = []
        now = datetime.utcnow()
        month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        
        projected = float(current_score)
        
        for m in range(1, months_ahead + 1):
            future_date = now + timedelta(days=30 * m)
            m_name = f"{month_names[future_date.month - 1]} {future_date.year}"
            
            step_gain = payment_impact_per_month + (util_impact_total / months_ahead) + (debt_paydown_gain / months_ahead) - (inquiry_penalty / months_ahead)
            projected += step_gain
            clamped = max(300, min(900, int(round(projected))))
            
            milestone = None
            if clamped >= 750 and current_score < 750:
                milestone = "Unlocked Prime Interest Rates (750+)"
            elif clamped >= 800 and current_score < 800:
                milestone = "Elite Credit Tier (800+)"
            elif m == 3:
                milestone = "Quarterly Review Milestone"
            elif m == 6:
                milestone = "6-Month Target Projected"
                
            confidence = max(0.75, 0.96 - (m * 0.03))
            
            trajectory.append({
                "month_name": m_name,
                "month_offset": m,
                "projected_score": clamped,
                "confidence": round(confidence, 2),
                "milestone": milestone
            })
            
        proj_3 = trajectory[min(2, len(trajectory)-1)]["projected_score"]
        proj_6 = trajectory[-1]["projected_score"]
        pts_diff = proj_6 - current_score
        pct_diff = round((pts_diff / current_score) * 100.0, 2)
        
        key_drivers = [
            {"factor": "Payment Consistency", "impact": f"+{int(payment_impact_per_month * months_ahead)} pts", "status": "Positive" if payment_discipline >= 95 else "Negative"},
            {"factor": "Credit Utilization Optimization", "impact": f"{'+' if util_impact_total >= 0 else ''}{int(util_impact_total)} pts", "status": "Positive" if util_impact_total >= 0 else "Needs Attention"},
            {"factor": "Debt Reduction Velocity", "impact": f"+{int(debt_paydown_gain)} pts", "status": "Positive" if debt_paydown > 0 else "Neutral"},
            {"factor": "Credit Inquiry Load", "impact": f"-{int(inquiry_penalty)} pts", "status": "Good" if new_inquiries == 0 else "High Impact"}
        ]
        
        recs = [
            "Maintain 100% on-time payments across all EMIs and credit cards.",
            f"Keep revolving credit card utilization strictly under 30% (ideally < ?{int(limit * 0.3):,}).",
            "Avoid applying for multiple credit cards or personal loans in a short window.",
            "Prioritize clearing high-interest revolving credit to rapidly boost score."
        ]
        
        return {
            "current_score": current_score,
            "projected_3_month": proj_3,
            "projected_6_month": proj_6,
            "improvement_points": pts_diff,
            "improvement_percentage": pct_diff,
            "confidence_score": 0.94,
            "trajectory": trajectory,
            "key_drivers": key_drivers,
            "recommendations": recs
        }
