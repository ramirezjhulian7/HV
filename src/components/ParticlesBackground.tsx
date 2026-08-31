import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import styles from './ParticlesBackground.module.css';

export const ParticlesBackground = () => {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // The engine must be loaded once before <Particles> can render anything.
  useEffect(() => {
    let cancelled = false;
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setReducedMotion(media.matches);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    media.addEventListener('change', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      media.removeEventListener('change', checkMobile);
    };
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: isMobile ? 30 : 60,
      interactivity: {
        events: {
          onClick: {
            enable: !isMobile && !reducedMotion,
            mode: 'push',
          },
          onHover: {
            enable: !isMobile && !reducedMotion,
            mode: 'grab',
          },
        },
        modes: {
          push: {
            quantity: 2,
          },
          grab: {
            distance: 170,
            links: {
              opacity: 0.45,
            },
          },
        },
      },
      particles: {
        color: {
          value: ['#00d4ff', '#7c3aed', '#e2e8f0'],
        },
        links: {
          color: '#00d4ff',
          distance: 150,
          enable: true,
          opacity: isMobile ? 0.14 : 0.2,
          width: 1,
        },
        move: {
          direction: 'none' as const,
          enable: !reducedMotion,
          outModes: {
            default: 'bounce' as const,
          },
          random: false,
          speed: isMobile ? 0.35 : 0.6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: isMobile ? 26 : 64,
        },
        opacity: {
          value: { min: 0.15, max: 0.4 },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: isMobile ? 2 : 2.6 },
        },
      },
      detectRetina: true,
    }),
    [isMobile, reducedMotion]
  );

  if (!ready) return null;

  return <Particles id="tsparticles" className={styles.particles} options={options} />;
};
