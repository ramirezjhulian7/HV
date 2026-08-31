import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Globe,
  Code,
  Server,
  Layout,
  Database,
  Cloud,
  Layers,
  Settings,
  TestTube,
  Zap,
} from 'lucide-react';
import styles from './Skills.module.css';
import { DURATION, EASE, VIEWPORT, staggerFor } from '../motion/tokens';

import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import type { Variants } from 'framer-motion';

const skillCategories: { key: string; icon: ComponentType<LucideProps> }[] = [
  { key: 'language', icon: Globe },
  { key: 'languages', icon: Code },
  { key: 'backend', icon: Server },
  { key: 'frontend', icon: Layout },
  { key: 'databases', icon: Database },
  { key: 'cloud', icon: Cloud },
  { key: 'architecture', icon: Layers },
  { key: 'devops', icon: Settings },
  { key: 'testing', icon: TestTube },
  { key: 'emergingTech', icon: Zap },
];

/**
 * One observer on the grid drives the whole arrival.
 *
 * Previously every card AND every pill carried its own `whileInView` plus an
 * index-derived `delay`, so the delay started counting from that element's own
 * entry: on mobile the grid is a single column, so the last category sat blank
 * while fully on screen under the reader's cursor. Hoisting the trigger to the
 * container and driving children with variants makes the cascade one beat, the
 * way `waterfall-entry` specifies.
 */
const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerFor(skillCategories.length, 0.05) },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    // power3.out: a smooth long-tail settle. `spring-pop-entrance` names bouncy
    // overshoot the single clearest tell of amateur motion.
    transition: { duration: DURATION.base, ease: EASE.outQuart },
  },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE.outQuart } },
};

export const Skills = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.skills} id="skills">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION.base, ease: EASE.outQuart }}
        >
          <h2 className={styles.title}>
            <span className="gradient-text">{t('sections.skills')}</span>
          </h2>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {skillCategories.map((category) => {
            const skills = t(`skills.${category.key}`, { returnObjects: true }) as unknown as string[];
            const list = Array.isArray(skills) ? skills : [];
            const Icon = category.icon;

            return (
              <motion.div
                key={category.key}
                className={styles.category}
                variants={cardVariants}
                whileHover={{ y: -3 }}
                transition={{ duration: DURATION.fast, ease: EASE.outCubic }}
              >
                <div className={styles.categoryHeader}>
                  <div className={styles.iconWrap}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className={styles.categoryTitle}>{t(`sections.${category.key}`)}</h3>
                </div>

                <motion.div
                  className={styles.skillList}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: staggerFor(list.length, 0.025) } },
                  }}
                >
                  {list.map((skill) => (
                    <motion.span key={skill} className={styles.skill} variants={pillVariants}>
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
