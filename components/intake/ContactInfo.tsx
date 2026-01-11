"use client";

import { ArrowLeft, Lock } from "lucide-react";
import type { ContactData } from "@/app/fight-my-ticket/page";

interface ContactInfoProps {
  contact: ContactData;
  updateContact: (data: Partial<ContactData>) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function ContactInfo({
  contact,
  updateContact,
  onBack,
  onNext,
}: ContactInfoProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!contact.firstName.trim()) {
      alert("Please enter your first name");
      return;
    }
    if (!contact.lastName.trim()) {
      alert("Please enter your last name");
      return;
    }
    if (!contact.email.trim() || !contact.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    if (!contact.phone.trim() || contact.phone.replace(/\D/g, "").length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    onNext();
  };

  const formatPhone = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <p className="text-slate-600">
          I&apos;ll use this information to contact you about your case and send
          your retainer agreement.
        </p>
      </div>

      {/* Name Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            value={contact.firstName}
            onChange={(e) => updateContact({ firstName: e.target.value })}
            placeholder="John"
            autoComplete="given-name"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            required
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            value={contact.lastName}
            onChange={(e) => updateContact({ lastName: e.target.value })}
            placeholder="Smith"
            autoComplete="family-name"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={contact.email}
          onChange={(e) => updateContact({ email: e.target.value })}
          placeholder="john@example.com"
          autoComplete="email"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          required
        />
        <p className="mt-1 text-xs text-slate-500">
          I&apos;ll send your retainer agreement to this email
        </p>
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          value={contact.phone}
          onChange={(e) => updateContact({ phone: formatPhone(e.target.value) })}
          placeholder="(253) 555-0123"
          autoComplete="tel"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          required
        />
        <p className="mt-1 text-xs text-slate-500">
          Best number to reach you for case updates
        </p>
      </div>

      {/* Privacy Note */}
      <div className="flex items-start gap-3 rounded-xl bg-slate-100 p-4">
        <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
        <p className="text-sm text-slate-600">
          Your information is secure and will only be used for your case. I
          never share or sell client data.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-4 font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button type="submit" className="btn-primary flex-1 text-lg">
          Continue to Payment
        </button>
      </div>
    </form>
  );
}
