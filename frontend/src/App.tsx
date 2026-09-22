import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { FinancialProvider } from "./contexts/FinancialContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { Footer } from "./components/layout/Footer";
import { VoiceAssistantModal } from "./components/layout/VoiceAssistantModal";

// Public Pages
import { LandingPage } from "./pages/public/LandingPage";
import { AboutPage } from "./pages/public/AboutPage";
import { FeaturesPage } from "./pages/public/FeaturesPage";
import { PrivacyPolicyPage } from "./pages/public/PrivacyPolicyPage";
import { TermsPage } from "./pages/public/TermsPage";
import { ContactPage } from "./pages/public/ContactPage";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { OTPVerifyPage } from "./pages/auth/OTPVerifyPage";

// Protected Dashboard Pages
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { OnboardingWizardPage } from "./pages/dashboard/OnboardingWizardPage";
import { AIAdvisorPage } from "./pages/dashboard/AIAdvisorPage";
import { CreditPredictionPage } from "./pages/dashboard/CreditPredictionPage";
import { EMICalculatorPage } from "./pages/dashboard/EMICalculatorPage";
import { SavingsPlannerPage } from "./pages/dashboard/SavingsPlannerPage";
import { LoanEligibilityPage } from "./pages/dashboard/LoanEligibilityPage";
import { ExpenseIntelligencePage } from "./pages/dashboard/ExpenseIntelligencePage";
import { OCRDocumentCenterPage } from "./pages/dashboard/OCRDocumentCenterPage";
import { FraudMonitorPage } from "./pages/dashboard/FraudMonitorPage";
import { InvestmentReadinessPage } from "./pages/dashboard/InvestmentReadinessPage";
import { FamilyDashboardPage } from "./pages/dashboard/FamilyDashboardPage";
import { SecurityCenterPage } from "./pages/dashboard/SecurityCenterPage";
import { SettingsPage } from "./pages/dashboard/SettingsPage";

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs">
        Loading Credit Assistant 2.0...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-65px)]">{children}</main>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <FinancialProvider>
            <Router>
              <div className="min-h-screen flex flex-col justify-between">
                <div>
                  <Navbar />
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Auth */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/verify-otp" element={<OTPVerifyPage />} />

                  {/* Protected */}
                  <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
                  <Route path="/onboarding" element={<ProtectedLayout><OnboardingWizardPage /></ProtectedLayout>} />
                  <Route path="/ai-advisor" element={<ProtectedLayout><AIAdvisorPage /></ProtectedLayout>} />
                  <Route path="/credit-prediction" element={<ProtectedLayout><CreditPredictionPage /></ProtectedLayout>} />
                  <Route path="/emi-calculator" element={<ProtectedLayout><EMICalculatorPage /></ProtectedLayout>} />
                  <Route path="/savings-planner" element={<ProtectedLayout><SavingsPlannerPage /></ProtectedLayout>} />
                  <Route path="/loan-eligibility" element={<ProtectedLayout><LoanEligibilityPage /></ProtectedLayout>} />
                  <Route path="/expenses" element={<ProtectedLayout><ExpenseIntelligencePage /></ProtectedLayout>} />
                  <Route path="/ocr-center" element={<ProtectedLayout><OCRDocumentCenterPage /></ProtectedLayout>} />
                  <Route path="/fraud-monitor" element={<ProtectedLayout><FraudMonitorPage /></ProtectedLayout>} />
                  <Route path="/investment-readiness" element={<ProtectedLayout><InvestmentReadinessPage /></ProtectedLayout>} />
                  <Route path="/family" element={<ProtectedLayout><FamilyDashboardPage /></ProtectedLayout>} />
                  <Route path="/security" element={<ProtectedLayout><SecurityCenterPage /></ProtectedLayout>} />
                  <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              <Footer />
              <VoiceAssistantModal />
            </div>
          </Router>
        </FinancialProvider>
      </LanguageProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
