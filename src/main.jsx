import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/* ── Anti-inspect protections (run once, outside React tree) ── */
;(function () {
  // 1. Right-click disable
  document.addEventListener('contextmenu', function (e) { e.preventDefault() })

  // 2. Block F12, Ctrl+Shift+I/J/C/U, Ctrl+S
  document.addEventListener('keydown', function (e) {
    var k = e.key || e.keyCode
    if (k === 'F12' || k === 123) { e.preventDefault(); return false }
    if (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c'].indexOf(String(k)) !== -1) { e.preventDefault(); return false }
    if (e.ctrlKey && ['u','U'].indexOf(String(k)) !== -1) { e.preventDefault(); return false }
    if (e.ctrlKey && ['s','S'].indexOf(String(k)) !== -1) { e.preventDefault(); return false }
  })

  // 3. DevTools size-heuristic detector
  var _threshold = 160
  var _hidden = false
  function _checkDevtools () {
    var widthDiff  = window.outerWidth  - window.innerWidth  > _threshold
    var heightDiff = window.outerHeight - window.innerHeight > _threshold
    if ((widthDiff || heightDiff) && !_hidden) {
      _hidden = true
      document.body.style.filter = 'blur(12px)'
      document.body.style.pointerEvents = 'none'
      document.body.style.userSelect = 'none'
    } else if (!widthDiff && !heightDiff && _hidden) {
      _hidden = false
      document.body.style.filter = ''
      document.body.style.pointerEvents = ''
      document.body.style.userSelect = ''
    }
  }
  setInterval(_checkDevtools, 700)
  window.addEventListener('resize', _checkDevtools)

  // 4. XOR-decode Mailchimp URL into window.__mu
  var _k = 0x5A
  var _e = [50,47,40,45,45,101,79,78,5,14,5,12,10,116,46,47,108,106,113,12,8,17,23,73,8,7,52,58,59,56,112,60,15,12,77,16,17,7,21,57,41,53,63,59,112,16,14,17,23,73,15,21,53,53,99,40,99,103,5,0,81,87,80,81,4,98,110,57,111,59,59,2,7,1,0,81,82,7,57,108,107,104,120,54,4,92,83,90,82,0,86,108,109,106,57,60,121,6,62,11,7,89,85,86,62,63,101,106,59,110,6,81,68,0,89,90]
  window.__mu = _e.map(function (n, i) { return String.fromCharCode(n ^ (_k + i % 13)) }).join('')
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
