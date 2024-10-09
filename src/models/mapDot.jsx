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
                dot.radius || 0.018,
                dot.horSegment || 32,
                dot.verSegment || 32]} />
            <meshBasicMaterial color="red"></meshBasicMaterial>
        </mesh>
    )
}