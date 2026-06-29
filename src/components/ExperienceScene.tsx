import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Atom } from './Atom'
import { PortfolioNode } from './PortfolioNode'
import { APPS_DATA, PortfolioNodeData } from '../data/portfolio'
import { Suspense, useState } from 'react'
import { CameraRig } from './CameraRig'

import { PortfolioDetailsOverlay } from './PortfolioDetailsOverlay'
import { PortfolioWindow } from './PortfolioWindow'
import { trackEvent } from '../utils/analytics'

interface ExperienceSceneProps {
    started: boolean;
}

export function ExperienceScene({ started }: ExperienceSceneProps) {
    const [focusedNode, setFocusedNode] = useState<PortfolioNodeData | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const handleNodeClick = (node: PortfolioNodeData) => {
        setFocusedNode(node) // Set focus
        setIsDetailsOpen(false) // Ensure details are closed when switching nodes initially
        trackEvent('node_click', { role: node.role, org: node.org })
    }

    const handleBackgroundClick = () => {
        setFocusedNode(null) // Reset focus on background click
        setIsDetailsOpen(false)
    }

    return (
        <div className="w-full h-screen bg-black relative">
            <Canvas
                camera={{ position: [0, 20, 35], fov: 45 }}
                onPointerMissed={() => handleBackgroundClick()}
            >
                <color attach="background" args={['#000000']} />

                {/* Lights */}
                <ambientLight intensity={2.0} />
                <pointLight position={[0, 0, 0]} intensity={4} color="#ffffff" distance={100} decay={2} />

                {/* Environment */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Controls - Disable manual orbit when focused */}
                <OrbitControls enablePan={false} maxDistance={60} minDistance={10} enabled={!focusedNode} />

                {/* Camera Rig - Takes over when focused */}
                <CameraRig focusedPlanet={focusedNode} />

                <Suspense fallback={null}>
                    <Atom />
                    {APPS_DATA.map((node) => (
                        <PortfolioNode
                            key={node.id}
                            node={node}
                            onClick={handleNodeClick}
                            showLabels={started && !focusedNode}
                        />
                    ))}
                </Suspense>
            </Canvas>

            {/* UI Overlay */}
            <PortfolioWindow
                node={focusedNode}
                onViewMore={() => {
                    setIsDetailsOpen(true)
                    if (focusedNode) {
                        trackEvent('detail_view', { role: focusedNode.role, org: focusedNode.org })
                    }
                }}
                onClose={() => setFocusedNode(null)}
            />

            {/* Full Screen Details Overlay */}
            {focusedNode && isDetailsOpen && (
                <PortfolioDetailsOverlay
                    node={focusedNode}
                    onClose={() => setIsDetailsOpen(false)}
                />
            )}
        </div>
    )
}
