import React, { useState, useEffect, useRef } from 'react';

// ─── Particle System ──────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    interface Particle {
      x: number; y: number; r: number;
      vx: number; vy: number;
      alpha: number; alphaDir: number;
    }

    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      alphaDir: (Math.random() - 0.5) * 0.005,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.alpha += p.alphaDir;
        if (p.alpha <= 0.05) p.alphaDir = Math.abs(p.alphaDir);
        if (p.alpha >= 0.7) p.alphaDir = -Math.abs(p.alphaDir);
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', handleResize); };
  }, []);

  return <canvas ref={canvasRef} id="particles-canvas" />;
}

// ─── Hook: Scroll Animations ──────────────────────────────────────────────────
function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            // Animate progress bars if inside
            const bars = e.target.querySelectorAll('.progress-fill');
            bars.forEach(b => b.classList.add('animated'));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Hook: Animated Counter ───────────────────────────────────────────────────
function useCounter(target: number, suffix: string, delay = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const steps = 50;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps + delay);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, delay]);

  return { ref, display: count >= target ? `${target}${suffix}` : `${count}${suffix}` };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ number, suffix, label, delay }: { number: number; suffix: string; label: string; delay: number }) {
  const { ref, display } = useCounter(number, suffix, delay);
  return (
    <div ref={ref} className="stat-card fade-in">
      <div className="stat-number">{display}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <div className="faq-question" onClick={onToggle}>
        <span>{q}</span>
        <div className="faq-chevron">▾</div>
      </div>
      <div className="faq-answer">
        <div className="faq-answer-inner">{a}</div>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: '🎯', title: 'Smart Skill Matching', desc: 'Our AI-powered engine analyzes your skills and learning goals to surface the most compatible partners in seconds.' },
  { icon: '🤝', title: 'Find Learning Partners', desc: 'Connect with thousands of skilled individuals who are eager to teach what they know and learn what you offer.' },
  { icon: '💬', title: 'Real-Time Chat', desc: 'Jump into secure, real-time conversations the moment a match is made. No delays, no barriers—just pure collaboration.' },
  { icon: '⭐', title: 'Ratings & Reviews', desc: 'Build trust through a transparent review system. Rate partners after each session and grow your reputation.' },
  { icon: '🌍', title: 'Global Community', desc: 'Connect with learners and teachers from 150+ countries. Your next mentor could be across the street or across the globe.' },
  { icon: '🧠', title: 'AI Recommendations', desc: 'Our intelligent system continuously learns from your activity and suggests new skills, partners, and learning paths for you.' },
];

const PROFILES = [
  { initials: 'SK', bg: 'linear-gradient(135deg,#7C3AED,#4F46E5)', name: 'Sara Kim', country: '🇰🇷 Seoul, KR', rating: 4.9, offers: ['React', 'UI/UX', 'Figma'], wants: ['Machine Learning', 'Python'] },
  { initials: 'MJ', bg: 'linear-gradient(135deg,#0EA5E9,#2563EB)', name: 'Marco J.', country: '🇮🇹 Milan, IT', rating: 4.8, offers: ['Python', 'FastAPI', 'SQL'], wants: ['React', 'TypeScript'] },
  { initials: 'AL', bg: 'linear-gradient(135deg,#059669,#0D9488)', name: 'Amara Levi', country: '🇳🇬 Lagos, NG', rating: 5.0, offers: ['Node.js', 'MongoDB'], wants: ['DevOps', 'Docker'] },
  { initials: 'RN', bg: 'linear-gradient(135deg,#EC4899,#EF4444)', name: 'Riya N.', country: '🇮🇳 Mumbai, IN', rating: 4.7, offers: ['Vue.js', 'CSS', 'Animation'], wants: ['AWS', 'Kubernetes'] },
  { initials: 'TH', bg: 'linear-gradient(135deg,#F59E0B,#EF4444)', name: 'Tom H.', country: '🇬🇧 London, UK', rating: 4.9, offers: ['Rust', 'Go', 'Systems'], wants: ['Web3', 'Solidity'] },
  { initials: 'YZ', bg: 'linear-gradient(135deg,#8B5CF6,#EC4899)', name: 'Yuki Z.', country: '🇯🇵 Tokyo, JP', rating: 4.8, offers: ['Three.js', 'WebGL', 'GSAP'], wants: ['Backend', 'Databases'] },
];

const TESTIMONIALS = [
  { initials: 'JM', bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', name: 'James M.', role: 'Full-Stack Dev, NYC', text: '"SkillSwap completely changed how I learn. I traded my React knowledge for Python skills and ended up with a co-founder. Absolutely incredible platform."', rating: 5 },
  { initials: 'PR', bg: 'linear-gradient(135deg,#0EA5E9,#2563EB)', name: 'Priya R.', role: 'UX Designer, London', text: '"The AI matching is spookily accurate. I connected with a developer in Tokyo who taught me three.js in exchange for my Figma expertise. 10/10."', rating: 5 },
  { initials: 'AK', bg: 'linear-gradient(135deg,#059669,#0D9488)', name: 'Alex K.', role: 'Data Scientist, Berlin', text: '"I\'ve tried many platforms but SkillSwap feels premium. The community is super engaged and the chat system makes collaboration seamless."', rating: 5 },
  { initials: 'LT', bg: 'linear-gradient(135deg,#EC4899,#F59E0B)', name: 'Lena T.', role: 'Cloud Engineer, Toronto', text: '"Used SkillSwap to transition into DevOps. Found a partner who needed my Terraform knowledge and taught me Kubernetes. Pure gold."', rating: 5 },
  { initials: 'CM', bg: 'linear-gradient(135deg,#F59E0B,#EF4444)', name: 'Carlos M.', role: 'Mobile Dev, São Paulo', text: '"The rating system creates accountability. Everyone shows up prepared and ready to teach. I\'ve completed 12 swaps in 3 months!"', rating: 5 },
];

const FAQS = [
  { q: 'Is SkillSwap completely free to use?', a: 'The core skill swapping experience is completely free forever. We also offer a Pro plan with advanced AI matching, unlimited sessions, and priority support for power users.' },
  { q: 'How does the skill matching algorithm work?', a: 'Our AI analyzes your skill profile, learning goals, timezone, ratings, and past swap history to surface the most compatible partners. The more you use SkillSwap, the smarter it gets.' },
  { q: 'What kinds of skills can I swap?', a: 'Anything! Programming languages, design tools, languages, music, photography, marketing, finance—if you can teach it, you can swap it. We support 120+ skill categories.' },
  { q: 'How do I get started?', a: 'Sign up in under 60 seconds, list 2-3 skills you can teach and 2-3 you want to learn, and our AI immediately starts finding your best matches.' },
  { q: 'Is my personal data safe?', a: 'Absolutely. We use end-to-end encryption for all chats, and your contact details are only shared after both parties agree to a swap. Your privacy is paramount.' },
];

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useScrollAnimation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#07070A', color: '#fff', position: 'relative' }}>
      <ParticleCanvas />

      {/* ── Glow Orbs ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
      </div>

      {/* ──────────────────── NAVBAR ──────────────────── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} style={{ zIndex: 200 }}>
        {/* Logo */}
        <a href="#" className="nav-logo" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="nav-logo-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="3" fill="white"/>
            </svg>
          </div>
          <span style={{ background: 'linear-gradient(135deg,#fff,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SkillSwap</span>
        </a>

        {/* Center Nav */}
        <ul className="nav-links nav-center" style={{ display: 'flex' }}>
          {[['Home','home'],['Browse Skills','features'],['Find Partners','community'],['How It Works','how-it-works'],['Pricing','faq'],['Contact','footer']].map(([label, id]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>{label}</a>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="nav-actions">
          <a href="#" className="nav-login">Login</a>
          <button className="btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }} onClick={() => scrollTo('cta')}>
            <span>Get Started</span>
          </button>
          <button className="nav-toggle" onClick={() => setMobileMenuOpen(o => !o)}>☰</button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute', top: '72px', left: 0, right: 0,
            background: 'rgba(7,7,10,0.97)', backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(139,92,246,0.15)',
            padding: '20px 5%', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 300,
          }}>
            {[['Home','home'],['Features','features'],['Community','community'],['How It Works','how-it-works'],['FAQ','faq']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                textAlign: 'left', background: 'none', border: 'none', color: '#A1A1AA',
                fontSize: '15px', padding: '12px 8px', cursor: 'pointer', borderRadius: '8px',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#A1A1AA')}
              >{label}</button>
            ))}
          </div>
        )}
      </nav>

      {/* ──────────────────── HERO ──────────────────── */}
      <section id="home" className="hero">
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

          {/* Badge */}
          <div style={{ textAlign: 'center' }}>
            <div className="hero-badge fade-in" style={{ display: 'inline-flex' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', animation: 'badge-pulse 1.5s ease-in-out infinite', boxShadow: '0 0 8px #4ADE80' }} />
              ✨ The future of skill exchange is here
            </div>
          </div>

          {/* Headline */}
          <h1 className="hero-title fade-in fade-in-delay-1" style={{ textAlign: 'center' }}>
            <span className="gradient-text-hero">Swap Skills.</span>{' '}
            <span style={{ color: '#fff' }}>Grow Together.</span>
            <br />
            <span style={{ color: '#fff' }}>Learn Without</span>{' '}
            <span className="gradient-text">Limits.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle fade-in fade-in-delay-2">
            Connect with people around the world, exchange knowledge, teach what you love, and learn new skills — without spending a single dollar.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta fade-in fade-in-delay-3">
            <button className="btn-primary magnetic-btn" onClick={() => scrollTo('features')} style={{ fontSize: '16px', padding: '16px 36px', borderRadius: '14px' }}>
              <span>🚀 Get Started Free</span>
            </button>
            <button className="btn-glass magnetic-btn" onClick={() => scrollTo('community')} style={{ fontSize: '16px', borderRadius: '14px' }}>
              🔍 Explore Skills
            </button>
          </div>

          {/* Dashboard Mockup */}
          <div className="dashboard-mockup fade-in fade-in-delay-4">
            <div className="mockup-glow" />
            <div className="mockup-frame">
              {/* Top Bar */}
              <div className="mockup-topbar">
                <div className="mockup-dot red" />
                <div className="mockup-dot yellow" />
                <div className="mockup-dot green" />
                <div className="mockup-search">
                  <span>🔍</span>
                  <span>Search skills, partners...</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>You</div>
                </div>
              </div>

              {/* Body */}
              <div className="mockup-body">
                {/* Sidebar */}
                <div className="mockup-sidebar">
                  <div style={{ fontSize: '10px', color: '#3F3F46', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Navigation</div>
                  {[['🏠', 'Dashboard', true], ['🎯', 'My Matches', false], ['💬', 'Messages', false], ['⭐', 'Reviews', false], ['🌍', 'Explore', false]].map(([icon, label, active], i) => (
                    <div key={i} className={`sidebar-item${active ? ' active' : ''}`}>
                      <span>{icon}</span>
                      <span>{label}</span>
                      {active && <div className="sidebar-dot" style={{ marginLeft: 'auto' }} />}
                    </div>
                  ))}

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', padding: '10px 12px' }}>
                      <div style={{ fontSize: '10px', color: '#8B5CF6', fontWeight: 700, marginBottom: '6px' }}>AI Score</div>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#C084FC', lineHeight: 1 }}>94%</div>
                      <div style={{ fontSize: '9px', color: '#52525B', marginTop: '2px' }}>Match Quality</div>
                      <div className="progress-bar" style={{ marginTop: '10px' }}>
                        <div className="progress-fill" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="mockup-content">
                  <div style={{ fontSize: '11px', color: '#52525B', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>🎯 Top Matches For You</div>

                  {[
                    { initials: 'SK', bg: 'linear-gradient(135deg,#7C3AED,#6D28D9)', name: 'Sara Kim', skill: 'React → Python', badge: 'Perfect Match', badgeClass: 'perfect' },
                    { initials: 'MJ', bg: 'linear-gradient(135deg,#2563EB,#0EA5E9)', name: 'Marco J.', skill: 'Python → TypeScript', badge: '98% Match', badgeClass: 'good' },
                    { initials: 'AL', bg: 'linear-gradient(135deg,#059669,#0D9488)', name: 'Amara L.', skill: 'Node → DevOps', badge: 'Great Match', badgeClass: 'good' },
                  ].map((m, i) => (
                    <div key={i} className="match-card">
                      <div className="match-avatar" style={{ background: m.bg, color: '#fff' }}>{m.initials}</div>
                      <div className="match-info">
                        <div className="match-name">{m.name}</div>
                        <div className="match-skill">{m.skill}</div>
                      </div>
                      <div className={`match-badge ${m.badgeClass}`}>{m.badge}</div>
                    </div>
                  ))}

                  <div className="ai-rec-box">
                    <div className="ai-rec-title">🧠 AI Recommendation</div>
                    <div>Based on your profile, you'd excel at:</div>
                    <div style={{ marginTop: '6px' }}>
                      {['TypeScript', 'Next.js', 'GraphQL'].map(t => (
                        <span key={t} className="ai-rec-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── TRUSTED BY ──────────────────── */}
      <div className="trusted-section" style={{ position: 'relative', zIndex: 10 }}>
        <div className="trusted-label">Trusted by professionals at</div>
        <div className="logos-row">
          {['Google', 'Microsoft', 'Adobe', 'Coursera', 'Udemy', 'LinkedIn'].map(logo => (
            <div key={logo} className="logo-item">{logo}</div>
          ))}
        </div>
      </div>

      {/* ──────────────────── FEATURES ──────────────────── */}
      <section id="features" className="section" style={{ position: 'relative', zIndex: 10 }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Platform Features</div>
            <h2 className="section-title fade-in">
              Everything you need to{' '}
              <span className="gradient-text">grow faster</span>
            </h2>
            <p className="section-subtitle fade-in fade-in-delay-1" style={{ margin: '0 auto 60px' }}>
              Six powerful features designed to make skill sharing as effortless and rewarding as possible.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`feature-card fade-in fade-in-delay-${(i % 3) + 1}`}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── HOW IT WORKS ──────────────────── */}
      <section id="how-it-works" className="section" style={{ background: 'rgba(255,255,255,0.01)', position: 'relative', zIndex: 10 }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>The Process</div>
            <h2 className="section-title fade-in">
              Start swapping in{' '}
              <span className="gradient-text">4 simple steps</span>
            </h2>
            <p className="section-subtitle fade-in fade-in-delay-1" style={{ margin: '0 auto 0' }}>
              From zero to your first skill exchange in under 5 minutes.
            </p>
          </div>

          <div className="steps-row fade-in">
            {[
              { icon: '👤', step: '01', title: 'Create Profile', desc: 'Sign up in 60 seconds and build your skill profile with everything you can teach.' },
              { icon: '🏷️', step: '02', title: 'Add Skills', desc: 'List skills you offer and skills you want to learn. Be as specific or broad as you like.' },
              { icon: '🤝', step: '03', title: 'Match with People', desc: 'Our AI finds your best matches instantly based on mutual skill needs.' },
              { icon: '🚀', step: '04', title: 'Start Learning', desc: 'Connect, schedule a session, and begin your skill exchange journey today.' },
            ].map((s, i) => (
              <div key={i} className="step-item" style={{ animationDelay: `${i * 0.1}s` }}>
                {i < 3 && (
                  <div style={{
                    position: 'absolute', top: '30px', left: '60%', right: '-10%', height: '2px', zIndex: 0,
                    background: 'linear-gradient(90deg, rgba(139,92,246,0.6), rgba(139,92,246,0.15))',
                  }} />
                )}
                <div className="step-number" style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: '24px' }}>{s.icon}</span>
                </div>
                <div style={{
                  position: 'absolute', top: '-8px', right: '50%', transform: 'translateX(24px)',
                  fontSize: '10px', fontWeight: 700, color: '#8B5CF6', letterSpacing: '1px'
                }}>{s.step}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── COMMUNITY SHOWCASE ──────────────────── */}
      <section id="community" className="section" style={{ position: 'relative', zIndex: 10 }}>
        <div className="section-inner">
          <div style={{ marginBottom: '60px' }}>
            <div className="section-label">Community</div>
            <h2 className="section-title fade-in">
              Meet the people who{' '}
              <span className="gradient-text">power SkillSwap</span>
            </h2>
            <p className="section-subtitle fade-in fade-in-delay-1">
              Thousands of skilled individuals from every corner of the globe, sharing knowledge and growing together.
            </p>
          </div>

          <div className="profiles-grid">
            {PROFILES.map((p, i) => (
              <div key={i} className={`profile-card fade-in fade-in-delay-${(i % 3) + 1}`}>
                <div className="profile-header">
                  <div className="profile-avatar" style={{ background: p.bg, color: '#fff', position: 'relative' }}>
                    {p.initials}
                    <div className="active-dot" />
                  </div>
                  <div>
                    <div className="profile-name">{p.name}</div>
                    <div className="profile-country">{p.country}</div>
                  </div>
                  <div className="profile-rating" style={{ marginLeft: 'auto' }}>
                    <span className="star">★</span>
                    <span className="rating-num">{p.rating}</span>
                  </div>
                </div>

                <div className="skill-section">
                  <div className="skill-label">Offers</div>
                  <div className="skill-tags">
                    {p.offers.map(s => <span key={s} className="skill-tag offer">{s}</span>)}
                  </div>
                </div>

                <div className="skill-section">
                  <div className="skill-label">Wants to learn</div>
                  <div className="skill-tags">
                    {p.wants.map(s => <span key={s} className="skill-tag want">{s}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── STATISTICS ──────────────────── */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)', position: 'relative', zIndex: 10 }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>By The Numbers</div>
            <h2 className="section-title fade-in">
              The numbers that{' '}
              <span className="gradient-text">speak for themselves</span>
            </h2>
          </div>

          <div className="stats-grid">
            <StatCard number={50} suffix="K+" label="Active Members" delay={0} />
            <StatCard number={120} suffix="+" label="Skill Categories" delay={100} />
            <StatCard number={500} suffix="K+" label="Skill Swaps Completed" delay={200} />
            <StatCard number={98} suffix="%" label="Satisfaction Rate" delay={300} />
          </div>
        </div>
      </section>

      {/* ──────────────────── TESTIMONIALS ──────────────────── */}
      <section className="section" style={{ position: 'relative', zIndex: 10 }}>
        <div className="section-inner" style={{ maxWidth: 'none', padding: 0 }}>
          <div style={{ padding: '0 5%', marginBottom: '52px' }}>
            <div className="section-label">Testimonials</div>
            <h2 className="section-title fade-in">
              Loved by{' '}
              <span className="gradient-text">50,000+ learners</span>
            </h2>
            <p className="section-subtitle fade-in fade-in-delay-1">
              Real stories from real people who've transformed their careers through skill exchange.
            </p>
          </div>

          {/* Auto-scroll carousel */}
          <div style={{ overflow: 'hidden', padding: '20px 0' }}>
            <div className="testimonials-wrapper">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="review-stars">
                    {Array(t.rating).fill(0).map((_, j) => <span key={j} className="star">★</span>)}
                  </div>
                  <p className="review-text">{t.text}</p>
                  <div className="reviewer">
                    <div className="reviewer-avatar" style={{ background: t.bg, color: '#fff' }}>{t.initials}</div>
                    <div>
                      <div className="reviewer-name">{t.name}</div>
                      <div className="reviewer-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── FAQ ──────────────────── */}
      <section id="faq" className="section" style={{ background: 'rgba(255,255,255,0.01)', position: 'relative', zIndex: 10 }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>FAQ</div>
            <h2 className="section-title fade-in">
              Questions we get{' '}
              <span className="gradient-text">all the time</span>
            </h2>
            <p className="section-subtitle fade-in fade-in-delay-1" style={{ margin: '0 auto 0' }}>
              Can't find what you're looking for? Reach out to our team.
            </p>
          </div>

          <div className="faq-list fade-in">
            {FAQS.map((f, i) => (
              <FAQItem
                key={i} q={f.q} a={f.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FINAL CTA ──────────────────── */}
      <section id="cta" className="cta-section" style={{ position: 'relative', zIndex: 10 }}>
        <div className="cta-bg-glow" />
        <div className="cta-card fade-in">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '100px', padding: '8px 18px', fontSize: '13px', fontWeight: 500, color: '#C084FC', marginBottom: '28px', position: 'relative' }}>
            🎉 Join 50,000+ learners today
          </div>
          <h2 className="cta-title">
            Start Swapping Skills<br />
            <span className="gradient-text">Today — It's Free</span>
          </h2>
          <p className="cta-subtitle">
            No credit card required. Create your profile, add your skills, and be matched in minutes.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <button className="btn-primary" style={{ fontSize: '17px', padding: '18px 42px', borderRadius: '16px' }}>
              <span>✨ Join Free — No Credit Card</span>
            </button>
            <button className="btn-glass" style={{ fontSize: '17px', borderRadius: '16px' }}>
              See How It Works →
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginTop: '44px', flexWrap: 'wrap' }}>
            {['🔒 Secure & Private', '⚡ Instant Matching', '🌍 Global Community', '💸 Always Free'].map(b => (
              <div key={b} style={{ fontSize: '13px', color: '#52525B', display: 'flex', alignItems: 'center', gap: '4px' }}>{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FOOTER ──────────────────── */}
      <footer id="footer" className="footer" style={{ position: 'relative', zIndex: 10 }}>
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div className="nav-logo-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
                    <circle cx="10" cy="10" r="3" fill="white"/>
                  </svg>
                </div>
                <span style={{ fontSize: '20px', fontWeight: 800, background: 'linear-gradient(135deg,#fff,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SkillSwap</span>
              </div>
              <p>The world's most premium platform for skill exchange. Connect, learn, and grow — together.</p>
              <div className="social-row">
                {[['𝕏', 'Twitter'], ['in', 'LinkedIn'], ['gh', 'GitHub'], ['yt', 'YouTube']].map(([icon, label]) => (
                  <a key={label} href="#" className="social-btn" title={label}>{icon}</a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                {['Home', 'Browse Skills', 'Find Partners', 'Dashboard', 'Leaderboard'].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div className="footer-col">
              <h4>Community</h4>
              <ul>
                {['Blog', 'Success Stories', 'Discord Server', 'Events', 'Mentorship'].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-col">
              <h4>Stay Updated</h4>
              <p style={{ fontSize: '13px', color: '#52525B', marginBottom: '16px', lineHeight: 1.6 }}>Get weekly insights on skill trends and new matches.</p>
              <div className="newsletter-form">
                <input type="email" className="newsletter-input" placeholder="your@email.com" />
                <button className="newsletter-btn">→</button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <div className="footer-copyright">© 2026 SkillSwap. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                <a key={l} href="#" style={{ fontSize: '13px', color: '#3F3F46', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C084FC')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3F3F46')}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
