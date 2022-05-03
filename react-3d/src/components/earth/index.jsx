import { useLoader, useFrame, extend } from "@react-three/fiber";
import React, { useRef, PointerEvent, useState } from "react";
import * as THREE from "three";
import EarthDayMap from "../../assets/textures/8k_earth_daymap.jpg"
import EarthNormalMap from "../../assets/textures/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../../assets/textures/8k_earth_specular_map.jpg";
import EarthCloudsMap from "../../assets/textures/8k_earth_clouds.jpg";
import { OrbitControls, shaderMaterial, Stars, TransformControls, TrackballControls } from "@react-three/drei";
import { ShaderMaterial } from "three";
import { TextureLoader } from "three";
import boldUrl from '../../assets/fonts/bold.blob';

import glsl from 'babel-plugin-glsl/macro'

export function Earth(params) {

    const cloudsRef = useRef();

    const font = useLoader(THREE.FontLoader, boldUrl);
    const textOption = {
        font,
        size: 0.1,
        height: 0.05
    }

    let isEnter = false;
    let isPressing = false;

    let lastX;
    let lastY;

    const earth_r = 1.6;

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

    const xiamen_pole_end = getLineEndPonit({x:0, y:0, z:0}, xiamen_xyz);
    const xiamen_pole = new THREE.LineCurve3({x:0, y:0, z:0}, xiamen_pole_end);

    const vancouver_pole_end = getLineEndPonit({x:0, y:0, z:0}, vancouver_xyz);
    const vancouver_pole = new THREE.LineCurve3({x:0, y:0, z:0}, vancouver_pole_end);

    const stoon_pole_end = getLineEndPonit({x:0, y:0, z:0}, stoon_xyz);
    const stoon_pole = new THREE.LineCurve3({x:0, y:0, z:0}, stoon_pole_end);


    // returns a point for where the text geometry should start
    // so that the center of the text will be at point p
    function getTextStart(p) {

    }
    
    // returns a point of the end of the pole
    // p1 should always be the center point of the earth
    function getLineEndPonit(p1, p2) {
        const v3 = new THREE.Vector3(p2.x + (p2.x - p1.x)/4 , p2.y + (p2.y - p1.y)/4, p2.z + (p2.z - p1.z)/4);

        return v3;
    }

    // returns an arry of points of the curve
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

    let [time, setTime] = useState(0.0);

    const [dayMap, normalMap, specularMap, cloudsMap] = useLoader(
        TextureLoader,
        [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
    );

    useFrame(() => {
        setTime(time + 0.2);
        // time += 1;
        // setUniforms({
        //     time: time,
        //     // resolution: { value: new THREE.Vector4() }
        // });

        if (!isEnter) {
            cloudsRef.current.rotation.y += 0.005;
        }
    });

    let MovingDashMaterial = shaderMaterial(
        { time },
        // vertex shader
        glsl`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * modelViewPosition;
            }
            `,
        // fragment shader
        glsl`
            varying vec2 vUv;
            uniform float time;
            
            void main() {
                float dash = sin(vUv.x * 50. - time);
          
            if(dash<0.) discard;
        
            gl_FragColor = vec4( vUv.y,0.7,1.0,1.0 );
          }
        `
    )
    extend({ MovingDashMaterial })

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

    // depreciated
    function rotate(e) {
        if (isPressing) {
            console.log('drag: ' + e.width);
            if (e.width < lastX) {
                // earthRef.current.rotation.y -= e.width * 0.03;
                cloudsRef.current.rotation.y -= e.width * 0.03;
            } else {
                // earthRef.current.rotation.y += e.width * 0.03;
                cloudsRef.current.rotation.y += e.width * 0.03;
            }
        }
    }

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

                <mesh ref={cloudsRef} position={[2, 0, 0]}>
                    <TrackballControls/>
                    <sphereGeometry args={[earth_r + 0.05, 64, 64]} />
                    <meshPhongMaterial
                        map={cloudsMap}
                        opacity={0.45}
                        depthWrite={true}
                        transparent={true}
                        side={THREE.DoubleSide}
                    />
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[earth_r, 64, 64]} />
                        <meshPhongMaterial specularMap={specularMap} />
                        <meshStandardMaterial
                            map={dayMap}
                            normalMap={normalMap}
                            metalness={0.6}
                            roughness={0.5}
                        />

                        <mesh position={[xiamen_xyz.x, xiamen_xyz.y, xiamen_xyz.z]}>
                            <sphereBufferGeometry args={[0.018, 32, 32]} />
                            <meshBasicMaterial color="red"></meshBasicMaterial>
                        </mesh>
                        <mesh>
                            <tubeGeometry args={[xiamen_pole, 30, 0.013, 8, false]}/>
                            <meshBasicMaterial color="#BFF8FF"></meshBasicMaterial>
                        </mesh>
                        <mesh position={xiamen_pole_end} rotation={[0, -Math.PI/1.2, 0]}>
                            {/* <planeGeometry args={[0.3, 0.6]}/> */}
                            <textGeometry args={['HOME', textOption]}/>
                            <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
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
                            <movingDashMaterial
                                attach="material"
                                time={time}
                            >
                            </movingDashMaterial>
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
                            <movingDashMaterial
                                attach="material"
                                time={time}
                            >
                            </movingDashMaterial>
                        </mesh>


                        <mesh position={[vancouver_xyz.x, vancouver_xyz.y, vancouver_xyz.z]}>
                            <sphereBufferGeometry args={[0.018, 32, 32]} />
                            <meshBasicMaterial color="red"></meshBasicMaterial>
                        </mesh>
                        <mesh>
                            <tubeGeometry args={[vancouver_pole, 30, 0.013, 8, false]}/>
                            <meshBasicMaterial color="#BFF8FF"></meshBasicMaterial>
                        </mesh>
                        <mesh position={vancouver_pole_end} rotation={[0, -Math.PI/2.5, 0]}>
                            <textGeometry args={['2NDHOME', textOption]}/>
                            <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
                        </mesh>
                        <mesh
                            onPointerEnter={(e) => { toggleEnter(true) }}
                            onPointerLeave={(e) => { toggleEnter(false) }}
                        >
                            <tubeGeometry args={[x_v_path, 30, 0.013, 8, false]} />
                            <movingDashMaterial
                                attach="material"
                                time={time}
                            >
                            </movingDashMaterial>
                        </mesh>

                        <mesh position={[stoon_xyz.x, stoon_xyz.y, stoon_xyz.z]}>
                            <sphereBufferGeometry args={[0.018, 32, 32]} />
                            <meshBasicMaterial color="red"></meshBasicMaterial>
                        </mesh>
                        <mesh>
                            <tubeGeometry args={[stoon_pole, 30, 0.013, 8, false]}/>
                            <meshBasicMaterial color="#BFF8FF"></meshBasicMaterial>
                        </mesh>
                        <mesh position={stoon_pole_end} rotation={[0, -Math.PI/2.5, 0]}>
                            <textGeometry args={['UNIVERSITY', textOption]}/>
                            <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
                        </mesh>
                        <mesh
                            onPointerEnter={(e) => { toggleEnter(true) }}
                            onPointerLeave={(e) => { toggleEnter(false) }}
                        >
                            <tubeGeometry args={[v_s_path, 30, 0.013, 8, false]} />
                            <movingDashMaterial
                                attach="material"
                                time={time}
                            >
                            </movingDashMaterial>
                        </mesh>
                    </mesh>
                </mesh>

            {/* </TrackballControls> */}

        </>

    );
}