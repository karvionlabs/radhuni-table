import React, { useEffect, useRef } from 'react';

/**
 * MotionCulinaryLoop:
 * Ambient motion graphics canvas creating a seamless culinary atmosphere:
 * - Rising micro-steam wisps
 * - Golden glowing ember sparks (reminiscent of charcoal grills & tandoor fires)
 * - Spring-interpolated drift reacting smoothly to mouse motion
 * - Target 60 FPS with requestAnimationFrame and offscreen throttling
 */
export default function MotionCulinaryLoop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool: steam wisps and golden embers
    const emberCount = 38;
    const steamCount = 18;
    const particles = [];

    // Embers
    for (let i = 0; i < emberCount; i++) {
      particles.push({
        type: 'ember',
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        color: Math.random() > 0.3 ? '#E5A93C' : '#F97316',
        alpha: Math.random() * 0.7 + 0.2,
        speedY: -(Math.random() * 0.8 + 0.3),
        speedX: (Math.random() - 0.5) * 0.5,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        pulsing: Math.random() * Math.PI,
      });
    }

    // Steam wisps
    for (let i = 0; i < steamCount; i++) {
      particles.push({
        type: 'steam',
        x: Math.random() * width,
        y: height * 0.6 + Math.random() * (height * 0.4),
        radius: Math.random() * 45 + 30,
        alpha: Math.random() * 0.08 + 0.03,
        speedY: -(Math.random() * 0.4 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
        fadeSpeed: 0.0008 + Math.random() * 0.001,
        angle: Math.random() * 360,
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
    window.addEventListener('mousemove', handleMouseMove);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Spring-smoothed mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Render & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.type === 'ember') {
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.pulsing) * 0.4;
          p.pulsing += 0.03;

          // Responsive reaction to mouse
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            p.x += (dx / dist) * 1.5;
            p.y += (dy / dist) * 1.5;
          }

          // Cycle
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * (0.6 + Math.sin(p.pulsing) * 0.4);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'steam') {
          p.y += p.speedY;
          p.x += p.speedX;
          p.radius += 0.05;

          if (p.y < -p.radius * 2) {
            p.y = height + p.radius;
            p.x = Math.random() * width;
            p.radius = Math.random() * 40 + 25;
          }

          ctx.save();
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius
          );
          gradient.addColorStop(0, `rgba(240, 230, 210, ${p.alpha})`);
          gradient.addColorStop(0.6, `rgba(229, 169, 60, ${p.alpha * 0.4})`);
          gradient.addColorStop(1, 'rgba(10, 12, 14, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

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
      className="pointer-events-none absolute inset-0 z-0 opacity-80"
    />
  );
}
