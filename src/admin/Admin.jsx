import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './admin.css'

/* =====================================================
   What each editor shows. To add a field later,
   add one line to the "fields" list of that table.
   t = type: text | textarea | number | bool | select | tags | image
   ===================================================== */
const ICONS = ['pen', 'code', 'phone', 'spark']
const CATEGORIES = ['Website Design', 'Dashboards', 'Mobile Apps']

const TABLES = {
  services: {
    label: 'Services', order: 'sort_order', title: (r) => r.title_en,
    meta: (r) => `Order ${r.sort_order}`,
    fields: [
      { k: 'title_en', l: 'Title (EN)', t: 'text', req: true },
      { k: 'title_mm', l: 'Title (MM)', t: 'text' },
      { k: 'description_en', l: 'Description (EN)', t: 'textarea' },
      { k: 'description_mm', l: 'Description (MM)', t: 'textarea' },
      { k: 'icon', l: 'Icon', t: 'select', options: ICONS },
      { k: 'sort_order', l: 'Order (1 = first)', t: 'number' },
      { k: 'is_published', l: 'Show on website', t: 'bool' },
    ],
  },
  projects: {
    label: 'Projects', order: 'sort_order', title: (r) => r.title,
    meta: (r) => r.category,
    fields: [
      { k: 'category', l: 'Category', t: 'select', options: CATEGORIES },
      { k: 'title', l: 'Project name', t: 'text', req: true },
      { k: 'tagline_en', l: 'Short line (EN)', t: 'text' },
      { k: 'tagline_mm', l: 'Short line (MM)', t: 'text' },
      { k: 'description_en', l: 'Description (EN)', t: 'textarea' },
      { k: 'description_mm', l: 'Description (MM)', t: 'textarea' },
      { k: 'tags', l: 'Tags (separate with commas)', t: 'tags' },
      { k: 'cover_image_url', l: 'Big preview image', t: 'image', bucket: 'portfolio' },
      { k: 'thumbnail_url', l: 'Small thumbnail image', t: 'image', bucket: 'portfolio' },
      { k: 'live_url', l: 'Live link (optional)', t: 'text' },
      { k: 'is_concept', l: 'This is a concept project', t: 'bool' },
      { k: 'sort_order', l: 'Order (1 = first)', t: 'number' },
      { k: 'is_published', l: 'Show on website', t: 'bool' },
    ],
  },
  process_steps: {
    label: 'How we work', order: 'sort_order', title: (r) => r.title_en,
    meta: (r) => `Order ${r.sort_order}`,
    fields: [
      { k: 'title_en', l: 'Title (EN)', t: 'text', req: true },
      { k: 'title_mm', l: 'Title (MM)', t: 'text' },
      { k: 'description_en', l: 'Description (EN)', t: 'textarea' },
      { k: 'description_mm', l: 'Description (MM)', t: 'textarea' },
      { k: 'icon', l: 'Icon', t: 'select', options: ICONS },
      { k: 'sort_order', l: 'Order (1 = first)', t: 'number' },
      { k: 'is_published', l: 'Show on website', t: 'bool' },
    ],
  },
  team_members: {
    label: 'Team', order: 'sort_order', title: (r) => r.full_name,
    meta: (r) => r.role_en || '',
    fields: [
      { k: 'full_name', l: 'Full name', t: 'text', req: true },
      { k: 'role_en', l: 'Role (EN)', t: 'text' },
      { k: 'role_mm', l: 'Role (MM)', t: 'text' },
      { k: 'photo_url', l: 'Photo', t: 'image', bucket: 'team' },
      { k: 'linkedin_url', l: 'LinkedIn link', t: 'text' },
      { k: 'instagram_url', l: 'Instagram link', t: 'text' },
      { k: 'sort_order', l: 'Order (1 = first)', t: 'number' },
      { k: 'is_published', l: 'Show on website', t: 'bool' },
    ],
  },
  contact_messages: {
    label: 'Messages', order: 'created_at', desc: true, canAdd: false,
    title: (r) => r.name,
    meta: (r) => `${r.email} · ${new Date(r.created_at).toLocaleDateString()}`,
    fields: [
      { k: 'name', l: 'Name', ro: true },
      { k: 'email', l: 'Email', ro: true },
      { k: 'message', l: 'Message', ro: true },
      { k: 'is_read', l: 'Marked as read', t: 'bool' },
    ],
  },
  newsletter_subscribers: {
    label: 'Subscribers', order: 'created_at', desc: true, canAdd: false,
    title: (r) => r.email,
    meta: (r) => new Date(r.created_at).toLocaleDateString(),
    fields: [{ k: 'email', l: 'Email', ro: true }],
  },
}

const SETTINGS = {
  hero: [
    { k: 'headline_en', l: 'Home headline (EN)' },
    { k: 'headline_mm', l: 'Home headline (MM)' },
  ],
  stats: [
    { k: 'projects', l: 'Projects delivered (example: 25+)' },
    { k: 'clients', l: 'Happy clients (example: 18)' },
    { k: 'years', l: 'Experience (example: 3Y)' },
  ],
  contact: [
    { k: 'email', l: 'Contact email' },
    { k: 'tiktok', l: 'TikTok link' },
    { k: 'facebook', l: 'Facebook link' },
  ],
}
const SETTINGS_LABEL = { hero: 'Home page', stats: 'Numbers on home page', contact: 'Contact details' }

/* ===================================================== page ===================================================== */

export default function Admin() {
  const [state, setState] = useState('loading') // loading | login | denied | ready

  const check = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return setState('login')
    const { data } = await supabase.rpc('is_admin')
    setState(data === true ? 'ready' : 'denied')
  }, [])

  useEffect(() => { check() }, [check])

  async function logout() {
    await supabase.auth.signOut()
    setState('login')
  }

  if (state === 'loading') return <div className="adm-center">Loading…</div>
  if (state === 'login') return <Login onDone={check} />
  if (state === 'denied') {
    return (
      <div className="adm-center">
        <div className="adm-box">
          <h1>No access</h1>
          <p>This account is not an admin. Sign out and use your admin email.</p>
          <button className="adm-btn" onClick={logout}>Sign out</button>
        </div>
      </div>
    )
  }
  return <Dashboard onLogout={logout} />
}

/* ===================================================== login ===================================================== */

function Login({ onDone }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Wrong email or password.')
    else onDone()
  }

  return (
    <div className="adm-center">
      <form className="adm-box" onSubmit={submit}>
        <h1>ARRO STUDIO admin</h1>
        <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="adm-err" role="alert">{error}</p>}
        <button className="adm-btn">Sign in</button>
      </form>
    </div>
  )
}

/* ===================================================== layout ===================================================== */

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('services')
  const tabs = [...Object.keys(TABLES), 'settings']
  const label = (k) => (k === 'settings' ? 'Settings' : TABLES[k].label)

  return (
    <div className="adm">
      <aside className="adm-side">
        <strong className="adm-logo">ARRO STUDIO</strong>
        <nav>
          {tabs.map((k) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label(k)}</button>
          ))}
        </nav>
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noreferrer">View website</a>
          <button onClick={onLogout}>Sign out</button>
        </div>
      </aside>
      <main className="adm-main">
        <h1>{label(tab)}</h1>
        {tab === 'settings' ? <Settings /> : <Manager key={tab} table={tab} cfg={TABLES[tab]} />}
      </main>
    </div>
  )
}

/* ===================================================== list + edit ===================================================== */

function Manager({ table, cfg }) {
  const [rows, setRows] = useState([])
  const [editing, setEditing] = useState(null) // null = list, {} = new, row = edit
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase.from(table).select('*').order(cfg.order, { ascending: !cfg.desc })
    if (error) setMsg(error.message)
    else setRows(data)
  }, [table, cfg])

  useEffect(() => { load() }, [load])

  async function remove(row) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    const { error } = await supabase.from(table).delete().eq('id', row.id)
    if (error) setMsg(error.message)
    else load()
  }

  if (editing) {
    return (
      <Form table={table} cfg={cfg} row={editing}
        onCancel={() => setEditing(null)}
        onDone={() => { setEditing(null); setMsg(''); load() }} />
    )
  }

  return (
    <>
      {cfg.canAdd !== false && <button className="adm-btn" onClick={() => setEditing({})}>+ Add new</button>}
      {msg && <p className="adm-err" role="alert">{msg}</p>}
      {rows.length === 0 && <p className="adm-muted">Nothing here yet.</p>}
      <ul className="adm-list">
        {rows.map((r) => (
          <li key={r.id}>
            <div>
              <strong>{cfg.title(r)}</strong>
              {r.is_published === false && <span className="badge">Hidden</span>}
              {r.is_read === false && <span className="badge new">New</span>}
              <small>{cfg.meta(r)}</small>
            </div>
            <div className="adm-actions">
              {table !== 'newsletter_subscribers' && <button onClick={() => setEditing(r)}>{cfg.canAdd === false ? 'Open' : 'Edit'}</button>}
              <button className="danger" onClick={() => remove(r)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

function Form({ table, cfg, row, onCancel, onDone }) {
  const isNew = !row.id
  const [v, setV] = useState(() => {
    const start = {}
    cfg.fields.forEach((f) => {
      if (f.t === 'bool') start[f.k] = f.k === 'is_published'
      else if (f.t === 'number') start[f.k] = 0
      else if (f.t === 'select') start[f.k] = f.options[0]
      else start[f.k] = ''
    })
    const merged = { ...start, ...row }
    cfg.fields.forEach((f) => {
      if (f.t === 'tags') merged[f.k] = Array.isArray(row[f.k]) ? row[f.k].join(', ') : ''
      if (merged[f.k] === null) merged[f.k] = f.t === 'bool' ? false : ''
    })
    return merged
  })
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const set = (k, val) => setV((x) => ({ ...x, [k]: val }))

    async function upload(f, file) {
    if (!file) return
    setUploading(true)
    setError('')
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    const { error } = await supabase.storage.from(f.bucket).upload(path, file)
    setUploading(false)
    if (error) return setError(error.message)
    set(f.k, supabase.storage.from(f.bucket).getPublicUrl(path).data.publicUrl)
  }

  async function save(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const payload = {}
    for (const f of cfg.fields) {
      if (f.ro) continue
      let val = v[f.k]
      if (f.t === 'number') val = Number(val) || 0
      else if (f.t === 'bool') val = !!val
      else if (f.t === 'tags') val = String(val || '').split(',').map((s) => s.trim()).filter(Boolean)
      else if (typeof val === 'string' && val.trim() === '' && !f.req) val = null
      payload[f.k] = val
    }
    const q = isNew ? supabase.from(table).insert(payload) : supabase.from(table).update(payload).eq('id', row.id)
    const { error } = await q
    setBusy(false)
    if (error) setError(error.message)
    else onDone()
  }

  return (
    <form className="adm-form" onSubmit={save}>
      {cfg.fields.map((f) => (
        <label key={f.k} className={f.t === 'bool' ? 'check' : ''}>
          {f.l}
          {f.ro && <p className="adm-readonly">{v[f.k]}</p>}
          {!f.ro && f.t === 'textarea' && <textarea rows="4" value={v[f.k]} onChange={(e) => set(f.k, e.target.value)} />}
          {!f.ro && f.t === 'bool' && <input type="checkbox" checked={!!v[f.k]} onChange={(e) => set(f.k, e.target.checked)} />}
          {!f.ro && f.t === 'select' && (
            <select value={v[f.k]} onChange={(e) => set(f.k, e.target.value)}>
              {f.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          )}
          {!f.ro && f.t === 'number' && <input type="number" value={v[f.k]} onChange={(e) => set(f.k, e.target.value)} />}
          {!f.ro && f.t === 'image' && (
            <div className="adm-image">
              {v[f.k] && <img src={v[f.k]} alt="" />}
              <input type="file" accept="image/*" onChange={(e) => upload(f, e.target.files[0])} />
            </div>
          )}
          {!f.ro && (f.t === 'text' || f.t === 'tags') && (
            <input required={f.req} value={v[f.k]} onChange={(e) => set(f.k, e.target.value)} />
          )}
        </label>
      ))}
      {error && <p className="adm-err" role="alert">{error}</p>}
      <div className="adm-actions">
        <button type="button" onClick={onCancel}>{cfg.canAdd === false ? 'Back' : 'Cancel'}</button>
                {cfg.fields.some((f) => !f.ro) && <button className="adm-btn" disabled={busy || uploading}>{uploading ? 'Uploading image…' : busy ? 'Saving…' : 'Save'}</button>}
      </div>
    </form>
  )
}

/* ===================================================== settings ===================================================== */

function Settings() {
  const [vals, setVals] = useState({ hero: {}, stats: {}, contact: {} })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.from('site_settings').select('*').then(({ data }) => {
      const o = { hero: {}, stats: {}, contact: {} }
      ;(data || []).forEach((r) => { o[r.key] = r.value || {} })
      setVals(o)
    })
  }, [])

  const set = (g, k, val) => setVals((x) => ({ ...x, [g]: { ...x[g], [k]: val } }))

  async function save(e) {
    e.preventDefault()
    const rows = Object.keys(SETTINGS).map((key) => ({ key, value: vals[key], updated_at: new Date().toISOString() }))
    const { error } = await supabase.from('site_settings').upsert(rows)
    setMsg(error ? error.message : 'Saved. Refresh the website to see it.')
  }

  return (
    <form className="adm-form" onSubmit={save}>
      {Object.entries(SETTINGS).map(([g, fields]) => (
        <fieldset key={g}>
          <legend>{SETTINGS_LABEL[g]}</legend>
          {fields.map((f) => (
            <label key={f.k}>{f.l}<input value={vals[g][f.k] || ''} onChange={(e) => set(g, f.k, e.target.value)} /></label>
          ))}
        </fieldset>
      ))}
      {msg && <p role="status" className={msg.startsWith('Saved') ? 'adm-ok' : 'adm-err'}>{msg}</p>}
      <div className="adm-actions"><button className="adm-btn">Save settings</button></div>
    </form>
  )
}
