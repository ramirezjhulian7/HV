/**
 * Motion tokens.
 *
 * Eases and timings are ported from the HyperFrames animation rule-set
 * (`hyperframes-animation`), whose recipes are authored as GSAP tweens. GSAP's
 * `powerN` families map onto the standard CSS easing curves, so each named ease
 * below is the cubic-bezier equivalent of the ease the source rule prescribes:
 *
 *   power1.out -> easeOutQuad    power3.out -> easeOutQuart
 *   power2.out -> easeOutCubic   power4.out -> easeOutQuint
 *
 * The rules' choreography constraints are kept deliberately, because they are
 * what separates restrained motion from decoration:
 *
 *  - `spring-pop-entrance`: entrances settle smoothly on power3.out. Bouncy
 *    `back.out` overshoot is called out there as the single biggest tell of
 *    amateur motion, so no entrance in this site overshoots.
 *  - `waterfall-entry`: an arrival is one accelerating wave in ONE direction.
 *  - rules-index contract: a group stagger must read as a single beat --
 *    `items x stagger <= ~0.5s`. See `staggerFor()`.
 */

/** Cubic-bezier ports of the GSAP eases the source rules prescribe. */
export const EASE = {
  /** power2.out -- default for fills, draws and paint-only settles. */
  outCubic: [0.33, 1, 0.68, 1],
  /** power3.out -- the canonical entrance settle (no overshoot). */
  outQuart: [0.25, 1, 0.5, 1],
  /** power4.out -- the whip-in landing used by waterfall arrivals. */
  outQuint: [0.22, 1, 0.36, 1],
  /** expo.out -- fastest front, longest tail; for a single hero beat. */
  outExpo: [0.16, 1, 0.3, 1],
  /** power2.inOut -- repositioning something already on screen. */
  inOutCubic: [0.65, 0, 0.35, 1],
} as const;

export const DURATION = {
  fast: 0.28,
  base: 0.5,
  slow: 0.75,
  /** A hero beat: the photo bloom, the headline sweep. */
  hero: 1.1,
} as const;

/**
 * The `items x stagger <= CAP` rule from the rule-set contract. A ten-card grid
 * on a 0.1s stagger takes a full second to arrive and reads as ten separate
 * events; compressing it keeps the grid a single beat no matter how many
 * items it holds.
 */
export const STAGGER_CAP = 0.45;

export const staggerFor = (count: number, preferred = 0.08): number =>
  count <= 1 ? 0 : Math.min(preferred, STAGGER_CAP / (count - 1));

/**
 * `ambient-glow-bloom` puts a hard ceiling on ambient glow so a backdrop never
 * competes with the content sitting on it.
 */
export const GLOW_PEAK_OPACITY = 0.45;

/** Standard scroll-reveal viewport for `whileInView`. */
export const VIEWPORT = { once: true, amount: 0.2 } as const;
