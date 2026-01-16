import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PlanetData } from '../data/portfolio'

import { calculatePlanetPosition } from '../utils/orbitLogic'

interface PlanetProps {
    planet: PlanetData;
    onClick: (planet: PlanetData) => void;
}

export function Planet({ planet, onClick }: PlanetProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHover] = useState(false)
    // initialAngle is handled inside calculatePlanetPosition now

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime() // Use global clock for sync
        const pos = calculatePlanetPosition(planet, elapsedTime)

        if (meshRef.current) {
            meshRef.current.position.copy(pos)
            meshRef.current.rotation.y += 0.01 // self rotation remains local
        }
    })

    return (
        <group>
            {/* Orbital Path (Visual Ring) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[planet.distance - 0.05, planet.distance + 0.05, 64]} />
                <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
            </mesh>

            {/* The Planet */}
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation() // Prevent click from bubbling
                    onClick(planet)
                }}
                onPointerOver={() => {
                    setHover(true)
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => {
                    setHover(false)
                    document.body.style.cursor = 'auto'
                }}
            >
                <sphereGeometry args={[planet.size, 32, 32]} />
                <meshStandardMaterial color={hovered ? 'white' : planet.color} />

                {/* Label */}
                <Html position={[0, planet.size + 0.5, 0]} center distanceFactor={10}>
                    <div className="pointer-events-none whitespace-nowrap text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">
                        {planet.name}
                    </div>
                </Html>
            </mesh>
        </group>
    )
}
