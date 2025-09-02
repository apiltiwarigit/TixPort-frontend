'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input, Select, Textarea } from '@/components/ui';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      details: ['(281) 392-9693', 'Mon-Fri 9AM-6PM EST'],
      color: 'text-blue-500'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      details: ['support@tixport.com', '24/7 Response'],
      color: 'text-green-500'
    },
    {
      icon: MapPinIcon,
      title: 'Office Address',
      details: ['123 Ticket Street', 'New York, NY 10001'],
      color: 'text-purple-500'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      details: ['Mon-Fri: 9AM-6PM', 'Sat-Sun: 10AM-4PM'],
      color: 'text-orange-500'
    }
  ];

  const faqs = [
    {
      question: 'How do I purchase tickets?',
      answer: 'Browse events, select your seats, and complete checkout. You\'ll receive instant e-tickets via email.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and digital wallets for secure transactions.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Refunds are available based on event policies. Contact us within 24 hours for most events.'
    },
    {
      question: 'How do I change my order?',
      answer: 'Log into your account and visit your order history to make changes before the event date.'
    }
  ];

  return (
    <PageContainer showSidebar={true}>
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <ChatBubbleLeftRightIcon className="h-10 w-10 mr-4 text-purple-500" />
          Contact Us
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Have a question? Need help with your tickets? We're here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {contactInfo.map((info, index) => (
              <Card key={index} hover>
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <info.icon className={`h-6 w-6 mr-3 ${info.color}`} />
                    <h3 className="text-lg font-semibold text-white">{info.title}</h3>
                  </div>
                  <div className="text-gray-400 text-sm space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx}>{detail}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

              {/* FAQ Section */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h4 className="text-white font-medium mb-2">{faq.question}</h4>
                        <p className="text-gray-400 text-sm">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

          {isSubmitted ? (
            <Card className="bg-green-900/20 border-green-700 animate-fade-in-up">
              <CardContent className="p-6 text-center">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-green-400">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="animate-fade-in-up">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Full Name *"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />

                  <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                  />
                  <Select
                    label="Inquiry Type"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="refund">Refund Request</option>
                    <option value="partnership">Partnership</option>
                  </Select>

                  <Input
                    label="Subject *"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your inquiry"
                  />

                  <Textarea
                    label="Message *"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide details about your inquiry..."
                  />

                  <Button
                    type="submit"
                    fullWidth
                    leftIcon={<PaperAirplaneIcon className="h-5 w-5" />}
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
