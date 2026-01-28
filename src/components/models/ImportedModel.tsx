import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'

interface ImportedModelProps {
    path: string;
    scale?: number;
    rotationOffset?: number; // Y (Yaw)
    pitchOffset?: number;    // X (Pitch)
    rollOffset?: number;     // Z (Roll)
}

export function ImportedModel({
    path,
    scale = 1,
    rotationOffset = 0,
    pitchOffset = 0,
    rollOffset = 0
}: ImportedModelProps) {
    const { scene } = useGLTF(path)
    const clonedScene = useMemo(() => scene.clone(), [scene])

    return (
        <group
            scale={scale}
            rotation={[pitchOffset, rotationOffset, rollOffset]}
            rotation-order="YXZ"
        >
            <primitive object={clonedScene} />
        </group>
    )
}
