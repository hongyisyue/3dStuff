import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export function Cube(params) {
    /**
     * Create a 3d cubd at the given position with the
     * given spec. Wrap with the given material.
     * 
     * --params--
     * position: [number, number, number] (x, y, z)
     * spec: [number, number, number] (w, l, h)
     * material: THREE texture
     * mouseDownEvent: function()
     */
    const ref = useRef();
    const [isEnter, setEnter] = useState(false);

    const position = params.pos;
    const spec = params.spec || [1, 1, 1];
    const material = params.material;
    const mouseDownEvent = params.mouseDownEvent;

    /** Animation */
    useFrame(() => {
        if (!isEnter) {
            ref.current.rotation.x += 0.005;
            ref.current.rotation.y += 0.005;
        }
    });

    if (ref && position) {
        return (
            <mesh
                ref={ref}
                position={position}
                onPointerEnter={(e) => { setEnter(true); }}
                onPointerLeave={(e) => { setEnter(false); }}
                onPointerDown={mouseDownEvent ?? null}
            >
                <boxBufferGeometry args={spec} />
                <meshBasicMaterial
                    map={material}
                    metalness={0.6}
                    roughness={0.5}
                />
            </mesh>
        )
    }
}