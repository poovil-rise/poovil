import React, { useEffect, useRef } from 'react';

const FloralBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const TYPES = ['rose', 'daisy', 'leaf', 'petal', 'tulip', 'smallflower'];
    const COLORS = [
      '#e8a4b8', '#c9748f', '#b8b0d8', '#8b7fb8', '#f5c6d0', '#d4a0c0',
      '#7aab8a', '#4a7c59', '#f0d9c0', '#e8d0dc', '#a8d8b0', '#dcc0e0'
    ];

    const createParticle = (init = false) => {
      const type = TYPES[Math.floor(Math.random() * TYPES.length)];
      const size = 18 + Math.random() * 38;
      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : H + size + Math.random() * 200,
        z: 0.3 + Math.random() * 0.9,
        size,
        type,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        color2: COLORS[Math.floor(Math.random() * COLORS.length)],
        speedY: -(0.3 + Math.random() * 0.7) * 0.6,
        speedX: (Math.random() - 0.5) * 0.4,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        swayAmp: 20 + Math.random() * 40,
        swaySpeed: 0.003 + Math.random() * 0.006,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: 0.12 + Math.random() * 0.22,
        scale: 0.5 + Math.random() * 0.8,
        t: 0
      };
    };

    const drawRose = (ctx, size, color, color2) => {
      const petals = 5;
      for (let i = 0; i < petals; i++) {
        ctx.save();
        ctx.rotate((i / petals) * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.5, size * 0.28, size * 0.55, 0, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(0, -size * 0.3, 0, 0, -size * 0.5, size * 0.55);
        g.addColorStop(0, color2);
        g.addColorStop(1, color);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = color2;
      ctx.fill();
    };

    const drawDaisy = (ctx, size, color, color2) => {
      const petals = 8;
      for (let i = 0; i < petals; i++) {
        ctx.save();
        ctx.rotate((i / petals) * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.45, size * 0.14, size * 0.42, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = '#f5e642';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.13, 0, Math.PI * 2);
      ctx.fillStyle = '#e8a020';
      ctx.fill();
    };

    const drawLeaf = (ctx, size, color) => {
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.6);
      ctx.bezierCurveTo(size * 0.4, -size * 0.3, size * 0.4, size * 0.3, 0, size * 0.6);
      ctx.bezierCurveTo(-size * 0.4, size * 0.3, -size * 0.4, -size * 0.3, 0, -size * 0.6);
      const g = ctx.createLinearGradient(0, -size * 0.6, 0, size * 0.6);
      g.addColorStop(0, '#7aab8a');
      g.addColorStop(0.5, color);
      g.addColorStop(1, '#2d5c3f');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.6);
      ctx.lineTo(0, size * 0.6);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawPetal = (ctx, size, color) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(size * 0.5, -size * 0.3, size * 0.5, -size * 0.9, 0, -size);
      ctx.bezierCurveTo(-size * 0.5, -size * 0.9, -size * 0.5, -size * 0.3, 0, 0);
      const g = ctx.createLinearGradient(0, 0, 0, -size);
      g.addColorStop(0, color);
      g.addColorStop(1, '#fff0f5');
      ctx.fillStyle = g;
      const prevAlpha = ctx.globalAlpha;
      ctx.globalAlpha *= 0.85;
      ctx.fill();
      ctx.globalAlpha = prevAlpha;
    };

    const drawTulip = (ctx, size, color, color2) => {
      ctx.beginPath();
      ctx.moveTo(0, size * 0.3);
      ctx.bezierCurveTo(-size * 0.5, size * 0.1, -size * 0.6, -size * 0.6, 0, -size * 0.7);
      ctx.bezierCurveTo(size * 0.6, -size * 0.6, size * 0.5, size * 0.1, 0, size * 0.3);
      const g = ctx.createLinearGradient(0, -size * 0.7, 0, size * 0.3);
      g.addColorStop(0, color2);
      g.addColorStop(1, color);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, size * 0.3);
      ctx.lineTo(0, size * 0.7);
      ctx.strokeStyle = '#4a7c59';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const drawSmallFlower = (ctx, size, color) => {
      const p = 6;
      for (let i = 0; i < p; i++) {
        ctx.save();
        ctx.rotate((i / p) * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.35, size * 0.18, size * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#fffbe6';
      ctx.fill();
    };

    const drawParticle = (p) => {
      ctx.save();
      ctx.globalAlpha = p.opacity * (0.6 + p.z * 0.4);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const s = p.size * p.scale * (0.5 + p.z * 0.5);
      ctx.scale(s / 40, s / 40);
      ctx.transform(1, 0, Math.sin(p.rot) * 0.15 * (1 - p.z), 1, 0, 0);

      switch (p.type) {
        case 'rose':
          drawRose(ctx, 40, p.color, p.color2);
          break;
        case 'daisy':
          drawDaisy(ctx, 40, p.color, p.color2);
          break;
        case 'leaf':
          drawLeaf(ctx, 40, p.color);
          break;
        case 'petal':
          drawPetal(ctx, 40, p.color);
          break;
        case 'tulip':
          drawTulip(ctx, 40, p.color, p.color2);
          break;
        case 'smallflower':
          drawSmallFlower(ctx, 40, p.color);
          break;
        default:
          break;
      }
      ctx.restore();
    };

    const particles = [];
    for (let i = 0; i < 55; i++) {
      particles.push(createParticle(true));
    }

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.t += 1;
        p.x += p.speedX + Math.sin(p.t * p.swaySpeed + p.swayOffset) * 0.4 * (1 + p.z);
        p.y += p.speedY * (0.6 + p.z * 0.5);
        p.rot += p.rotSpeed * (0.8 + p.z * 0.4);
        const bob = Math.sin(p.t * 0.02 + p.swayOffset) * 0.3;
        p.y += bob;
        drawParticle(p);

        if (p.y < -p.size * 2) {
          particles[i] = createParticle(false);
        }
        if (p.x < -p.size * 2) p.x = W + p.size;
        if (p.x > W + p.size * 2) p.x = -p.size;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.65
      }}
    />
  );
};

export default FloralBackground;
