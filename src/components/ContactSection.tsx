import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  MapPin,
  Clock,
  Inbox,
  Youtube,
  Instagram,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioProfile, ContactInquiry } from '../types';

interface ContactSectionProps {
  profile: PortfolioProfile;
  onSubmitInquiry: (inquiry: ContactInquiry) => void;
  onOpenInbox: () => void;
  inquiryCount: number;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  onSubmitInquiry,
  onOpenInbox,
  inquiryCount,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: 'Event Photography',
    eventDate: '',
    budget: '$500 - $1,200',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const serviceOptions = [
    'Event Photography',
    'Sports & Action Coverage',
    'Stage & Performance',
    'Maritime & Expedition',
    'Cinematic Videography',
    'Other Creative Project',
  ];

  const budgetOptions = [
    'Flexible / Discussion',
    '$300 - $600 (Half Day)',
    '$600 - $1,200 (Full Day Event)',
    '$1,200+ (Multi-Day / Production)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newInquiry: ContactInquiry = {
        id: `inq-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        serviceType: formData.serviceType,
        eventDate: formData.eventDate || undefined,
        budget: formData.budget,
        message: formData.message,
        timestamp: new Date().toISOString(),
      };

      onSubmitInquiry(newInquiry);
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        serviceType: 'Event Photography',
        eventDate: '',
        budget: '$500 - $1,200',
        message: '',
      });
    }, 600);
  };

  return (
    <section id="contact" className="py-28 lg:py-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl bg-gradient-to-b from-[#111114] to-[#0a0a0c] border border-white/[0.08] p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle accent glow */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Contact & Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-red-400 uppercase tracking-wider mb-4 font-semibold">
                <Mail className="w-3.5 h-3.5" />
                <span>Initiate Booking</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#f5f5f7] leading-tight">
                Let's capture something iconic.
              </h2>
              <p className="mt-5 text-sm sm:text-base text-[#86868b] leading-relaxed">
                Whether you require high-speed trackside sports coverage, dynamic stagecraft storytelling, or large-scale event publicity, fill out the details and I will reply within 24 hours.
              </p>

              <div className="mt-10 space-y-4 text-xs sm:text-sm text-[#d1d1d6]">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center text-white/80 border border-white/10 shrink-0">
                    <MapPin className="w-4 h-4 text-red-400" />
                  </div>
                  <span>Singapore & Regional Travel</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center text-white/80 border border-white/10 shrink-0">
                    <Clock className="w-4 h-4 text-red-400" />
                  </div>
                  <span>Fast Turnaround · 48-Hour Highlight Delivery</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center text-white/80 border border-white/10 shrink-0">
                    <Mail className="w-4 h-4 text-red-400" />
                  </div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-white transition-colors underline underline-offset-4"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links & Local Inquiries Viewer */}
            <div className="pt-8 border-t border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.a
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  href="https://youtube.com/@MrWhoNow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-[#a1a1a6] hover:text-white border border-white/[0.06] transition-colors"
                  title="YouTube @MrWhoNow"
                >
                  <Youtube className="w-4 h-4" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  href="https://instagram.com/nccseadistrict"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-[#a1a1a6] hover:text-white border border-white/[0.06] transition-colors"
                  title="Instagram @nccseadistrict"
                >
                  <Instagram className="w-4 h-4" />
                </motion.a>
              </div>

              {inquiryCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onOpenInbox}
                  className="text-xs font-medium text-[#86868b] hover:text-white flex items-center gap-2 transition-colors px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]"
                >
                  <Inbox className="w-3.5 h-3.5 text-red-400" />
                  <span>Inbox ({inquiryCount} logged)</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Apple-style Form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Service Selector Chips */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a6] mb-3">
                      What service are you inquiring about?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {serviceOptions.map((opt) => {
                        const selected = formData.serviceType === opt;
                        return (
                          <motion.button
                            type="button"
                            key={opt}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setFormData({ ...formData, serviceType: opt })}
                            className={`p-3 rounded-2xl text-xs font-medium tracking-tight text-left transition-all ${
                              selected
                                ? 'bg-white text-black font-semibold shadow-lg shadow-white/10'
                                : 'bg-white/[0.03] text-[#86868b] hover:bg-white/[0.06] hover:text-[#d1d1d6] border border-white/[0.06]'
                            }`}
                          >
                            {opt}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a6] mb-2"
                      >
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jane Doe or Organization"
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a6] mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@organization.com"
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                  </div>

                  {/* Date & Budget Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-date"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a6] mb-2"
                      >
                        Target Date (Optional)
                      </label>
                      <input
                        id="contact-date"
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-budget"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a6] mb-2"
                      >
                        Estimated Budget
                      </label>
                      <select
                        id="contact-budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#18181b] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-red-500/50 transition-all"
                      >
                        {budgetOptions.map((b) => (
                          <option key={b} value={b} className="bg-[#18181b] text-white">
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a6] mb-2"
                    >
                      Project Details & Location *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your event scale, location, specific visual angles, or delivery timeline..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] transition-all resize-none"
                    />
                  </div>

                  {/* Submit Action */}
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-white text-black font-semibold text-sm tracking-tight hover:bg-[#ececf0] transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Submit Booking Inquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                    <p className="text-[11px] text-[#71717a] text-center mt-3">
                      Responses typically provided within 12–24 business hours.
                    </p>
                  </div>
                </motion.form>
              ) : (
                /* Success Confirmation */
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 px-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] text-center space-y-5"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Inquiry Received!
                  </h3>
                  <p className="text-sm text-[#a1a1a6] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your project brief has been recorded. Juztin will review your specifications and follow up via email shortly.
                  </p>

                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white transition-colors"
                    >
                      Send Another Message
                    </button>
                    <a
                      href={`mailto:${profile.email}?subject=Follow-up:%20Photography%20Booking`}
                      className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-[#ececf0] transition-colors"
                    >
                      Direct Email Client
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

