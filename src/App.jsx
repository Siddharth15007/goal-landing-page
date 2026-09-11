import { useState } from 'react'
import Nav from './components/Nav'
import HeroVisual from './components/HeroVisual'
import WaitlistForm from './components/WaitlistForm'
import SocialProof from './components/SocialProof'
import Benefits from './components/Benefits'
import TerminalQuote from './components/TerminalQuote'
import Footer from './components/Footer'
import { useCounter } from './hooks/useCounter'

export default function App() {
  const [targetCount, setTargetCount] = useState(247)
  const count = useCounter(targetCount, 700)

  const handleSuccess = () => {
    setTargetCount((prev) => prev + 1)
  }

  return (
    <>
      {/* Backgrounds */}
      <div className="bg-grid" aria-hidden="true"></div>
      <div className="bg-horizon" aria-hidden="true"></div>
      <div className="orb orb-1" aria-hidden="true"></div>
      <div className="orb orb-2" aria-hidden="true"></div>
      <div className="orb orb-3" aria-hidden="true"></div>

      {/* Nav */}
      <Nav />

      <main>
        {/* Hero */}
        <section className="container hero" aria-labelledby="headline">
          {/* Left column */}
          <div>
            <div className="status-line reveal">
              <span className="blink" aria-hidden="true"></span>
              System loading — Stand by
            </div>

            <h1 id="headline" className="reveal delay-1">
              Goals are easy.<br />
              <span className="glitch" data-text="Finishing them isn't.">
                Finishing them isn't.
              </span>
            </h1>

            <p className="hero-sub reveal delay-2">
              Something is being built that will finally close the gap between where you are and where you want to be.
              No fluff. No shortcuts. Just the thing that actually works.
            </p>

            {/* Social proof — mobile only */}
            <SocialProof variant="mobile" count={count} />

            {/* Waitlist Form */}
            <WaitlistForm onSuccess={handleSuccess} />
          </div>

          {/* Right column — geometric visual */}
          <HeroVisual />
        </section>

        {/* Social Proof — desktop only */}
        <SocialProof variant="desktop" count={count} />

        {/* Benefits */}
        <Benefits />

        {/* Terminal Quote */}
        <TerminalQuote />
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
