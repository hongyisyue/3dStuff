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
import { MyLocations, geoToXYZ } from "../../data/locations";
import { MapDot } from "../../models/mapDot";
import { MovingPath } from "../../models/movingPath";
import { Pole } from "../../models/pole";
import { DefaultSettings } from "../../data/default";
import { Text3d } from "../../models/text3d";

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
        font, ...DefaultSettings.textOption
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
    const xiamen_xyz = geoToXYZ(earth_r, MyLocations.xiamen);
    const vancouver_xyz = geoToXYZ(earth_r, MyLocations.vancouver);
    const toronto_xyz = geoToXYZ(earth_r, MyLocations.toronto);
    const banff_xyz = geoToXYZ(earth_r, MyLocations.banff);
    const jinbian_xyz = geoToXYZ(earth_r, MyLocations.jinbian);
    const la_xyz = geoToXYZ(earth_r, MyLocations.la);
    const stoon_xyz = geoToXYZ(earth_r, MyLocations.stoon);
    const tokyo_xyz = geoToXYZ(earth_r, MyLocations.tokyo);
    const osaka_xyz = geoToXYZ(earth_r, MyLocations.osaka);
    const cancun_xyz = geoToXYZ(earth_r, MyLocations.cancun);
    const cannon_xyz = geoToXYZ(earth_r, MyLocations.cannon_beach);

    /** Location Signs */
    const xiamen_pole_end = getLineEndPonit({x:0, y:0, z:0}, xiamen_xyz);

    const vancouver_pole_end = getLineEndPonit({x:0, y:0, z:0}, vancouver_xyz);

    const stoon_pole_end = getLineEndPonit({x:0, y:0, z:0}, stoon_xyz);

    const cancun_pole_end = getLineEndPonit({x:0, y:0, z:0}, cancun_xyz);

    const la_pole_end = getLineEndPonit({x:0, y:0, z:0}, la_xyz);

    const jinbian_pole_end = getLineEndPonit({x:0, y:0, z:0}, jinbian_xyz);
    
    const tokyo_pole_end = getLineEndPonit({x:0, y:0, z:0}, tokyo_xyz);
    
    // returns a point of the end of the pole
    // p1 should always be the center point of the earth
    function getLineEndPonit(p1, p2) {
        const v3 = new THREE.Vector3(p2.x + (p2.x - p1.x)/4 , p2.y + (p2.y - p1.y)/4, p2.z + (p2.z - p1.z)/4);

        return v3;
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
                    onPointerDown={(e) => {window.open("https://www.instagram.com/hongxdå.art/");}}
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

                        <MapDot dot={xiamen_xyz}></MapDot>
                        <Pole dot={xiamen_xyz}></Pole>
                        <Text3d
                            pos={xiamen_pole_end}
                            text={'HOME'}
                            rotate={1.2}
                            mouseEnterEvent={(e) => setEnter(true)}
                            mouseLeaveEvent={(e) => setEnter(false)}
                            mouseDownEvent={(e) => {window.open("https://www.google.com/maps/place/Xiamen,+Fujian,+China/@24.4788776,117.7973602,11z/data=!3m1!4b1!4m6!3m5!1s0x34148379e5bfeb27:0x28a0670a9668d056!8m2!3d24.4795099!4d118.0894799!16zL20vMDEyNmMz?entry=ttu&g_ep=EgoyMDI0MTAwMi4xIKXMDSoASAFQAw%3D%3D");}}
                        ></Text3d>

                        <MapDot dot={jinbian_xyz}></MapDot>
                        <Pole dot={jinbian_xyz}></Pole>
                        <mesh
                            onPointerEnter={(e) => setEnter(true)}
                            onPointerLeave={(e) => setEnter(false)}
                            position={jinbian_pole_end}
                            rotation={[0, -Math.PI/1.2, 0]}
                        >
                            <textGeometry args={['PHNOMPENH', textOption]}/>
                            <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
                        </mesh>
                        <MovingPath
                            from={xiamen_xyz}
                            to={jinbian_xyz}
                            frameTime={time}
                        ></MovingPath>
                       
                        <MapDot dot={tokyo_xyz}></MapDot>
                        <Pole dot={tokyo_xyz}></Pole>
                        <mesh
                            onPointerEnter={(e) => setEnter(true)}
                            onPointerLeave={(e) => setEnter(false)}
                            position={tokyo_pole_end}
                            rotation={[0, -Math.PI/1.2, 0]}
                        >
                            {/* NOTE: text Grometry cannot take in lower case letter */}
                            <textGeometry args={['TOKYO', textOption]}/>
                            <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
                        </mesh>
                        <MovingPath
                            from={xiamen_xyz}
                            to={tokyo_xyz}
                            frameTime={time}
                        ></MovingPath>

                        <MapDot dot={osaka_xyz}></MapDot>
                        <MovingPath
                            from={tokyo_xyz}
                            to={osaka_xyz}
                            frameTime={time}
                        ></MovingPath>

                        <MapDot dot={cancun_xyz}></MapDot>
                        <Pole dot={cancun_xyz}></Pole>
                        <mesh
                            onPointerEnter={(e) => setEnter(true)}
                            onPointerLeave={(e) => setEnter(false)}
                            position={cancun_pole_end}
                            rotation={[0, -Math.PI/2.5, 0]}
                        >
                            <textGeometry args={['CANCUN', textOption]}/>
                            <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
                        </mesh>
                        <MovingPath
                            from={vancouver_xyz}
                            to={cancun_xyz}
                            frameTime={time}
                        ></MovingPath>

                        <MapDot dot={cannon_xyz}></MapDot>
                        <MovingPath
                            from={vancouver_xyz}
                            to={cannon_xyz}
                            frameTime={time}
                        ></MovingPath>

                        <MapDot dot={la_xyz}></MapDot>
                        <Pole dot={la_xyz}></Pole>
                        <mesh
                            onPointerEnter={(e) => setEnter(true)}
                            onPointerLeave={(e) => setEnter(false)}
                            position={la_pole_end}
                            rotation={[0, -Math.PI/2.5, 0]}
                        >
                            <textGeometry args={['LA', textOption]}/>
                            <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
                        </mesh>
                        <MovingPath
                            from={stoon_xyz}
                            to={la_xyz}
                            frameTime={time}
                        ></MovingPath>
                        
                        <MapDot dot={banff_xyz}></MapDot>
                        <MovingPath
                            from={stoon_xyz}
                            to={banff_xyz}
                            frameTime={time}
                        ></MovingPath>

                        <MapDot dot={toronto_xyz}></MapDot>
                        <MovingPath
                            from={stoon_xyz}
                            to={toronto_xyz}
                            frameTime={time}
                        ></MovingPath>

                        <MapDot dot={vancouver_xyz}></MapDot>
                        <Pole dot={vancouver_xyz}></Pole>
                        <mesh
                            onPointerEnter={(e) => setEnter(true)}
                            onPointerLeave={(e) => setEnter(false)}
                            onPointerDown={(e) => {window.open("https://www.google.com/maps/place/Vancouver,+BC/@49.2577062,-123.2063043,12z/data=!3m1!4b1!4m6!3m5!1s0x548673f143a94fb3:0xbb9196ea9b81f38b!8m2!3d49.2827291!4d-123.1207375!16zL20vMDgwaDI?entry=ttu&g_ep=EgoyMDI0MTAwMi4xIKXMDSoASAFQAw%3D%3D");}}
                            position={vancouver_pole_end}
                            rotation={[0, -Math.PI/2.5, 0]}
                        >
                            <textGeometry args={['2NDHOME', textOption]}/>
                            <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
                        </mesh>
                        <MovingPath
                            from={xiamen_xyz}
                            to={vancouver_xyz}
                            frameTime={time}
                        ></MovingPath>

                        <MapDot dot={stoon_xyz}></MapDot>
                        <Pole dot={stoon_xyz}></Pole>
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
                        <MovingPath
                            from={vancouver_xyz}
                            to={stoon_xyz}
                            frameTime={time}
                        ></MovingPath>
                    </mesh>
                </mesh>

            {/* </TrackballControls> */}

        </>

    );
}