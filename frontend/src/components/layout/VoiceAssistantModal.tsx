import React, { useState } from "react";
import { Mic, MicOff, Volume2, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useFinancial } from "../../contexts/FinancialContext";

export const VoiceAssistantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceReply, setVoiceReply] = useState("");
  const { profile } = useFinancial();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleToggleListen = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setVoiceReply("Web Speech API is not natively supported in this browser. You can type or explore manually.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
      setTranscript("Listening for financial command...");

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(text);
        setIsListening(false);
        processVoiceCommand(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript("Could not capture speech. Please try again.");
      };
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = (cmd: string) => {
    let reply = "";
    if (cmd.includes("score") || cmd.includes("credit")) {
      reply = `Your current credit score is ${profile?.credit_score || 742}. You are in the Prime tier.`;
      speak(reply);
      navigate("/credit-prediction");
    } else if (cmd.includes("emi") || cmd.includes("loan")) {
      reply = "Opening EMI and Loan affordability calculator.";
      speak(reply);
      navigate("/emi-calculator");
    } else if (cmd.includes("advisor") || cmd.includes("analysis") || cmd.includes("roadmap")) {
      reply = "Opening your Explainable AI Financial Roadmap.";
      speak(reply);
      navigate("/ai-advisor");
    } else if (cmd.includes("savings") || cmd.includes("goal")) {
      reply = "Navigating to your Smart Savings Planner.";
      speak(reply);
      navigate("/savings-planner");
    } else if (cmd.includes("fraud") || cmd.includes("security")) {
      reply = "Opening Fraud Monitor and Security Shield.";
      speak(reply);
      navigate("/fraud-monitor");
    } else {
      reply = `I heard: "${cmd}". Here is a quick summary: Your DTI is ${profile?.dti_ratio || 35}%, and your health index is ${profile?.financial_health_index || 78}/100.`;
      speak(reply);
    }
    setVoiceReply(reply);
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-white shadow-glow-blue hover:scale-110 active:scale-95 transition-transform flex items-center justify-center group"
        title="Voice Financial Assistant"
      >
        <Mic className="w-6 h-6 animate-pulse" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/20 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setIsOpen(false);
                if ("speechSynthesis" in window) window.speechSynthesis.cancel();
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-glow-blue">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Voice Financial Assistant</h3>
                <p className="text-xs text-slate-400">Speak commands in English, Hindi, or Marathi</p>
              </div>

              <div className="py-4">
                <button
                  onClick={handleToggleListen}
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${
                    isListening
                      ? "bg-red-500/20 text-red-400 border-2 border-red-500 animate-ping"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue"
                  }`}
                >
                  {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                <p className="text-xs font-semibold text-slate-300 mt-3">
                  {isListening ? "Listening... Speak now" : "Tap microphone to speak"}
                </p>
              </div>

              {transcript && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
                  <span className="text-slate-400 block mb-1">Command:</span>
                  "{transcript}"
                </div>
              )}

              {voiceReply && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                  <Volume2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{voiceReply}</span>
                </div>
              )}

              <div className="text-[11px] text-slate-500 flex flex-wrap justify-center gap-2 pt-2">
                <span className="px-2 py-0.5 rounded bg-white/5">"What is my credit score?"</span>
                <span className="px-2 py-0.5 rounded bg-white/5">"Open EMI calculator"</span>
                <span className="px-2 py-0.5 rounded bg-white/5">"Analyze my finances"</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
