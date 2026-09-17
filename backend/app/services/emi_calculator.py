import math
from typing import Dict, Any, List

class EMICalculatorService:
    @staticmethod
    def calculate_emi(
        loan_amount: float,
        interest_rate: float,
        tenure_months: int,
        monthly_income: float = 85000.0,
        existing_emi: float = 15000.0,
        loan_type: str = "Personal Loan"
    ) -> Dict[str, Any]:
        r = (interest_rate / 12.0) / 100.0
        n = tenure_months
        
        if r == 0:
            emi = loan_amount / n
            total_payment = loan_amount
            total_interest = 0.0
        else:
            emi = (loan_amount * r * ((1.0 + r) ** n)) / (((1.0 + r) ** n) - 1.0)
            total_payment = emi * n
            total_interest = total_payment - loan_amount
            
        total_monthly_obligations = existing_emi + emi
        foir = (total_monthly_obligations / max(monthly_income, 1.0)) * 100.0
        max_rec_emi = max(0.0, (monthly_income * 0.40) - existing_emi)
        is_affordable = foir <= 50.0
        
        if foir <= 35.0:
            risk_level = "Low Risk (Comfortable)"
        elif foir <= 50.0:
            risk_level = "Moderate Risk (Manageable)"
        else:
            risk_level = "High Risk (Overleveraged)"
            
        schedule: List[Dict[str, Any]] = []
        balance = loan_amount
        for m in range(1, min(n + 1, 61)):
            interest_part = balance * r
            principal_part = emi - interest_part
            balance = max(0.0, balance - principal_part)
            schedule.append({
                "month": m,
                "emi": round(emi, 2),
                "principal": round(principal_part, 2),
                "interest": round(interest_part, 2),
                "balance": round(balance, 2)
            })
            
        return {
            "loan_type": loan_type,
            "loan_amount": round(loan_amount, 2),
            "interest_rate": interest_rate,
            "tenure_months": tenure_months,
            "monthly_emi": round(emi, 2),
            "total_interest": round(total_interest, 2),
            "total_payment": round(total_payment, 2),
            "foir_percentage": round(foir, 2),
            "is_affordable": is_affordable,
            "risk_level": risk_level,
            "max_recommended_emi": round(max_rec_emi, 2),
            "amortization_schedule": schedule
        }

    @staticmethod
    def estimate_loan_eligibility(
        monthly_income: float,
        existing_emi: float,
        credit_score: int,
        loan_type: str = "Home Loan",
        tenure_years: int = 20,
        custom_interest_rate: float = None
    ) -> Dict[str, Any]:
        interest_rates = {
            "Home Loan": 8.5,
            "Personal Loan": 11.5,
            "Auto Loan": 9.2,
            "Education Loan": 9.5
        }
        rate = custom_interest_rate if custom_interest_rate else interest_rates.get(loan_type, 9.0)
        tenure_months = tenure_years * 12
        if loan_type == "Personal Loan":
            tenure_months = min(tenure_months, 60)
        elif loan_type == "Auto Loan":
            tenure_months = min(tenure_months, 84)
            
        if credit_score >= 780:
            max_foir_limit = 0.55
        elif credit_score >= 720:
            max_foir_limit = 0.50
        elif credit_score >= 650:
            max_foir_limit = 0.40
        else:
            max_foir_limit = 0.30
            
        max_affordable_emi = max(0.0, (monthly_income * max_foir_limit) - existing_emi)
        r = (rate / 12.0) / 100.0
        n = tenure_months
        
        if r > 0 and n > 0:
            max_eligible_loan = (max_affordable_emi * (((1.0 + r) ** n) - 1.0)) / (r * ((1.0 + r) ** n))
        else:
            max_eligible_loan = max_affordable_emi * n
            
        safe_borrowing_limit = max_eligible_loan * 0.80
        current_dti = round((existing_emi / max(monthly_income, 1.0)) * 100.0, 2)
        projected_dti = round(((existing_emi + max_affordable_emi) / max(monthly_income, 1.0)) * 100.0, 2)
        
        if credit_score >= 750 and current_dti < 35.0:
            risk_level = "Low Risk"
            eligibility_status = "Highly Eligible (Prime Tier)"
        elif credit_score >= 680 and current_dti < 45.0:
            risk_level = "Moderate Risk"
            eligibility_status = "Conditionally Eligible"
        else:
            risk_level = "High Risk"
            eligibility_status = "High Risk (Approval Requires Guarantor/Collateral)"
            
        insights = [
            f"Based on your ?{monthly_income:,.0f} income, Indian lenders permit an aggregate EMI ceiling of ?{int(monthly_income * max_foir_limit):,}.",
            f"With existing EMIs of ?{existing_emi:,.0f}, your net available monthly borrowing capacity is ?{int(max_affordable_emi):,}.",
            f"Your CIBIL score of {credit_score} places you in the '{eligibility_status}' bracket."
        ]
        
        tips = [
            "Opt for a longer tenure to reduce monthly EMI burden and improve approval odds.",
            "Pre-close small revolving credit card loans to free up more FOIR capacity.",
            "Maintain a healthy co-borrower profile (spouse/parent) to enhance sanction limit by up to 40%."
        ]
        
        return {
            "loan_type": loan_type,
            "max_eligible_loan": round(max_eligible_loan, 2),
            "safe_borrowing_limit": round(safe_borrowing_limit, 2),
            "max_affordable_emi": round(max_affordable_emi, 2),
            "current_dti": current_dti,
            "projected_dti": projected_dti,
            "risk_level": risk_level,
            "eligibility_status": eligibility_status,
            "insights": insights,
            "tips": tips
        }
