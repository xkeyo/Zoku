"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mail, Phone, BookOpen, HelpCircle } from "lucide-react";
import Link from "next/link";

export function SupportSection() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      href: "#",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "We'll respond within 24 hours",
      action: "Send Email",
      href: "mailto:support@zoku.com",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Talk to our experts directly",
      action: "Call Us",
      href: "tel:+1234567890",
    },
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Comprehensive guides and tutorials",
      action: "Browse Docs",
      href: "/docs",
    },
  ];

  const faqs = [
    {
      question: "How do I get started?",
      answer:
        "Simply sign up for a free trial, and you'll have instant access to all features. Our onboarding wizard will guide you through the setup process.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use bank-level encryption, regular security audits, and comply with all major data protection regulations including GDPR and SOC 2.",
    },
    {
      question: "Do you offer custom integrations?",
      answer:
        "Yes, our Professional and Enterprise plans include API access and custom integrations. Contact our sales team for specific requirements.",
    },
  ];

  return (
    <section id="support" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Support Options */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-xl px-4 py-2 rounded-full mb-6 border-2 border-primary/30 shadow-lg">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            We're Here to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Help
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get the support you need, when you need it. Our team is always ready to
            assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {supportOptions.map((option, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/60 rounded-3xl backdrop-blur-xl bg-card/40 shadow-lg"
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 border-2 border-primary/30 shadow-lg">
                  <option.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-semibold">{option.title}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
                <Link href={option.href}>
                  <Button variant="ghost" size="sm" className="w-full rounded-full">
                    {option.action}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-3">
                <h4 className="text-lg font-semibold">{faq.question}</h4>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/faqs">
              <Button variant="outline" size="lg" className="rounded-full backdrop-blur-sm bg-background/50">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
