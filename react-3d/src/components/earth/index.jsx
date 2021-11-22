import { useLoader } from "@react-three/fiber";
import React, { useRef, PointerEvent } from "react";
import * as THREE from "three";
import EarthDayMap from "../../assets/textures/8k_earth_daymap.jpg"
import EarthNightMap from "../../assets/textures/8k_earth_nightmap.jpg"
import EarthNormalMap from "../../assets/textures/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../../assets/textures/8k_earth_specular_map.jpg";
import EarthCloudsMap from "../../assets/textures/8k_earth_clouds.jpg";
import { OrbitControls, Stars } from "@react-three/drei";

export function Earth(params) {
    const [dayMap, nightMap, normalMap, specularMap, cloudsMap] = useLoader(
        THREE.TextureLoader,
        [EarthDayMap, EarthNightMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
    );


  const earthRef = useRef();
  const cloudsRef = useRef();
  let isEnter = false;
  let isPressing = false;

  function toggleEnter(v) {
    isEnter = v;
  }
  function togglePress(v) {
    isPressing = v;
  }
  function rotate(e) {
    if (isEnter && isPressing) {
        earthRef.current.rotation.y -= e.width * 0.03;
        cloudsRef.current.rotation.y -= e.width * 0.03;
    }
  }
    return (
        <>
            <pointLight color="#f6f3ea" position={[0, 0, 10]} intensity={10} />
            <Stars
                radius={300}
                depth={60}
                count={20000}
                factor={7}
                saturation={0}
                fade={true}
            />
            <mesh ref={cloudsRef} position={[0, 0, 0]}
                onPointerEnter={(e) => {
                    toggleEnter(true);
                }}
                onPointerDown={(e) => {
                    togglePress(true);
                }}
                onPointerMove={(e) => {
                    rotate(e);
                }}
                onPointerUp={(e) => {
                    togglePress(false);
                }}
                onPointerLeave={(e) => {
                    toggleEnter(false);
                }}
            >
                <sphereGeometry args={[1, 32, 32]} />
                <meshPhongMaterial
                    map={cloudsMap}
                    opacity={0.4}
                    depthWrite={true}
                    transparent={true}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh ref={earthRef} position={[0, 0, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshPhongMaterial specularMap={specularMap} />
                <meshStandardMaterial
                    map={nightMap}
                    normalMap={normalMap}
                    metalness={0.4}
                    roughness={0.7}
                />
                {/* <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} /> */}
            </mesh>
        </>

    );
}