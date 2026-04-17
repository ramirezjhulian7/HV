import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Calendar, Cpu, FolderOpen, Building2 } from 'lucide-react';
import styles from './Stats.module.css';

const useCountUp = (end: number, duration: number, start: boolean) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    let frame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, start]);

  return count;
};

const statItems = [
  { key: 'years', value: 11, icon: Calendar, suffix: '+' },
  { key: 'technologies', value: 40, icon: Cpu, suffix: '+' },
  { key: 'projects', value: 7, icon: FolderOpen, suffix: '+' },
  { key: 'companies', value: 4, icon: Building2, suffix: '' },
];

export const Stats = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className={styles.stats} ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          {statItems.map(({ key, value, icon: Icon, suffix }, index) => (
            <motion.div
              key={key}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.iconWrap}>
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <StatValue value={value} suffix={suffix} isInView={isInView} />
              <span className={styles.label}>{t(`stats.${key}`)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatValue = ({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) => {
  const count = useCountUp(value, 1800, isInView);
  return (
    <span className={styles.value}>
      {count}{suffix}
    </span>
  );
};
