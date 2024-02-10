attribute vec4 position;
attribute vec4 color;

varying lowp vec4 vcolor;

void main() {
  gl_Position = position;
  vcolor = color;
}
