import { useGLTF } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface ImportedModelProps {
    path: string;
    scale?: number;
    rotationOffset?: number; // Y (Yaw)
    pitchOffset?: number;    // X (Pitch)
    rollOffset?: number;     // Z (Roll)
    spinSpeed?: number;      // Speed of auto-rotation
}

export function ImportedModel({
    path,
    scale = 1,
    rotationOffset = 0,
    pitchOffset = 0,
    rollOffset = 0,
    spinSpeed = 0
}: ImportedModelProps) {
    const { scene } = useGLTF(path)
    const clonedScene = useMemo(() => scene.clone(), [scene])
    const groupRef = useRef<Group>(null)

    useFrame((_, delta) => {
        if (spinSpeed !== 0 && groupRef.current) {
            groupRef.current.rotation.y += spinSpeed * delta
        }
    })

    return (
        <group
            ref={groupRef}
            scale={scale}
            rotation={[pitchOffset, rotationOffset, rollOffset]}
            rotation-order="YXZ"
        >
            <primitive object={clonedScene} />
        </group>
    )
}
