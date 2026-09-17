from typing import Dict, Any, List
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import AuditLog, SecuritySession, User

class SecurityService:
    @staticmethod
    def log_audit(
        db: Session,
        user_id: int,
        action: str,
        ip_address: str = "127.0.0.1",
        user_agent: str = "Mozilla/5.0",
        details: str = None,
        status: str = "SUCCESS"
    ) -> AuditLog:
        log = AuditLog(
            user_id=user_id,
            action=action,
            ip_address=ip_address,
            user_agent=user_agent,
            details=details,
            status=status,
            timestamp=datetime.utcnow()
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    @staticmethod
    def calculate_security_score(user: User, active_sessions: List[SecuritySession], failed_logins: int) -> Dict[str, Any]:
        score = 100
        if not (user and user.mfa_enabled):
            score -= 20
        if len(active_sessions) > 3:
            score -= 10
        if failed_logins > 0:
            score -= min(30, failed_logins * 10)
            
        score = max(20, min(100, score))
        if score >= 85:
            threat = "Low Risk (Secure)"
        elif score >= 65:
            threat = "Guarded (Recommended 2FA Activation)"
        else:
            threat = "Elevated Risk (Action Required)"
            
        return {
            "security_score": score,
            "mfa_enabled": bool(user.mfa_enabled) if user else False,
            "active_sessions_count": len(active_sessions),
            "failed_logins_last_24h": failed_logins,
            "threat_level": threat
        }
