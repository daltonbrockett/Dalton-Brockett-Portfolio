import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export function Sun() {
    const sunRef = useRef<THREE.Mesh>(null)

    useFrame((_state, delta) => {
        // Slowly rotate the sun
        if (sunRef.current) {
            sunRef.current.rotation.y += delta * 0.1
        }
    })

    return (
        <group>
            {/* The Sun Mesh */}
            <mesh ref={sunRef}>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshStandardMaterial
                    color="#ffdd00"
                    emissive="#ffaa00"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* Point Light at the center to illuminate planets */}
            <pointLight intensity={5} distance={100} decay={2} color="#ffaa00" />

            {/* Name Text - Orbiting or static near sun */}
            <group position={[0, 0, 3.5]}>
                <Text
                    fontSize={1}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    Dalton Brockett
                    <meshBasicMaterial attach="material" color="white" toneMapped={false} />
                </Text>
            </group>
        </group>
    )
}
