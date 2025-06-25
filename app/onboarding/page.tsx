'use client';
import React, { useState } from "react";

export default function OnboardingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a file to upload.");
      return;
    }
    // Placeholder for upload logic
    setStatus("Document uploaded successfully! (Mock)");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
      <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-paradisePink mb-4">Identity Verification</h1>
        <p className="text-lg text-paradiseBlack mb-6">To complete onboarding, please upload a valid government-issued ID or passport.</p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-paradisePink file:text-white hover:file:bg-paradiseGold"
          />
          <button
            type="submit"
            className="mt-2 px-6 py-2 rounded bg-paradisePink text-white font-bold hover:bg-paradiseGold hover:text-paradiseBlack transition"
          >
            Upload Document
          </button>
        </form>
        {status && <div className="mt-4 text-green-600 font-semibold">{status}</div>}
      </div>
    </div>
  );
} 