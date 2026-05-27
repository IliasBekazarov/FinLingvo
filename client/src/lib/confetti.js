export function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight

  const colors = ['#FFD900','#58CC02','#1CB0F6','#FF9600','#FF4B4B','#9B59B6']
  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    r: 4 + Math.random() * 7,
    d: 2 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 4,
    opacity: 1,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 8,
  }))

  let frame
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let alive = false
    particles.forEach(p => {
      if (p.opacity <= 0) return
      alive = true
      p.x += p.vx; p.y += p.vy; p.vy += 0.1
      p.rotation += p.rotationSpeed
      if (p.y > canvas.height * 0.7) p.opacity -= 0.025

      ctx.save()
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation * Math.PI / 180)
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6)
      ctx.restore()
    })
    if (alive) frame = requestAnimationFrame(draw)
    else ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  cancelAnimationFrame(frame)
  draw()
}
