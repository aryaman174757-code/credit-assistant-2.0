import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api"
    : "/api");

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 4000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock fallback responses for static / Netlify deployments
const MOCK_PROFILE = {
  id: 1,
  user_id: 1,
  current_cibil_score: 745,
  monthly_income: 95000.0,
  monthly_fixed_obligations: 28000.0,
  total_credit_limit: 350000.0,
  total_credit_utilized: 68000.0,
  total_existing_loan_balance: 420000.0,
  on_time_payment_percentage: 98.2,
  credit_history_length_months: 48,
  hard_inquiries_last_6m: 1,
  calculated_dti_ratio: 29.47,
  calculated_foir_ratio: 29.47,
  calculated_credit_utilization: 19.43,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend is unreachable or returns network error, provide realistic demo fallback
    const url = error.config?.url || "";
    const method = error.config?.method?.toLowerCase() || "get";

    if (!error.response || error.code === "ECONNABORTED" || error.message?.includes("Network Error")) {
      console.warn(`[Credit Assistant API Fallback] Serving offline demo payload for: ${method.toUpperCase()} ${url}`);

      if (url.includes("/profile")) {
        return { data: MOCK_PROFILE, status: 200, statusText: "OK", headers: {}, config: error.config };
      }
      if (url.includes("/credit/predict")) {
        return {
          data: {
            current_score: 745,
            forecast_3_months: [
              { month: "Month 1", baseline: 745, optimistic: 752, conservative: 743 },
              { month: "Month 2", baseline: 747, optimistic: 760, conservative: 742 },
              { month: "Month 3", baseline: 750, optimistic: 768, conservative: 740 },
            ],
            forecast_6_months: [
              { month: "Month 1", baseline: 745, optimistic: 752, conservative: 743 },
              { month: "Month 2", baseline: 747, optimistic: 760, conservative: 742 },
              { month: "Month 3", baseline: 750, optimistic: 768, conservative: 740 },
              { month: "Month 4", baseline: 754, optimistic: 775, conservative: 738 },
              { month: "Month 5", baseline: 758, optimistic: 782, conservative: 737 },
              { month: "Month 6", baseline: 762, optimistic: 790, conservative: 735 },
            ],
            key_levers: [
              { lever: "Credit Utilization (<30%)", impact: "+18 pts", status: "Optimal (19.4%)" },
              { lever: "On-Time Repayments", impact: "+12 pts", status: "Excellent (98.2%)" },
              { lever: "Credit Mix & Age", impact: "+8 pts", status: "Healthy (4 yrs)" },
            ],
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }
      if (url.includes("/ai/generate-report") || url.includes("/ai/latest-report")) {
        return {
          data: {
            language: "en",
            health_score: 745,
            overall_verdict: "Strong Financial Health with Prime Loan Eligibility",
            summary: "Your financial profile exhibits a healthy CIBIL score of 745 and disciplined FOIR of 29.5%. Keeping credit utilization below 20% will unlock lowest interest rate slabs across Tier-1 banks.",
            xai_items: [
              {
                category: "Credit Utilization",
                user_value: "19.4%",
                benchmark: "≤ 30.0%",
                status: "PASS",
                importance_weight: "30% (High Impact)",
                explanation: "Your active revolving balance of ₹68,000 on a limit of ₹3,50,000 demonstrates disciplined credit appetite.",
                action_item: "Maintain utilization under 20% by continuing mid-cycle card payments before statement generation.",
                expected_timeline: "1 - 2 Billing Cycles",
                priority: "MEDIUM"
              },
              {
                category: "FOIR & Debt Burden",
                user_value: "29.5%",
                benchmark: "≤ 50.0%",
                status: "PASS",
                importance_weight: "25% (High Impact)",
                explanation: "Current fixed obligations (₹28,000/mo) represent less than a third of monthly earnings (₹95,000/mo).",
                action_item: "Eligible for pre-approved home and car loan balance transfers at subsidized prime lending rates.",
                expected_timeline: "Immediate",
                priority: "LOW"
              },
              {
                category: "Payment History Consistency",
                user_value: "98.2%",
                benchmark: "100.0%",
                status: "WARNING",
                importance_weight: "35% (Critical Impact)",
                explanation: "Minor late payment recorded 14 months ago slightly weighs down prime 800+ tier entry.",
                action_item: "Enable NACH e-mandate autopay for all credit cards and loans 5 days prior to due dates.",
                expected_timeline: "3 - 6 Months",
                priority: "HIGH"
              }
            ],
            five_step_action_plan: [
              "Set up automated NACH e-mandates across all active credit accounts.",
              "Request credit limit upgrades on your primary credit card without hard inquiries.",
              "Diversify secured vs unsecured credit mix by maintaining one consumer durable EMI.",
              "Avoid making more than 1 hard credit inquiry every six months.",
              "Build emergency liquid reserves to cover 6 months of fixed obligations (₹1,68,000)."
            ]
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }
      if (url.includes("/calculator/calculate")) {
        return {
          data: {
            monthly_emi: 18871.23,
            total_interest: 132274.0,
            total_payment: 1132274.0,
            foir_percentage: 36.5,
            is_affordable: true,
            status: "APPROVED"
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }
      if (url.includes("/expenses")) {
        return {
          data: [
            { id: 1, merchant: "Swiggy India", category: "Food & Dining", amount: 649, date: "2026-09-15" },
            { id: 2, merchant: "Amazon India", category: "Shopping", amount: 3499, date: "2026-09-12" },
            { id: 3, merchant: "Uber Rides", category: "Transportation", amount: 420, date: "2026-09-10" },
            { id: 4, merchant: "Blinkit Quick Commerce", category: "Groceries", amount: 1180, date: "2026-09-08" },
            { id: 5, merchant: "HDFC Home Loan EMI", category: "Housing & Loans", amount: 18500, date: "2026-09-05" },
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }
      if (url.includes("/savings")) {
        return {
          data: [
            { id: 1, title: "Emergency Fund (6 Months)", target_amount: 170000, current_amount: 125000, target_date: "2026-12-31" },
            { id: 2, title: "Diwali Gold SIP", target_amount: 50000, current_amount: 38000, target_date: "2026-11-10" },
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }
      if (url.includes("/fraud")) {
        return {
          data: [
            { id: 1, alert_type: "UNUSUAL_GEO_LOCATION", severity: "LOW", description: "Login from new browser fingerprint in Mumbai", created_at: "2026-09-16T14:20:00Z" }
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }
      if (url.includes("/investment")) {
        return {
          data: {
            readiness_score: 82,
            tier: "INVESTMENT_READY",
            emergency_fund_months: 4.5,
            savings_rate: 34.2,
            recommendation: "Ready for diversified Equity Mutual Fund SIPs and Sovereign Gold Bonds (SGB)."
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }
      if (url.includes("/family")) {
        return {
          data: [
            { id: 1, name: "Rajesh Sharma (Self)", relation: "Primary", monthly_income: 95000, cibil_score: 745 },
            { id: 2, name: "Pooja Sharma (Spouse)", relation: "Spouse", monthly_income: 65000, cibil_score: 760 },
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }
      if (url.includes("/whatsapp")) {
        return {
          data: {
            status: "SIMULATED_SUCCESS",
            rendered_message: "Namaste Rajesh! Your Credit Assistant CIBIL update is ready: Score 745 (Good Tier). Reply 1 for Report, 2 for EMI calculator.",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }
      if (url.includes("/security")) {
        return {
          data: {
            active_sessions: 1,
            biometrics_enabled: true,
            two_factor_auth: "ACTIVE",
            audit_events: 12
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

