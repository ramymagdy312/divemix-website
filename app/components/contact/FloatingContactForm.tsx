"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const FloatingContactForm = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formState);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative group">
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors peer"
              placeholder=" "
              required
            />
            <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 -translate-y-7 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-7 peer-focus:text-cyan-500 text-sm bg-white px-2">
              Your Name
            </label>
          </div>

          <div className="relative group">
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors peer"
              placeholder=" "
              required
            />
            <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 -translate-y-7 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-7 peer-focus:text-cyan-500 text-sm bg-white px-2">
              Email Address
            </label>
          </div>
        </div>

        <div className="relative group">
          <input
            type="text"
            name="subject"
            value={formState.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors peer"
            placeholder=" "
            required
          />
          <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 -translate-y-7 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-7 peer-focus:text-cyan-500 text-sm bg-white px-2">
            Subject
          </label>
        </div>

        <div className="relative group">
          <textarea
            name="message"
            value={formState.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors peer"
            placeholder=" "
            required
          ></textarea>
          <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 -translate-y-7 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-7 peer-focus:text-cyan-500 text-sm bg-white px-2">
            Your Message
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 text-white py-3 px-6 rounded-lg hover:bg-cyan-700 transition-colors duration-300 flex items-center justify-center gap-2 group"
        >
          Send Message
          <Send className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default FloatingContactForm;
