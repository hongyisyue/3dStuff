import * as THREE from "three";
import { Pole } from "../models/pole";
import { DefaultSettings } from "../data/default";
import { Text3d } from "../models/text3d";
import { useLoader } from "@react-three/fiber";
import boldUrl from '../assets/fonts/bold.blob';

export function TextPole(params) {
    /**
     * Create a pole with a 3d text(given text) at the end at the given
     * position(xyz) with the given link(optinal), text option(optional),
     * and given mouse events(optional)
     * 
     * --params--
     * dot: {
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
    const dot = params.dot;
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

    // returns a point of the end of the pole
    // p1 should always be the center point of the earth
    function getLineEndPonit(p1, p2) {
        const v3 = new THREE.Vector3(p2.x + (p2.x - p1.x) / 4, p2.y + (p2.y - p1.y) / 4, p2.z + (p2.z - p1.z) / 4);

        return v3;
    }

    if (dot && text) {
        const poleEnd = getLineEndPonit({ x: 0, y: 0, z: 0 }, dot);
        return (
            <>
                <Pole dot={dot}></Pole>
                <Text3d
                    pos={poleEnd}
                    text={text}
                    textOption={textOption}
                    rotate={rotate}
                    mouseEnterEvent={enterEvent}
                    mouseLeaveEvent={leaveEvent}
                    mouseDownEvent={downEvent}
                ></Text3d>
            </>
        )
    }
}