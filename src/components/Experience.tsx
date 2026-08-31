import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import styles from './Experience.module.css';
import { DURATION, EASE, GLOW_PEAK_OPACITY, VIEWPORT, staggerFor } from '../motion/tokens';

import type { Variants } from 'framer-motion';
import type { ExperienceItem } from '../types';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.outQuart },
  },
};

const markerVariants: Variants = {
  hidden: { scale: 0.4, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: DURATION.fast, ease: EASE.outQuart },
  },
};

/** The halo lands on the marker's settle, so glow and dot resolve as one beat. */
const glowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: GLOW_PEAK_OPACITY,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE.outCubic, delay: 0.1 },
  },
};

export const Experience = () => {
  const { t } = useTranslation();
  const experiences = t('experience', { returnObjects: true }) as ExperienceItem[];
  const list = Array.isArray(experiences) ? experiences : [];

  const timelineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // The rail fills in lockstep with how far the reader has moved through the
  // roles, which turns a decorative gradient line into a position indicator.
  // `scaleY` on a pre-sized layer keeps this compositor-only -- height is never
  // animated.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.85', 'end 0.55'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const scaleY = useTransform(smoothProgress, (v) => Math.max(v, 0.02));

  const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: staggerFor(list.length, 0.06) } },
  };

  return (
    <section className={styles.experience} id="experience">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION.base, ease: EASE.outQuart }}
        >
          <h2 className={styles.title}>
            <span className="gradient-text">{t('sections.experience')}</span>
          </h2>
        </motion.div>

        <motion.div
          className={styles.timeline}
          ref={timelineRef}
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {/* Reduced motion means the rail is simply drawn, not undrawn. */}
          <motion.div
            className={styles.railFill}
            style={prefersReducedMotion ? { scaleY: 1 } : { scaleY }}
            aria-hidden="true"
          />

          {list.map((exp, index) => (
            <motion.div key={`${exp.company}-${exp.project}-${index}`} className={styles.item} variants={cardVariants}>
              <div className={styles.marker}>
                <motion.div className={styles.markerGlow} variants={glowVariants} />
                <motion.div className={styles.markerDot} variants={markerVariants} />
              </div>

              <motion.div
                className={styles.card}
                whileHover={{ y: -3 }}
                transition={{ duration: DURATION.fast, ease: EASE.outCubic }}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.company}>{exp.company}</h3>
                    <h4 className={styles.position}>{exp.position}</h4>
                    <p className={styles.period}>{exp.period}</p>
                  </div>
                  <div className={styles.projectBadge}>
                    <span className={styles.projectName}>{exp.project}</span>
                    {exp.projectPeriod && (
                      <span className={styles.projectPeriod}>{exp.projectPeriod}</span>
                    )}
                  </div>
                </div>

                {exp.description && <p className={styles.description}>{exp.description}</p>}

                <ul className={styles.highlights}>
                  {exp.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className={styles.highlight}>
                      <span className={styles.bullet} aria-hidden="true">
                        &#9657;
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
