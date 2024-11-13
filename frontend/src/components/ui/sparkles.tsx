"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const SparklesCore = ({
  background,
  minSize,
  maxSize,
  particleCount,
  particleColor,
  className,
}: {
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleCount?: number;
  particleColor?: string;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = Array.from({ length: particleCount ?? 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * ((maxSize ?? 4) - (minSize ?? 1)) + (minSize ?? 1),
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
    }));

    let animationFrameId: number;

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.fillStyle = particleColor ?? "#FFFFFF";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [maxSize, minSize, particleColor, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 -z-10", className)}
      style={{
        background: background ?? "transparent",
      }}
    />
  );
}; 