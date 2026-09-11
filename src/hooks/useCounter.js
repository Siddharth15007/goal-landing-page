import { useState, useEffect, useRef } from 'react'

export function useCounter(target, delay = 700) {
  const [count, setCount] = useState(() => Math.max(0, target - 20))
  const initialMount = useRef(true)

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false
      let cur = Math.max(0, target - 20)
      setCount(cur)
      let timerId

      const timeoutId = setTimeout(() => {
        function tick() {
          cur++
          setCount(cur)
          if (cur < target) {
            timerId = setTimeout(tick, 38)
          }
        }
        tick()
      }, delay)

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(timerId);
      }
    } else {
      setCount(target)
    }
  }, [target, delay])

  return count
}
