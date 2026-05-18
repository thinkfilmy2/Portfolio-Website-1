import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

const footerLinks = {
  Navigate: [
    { label: 'Home', href: '#' },
    { label: 'Case Study', href: '#work' },
    { label: 'About Us', href: '#about' },
    { label: 'Blog', href: '#' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#' },
  ],
  Connect: [
    { label: 'Instagram', href: 'https://www.instagram.com/think_filmy/' },
    { label: 'Email', href: 'mailto:upananadadebnath@gmail.com?subject=Project%20Inquiry' },
  ],
  Legal: [
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

function FooterLink({ href, label, index }: { href: string; label: string; index: number }) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto');
  return (
    <motion.a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={!isExternal ? (e) => {
        e.preventDefault();
        if (href === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      } : undefined}
      custom={index}
      variants={linkVariants}
      className="text-sm cursor-pointer w-fit hover-underline"
      style={{ color: '#86868b' }}
      whileHover={{ color: '#f5f5f7', x: 4 }}
    >
      {label}
    </motion.a>
  );
}

function BrandReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const chars = 'UPANANDA DEBNATH'.split('');
  return (
    <div ref={ref} className="text-xl font-semibold tracking-tight mb-2 flex" style={{ color: '#f5f5f7' }}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className={char === ' ' ? 'w-2' : ''}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.4, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <footer ref={ref} className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <motion.div className="absolute top-0 left-0 w-full h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.2), rgba(41,151,255,0.2), transparent)' }}
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} />
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mb-10 md:mb-16">
          <BrandReveal />
          <motion.div className="text-sm" style={{ color: '#86868b' }}
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}>
            Motion Designer & Video Editor
          </motion.div>
        </motion.div>
        <motion.div variants={containerVariants} initial="hidden"
          animate={inView ? 'visible' : 'hidden'} className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-16">
          {(Object.entries(footerLinks) as [string, { label: string; href: string }[]][]).map(([section, links]) => (
            <motion.div key={section} variants={columnVariants}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-5"
                style={{ color: 'rgba(134,134,139,0.5)' }}>{section}</div>
              <div className="flex flex-col gap-3">
                {links.map((link, i) => (<FooterLink key={link.label} {...link} index={i} />))}
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 relative"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <motion.div className="absolute top-0 left-0 w-full h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: 'easeInOut' }} />
          <motion.div className="text-xs" style={{ color: '#86868b' }} whileHover={{ color: '#f5f5f7' }}>
            © {new Date().getFullYear()} Upananda Debnath. All rights reserved.
          </motion.div>
          <motion.div className="text-xs" style={{ color: 'rgba(134,134,139,0.5)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            Crafted with motion & passion.
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
