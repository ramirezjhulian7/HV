import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { User, Code, Briefcase } from 'lucide-react';
import styles from './Navbar.module.css';

const navItems = [
  { key: 'profile', icon: User, href: '#hero' },
  { key: 'skills', icon: Code, href: '#skills' },
  { key: 'experience', icon: Briefcase, href: '#experience' },
];

export const Navbar = () => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <motion.nav
      className={styles.navbar}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <motion.div className={styles.glass} style={{ opacity: bgOpacity }} />
      <div className={styles.inner}>
        <a href="#hero" className={styles.logo}>
          JR
        </a>
        <div className={styles.links}>
          {navItems.map(({ key, icon: Icon, href }) => (
            <a key={key} href={href} className={styles.link}>
              <Icon size={16} strokeWidth={2} />
              <span>{t(`nav.${key}`)}</span>
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};
