import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_auth_and_protected_routes():
    # 1. Login
    res = client.post("/api/auth/login", json={
        "email": "demo@creditassistant.ai",
        "password": "password123"
    })
    assert res.status_code == 200
    data = res.json()
    token = data["access_token"]
    assert token is not None
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get profile
    res_prof = client.get("/api/profile/", headers=headers)
    assert res_prof.status_code == 200
    assert res_prof.json()["credit_score"] >= 300

    # 3. EMI Calculation
    res_emi = client.post("/api/calculator/emi", json={
        "loan_type": "Personal Loan",
        "loan_amount": 500000,
        "interest_rate": 11.5,
        "tenure_months": 36
    }, headers=headers)
    assert res_emi.status_code == 200
    assert res_emi.json()["monthly_emi"] > 0

    # 4. Loan Eligibility
    res_elig = client.post("/api/calculator/loan-eligibility", json={
        "loan_type": "Home Loan",
        "tenure_years": 20
    }, headers=headers)
    assert res_elig.status_code == 200
    assert res_elig.json()["max_eligible_loan"] > 0

    # 5. AI Advisor
    res_ai = client.post("/api/ai/analyze", json={"language": "en"}, headers=headers)
    assert res_ai.status_code == 200
    assert "roadmap" in res_ai.json()

    # 6. Credit Prediction
    res_pred = client.post("/api/credit/predict", json={
        "months_ahead": 6,
        "simulated_payment_discipline": 100.0,
        "debt_paydown": 25000.0
    }, headers=headers)
    assert res_pred.status_code == 200
    assert len(res_pred.json()["trajectory"]) == 6

    # 7. Investment Readiness
    res_inv = client.get("/api/investment/readiness", headers=headers)
    assert res_inv.status_code == 200
    assert 0 <= res_inv.json()["readiness_score"] <= 100

    # 8. Family Household
    res_fam = client.get("/api/family/household", headers=headers)
    assert res_fam.status_code == 200
    assert "total_household_income" in res_fam.json()

    # 9. Security Center
    res_sec = client.get("/api/security/center", headers=headers)
    assert res_sec.status_code == 200
    assert "security_score" in res_sec.json()
