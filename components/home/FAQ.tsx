"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Should I talk to a lawyer before my first court date?",
    answer:
      "Yes. Early steps can make a big difference. Deadlines move fast. The sooner you reach out, the more options you have.",
  },
  {
    question: "Can you keep this off my record?",
    answer:
      "Every case is different. I look for the best path: dismissal, reduction, or damage control depending on the facts. I'll be straight with you about what's realistic.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "I believe everyone deserves aggressive and effective legal defense. Please inquire about payment plan options when we discuss your case.",
  },
  {
    question: "How much does it cost to fight a traffic ticket?",
    answer:
      "I offer flat-fee options for most traffic infractions, typically $149-249 depending on court and violation type. DUI cases require a consultation due to their complexity. Upload your citation to get a quote.",
  },
  {
    question: "Do I have to go to court?",
    answer:
      "For most traffic infractions, no. I handle court appearances so you don't have to take time off work. For DUI cases, your presence is required at certain hearings, but I'll guide you through the process.",
  },
  {
    question: "What happens if I just pay the ticket?",
    answer:
      "Paying is an admission of guilt. It goes on your record, can raise insurance rates significantly, and accumulates points toward suspension. Even small tickets can hit your license, insurance, and job. I take them seriously.",
  },
  {
    question: "What courts do you cover?",
    answer:
      "I handle cases throughout Pierce County: Tacoma, Lakewood, Puyallup, Federal Way, University Place, Bonney Lake, and more. I also cover select King and Thurston County courts.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Generate FAQ schema markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="bg-[--bg-light] py-16 lg:py-24">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-3xl font-bold text-[--primary] sm:text-4xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Common Questions
          </h2>
          <p className="text-lg text-[--text-secondary]">
            Straight answers about traffic tickets and DUI defense.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="pr-4 font-semibold text-[--primary]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-[--accent] transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="border-t border-gray-100 px-6 pb-5 pt-4">
                  <p className="text-[--text-secondary]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* More Questions CTA */}
        <div className="mt-8 text-center">
          <p className="text-[--text-secondary]">
            Have a specific question?{" "}
            <a
              href="/contact"
              className="font-semibold text-[--accent] hover:underline"
            >
              Contact me
            </a>{" "}
            or{" "}
            <a
              href="/fight-my-ticket"
              className="font-semibold text-[--accent] hover:underline"
            >
              upload your citation
            </a>{" "}
            for a free evaluation.
          </p>
        </div>
      </div>
    </section>
  );
}
