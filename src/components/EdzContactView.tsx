import React, { useState, useEffect } from 'react';
import { Mail, Check, AlertCircle, Copy, ExternalLink, Instagram } from 'lucide-react';
import { ContactInquiry, PortfolioProfile } from '../types';

interface EdzContactViewProps {
  profile: PortfolioProfile;
  onSubmitInquiry: (inquiry: ContactInquiry) => void;
}

export const EdzContactView: React.FC<EdzContactViewProps> = ({
  profile,
  onSubmitInquiry,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: 'Sports & Combat Events',
    eventDate: '',
    budget: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedInquiry, setLastSubmittedInquiry] = useState<ContactInquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Restore draft from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('juztin_contact_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setFormData((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {}
  }, []);

  // Sync draft to sessionStorage
  useEffect(() => {
    try {
      if (formData.name || formData.email || formData.message) {
        sessionStorage.setItem('juztin_contact_draft', JSON.stringify(formData));
      }
    } catch {}
  }, [formData]);

  const contactEmail = profile.email || 'mrwhonow01@gmail.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = contactEmail;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Silently block automated bot submissions
    if (honeypot.trim() !== '') {
      setIsSubmitting(false);
      setSubmitted(true);
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMessage('Please fill in your name, email, and a quick message so I know how to get back to you.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMessage('Please double-check your email address (e.g. name@example.com).');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const newInquiry: ContactInquiry = {
        id: `inq-${Date.now()}`,
        name: trimmedName,
        email: trimmedEmail,
        serviceType: formData.serviceType,
        eventDate: formData.eventDate.trim() || undefined,
        budget: formData.budget.trim() || undefined,
        message: trimmedMessage,
        timestamp: new Date().toISOString(),
      };

      onSubmitInquiry(newInquiry);
      setLastSubmittedInquiry(newInquiry);
      try {
        sessionStorage.removeItem('juztin_contact_draft');
      } catch {}
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        serviceType: 'Sports & Combat Events',
        eventDate: '',
        budget: '',
        message: '',
      });
    }, 450);
  };

  // Generate mailto link for direct sending
  const getMailtoHref = () => {
    if (!lastSubmittedInquiry) {
      return `mailto:${contactEmail}`;
    }
    const subject = encodeURIComponent(
      `[Portfolio Inquiry] ${lastSubmittedInquiry.serviceType} - ${lastSubmittedInquiry.name}`
    );
    const body = encodeURIComponent(
      `Hi Juztin,\n\nName: ${lastSubmittedInquiry.name}\nEmail: ${lastSubmittedInquiry.email}\nService: ${lastSubmittedInquiry.serviceType}\nTarget Date: ${lastSubmittedInquiry.eventDate || 'Flexible / N/A'}\n\nMessage:\n${lastSubmittedInquiry.message}\n\n---\nSent via Photography Portfolio Contact Form`
    );
    return `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full max-w-[850px] mx-auto text-[#666666] pt-1">
      {/* Header section matching user design */}
      <header className="mb-8">
        <h1 className="font-schoolbell text-[32px] sm:text-[38px] md:text-[42px] text-[#1a1a1a] tracking-normal select-none mb-2">
          Let's work together!
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#555555] leading-relaxed max-w-[720px]">
          Have an upcoming fight night, performance, or media assignment? Drop a message below, or reach out directly via{' '}
          <a
            href={`mailto:${contactEmail}`}
            className="text-black font-semibold underline underline-offset-2 hover:text-neutral-700 transition-colors"
          >
            email
          </a>{' '}
          or{' '}
          <a
            href={profile.instagram || 'https://www.instagram.com/quietframes.sg/'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-semibold underline underline-offset-2 hover:text-neutral-700 transition-colors"
          >
            Instagram
          </a>
          .
        </p>

        {/* Quick Direct Contact Badges */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-50 border border-neutral-200 text-[12px] text-[#333333]">
            <Mail className="w-3.5 h-3.5 text-neutral-500" />
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-black hover:underline"
            >
              {contactEmail}
            </a>
            <button
              type="button"
              id="contact-copy-email-btn"
              onClick={handleCopyEmail}
              className="ml-1 inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-gray-200 hover:border-black text-black transition-colors cursor-pointer"
              title="Copy email address to clipboard"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <a
            href={profile.instagram || 'https://www.instagram.com/quietframes.sg/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-50 border border-neutral-200 text-[12px] text-[#333333] hover:border-black hover:text-black transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-neutral-500" />
            <span className="font-medium">@quietframes.sg</span>
            <ExternalLink className="w-3 h-3 text-neutral-400 ml-0.5" />
          </a>
        </div>
      </header>

      <div className="space-y-8">

        {/* Success Banner */}
        {submitted && (
          <div
            id="contact-success-banner"
            className="border-t-2 border-b-2 border-black py-5 my-6 text-black bg-neutral-50/50 p-4 space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold">
                  Thanks for reaching out! Your message has been received.
                </h4>
                <p className="text-[13px] text-[#555555]">
                  I review all event and project inquiries personally and will get back to you shortly at{' '}
                  <span className="font-semibold text-black">
                    {lastSubmittedInquiry?.email}
                  </span>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 pl-8 text-[11px] uppercase tracking-wider font-medium">
              <a
                href={getMailtoHref()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-neutral-800 transition-colors"
                title="Launch email client with pre-filled details"
              >
                <span>Open in Email App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="underline hover:text-gray-600 cursor-pointer"
              >
                Send another message
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            id="contact-error-banner"
            className="border border-red-200 bg-red-50 p-3 text-red-700 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="w-full sm:w-[85%] md:w-[75%] space-y-4">
          {/* Anti-spam honeypot (hidden from human visitors) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-website-hp">Website</label>
            <input
              id="contact-website-hp"
              name="website_hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="contact-name"
              className="block text-[12px] uppercase tracking-wider font-semibold text-black mb-1.5"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alex Tan or Bushido Fight Academy"
              className="w-full text-[13px] text-[#222222] p-2.5 bg-transparent border border-black/20 focus:border-black outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="block text-[12px] uppercase tracking-wider font-semibold text-black mb-1.5"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full text-[13px] text-[#222222] p-2.5 bg-transparent border border-black/20 focus:border-black outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="contact-service"
                className="block text-[12px] uppercase tracking-wider font-semibold text-black mb-1.5"
              >
                Category
              </label>
              <select
                id="contact-service"
                name="serviceType"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full text-[13px] text-[#222222] p-2.5 bg-white border border-black/20 focus:border-black outline-none transition-colors cursor-pointer"
              >
                <option value="Sports & Combat Events">Sports & Combat Events</option>
                <option value="Stage & Live Performances">Stage & Live Performances</option>
                <option value="Community & Corporate Events">Community & Corporate Events</option>
                <option value="Videography & Motion">Videography & Motion</option>
                <option value="Other Inquiries">Other Inquiries</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-date"
                className="block text-[12px] uppercase tracking-wider font-semibold text-black mb-1.5"
              >
                Target Date (Optional)
              </label>
              <input
                id="contact-date"
                name="eventDate"
                type="text"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                placeholder="e.g. November 2025, or Flexible"
                className="w-full text-[13px] text-[#222222] p-2.5 bg-transparent border border-black/20 focus:border-black outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="contact-message"
                className="block text-[12px] uppercase tracking-wider font-semibold text-black"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] font-mono text-zinc-400">
                {formData.message.length} / 1000
              </span>
            </div>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              maxLength={1000}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell me a little about your project or event—dates, location, coverage required, or any specific shots you're looking for."
              className="w-full text-[13px] text-[#222222] p-2.5 bg-transparent border border-black/20 focus:border-black outline-none transition-colors resize-y"
            />
          </div>

          <div className="pt-2">
            <button
              id="contact-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white text-[11px] uppercase tracking-[0.15em] font-medium px-7 py-3 hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isSubmitting ? 'Sending Inquiry...' : 'Send Inquiry'}
            </button>
          </div>
        </form>

        {/* Direct contact note & availability */}
        <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-[12px] text-[#888888] gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Available for bookings & event assignments across {profile.location || 'Singapore'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Direct contact:</span>
            <a
              href={`mailto:${contactEmail}`}
              className="text-black font-semibold underline hover:text-black/80"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
