import * as THREE from "three";
import { DefaultSettings } from "../data/default";

export function Pole(params) {
    /**
     * Create a white pole that goes through
     * the center of the sphere and the given xyz point
     * 
     * --params--
     * dot: {
     *  x: number,
     *  y: number,
     *  z: number
     * }
     */

    const dot = params.dot;
    
    const center = DefaultSettings.earth_center;

    if (dot) {
        // returns a point of the end of the pole
        // p1 should always be the center point of the earth
        function getLineEndPonit(p1, p2) {
            const v3 = new THREE.Vector3(p2.x + (p2.x - p1.x) / 4, p2.y + (p2.y - p1.y) / 4, p2.z + (p2.z - p1.z) / 4);

            return v3;
        }

        const poleEnd = getLineEndPonit(center, dot);
        const pole = new THREE.LineCurve3(center, poleEnd);

        return (
            <mesh>
                <tubeGeometry args={[pole, 30, 0.013, 8, false]} />
                <meshBasicMaterial color="#BFF8FF"></meshBasicMaterial>
            </mesh>
        )
    }

}