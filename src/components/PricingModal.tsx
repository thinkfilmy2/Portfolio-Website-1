import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const pricingData = [
  {
    title: 'Video Editing',
    subtitle: 'Short videos, reels, ads, YouTube edits',
    tiers: [
      { name: 'Basic', price: '$50' },
      { name: 'Standard', price: '$120' },
      { name: 'Premium', price: '$300+' },
    ],
    accent: '#8b5cf6',
  },
  {
    title: 'SaaS Motion Design',
    subtitle: 'UI animations, explainer videos, product demos',
    tiers: [
      { name: 'Basic', price: '$200' },
      { name: 'Standard', price: '$600' },
      { name: 'Premium', price: '$1500+' },
    ],
    accent: '#2997ff',
  },
  {
    title: 'AI Content Creation',
    subtitle: 'AI reels, ads, social content',
    tiers: [
      { name: 'Basic', price: '$80' },
      { name: 'Standard', price: '$200' },
      { name: 'Premium', price: '$500+' },
    ],
    accent: '#ec4899',
  },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 28,
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 30,
    transition: { duration: 0.25, ease: [0.76, 0, 0.24, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const tierVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop — heavy blur */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(24px) saturate(120%)',
              WebkitBackdropFilter: 'blur(24px) saturate(120%)',
            }}
            onClick={onClose}
          />

          {/* Modal — glass panel */}
          <motion.div
            className="relative w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 md:p-10 no-scrollbar"
            style={{
              background: 'rgba(20,20,25,0.85)',
              backdropFilter: 'blur(60px) saturate(200%)',
              WebkitBackdropFilter: 'blur(60px) saturate(200%)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center z-10 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#86868b',
              }}
              whileHover={{ scale: 1.1, rotate: 90, color: '#f5f5f7' }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Header */}
            <motion.div className="text-center mb-10" variants={cardVariants}>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3" style={{ color: '#f5f5f7' }}>
                My <span className="shimmer-text">Pricing</span>
              </h2>
              <p className="max-w-lg mx-auto text-sm" style={{ color: '#86868b' }}>
                Transparent pricing tailored to your project scope. Every package includes revisions and direct communication.
              </p>
            </motion.div>

            {/* Pricing cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {pricingData.map((category, catIndex) => (
                <motion.div
                  key={category.title}
                  variants={cardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  className="glass glass-hover rounded-2xl p-6 relative overflow-hidden group"
                >
                  {/* Accent top line */}
                  <motion.div
                    className="absolute top-0 left-0 h-[1px] rounded-t-2xl"
                    style={{ background: category.accent }}
                    initial={{ width: '0%' }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 + catIndex * 0.1 }}
                  />

                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold mb-1" style={{ color: '#f5f5f7' }}>{category.title}</h3>
                    <p className="text-xs mb-6" style={{ color: '#86868b' }}>{category.subtitle}</p>

                    <div className="space-y-2">
                      {category.tiers.map((tier, tierIndex) => (
                        <motion.div
                          key={tier.name}
                          custom={tierIndex + catIndex * 3}
                          variants={tierVariants}
                          className="flex items-center justify-between py-3 px-4 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.02)' }}
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                        >
                          <span className="text-sm font-medium" style={{ color: '#86868b' }}>{tier.name}</span>
                          <span
                            className="text-base font-semibold"
                            style={{ color: tier.name === 'Premium' ? category.accent : '#f5f5f7' }}
                          >
                            {tier.price}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div className="text-center mt-10" variants={cardVariants}>
              <motion.button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    document.getElementById('project-brief')?.scrollIntoView({ behavior: 'smooth' });
                  }, 350);
                }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#f5f5f7',
                  backdropFilter: 'blur(16px)',
                }}
                whileHover={{
                  scale: 1.04,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  borderColor: 'rgba(255,255,255,0.2)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                Let's Discuss Your Project
              </motion.button>
              <p className="text-xs mt-4" style={{ color: '#86868b' }}>Custom quotes available for larger projects</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
