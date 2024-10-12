import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { TrackballControls } from "@react-three/drei";

import { EarthMaterial } from "../models/earthMaterial";
import { CloudMaterial } from "../models/cloudMaterial";

export function Earth(params) {
    /** refs */
    let cloudsRef = useRef();
    let earthRef = useRef();

    const child = params.child;
    const isEnter = params.isEnter;
    /** Animation */
    useFrame(() => {
        if (!isEnter) {
            console.log(isEnter);
            cloudsRef.current.rotation.y += 0.005;
        }
    });

    return (
        <mesh ref={cloudsRef} position={[2, 0, 0]}>
            <TrackballControls />
            <CloudMaterial />
            <mesh ref={earthRef} position={[0, 0, 0]}>
                <EarthMaterial />
                {child}
            </mesh>
        </mesh>
    )
}