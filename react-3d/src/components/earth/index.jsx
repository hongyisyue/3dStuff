import { useLoader } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";
import EarthDayMap from "../../assets/textures/8k_earth_daymap.jpg"
import EarthNormalMap from "../../assets/textures/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../../assets/textures/8k_earth_specular_map.jpg";
import EarthCloudsMap from "../../assets/textures/8k_earth_clouds.jpg";

export function Earth(params) {
    const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
        THREE.TextureLoader,
        [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
    );
    return (
        <>
            <pointLight color="#f6f3ea" position={[2, 0, 5]} intensity={1.2} />
            <mesh position={[0, 0, 3]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshPhongMaterial
                    map={cloudsMap}
                    opacity={0.4}
                    depthWrite={true}
                    transparent={true}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh position={[0, 0, 3]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshPhongMaterial specularMap={specularMap} />
                <meshStandardMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    metalness={0.4}
                    roughness={0.7}
                />
            </mesh>
        </>

    );
}