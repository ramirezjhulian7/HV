import { motion } from 'framer-motion';
import styles from './SectionDivider.module.css';

export const SectionDivider = () => {
  return (
    <motion.div
      className={styles.divider}
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className={styles.line} />
      <div className={styles.diamond} />
      <div className={styles.line} />
    </motion.div>
  );
};
