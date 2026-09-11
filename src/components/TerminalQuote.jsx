import { useEffect, useRef } from 'react'

export default function TerminalQuote() {
  const boxRef = useRef(null)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
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

    el.classList.remove('reveal')
    io.observe(el)

    return () => io.disconnect()
  }, [])

  return (
    <section className="container terminal-quote" aria-label="Manifesto">
      <div ref={boxRef} className="terminal-box">
        <blockquote>
          "The gap between setting a goal and living it isn't motivation.<br />
          It's infrastructure."<span className="terminal-cursor" aria-hidden="true"></span>
        </blockquote>
      </div>
    </section>
  )
}
