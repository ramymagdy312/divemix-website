"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { MessageCircle } from 'lucide-react';

interface ContactIntroProps {
  title?: string;
  description?: string;
}

const ContactIntro = ({ 
  title = "Ready to Transform Your Operations?", 
  description = "Whether you're looking to upgrade your current systems, need expert consultation, or want to explore our latest innovations, our team is here to help. With decades of experience and a commitment to excellence, we provide personalized solutions that meet your specific requirements."
}: ContactIntroProps) => {
  return (
    <Card className="border-0 shadow-none bg-transparent max-w-3xl mx-auto">
      <CardHeader className="px-0 pb-6 text-center">
        <div className="flex justify-center mb-4">
          <Badge variant="secondary">
            <MessageCircle className="w-3 h-3 mr-1" />
            Get In Touch
          </Badge>
        </div>
        <CardTitle className="text-3xl font-bold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 text-center">
        <CardDescription className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ContactIntro;
