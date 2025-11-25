import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import profileImage from '../assets/profile.jpeg';
import styles from './Hero.module.css';

export const Hero = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Disable parallax on mobile for better performance
  const y = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, isMobile ? 1 : 0]);

  return (
    <section className={styles.hero} ref={ref}>
      <div className="container">
        <motion.div className={styles.content} style={isMobile ? {} : { y, opacity }}>
          <motion.div
            className={styles.imageContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className={styles.imageWrapper}>
              <img src={profileImage} alt={t('name')} className={styles.image} />
              <div className={styles.imageGlow}></div>
            </div>
          </motion.div>

          <motion.div
            className={styles.info}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className={styles.name}>
              <span className="gradient-text">{t('name')}</span>
            </h1>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.profile}>{t('profile')}</p>

            <div className={styles.contact}>
              <motion.a
                href={`mailto:${t('contact.email')}`}
                className={styles.contactItem}
                whileHover={isMobile ? {} : { scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.icon}>📧</span>
                <span>{t('contact.email')}</span>
              </motion.a>

              <motion.a
                href={t('contact.linkedin')}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
                whileHover={isMobile ? {} : { scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.icon}>💼</span>
                <span>LinkedIn</span>
              </motion.a>

              <motion.div
                className={styles.contactItem}
                whileHover={isMobile ? {} : { scale: 1.05, y: -3 }}
              >
                <span className={styles.icon}>📱</span>
                <span>{t('contact.phone')}</span>
              </motion.div>

              <motion.div
                className={styles.contactItem}
                whileHover={isMobile ? {} : { scale: 1.05, y: -3 }}
              >
                <span className={styles.icon}>📍</span>
                <span>{t('contact.location')}</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
