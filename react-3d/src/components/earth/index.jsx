import { useLoader, useFrame } from "@react-three/fiber";
import React, { useRef, PointerEvent } from "react";
import * as THREE from "three";
import EarthDayMap from "../../assets/textures/8k_earth_daymap.jpg"
import EarthNightMap from "../../assets/textures/8k_earth_nightmap.jpg"
import EarthNormalMap from "../../assets/textures/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../../assets/textures/8k_earth_specular_map.jpg";
import EarthCloudsMap from "../../assets/textures/8k_earth_clouds.jpg";
import { OrbitControls, Stars, Sphere } from "@react-three/drei";

export function Earth(params) {
    const [dayMap, nightMap, normalMap, specularMap, cloudsMap] = useLoader(
        THREE.TextureLoader,
        [EarthDayMap, EarthNightMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
    );


    const earthRef = useRef();
    const cloudsRef = useRef();
    let isEnter = false;
    let isPressing = false;

    let lastX;
    let lastY;

    const xiamen = {
        lat: 24.4797 * Math.PI / 180,
        lng: 118.0818 * Math.PI / 180 + 125 * Math.PI / 180,
    }

    const xiamen_xyz = {
        x: Math.cos(xiamen.lng) * Math.cos(xiamen.lat),
        y: Math.sin(xiamen.lng) * Math.cos(xiamen.lat),
        z: Math.sin(xiamen.lat)
    }

    // useFrame(({ clock }) => {
    //     const elapsedTime = clock.getElapsedTime();

    //     earthRef.current.rotation.y = elapsedTime / 6;
    //     cloudsRef.current.rotation.y = elapsedTime / 6;
    // });

    //   function toggleEnter(e) {
    //     if (isEnter) {
    //         isEnter = !isEnter;
    //         lastX = undefined;
    //         lastY = undefined;
    //     } else {
    //         isEnter = true
    //         lastX = e.width;
    //         lastY = e.height;
    //     }
    //   }

      function togglePress(e) {
        if (isPressing) {
            console.log('up');
            isPressing = !isPressing;
            lastX = undefined;
            lastY = undefined;
        } else {
            console.log('down -> lastX');
            isPressing = true
            lastX = e.width;
            lastY = e.height;
            console.log(lastX);
        }
      }
      function rotate(e) {
        if (isPressing) {
            console.log('drag: ' + e.width);
            if (e.width < lastX) {
                earthRef.current.rotation.y -= e.width * 0.03;
                cloudsRef.current.rotation.y -= e.width * 0.03;
            } else {
                earthRef.current.rotation.y += e.width * 0.03;
                cloudsRef.current.rotation.y += e.width * 0.03;
            }
        }
      }
    return (
        <>
            <pointLight color="#f6f3ea" position={[-25, 50, 50]} intensity={6} />
            <Stars
                radius={300}
                depth={60}
                count={20000}
                factor={7}
                saturation={0}
                fade={true}
            />
            <mesh ref={cloudsRef} position={[0, 0, 0]}
            onPointerDown={(e) => {
                togglePress(e);
            }}
            onPointerMove={(e) => {
                rotate(e);
            }}
            onPointerUp={(e) => {
                togglePress(e);
            }}
            onPointerLeave={(e) => {
                togglePress(e);
            }}
            >
                <sphereGeometry args={[1.025, 64, 64]} />
                <meshPhongMaterial
                    map={cloudsMap}
                    opacity={0.2}
                    depthWrite={true}
                    transparent={true}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh ref={earthRef} position={[0, 0, 0]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhongMaterial specularMap={specularMap}/>
                <meshStandardMaterial
                    map={dayMap}
                    normalMap={normalMap}
                    metalness={0.4}
                    roughness={0.7}
                />
                {/* <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} /> */}
            <mesh position={[xiamen_xyz.x, xiamen_xyz.z, xiamen_xyz.y]}>
                <sphereBufferGeometry args={[0.0125, 32, 32]}/>
                <meshBasicMaterial color="red"></meshBasicMaterial>
            </mesh>
            </mesh>

        </>

    );
}