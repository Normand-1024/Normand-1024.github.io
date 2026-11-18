uniform float fadeStart;


// What's in our toolbox
//
// What's in the coffe cup we're going to make art with
//   palette, box of brushes, shelf
/*

length() to draw circles, gradients
color functions, blend color values, mix colors together
sin(), fract(), mod(), >   to make stripes, shapes
u_time to animate, loop
masking, masks >   black and white area, to crop out/mask out (roads, eye)
textures, reading textures. manipulating, stretching, tiling/tilting. manipulating coordinates
composing, layering, positioning, sizes
color space, tonemapping. rgb to hsv. 
dithering, compressing color
importing sprites. duplicating. 'standing stickers'
importing GIFs, easy animations. importing images from the internet.
perspective, 3D space, 
raycasting, sampling a 3D environment
2D SDF shapes with distance functions. add, combine, interpolate/blend
 stripes, glow, fract() with SDF
transparency, mix(), additive blending (adding color), multiply. > mixing vec3/colors together




//
//
//
///
// assignemnt:
// theme: A moment of your day, last week, last month. 
// three techniques, somewhat confident about
// choose the aspect ratio.
// optional: decide one foreground element (monkey on a bycicle), background (cityscape), decoration element (trees)
// opional: decide one key color, one secondary/complementary, third alternate
//  try: not vibe code, not use gifs





- Intro assignment
    - A moment of your day, your week or your last month
    - Make a shader from scratch
    - Choose:
        - Three techniques from your toolbox that you feel somewhat confident about
        - An image format (1:1, 9:16) in the settings
    - Optional, to keep things simple
        - One foreground element, a background, and a decoration
        - One key color, one alternate color and one complementary color
    - Try not to use GIFs or vibe code



*/

uniform sampler2D u_tex_dither; 
uniform sampler2D u_tex_smoke1; 
uniform sampler2D u_tex_smoke2; 
uniform sampler2D u_tex_sims;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 uv_aspect_corrected = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);

    float dither = texture(u_tex_dither, gl_FragCoord.xy / vec2(textureSize(u_tex_dither, 0) * 1)).r;
    float shades = 6.0;

    vec3 col = vec3(0.948, 0.948, 0.913);

    vec3 smo = vec3( 
        0.965 * texture(u_tex_smoke1,
        2.502461 * (0.108 * cos(0.082 * u_time) + 0.5)
        * uv_aspect_corrected 
        + vec2(-0.108 * u_time, -0.091 * u_time)).r
        *
        0.615 * texture(u_tex_smoke2,
        3.812435 * (0.065 * cos(0.073 * u_time) + 0.5)
        * uv_aspect_corrected  
        + vec2(0.015 * cos(0.781 * u_time) + -0.05 * u_time, -0.04 * u_time)).r
        +
        0.4 * texture(u_tex_smoke1,
        3.595866 * (0.205 * cos(0.135 * u_time) + 0.5)
        * uv_aspect_corrected 
        + vec2(-0.066 * u_time, 0.004 * u_time)).r
        *
        0.275 * texture(u_tex_smoke2,
        3.491581 * (0.17 * cos(0.039 * u_time) + 0.5)
        * uv_aspect_corrected  
        + vec2(-0.082 * u_time, -0.02 * u_time)).r
    );

    // col.r = uv.x;
    // col.g = uv.y;

    // Texturing

    vec2 texTopLeft = vec2(-0.294, -0.328);
    vec2 texScale = vec2(1.7, 1.7);
    vec2 texUV = texScale * (uv_aspect_corrected - texTopLeft);
    texUV = max(vec2(0.), texUV);
    texUV = min(vec2(1.), texUV);

    vec3 texCol = vec3(1.755731 * texture(u_tex_sims, texUV).b);
    texCol = mix(texCol, texture(u_tex_sims, texUV).rgb, 0.353);
    
    // Fading

    // float fadeStart = 0.0 * sin(0.5 * u_time) + 0.93; // measured in UV distance
    float fadeLength = 0.458; // measured in UV distance

    float fadeLevel = smoothstep(fadeStart + fadeLength, fadeStart, length(texUV + vec2(0.178, -0.486)));


    vec3 fadeCol = texCol;
    vec2 offsetTexUV = texUV + vec2(0.108, 0.161) + smo.rg * vec2(-0.416, -0.608);

    if (fadeLevel <= 0.95 && fadeLevel >= 0.0001){

        
        vec3 offset_tex = vec3(1.755731 * texture(u_tex_sims, offsetTexUV).b);
        offset_tex = mix(texCol, texture(u_tex_sims, offsetTexUV).rgb, 0.441);

        fadeCol = floor(1.537184 * offset_tex.rgb + 1.376 * dither + smo * -1.15976) / 1.588;

        fadeCol = mix(col * 0.5, fadeCol, fadeCol.r);

        texCol = mix(fadeCol, texCol,  3.933424 * (fadeLevel + -0.678));

        texCol = mix(col, texCol,  fadeLevel);

        // fadeLevel *= 0.712 * texture(u_tex_smoke2, 1.762288 * texUV).r;
    }

    // Calculate the final texture fading
    col = mix(col, texCol, 
        texture(u_tex_sims, texUV).a * fadeLevel);

    //point fadeLevel
    // if (fadeLevel <= 0.842 ) {
    //     col = mix(col, texCol, 
    //    texture(u_tex_sims, offsetTexUV).a);
    // }

    // col = texCol;

    // Smoke Effect

    vec3 d =  smo;

    vec3 d1 = d - (0.677 - (0.467 * sin(0.624 * length(uv_aspect_corrected)) + 0.24));
    d1 = max(vec3(0.012), d1);
   // d1 = (vec3(0.0), d1);

    vec3 d2 = d;

    d = d2 + 0.511 * d1;
    d = min(vec3(1.0), d);
    d = max(vec3(0.0), d);
    d = mix (vec3(0.), d, smoothstep(0.353, 1.0, length(vec2(1.31841, 0.65505) * uv_aspect_corrected+ vec2(0.414, 0.187))));
    d = d + 0.327 * d2;

    d = floor(shades * d + dither) / shades;

    col -= d;
    col.r = min(0.816, col.r);
    col.g = min(0.886, col.g);
    col.b = min(0.92, col.b);

    fragColor = vec4(col, 1.0);
}
