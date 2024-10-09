import * as THREE from "three";
import { DefaultSettings } from "../data/default"
// import { extend } from "@react-three/fiber";
// import { shaderMaterial } from "@react-three/drei";
// import glsl from 'babel-plugin-glsl/macro'

export function MovingPath(params) {
    /**
     * Given 2 xyz points, "from" and "to", 
     * create a flight path from "from" to "to"
     * 
     * 
     * --params--
     * from: {
     *  x: number,
     *  y: number,
     *  z: number,
     * }
     * 
     * to: {
     *  x: number,
     *  y: number,
     *  z: number,
     * }
     * 
     * time: number
     * earth_r: number
     */

    const from = params.from;
    const to = params.to;
    const earth_r = params.earth_r || DefaultSettings.earth_r;
    let time = params.frameTime;

    // 加不加没什么区别，先comment
    // let MovingDashMaterial = shaderMaterial(
    //     { time },
    //     // vertex shader
    //     glsl`
    //         varying vec2 vUv;
    //         void main() {
    //             vUv = uv;
    //             vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    //             gl_Position = projectionMatrix * modelViewPosition;
    //         }
    //         `,
    //     // fragment shader
    //     glsl`
    //         varying vec2 vUv;
    //         uniform float time;
            
    //         void main() {
    //             float dash = sin(vUv.x * 50. - time);
          
    //         if(dash<0.) discard;
        
    //         gl_FragColor = vec4( vUv.y,0.7,1.0,1.0 );
    //       }
    //     `
    // )
    // extend({ MovingDashMaterial });

    if (from && to) {
        // returns an arry of points of the curve
        function getCurve(p1, p2) {
            const v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
            const v2 = new THREE.Vector3(p2.x, p2.y, p2.z);

            const points = [];
            for (let i = 0; i < 21; i++) {
                const p = new THREE.Vector3().lerpVectors(v1, v2, i / 20);
                p.normalize();
                p.multiplyScalar(earth_r + 0.1 * Math.sin(Math.PI * i / 20));
                points.push(p);
            }

            return points;
        }

        const path = new THREE.CatmullRomCurve3(getCurve(from, to));
        return (
            <mesh>
                <tubeGeometry args={[path, 30, 0.013, 8, false]} />
                <movingDashMaterial
                    attach="material"
                    time={time}
                >
                </movingDashMaterial>
            </mesh>
        )
    } else {
        return null;
    }
}