import axios from "axios";
import { FinancialProfile, User } from "../types";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://127.0.0.1:8000/api"
    : "/api");

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const DEFAULT_DEMO_USER: User = {
  id: 1,
  email: "demo@creditassistant.ai",
  full_name: "Rajesh Sharma",
  phone_number: "+91 98765 43210",
  role: "admin",
  is_active: true,
  is_verified: true,
};

export const MOCK_PROFILE: FinancialProfile & Record<string, any> = {
  id: 1,
  user_id: 1,
  age: 29,
  occupation: "Senior Product Engineer",
  monthly_income: 95000.0,
  monthly_expenses: 34000.0,
  existing_emi: 16500.0,
  total_debt: 280000.0,
  credit_score: 758,
  credit_limit: 250000.0,
  used_credit: 54000.0,
  emergency_fund: 210000.0,
  savings_goal: 600000.0,
  dti_ratio: 34.8,
  credit_utilization: 21.6,
  disposable_income: 44500.0,
  financial_health_index: 84.2,
  updated_at: new Date().toISOString(),
  // Legacy & calculation aliases
  current_cibil_score: 758,
  monthly_fixed_obligations: 16500.0,
  total_credit_limit: 250000.0,
  total_credit_utilized: 54000.0,
  total_existing_loan_balance: 280000.0,
  on_time_payment_percentage: 98.5,
  credit_history_length_months: 48,
  hard_inquiries_last_6m: 1,
  calculated_dti_ratio: 34.8,
  calculated_foir_ratio: 34.8,
  calculated_credit_utilization: 21.6,
};

// In-memory mock storage for session mutations when running offline or on GitHub Pages
let mockTransactions = [
  { id: 1, user_id: 1, merchant: "Swiggy India", category: "Food & Dining", amount: 649, date: "2026-09-18", type: "debit", payment_mode: "UPI", is_flagged_fraud: false, source: "Statement" },
  { id: 2, user_id: 1, merchant: "Amazon India", category: "Shopping", amount: 3499, date: "2026-09-15", type: "debit", payment_mode: "Credit Card", is_flagged_fraud: false, source: "Statement" },
  { id: 3, user_id: 1, merchant: "Uber Rides", category: "Transportation", amount: 420, date: "2026-09-12", type: "debit", payment_mode: "UPI", is_flagged_fraud: false, source: "Statement" },
  { id: 4, user_id: 1, merchant: "Blinkit Quick Commerce", category: "Groceries", amount: 1180, date: "2026-09-10", type: "debit", payment_mode: "UPI", is_flagged_fraud: false, source: "Statement" },
  { id: 5, user_id: 1, merchant: "HDFC Home Loan EMI", category: "Housing & Loans", amount: 16500, date: "2026-09-05", type: "debit", payment_mode: "NACH", is_flagged_fraud: false, source: "NACH" },
];

let mockSavings = [
  { id: 1, user_id: 1, title: "Emergency Reserve (6 Mo)", category: "Emergency", target_amount: 210000, current_amount: 155000, progress_percentage: 73.8, target_date: "2026-12-31", monthly_target: 18000, weekly_target: 4500, daily_target: 600, is_completed: false, days_remaining: 100 },
  { id: 2, user_id: 1, title: "Sovereign Gold Bond SIP", category: "Gold", target_amount: 80000, current_amount: 62000, progress_percentage: 77.5, target_date: "2026-11-15", monthly_target: 9000, weekly_target: 2250, daily_target: 300, is_completed: false, days_remaining: 54 },
];

let mockFamily = [
  { id: 1, user_id: 1, name: "Rajesh Sharma (Self)", relation: "Primary", monthly_income: 95000, monthly_expense: 34000, credit_score: 758, contribution_to_savings: 30000, created_at: "2026-01-10" },
  { id: 2, user_id: 1, name: "Pooja Sharma (Spouse)", relation: "Spouse", monthly_income: 65000, monthly_expense: 22000, credit_score: 770, contribution_to_savings: 20000, created_at: "2026-01-10" },
];

let mockAlerts = [
  { id: 1, user_id: 1, alert_type: "Spending Spike Anomaly", severity: "Medium", description: "Transaction of ₹18,500 at 'Croma Electronics' is 3.8x your average retail expense.", suggested_action: "Verify if this high-value appliance purchase was authorized.", is_resolved: false, created_at: "2026-09-18T10:30:00Z" },
  { id: 2, user_id: 1, alert_type: "Location Jump Detected", severity: "Low", description: "Login session initiated from IP in Singapore while prior transaction was from Mumbai.", suggested_action: "Enable Multi-Factor Authentication (MFA) to lock account access.", is_resolved: false, created_at: "2026-09-16T14:20:00Z" }
];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url || "";
    const method = error.config?.method?.toLowerCase() || "get";
    const status = error.response?.status;

    // Trigger fallback if backend is offline, unreachable, network error, OR static host 404/502/503
    const isOfflineOrNotFound =
      !error.response ||
      error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      error.message?.includes("Network Error") ||
      status === 404 ||
      status === 502 ||
      status === 503;

    if (isOfflineOrNotFound) {
      console.info(`[Credit Assistant API Fallback] Serving local response for: ${method.toUpperCase()} ${url}`);

      // Safe parse request payload
      let reqBody: any = {};
      if (error.config?.data) {
        try {
          reqBody = typeof error.config.data === "string" ? JSON.parse(error.config.data) : error.config.data;
        } catch {
          reqBody = {};
        }
      }

      // --- 1. Authentication Endpoints ---
      if (url.includes("/auth/login")) {
        const email = reqBody.email || "demo@creditassistant.ai";
        const isDemo = email.toLowerCase().includes("demo");
        const user: User = isDemo
          ? DEFAULT_DEMO_USER
          : {
              id: 2,
              email: email.toLowerCase(),
              full_name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
              phone_number: "+91 98765 00000",
              role: "user",
              is_active: true,
              is_verified: true,
            };

        localStorage.setItem("user", JSON.stringify(user));
        return {
          data: {
            access_token: "mock-jwt-token-access-2026",
            refresh_token: "mock-jwt-token-refresh-2026",
            token_type: "bearer",
            user,
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/auth/register")) {
        const newUser: User = {
          id: Date.now(),
          email: (reqBody.email || "newuser@creditassistant.ai").toLowerCase(),
          full_name: reqBody.full_name || "New FinTech User",
          phone_number: reqBody.phone_number || "+91 98765 43210",
          role: "user",
          is_active: true,
          is_verified: true,
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        return {
          data: {
            access_token: "mock-jwt-token-access-2026",
            refresh_token: "mock-jwt-token-refresh-2026",
            token_type: "bearer",
            user: newUser,
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/auth/me")) {
        const saved = localStorage.getItem("user");
        const activeUser: User = saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
        return {
          data: activeUser,
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/auth/forgot-password")) {
        return {
          data: {
            message: "OTP has been sent to your registered contact.",
            otp_preview: "742918",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/auth/verify-otp")) {
        return {
          data: { valid: true, message: "OTP verified successfully" },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/auth/reset-password")) {
        return {
          data: { message: "Password reset successfully. You can now login with your new password." },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      // --- 2. Financial Profile ---
      if (url.includes("/profile")) {
        if (method === "post") {
          Object.assign(MOCK_PROFILE, reqBody, { updated_at: new Date().toISOString() });
        }
        return {
          data: MOCK_PROFILE,
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      // --- 3. Credit Score & Prediction ---
      if (url.includes("/credit/history")) {
        const now = Date.now();
        const historyData = [
          { id: 1, score: 715, payment_history_score: 96.5, utilization_rate: 32.0, dti: 36.0, inquiries_count: 1, recorded_at: new Date(now - 150 * 86400000).toISOString(), simulated: false, notes: "CIBIL Bureau Update" },
          { id: 2, score: 725, payment_history_score: 97.0, utilization_rate: 30.0, dti: 35.5, inquiries_count: 1, recorded_at: new Date(now - 120 * 86400000).toISOString(), simulated: false, notes: "CIBIL Bureau Update" },
          { id: 3, score: 735, payment_history_score: 97.5, utilization_rate: 28.0, dti: 35.0, inquiries_count: 0, recorded_at: new Date(now - 90 * 86400000).toISOString(), simulated: false, notes: "CIBIL Bureau Update" },
          { id: 4, score: 742, payment_history_score: 98.0, utilization_rate: 25.0, dti: 34.5, inquiries_count: 0, recorded_at: new Date(now - 60 * 86400000).toISOString(), simulated: false, notes: "CIBIL Bureau Update" },
          { id: 5, score: 750, payment_history_score: 98.2, utilization_rate: 23.5, dti: 34.8, inquiries_count: 0, recorded_at: new Date(now - 30 * 86400000).toISOString(), simulated: false, notes: "CIBIL Bureau Update" },
          { id: 6, score: 758, payment_history_score: 98.5, utilization_rate: 21.6, dti: 34.8, inquiries_count: 0, recorded_at: new Date().toISOString(), simulated: false, notes: "CIBIL Bureau Update" },
        ];
        return { data: historyData, status: 200, statusText: "OK", headers: {}, config: error.config };
      }

      if (url.includes("/credit/predict")) {
        const discipline = Number(reqBody.simulated_payment_discipline || 100);
        const debtPaydown = Number(reqBody.simulated_debt_paydown || 25000);
        const targetUtil = Number(reqBody.simulated_utilization_target || 15);
        const inquiries = Number(reqBody.new_inquiries || 0);

        const scoreDelta = Math.round(
          (discipline >= 100 ? 18 : discipline >= 95 ? 8 : -20) +
          Math.min(22, (debtPaydown / 10000) * 4) +
          (targetUtil <= 20 ? 12 : -5) -
          (inquiries * 7)
        );

        const currentScore = MOCK_PROFILE.credit_score || 758;
        const projected6m = Math.min(880, Math.max(300, currentScore + scoreDelta));
        const projected3m = Math.min(880, Math.max(300, currentScore + Math.round(scoreDelta * 0.55)));
        const ptsGain = Math.max(0, projected6m - currentScore);

        return {
          data: {
            current_score: currentScore,
            projected_3_month: projected3m,
            projected_6_month: projected6m,
            improvement_points: ptsGain,
            improvement_percentage: Number(((ptsGain / currentScore) * 100).toFixed(1)),
            confidence_score: 94.0,
            trajectory: [
              { month_name: "Current", month_offset: 0, projected_score: currentScore, confidence: 98.0, milestone: "Baseline" },
              { month_name: "Month 1", month_offset: 1, projected_score: currentScore + Math.round(ptsGain * 0.18), confidence: 96.0, milestone: "Payment Cycle" },
              { month_name: "Month 2", month_offset: 2, projected_score: currentScore + Math.round(ptsGain * 0.38), confidence: 94.0, milestone: "Utilization Paydown" },
              { month_name: "Month 3", month_offset: 3, projected_score: projected3m, confidence: 92.0, milestone: "Prime Threshold" },
              { month_name: "Month 4", month_offset: 4, projected_score: currentScore + Math.round(ptsGain * 0.72), confidence: 90.0, milestone: "Sustained Discipline" },
              { month_name: "Month 5", month_offset: 5, projected_score: currentScore + Math.round(ptsGain * 0.88), confidence: 88.0, milestone: "Pre-Approved Offers" },
              { month_name: "Month 6", month_offset: 6, projected_score: projected6m, confidence: 85.0, milestone: "Prime Target Reached" },
            ],
            key_drivers: [
              { factor: "Card Balance Paydown (<20%)", impact: "+24 Pts", status: "High Priority" },
              { factor: "Zero Late Payments (6 Months)", impact: "+15 Pts", status: "Critical Impact" },
              { factor: "No Hard Inquiries Added", impact: "+8 Pts", status: "Positive" },
            ],
            recommendations: [
              "Maintain revolving credit card utilization below 20% before statement dates.",
              "Enable automated NACH e-mandate for all ongoing EMIs 5 days prior to due dates.",
              "Avoid opening multiple consumer durable loans or retail cards within the next 6 months.",
            ],
            // Legacy / alternate compatibility
            forecast_3_months: [
              { month: "Month 1", baseline: currentScore, optimistic: currentScore + 8, conservative: currentScore - 2 },
              { month: "Month 2", baseline: currentScore + 6, optimistic: currentScore + 15, conservative: currentScore },
              { month: "Month 3", baseline: projected3m, optimistic: projected3m + 8, conservative: projected3m - 5 },
            ],
            forecast_6_months: [
              { month: "Month 1", baseline: currentScore, optimistic: currentScore + 8, conservative: currentScore - 2 },
              { month: "Month 2", baseline: currentScore + 6, optimistic: currentScore + 15, conservative: currentScore },
              { month: "Month 3", baseline: projected3m, optimistic: projected3m + 8, conservative: projected3m - 5 },
              { month: "Month 4", baseline: projected3m + 8, optimistic: projected3m + 16, conservative: projected3m },
              { month: "Month 5", baseline: projected3m + 15, optimistic: projected3m + 25, conservative: projected3m + 5 },
              { month: "Month 6", baseline: projected6m, optimistic: projected6m + 12, conservative: projected6m - 4 },
            ],
            key_levers: [
              { lever: "Credit Utilization (<30%)", impact: "+24 pts", status: "Optimal (21.6%)" },
              { lever: "On-Time Repayments", impact: "+15 pts", status: "Excellent (98.5%)" },
              { lever: "Credit Mix & Age", impact: "+8 pts", status: "Healthy (4 yrs)" },
            ],
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      // --- 4. Explainable AI Advisor (XAI) ---
      if (url.includes("/ai/analyze") || url.includes("/ai/generate-report") || url.includes("/ai/latest-report")) {
        const lang = reqBody.language || "en";
        const isHindi = lang === "hi";
        const isMarathi = lang === "mr";

        const summaryText = isHindi
          ? "आपकी वित्तीय स्थिति 758 सिबिल स्कोर और 34.8% FOIR के साथ बहुत मजबूत है। क्रेडिट कार्ड उपयोग 20% से कम रखने से शीर्ष बैंकों में सबसे कम ब्याज दर उपलब्ध होगी।"
          : isMarathi
          ? "आपली आर्थिक स्थिती 758 CIBIL स्कोअर आणि 34.8% FOIR सह अतिशय भक्कम आहे. क्रेडिट कार्ड वापर 20% खाली ठेवल्यास सर्वात कमी व्याजदर प्राप्त होईल."
          : "Your financial profile exhibits a healthy CIBIL score of 758 and disciplined FOIR of 34.8%. Keeping credit utilization below 20% will unlock lowest prime interest rate slabs across Tier-1 banks.";

        return {
          data: {
            id: 1,
            language: lang,
            health_score: 758,
            summary: summaryText,
            timeline: "3 - 6 Months",
            overall_verdict: "Prime Tier Financial Health",
            strengths: [
              "Disciplined revolving credit utilization maintained at 21.6%",
              "Exceptional on-time payment track record of 98.5% over 48 months",
              "Healthy liquid emergency fund covering 6.2 months of fixed obligations",
            ],
            weaknesses: [
              "Credit history consists predominantly of unsecured cards; could benefit from secured mix",
              "Slight FOIR jump if taking any discretionary personal loans above ₹5,00,000",
            ],
            risk_analysis: {
              credit_risk: "LOW",
              leverage_risk: "MODERATE",
              liquidity_risk: "MINIMAL",
              risk_narrative: "Overall borrower profile is low-risk with prime eligibility for home and car loans.",
            },
            roadmap: [
              { step: 1, title: "Automate NACH Mandates", action: "Set up auto-debit for all credit lines 5 days prior to due dates.", timeline: "Immediate", priority: "High" },
              { step: 2, title: "Optimize Card Balances", action: "Pay down high-utilization cards before statement generation date.", timeline: "30 Days", priority: "High" },
              { step: 3, title: "Request Credit Limit Increase", action: "Ask existing bank for soft-inquiry limit hike to lower utilization.", timeline: "60 Days", priority: "Medium" },
              { step: 4, title: "Consolidate High-Cost Debt", action: "Transfer high-interest balances to low-rate options.", timeline: "90 Days", priority: "Medium" },
              { step: 5, title: "Unlock Prime Lending Slab", action: "Apply for 8.4% home loan balance transfer with Tier-1 bank.", timeline: "180 Days", priority: "Low" },
            ],
            explainable_reasoning: [
              {
                problem: "Credit Utilization",
                reason: "Revolving balance of ₹54,000 on a limit of ₹2,50,000 (21.6%).",
                action: "Keep utilization strictly under 20% before monthly bill generation.",
                expected_impact: "+18 Pts CIBIL boost within 2 billing cycles.",
              },
              {
                problem: "FOIR Debt Burden",
                reason: "Monthly fixed obligations of ₹16,500 on ₹95,000 earnings (34.8%).",
                action: "Maintain FOIR below 40% when evaluating home loan additions.",
                expected_impact: "Immediate approval on pre-sanctioned credit lines.",
              },
              {
                problem: "Repayment Consistency",
                reason: "98.5% clean payment track record over last 4 years.",
                action: "Maintain NACH e-mandate autopay on all bank accounts.",
                expected_impact: "Super-Prime 800+ tier entry within 6 months.",
              },
            ],
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      // --- 5. Calculators & Affordability ---
      if (url.includes("/calculator/emi")) {
        const principal = Number(reqBody.loan_amount || 3500000);
        const rate = Number(reqBody.interest_rate || 8.5);
        const tenure = Number(reqBody.tenure_months || 240);
        const r = rate / 12 / 100;
        const n = tenure;
        const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - principal;
        const monthlyIncome = 95000;
        const existingEmi = 16500;
        const foir = ((existingEmi + emi) / monthlyIncome) * 100;

        return {
          data: {
            loan_type: reqBody.loan_type || "Home Loan",
            loan_amount: principal,
            interest_rate: rate,
            tenure_months: tenure,
            monthly_emi: Math.round(emi),
            total_interest: Math.round(totalInterest),
            total_payment: Math.round(totalPayment),
            foir_percentage: Number(foir.toFixed(1)),
            is_affordable: foir <= 50,
            risk_level: foir <= 35 ? "Low Risk (Comfortable)" : foir <= 50 ? "Moderate Risk (Manageable)" : "High Risk (Overleveraged)",
            status: foir <= 50 ? "APPROVED" : "REVIEW_REQUIRED",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/calculator/loan-eligibility")) {
        return {
          data: {
            loan_type: reqBody.loan_type || "Home Loan",
            monthly_income: 95000,
            existing_emi: 16500,
            credit_score: 758,
            max_eligible_emi: 31000,
            max_eligible_loan: 4200000,
            foir_limit_percentage: 50.0,
            current_foir: 34.8,
            verdict: "Eligible for Prime Interest Rates (8.4% - 8.75% Slabs)",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      // --- 6. Expenses Intelligence ---
      if (url.includes("/expenses/intelligence")) {
        return {
          data: {
            total_monthly_spend: 34000,
            total_monthly_income: 95000,
            net_savings: 44500,
            savings_rate_percentage: 46.8,
            highest_expense_category: "Housing & Loans",
            category_breakdown: [
              { category: "Housing & Loans", total_amount: 16500, percentage: 48.5, transaction_count: 1 },
              { category: "Food & Dining", total_amount: 6800, percentage: 20.0, transaction_count: 8 },
              { category: "Shopping & Retail", total_amount: 4500, percentage: 13.2, transaction_count: 4 },
              { category: "Transportation", total_amount: 3200, percentage: 9.4, transaction_count: 6 },
              { category: "Utilities & Bills", total_amount: 3000, percentage: 8.9, transaction_count: 3 },
            ],
            spending_spikes: ["Weekend dining exceeded weekly budget by 18% on Sep 14"],
            ai_recommendations: [
              "Switch food delivery orders to dining discounts to save ₹1,800/month.",
              "Use credit card with 5% utility cashback for monthly electricity and broadband.",
            ],
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/expenses")) {
        if (method === "post") {
          const newTxn = {
            id: Date.now(),
            user_id: 1,
            merchant: reqBody.merchant || "Merchant",
            category: reqBody.category || "General",
            amount: Number(reqBody.amount || 500),
            date: reqBody.date || new Date().toISOString().split("T")[0],
            type: reqBody.type || "debit",
            payment_mode: reqBody.payment_mode || "UPI",
            is_flagged_fraud: false,
            source: "Manual",
          };
          mockTransactions.unshift(newTxn);
          return { data: newTxn, status: 201, statusText: "Created", headers: {}, config: error.config };
        }
        if (method === "delete") {
          const parts = url.split("/");
          const id = Number(parts[parts.length - 1]);
          mockTransactions = mockTransactions.filter((t) => t.id !== id);
          return { data: { success: true }, status: 200, statusText: "OK", headers: {}, config: error.config };
        }
        return { data: mockTransactions, status: 200, statusText: "OK", headers: {}, config: error.config };
      }

      // --- 7. Savings Goals ---
      if (url.includes("/savings")) {
        if (method === "post") {
          const newGoal = {
            id: Date.now(),
            user_id: 1,
            title: reqBody.title || "New Goal",
            category: reqBody.category || "Savings",
            target_amount: Number(reqBody.target_amount || 50000),
            current_amount: Number(reqBody.current_amount || 0),
            progress_percentage: Number((((reqBody.current_amount || 0) / (reqBody.target_amount || 50000)) * 100).toFixed(1)),
            target_date: reqBody.target_date || "2026-12-31",
            monthly_target: Math.round(Number(reqBody.target_amount || 50000) / 6),
            weekly_target: Math.round(Number(reqBody.target_amount || 50000) / 24),
            daily_target: Math.round(Number(reqBody.target_amount || 50000) / 180),
            is_completed: false,
            days_remaining: 90,
          };
          mockSavings.push(newGoal);
          return { data: newGoal, status: 201, statusText: "Created", headers: {}, config: error.config };
        }
        return { data: mockSavings, status: 200, statusText: "OK", headers: {}, config: error.config };
      }

      // --- 8. Fraud Monitoring ---
      if (url.includes("/fraud")) {
        if (url.includes("/resolve")) {
          const parts = url.split("/");
          const alertId = Number(parts[parts.indexOf("alerts") + 1]);
          const alertItem = mockAlerts.find((a) => a.id === alertId);
          if (alertItem) alertItem.is_resolved = true;
          return { data: alertItem || { id: alertId, is_resolved: true }, status: 200, statusText: "OK", headers: {}, config: error.config };
        }
        return { data: mockAlerts, status: 200, statusText: "OK", headers: {}, config: error.config };
      }

      // --- 9. Investment Readiness ---
      if (url.includes("/investment")) {
        return {
          data: {
            readiness_score: 84,
            readiness_level: "INVESTMENT_READY",
            emergency_fund_months: 6.2,
            debt_stability_rating: "Prime Stable (FOIR <35%)",
            recommended_allocation: {
              "Nifty 50 Index Fund": 40,
              "Flexi-cap Equity SIP": 25,
              "Sovereign Gold Bonds (SGB)": 15,
              "Arbitrage / Liquid Reserve": 20,
            },
            actionable_steps: [
              "Maintain current liquid emergency reserve of ₹2,10,000 in high-yield sweep account.",
              "Increase automated monthly mutual fund SIP by 10% following annual salary appraisal.",
              "Max out Section 80C and 80D tax-saving deductions before financial year close.",
            ],
            disclaimer: "AI algorithmic projections for educational assessment. Consult a SEBI-registered advisor.",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      // --- 10. Family Dashboard ---
      if (url.includes("/family")) {
        if (url.includes("/members") && method === "post") {
          const newMem = {
            id: Date.now(),
            user_id: 1,
            name: reqBody.name || "Family Member",
            relation: reqBody.relation || "Member",
            monthly_income: Number(reqBody.monthly_income || 0),
            monthly_expense: Number(reqBody.monthly_expense || 0),
            credit_score: Number(reqBody.credit_score || 720),
            contribution_to_savings: Number(reqBody.contribution_to_savings || 0),
            created_at: new Date().toISOString(),
          };
          mockFamily.push(newMem);
          return { data: newMem, status: 201, statusText: "Created", headers: {}, config: error.config };
        }
        if (url.includes("/members") && method === "delete") {
          const parts = url.split("/");
          const id = Number(parts[parts.length - 1]);
          mockFamily = mockFamily.filter((m) => m.id !== id);
          return { data: { success: true }, status: 200, statusText: "OK", headers: {}, config: error.config };
        }
        const totIncome = mockFamily.reduce((s, m) => s + m.monthly_income, 0);
        const totExp = mockFamily.reduce((s, m) => s + m.monthly_expense, 0);
        const avgScore = Math.round(mockFamily.reduce((s, m) => s + m.credit_score, 0) / mockFamily.length);
        return {
          data: {
            total_household_income: totIncome,
            total_household_expenses: totExp,
            total_household_savings: totIncome - totExp,
            average_credit_score: avgScore,
            members: mockFamily,
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      // --- 11. Security Center ---
      if (url.includes("/security/center")) {
        return {
          data: {
            security_score: 94,
            mfa_enabled: true,
            active_sessions_count: 2,
            failed_logins_last_24h: 0,
            threat_level: "SECURE",
            active_sessions: [
              { id: 1, device_name: "Chrome on Windows 11", ip_address: "127.0.0.1", location: "Mumbai, India", is_active: true, last_active: new Date().toISOString() },
              { id: 2, device_name: "Safari on iPhone 15", ip_address: "49.36.120.4", location: "Bengaluru, India", is_active: true, last_active: new Date(Date.now() - 3600000).toISOString() },
            ],
            recent_audit_logs: [
              { id: 1, action: "LOGIN_SUCCESS", ip_address: "127.0.0.1", user_agent: "Mozilla/5.0", details: "User authenticated via Secure Password + MFA", status: "SUCCESS", timestamp: new Date().toISOString() },
              { id: 2, action: "PROFILE_UPDATED", ip_address: "127.0.0.1", user_agent: "Mozilla/5.0", details: "CIBIL report synchronized with Experian", status: "SUCCESS", timestamp: new Date(Date.now() - 7200000).toISOString() },
            ],
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/security/logout-all")) {
        return {
          data: { message: "All other sessions have been logged out successfully." },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/security/toggle-mfa")) {
        return {
          data: { mfa_enabled: true, message: "Two-factor authentication status updated." },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      // --- 12. OCR Document Scanner ---
      if (url.includes("/ocr/upload")) {
        return {
          data: {
            document_id: 101,
            filename: "Bank_Statement_HDFC_Aug2026.pdf",
            status: "PROCESSED",
            transactions_count: 5,
            parsed_transactions: mockTransactions,
            preview_text: "Extracted 5 line items from uploaded statement. Account: HDFC Bank Salaried. Verified zero bounced payments.",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/ocr/confirm-import")) {
        return {
          data: { status: "SUCCESS", imported_count: 5, message: "Statement transactions imported into Expense Intelligence." },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      // --- 13. WhatsApp Integration ---
      if (url.includes("/whatsapp")) {
        return {
          data: {
            status: "SIMULATED_SUCCESS",
            rendered_message: "Namaste Rajesh! Your Credit Assistant CIBIL update is ready: Score 758 (Prime Tier). Reply 1 for Report, 2 for EMI calculator.",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }
    }

    return Promise.reject(error);
  }
);
