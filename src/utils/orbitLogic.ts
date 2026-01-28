import { PortfolioNodeData } from '../data/portfolio';
import * as THREE from 'three';

export function calculatePlanetPosition(node: PortfolioNodeData, elapsedTime: number): THREE.Vector3 {
    const initialAngle = node.id * 100; // MUST match logic in Planet.tsx (or refactor Planet to use this too)
    const t = elapsedTime * node.speed + initialAngle;
    const x = Math.cos(t) * node.distance;
    const z = Math.sin(t) * node.distance;
    return new THREE.Vector3(x, 0, z);
}
