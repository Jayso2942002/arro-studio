import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { t, pick } from './i18n'

const CATEGORIES = ['Website Design', 'Dashboards', 'Mobile Apps']

/* ---------- small helpers ---------- */

const PATHS = {
  pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  code: <><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></>,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  spark: <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  upright: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  close: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
}

function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name] || PATHS.code}
    </svg>
  )
}

/* ---------- page ---------- */

export default function App() {
  const [lang, setLang] = useState('en')
  const [data, setData] = useState({ services: [], projects: [], steps: [], team: [], settings: {} })
  const [filter, setFilter] = useState('All')
  const [contactOpen, setContactOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const [s, p, st, tm, cfg] = await Promise.all([
        supabase.from('services').select('*').order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('process_steps').select('*').order('sort_order'),
        supabase.from('team_members').select('*').order('sort_order'),
        supabase.from('site_settings').select('*'),
      ])
      setData({
        services: s.data || [],
        projects: p.data || [],
        steps: st.data || [],
        team: tm.data || [],
        settings: Object.fromEntries((cfg.data || []).map((r) => [r.key, r.value])),
      })
    }
    load()
  }, [])

  const { services, projects, steps, team, settings } = data
  const hero = settings.hero || {}
  const stats = settings.stats || {}
  const headline = hero[`headline_${lang}`] || hero.headline_en || 'We Design & Build Your Online Brand'
  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div className="page" lang={lang === 'mm' ? 'my' : 'en'}>
      {/* ---------- navigation ---------- */}
      <header className="container nav">
        <a className="brand" href="#home">
          <img src="/arro-logo.png" alt="" />
          <span>ARRO STUDIO</span>
        </a>
        <nav id="main-menu" className={`nav-links${menuOpen ? ' open' : ''}`} aria-label="Main" onClick={() => setMenuOpen(false)}>
          <a href="#home" className="active">{t(lang, 'home')}</a>
          <a href="#services">{t(lang, 'services')}</a>
          <a href="#work">{t(lang, 'work')}</a>
          <a href="#about">{t(lang, 'about')}</a>
          <a href="#contact">{t(lang, 'contact')}</a>
        </nav>
        <div className="nav-actions">
          <div className="lang" role="group" aria-label="Language">
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'mm' ? 'on' : ''} onClick={() => setLang('mm')}>MM</button>
          </div>
          <button className="btn" onClick={() => setContactOpen(true)}>{t(lang, 'startProject')}</button>
          <button className="burger" aria-label="Menu" aria-expanded={menuOpen} aria-controls="main-menu"
            onClick={() => setMenuOpen((o) => !o)}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </header>

      <main>
        {/* ---------- hero ---------- */}
        <section id="home" className="container hero">
          <h1>{headline}</h1>
          <div className="ghost" aria-hidden="true">ARRO STUDIO</div>
          <div className="hero-grid">
            <div className="hero-left">
              <a className="consult" href="#contact" onClick={(e) => { e.preventDefault(); setContactOpen(true) }}>
                <span className="sq light"><Icon name="upright" /></span>
                <span className="sq dark"><Icon name="spark" /></span>
                <span><strong>{t(lang, 'consultation')}</strong><small>{t(lang, 'bookNow')}</small></span>
              </a>
              <div className="stat-card">
                <div className="stat-top">
                  <span className="big">{stats.projects || '00+'}</span>
                  <a className="round dark" href="#work" aria-label={t(lang, 'ourProjects')}><Icon name="arrow" size={20} /></a>
                </div>
                <span>{t(lang, 'projectsDelivered')}</span>
                <div className="chips">
                  <span>Website Design</span><span>Website</span><span>Application</span>
                </div>
              </div>
            </div>

            <div className="hero-robot">
              <img src="/arro-robot.png" alt="ARRO STUDIO robot mascot" />
            </div>

            <div className="hero-right">
              <svg className="squiggle" width="90" height="48" viewBox="0 0 90 48" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 30c20 6 30-24 10-26-14-1-8 22 14 26 20 3 34-8 54-14" /><path d="m72 10 12 4-5 11" />
              </svg>
              <div className="numbers">
                <div><span className="num">{stats.clients || '00'}</span><small>{t(lang, 'happyClients')}</small></div>
                <i />
                <div><span className="num">{stats.years || '0Y'}</span><small>{t(lang, 'experience')}</small></div>
              </div>
              <div className="glass">
                <strong>{t(lang, 'glassTitle')}</strong>
                <p>{t(lang, 'glassText')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- services ---------- */}
        <section id="services" className="container services">
          {services.map((s) => (
            <article className="card" key={s.id}>
              <span className="ico"><Icon name={s.icon} /></span>
              <h3>{pick(s, 'title', lang)}</h3>
              <p>{pick(s, 'description', lang)}</p>
            </article>
          ))}
        </section>

        {/* ---------- projects ---------- */}
        <section id="work" className="container projects">
          <h2 className="center">{t(lang, 'ourProjects')}</h2>
          <p className="center muted">{t(lang, 'projectsSub')}</p>
          <div className="filters">
            {['All', ...CATEGORIES].map((c) => (
              <button key={c} className={filter === c ? 'on' : ''} onClick={() => setFilter(c)}>
                {c === 'All' ? t(lang, 'all') : c}
              </button>
            ))}
          </div>
          {visible.length === 0 && <p className="center muted">{t(lang, 'noItems')}</p>}
          {visible.map((p, i) => (
            <article className="proj" key={p.id}>
              <div className="proj-info">
                <p className="eyebrow">
                  {String(i + 1).padStart(2, '0')} / {p.is_concept ? t(lang, 'conceptProject') : t(lang, 'project')}
                </p>
                <h3>{p.title}</h3>
                {p.thumbnail_url && <img className="thumb" src={p.thumbnail_url} alt="" />}
                <p className="muted">{pick(p, 'description', lang)}</p>
                <div className="tags">{(p.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <div className="proj-preview">
                {p.cover_image_url
                  ? <img src={p.cover_image_url} alt={p.title} />
                  : <div className="placeholder">{p.title}</div>}
                <div className="proj-bar">
                  <div><strong>{p.title}</strong><small>{pick(p, 'tagline', lang)}</small></div>
                  {p.live_url && (
                    <a className="round dark" href={p.live_url} target="_blank" rel="noreferrer"
                      aria-label={`${t(lang, 'viewProject')}: ${p.title}`}><Icon name="upright" size={20} /></a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ---------- how we work ---------- */}
        <section id="about" className="container">
          <div className="how">
            <div className="how-head">
              <h2>{t(lang, 'howTitle1')}<br />{t(lang, 'howTitle2')}</h2>
              <p>{t(lang, 'howSub')}</p>
            </div>
            <div className="how-grid">
              {steps.map((s) => (
                <article className="step" key={s.id}>
                  <div className="step-top">
                    <span className="ico pink"><Icon name={s.icon} /></span>
                    <span className="arrow"><Icon name="arrow" size={18} /></span>
                  </div>
                  <h3>{pick(s, 'title', lang)}</h3>
                  <p>{pick(s, 'description', lang)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- leadership ---------- */}
        <section className="container team">
          <h2 className="center">{t(lang, 'leadership')}</h2>
          <p className="center muted narrow">{t(lang, 'leadershipSub')}</p>
          <div className="team-grid">
            {team.map((m) => (
              <article className="member" key={m.id}>
                {m.photo_url
                  ? <img src={m.photo_url} alt={m.full_name} />
                  : <div className="placeholder">{m.full_name}</div>}
                <div className="member-info">
                  <h3>{m.full_name}</h3>
                  <p>{pick(m, 'role', lang)}</p>
                  <div className="links">
                    {m.linkedin_url && <a href={m.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>}
                    {m.instagram_url && <a href={m.instagram_url} target="_blank" rel="noreferrer">Instagram</a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- call to action + newsletter ---------- */}
        <section id="contact" className="container">
          <Cta lang={lang} onStart={() => setContactOpen(true)} />
        </section>
      </main>

      <footer className="container footer">© 2026 ARRO STUDIO</footer>

      {contactOpen && <ContactModal lang={lang} onClose={() => setContactOpen(false)} />}
    </div>
  )
}

/* ---------- call to action ---------- */

function Cta({ lang, onStart }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  async function subscribe(e) {
    e.preventDefault()
    const { error } = await supabase.from('newsletter_subscribers').insert({ email })
    // code 23505 = already subscribed, which is fine for the visitor
    if (error && error.code !== '23505') return setStatus('failed')
    setEmail('')
    setStatus('subscribed')
  }

  return (
    <div className="cta">
      <div className="cta-main">
        <div>
          <p className="eyebrow pink-text">{t(lang, 'nextIdea')}</p>
          <h2>
            {t(lang, 'join1')}<br />{t(lang, 'join2')} <span>{t(lang, 'gorgeous')}</span><br />{t(lang, 'join3')}
          </h2>
          <p className="muted">{t(lang, 'joinSub')}</p>
        </div>
        <img src="/arro-robot.png" alt="" />
      </div>
      <div className="cta-bottom">
        <div>
          <h3>{t(lang, 'haveProject')}<br />{t(lang, 'makeHappen')}</h3>
          <button className="btn" onClick={onStart}>{t(lang, 'startProject')} <Icon name="upright" size={16} /></button>
        </div>
        <form onSubmit={subscribe}>
          <h3>{t(lang, 'newsletter')}</h3>
          <div className="nl-row">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder={t(lang, 'emailAddress')} aria-label={t(lang, 'emailAddress')} />
            <button className="round pink" aria-label={t(lang, 'newsletter')}><Icon name="arrow" size={20} /></button>
          </div>
          <small className="muted" role="status">{status ? t(lang, status) : t(lang, 'newsletterNote')}</small>
        </form>
      </div>
    </div>
  )
}

/* ---------- "Start a project" form ---------- */

function ContactModal({ lang, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function send(e) {
    e.preventDefault()
    const { error } = await supabase.from('contact_messages').insert(form)
    setStatus(error ? 'failed' : 'sent')
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={send}>
        <h3>{t(lang, 'contactTitle')}</h3>
        <label>{t(lang, 'name')}<input required value={form.name} onChange={set('name')} /></label>
        <label>{t(lang, 'email')}<input type="email" required value={form.email} onChange={set('email')} /></label>
        <label>{t(lang, 'message')}<textarea required rows="4" value={form.message} onChange={set('message')} /></label>
        {status && <p role="status" className={status === 'sent' ? 'ok' : 'err'}>{t(lang, status)}</p>}
        <div className="modal-actions">
          <button type="button" className="btn outline" onClick={onClose}>{t(lang, 'close')}</button>
          {status !== 'sent' && <button className="btn">{t(lang, 'send')}</button>}
        </div>
      </form>
    </div>
  )
}