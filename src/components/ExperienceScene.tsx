import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Sun } from './Sun'
import { Planet } from './Planet'
import { APPS_DATA, PlanetData } from '../data/portfolio'
import { Suspense, useState } from 'react'
import { CameraRig } from './CameraRig'

export function ExperienceScene() {
    const [focusedPlanet, setFocusedPlanet] = useState<PlanetData | null>(null)

    const handlePlanetClick = (planet: PlanetData) => {
        setFocusedPlanet(planet) // Set focus
    }

    const handleBackgroundClick = () => {
        setFocusedPlanet(null) // Reset focus on background click
    }

    return (
        <div className="w-full h-screen bg-black">
            <Canvas
                camera={{ position: [0, 20, 35], fov: 45 }}
                onPointerMissed={() => handleBackgroundClick()}
            >
                <color attach="background" args={['#000000']} />

                {/* Lights */}
                <ambientLight intensity={0.5} />
                <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={100} decay={2} />

                {/* Environment */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Controls - Disable manual orbit when focused */}
                <OrbitControls enablePan={false} maxDistance={60} minDistance={10} enabled={!focusedPlanet} />

                {/* Camera Rig - Takes over when focused */}
                <CameraRig focusedPlanet={focusedPlanet} />

                <Suspense fallback={null}>
                    <Sun />
                    {APPS_DATA.map((planet) => (
                        <Planet key={planet.id} planet={planet} onClick={handlePlanetClick} />
                    ))}
                </Suspense>
            </Canvas>
        </div>
    )
}
