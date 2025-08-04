"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [contactEmail, setContactEmail] = useState('ramy.magdy@rockettravelsystem.com');

  useEffect(() => {
    fetchContactEmail();
  }, []);

  const fetchContactEmail = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'contact_email')
        .single();

      if (data && !error) {
        setContactEmail(data.value);
      }
    } catch (error) {
      console.error('Error fetching contact email:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save contact form submission to database
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: 'new'
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
      }

      // Send email using API route
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: contactEmail
        }),
      });

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center mb-6">
        <MessageSquare className="h-6 w-6 text-cyan-600 mr-3" />
        <h3 className="text-2xl font-semibold text-gray-900">Send us a Message</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            placeholder="What is this about?"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-vertical"
            placeholder="Tell us more about your inquiry..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 text-white py-3 px-4 rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Your message will be sent to our team at{' '}
          <span className="text-cyan-600 font-medium">{contactEmail}</span>. 
          We typically respond within 24 hours during business days.
        </p>
      </div>
    </div>
  );
};

export default ContactForm;
