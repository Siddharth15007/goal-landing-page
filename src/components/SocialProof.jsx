import { useState, useEffect } from 'react'

export default function SocialProof({ variant = 'desktop', count }) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 900 : false
  )

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 900)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (variant === 'mobile') {
    if (!isMobile) return null
    return (
      <div className="social-proof reveal delay-3" id="proof-mobile">
        <div className="proof-bar">
          <div className="avatar-stack" aria-hidden="true">
            <div className="av av-1">S</div>
            <div className="av av-2">A</div>
            <div className="av av-3">R</div>
            <div className="av av-4">K</div>
            <div className="av av-5">+</div>
          </div>
          <p className="proof-text"><strong id="counter-m">{count}</strong>+ already waiting</p>
          <div className="proof-pulse" aria-hidden="true"></div>
        </div>
      </div>
    )
  }

  if (isMobile) return null

  return (
    <section className="container social-proof" aria-label="Waitlist count" id="proof-desktop">
      <div className="proof-bar">
        <div className="avatar-stack" aria-hidden="true">
          <div className="av av-1">S</div>
          <div className="av av-2">A</div>
          <div className="av av-3">R</div>
          <div className="av av-4">K</div>
          <div className="av av-5">+</div>
        </div>
        <p className="proof-text"><strong id="counter">{count}</strong>+ people already on the list — and it's growing.</p>
        <div className="proof-pulse" aria-hidden="true"></div>
      </div>
    </section>
  )
}
