import React from "react";
import { Stars } from "@react-three/drei";

export function Space(params) {
    const content = params.content;

    return (
        <>
            {/* <TrackballControls mode="rotate" object={cloudsRef}> */}
            <pointLight color="#fff6e6" position={[-20, 20, 15]} intensity={2} />
            <pointLight color="#fff6e6" position={[20, 0, -15]} intensity={2} />
            <pointLight color="#fff6e6" position={[-20, -20, -15]} intensity={1} />
            <pointLight color="#fff6e6" position={[20, 0, 15]} intensity={1} />
            <Stars
                radius={300}
                depth={60}
                count={20000}
                factor={7}
                saturation={0}
                fade={true}
            />
            {content}
        </>

    );
}