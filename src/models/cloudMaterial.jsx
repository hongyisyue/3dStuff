import React from "react";
import * as THREE from "three";
import { DefaultSettings } from "../data/default";
import { useLoader } from "@react-three/fiber";
import EarthCloudsMap from "../assets/textures/8k_earth_clouds.jpg";

export function CloudMaterial(params) {
    const r = params.earth_r || DefaultSettings.earth_r;
    const horSegment = 64;
    const verSegment = 64;

    /** Textures */
    const [cloudsMap] = useLoader(
        THREE.TextureLoader,
        [EarthCloudsMap]
    );

    return (
        <>
            <sphereGeometry args={[r + 0.05, horSegment, verSegment]} />
            <meshPhongMaterial
                map={cloudsMap}
                opacity={0.45}
                depthWrite={true}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </>
    )
}