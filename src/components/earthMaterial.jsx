import React from "react";
import { TextureLoader } from "three";
import { DefaultSettings } from "../data/default";
import { useLoader } from "@react-three/fiber";
import EarthDayMap from "../assets/textures/8k_earth_daymap.jpg"
import EarthNormalMap from "../assets/textures/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../assets/textures/8k_earth_specular_map.jpg";

export function EarthMaterial(params) {
    const r = params.earth_r || DefaultSettings.earth_r;
    const horSegment = 64;
    const verSegment = 64;

    /** Textures */
    const [dayMap, normalMap, specularMap] = useLoader(
        TextureLoader,
        [EarthDayMap, EarthNormalMap, EarthSpecularMap]
    );

    return (
        <>
            <sphereGeometry args={[r, horSegment, verSegment]} />
            <meshPhongMaterial specularMap={specularMap} />
            <meshStandardMaterial
                map={dayMap}
                normalMap={normalMap}
                metalness={0.6}
                roughness={0.5}
            />
        </>
    )
}