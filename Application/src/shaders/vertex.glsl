// Vertex shader of the particle mesh.


uniform float zoom;
uniform float scale;

// Attributes of point sprites
attribute float size;
attribute vec4 customColor;
attribute float type;
attribute float show;
attribute float selected;

// Varying of point sprites
varying vec4 vColor;
varying float vType;
varying float vShow;
varying float vSelected;

void main() {
    vColor = customColor;
    vType = type;
    vShow = show;
    vSelected = selected;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * scale;
    gl_Position = projectionMatrix * mvPosition;
}