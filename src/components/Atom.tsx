import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Line } from '@react-three/drei'
import * as THREE from 'three'

function Electron({ radius, speed, color, rotation, planeSpeed = 0 }: { radius: number, speed: number, color: string, rotation: [number, number, number], planeSpeed?: number }) {
    const ref = useRef<THREE.Mesh>(null)
    const angleRef = useRef(Math.random() * Math.PI * 2)
    const planeRef = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        // Move Electron
        angleRef.current += delta * speed
        if (ref.current) {
            ref.current.position.x = Math.cos(angleRef.current) * radius
            ref.current.position.y = Math.sin(angleRef.current) * radius
            ref.current.position.z = 0
        }

        // Rotate the Orbital Plane
        if (planeRef.current) {
            let rotationSpeedScale = 2
            planeRef.current.rotation.y += delta * planeSpeed * rotationSpeedScale
            planeRef.current.rotation.x += delta * (planeSpeed * 0.2) * rotationSpeedScale
        }
    })

    const points = useMemo(() => {
        const pts = []
        for (let i = 0; i <= 64; i++) {
            const a = (i / 64) * Math.PI * 2
            pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0))
        }
        return pts
    }, [radius])

    return (
        <group ref={planeRef}>
            <group rotation={rotation}>
                {/* Orbit Path */}
                <Line points={points} color={color} opacity={0.3} transparent lineWidth={1} />

                {/* Electron Particle */}
                <mesh ref={ref}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
                </mesh>
            </group>
        </group>
    )
}

export function Atom() {
    return (
        <group>
            {/* Nucleus - User Name */}
            <group>
                <pointLight intensity={3} distance={100} decay={2} color="#ffffff" />
                {/* Front Text */}
                <Text
                    fontSize={0.8}
                    color="#60a5fa"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#1e3a8a"
                    characters="DaltonBrockett"
                >
                    Dalton Brockett
                    <meshBasicMaterial attach="material" color="#60a5fa" toneMapped={false} />
                </Text>
                {/* Back Text (Rotated 180) */}
                <Text
                    fontSize={0.8}
                    color="#60a5fa"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#1e3a8a"
                    characters="DaltonBrockett"
                    rotation={[0, Math.PI, 0]}
                >
                    Dalton Brockett
                    <meshBasicMaterial attach="material" color="#60a5fa" toneMapped={false} />
                </Text>
            </group>

            {/* Electrons with Plane Rotation */}
            <Electron radius={3} speed={1.5} color="#38bdf8" rotation={[Math.PI / 3, 0, 0]} planeSpeed={0.2} />
            <Electron radius={3} speed={1.2} color="#38bdf8" rotation={[-Math.PI / 3, 0, 0]} planeSpeed={-0.15} />
            <Electron radius={3} speed={1.8} color="#38bdf8" rotation={[0, Math.PI / 2, Math.PI / 4]} planeSpeed={0.1} />
            <Electron radius={3} speed={1.4} color="#38bdf8" rotation={[0, 0, 0]} planeSpeed={-0.25} />
        </group>
    )
}
