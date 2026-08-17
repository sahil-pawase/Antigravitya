"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TiltCard3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt degrees (e.g. 10)
  glareOpacity?: number; // max glare opacity (e.g. 0.15)
  perspective?: number; // perspective in px (e.g. 1000)
  scale?: number; // scale on hover (e.g. 1.02)
  glowColor?: string; // CSS color string for border/spotlight glow
}

export function TiltCard3D({
  children,
  className,
  maxTilt = 10,
  glareOpacity = 0.15,
  perspective = 1000,
  scale = 1.02,
  glowColor = "rgba(65, 216, 255, 0.2)",
  style,
  ...props
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width;
      const yPct = mouseY / height;

      // Calculate tilt angles:
      // When mouse is at top (yPct = 0), rotateX should be positive (tilt backwards)
      // When mouse is at bottom (yPct = 1), rotateX should be negative (tilt forwards)
      const rotateX = ((0.5 - yPct) * (maxTilt * 2)).toFixed(2);
      // When mouse is at left (xPct = 0), rotateY should be negative (tilt left)
      // When mouse is at right (xPct = 1), rotateY should be positive (tilt right)
      const rotateY = ((xPct - 0.5) * (maxTilt * 2)).toFixed(2);

      setTransform(`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`);
      setGlarePos({
        x: Math.round(xPct * 100),
        y: Math.round(yPct * 100),
        opacity: glareOpacity,
      });
    },
    [maxTilt, glareOpacity, perspective, scale]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative transition-all duration-200 ease-out will-change-transform",
        className
      )}
      style={{
        transform,
        transformStyle: "preserve-3d",
        ...style,
      }}
      {...props}
    >
      {/* Glare spotlight layer */}
      <div
        className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 70%)`,
        }}
      />

      {/* Ambient hover border highlight */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-500 border border-transparent",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          boxShadow: isHovered ? `0 0 25px -5px ${glowColor}` : "none",
          borderColor: isHovered ? glowColor : "transparent",
        }}
      />

      {/* Card Content with 3D preserve */}
      <div className="relative z-10 w-full h-full [transform-style:preserve-3d]">
        {children}
      </div>
    </div>
  );
}
