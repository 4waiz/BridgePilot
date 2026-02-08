declare module "canvas-confetti" {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: Array<"square" | "circle">;
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  interface ConfettiPromise {
    reset?: () => void;
    readonly promise?: Promise<void>;
  }

  type ConfettiFn = (options?: ConfettiOptions) => ConfettiPromise | null;

  const confetti: ConfettiFn;
  export default confetti;
}
