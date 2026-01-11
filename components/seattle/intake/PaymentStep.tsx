"use client";

import { useState } from "react";
import { ArrowLeft, CreditCard, Lock, Shield, Loader2 } from "lucide-react";
import type { IntakeState } from "@/app/defense/fight-my-ticket/page";
import { SEATTLE_SITE_CONFIG } from "@/lib/seattle-constants";

interface PaymentStepProps {
  state: IntakeState;
  setPaymentId: (id: string) => void;
  onBack: () => void;
  onSuccess: () => void;
}

export default function SeattlePaymentStep({
  state,
  setPaymentId,
  onBack,
  onSuccess,
}: PaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // In production, this would create a Stripe checkout session
      // For now, simulate the payment process
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "SEATTLE_DEFENSE_WEBSITE", // Identify Seattle source
          price: state.price,
          citation: state.citation,
          contact: state.contact,
        }),
      });

      if (!response.ok) {
        // If API not set up yet, simulate success for demo
        if (response.status === 404) {
          // Simulate payment success
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const mockPaymentId = `demo_seattle_${Date.now()}`;
          setPaymentId(mockPaymentId);
          onSuccess();
          return;
        }
        throw new Error("Payment failed. Please try again.");
      }

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.paymentId) {
        setPaymentId(data.paymentId);
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-slate-900">Order Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Service</span>
            <span className="font-medium text-slate-900">
              Traffic Ticket Defense
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Court</span>
            <span className="font-medium text-slate-900">
              {state.citation.courtName || "TBD"}
            </span>
          </div>
          {state.citation.violationType && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Violation</span>
              <span className="font-medium text-slate-900">
                {state.citation.violationType}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Client</span>
            <span className="font-medium text-slate-900">
              {state.contact.firstName} {state.contact.lastName}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-slate-900">Total</span>
              <span className="text-2xl font-bold text-emerald-600">
                ${state.price}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              One-time flat fee. No additional charges.
            </p>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="rounded-2xl bg-slate-100 p-6">
        <h3 className="mb-3 font-semibold text-slate-900">What&apos;s Included</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Full case review and defense strategy
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            All court appearances on your behalf
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Negotiations with prosecutor
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            All paperwork and filings
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Email and phone support
          </li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="btn-primary w-full text-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Pay ${state.price}
          </>
        )}
      </button>

      {/* Security Badges */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Lock className="h-4 w-4" />
          Secure Payment
        </span>
        <span className="flex items-center gap-1">
          <Shield className="h-4 w-4" />
          256-bit SSL
        </span>
      </div>

      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isProcessing}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-4 font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Contact Option */}
      <p className="text-center text-sm text-slate-500">
        Questions?{" "}
        <a
          href={`tel:${SEATTLE_SITE_CONFIG.phoneRaw}`}
          className="font-medium text-emerald-600 hover:underline"
        >
          Call {SEATTLE_SITE_CONFIG.phone}
        </a>
      </p>
    </div>
  );
}
