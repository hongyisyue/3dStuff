attribute float lineDistance;
varying float vLineDistance;
  
void main() {
    vLineDistance = lineDistance;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}