import json
import re
from typing import Dict, Any, List
from datetime import datetime
from app.core.config import settings
from app.models.models import FinancialProfile, User, AIReport

try:
    import google.generativeai as genai
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
except Exception:
    pass

class AIAdvisorService:
    @staticmethod
    def generate_explainable_advisor_report(
        profile: FinancialProfile,
        user: User,
        language: str = 'en',
        custom_question: str = None
    ) -> Dict[str, Any]:
        income = profile.monthly_income if profile and profile.monthly_income else 85000.0
        expenses = profile.monthly_expenses if profile and profile.monthly_expenses else 32000.0
        emi = profile.existing_emi if profile and profile.existing_emi else 15000.0
        debt = profile.total_debt if profile and profile.total_debt else 240000.0
        score = profile.credit_score if profile and profile.credit_score else 742
        limit = profile.credit_limit if profile and profile.credit_limit else 200000.0
        used = profile.used_credit if profile and profile.used_credit else 58000.0
        emergency = profile.emergency_fund if profile and profile.emergency_fund else 150000.0
        user_name = user.full_name if user and user.full_name else 'User'
        dti = profile.dti_ratio if profile and profile.dti_ratio else round(((emi + (used * 0.05)) / max(income, 1.0)) * 100.0, 1)
        utilization = profile.credit_utilization if profile and profile.credit_utilization else round((used / max(limit, 1.0)) * 100.0, 1)

        if settings.GEMINI_API_KEY:
            try:
                model = genai.GenerativeModel('gemini-1.5-flash')
                prompt = 'You are Credit Assistant 2.0. Analyze financial health. Return pure JSON.'
                response = model.generate_content(prompt)
                clean_str = response.text.strip()
                clean_str = re.sub(r'^```json\s*', '', clean_str)
                clean_str = re.sub(r'\s*```$', '', clean_str)
                parsed = json.loads(clean_str)
                parsed['language'] = language
                return parsed
            except Exception:
                pass

        if language == 'hi':
            summary = f'{user_name} ji, aapka credit score {score} aur DTI ratio {dti}% sthir financial health darshate hain. Credit card utilization {utilization}% hai jise 30% se kam karna zaroori hai.'
            strengths = [
                f'Monthly income (INR {income:,.0f}) mein se INR {int(income - expenses - emi):,} ki monthly bachat kshamata uplabdh hai.',
                f'Credit score {score} loan approval ke liye anukool hai.',
                f'Emergency fund INR {emergency:,.0f} lagbhag {round(emergency/max(expenses+emi, 1), 1)} mahine ke kharche surakshit karta hai.'
            ]
            weaknesses = [
                f'Credit card utilization {utilization}% hai (ideal benchmark < 30% hona chahiye).',
                f'DTI ratio {dti}% ko naye loan se pehle kam karna chahiye.'
            ]
            roadmap = [
                {'step': 1, 'title': 'Credit Card Limit Utilization ko 25% se kam karein', 'action': f'Credit card dues ko INR {int(max(0, used - (limit * 0.25))):,} kam karein.', 'timeline': 'Month 1', 'priority': 'High'},
                {'step': 2, 'title': 'Samay par EMI bhugtan aur Auto-Debit lagayein', 'action': 'NACH e-mandate activate karein taaki score 100% on-time rahe.', 'timeline': 'Month 1-2', 'priority': 'High'},
                {'step': 3, 'title': 'Chote high-interest loans ka pre-payment', 'action': 'Snowball method se high interest loan jaldi khatam karein.', 'timeline': 'Month 2-3', 'priority': 'Medium'},
                {'step': 4, 'title': 'Emergency fund ko 6 mahine tak badhayein', 'action': 'Liquid savings mein INR 50,000 extra jama karein.', 'timeline': 'Month 3-5', 'priority': 'Medium'},
                {'step': 5, 'title': 'Long-term wealth and mutual fund growth', 'action': '780+ credit score par low interest rates ka labh uthayein.', 'timeline': 'Month 6', 'priority': 'Growth'}
            ]
            timeline = '3 to 6 Months'
            xai_items = [
                {
                    'problem': f'Credit card utilization {utilization}% par hai.',
                    'reason': 'Bank aur CIBIL bureau 30% se kam card utilization ko pasand karte hain.',
                    'action': f'Used amount INR {used:,.0f} mein se INR {int(max(0, used - (limit*0.25))):,} ka payment karein.',
                    'expected_impact': '3 mahine mein credit score 15-25 points badhega.'
                }
            ]
        elif language == 'mr':
            summary = f'{user_name}, tumcha credit score {score} aani DTI praman {dti}% sthir ahe. Credit card vapar {utilization}% ahe, jo 30% peksha kami thevlyas 780+ score sahaj prapt hoil.'
            strengths = [
                f'Prati mahina INR {income:,.0f} utpannatun INR {int(income - expenses - emi):,} shillak bachat shakya ahe.',
                f'{score} credit score bank approval sathi uttam ahe.'
            ]
            weaknesses = [
                f'Credit card vapar {utilization}% ahe, to 25% var aana.'
            ]
            roadmap = [
                {'step': 1, 'title': 'Credit vapar 25% chya aat aana', 'action': f'Credit card che INR {int(max(0, used - (limit * 0.25))):,} dene kami kara.', 'timeline': 'Month 1', 'priority': 'High'},
                {'step': 2, 'title': 'Sarv EMI velvar bhara', 'action': 'Auto-debit active theva.', 'timeline': 'Month 1-2', 'priority': 'High'},
                {'step': 3, 'title': 'Emergency fund vadhva', 'action': 'Liquid saving fund vadhavnyas pradhanya dya.', 'timeline': 'Month 3-5', 'priority': 'Medium'},
                {'step': 4, 'title': 'Long term mutual fund SIP vadhva', 'action': '780+ score nantar kami vyajdaracha labh ghya.', 'timeline': 'Month 6', 'priority': 'Growth'}
            ]
            timeline = '3 to 6 Months'
            xai_items = [
                {
                    'problem': f'Credit card limit vapar {utilization}% ahe.',
                    'reason': 'Banka 30% peksha kami vapar aslelya grahakanna pasanti detat.',
                    'action': f'Credit card che INR {int(max(0, used - (limit*0.25))):,} tvarit bhara.',
                    'expected_impact': '3 mahinyat score madhe 15 te 25 gunachi vadha hoil.'
                }
            ]
        else:
            summary = f'{user_name}, your financial profile demonstrates solid baseline stability with a {score} credit score and INR {income:,.0f} monthly income. However, optimizing your {utilization}% credit utilization and {dti}% DTI ratio will rapidly propel you into prime banking tiers (>780 score).' 
            strengths = [
                f'Discretionary cashflow surplus: INR {int(income - expenses - emi):,} available monthly for wealth acceleration.',
                f'Credit baseline: {score} CIBIL score places you within standard banking approval thresholds.',
                f'Emergency liquidity: INR {emergency:,.0f} cushions approximately {round(emergency/max(expenses+emi, 1), 1)} months of essential liabilities.'
            ]
            weaknesses = [
                f'Credit utilization at {utilization}% is elevated (ideal benchmark is < 30% / INR {int(limit*0.3):,}).',
                f'Fixed obligation ratio (DTI {dti}%) limits immediate unsecured borrowing headroom.',
                'Unoptimized cash balances across standard low-yield accounts.'
            ]
            roadmap = [
                {'step': 1, 'title': 'Compress Credit Utilization Below 25%', 'action': f'Pay down INR {int(max(0, used - (limit * 0.25))):,} in revolving credit card balances.', 'timeline': 'Month 1', 'priority': 'High'},
                {'step': 2, 'title': 'Mandate Automated EMI and Bill Settlements', 'action': 'Activate NACH / e-Mandate across all loan accounts to safeguard 100% on-time repayment history.', 'timeline': 'Month 1-2', 'priority': 'High'},
                {'step': 3, 'title': 'Accelerate High-Interest Debt Amortization', 'action': 'Direct surplus into highest APR loans using Debt Avalanche strategy.', 'timeline': 'Month 2-3', 'priority': 'Medium'},
                {'step': 4, 'title': 'Bolster Emergency Liquidity Reserve', 'action': f'Grow liquid mutual fund / auto-sweep FD to cover 6 full months of obligations (INR {int((expenses+emi)*6):,}).', 'timeline': 'Month 3-5', 'priority': 'Medium'},
                {'step': 5, 'title': 'Leverage 780+ Credit Tier for Interest Arbitrage', 'action': 'Refinance or balance transfer high-rate loans to prime bank rates (saving up to 3% APR).', 'timeline': 'Month 6', 'priority': 'Growth'}
            ]
            timeline = '3 to 6 Months'
            xai_items = [
                {
                    'problem': f'Credit card utilization is at {utilization}%.',
                    'reason': 'Indian credit bureaus (CIBIL/Experian) assign 30% weight to credit utilization; ratios above 30% indicate potential credit hunger.',
                    'action': f'Reduce utilized revolving credit by INR {int(max(0, used - (limit*0.25))):,} prior to statement billing cycle.',
                    'expected_impact': 'Expected +18 to +28 credit score elevation over 90 days.'
                },
                {
                    'problem': f'Debt-to-Income (DTI) ratio is {dti}%.',
                    'reason': 'Lenders prefer a FOIR/DTI ratio below 40% when assessing home and auto loan eligibility.',
                    'action': 'Consolidate or pre-pay the smallest personal loan liability to reduce monthly EMI commitments.',
                    'expected_impact': 'Unlocks up to INR 8,50,000 in additional sanctioned loan eligibility.'
                }
            ]

        risk_analysis = {
            'credit_risk': 'Low' if score >= 750 else ('Moderate' if score >= 680 else 'High'),
            'leverage_risk': 'Low' if dti < 35 else ('Moderate' if dti < 50 else 'High'),
            'liquidity_risk': 'Low' if (emergency >= (expenses + emi)*3) else 'Moderate',
            'risk_narrative': 'Overall systemic risk is well-contained. Primary optimization driver is revolving debt compression.'
        }

        return {
            'summary': summary,
            'strengths': strengths,
            'weaknesses': weaknesses,
            'risk_analysis': risk_analysis,
            'roadmap': roadmap,
            'timeline': timeline,
            'explainable_reasoning': xai_items,
            'language': language
        }
