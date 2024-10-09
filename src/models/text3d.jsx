import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { DefaultSettings } from "../data/default";
import boldUrl from '../assets/fonts/bold.blob';

export function Text3d(params) {
    /**
     * Create a 3d text at the given position(xyz) with
     * the given text, and given link(optinal), text option(optional)
     * 
     * --params--
     * pos: {
     *  x: number,
     *  y: number,
     *  z: number
     * }
     * text: string,
     * 
     * rotate[Optional]: number
     * textOption[Optional]: {
     *  font: useLoader(),
     *  size: number,
     *  height: number
     * }
     * mouseEnterEvent[Optional]: function()
     * mouseLeaveEvent[Optional]: function()
     * mouseDownEvent[Optional]: function(),
     */

    // position
    const position = params.pos;
    //NOTE: text Grometry cannot take in lower case letter
    const text = params.text;
    const rotate = params.rotate ?? 1;
    const font = useLoader(THREE.FontLoader, boldUrl);
    const textOption = params.textOption || {
        font,
        ...DefaultSettings.textOption
    };

    // mouse events
    const enterEvent = params.mouseEnterEvent;
    const leaveEvent = params.mouseLeaveEvent;
    const downEvent = params.mouseDownEvent;

    if (position && text) {
        return (
            <mesh
                onPointerEnter={ enterEvent ?? null }
                onPointerLeave={ leaveEvent ?? null}
                onPointerDown={ downEvent ?? null }
                position={position}
                rotation={[0, -Math.PI / rotate, 0]}
            >
                <textGeometry args={[text, textOption]} />
                <meshBasicMaterial color="#BFF8FF" side={THREE.DoubleSide}></meshBasicMaterial>
            </mesh>
        )
    }
}