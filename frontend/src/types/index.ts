export interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
}

export interface FinancialProfile {
  id: number;
  user_id: number;
  age: number;
  occupation: string;
  monthly_income: number;
  monthly_expenses: number;
  existing_emi: number;
  total_debt: number;
  credit_score: number;
  credit_limit: number;
  used_credit: number;
  emergency_fund: number;
  savings_goal: number;
  dti_ratio: number;
  credit_utilization: number;
  disposable_income: number;
  financial_health_index: number;
  updated_at: string;
}

export interface CreditHistory {
  id: number;
  score: number;
  payment_history_score: number;
  utilization_rate: number;
  dti: number;
  inquiries_count: number;
  recorded_at: string;
  simulated: boolean;
  notes?: string;
}

export interface TrajectoryPoint {
  month_name: string;
  month_offset: number;
  projected_score: number;
  confidence: number;
  milestone?: string;
}

export interface CreditPrediction {
  current_score: number;
  projected_3_month: number;
  projected_6_month: number;
  improvement_points: number;
  improvement_percentage: number;
  confidence_score: number;
  trajectory: TrajectoryPoint[];
  key_drivers: { factor: string; impact: string; status: string }[];
  recommendations: string[];
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  date: string;
  merchant: string;
  category: string;
  type: string;
  payment_mode: string;
  is_flagged_fraud: boolean;
  fraud_reason?: string;
  source: string;
  notes?: string;
}

export interface CategorySummary {
  category: string;
  total_amount: number;
  percentage: number;
  transaction_count: number;
}

export interface ExpenseIntelligence {
  total_monthly_spend: number;
  total_monthly_income: number;
  net_savings: number;
  savings_rate_percentage: number;
  highest_expense_category: string;
  category_breakdown: CategorySummary[];
  spending_spikes: string[];
  ai_recommendations: string[];
}

export interface SavingsGoal {
  id: number;
  user_id: number;
  title: string;
  category: string;
  target_amount: number;
  current_amount: number;
  progress_percentage: number;
  target_date: string;
  monthly_target: number;
  weekly_target: number;
  daily_target: number;
  is_completed: boolean;
  days_remaining: number;
}

export interface XAIItem {
  problem: string;
  reason: string;
  action: string;
  expected_impact: string;
}

export interface AIReport {
  id: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risk_analysis: {
    credit_risk: string;
    leverage_risk: string;
    liquidity_risk: string;
    risk_narrative: string;
  };
  roadmap: {
    step: number;
    title: string;
    action: string;
    timeline: string;
    priority: string;
  }[];
  timeline: string;
  explainable_reasoning: XAIItem[];
  language: string;
  created_at: string;
}

export interface FraudAlert {
  id: number;
  user_id: number;
  transaction_id?: number;
  alert_type: string;
  severity: string;
  description: string;
  suggested_action: string;
  is_resolved: boolean;
  resolution_note?: string;
  created_at: string;
}

export interface FamilyMember {
  id: number;
  user_id: number;
  name: string;
  relation: string;
  monthly_income: number;
  monthly_expense: number;
  credit_score: number;
  contribution_to_savings: number;
  created_at: string;
}

export interface FamilyHousehold {
  total_household_income: number;
  total_household_expenses: number;
  total_household_savings: number;
  average_credit_score: number;
  members: FamilyMember[];
}

export interface InvestmentReadiness {
  readiness_score: number;
  readiness_level: string;
  emergency_fund_months: number;
  debt_stability_rating: string;
  recommended_allocation: Record<string, number>;
  actionable_steps: string[];
  disclaimer: string;
}

export interface SecuritySession {
  id: number;
  device_name: string;
  ip_address: string;
  location: string;
  is_active: boolean;
  last_active: string;
}

export interface AuditLog {
  id: number;
  action: string;
  ip_address: string;
  user_agent: string;
  details?: string;
  status: string;
  timestamp: string;
}

export interface SecurityCenterData {
  security_score: number;
  mfa_enabled: boolean;
  active_sessions_count: number;
  failed_logins_last_24h: number;
  threat_level: string;
  active_sessions: SecuritySession[];
  recent_audit_logs: AuditLog[];
}
