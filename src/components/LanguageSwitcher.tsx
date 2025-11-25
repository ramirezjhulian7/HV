import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './LanguageSwitcher.module.css';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <motion.button
      className={styles.switcher}
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <span className={styles.flag}>
        {i18n.language === 'es' ? '🇪🇸' : '🇬🇧'}
      </span>
      <span className={styles.text}>
        {i18n.language === 'es' ? 'EN' : 'ES'}
      </span>
    </motion.button>
  );
};
