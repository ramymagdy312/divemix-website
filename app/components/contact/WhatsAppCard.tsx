"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Phone, Clock, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { supabase } from "../../lib/supabase";

interface WhatsAppCardProps {
  className?: string;
}

const WhatsAppCard: React.FC<WhatsAppCardProps> = ({ className = "" }) => {
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [whatsappMessage, setWhatsappMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhatsAppSettings();
  }, []);

  const fetchWhatsAppSettings = async () => {
    try {
      const { data: settingsData } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["whatsapp_number", "whatsapp_message"]);

      const settings =
        settingsData?.reduce((acc: any, setting: any) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {}) || {};

      setWhatsappNumber(
        settings.whatsapp_number ||
          process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
          "+201010606967"
      );
      setWhatsappMessage(
        settings.whatsapp_message ||
          "Hello! I would like to get more information about your services."
      );
    } catch (error) {
      console.error("Error fetching WhatsApp settings:", error);
      // Use default values
      setWhatsappNumber(
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+201010606967"
      );
      setWhatsappMessage(
        "Hello! I would like to get more information about your services."
      );
    } finally {
      setLoading(false);
    }
  };

  const openWhatsAppChat = () => {
    const cleanNumber = whatsappNumber.replace(/[^\d]/g, "");
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardContent className="p-6">
          <div className="h-32 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`${className} border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300`}
    >
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl text-green-800">
              Contact via WhatsApp
            </CardTitle>
            <CardDescription className="text-green-600">
              Get instant support and quick responses
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-6">
        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm text-green-700">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Instant messaging and quick replies</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-green-700">
            <Phone className="w-4 h-4 text-green-500" />
            <span>Voice messages and calls available</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-green-700">
            <Clock className="w-4 h-4 text-green-500" />
            <span>Available 24/7 for urgent inquiries</span>
          </div>
        </div>

        {/* WhatsApp Number Display */}
        <div className="bg-white/70 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">
                WhatsApp Number
              </p>
              <p className="text-lg font-semibold text-green-800">
                {whatsappNumber}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 border-green-200"
            >
              Active
            </Badge>
          </div>
        </div>

        {/* Default Message Preview */}
        <div className="bg-white/70 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium mb-2">
            Default Message
          </p>
          <p className="text-sm text-gray-700 italic">"{whatsappMessage}"</p>
        </div>

        {/* WhatsApp Button */}
        <Button
          onClick={openWhatsAppChat}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-base transition-all duration-300 transform hover:scale-105"
          size="lg"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Start WhatsApp Chat
        </Button>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-green-600">
            Click the button above to open WhatsApp with a pre-filled message
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppCard;
