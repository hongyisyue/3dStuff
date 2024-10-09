import React, { useRef, useState } from "react";
import * as THREE from "three";

export function MapDot(params) {
    /**
     * params should have a dot property
     * dot: {
     *  x: number,
     *  y: number,
     *  z: number,
     *  radius: number,
     *  horSegment: number.
     *  verSegment: number
     * }
     */
    const dot = params.dot;
    return (
        <mesh position={[dot.x, dot.y, dot.z]}>
            <sphereBufferGeometry args={[
                0.018,
                32,
                32]} />
            <meshBasicMaterial color="red"></meshBasicMaterial>
        </mesh>
    )
}