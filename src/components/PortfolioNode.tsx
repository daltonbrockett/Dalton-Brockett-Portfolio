import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PortfolioNodeData } from '../data/portfolio'
import { calculatePlanetPosition } from '../utils/orbitLogic'

// Visual Components
import { PlanetSphere } from './models/PlanetSphere'
import { ImportedModel } from './models/ImportedModel'
import { FinnishFlag } from './models/FinnishFlag'

interface PortfolioNodeProps {
    node: PortfolioNodeData;
    onClick: (node: PortfolioNodeData) => void;
    showLabels?: boolean;
}

export function PortfolioNode({ node, onClick, showLabels = true }: PortfolioNodeProps) {
    const groupRef = useRef<THREE.Group>(null)
    const [hovered, setHover] = useState(false)

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime() // Use global clock for sync

        // Calculate Orbit Position
        // Duplicate logic from orbitLogic to get 't' for rotation
        // TODO: Refactor this out into a shared function
        const initialAngle = node.id * 100;
        const t = elapsedTime * node.speed + initialAngle;
        const pos = calculatePlanetPosition(node as any, elapsedTime)

        if (groupRef.current) {
            groupRef.current.position.copy(pos)

            // Rotation Logic based on Visual Type
            if (node.visualType === 'model') {
                // Tangential Rotation for Models (Planes, etc.)
                // Point along the orbit path.
                // -t is often correct for standard CCW orbits to keep 'forward' alignment.
                // Additional offsets (Yaw, Pitch, Roll) are handled by the child ImportedModel.
                groupRef.current.rotation.y = -t;

                // Reset other axes on parent, let child handle them
                groupRef.current.rotation.x = 0;
                groupRef.current.rotation.z = 0;
            } else {
                // Standard Spin for Spheres / Objects
                groupRef.current.rotation.y += 0.01
            }
        }
    })

    const handleClick = (e: any) => {
        e.stopPropagation()
        onClick(node)
    }

    const handlePointerOver = () => {
        setHover(true)
        document.body.style.cursor = 'pointer'
    }

    const handlePointerOut = () => {
        setHover(false)
        document.body.style.cursor = 'auto'
    }

    return (
        <group>
            {/* Orbital Path (Visual Ring) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[node.distance - 0.05, node.distance + 0.05, 64]} />
                <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
            </mesh>

            {/* The Moving Node Group */}
            <group
                ref={groupRef}
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                {/* Visual Component Switch */}
                {node.visualType === 'sphere' && (
                    <PlanetSphere
                        size={node.size}
                        color={node.color}
                        texture={node.texture}
                        hovered={hovered}
                    />
                )}

                {node.visualType === 'model' && node.modelPath && (
                    <ImportedModel
                        path={node.modelPath}
                        scale={node.modelScale}
                        rotationOffset={node.rotationOffset}
                        pitchOffset={node.pitchOffset}
                        rollOffset={node.rollOffset}
                        spinSpeed={node.spinSpeed}
                    />
                )}

                {node.visualType === 'flag' && (
                    <FinnishFlag size={node.size} />
                )}

                {/* Label */}
                {showLabels && (
                    <Html position={[0, node.size + 0.5, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
                        <div className="pointer-events-none whitespace-nowrap text-white text-sm font-bold bg-black/50 px-2 py-1 rounded">
                            {node.role}
                        </div>
                    </Html>
                )}
            </group>
        </group>
    )
}
