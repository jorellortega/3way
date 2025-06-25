'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

export default function ContactPage() {
  const { user } = useAuth();
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { name, email, message } = form;
    if (!name || !email || !message) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    const { error: dbError } = await supabase.from("contact_messages").insert([
      {
        name,
        email,
        message,
        user_id: user ? user.id : null,
      },
    ]);
    if (dbError) {
      setError("Failed to send message. Please try again later.");
    } else {
      setSuccess("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 via-purple-950/80 to-gray-950 min-h-screen">
      <div className="container px-4 py-8 md:px-6 md:py-12 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
        <p className="text-purple-200 mb-8">Have a question, feedback, or need support? Fill out the form below or email us at <a href="mailto:support@digitalmarketplace.com" className="underline text-purple-400">support@digitalmarketplace.com</a>.</p>
        <form className="space-y-6 bg-purple-900/40 p-6 rounded-lg border border-purple-700 shadow" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-purple-200 mb-1">Name</label>
            <input type="text" id="name" name="name" required className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="email" className="block text-purple-200 mb-1">Email</label>
            <input type="email" id="email" name="email" required className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="message" className="block text-purple-200 mb-1">Message</label>
            <textarea id="message" name="message" rows={5} required className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500" value={form.message} onChange={handleChange} />
          </div>
          <Button type="submit" className="w-full bg-paradisePink hover:bg-paradiseGold text-white font-semibold" disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
          {success && <div className="text-green-400 text-center mt-2">{success}</div>}
          {error && <div className="text-red-400 text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
} 