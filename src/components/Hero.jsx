import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'
import Navbar from './Navbar'

const Hero = () => {
  const heroRef = useRef(null)
  const revealRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    const reveal = revealRef.current

    let mouseX = 0
    let mouseY = 0
    let x = 0
    let y = 0
    let visible = false

    const animate = () => {
      x += (mouseX - x) * 0.05
      y += (mouseY - y) * 0.05

      reveal.style.setProperty('--x', `${x}px`)
      reveal.style.setProperty('--y', `${y}px`)

      requestAnimationFrame(animate)
    }

    animate()

    const move = (e) => {
      const rect = hero.getBoundingClientRect()
      // Support both touch events and mouse events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      
      mouseX = clientX - rect.left
      mouseY = clientY - rect.top

      if (!visible) {
        visible = true
        reveal.classList.add('active')
      }
    }

    const leave = () => {
      visible = false
      reveal.classList.remove('active')
    }

    hero.addEventListener('mousemove', move)
    hero.addEventListener('mouseleave', leave)
    hero.addEventListener('touchstart', move, { passive: true })
    hero.addEventListener('touchmove', move, { passive: true })
    hero.addEventListener('touchend', leave)

    // Audio Playback handling (using static muted autoplay + interaction unmute)
    const audio = audioRef.current
    if (audio) {
      console.log("[Audio Debug] Audio element found. Setting up interaction-based unmute listener...");
      
      const unmute = () => {
        console.log("[Audio Debug] User interaction detected. Unmuting and ensuring playback...");
        audio.muted = false
        audio.play()
          .then(() => console.log("[Audio Debug] Playback active and unmuted."))
          .catch((err) => console.error("[Audio Debug] Playback failed to unmute:", err))
        cleanupListeners()
      }
      
      const cleanupListeners = () => {
        window.removeEventListener('click', unmute)
        window.removeEventListener('touchstart', unmute)
        window.removeEventListener('keydown', unmute)
      }

      window.addEventListener('click', unmute)
      window.addEventListener('touchstart', unmute)
      window.addEventListener('keydown', unmute)
    }

    return () => {
      hero.removeEventListener('mousemove', move)
      hero.removeEventListener('mouseleave', leave)
      hero.removeEventListener('touchstart', move)
      hero.removeEventListener('touchmove', move)
      hero.removeEventListener('touchend', leave)
    }
  }, [])

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 12 } },
  }

  const navbarVariant = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 14 } },
  }

  return (
    <div className="hero" ref={heroRef}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/music/krishna_kalki_bgm.webm"
        loop
        autoPlay
        muted
        style={{ display: 'none' }}
      />

      <motion.div variants={navbarVariant} initial="hidden" animate="visible">
        <Navbar />
      </motion.div>

      <motion.div className="hero-content" variants={container} initial="hidden" animate="visible">
        <motion.div className="left" variants={item}>
          <h1 className="st-title">
            Deva Snana<br />Purnima
          </h1>
          <motion.p className="st-desc" variants={item}>
            Highly auspicious festival celebrating the ceremonial bath and symbolic birthday of Lord Jagannath, Lord Balabhadra, and Devi Subhadra.
          </motion.p>
  
        </motion.div>

        <motion.div className="right" variants={item}>
          <h1 className="st-title">The Divine Bath (Snana Yatra):</h1>
          <motion.p className="st-text" variants={item}>
            Early in the morning, the Holy Trinity is taken in a ceremonial procession (Pahundi) to the Snana Bedi (bathing altar). They are bathed with 108 pitchers of holy water drawn from the temple's Suna Kua (Golden Well). The water is infused with medicinal herbs, sandalwood, and perfumes
          </motion.p>
        </motion.div>
      </motion.div>

      <div className="fire-reveal" ref={revealRef}></div>
    </div>
  )
}

export default Hero
