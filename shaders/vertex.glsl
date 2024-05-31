attribute vec4 position;
attribute vec2 camerashift;
attribute vec4 color;
attribute lowp float aspect;

varying lowp vec4 positionWithAspect;
varying lowp vec4 vcolor;

void main() {
  positionWithAspect = vec4((position.x + camerashift.x / aspect), position.y + camerashift.y, position.z, position.w);
  gl_Position = positionWithAspect;
  vcolor = color;
}
