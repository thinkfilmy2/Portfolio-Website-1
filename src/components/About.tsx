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
  { value: '2000+', label: 'VIDEOS CREATED', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="about-stat-icon">
      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { value: '5+', label: 'YEARS EXPERIENCE', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="about-stat-icon">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { value: '2+', label: 'YEARS IN AI', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="about-stat-icon">
      <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.756 4.388a1.5 1.5 0 01-1.394.862H8.15a1.5 1.5 0 01-1.394-.862L5 14.5m14 0H5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
];

/* ── Software Icons (official brand colors & SVG paths) ── */
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

/* ── Software Icon Component ── */
function SoftwareIcon({ sw, index }: { sw: typeof editingSoftware[0]; index: number }) {
  return (
    <motion.div
      className="about-sw-item"
      custom={index}
      variants={scaleIn}
      whileHover={{ scale: 1.08, y: -2 }}
    >
      <div className="about-sw-badge" style={{ background: sw.bg, color: sw.color }}>
        {sw.isFigma ? (
          <svg viewBox="0 0 38 57" fill="none" width="16" height="24">
            <path d="M19 28.5a9.5 9.5 0 119 9.5 9.5 9.5 0 01-9-9.5z" fill="#1ABCFE"/>
            <path d="M0 47a9.5 9.5 0 019.5-9.5H19V47a9.5 9.5 0 11-19 0z" fill="#0ACF83"/>
            <path d="M19 0v19h9.5a9.5 9.5 0 000-19H19z" fill="#FF7262"/>
            <path d="M0 9.5A9.5 9.5 0 009.5 19H19V0H9.5A9.5 9.5 0 000 9.5z" fill="#F24E1E"/>
            <path d="M0 28.5A9.5 9.5 0 009.5 38H19V19H9.5A9.5 9.5 0 000 28.5z" fill="#A259FF"/>
          </svg>
        ) : sw.isRive ? (
          <span className="about-sw-letter" style={{ color: sw.color, fontStyle: 'italic' }}>{sw.abbr}</span>
        ) : (
          <span className="about-sw-letter" style={{ color: sw.color }}>{sw.abbr}</span>
        )}
      </div>
      <span className="about-sw-name">{sw.name}</span>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="about-section" id="about">
      {/* ── Green glow behind photo ── */}
      <div className="about-photo-glow" />

      {/* ── Background portrait ── */}
      <div className="about-photo-container">
        <motion.img
          src="/images/05.2.1.webp"
          alt="Upananda Debnath"
          className="about-photo"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="about-photo-overlay" />
      </div>

      {/* ── Main Content ── */}
      <div className="about-content">
        {/* ── Header ── */}
        <motion.div
          className="about-header"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p className="about-greeting" custom={0} variants={fadeUp}>
            HEY, I'M <span className="about-wave">🖐</span>
          </motion.p>
          <motion.h2 className="about-name" custom={1} variants={fadeUp}>
            UPANANDA
          </motion.h2>
          <motion.p className="about-title" custom={2} variants={fadeUp}>
            MOTION DESIGNER & VIDEO EDITOR
          </motion.p>
        </motion.div>

        {/* ── Bio Paragraphs ── */}
        <motion.div
          className="about-bio"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
        >
          <motion.p custom={0} variants={fadeUp}>
            I'm a Motion Designer and Video Editor specializing in high-end visual storytelling, advanced motion graphics, and cinematic editing. I create visually engaging content that blends creativity with strategy to help brands stand out.
          </motion.p>
          <motion.p custom={1} variants={fadeUp}>
            My expertise includes SaaS motion design, AI filmmaking, AI-powered video editing and generation, UI motion design, and interactive motion experiences. I also have strong knowledge of sound design, branding, color grading, typography, and visual design principles.
          </motion.p>
          <motion.p custom={2} variants={fadeUp}>
            With a deep understanding of consistent brand identity and brand color systems, I focus on creating polished, modern, and impactful visuals that not only look professional but also communicate clearly and effectively.
          </motion.p>
        </motion.div>

        {/* ── Stats Bar ── */}
        <motion.div
          className="about-stats"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
        >
          {stats.map((s, i) => (
            <motion.div key={s.label} className="about-stat-card" custom={i} variants={scaleIn}
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(34,197,94,0.15)' }}
            >
              <div className="about-stat-icon-wrap">{s.icon}</div>
              <div>
                <span className="about-stat-value">{s.value}</span>
                <span className="about-stat-label">{s.label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom Cards Row ── */}
        <div className="about-bottom-row">
          {/* Editing Software Card */}
          <motion.div
            className="about-card about-card-software"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.7 } } }}
          >
            <motion.h3 className="about-card-title" variants={fadeUp} custom={0}>
              EDITING SOFTWARE I USE <span className="about-dot" />
            </motion.h3>
            <div className="about-sw-grid">
              {editingSoftware.map((sw, i) => (
                <SoftwareIcon key={sw.name} sw={sw} index={i} />
              ))}
            </div>
          </motion.div>

          {/* AI Tools Card */}
          <motion.div
            className="about-card about-card-ai"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.8 } } }}
          >
            <motion.h3 className="about-card-title" variants={fadeUp} custom={0}>
              AI TOOLS I USE <span className="about-dot" />
            </motion.h3>
            <div className="about-ai-grid">
              {aiTools.map((tool, i) => (
                <motion.span
                  key={tool}
                  className="about-ai-item"
                  custom={i}
                  variants={scaleIn}
                  whileHover={{ color: '#22c55e', x: 4 }}
                >
                  <span className="about-ai-bullet">•</span>
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
