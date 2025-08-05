"use client";

import React, { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare, MapPin, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import AnimatedElement from '../common/AnimatedElement';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

interface ContactFormProps {
  branches: Branch[];
  selectedBranchId?: string;
  onBranchSelect?: (branchId: string) => void;
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  branchId: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EnhancedContactForm: React.FC<ContactFormProps> = ({
  branches,
  selectedBranchId,
  onBranchSelect,
  className = ""
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    branchId: selectedBranchId || (branches.length > 0 ? branches[0].id : '')
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'Your message has been sent successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          branchId: selectedBranchId || (branches.length > 0 ? branches[0].id : '')
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'An error occurred while sending the message.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setSubmitMessage('A connection error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Contact Us</h3>
            <p className="text-cyan-100">We’re here to answer all your inquiries</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        {submitStatus !== 'idle' && (
          <AnimatedElement animation="slideUp">
            <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
              submitStatus === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {submitStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{submitMessage}</p>
            </div>
          </AnimatedElement>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-colors ${
                  errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-cyan-500'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@email.com"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-colors ${
                  errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-cyan-500'
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number (optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+20 123 456 7890"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="What is your message about?"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-colors ${
                errors.subject ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-cyan-500'
              }`}
            />
            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Write your message here... (Minimum 10 characters)"
              rows={5}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-colors resize-none ${
                errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-cyan-500'
              }`}
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
            <p className="mt-1 text-xs text-gray-500">
              {formData.message.length} / 1000 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 focus:ring-4 focus:ring-cyan-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedContactForm;
