import React, { useEffect, useRef } from 'react';

const HeroCanvas = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    let mouse = { x: -999, y: -999 };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      W = canvas.width = rect.width || window.innerWidth;
      H = canvas.height = rect.height || 560;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      mouse.x = mx;
      mouse.y = my;

      // Programmatic logo distance-based hover & cursor pointer
      const currentCx = W < 780 ? W * 0.5 : W * 0.62;
      const currentCy = H * 0.5;
      const dx = mx - currentCx;
      const dy = my - currentCy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const limit = W < 780 ? 70 : 90; // logo radius

      const logo = logoRef.current;
      if (logo) {
        if (dist < limit) {
          logo.classList.add('hovered');
          container.style.cursor = 'pointer';
        } else {
          logo.classList.remove('hovered');
          container.style.cursor = 'default';
        }
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
      const logo = logoRef.current;
      if (logo) {
        logo.classList.remove('hovered');
      }
      container.style.cursor = 'default';
    };

    // Words that float around
    const WORDS = ['Healing', 'Clarity', 'Growth', 'Balance', 'Peace', 'Hope', 'Strength', 'Calm', 'Mindful', 'Resilience'];
    const words = WORDS.map((w, i) => {
      const angle = (i / WORDS.length) * Math.PI * 2;
      const r = 150 + Math.random() * 130;
      return {
        text: w,
        baseX: Math.cos(angle) * r,
        baseY: Math.sin(angle) * r,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        opacity: 0.3 + Math.random() * 0.4,
        size: 13 + Math.random() * 7,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.004,
        orbitR: r,
        angle: angle
      };
    });

    // Neural particles
    const PARTICLE_COUNT = 80;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 240;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1.5 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.5,
        color: Math.random() > 0.5 ? [200, 150, 255] : [201, 112, 144],
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.01
      };
    });

    // Ripples on click
    const ripples = [];
    const handleClick = (e) => {
      const r = canvas.getBoundingClientRect();
      const currentCx = W < 780 ? W * 0.5 : W * 0.62;
      const currentCy = H * 0.5;
      const cx2 = e.clientX - r.left - currentCx;
      const cy2 = e.clientY - r.top - currentCy;
      ripples.push({ x: cx2, y: cy2, r: 0, maxR: 120, alpha: 0.6 });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    let t = 0;
    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#0d0018');
      bg.addColorStop(0.4, '#2a0f45');
      bg.addColorStop(0.75, '#4a1f78');
      bg.addColorStop(1, '#6b3fa0');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Centre point (right side where logo sits, adjusted on mobile)
      const cx = W < 780 ? W * 0.5 : W * 0.62;
      const cy = H * 0.5;

      // Soft glow behind logo
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
      glow.addColorStop(0, 'rgba(160,80,220,0.35)');
      glow.addColorStop(0.5, 'rgba(130,60,200,0.12)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.fill();

      // Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 3;
        rp.alpha -= 0.012;
        if (rp.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(cx + rp.x, cy + rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,160,255,${rp.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Concentric pulse rings
      for (let ring = 0; ring < 3; ring++) {
        const offset = (t * 0.4 + ring * 70) % 210;
        const alpha = (1 - offset / 210) * 0.18;
        ctx.beginPath();
        ctx.arc(cx, cy, 80 + offset, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,160,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Neural particles
      const mouseWorld = { x: mouse.x - cx, y: mouse.y - cy };
      particles.forEach((p) => {
        p.phase += p.pulseSpeed;
        p.x += p.vx + Math.sin(p.phase * 0.7) * 0.04;
        p.y += p.vy + Math.cos(p.phase * 0.5) * 0.04;

        // Mouse repulsion
        const dx = p.x - mouseWorld.x;
        const dy = p.y - mouseWorld.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist > 0) {
          const force = ((80 - dist) / 80) * 0.8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.97;
        p.vy *= 0.97;
        if (Math.abs(p.x) > 260) {
          p.vx -= p.x * 0.002;
        }
        if (Math.abs(p.y) > 230) {
          p.vy -= p.y * 0.002;
        }

        const pulse = Math.sin(p.phase) * 0.3 + 0.7;
        const [r, g, b] = p.color;
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity * pulse})`;
        ctx.fill();
      });

      // Neural connections
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 55) {
            const alpha = (1 - d / 55) * 0.2;
            const [r, g, b] = particles[i].color;
            ctx.beginPath();
            ctx.moveTo(cx + particles[i].x, cy + particles[i].y);
            ctx.lineTo(cx + particles[j].x, cy + particles[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Floating words orbiting centre
      words.forEach((w) => {
        w.angle += w.speed * 0.3;
        w.x = Math.cos(w.angle) * w.orbitR;
        w.y = Math.sin(w.angle) * w.orbitR;

        const dx = mouseWorld.x - w.x;
        const dy = mouseWorld.y - w.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pull = dist < 150 ? (150 - dist) / 150 : 0;
        const drawX = cx + w.x + dx * pull * 0.15;
        const drawY = cy + w.y + dy * pull * 0.15;
        const floatY = Math.sin(t * 0.015 + w.phase) * 6;
        const opacity = w.opacity + Math.sin(t * 0.02 + w.phase) * 0.15;

        ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
        ctx.fillStyle = 'rgba(230,210,255,1)';
        ctx.font = `italic ${w.size}px 'Cormorant Garamond', serif`;
        ctx.fillText(w.text, drawX, drawY + floatY);
      });
      ctx.globalAlpha = 1;

      // Rotating outer ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.003);
      ctx.beginPath();
      ctx.arc(0, 0, 260, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200,160,255,0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 12]);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let d = 0; d < 4; d++) {
        const da = (d / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(da) * 260, Math.sin(da) * 260, 3, 0, Math.PI * 2);
        ctx.fillStyle = d % 2 === 0 ? 'rgba(220,170,255,0.7)' : 'rgba(201,112,144,0.7)';
        ctx.fill();
      }
      ctx.restore();

      t++;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-canvas-container" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div ref={logoRef} className="hero-center-logo">
        <img src="/assets/image_2.png" alt="Poovil Psychology Logo" />
      </div>
    </div>
  );
};

export default HeroCanvas;
