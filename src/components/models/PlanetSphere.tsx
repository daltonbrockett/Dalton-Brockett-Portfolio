import { useTexture } from '@react-three/drei'

function TexturedMaterial({ url, hovered }: { url: string, hovered: boolean }) {
    const texture = useTexture(url)
    return <meshStandardMaterial map={texture} color={hovered ? '#dddddd' : 'white'} />
}

interface PlanetSphereProps {
    size: number;
    color: string;
    texture?: string;
    hovered: boolean;
}

export function PlanetSphere({ size, color, texture, hovered }: PlanetSphereProps) {
    return (
        <mesh>
            <sphereGeometry args={[size, 32, 32]} />
            {texture ? (
                <TexturedMaterial url={texture} hovered={hovered} />
            ) : (
                <meshStandardMaterial color={hovered ? 'white' : color} />
            )}
        </mesh>
    )
}
