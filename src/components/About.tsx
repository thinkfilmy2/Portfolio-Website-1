import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="relative py-32 px-6 overflow-hidden min-h-screen flex items-center" id="about">
      <div className="container mx-auto max-w-7xl flex justify-end w-full">
        <div className="w-full md:w-1/2">
          <motion.h2 
            className="text-sm tracking-[0.3em] uppercase mb-4 font-semibold"
            style={{ color: '#f5f5f7' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            About Me
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl font-medium leading-relaxed"
            style={{ color: '#f5f5f7' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I'm a motion designer skilled in video editing,
            motion graphics, and color grading. I also
            specialize in SaaS motion design, advanced
            motion graphics, and AI-powered video editing &amp;
            generation.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
