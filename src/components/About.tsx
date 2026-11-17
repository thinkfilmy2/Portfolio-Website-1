import { motion, useInView, Variants, useMotionValue, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import type { Stat } from '../types/siteContent';
import './styles/About.css';

/* ── Animation Variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function getStatIcon(iconType: string) {
  switch (iconType) {
    case 'video':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18, color: '#22c55e' }}>
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18, color: '#22c55e' }}>
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'flask':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18, color: '#22c55e' }}>
          <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.756 4.388a1.5 1.5 0 01-1.394.862H8.15a1.5 1.5 0 01-1.394-.862L5 14.5m14 0H5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

function StatCard({ s, i }: { s: Stat; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-80px' });
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const numVal = parseInt(s.value.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = s.value.replace(/[0-9]/g, '');

  const motionValue = useMotionValue(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, numVal, {
        duration: 2.0,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => setCount(Math.round(latest)),
      });
      return () => controls.stop();
    }
  }, [isInView, numVal, motionValue]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      custom={i}
      variants={scaleIn}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="about-stat-card"
      style={{
        border: isHovered ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.3s ease',
      }}
      whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(34,197,94,0.12)' }}
    >
      {/* Interactive Spotlight Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(100px circle at ${coords.x}px ${coords.y}px, rgba(34,197,94,0.12), transparent 80%)`,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 3, width: '100%' }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: 10,
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {getStatIcon(s.iconType)}
        </div>
        <div>
          <span style={{ display: 'block', fontSize: 22, fontWeight: 700, color: '#f5f5f7', lineHeight: 1.2 }}>
            {count.toLocaleString()}
            {suffix}
          </span>
          <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 500, marginTop: 1 }}>
            {s.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const content = useSiteContent();
  const about = content.about;

  if (!about) return null;

  const stats = about.stats || [];
  const editingSoftware = about.editingSoftware || [];
  const aiTools = about.aiTools || [];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section"
    >
      {/* ── Green Glow Behind Photo ── */}
      <div className="about-photo-glow" />

      {/* ── Background Portrait ── */}
      <div className="about-photo-container">
        <motion.img
          src={about.image || "/images/05.2.1.webp"}
          alt={about.name || "Upananda Debnath"}
          className="about-photo-img"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Overlay gradients */}
        <div className="about-gradient-overlay" />
      </div>

      {/* ── Main Content ── */}
      <div className="about-content">
        {/* ── Header ── */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            className="about-greeting"
          >
            {about.greeting || "HEY, I'M"}{' '}
            <motion.span
              style={{ display: 'inline-block', transformOrigin: '70% 70%' }}
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
            >🖐</motion.span>
          </motion.p>
          <motion.h2
            custom={1}
            variants={fadeUp}
            className="about-name"
          >
            {about.name || "UPANANDA"}
          </motion.h2>
          <motion.p
            custom={2}
            variants={fadeUp}
            className="about-title-label"
          >
            {about.title || "MOTION DESIGNER & VIDEO EDITOR"}
          </motion.p>
        </motion.div>

        {/* ── Bio Paragraphs ── */}
        <motion.div
          className="about-bio"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
        >
          {(about.bio || []).map((para, idx) => (
            <motion.p
              key={idx}
              custom={idx}
              variants={fadeUp}
              className="about-bio-para"
            >
              {para}
            </motion.p>
          ))}
        </motion.div>

        {/* ── Stats Bar ── */}
        <motion.div
          className="about-stats"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
        >
          {stats.map((s, i) => (
            <StatCard key={s.label} s={s} i={i} />
          ))}
        </motion.div>

        {/* ── Bottom Cards Row ── */}
        <div className="about-tools-row">
          {/* Editing Software Card */}
          <motion.div
            className="about-tools-card"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.7 } } }}
            whileHover={{ borderColor: 'rgba(34,197,94,0.15)' }}
          >
            <motion.h3
              variants={fadeUp}
              custom={0}
              className="about-tools-heading"
            >
              EDITING SOFTWARE I USE{' '}
              <motion.span
                style={{
                  display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                  background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)',
                }}
                animate={{ opacity: [0.6, 1, 0.6], boxShadow: ['0 0 6px rgba(34,197,94,0.3)', '0 0 12px rgba(34,197,94,0.6)', '0 0 6px rgba(34,197,94,0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.h3>
            <div className="about-software-grid">
              {editingSoftware.map((sw, i) => (
                <motion.div
                  key={sw.name}
                  custom={i}
                  variants={scaleIn}
                  whileHover={{ scale: 1.08, y: -2 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'default' }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: sw.bg, color: sw.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, flexShrink: 0,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {sw.isFigma ? (
                      <svg viewBox="0 0 38 57" fill="none" width="16" height="24">
                        <path d="M19 28.5a9.5 9.5 0 119 9.5 9.5 9.5 0 01-9-9.5z" fill="#1ABCFE" />
                        <path d="M0 47a9.5 9.5 0 019.5-9.5H19V47a9.5 9.5 0 11-19 0z" fill="#0ACF83" />
                        <path d="M19 0v19h9.5a9.5 9.5 0 000-19H19z" fill="#FF7262" />
                        <path d="M0 9.5A9.5 9.5 0 009.5 19H19V0H9.5A9.5 9.5 0 000 9.5z" fill="#F24E1E" />
                        <path d="M0 28.5A9.5 9.5 0 009.5 38H19V19H9.5A9.5 9.5 0 000 28.5z" fill="#A259FF" />
                      </svg>
                    ) : (
                      <span style={{ fontSize: 15, fontWeight: 700, color: sw.color, fontStyle: sw.isRive ? 'italic' : 'normal' }}>{sw.abbr}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{sw.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Tools Card */}
          <motion.div
            className="about-tools-card"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.8 } } }}
            whileHover={{ borderColor: 'rgba(34,197,94,0.15)' }}
          >
            <motion.h3
              variants={fadeUp}
              custom={0}
              className="about-tools-heading"
            >
              AI TOOLS I USE{' '}
              <motion.span
                style={{
                  display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                  background: '#22c55e',
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </motion.h3>
            <div className="about-aitools-grid">
              {aiTools.map((tool, i) => (
                <motion.span
                  key={tool}
                  custom={i}
                  variants={scaleIn}
                  whileHover={{ color: '#22c55e', x: 4 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: 12, color: 'rgba(255,255,255,0.55)',
                    fontWeight: 400, cursor: 'default',
                  }}
                >
                  <span style={{ color: '#22c55e', fontSize: 10, flexShrink: 0 }}>•</span>
                  {tool}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
