`
uniform vec3 diffuse;
uniform float opacity;
uniform float time; // added time uniform
uniform float dashSize;
uniform float gapSize;
uniform float dotSize;
varying float vLineDistance;
  
void main() {
 float totalSize = dashSize + gapSize;
 float modulo = mod( vLineDistance - time, totalSize ); // time added to vLineDistance
 float dotDistance = dashSize + (gapSize * .5) - (dotSize * .5);
  
 if ( modulo > dashSize && mod(modulo, dotDistance) > dotSize ) { discard; }

 gl_FragColor = vec4( diffuse, opacity );
}
`