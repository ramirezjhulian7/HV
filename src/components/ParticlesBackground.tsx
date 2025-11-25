import { useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import styles from './ParticlesBackground.module.css';

export const ParticlesBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Particles
      id="tsparticles"
      className={styles.particles}
      particlesLoaded={async () => {}}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: isMobile ? 30 : 60,
        interactivity: {
          events: {
            onClick: {
              enable: !isMobile,
              mode: 'push',
            },
            onHover: {
              enable: !isMobile,
              mode: 'attract',
            },
          },
          modes: {
            push: {
              quantity: 2,
            },
            attract: {
              distance: 150,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ['#00d4ff', '#7c3aed', '#f59e0b'],
          },
          links: {
            color: '#00d4ff',
            distance: 150,
            enable: true,
            opacity: isMobile ? 0.2 : 0.3,
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: isMobile ? 0.5 : 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: isMobile ? 30 : 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: isMobile ? 2 : 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};


