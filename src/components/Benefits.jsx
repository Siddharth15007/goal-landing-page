import { useEffect, useRef } from 'react'
import BenefitCard from './BenefitCard'

export default function Benefits() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const cards = containerRef.current.querySelectorAll('.card')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    cards.forEach((c) => {
      c.classList.remove('reveal')
      io.observe(c)
    })

    return () => io.disconnect()
  }, [])

  return (
    <section ref={containerRef} className="container benefits-section" aria-labelledby="benefits-head">
      <div className="benefits-header">
        <div className="section-label">What to expect</div>
        <h2 id="benefits-head">
          Built for the version of you<br />
          that <span>actually finishes things.</span>
        </h2>
      </div>

      <div className="benefits-grid">
        {/* Featured card */}
        <BenefitCard
          num="// 01"
          title={
            <>
              Shaped around your life,<br />
              not a template of someone else's.
            </>
          }
          body="You've tried the generic systems. The rigid schedules and one-size-fits-all frameworks. This isn't that. It adapts to how you actually move — not how a productivity influencer thinks you should."
          featured={true}
        />

        {/* Side card 1 */}
        <BenefitCard
          num="// 02"
          title="Built for day thirty-seven."
          body="Most tools are great on day one. The real test is when the feeling wears off. This is built for that moment."
          delayClass="delay-1"
        />

        {/* Side card 2 */}
        <BenefitCard
          num="// 03"
          title="Progress without the pressure."
          body="No guilt. No red streaks. Every step counts. You'll feel momentum before you even realise you have it."
          delayClass="delay-2"
        />
      </div>
    </section>
  )
}
