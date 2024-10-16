import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { TrackballControls } from "@react-three/drei";

import { EarthMaterial } from "../components/earthMaterial";
import { CloudMaterial } from "../components/cloudMaterial";

export function Earth(params) {
    /** refs */
    let cloudsRef = useRef();
    let earthRef = useRef();

    const content = params.content;
    const isEnter = params.isEnter;
    /** Animation */
    useFrame(() => {
        if (!isEnter) {
            cloudsRef.current.rotation.y += 0.005;
        }
    });

    return (
        <mesh ref={cloudsRef} position={[2, 0, 0]}>
            <TrackballControls />
            <CloudMaterial />
            <mesh ref={earthRef} position={[0, 0, 0]}>
                <EarthMaterial />
                {content}
            </mesh>
        </mesh>
    )
}