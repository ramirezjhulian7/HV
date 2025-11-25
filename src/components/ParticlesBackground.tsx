import Particles from '@tsparticles/react';
import styles from './ParticlesBackground.module.css';

export const ParticlesBackground = () => {
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
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'push',
            },
            onHover: {
              enable: true,
              mode: 'attract',
            },
          },
          modes: {
            push: {
              quantity: 4,
            },
            attract: {
              distance: 200,
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
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

