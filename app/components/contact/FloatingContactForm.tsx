"use client";

import ContactForm from './ContactForm';
import WhatsAppContact from './WhatsAppContact';

const FloatingContactForm = () => {
  return (
    <div className="space-y-8">
      {/* Contact Form */}
      <div className="transform hover:-translate-y-1 transition-all duration-300">
        <ContactForm />
      </div>
      
      {/* WhatsApp Contact */}
      <div className="transform hover:-translate-y-1 transition-all duration-300">
        <WhatsAppContact />
      </div>
    </div>
  );
};

export default FloatingContactForm;
