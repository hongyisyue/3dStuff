import { useLoader, useFrame } from "@react-three/fiber";
import React, { useRef, PointerEvent } from "react";
import * as THREE from "three";
import EarthDayMap from "../../assets/textures/8k_earth_daymap.jpg"
import EarthNightMap from "../../assets/textures/8k_earth_nightmap.jpg"
import EarthNormalMap from "../../assets/textures/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../../assets/textures/8k_earth_specular_map.jpg";
import EarthCloudsMap from "../../assets/textures/8k_earth_clouds.jpg";
import { OrbitControls, Stars, Tube } from "@react-three/drei";

export function Earth(params) {
    const [dayMap, nightMap, normalMap, specularMap, cloudsMap] = useLoader(
        THREE.TextureLoader,
        [EarthDayMap, EarthNightMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
    );

    const earthRef = useRef();
    const cloudsRef = useRef();
    const light = useRef();
    const obj = useRef();
 
    let isPressing = false;

    let lastX;
    let lastY;

    const xiamen = {
        lat: 24.4797 * Math.PI / 180,
        lng: 118.0818 * Math.PI / 180 + 125 * Math.PI / 180,
    }
    const xiamen_xyz = {
        x: Math.cos(xiamen.lng) * Math.cos(xiamen.lat),
        y: Math.sin(xiamen.lat),
        z: Math.sin(xiamen.lng) * Math.cos(xiamen.lat)
    }

    const vancouver = {
        lat: 49.2462 * Math.PI / 180,
        lng: -123.1162 * Math.PI / 180 - 115 * Math.PI / 180
    }
    const vancouver_xyz = {
        x: Math.cos(vancouver.lng) * Math.cos(vancouver.lat),
        y: Math.sin(vancouver.lat),
        z: Math.sin(vancouver.lng) * Math.cos(vancouver.lat)
    }

    const stoon = {
        lat: 52.1332 * Math.PI / 180,
        lng: 106.6700 * Math.PI / 180
    }
    const stoon_xyz = {
        x: Math.cos(stoon.lng) * Math.cos(stoon.lat),
        y: Math.sin(stoon.lat),
        z: Math.sin(stoon.lng) * Math.cos(stoon.lat)
    }

    const x_v_path = new THREE.CatmullRomCurve3(getCurve(xiamen_xyz, vancouver_xyz));
    const v_s_path = new THREE.CatmullRomCurve3(getCurve(vancouver_xyz, stoon_xyz));

    // useFrame(({ clock }) => {
    //     const elapsedTime = clock.getElapsedTime();

    //     earthRef.current.rotation.y = elapsedTime / 6;
    //     cloudsRef.current.rotation.y = elapsedTime / 6;
    // });

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

    function getCurve(p1, p2) {
        const v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
        const v2 = new THREE.Vector3(p2.x, p2.y, p2.z);

        const points = [];
        for (let i = 0; i < 30; i++) {
            const p = new THREE.Vector3().lerpVectors(v1, v2, i/20);
            p.normalize();
            p.multiplyScalar(1 + 0.1 * Math.sin(Math.PI * i/20));
            points.push(p);
        }

        return points;
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
                <sphereGeometry args={[1.035, 64, 64]} />
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
                <meshPhongMaterial specularMap={specularMap} />
                <meshStandardMaterial
                    map={dayMap}
                    normalMap={normalMap}
                    metalness={0.4}
                    roughness={0.7}
                />
                {/* <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} /> */}
                <mesh position={[xiamen_xyz.x, xiamen_xyz.y, xiamen_xyz.z]}>
                    <sphereBufferGeometry args={[0.0125, 32, 32]} />
                    <meshBasicMaterial color="red"></meshBasicMaterial>
                </mesh>

                <mesh>
                    <tubeGeometry args={[x_v_path, 20, 0.01, 8, false]}/>
                    <meshBasicMaterial color="red"></meshBasicMaterial>
                </mesh>

                <mesh position={[vancouver_xyz.x, vancouver_xyz.y, vancouver_xyz.z]}>
                    <sphereBufferGeometry args={[0.0125, 32, 32]} />
                    <meshBasicMaterial color="red"></meshBasicMaterial>
                </mesh>

                <mesh position={[stoon_xyz.x, stoon_xyz.y, stoon_xyz.z]}>
                    <sphereBufferGeometry args={[0.0125, 32, 32]} />
                    <meshBasicMaterial color="red"></meshBasicMaterial>
                </mesh>

                <mesh>
                    <tubeGeometry args={[v_s_path, 20, 0.01, 8, false]}/>
                    <meshBasicMaterial color="red"></meshBasicMaterial>
                </mesh>
            </mesh>

        </>

    );
}