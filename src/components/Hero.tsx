import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import profileImage from '../assets/profile.jpeg';
import styles from './Hero.module.css';
import { DURATION, EASE, GLOW_PEAK_OPACITY } from '../motion/tokens';

export const Hero = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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

  const liftOnHover = isMobile || prefersReducedMotion ? {} : { y: -3 };
  const press = { scale: 0.97 };

  return (
    <section className={styles.hero} ref={ref} id="hero">
      <div className="container">
        <motion.div className={styles.content} style={isMobile ? {} : { y, opacity }}>
          <motion.div
            className={styles.imageContainer}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.slow, ease: EASE.outQuart }}
          >
            <div className={styles.imageWrapper}>
              {/* The halo blooms in and lands on the photo's own settle, so the
                  two resolve as a single "powering on" beat rather than a
                  pulse that runs before and after the subject arrives. */}
              <motion.div
                className={styles.imageGlow}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: GLOW_PEAK_OPACITY, scale: 1 }}
                transition={{ duration: DURATION.hero, ease: EASE.outCubic, delay: 0.15 }}
                aria-hidden="true"
              />
              <img src={profileImage} alt={t('name')} className={styles.image} />
            </div>
          </motion.div>

          <motion.div
            className={styles.info}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE.outQuart, delay: 0.15 }}
          >
            <h1 className={styles.name}>
              <span className="gradient-text">{t('name')}</span>
            </h1>
            <TypewriterTitle text={t('title')} instant={!!prefersReducedMotion} />
            <p className={styles.profile}>{t('profile')}</p>

            <div className={styles.contact}>
              <motion.a
                href={`mailto:${t('contact.email')}`}
                className={styles.contactItem}
                whileHover={liftOnHover}
                whileTap={press}
                transition={{ duration: DURATION.fast, ease: EASE.outCubic }}
              >
                <Mail size={18} strokeWidth={1.5} className={styles.icon} />
                <span>{t('contact.email')}</span>
              </motion.a>

              <motion.a
                href={t('contact.linkedin')}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
                whileHover={liftOnHover}
                whileTap={press}
                transition={{ duration: DURATION.fast, ease: EASE.outCubic }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.icon} aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                <span>LinkedIn</span>
              </motion.a>

              {/* Was a <div> that looked clickable but could not be focused or
                  activated. A tel: link is the useful thing it was pretending
                  to be. */}
              <motion.a
                href={`tel:${t('contact.phone').replace(/\s+/g, '')}`}
                className={styles.contactItem}
                whileHover={liftOnHover}
                whileTap={press}
                transition={{ duration: DURATION.fast, ease: EASE.outCubic }}
              >
                <Phone size={18} strokeWidth={1.5} className={styles.icon} />
                <span>{t('contact.phone')}</span>
              </motion.a>

              {/* Location is information, not an action -- so it gets no
                  pointer cursor and no hover affordance. */}
              <div className={`${styles.contactItem} ${styles.contactItemStatic}`}>
                <MapPin size={18} strokeWidth={1.5} className={styles.icon} />
                <span>{t('contact.location')}</span>
              </div>
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

const TypewriterTitle = ({ text, instant }: { text: string; instant: boolean }) => {
  const [displayed, setDisplayed] = useState(instant ? text : '');
  const [done, setDone] = useState(instant);

  useEffect(() => {
    if (instant) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed('');
    setDone(false);
    let i = 0;
    // 32ms rather than 50ms: at 50ms this headline took over two seconds to
    // reveal a line that is already reserved in the layout.
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 32);
    return () => clearInterval(interval);
  }, [text, instant]);

  return (
    <h2 className={styles.title}>
      {/* The full string stays available to assistive tech and to the page's
          text content; only the visible rendering is typed. */}
      <span className={styles.srOnly}>{text}</span>
      <span aria-hidden="true">
        {displayed}
        <span className={`${styles.cursor} ${done ? styles.cursorBlink : ''}`}>|</span>
      </span>
    </h2>
  );
};
