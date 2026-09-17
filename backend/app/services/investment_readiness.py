from typing import Dict, Any, List
from app.models.models import FinancialProfile

class InvestmentReadinessService:
    @staticmethod
    def calculate_readiness(profile: FinancialProfile) -> Dict[str, Any]:
        income = profile.monthly_income if profile else 85000.0
        expenses = profile.monthly_expenses if profile else 32000.0
        emi = profile.existing_emi if profile else 15000.0
        emergency_fund = profile.emergency_fund if profile else 150000.0
        credit_score = profile.credit_score if profile else 742
        dti = profile.dti_ratio if profile else 37.6
        utilization = profile.credit_utilization if profile else 29.0
        
        monthly_burn = expenses + emi
        months_covered = round(emergency_fund / max(monthly_burn, 1.0), 1)
        
        score = 0
        if months_covered >= 6.0:
            score += 30
        elif months_covered >= 3.0:
            score += 20
        elif months_covered >= 1.0:
            score += 10
        else:
            score += 2
            
        if dti <= 30.0:
            score += 25
        elif dti <= 40.0:
            score += 18
        elif dti <= 50.0:
            score += 10
        else:
            score += 4
            
        if credit_score >= 750:
            score += 20
        elif credit_score >= 700:
            score += 15
        elif credit_score >= 650:
            score += 8
        else:
            score += 2
            
        if utilization <= 30.0:
            score += 15
        elif utilization <= 50.0:
            score += 8
        else:
            score += 2
            
        disposable = income - monthly_burn
        if disposable >= (income * 0.25):
            score += 10
        elif disposable >= (income * 0.10):
            score += 6
        else:
            score += 2
            
        score = min(100, max(0, score))
        
        if score >= 80:
            level = "Wealth Accelerator (Prime Ready)"
            allocation = {"Equity Index / Mutual Funds": 60.0, "Fixed Income / Debt / FD": 20.0, "Sovereign Gold / Commodities": 10.0, "Liquid Emergency Buffer": 10.0}
            steps = [
                "Maximize Tax-Saving ELSS / PPF contributions for Section 80C benefits.",
                "Automate monthly SIPs in low-cost Nifty 50 and Midcap Index Funds.",
                "Review term life insurance (20x annual income) and comprehensive family health cover."
            ]
        elif score >= 60:
            level = "Moderately Prepared (Building Foundations)"
            allocation = {"Emergency Fund & FDs": 35.0, "Diversified Mutual Funds": 45.0, "Gold / Safe Assets": 10.0, "Cash Liquidity": 10.0}
            steps = [
                f"Top up emergency fund to achieve full 6-month buffer (current: {months_covered} months).",
                "Begin with conservative balanced advantage / hybrid funds before aggressive equities.",
                "Pay down any credit card balance carrying >15% interest."
            ]
        else:
            level = "Foundation Phase (Debt & Emergency Priority)"
            allocation = {"High-Yield Liquid Savings / FD": 70.0, "Low-Risk Debt Funds": 20.0, "Micro-SIPs": 10.0}
            steps = [
                "Build at least 3 months of emergency expenses before investing in volatile markets.",
                "Focus on reducing high-cost personal loans and credit card revolving dues.",
                "Enforce a 50/30/20 budget framework strictly."
            ]
            
        return {
            "readiness_score": score,
            "readiness_level": level,
            "emergency_fund_months": months_covered,
            "debt_stability_rating": "Strong" if dti < 35 else ("Moderate" if dti < 50 else "Strained"),
            "recommended_allocation": allocation,
            "actionable_steps": steps,
            "disclaimer": "Educational financial health analysis only. Does not constitute SEBI-registered investment advice or equity solicitation."
        }
