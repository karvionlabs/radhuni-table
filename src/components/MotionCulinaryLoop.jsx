import React, { useEffect, useRef } from 'react';

/**
 * MotionCulinaryLoop:
 * Ambient 60 FPS motion graphics canvas creating a seamless culinary atmosphere:
 * - Pre-rendered offscreen sprite batching (Zero GC in-loop, Zero shadowBlur CPU rasterization)
 * - Rising micro-steam wisps & warm golden ember sparks
 * - Respects prefers-reduced-motion
 * - Auto-pauses when offscreen using IntersectionObserver
 * - 60 FPS locked with transform-gpu composite isolation
 */
export default function MotionCulinaryLoop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect user's accessibility motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Pre-render glowing ember sprite once (Zero in-loop shadowBlur allocation)
    const emberCanvas = document.createElement('canvas');
    emberCanvas.width = 32;
    emberCanvas.height = 32;
    const eCtx = emberCanvas.getContext('2d');
    if (eCtx) {
      const eGrad = eCtx.createRadialGradient(16, 16, 2, 16, 16, 16);
      eGrad.addColorStop(0, '#FFE8B0');
      eGrad.addColorStop(0.3, '#E5A93C');
      eGrad.addColorStop(0.7, 'rgba(229, 169, 60, 0.4)');
      eGrad.addColorStop(1, 'rgba(229, 169, 60, 0)');
      eCtx.fillStyle = eGrad;
      eCtx.fillRect(0, 0, 32, 32);
    }

    // Particle pool: steam wisps and golden embers
    const emberCount = 30;
    const steamCount = 14;
    const particles = [];

    // Embers
    for (let i = 0; i < emberCount; i++) {
      particles.push({
        type: 'ember',
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        alpha: Math.random() * 0.6 + 0.3,
        speedY: -(Math.random() * 0.7 + 0.25),
        speedX: (Math.random() - 0.5) * 0.4,
        pulsing: Math.random() * Math.PI,
      });
    }

    // Steam wisps
    for (let i = 0; i < steamCount; i++) {
      particles.push({
        type: 'steam',
        x: Math.random() * width,
        y: height * 0.6 + Math.random() * (height * 0.4),
        radius: Math.random() * 40 + 25,
        alpha: Math.random() * 0.05 + 0.02,
        speedY: -(Math.random() * 0.35 + 0.15),
        speedX: (Math.random() - 0.5) * 0.25,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Spring-smoothed mouse interaction
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Render & update particles with zero memory allocations
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.type === 'ember') {
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.pulsing) * 0.35;
          p.pulsing += 0.025;

          // Responsive reaction to mouse
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            p.x += (dx / dist) * 1.2;
            p.y += (dy / dist) * 1.2;
          }

          // Cycle
          if (p.y < -20) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          ctx.globalAlpha = p.alpha * (0.6 + Math.sin(p.pulsing) * 0.4);
          ctx.drawImage(emberCanvas, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else if (p.type === 'steam') {
          p.y += p.speedY;
          p.x += p.speedX;
          p.radius += 0.04;

          if (p.y < -p.radius * 2) {
            p.y = height + p.radius;
            p.x = Math.random() * width;
            p.radius = Math.random() * 35 + 20;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = '#E5A93C';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 opacity-70 will-change-transform transform-gpu"
    />
  );
}
