import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { PlanetData } from '../data/portfolio'

import { calculatePlanetPosition } from '../utils/orbitLogic'

interface PlanetProps {
    planet: PlanetData;
    onClick: (planet: PlanetData) => void;
    showLabels?: boolean;
}

function TexturedMaterial({ url, hovered }: { url: string, hovered: boolean }) {
    const texture = useTexture(url)
    return <meshStandardMaterial map={texture} color={hovered ? '#dddddd' : 'white'} />
}

function ColoredMaterial({ color, hovered }: { color: string, hovered: boolean }) {
    return <meshStandardMaterial color={hovered ? 'white' : color} />
}

function LoadedModel({ path, scale = 1, planetSize }: { path: string, scale?: number, planetSize: number }) {
    const { scene } = useGLTF(path)
    return <primitive object={scene} scale={scale} position={[0, planetSize, 0]} />
}

// Finnish Flag Model
function FlagModel({ size }: { size: number }) {
    const poleHeight = 1.0;
    const flagWidth = 0.6;
    const flagHeight = 0.36;
    const blue = "#003580";

    return (
        <group position={[0, size, 0]}>
            {/* Pole */}
            <mesh position={[0, poleHeight / 2, 0]}>
                <cylinderGeometry args={[0.02, 0.02, poleHeight]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Flag Group */}
            <group position={[0.02 + flagWidth / 2, poleHeight - 0.2, 0]}>
                {/* White Background */}
                <mesh>
                    <boxGeometry args={[flagWidth, flagHeight, 0.01]} />
                    <meshStandardMaterial color="white" />
                </mesh>

                {/* Blue Cross - Vertical */}
                <mesh position={[-flagWidth * 0.15, 0, 0.006]}>
                    <boxGeometry args={[flagWidth * 0.18, flagHeight, 0.01]} />
                    <meshStandardMaterial color={blue} />
                </mesh>
                <mesh position={[-flagWidth * 0.15, 0, -0.006]}>
                    <boxGeometry args={[flagWidth * 0.18, flagHeight, 0.01]} />
                    <meshStandardMaterial color={blue} />
                </mesh>

                {/* Blue Cross - Horizontal */}
                <mesh position={[0, 0, 0.007]}>
                    <boxGeometry args={[flagWidth, flagHeight * 0.18, 0.01]} />
                    <meshStandardMaterial color={blue} />
                </mesh>
                <mesh position={[0, 0, -0.007]}>
                    <boxGeometry args={[flagWidth, flagHeight * 0.18, 0.01]} />
                    <meshStandardMaterial color={blue} />
                </mesh>
            </group>
        </group>
    )
}

export function Planet({ planet, onClick, showLabels = true }: PlanetProps) {
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
                {planet.texture ? (
                    <TexturedMaterial url={planet.texture} hovered={hovered} />
                ) : (
                    <ColoredMaterial color={planet.color} hovered={hovered} />
                )}

                {/* 3D Decor (Imported Models) */}
                {planet.modelPath ? (
                    <LoadedModel path={planet.modelPath} scale={planet.modelScale} planetSize={planet.size} />
                ) : planet.model === 'flag_fi' ? (
                    <FlagModel size={planet.size} />
                ) : planet.model === 'building' ? (
                    <BuildingModel size={planet.size} />
                ) : null}

                {/* Label */}
                {showLabels && (
                    <Html position={[0, planet.size + 0.5, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
                        <div className="pointer-events-none whitespace-nowrap text-white text-sm font-bold bg-black/50 px-2 py-1 rounded">
                            {planet.role}
                        </div>
                    </Html>
                )}
            </mesh>
        </group>
    )
}
