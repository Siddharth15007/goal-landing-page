import { useState, useRef } from 'react'

const COOLDOWN_MS = 5000
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

function sanitiseEmail(raw) {
  return String(raw || '').trim().slice(0, 254)
}

export default function WaitlistForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success'
  const [errorMsg, setErrorMsg] = useState('')
  const lastSubmitAtRef = useRef(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    // 1. Honeypot check — bots fill hidden fields
    if (honeypot.trim() !== '') {
      setStatus('success')
      return
    }

    // 2. Rate limit check
    const now = Date.now()
    if (now - lastSubmitAtRef.current < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - (now - lastSubmitAtRef.current)) / 1000)
      setErrorMsg('ERR // Too fast. Wait ' + wait + 's before retrying.')
      return
    }

    // 3. Sanitise + validate email
    const cleanEmail = sanitiseEmail(email)
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
      setErrorMsg('ERR // Enter a valid email address.')
      return
    }

    lastSubmitAtRef.current = Date.now()
    setStatus('loading')

    // 4. Mailchimp JSONP
    const cbName = 'mc_cb_' + Date.now()
    const baseUrl = window.__mu || ''
    const url = baseUrl.replace('&c=?', '&c=' + cbName) + '&EMAIL=' + encodeURIComponent(cleanEmail)

    let scriptEl = null

    // Timeout: if Mailchimp doesn't respond in 8s, show error
    const timeoutId = setTimeout(() => {
      if (window[cbName]) {
        delete window[cbName]
        if (scriptEl && scriptEl.parentNode) {
          scriptEl.parentNode.removeChild(scriptEl)
        }
        setStatus('idle')
        setErrorMsg('ERR // Request timed out. Please retry.')
        lastSubmitAtRef.current = 0
      }
    }, 8000)

    window[cbName] = (res) => {
      clearTimeout(timeoutId)
      delete window[cbName]
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl)
      }

      if (res && res.result === 'success') {
        setStatus('success')
        onSuccess?.()
      } else {
        setStatus('idle')
        const rawMsg = (res && res.msg) || 'Something went wrong. Try again.'
        const safeMsg = rawMsg.replace(/<[^>]*>/g, '').slice(0, 120)
        setErrorMsg('ERR // ' + safeMsg)
      }
    }

    scriptEl = document.createElement('script')
    scriptEl.src = url
    scriptEl.onerror = () => {
      clearTimeout(timeoutId)
      if (window[cbName]) delete window[cbName]
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl)
      }
      setStatus('idle')
      setErrorMsg('ERR // Network error. Please try again.')
      lastSubmitAtRef.current = 0
    }

    document.body.appendChild(scriptEl)
  }

  return (
    <div className="form-panel reveal delay-3">
      <div className="form-title">Request early access</div>

      <form
        id="mc-form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        style={{ display: status === 'success' ? 'none' : undefined }}
      >
        {/* Honeypot — bots fill this, humans don't (hidden via CSS) */}
        <div
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <label htmlFor="mc-hp">Leave blank</label>
          <input
            id="mc-hp"
            name="b_hp"
            type="text"
            tabIndex="-1"
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="mc-field">
          <label htmlFor="mc-email">Email address</label>
          <input
            id="mc-email"
            type="email"
            name="EMAIL"
            placeholder="you@domain.com"
            autoComplete="email"
            maxLength={254}
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errorMsg) setErrorMsg('')
            }}
          />
        </div>

        <div className={`form-error ${errorMsg ? 'visible' : ''}`} id="mc-error">
          {errorMsg || 'ERR // Enter a valid email address.'}
        </div>

        <button
          type="submit"
          className="btn-primary"
          id="mc-btn"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? '> TRANSMITTING...' : '> JOIN THE WAITLIST_'}
        </button>

        <p className="privacy-note">No spam. No noise. One message when it's ready.</p>
      </form>

      <div className={`success-state ${status === 'success' ? 'visible' : ''}`} id="mc-success">
        <div className="success-icon">◈</div>
        <h3>ACCESS REGISTERED</h3>
        <p>
          You're in the queue.
          <br />
          We'll reach out when the gates open.
        </p>
      </div>
    </div>
  )
}
