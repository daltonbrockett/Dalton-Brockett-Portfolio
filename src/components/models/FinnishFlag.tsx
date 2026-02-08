

interface FinnishFlagProps {
    size: number;
}

export function FinnishFlag({ size }: FinnishFlagProps) {
    const poleHeight = 0.7;
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
