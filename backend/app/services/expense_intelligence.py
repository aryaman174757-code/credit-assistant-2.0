from typing import Dict, Any, List
from datetime import datetime
from collections import defaultdict
from app.models.models import Transaction, FinancialProfile

CATEGORY_KEYWORDS = {
    "Food & Dining": ["swiggy", "zomato", "mcdonald", "starbucks", "restaurant", "cafe", "domino", "blinkit", "zepto", "instamart", "supermarket", "groceries"],
    "Rent & Housing": ["rent", "landlord", "maintenance", "nobroker", "housing", "society", "pg"],
    "Utilities & Bills": ["bescom", "mseb", "electricity", "jio", "airtel", "vi", "water", "gas", "cylinder", "wifi", "broadband", "act fibernet"],
    "Shopping & Lifestyle": ["amazon", "flipkart", "myntra", "zara", "h&m", "retail", "mall", "nykaa", "ajio", "reliancedigital", "croma"],
    "Travel & Commute": ["uber", "ola", "metro", "irctc", "makemytrip", "indigo", "petrol", "fuel", "hpcl", "bpcl", "ioc"],
    "Healthcare & Medical": ["apollo", "pharmeasy", "1mg", "hospital", "clinic", "pharmacy", "doctor", "diagnostic", "max healthcare"],
    "Entertainment & Leisure": ["netflix", "spotify", "bookmyshow", "pvr", "inox", "hotstar", "amazon prime", "steam", "gaming"],
    "Investments & Savings": ["zerodha", "groww", "kuvera", "sip", "mutual fund", "ppf", "nps", "fd", "rd", "gold"],
    "Education & Learning": ["coursera", "udemy", "school", "college", "fees", "books", "tuition"]
}

class ExpenseIntelligenceService:
    @staticmethod
    def categorize_merchant(merchant_name: str) -> str:
        merchant_lower = merchant_name.lower()
        for cat, keywords in CATEGORY_KEYWORDS.items():
            for kw in keywords:
                if kw in merchant_lower:
                    return cat
        return "Miscellaneous"

    @staticmethod
    def analyze_expenses(transactions: List[Transaction], profile: FinancialProfile) -> Dict[str, Any]:
        monthly_income = profile.monthly_income if profile else 85000.0
        
        category_totals = defaultdict(float)
        category_counts = defaultdict(int)
        total_spend = 0.0
        
        for t in transactions:
            if t.type.lower() == "debit":
                category_totals[t.category] += t.amount
                category_counts[t.category] += 1
                total_spend += t.amount
                
        if total_spend == 0:
            baseline_expenses = profile.monthly_expenses if profile else 32000.0
            category_totals = {
                "Rent & Housing": baseline_expenses * 0.40,
                "Food & Dining": baseline_expenses * 0.22,
                "Utilities & Bills": baseline_expenses * 0.12,
                "Shopping & Lifestyle": baseline_expenses * 0.14,
                "Travel & Commute": baseline_expenses * 0.08,
                "Healthcare & Medical": baseline_expenses * 0.04
            }
            category_counts = {k: 4 for k in category_totals.keys()}
            total_spend = baseline_expenses
            
        breakdown = []
        highest_cat = "None"
        highest_val = -1.0
        
        for cat, amt in category_totals.items():
            pct = round((amt / max(total_spend, 1.0)) * 100.0, 1)
            breakdown.append({
                "category": cat,
                "total_amount": round(amt, 2),
                "percentage": pct,
                "transaction_count": category_counts[cat]
            })
            if amt > highest_val:
                highest_val = amt
                highest_cat = cat
                
        breakdown.sort(key=lambda x: x["total_amount"], reverse=True)
        
        net_savings = max(0.0, monthly_income - total_spend - (profile.existing_emi if profile else 15000.0))
        savings_rate = round((net_savings / max(monthly_income, 1.0)) * 100.0, 1)
        
        spikes = []
        if highest_val > (total_spend * 0.45):
            spikes.append(f"{highest_cat} accounts for over 45% of your total monthly outflow.")
        if total_spend > (monthly_income * 0.70):
            spikes.append("Total discretionary spending exceeded 70% of monthly take-home salary.")
            
        recs = [
            f"Cap {highest_cat} expenses to save approximately ?{int(highest_val * 0.15):,} next month.",
            f"Your current savings rate is {savings_rate}%. Target 20%+ by automating mutual fund SIP on salary day.",
            "Track recurring subscriptions across OTT and entertainment to trim unused services."
        ]
        
        return {
            "total_monthly_spend": round(total_spend, 2),
            "total_monthly_income": round(monthly_income, 2),
            "net_savings": round(net_savings, 2),
            "savings_rate_percentage": savings_rate,
            "highest_expense_category": highest_cat,
            "category_breakdown": breakdown,
            "spending_spikes": spikes if spikes else ["No severe spending spikes detected this cycle."],
            "ai_recommendations": recs
        }
