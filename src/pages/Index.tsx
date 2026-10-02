import { useEffect, useRef } from 'react'
import { ArrowRight, Globe, Instagram, Twitter } from 'lucide-react'
import AboutSection from '../components/AboutSection'
import FeaturedVideoSection from '../components/FeaturedVideoSection'
import PhilosophySection from '../components/PhilosophySection'
import ServicesSection from '../components/ServicesSection'

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4'

const FADE_DURATION = 500
const FADE_TRIGGER_THRESHOLD = 0.55

function Index() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const isFadingOutRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const cancelFade = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const animateOpacity = (from: number, to: number, duration: number, onDone?: () => void) => {
      cancelFade()
      const start = performance.now()

      const step = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const value = from + (to - from) * progress
        video.style.opacity = String(value)

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          rafRef.current = null
          onDone?.()
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }

    const handleCanPlay = () => {
      video.play().catch(() => {})
      animateOpacity(0, 1, FADE_DURATION)
    }

    const handleTimeUpdate = () => {
      if (!video.duration || isFadingOutRef.current) return
      const remaining = video.duration - video.currentTime
      if (remaining <= FADE_TRIGGER_THRESHOLD) {
        isFadingOutRef.current = true
        const currentOpacity = parseFloat(video.style.opacity || '1')
        animateOpacity(currentOpacity, 0, FADE_DURATION)
      }
    }

    const handleEnded = () => {
      video.style.opacity = '0'
      window.setTimeout(() => {
        video.currentTime = 0
        video.play().catch(() => {})
        isFadingOutRef.current = false
        animateOpacity(0, 1, FADE_DURATION)
      }, 100)
    }

    video.style.opacity = '0'
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      cancelFade()
    }
  }, [])

  return (
    <div className="bg-black">
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-bottom"
          style={{ opacity: 0 }}
          muted
          autoPlay
          playsInline
          preload="auto"
          src={HERO_VIDEO_URL}
        />

        <nav className="relative z-20 px-6 py-6">
          <div className="liquid-glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
            <div className="flex items-center">
              <Globe className="text-white" size={24} />
              <span className="ml-2 text-lg font-semibold text-white">Asme</span>
              <div className="ml-8 hidden items-center gap-8 md:flex">
                <a href="#features" className="text-sm font-medium text-white/80 hover:text-white">
                  Features
                </a>
                <a href="#pricing" className="text-sm font-medium text-white/80 hover:text-white">
                  Pricing
                </a>
                <a href="#about" className="text-sm font-medium text-white/80 hover:text-white">
                  About
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-white">Sign Up</button>
              <button className="liquid-glass rounded-full px-6 py-2 text-sm font-medium text-white">
                Login
              </button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 flex flex-1 -translate-y-[20%] flex-col items-center justify-center px-6 py-12 text-center">
          <h1
            className="whitespace-nowrap text-7xl tracking-tight text-white md:text-8xl lg:text-9xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Know it then <em className="italic">all</em>.
          </h1>

          <form className="mt-10 w-full max-w-xl">
            <div className="liquid-glass flex items-center gap-3 rounded-full py-2 pl-6 pr-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="rounded-full bg-white p-3 text-black"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          <p className="mt-6 max-w-xl px-4 text-sm leading-relaxed text-white">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and
            never miss out on exciting updates.
          </p>

          <button className="liquid-glass mt-8 rounded-full px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5">
            Manifesto
          </button>
        </div>

        <div className="relative z-10 flex justify-center gap-4 pb-12">
          <button
            aria-label="Instagram"
            className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
          >
            <Instagram size={20} />
          </button>
          <button
            aria-label="Twitter"
            className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
          >
            <Twitter size={20} />
          </button>
          <button
            aria-label="Website"
            className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
          >
            <Globe size={20} />
          </button>
        </div>
      </div>

      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />
    </div>
  )
}

export default Index
