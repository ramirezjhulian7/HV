import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './Skills.module.css';


const skillCategories = [
  { key: 'language', icon: '🌐' },
  { key: 'languages', icon: '💻' },
  { key: 'backend', icon: '⚙️' },
  { key: 'frontend', icon: '🎨' },
  { key: 'databases', icon: '🗄️' },
  { key: 'cloud', icon: '☁️' },
  { key: 'architecture', icon: '🏗️' },
  { key: 'devops', icon: '🔧' },
  { key: 'testing', icon: '✅' },
  { key: 'emergingTech', icon: '🚀' },
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
                  <span className={styles.icon}>{category.icon}</span>
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
                        delay: index * 0.1 + skillIndex * 0.05 
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
