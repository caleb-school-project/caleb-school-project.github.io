attribute vec4 position;
attribute vec4 color;
attribute lowp float aspect;

varying lowp vec4 positionWithAspect;
varying lowp vec4 vcolor;

void main() {
  positionWithAspect = vec4(position.x / aspect, position.y, position.z, position.w);
  gl_Position = positionWithAspect;
  vcolor = color;
}
