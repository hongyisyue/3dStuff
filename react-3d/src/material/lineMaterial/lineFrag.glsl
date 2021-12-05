varying vec2 vUv;
uniform float time;
void main() {
    float dash = sin(vUv.x*50 - time);
     if (dash < 0) discard;

     color = vec4(vUv.x, 0, 0, 1);
}