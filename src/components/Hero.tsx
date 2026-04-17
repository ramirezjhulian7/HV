import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
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

  const y = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, isMobile ? 1 : 0]);

  return (
    <section className={styles.hero} ref={ref} id="hero">
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
            <TypewriterTitle text={t('title')} />
            <p className={styles.profile}>{t('profile')}</p>

            <div className={styles.contact}>
              <motion.a
                href={`mailto:${t('contact.email')}`}
                className={styles.contactItem}
                whileHover={isMobile ? {} : { scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={18} strokeWidth={1.5} className={styles.icon} />
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                <span>LinkedIn</span>
              </motion.a>

              <motion.div
                className={styles.contactItem}
                whileHover={isMobile ? {} : { scale: 1.05, y: -3 }}
              >
                <Phone size={18} strokeWidth={1.5} className={styles.icon} />
                <span>{t('contact.phone')}</span>
              </motion.div>

              <motion.div
                className={styles.contactItem}
                whileHover={isMobile ? {} : { scale: 1.05, y: -3 }}
              >
                <MapPin size={18} strokeWidth={1.5} className={styles.icon} />
                <span>{t('contact.location')}</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#skills"
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-label="Scroll down"
      >
        <ChevronDown size={24} strokeWidth={1.5} />
      </motion.a>
    </section>
  );
};

const TypewriterTitle = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <h2 className={styles.title}>
      {displayed}
      <span className={`${styles.cursor} ${done ? styles.cursorBlink : ''}`}>|</span>
    </h2>
  );
};
