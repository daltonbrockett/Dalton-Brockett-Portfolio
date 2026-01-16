import { PlanetData } from '../data/portfolio';
import * as THREE from 'three';

export function calculatePlanetPosition(planet: PlanetData, elapsedTime: number): THREE.Vector3 {
    const initialAngle = planet.id * 100; // MUST match logic in Planet.tsx (or refactor Planet to use this too)
    const t = elapsedTime * planet.speed + initialAngle;
    const x = Math.cos(t) * planet.distance;
    const z = Math.sin(t) * planet.distance;
    return new THREE.Vector3(x, 0, z);
}
