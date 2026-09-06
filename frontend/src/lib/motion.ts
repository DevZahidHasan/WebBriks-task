import gsap from 'gsap';

export const MOTION = {
  ease: {
    out: 'power2.out',
    smooth: 'power3.out',
    spring: 'back.out(1.5)',
    expo: 'expo.out',
  },
  duration: {
    fast: 0.25,
    normal: 0.45,
    slow: 0.75,
  },
};

/**
 * Creates a GSAP context scoped to a React ref, guaranteeing 100% memory cleanup on unmount.
 */
export function createGsapContext(scope: React.RefObject<HTMLElement>, effect: (ctx: gsap.Context) => void) {
  if (!scope.current) return () => {};
  const ctx = gsap.context(effect, scope);
  return () => ctx.revert();
}

/**
 * Staggered fade and slide reveal for grid items or cards.
 */
export function animateStaggerIn(targets: string | Element[], vars: gsap.TweenVars = {}) {
  return gsap.from(targets, {
    y: 20,
    opacity: 0,
    duration: MOTION.duration.normal,
    ease: MOTION.ease.smooth,
    stagger: 0.06,
    clearProps: 'opacity,transform',
    ...vars,
  });
}
