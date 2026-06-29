import { useEffect, useState } from 'react'
import { ExperienceScene } from './components/ExperienceScene'
import { Loader } from '@react-three/drei'
import { LandingPage } from './components/LandingPage'
import { AnimatePresence, motion } from 'framer-motion'
import { initSession, trackEnterSite } from './utils/analytics'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'

function App() {
  const [started, setStarted] = useState(false)
  const isDashboard = window.location.pathname === '/dashboard' || window.location.pathname === '/analytics'

  useEffect(() => {
    if (!isDashboard) {
      initSession()
    }
  }, [isDashboard])

  if (isDashboard) {
    return <AnalyticsDashboard />
  }

  const handleStart = () => {
    trackEnterSite()
    setStarted(true)
  }

  return (
    <>
      <ExperienceScene started={started} />
      <Loader />
      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50"
          >
            <LandingPage onStarted={handleStart} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
