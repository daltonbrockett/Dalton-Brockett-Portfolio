import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PlanetData } from '../data/portfolio'
import { calculatePlanetPosition } from '../utils/orbitLogic'

interface CameraRigProps {
    focusedPlanet: PlanetData | null;
}

export function CameraRig({ focusedPlanet }: CameraRigProps) {
    const { camera } = useThree()
    // We use a ref to smooth out transitions if needed, but for now strict follow

    useFrame((state) => {
        if (focusedPlanet) {
            const elapsedTime = state.clock.getElapsedTime()
            const planetPos = calculatePlanetPosition(focusedPlanet, elapsedTime)

            // Calculate vector from Sun (0,0,0) to Planet
            // Camera should be looking outside the planet in towards sun,.
            // so CameraPos = PlanetPos + (PlanetPos - Sun).normalize() * offset
            const directionFromSun = new THREE.Vector3().copy(planetPos).normalize()
            const offsetDistance = 10 // How far behind the planet to float

            // Lift the camera up slightly to see over the planet
            const heightOffset = 3

            const targetPos = new THREE.Vector3()
                .copy(planetPos)
                .add(directionFromSun.multiplyScalar(offsetDistance))

            targetPos.y += heightOffset

            // Smoothly interpolate camera position
            camera.position.lerp(targetPos, 0.05)

            // Look towards the sun
            const lookAtTarget = new THREE.Vector3(0, 0, 0)

            // We need to manually update the camera matrix if we are taking over control
            camera.lookAt(lookAtTarget)
        }
    })

    return null
}
