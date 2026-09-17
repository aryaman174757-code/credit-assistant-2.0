from typing import Dict, Any, List, Optional
from datetime import datetime
from app.models.models import Transaction, FraudAlert

class FraudEngineService:
    @staticmethod
    def inspect_transaction(
        transaction: Transaction,
        recent_transactions: List[Transaction],
        monthly_income: float = 85000.0
    ) -> Optional[Dict[str, Any]]:
        debit_txns = [t for t in recent_transactions if t.type == "debit" and t.id != transaction.id]
        if debit_txns:
            avg_amt = sum(t.amount for t in debit_txns) / len(debit_txns)
            if transaction.amount > max(20000.0, avg_amt * 3.5):
                return {
                    "alert_type": "Spending Spike Anomaly",
                    "severity": "High",
                    "description": f"Transaction of ?{transaction.amount:,.2f} at '{transaction.merchant}' is over 3.5x your average expense of ?{avg_amt:,.2f}.",
                    "suggested_action": "Verify if you authorized this high-value payment. If unauthorized, lock your card/UPI immediately."
                }
                
        for t in recent_transactions:
            if t.id != transaction.id and t.merchant.lower() == transaction.merchant.lower() and abs(t.amount - transaction.amount) < 0.01:
                return {
                    "alert_type": "Duplicate Payment Detected",
                    "severity": "Medium",
                    "description": f"Identical charge of ?{transaction.amount:,.2f} detected at '{transaction.merchant}' twice in a short window.",
                    "suggested_action": "Check bank statement for double debit and raise chargeback with merchant support."
                }
                
        risky_keywords = ["crypto", "forex", "casino", "betting", "international wire", "darknet", "unknown pos"]
        for kw in risky_keywords:
            if kw in transaction.merchant.lower():
                return {
                    "alert_type": "High-Risk Merchant Category",
                    "severity": "High",
                    "description": f"Suspicious or unverified high-risk merchant pattern detected: '{transaction.merchant}'.",
                    "suggested_action": "Review transaction details and report to cyber cell/bank helpline (1930) if unrecognized."
                }
                
        return None
