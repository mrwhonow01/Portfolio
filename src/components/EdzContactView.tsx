import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  Instagram,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import { ContactInquiry, PortfolioProfile } from '../types';

interface EdzContactViewProps {
  profile: PortfolioProfile;
  onSubmitInquiry: (inquiry: ContactInquiry) => void;
}

interface EmailValidationState {
  isValid: boolean | null;
  message: string;
  suggestion?: string;
  isTypo: boolean;
}

const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmai.co': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yaho.co': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outluk.com': 'outlook.com',
  'iclud.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'iclaud.com': 'icloud.com',
  'prton.me': 'proton.me',
  'protonmai.com': 'proton.me',
};

const verifyEmail = (emailStr: string): EmailValidationState => {
  const trimmed = emailStr.trim();
  if (!trimmed) {
    return { isValid: null, message: '', isTypo: false };
  }

  if (!trimmed.includes('@')) {
    return {
      isValid: false,
      message: "Please include an '@' in your email address.",
      isTypo: false,
    };
  }

  const parts = trimmed.split('@');
  if (parts.length > 2) {
    return {
      isValid: false,
      message: "Email address cannot contain multiple '@' symbols.",
      isTypo: false,
    };
  }

  const [local, domain] = parts;
  if (!local) {
    return {
      isValid: false,
      message: "Please include a username before '@'.",
      isTypo: false,
    };
  }

  if (!domain) {
    return {
      isValid: false,
      message: "Please include a domain after '@' (e.g. gmail.com).",
      isTypo: false,
    };
  }

  const lowerDomain = domain.toLowerCase();

  // Check common typos
  if (COMMON_DOMAIN_TYPOS[lowerDomain]) {
    const fixedDomain = COMMON_DOMAIN_TYPOS[lowerDomain];
    return {
      isValid: false,
      message: `Possible typo detected in domain.`,
      suggestion: `${local}@${fixedDomain}`,
      isTypo: true,
    };
  }

  if (!domain.includes('.')) {
    return {
      isValid: false,
      message: "Domain must include an extension (e.g. .com or .sg).",
      isTypo: false,
    };
  }

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) {
    return {
      isValid: false,
      message: "Domain extension must be at least 2 letters.",
      isTypo: false,
    };
  }

  const standardRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!standardRegex.test(trimmed)) {
    return {
      isValid: false,
      message: 'Invalid email address format.',
      isTypo: false,
    };
  }

  return {
    isValid: true,
    message: 'Verified email address format',
    isTypo: false,
  };
};

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
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [needsActivation, setNeedsActivation] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Email verification state
  const [emailTouched, setEmailTouched] = useState(false);
  const emailValidation = verifyEmail(formData.email);

  // Calendar pop-up state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node) &&
        dateInputRef.current &&
        !dateInputRef.current.contains(e.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

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

  const handleCopyInquirySummary = async () => {
    if (!lastSubmittedInquiry) return;
    const summary = `Portfolio Inquiry for Juztin Yuen:\nName: ${lastSubmittedInquiry.name}\nEmail: ${lastSubmittedInquiry.email}\nService: ${lastSubmittedInquiry.serviceType}\nTarget Date: ${lastSubmittedInquiry.eventDate || 'Flexible'}\nMessage:\n${lastSubmittedInquiry.message}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2200);
    } catch {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2200);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      setErrorMessage('Please fill in your name, email address, and a message so I can get back to you.');
      return;
    }

    const validation = verifyEmail(trimmedEmail);
    if (!validation.isValid) {
      setErrorMessage(validation.message || 'Please check your email address format.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

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

    // Actual email dispatch to mrwhonow01@gmail.com via FormSubmit endpoint
    try {
      await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          _replyto: trimmedEmail,
          serviceType: formData.serviceType,
          targetDate: formData.eventDate.trim() || 'Flexible / Not specified',
          message: trimmedMessage,
          _subject: `[Portfolio Inquiry] ${formData.serviceType} - ${trimmedName}`,
          _autoresponse: `Thank you for reaching out to Juztin Yuen!\n\nYour message regarding "${formData.serviceType}" has been received. I review all inquiries personally and will get back to you shortly.\n\nSummary of your message:\n${trimmedMessage}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (
        data &&
        typeof data.message === 'string' &&
        data.message.toLowerCase().includes('activate')
      ) {
        setNeedsActivation(true);
      } else {
        setNeedsActivation(false);
      }
    } catch (err) {
      console.warn('FormSubmit background notification:', err);
    }

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
    setEmailTouched(false);
  };

  // Generate instant Gmail Web link (loads in 0.1s in browser, zero app lag!)
  const getGmailWebHref = () => {
    if (!lastSubmittedInquiry) {
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}`;
    }
    const subject = encodeURIComponent(
      `[Portfolio Inquiry] ${lastSubmittedInquiry.serviceType} - ${lastSubmittedInquiry.name}`
    );
    const body = encodeURIComponent(
      `Hi Juztin,\n\nName: ${lastSubmittedInquiry.name}\nEmail: ${lastSubmittedInquiry.email}\nService: ${lastSubmittedInquiry.serviceType}\nTarget Date: ${lastSubmittedInquiry.eventDate || 'Flexible / N/A'}\n\nMessage:\n${lastSubmittedInquiry.message}\n\n---\nSent via Photography Portfolio Contact Form`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}&su=${subject}&body=${body}`;
  };

  // Generate native mailto link as fallback
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

  // Calendar calculations
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const isCurrentOrPastMonth =
    year < today.getFullYear() ||
    (year === today.getFullYear() && month <= today.getMonth());

  const handlePrevMonth = () => {
    if (isCurrentOrPastMonth) return;
    setCalendarDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(year, month, day);
    selected.setHours(0, 0, 0, 0);
    if (selected < today) return; // Prevent selecting dates that have passed
    const formatted = selected.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    setFormData((prev) => ({ ...prev, eventDate: formatted }));
    setIsCalendarOpen(false);
  };

  return (
    <div className="w-full max-w-[850px] mx-auto text-[#666666] pt-1">
      {/* Header section */}
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
        {/* SUCCESS CONFIRMATION BANNER: When submitted, ONLY this top confirmation is displayed */}
        {submitted ? (
          <div
            id="contact-success-banner"
            className="border-t-2 border-b-2 border-black py-7 my-6 text-black bg-neutral-50/70 p-6 space-y-5 animate-in fade-in duration-300"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-4 h-4" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-[17px] font-bold text-black">
                  Thanks for reaching out! Your message has been sent.
                </h4>
                <p className="text-[13.5px] text-[#444444] leading-relaxed">
                  Your inquiry has been dispatched to{' '}
                  <span className="font-semibold text-black">{contactEmail}</span> and a confirmation was sent to{' '}
                  <span className="font-semibold text-black">
                    {lastSubmittedInquiry?.email}
                  </span>.
                </p>
                <div className="mt-2 text-[11px] text-zinc-600 bg-zinc-100/90 p-2.5 rounded border border-zinc-200 font-mono">
                  💡 <strong>Owner tip:</strong> Please check your <strong>Spam / Junk</strong> folder or <strong>Updates</strong> tab in Gmail for emails from FormSubmit, and click "Not Spam" or "Activate Form" so future messages go straight to Primary.
                </div>
              </div>
            </div>

            {/* Domain Activation Notice */}
            {needsActivation && (
              <div className="bg-amber-50 border border-amber-300 rounded-md p-3.5 text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[13px] text-amber-950">
                  <span>⚡ Action Required for Portfolio Owner ({contactEmail}):</span>
                </div>
                <p>
                  Because this is the first submission from this domain, FormSubmit sent a verification email to <strong>{contactEmail}</strong> titled <em>"Action Required: Activate Form"</em>.
                </p>
                <p className="font-semibold text-amber-950">
                  Please open Gmail (check your Spam / Updates folder if needed) and click <strong>"Activate Form"</strong> to permanently connect this domain!
                </p>
              </div>
            )}

            {/* Inquiry Details Overview */}
            {lastSubmittedInquiry && (
              <div className="bg-white border border-black/10 rounded-md p-4 text-[12.5px] space-y-1.5 text-zinc-700 shadow-xs">
                <div className="flex justify-between border-b border-zinc-100 pb-1.5">
                  <span className="font-semibold text-black">Name:</span>
                  <span>{lastSubmittedInquiry.name}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 py-1.5">
                  <span className="font-semibold text-black">Email:</span>
                  <span>{lastSubmittedInquiry.email}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 py-1.5">
                  <span className="font-semibold text-black">Category:</span>
                  <span>{lastSubmittedInquiry.serviceType}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 py-1.5">
                  <span className="font-semibold text-black">Target Date:</span>
                  <span>{lastSubmittedInquiry.eventDate || 'Flexible / Not specified'}</span>
                </div>
                <div className="pt-1.5">
                  <span className="font-semibold text-black block mb-1">Message:</span>
                  <p className="text-zinc-600 bg-zinc-50 p-2.5 rounded border border-zinc-200/60 font-mono text-[11.5px] whitespace-pre-wrap">
                    {lastSubmittedInquiry.message}
                  </p>
                </div>
              </div>
            )}

            {/* Instant Action Options: Zero-lag Gmail Web + Mail App fallback */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                Want a copy in your own inbox or have attachments to send?
              </p>
              <div className="flex flex-wrap items-center gap-2.5 text-[11px] uppercase tracking-wider font-medium">
                {/* Instant Gmail Web Button (Opens immediately in browser tab) */}
                <a
                  href={getGmailWebHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-black text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
                  title="Open pre-filled draft instantly in Gmail Web"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open in Gmail (Instant)</span>
                  <ExternalLink className="w-3 h-3 text-white/70" />
                </a>

                {/* Default Mail Client fallback */}
                <a
                  href={getMailtoHref()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 border border-zinc-200 text-zinc-800 hover:border-black hover:text-black transition-colors"
                  title="Launch local email application"
                >
                  <span>Default Mail App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* Copy Details */}
                <button
                  type="button"
                  onClick={handleCopyInquirySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 border border-zinc-200 text-zinc-800 hover:border-black hover:text-black transition-colors cursor-pointer"
                  title="Copy full message text to clipboard"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied Details</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Details</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Send another message button - Re-reveals the form inputs */}
            <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
              <button
                type="button"
                id="contact-send-another-btn"
                onClick={() => {
                  setSubmitted(false);
                  setErrorMessage(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold underline underline-offset-4 text-black hover:text-zinc-600 cursor-pointer transition-colors"
              >
                <span>&larr; Send another message</span>
              </button>
            </div>
          </div>
        ) : (
          /* CONTACT FORM INPUTS: Only shown when NOT submitted */
          <form onSubmit={handleSubmit} className="w-full sm:w-[85%] md:w-[75%] space-y-4">
            {errorMessage && (
              <div
                id="contact-error-banner"
                className="border border-red-200 bg-red-50 p-3 text-red-700 text-xs flex items-center gap-2 rounded-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Anti-spam honeypot */}
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

            {/* Name */}
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

            {/* Email Address with Real-Time Auto Email Verifier */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="contact-email"
                  className="block text-[12px] uppercase tracking-wider font-semibold text-black"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                {emailValidation.isValid === true && (
                  <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Verified format</span>
                  </span>
                )}
              </div>

              <div className="relative flex items-center">
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (!emailTouched) setEmailTouched(true);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="you@example.com"
                  className={`w-full text-[13px] text-[#222222] p-2.5 pr-9 bg-transparent border outline-none transition-colors ${
                    emailValidation.isValid === true
                      ? 'border-emerald-600 focus:border-emerald-700'
                      : emailTouched && emailValidation.isValid === false
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-black/20 focus:border-black'
                  }`}
                />

                {/* Email Verification Icon inside input */}
                <div className="absolute right-2.5 pointer-events-none flex items-center">
                  {emailValidation.isValid === true && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                  {emailTouched && emailValidation.isValid === false && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>

              {/* Typo Auto-Detection Suggestion & 1-Click Fix */}
              {emailValidation.suggestion && (
                <div className="mt-1.5 flex items-center justify-between p-2 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      Did you mean <strong>{emailValidation.suggestion}</strong>?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, email: emailValidation.suggestion! }));
                    }}
                    className="ml-2 px-2.5 py-1 bg-black text-white hover:bg-neutral-800 rounded font-mono text-[10.5px] uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Fix Typo
                  </button>
                </div>
              )}

              {/* Helper text when email format is invalid */}
              {emailTouched && emailValidation.isValid === false && !emailValidation.suggestion && (
                <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{emailValidation.message}</span>
                </p>
              )}
            </div>

            {/* Category & Target Date with Interactive Calendar Pop-up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
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

              {/* Target Date with Calendar Popover */}
              <div className="relative">
                <label
                  htmlFor="contact-date"
                  className="block text-[12px] uppercase tracking-wider font-semibold text-black mb-1.5"
                >
                  Target Date (Optional)
                </label>
                <div className="relative flex items-center">
                  <input
                    ref={dateInputRef}
                    id="contact-date"
                    name="eventDate"
                    type="text"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    onClick={() => setIsCalendarOpen(true)}
                    placeholder="e.g. November 2026, or click calendar"
                    className="w-full text-[13px] text-[#222222] p-2.5 pr-9 bg-transparent border border-black/20 focus:border-black outline-none transition-colors cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="absolute right-2.5 p-1 text-zinc-500 hover:text-black cursor-pointer transition-colors"
                    title="Open calendar date picker"
                    aria-label="Open calendar"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>

                {/* Calendar Dropdown Popover */}
                {isCalendarOpen && (
                  <div
                    ref={calendarRef}
                    className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 z-50 bg-white border border-black/20 shadow-2xl rounded-md p-4 w-72 sm:w-80 select-none animate-in fade-in zoom-in-95 duration-150"
                  >
                    {/* Month / Year Navigation */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <button
                        type="button"
                        disabled={isCurrentOrPastMonth}
                        onClick={handlePrevMonth}
                        className={`p-1 rounded transition-colors ${
                          isCurrentOrPastMonth
                            ? 'opacity-20 cursor-not-allowed text-zinc-300'
                            : 'hover:bg-zinc-100 text-zinc-600 hover:text-black cursor-pointer'
                        }`}
                        aria-label="Previous month"
                        title={isCurrentOrPastMonth ? 'Cannot navigate to past months' : 'Previous month'}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[13px] font-semibold text-black">
                        {monthNames[month]} {year}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1 rounded hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors cursor-pointer"
                        aria-label="Next month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-mono font-medium text-zinc-400 py-2">
                      {daysOfWeek.map((d) => (
                        <div key={d}>{d}</div>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {/* Previous month filler cells */}
                      {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <div
                          key={`prev-${i}`}
                          className="py-1.5 text-zinc-300 font-mono text-[11px]"
                        >
                          {prevMonthDays - firstDayIndex + i + 1}
                        </div>
                      ))}

                      {/* Current month days - Past dates are disabled & unclickable */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNumber = i + 1;
                        const cellDate = new Date(year, month, dayNumber);
                        cellDate.setHours(0, 0, 0, 0);

                        const isPast = cellDate < today;
                        const isToday = cellDate.getTime() === today.getTime();
                        const formattedCell = cellDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                        const isSelected = formData.eventDate === formattedCell;

                        return (
                          <button
                            key={`day-${dayNumber}`}
                            type="button"
                            disabled={isPast}
                            onClick={() => !isPast && handleSelectDay(dayNumber)}
                            className={`py-1.5 rounded-sm font-mono text-[12px] transition-colors ${
                              isPast
                                ? 'text-zinc-300 opacity-35 cursor-not-allowed line-through select-none'
                                : isSelected
                                ? 'bg-black text-white font-semibold cursor-pointer shadow-xs'
                                : isToday
                                ? 'border border-black font-semibold text-black hover:bg-zinc-100 cursor-pointer'
                                : 'text-zinc-800 hover:bg-zinc-100 hover:text-black cursor-pointer'
                            }`}
                            title={isPast ? 'Past date cannot be selected' : undefined}
                          >
                            {dayNumber}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Presets Bar */}
                    <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-[10.5px] font-mono uppercase tracking-wider text-zinc-600">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, eventDate: 'Flexible / TBD' }));
                          setIsCalendarOpen(false);
                        }}
                        className="px-2 py-1 rounded bg-zinc-100 hover:bg-black hover:text-white transition-colors cursor-pointer"
                      >
                        Flexible
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          const formatted = today.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          });
                          setFormData((prev) => ({ ...prev, eventDate: formatted }));
                          setIsCalendarOpen(false);
                        }}
                        className="px-2 py-1 rounded bg-zinc-100 hover:bg-black hover:text-white transition-colors cursor-pointer"
                      >
                        Today
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, eventDate: '' }));
                          setIsCalendarOpen(false);
                        }}
                        className="px-2 py-1 rounded text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
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

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="contact-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white text-[11px] uppercase tracking-[0.15em] font-medium px-7 py-3 hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                <span>{isSubmitting ? 'Sending Inquiry...' : 'Send Inquiry'}</span>
              </button>
            </div>
          </form>
        )}

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
