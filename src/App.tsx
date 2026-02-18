import { useState } from 'react'
import { ExperienceScene } from './components/ExperienceScene'
import { Loader } from '@react-three/drei'
import { LandingPage } from './components/LandingPage'
import { AnimatePresence, motion } from 'framer-motion'

function App() {
  const [started, setStarted] = useState(false)

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
            <LandingPage onStarted={() => setStarted(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
