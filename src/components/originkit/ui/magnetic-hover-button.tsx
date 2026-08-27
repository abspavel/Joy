"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import React, { useRef, useState, useEffect, type CSSProperties } from "react";

const RANGE_PER_POINT = 18;
const MAX_PULL = 0.5;

interface BorderOptions {
  color: string;
  width: number;
}

export interface MagneticButtonProps {
  label?: string;
  children?: React.ReactNode;
  link?: string;
  newTab?: boolean;
  font?: CSSProperties;
  fill?: string;
  textColor?: string;
  sweepColor?: string;
  sweepTextColor?: string;
  radius?: number | string;
  magnet?: number;
  paddingX?: number;
  paddingY?: number;
  transition?: any;
  border?: boolean;
  borderOptions?: BorderOptions;
  style?: CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function MagneticButton({
  label,
  children,
  link = "",
  newTab = false,
  font,
  fill = "transparent",
  textColor = "var(--text-primary)",
  sweepColor = "var(--text-primary)",
  sweepTextColor = "var(--bg-primary)",
  paddingX,
  paddingY,
  radius = 9999,
  magnet = 8,
  transition = {
    type: "tween",
    ease: [0.25, 1, 0.5, 1],
    duration: 0.35,
  },
  border = true,
  borderOptions = { color: "var(--text-primary)", width: 1 },
  style,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0, d: 0 });
  const hoverRef = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.35 });

  const borderColor = borderOptions?.color ?? "var(--text-primary)";
  const borderWidth = border ? borderOptions?.width ?? 1 : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const node: HTMLAnchorElement = el;

    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    const pull = (magnet / 20) * MAX_PULL;
    const reach = magnet * RANGE_PER_POINT;

    function onMove(event: PointerEvent) {
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - sx.get();
      const cy = rect.top + rect.height / 2 - sy.get();

      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      const edgeX = Math.max(0, Math.abs(dx) - rect.width / 2);
      const edgeY = Math.max(0, Math.abs(dy) - rect.height / 2);
      const gap = Math.hypot(edgeX, edgeY);

      if (inside !== hoverRef.current) {
        const lx = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
        const ly = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
        const d = 2.4 * Math.hypot(rect.width, rect.height);
        setOrigin({ x: lx, y: ly, d });
        hoverRef.current = inside;
        setHover(inside);
      }

      if (gap > reach) {
        x.set(0);
        y.set(0);
        return;
      }
      const falloff = reach === 0 ? 0 : 1 - gap / reach;
      x.set(dx * pull * falloff);
      y.set(dy * pull * falloff);
    }

    function onLeave() {
      x.set(0);
      y.set(0);
      hoverRef.current = false;
      setHover(false);
    }

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [magnet, x, y, sx, sy]);

  const paddingStyle =
    paddingX !== undefined || paddingY !== undefined
      ? { padding: `${paddingY ?? 0}px ${paddingX ?? 0}px` }
      : {};

  return (
    <motion.a
      ref={ref}
      href={link || undefined}
      target={link && newTab ? "_blank" : undefined}
      rel={link && newTab ? "noopener noreferrer" : undefined}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center box-border cursor-pointer select-none overflow-hidden no-underline whitespace-nowrap will-change-transform ${className}`}
      style={{
        ...paddingStyle,
        borderRadius: radius,
        background: fill,
        border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
        x: sx,
        y: sy,
        ...font,
        ...style,
      }}
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scale: hover ? 1 : 0 }}
        transition={transition}
        style={{
          position: "absolute",
          top: origin.y,
          left: origin.x,
          width: origin.d,
          height: origin.d,
          marginLeft: -origin.d / 2,
          marginTop: -origin.d / 2,
          borderRadius: "50%",
          background: sweepColor,
          transformOrigin: "center",
          pointerEvents: "none",
        }}
      />
      <motion.span
        initial={false}
        animate={{ color: hover ? sweepTextColor : textColor }}
        transition={transition}
        style={{ position: "relative", zIndex: 1 }}
        className="flex items-center justify-center font-medium uppercase tracking-wider"
      >
        {children || label}
      </motion.span>
    </motion.a>
  );
}