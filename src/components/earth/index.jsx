import { useLoader, useFrame, extend } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import EarthDayMap from "../../assets/textures/8k_earth_daymap.jpg"
import EarthNormalMap from "../../assets/textures/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../../assets/textures/8k_earth_specular_map.jpg";
import EarthCloudsMap from "../../assets/textures/8k_earth_clouds.jpg";
import MyPhotoMap from "../../assets/textures/myPhoto3.jpg";
import LinkedinMap from "../../assets/textures/linkedin.png";
import IgMap from "../../assets/textures/ig.png";
import { shaderMaterial, Stars, TrackballControls } from "@react-three/drei";
import { TextureLoader } from "three";
import boldUrl from '../../assets/fonts/bold.blob';

import glsl from 'babel-plugin-glsl/macro'

export function Earth(params) {
    
    /** refs */
    let cloudsRef = useRef();
    let earthRef = useRef();
    let photoRef = useRef();
    let linkedinRef = useRef();
    let igRef = useRef();
    
    /** For Text Geometry */
    const font = useLoader(THREE.FontLoader, boldUrl);
    const textOption = {
        font,
        size: 0.1,
        height: 0.05
    }
    
    const [isEnter, setEnter] = useState(false);
    const [isPhotoEnter, setPhotoEnter] = useState(false);
    const [isLkEnter, setLkEnter] = useState(false);
    const [isIgEnter, setIgEnter] = useState(false);
    const [time, setTime] = useState(0.0);

    /** Textures */
    const [dayMap, normalMap, specularMap, cloudsMap, myPhotoMap, lkMap, igMap] = useLoader(
        TextureLoader,
        [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap, MyPhotoMap, LinkedinMap, IgMap]
    );

    const earth_r = 1.6;

    /** Locations */
    const xiamen = {
        lat: 24.4797 * Math.PI / 180,
        lng: 118.0818 * Math.PI / 180 + 125 * Math.PI / 180,
    }
    const xiamen_xyz = getPointXYZ(xiamen);

    const vancouver = {
        lat: 49.2462 * Math.PI / 180,
        lng: -123.1162 * Math.PI / 180 - 115 * Math.PI / 180
    }
    const vancouver_xyz = getPointXYZ(vancouver);

    const toronto = {
        lat: 43.6510 * Math.PI /180,
        lng: -79.3470 * Math.PI / 180 + 160 * Math.PI / 180
    }
    const toronto_xyz = getPointXYZ(toronto);

    const banff = {
        lat: 51.1802 * Math.PI / 180,
        lng: -115.5657 * Math.PI / 180 + 227 * Math.PI / 180
    }
    const banff_xyz = getPointXYZ(banff);

    const jinbian = {
        lat: 11.5621 * Math.PI / 180, 
        lng: 104.8885 * Math.PI / 180 + 150 * Math.PI / 180
    }
    const jinbian_xyz = getPointXYZ(jinbian);

    const la = {
        lat: 34.0523 * Math.PI / 180,
        lng: -118.2436 * Math.PI / 180 - 125 * Math.PI / 180
    }
    const la_xyz = getPointXYZ(la);

    const stoon = {
        lat: 52.1332 * Math.PI / 180,
        lng: -106.6700 * Math.PI / 180 + 210 * Math.PI / 180
    }
    const stoon_xyz = getPointXYZ(stoon);

    const tokyo = {
        lat: 35.6528 * Math.PI / 180,
        lng: 139.8394 * Math.PI / 180 + 80 * Math.PI / 180
    }
    const tokyo_xyz = getPointXYZ(tokyo);

    const osaka = {
        lat: 34.6723 * Math.PI / 180,
        lng: 135.4848 * Math.PI / 180 + 90 * Math.PI / 180
    }
    const osaka_xyz = getPointXYZ(osaka);

    /** Flight paths */
    const x_v_path = new THREE.CatmullRomCurve3(getCurve(xiamen_xyz, vancouver_xyz));
    const s_v_path = new THREE.CatmullRomCurve3(getCurve(stoon_xyz, vancouver_xyz));
    const x_t_path = new THREE.CatmullRomCurve3(getCurve(xiamen_xyz, tokyo_xyz));
    const t_o_path = new THREE.CatmullRomCurve3(getCurve(tokyo_xyz, osaka_xyz));
    const s_t_path = new THREE.CatmullRomCurve3(getCurve(stoon_xyz, toronto_xyz));
    const s_b_path = new THREE.CatmullRomCurve3(getCurve(stoon_xyz, banff_xyz));
    const x_j_path = new THREE.CatmullRomCurve3(getCurve(xiamen_xyz, jinbian_xyz));
    const s_l_path = new THREE.CatmullRomCurve3(getCurve(stoon_xyz, la_xyz));

    /** Location Signs */
    const xiamen_pole_end = getLineEndPonit({x:0, y:0, z:0}, xiamen_xyz);
    const xiamen_pole = new THREE.LineCurve3({x:0, y:0, z:0}, xiamen_pole_end);

    const vancouver_pole_end = getLineEndPonit({x:0, y:0, z:0}, vancouver_xyz);
    const vancouver_pole = new THREE.LineCurve3({x:0, y:0, z:0}, vancouver_pole_end);

    const stoon_pole_end = getLineEndPonit({x:0, y:0, z:0}, stoon_xyz);
    const stoon_pole = new THREE.LineCurve3({x:0, y:0, z:0}, stoon_pole_end);


    // returns a point with lat & lng to a vertor3 point
    function getPointXYZ(p) {
        return {
            x: earth_r * Math.cos(p.lng) * Math.cos(p.lat),
            y: earth_r * Math.sin(p.lat),
            z: earth_r * Math.sin(p.lng) * Math.cos(p.lat)
        }
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

    /** Animation */
    useFrame(() => {
        setTime(time + 0.2);

        if (!isEnter) {
            console.log(isEnter);
            cloudsRef.current.rotation.y += 0.005;
        }

        if (!isPhotoEnter) {
            photoRef.current.rotation.x += 0.005;
            photoRef.current.rotation.y += 0.005;
        }

        if (!isLkEnter) {
            linkedinRef.current.rotation.x += 0.005;
            linkedinRef.current.rotation.y += 0.005;
        }

        if (!isIgEnter) {
            igRef.current.rotation.x += 0.005;
            igRef.current.rotation.y += 0.005;
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

                <mesh
                    ref={photoRef}
                    position={[-4, 1.5, 0]}
                    onPointerEnter={(e) => {setPhotoEnter(true);}}
                    onPointerLeave={(e) => {setPhotoEnter(false);}}
                >
                    <boxBufferGeometry args={[1, 1, 1]}/>
                    <meshBasicMaterial
                        map={myPhotoMap}
                        metalness={0.6}
                        roughness={0.5}
                    />
                </mesh>

                <mesh
                    ref={linkedinRef}
                    position={[-4, -0.5, 0]}
                    onPointerDown={(e) => {window.open("https://www.linkedin.com/in/hong-xue/");}}
                    onPointerEnter={(e) => {setLkEnter(true);}}
                    onPointerLeave={(e) => {setLkEnter(false);}}
                >
                    <boxBufferGeometry args={[0.3, 0.3, 0.3]}/>
                    <meshBasicMaterial
                        map={lkMap}
                        metalness={0.6}
                        roughness={0.5}
                    />
                </mesh>
                
                <mesh
                    ref={igRef}
                    position={[-4, -1.5, 0]}
                    onPointerDown={(e) => {window.open("https://www.instagram.com/hxue.art/");}}
                    onPointerEnter={(e) => {setIgEnter(true);}}
                    onPointerLeave={(e) => {setIgEnter(false);}}
                >
                    <boxBufferGeometry args={[0.3, 0.3, 0.3]}/>
                    <meshBasicMaterial
                        map={igMap}
                        metalness={0.6}
                        roughness={0.5}
                    />
                </mesh>

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
                    <mesh ref={earthRef} position={[0, 0, 0]}>
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
                        <mesh
                            onPointerEnter={(e) => setEnter(true)}
                            onPointerLeave={(e) => setEnter(false)}
                            onPointerDown={(e) => {window.open("https://en.wikipedia.org/wiki/Xiamen");}}
                            position={xiamen_pole_end}
                            rotation={[0, -Math.PI/1.2, 0]}
                        >
                            <textGeometry args={['HOME', textOption]}/>
                            <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
                        </mesh>

                        <mesh position={[jinbian_xyz.x, jinbian_xyz.y, jinbian_xyz.z]}>
                            <sphereBufferGeometry args={[0.018, 32, 32]} />
                            <meshBasicMaterial color="red"></meshBasicMaterial>
                        </mesh>
                        <mesh>
                            <tubeGeometry args={[x_j_path, 30, 0.013, 8, false]} />
                            <movingDashMaterial
                                attach="material"
                                time={time}
                            >
                            </movingDashMaterial>
                        </mesh>
                       
                        <mesh position={[tokyo_xyz.x, tokyo_xyz.y, tokyo_xyz.z]}>
                            <sphereBufferGeometry args={[0.018, 32, 32]} />
                            <meshBasicMaterial color="red"></meshBasicMaterial>
                        </mesh>
                        <mesh>
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
                        <mesh>
                            <tubeGeometry args={[t_o_path, 30, 0.013, 8, false]} />
                            <movingDashMaterial
                                attach="material"
                                time={time}
                            >
                            </movingDashMaterial>
                        </mesh>

                        <mesh position={[la_xyz.x, la_xyz.y, la_xyz.z]}>
                            <sphereBufferGeometry args={[0.018, 32, 32]} />
                            <meshBasicMaterial color="red"></meshBasicMaterial>
                        </mesh>
                        <mesh>
                            <tubeGeometry args={[s_l_path, 30, 0.013, 8, false]} />
                            <movingDashMaterial
                                attach="material"
                                time={time}
                            >
                            </movingDashMaterial>
                        </mesh>

                        <mesh position={[banff_xyz.x, banff_xyz.y, banff_xyz.z]}>
                            <sphereBufferGeometry args={[0.018, 32, 32]} />
                            <meshBasicMaterial color="red"></meshBasicMaterial>
                        </mesh>
                        <mesh>
                            <tubeGeometry args={[s_b_path, 30, 0.013, 8, false]} />
                            <movingDashMaterial
                                attach="material"
                                time={time}
                            >
                            </movingDashMaterial>
                        </mesh>

                        <mesh position={[toronto_xyz.x, toronto_xyz.y, toronto_xyz.z]}>
                            <sphereBufferGeometry args={[0.018, 32, 32]} />
                            <meshBasicMaterial color="red"></meshBasicMaterial>
                        </mesh>
                        <mesh>
                            <tubeGeometry args={[s_t_path, 30, 0.013, 8, false]} />
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
                        <mesh
                            onPointerEnter={(e) => setEnter(true)}
                            onPointerLeave={(e) => setEnter(false)}
                            onPointerDown={(e) => {window.open("https://en.wikipedia.org/wiki/Greater_Vancouver");}}
                            position={vancouver_pole_end}
                            rotation={[0, -Math.PI/2.5, 0]}
                        >
                            <textGeometry args={['2NDHOME', textOption]}/>
                            <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
                        </mesh>
                        <mesh
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
                        <mesh
                            onPointerEnter={(e) => setEnter(true)}
                            onPointerLeave={(e) => setEnter(false)}
                            onPointerDown={(e) => {window.open("https://en.wikipedia.org/wiki/University_of_Saskatchewan")}}
                            position={stoon_pole_end}
                            rotation={[0, -Math.PI/2.5, 0]}
                        >
                            <textGeometry args={['UNIVERSITY', textOption]}/>
                            <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
                        </mesh>
                        <mesh>
                            <tubeGeometry args={[s_v_path, 30, 0.013, 8, false]}/>
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