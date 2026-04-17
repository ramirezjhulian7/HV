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

import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

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

export const Skills = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.skills} id="skills">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>
            <span className="gradient-text">{t('sections.skills')}</span>
          </h2>
        </motion.div>

        <div className={styles.grid}>
          {skillCategories.map((category, index) => {
            const skills = t(`skills.${category.key}`, { returnObjects: true }) as unknown as string[];
            const Icon = category.icon;

            return (
              <motion.div
                key={category.key}
                className={styles.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.categoryHeader}>
                  <div className={styles.iconWrap}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className={styles.categoryTitle}>
                    {t(`sections.${category.key}`)}
                  </h3>
                </div>

                <div className={styles.skillList}>
                  {Array.isArray(skills) && skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skillIndex}
                      className={styles.skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1 + skillIndex * 0.05,
                      }}
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
