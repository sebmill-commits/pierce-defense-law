"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import type { CitationData } from "@/app/defense/fight-my-ticket/page";

interface CitationUploadProps {
  citation: CitationData;
  updateCitation: (data: Partial<CitationData>) => void;
  onNext: () => void;
}

export default function SeattleCitationUpload({
  citation,
  updateCitation,
  onNext,
}: CitationUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, etc.)");
      setIsProcessing(false);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large. Please upload an image under 10MB.");
      setIsProcessing(false);
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);

    updateCitation({
      imageUrl,
      imageFile: file,
    });

    // Simulate OCR processing (in production, this would call the OCR API)
    // For now, we'll just show the image and let the user fill in details
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  const clearImage = () => {
    if (citation.imageUrl) {
      URL.revokeObjectURL(citation.imageUrl);
    }
    updateCitation({
      imageUrl: null,
      imageFile: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContinue = () => {
    if (!citation.imageUrl) {
      // Allow skipping photo upload - user can enter details manually
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center">
        <p className="text-slate-600">
          Take a photo of your citation or upload an image. I&apos;ll extract
          the details automatically.
        </p>
      </div>

      {/* Upload Zone */}
      {!citation.imageUrl ? (
        <div className="space-y-4">
          {/* Camera/Upload Input */}
          <label
            className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 transition-colors hover:border-emerald-500 hover:bg-emerald-50"
            style={{ touchAction: "manipulation" }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Camera className="h-8 w-8" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900">
                  Tap to Take Photo
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  or upload an existing image
                </p>
              </div>
            </div>
          </label>

          {/* Alternative Upload Button */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-4 text-slate-700 transition-colors hover:bg-slate-50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-5 w-5" />
            <span>Choose from device</span>
          </label>
        </div>
      ) : (
        /* Image Preview */
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
            {isProcessing && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                  <p className="text-sm font-medium text-slate-600">
                    Processing image...
                  </p>
                </div>
              </div>
            )}
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={citation.imageUrl}
                alt="Citation preview"
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={clearImage}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
              aria-label="Remove image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-center text-sm text-slate-500">
            Image uploaded successfully. Continue to review the details.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Skip Option */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          className="text-sm text-slate-500 underline hover:text-slate-700"
        >
          {citation.imageUrl
            ? "Continue without OCR"
            : "Skip photo - enter details manually"}
        </button>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={isProcessing}
        className="btn-primary w-full text-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Continue"
        )}
      </button>
    </div>
  );
}
