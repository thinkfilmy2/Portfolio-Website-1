import React, { useState, useRef, forwardRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, Mail, Clock, MessageSquare, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';

const serviceOptions = [
  'Video Editing',
  'Motion Graphics',
  'SaaS Product Demo',
  'Explainer Video',
  'Social Media Content',
  'AI Video Generation',
  'Color Grading',
  'Other',
];

const scriptOptions = ['Yes', 'No', 'Need Help'];
const assetOptions = ['Yes', 'No', 'Partially'];
const lengthOptions = ['Under 30s', '30s - 1 min', '1 - 3 min', '3 - 5 min', '5+ min'];
const industryOptions = ['Tech / SaaS', 'E-commerce', 'Finance', 'Healthcare', 'Education', 'Entertainment', 'Other'];
const budgetOptions = ['Under $200', '$200 - $500', '$500 - $1,000', '$1,000 - $3,000', '$3,000+'];

/* ── Animation Variants ── */
const sectionReveal: any = {
  hidden: { opacity: 0, y: 60, filter: 'blur(8px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const fieldReveal: any = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardSlide: any = {
  hidden: { opacity: 0, x: 40, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.6, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Custom Select ── */
function CustomSelect({
  label, required, options, value, onChange, placeholder,
}: {
  label: string; required?: boolean; options: string[];
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${open ? 'z-50' : 'z-0'}`}>
      <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>
        {label} {required && <span style={{ color: '#8b5cf6' }}>*</span>}
      </label>
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-left cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: value ? '#f5f5f7' : '#52525b',
        }}
        whileHover={{ borderColor: 'rgba(139,92,246,0.3)' }}
        whileTap={{ scale: 0.99 }}
      >
        <span>{value || placeholder}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" style={{ color: '#52525b' }} />
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden no-scrollbar"
            style={{
              background: 'rgba(20,20,25,0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {options.map((opt) => (
              <motion.button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm cursor-pointer"
                style={{ color: opt === value ? '#8b5cf6' : '#a1a1aa' }}
                whileHover={{ backgroundColor: 'rgba(139,92,246,0.08)', color: '#f5f5f7' }}
              >
                {opt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Form Component ── */
const ProjectBriefForm = forwardRef<HTMLElement>((_, ref) => {
  const internalRef = useRef<HTMLElement>(null);
  const sectionRef = (ref as React.RefObject<HTMLElement>) || internalRef;
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const [formData, setFormData] = useState({
    name: '', company: '', email: '', website: '',
    service: '', script: '', assets: '', length: '',
    deadline: '', industry: '', budget: '', description: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xdabwner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) {
        setFormData({
          name: '', company: '', email: '', website: '',
          service: '', script: '', assets: '', length: '',
          deadline: '', industry: '', budget: '', description: '',
        });
        setAgreed(false);
      }
    } catch {
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f5f5f7',
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const steps = [
    { num: '1', title: 'We review your brief', desc: 'Expect a response within 24 hours with initial thoughts and questions.' },
    { num: '2', title: '30-min discovery call', desc: 'We hop on a call to understand your vision, goals, and timeline.' },
    { num: '3', title: 'Custom proposal', desc: 'Detailed scope, timeline, and fixed-fee pricing. No surprises.' },
  ];

  return (
    <section ref={sectionRef} id="project-brief" className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mb-16 max-w-2xl"
        >
          <motion.span
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 block"
            style={{ color: '#8b5cf6' }}
          >
            Let's Make Something
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6" style={{ color: '#f5f5f7', lineHeight: 1.1 }}>
            Tell us about your next{' '}
            <span style={{ fontStyle: 'italic', color: '#a1a1aa' }}>project.</span>
          </h2>
          <p className="text-base md:text-lg mb-6" style={{ color: '#86868b', lineHeight: 1.7 }}>
            To ensure high quality and creative productions, our projects start
            from a budget of $200. This allows us to dedicate the necessary time and
            resources for the best possible production.
          </p>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
            animate={{ boxShadow: ['0 0 0 rgba(139,92,246,0)', '0 0 16px rgba(139,92,246,0.15)', '0 0 0 rgba(139,92,246,0)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: '#fbbf24' }} />
            <span className="text-xs font-medium" style={{ color: '#a1a1aa' }}>
              Only a few slots remaining for Q2 2026.
            </span>
          </motion.div>
        </motion.div>

        {/* Main Grid: Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Left: Form */}
          <motion.form
            onSubmit={handleSubmit}
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {/* Contact Info */}
            <motion.div variants={fieldReveal} className="mb-10 relative z-50">
              <h3 className="text-lg font-semibold mb-6" style={{ color: '#f5f5f7' }}>Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>
                    Name <span style={{ color: '#8b5cf6' }}>*</span>
                  </label>
                  <input
                    required value={formData.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Jane Smith"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(139,92,246,0.4)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>
                    Company name <span style={{ color: '#8b5cf6' }}>*</span>
                  </label>
                  <input
                    required value={formData.company}
                    onChange={(e) => update('company', e.target.value)}
                    placeholder="Acme Inc."
                    style={{ ...inputStyle, background: 'rgba(255,255,255,0.06)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(139,92,246,0.4)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>
                    Email <span style={{ color: '#8b5cf6' }}>*</span>
                  </label>
                  <input
                    type="email" required value={formData.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="jane@company.com"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(139,92,246,0.4)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>
                    Website <span style={{ color: '#8b5cf6' }}>*</span>
                  </label>
                  <input
                    required value={formData.website}
                    onChange={(e) => update('website', e.target.value)}
                    placeholder="https://company.com"
                    style={{ ...inputStyle, background: 'rgba(255,255,255,0.06)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(139,92,246,0.4)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
              </div>
            </motion.div>

            {/* Project Info */}
            <motion.div variants={fieldReveal} className="mb-10 relative z-40">
              <h3 className="text-lg font-semibold mb-6" style={{ color: '#f5f5f7' }}>Project Information</h3>
              <div className="space-y-4">
                <CustomSelect label="Service Needed" required options={serviceOptions} value={formData.service} onChange={(v) => update('service', v)} placeholder="Select a service..." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CustomSelect label="Is there already a script/storyboard?" required options={scriptOptions} value={formData.script} onChange={(v) => update('script', v)} placeholder="Select..." />
                  <CustomSelect label="Do you already have assets/wireframes?" options={assetOptions} value={formData.assets} onChange={(v) => update('assets', v)} placeholder="Select..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CustomSelect label="Planned Animation length" required options={lengthOptions} value={formData.length} onChange={(v) => update('length', v)} placeholder="Select length..." />
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>
                      Preferred deadline
                    </label>
                    <input
                      type="text" value={formData.deadline}
                      onChange={(e) => update('deadline', e.target.value)}
                      placeholder="When do you need this?"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(139,92,246,0.4)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                    />
                  </div>
                </div>
                <CustomSelect label="Industry" required options={industryOptions} value={formData.industry} onChange={(v) => update('industry', v)} placeholder="Select your industry..." />
                <CustomSelect label="Budget Range" required options={budgetOptions} value={formData.budget} onChange={(v) => update('budget', v)} placeholder="Select budget range..." />
              </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={fieldReveal} className="mb-8 relative z-30">
              <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>
                Tell Us About Your Project <span style={{ color: '#8b5cf6' }}>*</span>
              </label>
              <textarea
                required rows={5} value={formData.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="What are you looking to create? What's the goal? Any reference links?"
                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(139,92,246,0.4)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </motion.div>

            {/* Checkbox */}
            <motion.div variants={fieldReveal} className="mb-8 flex items-start gap-3 relative z-20">
              <motion.button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className="mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center cursor-pointer"
                style={{
                  background: agreed ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${agreed ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence>
                  {agreed && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <CheckCircle className="w-3 h-3" style={{ color: '#8b5cf6' }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <span className="text-xs leading-relaxed" style={{ color: '#86868b' }}>
                I agree to the processing of my data according to the{' '}
                <span className="hover-underline cursor-pointer" style={{ color: '#a1a1aa' }}>Privacy Policy</span>
                {' '}&{' '}
                <span className="hover-underline cursor-pointer" style={{ color: '#a1a1aa' }}>Terms</span>
                {' '}<span style={{ color: '#8b5cf6' }}>*</span>
              </span>
            </motion.div>

            {/* Submit */}
            <motion.div variants={fieldReveal} className="relative z-10">
              <motion.button
                type="submit"
                disabled={!agreed || status === 'sending'}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-10 py-4 rounded-full font-semibold text-base cursor-pointer relative overflow-hidden"
                style={{
                  background: agreed
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)'
                    : 'rgba(255,255,255,0.04)',
                  color: agreed ? '#fff' : '#52525b',
                  border: '1px solid transparent',
                  opacity: status === 'sending' ? 0.7 : 1,
                }}
                whileHover={agreed ? {
                  scale: 1.03,
                  boxShadow: '0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(139,92,246,0.1)',
                } : {}}
                whileTap={agreed ? { scale: 0.97 } : {}}
              >
                {/* Shimmer */}
                {agreed && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                  />
                )}
                <span className="relative z-10">
                  {status === 'sending' ? 'Sending...' : status === 'success' ? 'Brief Sent!' : 'Send Project Brief'}
                </span>
                {status !== 'sending' && status !== 'success' && (
                  <Send className="w-4 h-4 relative z-10" />
                )}
                {status === 'success' && (
                  <CheckCircle className="w-4 h-4 relative z-10" />
                )}
              </motion.button>

              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 mt-3 text-xs"
                  style={{ color: '#ef4444' }}
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Something went wrong. Please try again.
                </motion.p>
              )}

              <p className="text-xs mt-4" style={{ color: '#52525b' }}>
                No NDAs or contracts needed at this stage. Just tell us what you need.
              </p>
            </motion.div>
          </motion.form>

          {/* Right: Sidebar */}
          <div className="flex flex-col gap-6">
            {/* What Happens Next */}
            <motion.div
              custom={0}
              variants={cardSlide}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <h4 className="text-base font-semibold mb-5" style={{ color: '#f5f5f7' }}>
                What Happens Next?
              </h4>
              <div className="space-y-5">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.num}
                    className="flex gap-3.5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                  >
                    <motion.div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold"
                      style={{
                        background: 'rgba(139,92,246,0.1)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        color: '#8b5cf6',
                      }}
                      whileHover={{ scale: 1.15, boxShadow: '0 0 12px rgba(139,92,246,0.3)' }}
                    >
                      {step.num}
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium mb-0.5" style={{ color: '#f5f5f7' }}>{step.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#52525b' }}>{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Info Card */}
            <motion.div
              custom={1}
              variants={cardSlide}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(41,151,255,0.3), transparent)' }}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.7 }}
              />
              <h4 className="text-base font-semibold mb-5" style={{ color: '#f5f5f7' }}>
                Contact Info
              </h4>
              <div className="space-y-4">
                {[
                  { icon: <Mail className="w-4 h-4" />, label: 'EMAIL', value: 'upananadadebnath@gmail.com' },
                  { icon: <Clock className="w-4 h-4" />, label: 'RESPONSE TIME', value: 'Within 24 hours' },
                  { icon: <MessageSquare className="w-4 h-4" />, label: 'SOCIAL', value: 'Instagram' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#86868b' }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: '#52525b' }}>
                        {item.label}
                      </p>
                      <p className="text-sm" style={{ color: '#a1a1aa' }}>{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
});

ProjectBriefForm.displayName = 'ProjectBriefForm';
export default ProjectBriefForm;
