// Vertex Shader
attribute vec4 a_Position;
void main() {
    gl_Position = a_Position;
}

// Fragment Shader
precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

void main() {
    vec4 texColor = texture2D(u_Sampler, v_TexCoord);
    gl_FragColor = vec4(1.0 - texColor.rgb, texColor.a);
}
