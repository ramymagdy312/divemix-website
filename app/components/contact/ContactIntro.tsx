"use client";

interface ContactIntroProps {
  title?: string;
  description?: string;
}

const ContactIntro = ({ 
  title = "Ready to Transform Your Operations?", 
  description = "Whether you're looking to upgrade your current systems, need expert consultation, or want to explore our latest innovations, our team is here to help. With decades of experience and a commitment to excellence, we provide personalized solutions that meet your specific requirements."
}: ContactIntroProps) => {
  return (
    <div className="max-w-xl">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <p className="text-lg text-gray-600 leading-relaxed mb-8">
        {description}
      </p>
    </div>
  );
};

export default ContactIntro;
