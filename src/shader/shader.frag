precision mediump float;

uniform vec2 u_resolution;
uniform sampler2D u_texture;

const float Pi = 6.28318530718; // Pi*2
const float Directions = 16.0; // Number of blur directions
const float Quality = 6.0; // Blur quality
const float Size = 7.0; // Blur size (radius)
const float circleRadius = 0.9; // Radius of the circle, as a fraction of screen size
const float edgeSmoothness = 0.01; // Smoothness of the circle edge

vec4 gaussianBlur(vec2 uv, sampler2D texture, vec2 resolution) {
    vec2 Radius = Size / resolution;
    vec4 color = texture2D(texture, uv);

    for (int d = 0; d < int(Directions); ++d) {
        float angle = float(d) * Pi / Directions;
        for (int i = 1; i <= int(Quality); ++i) {
            float step = float(i) / Quality;
            color += texture2D(texture, uv + vec2(cos(angle), sin(angle)) * Radius * step);
        }
    }

    color /= Directions * Quality - 15.0;
    return color;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.y = 1.0 - uv.y; // Flip the image vertically

    vec2 center = u_resolution * 0.5;
    float radius = min(center.x, center.y) * circleRadius;
    float dist = distance(gl_FragCoord.xy, center);

    vec4 color = gaussianBlur(uv, u_texture, u_resolution);
    float brightness = 0.9; // Reduce brightness by 50%
    color.rgb *= brightness; // Apply brightness

    // Calculate smoothed alpha value for the edge
    float edge = smoothstep(radius, radius + u_resolution.y * edgeSmoothness, dist);

    color.a *= 1.0 - edge; // Apply the smooth edge

    gl_FragColor = color;
}
