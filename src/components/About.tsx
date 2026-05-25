import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
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

/* ── Stats Data ── */
const stats = [
  {
    value: '2000+', label: 'VIDEOS CREATED',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18, color: '#22c55e' }}>
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    value: '5+', label: 'YEARS EXPERIENCE',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18, color: '#22c55e' }}>
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    value: '2+', label: 'YEARS IN AI',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18, color: '#22c55e' }}>
        <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.756 4.388a1.5 1.5 0 01-1.394.862H8.15a1.5 1.5 0 01-1.394-.862L5 14.5m14 0H5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
];

/* ── Software Icons ── */
const editingSoftware = [
  { name: 'Premiere Pro', abbr: 'Pr', bg: '#00005B', color: '#9999FF' },
  { name: 'After Effects', abbr: 'Ae', bg: '#00005B', color: '#9999FF' },
  { name: 'Rive', abbr: 'R', bg: '#1a1a2e', color: '#00C4FF', isRive: true },
  { name: 'Photoshop', abbr: 'Ps', bg: '#001E36', color: '#31A8FF' },
  { name: 'Figma', abbr: 'F', bg: '#1a1a2e', color: '#A259FF', isFigma: true },
  { name: 'Illustrator', abbr: 'Ai', bg: '#330000', color: '#FF9A00' },
];

const aiTools = [
  'ChatGPT', 'Google Gemini', 'Claude', 'Seedream',
  'WAN', 'Flux', 'Kling', 'Grok',
  'OpenAI', 'VEO', 'And more.',
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '80px 48px 60px',
        overflow: 'hidden',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      {/* ── Green Glow Behind Photo ── */}
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '15%',
        width: 500,
        height: 700,
        transform: 'translateY(-50%)',
        background: 'radial-gradient(ellipse, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.06) 40%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* ── Background Portrait ── */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '50%',
        height: '100%',
        zIndex: 2,
        overflow: 'hidden',
      }}>
        <motion.img
          src="/images/05.2.1.webp"
          alt="Upananda Debnath"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            filter: 'brightness(0.85) contrast(1.05)',
            mixBlendMode: 'luminosity',
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Overlay gradients */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.85) 25%, rgba(10,10,10,0.3) 50%, transparent 70%),
            linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.6) 20%, transparent 50%),
            linear-gradient(to bottom, #0a0a0a 0%, transparent 15%)
          `,
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── Main Content ── */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        width: '55%',
        maxWidth: 680,
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
      }}>
        {/* ── Header ── */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em', marginBottom: 4 }}
          >
            HEY, I'M{' '}
            <motion.span
              style={{ display: 'inline-block', transformOrigin: '70% 70%' }}
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
            >🖐</motion.span>
          </motion.p>
          <motion.h2
            custom={1}
            variants={fadeUp}
            style={{
              fontSize: 'clamp(56px, 8vw, 100px)',
              fontWeight: 800,
              lineHeight: 0.95,
              color: '#f5f5f7',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            UPANANDA
          </motion.h2>
          <motion.p
            custom={2}
            variants={fadeUp}
            style={{
              fontSize: 'clamp(12px, 1.4vw, 16px)',
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              fontWeight: 500,
              marginTop: 8,
            }}
          >
            MOTION DESIGNER &amp; VIDEO EDITOR
          </motion.p>
        </motion.div>

        {/* ── Bio Paragraphs ── */}
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', margin: 0 }}
          >
            I'm a Motion Designer and Video Editor specializing in high-end visual storytelling, advanced motion graphics, and cinematic editing. I create visually engaging content that blends creativity with strategy to help brands stand out.
          </motion.p>
          <motion.p
            custom={1}
            variants={fadeUp}
            style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', margin: 0 }}
          >
            My expertise includes SaaS motion design, AI filmmaking, AI-powered video editing and generation, UI motion design, and interactive motion experiences. I also have strong knowledge of sound design, branding, color grading, typography, and visual design principles.
          </motion.p>
          <motion.p
            custom={2}
            variants={fadeUp}
            style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', margin: 0 }}
          >
            With a deep understanding of consistent brand identity and brand color systems, I focus on creating polished, modern, and impactful visuals that not only look professional but also communicate clearly and effectively.
          </motion.p>
        </motion.div>

        {/* ── Stats Bar ── */}
        <motion.div
          style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={scaleIn}
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(34,197,94,0.15)' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 20px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'default',
                flex: 1,
                minWidth: 130,
                transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div style={{
                width: 36, height: 36,
                borderRadius: 10,
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {s.icon}
              </div>
              <div>
                <span style={{ display: 'block', fontSize: 22, fontWeight: 700, color: '#f5f5f7', lineHeight: 1.2 }}>{s.value}</span>
                <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 500, marginTop: 1 }}>{s.label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom Cards Row ── */}
        <div style={{ display: 'flex', gap: 14, marginTop: 4, flexWrap: 'wrap' }}>
          {/* Editing Software Card */}
          <motion.div
            style={{
              flex: '1 1 200px',
              borderRadius: 16,
              padding: '20px 22px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
            }}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.7 } } }}
            whileHover={{ borderColor: 'rgba(34,197,94,0.15)' }}
          >
            <motion.h3
              variants={fadeUp}
              custom={0}
              style={{
                fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase', fontWeight: 600, margin: '0 0 16px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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
            style={{
              flex: '1 1 180px',
              borderRadius: 16,
              padding: '20px 22px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
            }}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.8 } } }}
            whileHover={{ borderColor: 'rgba(34,197,94,0.15)' }}
          >
            <motion.h3
              variants={fadeUp}
              custom={0}
              style={{
                fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase', fontWeight: 600, margin: '0 0 16px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px' }}>
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
