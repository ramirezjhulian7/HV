import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './Experience.module.css';

import type { ExperienceItem } from '../types';

export const Experience = () => {
  const { t } = useTranslation();
  const experiences = t('experience', { returnObjects: true }) as ExperienceItem[];

  return (
    <section className={styles.experience} id="experience">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>
            <span className="gradient-text">{t('sections.experience')}</span>
          </h2>
        </motion.div>

        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className={styles.item}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={styles.marker}>
                <div className={styles.markerDot}></div>
                <div className={styles.markerGlow}></div>
              </div>

              <motion.div
                className={styles.card}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
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

                {exp.description && (
                  <p className={styles.description}>{exp.description}</p>
                )}

                <ul className={styles.highlights}>
                  {exp.highlights.map((highlight, hIndex) => (
                    <motion.li
                      key={hIndex}
                      className={styles.highlight}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1 + hIndex * 0.05 
                      }}
                    >
                      <span className={styles.bullet}>▹</span>
                      {highlight}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
