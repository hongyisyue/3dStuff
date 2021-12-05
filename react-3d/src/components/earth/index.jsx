import { useLoader, useFrame, extend } from "@react-three/fiber";
import React, { useRef, PointerEvent, useMemo } from "react";
import * as THREE from "three";
import EarthDayMap from "../../assets/textures/8k_earth_daymap.jpg"
import EarthNightMap from "../../assets/textures/8k_earth_nightmap.jpg"
import EarthNormalMap from "../../assets/textures/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../../assets/textures/8k_earth_specular_map.jpg";
import EarthCloudsMap from "../../assets/textures/8k_earth_clouds.jpg";
import { OrbitControls, shaderMaterial, Stars, Tube } from "@react-three/drei";
import { ShaderMaterial } from "three";
import lineVertex from "../../material/lineMaterial/lineVertex.glsl"
import lineFrag from '../../material/lineMaterial/lineFrag.glsl'

import glsl from 'babel-plugin-glsl/macro'

export function Earth(params) {
    const [dayMap, nightMap, normalMap, specularMap, cloudsMap] = useLoader(
        THREE.TextureLoader,
        [EarthDayMap, EarthNightMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
    );

    const earthRef = useRef();
    const cloudsRef = useRef();
    const light = useRef();
    const obj = useRef();

    let isEnter = false;
    let isPressing = false;

    let lastX;
    let lastY;

    const earth_r = 1.3;

    const xiamen = {
        lat: 24.4797 * Math.PI / 180,
        lng: 118.0818 * Math.PI / 180 + 125 * Math.PI / 180,
    }
    const xiamen_xyz = {
        x: earth_r * Math.cos(xiamen.lng) * Math.cos(xiamen.lat),
        y: earth_r * Math.sin(xiamen.lat),
        z: earth_r * Math.sin(xiamen.lng) * Math.cos(xiamen.lat)
    }

    const vancouver = {
        lat: 49.2462 * Math.PI / 180,
        lng: -123.1162 * Math.PI / 180 - 115 * Math.PI / 180
    }
    const vancouver_xyz = {
        x: earth_r * Math.cos(vancouver.lng) * Math.cos(vancouver.lat),
        y: earth_r * Math.sin(vancouver.lat),
        z: earth_r * Math.sin(vancouver.lng) * Math.cos(vancouver.lat)
    }

    const stoon = {
        lat: 52.1332 * Math.PI / 180,
        lng: 106.6700 * Math.PI / 180
    }
    const stoon_xyz = {
        x: earth_r * Math.cos(stoon.lng) * Math.cos(stoon.lat),
        y: earth_r * Math.sin(stoon.lat),
        z: earth_r * Math.sin(stoon.lng) * Math.cos(stoon.lat)
    }

    const tokyo = {
        lat: 35.6528 * Math.PI / 180,
        lng: 139.8394 * Math.PI / 180 + 80 * Math.PI / 180
    }
    const tokyo_xyz = {
        x: earth_r * Math.cos(tokyo.lng) * Math.cos(tokyo.lat),
        y: earth_r * Math.sin(tokyo.lat),
        z: earth_r * Math.sin(tokyo.lng) * Math.cos(tokyo.lat)
    }

    const osaka = {
        lat: 34.6723 * Math.PI / 180,
        lng: 135.4848 * Math.PI / 180 + 90 * Math.PI / 180
    }
    const osaka_xyz = {
        x: earth_r * Math.cos(osaka.lng) * Math.cos(osaka.lat),
        y: earth_r * Math.sin(osaka.lat),
        z: earth_r * Math.sin(osaka.lng) * Math.cos(osaka.lat)
    }

    const x_v_path = new THREE.CatmullRomCurve3(getCurve(xiamen_xyz, vancouver_xyz));
    const v_s_path = new THREE.CatmullRomCurve3(getCurve(vancouver_xyz, stoon_xyz));
    const x_t_path = new THREE.CatmullRomCurve3(getCurve(xiamen_xyz, tokyo_xyz));
    const t_o_path = new THREE.CatmullRomCurve3(getCurve(tokyo_xyz, osaka_xyz));

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

    useFrame(({ clock }) => {
        if (!isEnter) {
            earthRef.current.rotation.y += 0.005;
            cloudsRef.current.rotation.y += 0.005;
        }
    });

    const uniforms = useMemo(() => ({
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector4() }
    }, []))

    const MovingDashMaterial = shaderMaterial(
        uniforms,
        // vertex shader
        glsl`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        // fragment shader
        glsl`
          varying vec2 vUv;
          uniform float time;
          
          void main() {
            float dash = sin(vUv.x*50. - time);
          
          if(dash<0.) discard;
        
          gl_FragColor = vec4( vUv.x,0.,0.0,1. );
          }
        `
    )
    extend({MovingDashMaterial})

    function toggleEnter(e) {
        isEnter = e;
    }

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
            <mesh ref={cloudsRef} position={[2, 0, 0]}>
                <sphereGeometry args={[1.35, 64, 64]} />
                <meshPhongMaterial
                    map={cloudsMap}
                    opacity={0.4}
                    depthWrite={true}
                    transparent={true}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh ref={earthRef} position={[2, 0, 0]}>
                <sphereGeometry args={[1.3, 64, 64]} />
                <meshPhongMaterial specularMap={specularMap} />
                <meshStandardMaterial
                    map={dayMap}
                    normalMap={normalMap}
                    metalness={0.4}
                    roughness={0.7}
                />
                <mesh position={[xiamen_xyz.x, xiamen_xyz.y, xiamen_xyz.z]}>
                    <sphereBufferGeometry args={[0.018, 32, 32]} />
                    <meshBasicMaterial color="red"></meshBasicMaterial>
                </mesh>

                <mesh position={[tokyo_xyz.x, tokyo_xyz.y, tokyo_xyz.z]}>
                    <sphereBufferGeometry args={[0.018, 32, 32]} />
                    <meshBasicMaterial color="red"></meshBasicMaterial>
                </mesh>

                <mesh
                    onPointerEnter={(e) => { toggleEnter(true) }}
                    onPointerLeave={(e) => { toggleEnter(false) }}
                >
                    <tubeGeometry args={[x_t_path, 30, 0.013, 8, false]} />
                    <movingDashMaterial attach="material" color="hotpink" time={1}></movingDashMaterial>
                    {/* <meshBasicMaterial color="#42cbfc"></meshBasicMaterial> */}
                    {/* <shaderMaterial
                        args={[{
                            extensions: {
                                derivatives: "extension GL_OES_standard_derivatives : enable"
                            },
                            side: THREE.DoubleSide,
                            uniforms,
                            vertexShader: `
	                        uniform vec2 resolution;
                            varying vec2 vUv;

	                        void main()	{
                                vUv = vec2(position.x, position.y);
	                        	gl_Position = vec4( position, 1.0 );
	                        }
                            `,
                            fragmentShader: `
                            varying vec2 vUv;
                            uniform float time;
                              
                            void main() {
                             float dash = sin(vUv.x*50. - time);
                              
                             if(dash<0.) discard;
                            
                             gl_FragColor = vec4( vUv.x,0.,0.0,1. );
                            }
                            `,
                        }]}
                    ></shaderMaterial> */}
                </mesh>

                <mesh position={[osaka_xyz.x, osaka_xyz.y, osaka_xyz.z]}>
                    <sphereBufferGeometry args={[0.018, 32, 32]} />
                    <meshBasicMaterial color="red"></meshBasicMaterial>
                </mesh>

                <mesh
                    onPointerEnter={(e) => { toggleEnter(true) }}
                    onPointerLeave={(e) => { toggleEnter(false) }}
                >
                    <tubeGeometry args={[t_o_path, 30, 0.013, 8, false]} />
                    <meshBasicMaterial color="#42cbfc"></meshBasicMaterial>
                    {/* <lineDashedMaterial linewidth={0.1} dashSize={1} gapSize={1} scale={0.1}></lineDashedMaterial> */}
                </mesh>

                <mesh position={[vancouver_xyz.x, vancouver_xyz.y, vancouver_xyz.z]}>
                    <sphereBufferGeometry args={[0.018, 32, 32]} />
                    <meshBasicMaterial color="red"></meshBasicMaterial>
                </mesh>

                <mesh
                    onPointerEnter={(e) => { toggleEnter(true) }}
                    onPointerLeave={(e) => { toggleEnter(false) }}
                >
                    <tubeGeometry args={[x_v_path, 30, 0.013, 8, false]} />
                    <meshBasicMaterial color="#42cbfc"></meshBasicMaterial>
                    {/* <lineDashedMaterial linewidth={0.1} dashSize={1} gapSize={1} scale={0.1}></lineDashedMaterial> */}
                </mesh>

                <mesh position={[stoon_xyz.x, stoon_xyz.y, stoon_xyz.z]}>
                    <sphereBufferGeometry args={[0.018, 32, 32]} />
                    <meshBasicMaterial color="red"></meshBasicMaterial>
                </mesh>

                <mesh>
                    <tubeGeometry args={[v_s_path, 30, 0.015, 8, false]} />
                    <meshBasicMaterial color="#42cbfc"></meshBasicMaterial>
                </mesh>
            </mesh>

        </>

    );
}