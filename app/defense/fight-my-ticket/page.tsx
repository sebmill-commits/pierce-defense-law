"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SeattleCitationUpload from "@/components/seattle/intake/CitationUpload";
import SeattleCitationReview from "@/components/seattle/intake/CitationReview";
import SeattleContactInfo from "@/components/seattle/intake/ContactInfo";
import SeattlePaymentStep from "@/components/seattle/intake/PaymentStep";
import SeattleConfirmation from "@/components/seattle/intake/Confirmation";

export type IntakeStep = "upload" | "review" | "contact" | "payment" | "confirmation";

export interface CitationData {
  imageUrl: string | null;
  imageFile: File | null;
  citationNumber: string;
  courtName: string;
  violationType: string;
  citationDate: string;
  hearingDate: string;
  fineAmount: string;
}

export interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface IntakeState {
  step: IntakeStep;
  citation: CitationData;
  contact: ContactData;
  price: number;
  paymentId: string | null;
}

const initialState: IntakeState = {
  step: "upload",
  citation: {
    imageUrl: null,
    imageFile: null,
    citationNumber: "",
    courtName: "",
    violationType: "",
    citationDate: "",
    hearingDate: "",
    fineAmount: "",
  },
  contact: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  price: 0,
  paymentId: null,
};

const stepTitles: Record<IntakeStep, string> = {
  upload: "Upload Your Ticket",
  review: "Review Details",
  contact: "Your Information",
  payment: "Payment",
  confirmation: "You're All Set",
};

const stepNumbers: Record<IntakeStep, number> = {
  upload: 1,
  review: 2,
  contact: 3,
  payment: 4,
  confirmation: 5,
};

export default function SeattleFightMyTicketPage() {
  const [state, setState] = useState<IntakeState>(initialState);

  // Persist state to localStorage (use different key for Seattle)
  useEffect(() => {
    const saved = localStorage.getItem("seattleIntakeState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Don't restore if already completed
        if (parsed.step !== "confirmation") {
          setState((prev) => ({
            ...prev,
            ...parsed,
            citation: { ...prev.citation, ...parsed.citation, imageFile: null },
          }));
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    if (state.step !== "confirmation") {
      const toSave = {
        ...state,
        citation: { ...state.citation, imageFile: null, imageUrl: null },
      };
      localStorage.setItem("seattleIntakeState", JSON.stringify(toSave));
    }
  }, [state]);

  const updateCitation = (data: Partial<CitationData>) => {
    setState((prev) => ({
      ...prev,
      citation: { ...prev.citation, ...data },
    }));
  };

  const updateContact = (data: Partial<ContactData>) => {
    setState((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...data },
    }));
  };

  const setStep = (step: IntakeStep) => {
    setState((prev) => ({ ...prev, step }));
    window.scrollTo(0, 0);
  };

  const setPrice = (price: number) => {
    setState((prev) => ({ ...prev, price }));
  };

  const setPaymentId = (paymentId: string) => {
    setState((prev) => ({ ...prev, paymentId }));
  };

  const resetForm = () => {
    localStorage.removeItem("seattleIntakeState");
    setState(initialState);
  };

  const currentStepNumber = stepNumbers[state.step];
  const totalSteps = 4; // Don't count confirmation

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link
            href="/defense"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-slate-900">
              {stepTitles[state.step]}
            </h1>
          </div>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* Progress Bar */}
        {state.step !== "confirmation" && (
          <div className="mx-auto max-w-3xl px-4 pb-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Step {currentStepNumber} of {totalSteps}
              </span>
              <span>{Math.round((currentStepNumber / totalSteps) * 100)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(currentStepNumber / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        {state.step === "upload" && (
          <SeattleCitationUpload
            citation={state.citation}
            updateCitation={updateCitation}
            onNext={() => setStep("review")}
          />
        )}

        {state.step === "review" && (
          <SeattleCitationReview
            citation={state.citation}
            updateCitation={updateCitation}
            price={state.price}
            setPrice={setPrice}
            onBack={() => setStep("upload")}
            onNext={() => setStep("contact")}
          />
        )}

        {state.step === "contact" && (
          <SeattleContactInfo
            contact={state.contact}
            updateContact={updateContact}
            onBack={() => setStep("review")}
            onNext={() => setStep("payment")}
          />
        )}

        {state.step === "payment" && (
          <SeattlePaymentStep
            state={state}
            setPaymentId={setPaymentId}
            onBack={() => setStep("contact")}
            onSuccess={() => setStep("confirmation")}
          />
        )}

        {state.step === "confirmation" && (
          <SeattleConfirmation state={state} onReset={resetForm} />
        )}
      </div>
    </div>
  );
}
