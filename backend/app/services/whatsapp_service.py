from typing import Dict, Any
from datetime import datetime
from app.core.config import settings

class WhatsAppService:
    @staticmethod
    def generate_reminder_payload(
        reminder_type: str,
        phone_number: str,
        user_name: str,
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        templates = {
            "EMI_DUE": {
                "template": "credit_assistant_emi_alert_v1",
                "text": f"Namaste {user_name}! ?? Reminder: Your upcoming EMI of ?{data.get('emi_amount', '15,000'):,} for {data.get('loan_title', 'HDFC Bank Home Loan')} is due on {data.get('due_date', '5th of this month')}. Maintain sufficient balance to protect your {data.get('credit_score', '742')} CIBIL score."
            },
            "CREDIT_CARD_DUE": {
                "template": "credit_assistant_cc_utilization_v1",
                "text": f"Namaste {user_name}! ?? Your credit card statement due is ?{data.get('cc_due', '18,400'):,}. Paying in full before the due date keeps your credit utilization at a healthy {data.get('utilization', '28%')}."
            },
            "FRAUD_ALERT": {
                "template": "credit_assistant_security_shield_v1",
                "text": f"?? SECURITY ALERT: A suspicious transaction of ?{data.get('amount', '12,500'):,} at '{data.get('merchant', 'International Merchant')}' was flagged by SecureShield. Tap to review: https://creditassistant.ai/security"
            },
            "MONTHLY_REPORT": {
                "template": "credit_assistant_monthly_digest_v1",
                "text": f"?? Your {data.get('month', 'September')} Financial Health Report is ready! Health Index: {data.get('health_score', '78.5')}/100. Credit Score: {data.get('credit_score', '742')}. View your AI Roadmap: https://creditassistant.ai/dashboard"
            },
            "SAVINGS_NUDGE": {
                "template": "credit_assistant_savings_goal_v1",
                "text": f"?? Great progress {user_name}! You are {data.get('progress', '65%')} towards your '{data.get('goal_name', 'Emergency Fund')}' goal. Save ?{data.get('daily_target', '250'):,} today to stay on track!"
            }
        }
        
        selected = templates.get(reminder_type, templates["MONTHLY_REPORT"])
        
        meta_payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phone_number,
            "type": "template",
            "template": {
                "name": selected["template"],
                "language": {"code": "en_US"},
                "components": [
                    {
                        "type": "body",
                        "parameters": [{"type": "text", "text": str(v)} for v in data.values()]
                    }
                ]
            }
        }
        
        return {
            "status": "DISPATCHED_SANDBOX",
            "dispatched_at": datetime.utcnow(),
            "recipient": phone_number,
            "template_name": selected["template"],
            "rendered_message": selected["text"],
            "meta_cloud_payload": meta_payload
        }
