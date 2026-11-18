uniform vec3 grassCol; // (0.0, 0.5, 0.0) [0, 1]
uniform vec3 skyCol2; // (0.5, 0.2, 0.3) [0, 1]
uniform vec3 skyHorizonCol; // (0.886, 0.986, 0.971) [0, 1]
uniform vec3 skyCol1; // (0.54, 0.709, 0.825) [0, 1]


/////////////////
///
///     Assignment:
///         What do we see out the train window.
///         
///         Change the ground, the cloud plane and the sky coloring
///
///         You may use the fog, ground and sky color functions
///         to change the way the scene looks.
///         
///         Extra credit: Change the dither() function for coloring effects
///         For later:
///           - How would we make the clouds cast shadows on the ground?
///           - How could we add other elements to our landscape?
///           - Can the train go in other directions or turn around?
///           - What about a day/night cycle?


uniform sampler2D u_tex_floor;
uniform sampler2D u_tex_clouds;
uniform sampler2D u_tex_dither;
uniform sampler2D u_tex_windowglass;
uniform sampler2D u_tex_windowframe;
uniform sampler2D u_tex_star;
uniform sampler2D u_tex_mountain;


// https://github.com/hughsk/glsl-hsv2rgb
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// https://github.com/hughsk/glsl-hsv2rgb/commits?author=hughsk
// All components are in the range [0…1], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// Vertical Plane
bool hit_vertical_plane(
    vec3 ro,
    vec3 rd,
    vec3 center,
    vec2 size,
    float yawTurns,
    out float travel,
    out vec3 p,
    out vec2 uv
) {
    float a = yawTurns * TAU; // Turns to radians

    vec3 right = vec3(cos(a), 0.0, sin(a));
    vec3 normal = vec3(-right.z, 0.0, right.x);

    // How much the ray points toward the plane's normal
    float denom = dot(rd, normal);

    // Ray is parallel to the plane
    if (abs(denom) < 0.00001) return false;

    travel = dot(center - ro, normal) / denom;

    if (travel <= 0.0) return false;

    p = ro + rd * travel;

    // Get a point in the plane's local coordinates
    vec3 offset = p - center;
    uv = vec2(dot(offset, right), offset.y);
    uv = uv / size + 0.5;

    return uv.x >= 0. && uv.x < 1. && uv.y >= 0. && uv.y < 1.;
}

/////////////
/////  You may edit these functions

vec3 get_sky_color(in vec3 viewDirection)
{
  vec3 col1 = skyCol1;
  vec3 col2 = skyCol2;
  vec3 horizonColor = skyHorizonCol;

  // Could there be more colors in the sky?
  vec3 col = col1;
  col = mix(col, col2, smoothstep(0.039, 1.0, sin(0.2 * u_time) * viewDirection.x));
  col = mix(col, horizonColor, smoothstep(0.271, 0.0, viewDirection.y));

  return col;
}
vec3 get_fog_color(in vec3 worldPosition, in vec3 viewDirection)
{
  vec3 fogColor = mix(vec3(0.624), get_sky_color(viewDirection), 0.86);
  return fogColor;
}
vec3 apply_fog(in vec3 col, in vec3 worldPosition, in vec3 viewDirection, in float distance)
{
    float fogDensity = 0.065;
    
    float fogAmount = 1.0 - exp(-distance * fogDensity);
    // fogAmount = smoothstep(0.0, 6.63, distance); // Maybe fog is linear?

    return mix(col, get_fog_color(worldPosition, viewDirection), fogAmount);
}
vec3 get_cloud_layer_color(in vec3 col, in vec3 worldPosition, in vec3 viewDirection)
{
  vec2 tuv = worldPosition.xz * 0.055;
  vec3 texCol = texture(u_tex_star, tuv).rgb;
  
  float a = texCol.r;
  a = 1.0 - smoothstep(0.336, 0.0, a);
  // a = smoothstep(0.309, 1.5408, a);
  // a = a * a * a; // Maybe the clouds are sharper?
  
  vec3 cloudCol = vec3(1.0);
  
  // return col += texCol.rgb * a; // Maybe the clouds are additive?
  return mix(col, texCol.rgb, a );
}
vec3 get_ground_color(vec3 worldPosition, vec3 viewDirection)
{
  vec2 tuv = worldPosition.xz * 1.98528;
  vec3 groundTex = texture(u_tex_floor, tuv).rgb;
  

  vec3 col = groundTex;
  col = mix(col, grassCol, smoothstep(0.0, 0.301, 1. - groundTex));
  col = mix(col, vec3(0.0, 0.808, 0.519), smoothstep(0.344, 0.886, 1. - groundTex));
  col = mix(col, vec3(1.), smoothstep(0.423, 1.0, groundTex));

  // Mix
  col = col * ( 4.14 * skyCol1) * vec3(0.93, 0.869, 0.939);

  // Darken
  col = col * 0.668;

  return col;
}
//////

///////
//
//  Our dithering function
//
///////
vec4 texture_exact(in sampler2D tex) { return texture(tex, gl_FragCoord.xy / vec2(textureSize(tex, 0) * 1)); }

vec3 dither(in vec2 uv, in vec3 col, sampler2D ditherSampler, float shades, float values)
{
  // We read from our pre-baked dithering texture
  // but this could also be a math function
  float dither = texture_exact(ditherSampler).r;

  // We limit the shades in the incoming color
  // and add our dithering to break it up
  
  // vec3 colhsv = rgb2hsv(col);
  // colhsv.z = floor(colhsv.z * values + dither) / values;
  // // colhsv.x = floor(colhsv.x * shades + dither) / shades;
  // col = hsv2rgb(colhsv);

  
  col = floor(col * shades + dither) / shades;

  // Return the processed color
  return col;
}

///////
///
///  Camera functions
///

mat2 rotate2d(float turns)
{
  float angle = turns * TAU;
  float c = cos(angle);
  float s = sin(angle);

  return mat2(c, s, -s, c);
}

void get_camera_rays(
  vec3 eyePosition,
  float yaw, float pitch, float roll, float fov,
  out vec3 ro, out vec3 rd
  )
{
  vec2 p = gl_FragCoord.xy / u_resolution * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float zoom = 1.0 / tan(radians(fov) * 0.5);

  ro = eyePosition;

  // Start facing forward
  rd = normalize(vec3(p, -zoom));

  // Roll: tilt the camera
  rd.xy = rotate2d(roll) * rd.xy;

  // Pitch: look up/down
  rd.yz = rotate2d(pitch) * rd.yz;

  // Yaw: look left/right
  rd.xz = rotate2d(yaw) * rd.xz;
}

vec3 get_3d_position(in vec3 ro, in vec3 rd, in float travel)
{
  return ro + rd * travel;
}
//
/////

/////
//
//  Ray casting functions
// 
bool hit_plane(
  in vec3 ro,
  in vec3 rd,
  float height,
  out float travel,
  out vec3 p
) {
  travel = (height - ro.y) / rd.y;
  p = get_3d_position(ro, rd, travel);
  return travel > 0.0;
}
//
////

////
// https://iquilezles.org/articles/distfunctions2d/
float sdRoundedBox(vec2 p, vec2 halfSize, float radius)
{
    vec2 q = abs(p) - halfSize + radius;
    return length(max(q, 0.0))
         + min(max(q.x, q.y), 0.0)
         - radius;
}
////

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 uv_aspect_corrected = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);

  vec3 col = vec3(0.);

  // Let's set up the variables we'll use later
  vec3 p;
  vec3 ro, rd;
  float travel;

  // Let's set up our camera, where is our 'eye' in 3D space?
  vec3 eyePosition = vec3(0.0, 0.102, 0.0);
  eyePosition.x += u_time * .1; // Let's move our eye over time

  // Let's set up our camera properties
  float yaw = 0.0;
  float pitch = 0.056;
  float roll = 0.;
  float fov = 100.;

  // Our camera ray calculations are in this function.
  //  we won't focus on this for this class, but feel free to
  //  poke around
  get_camera_rays(
    eyePosition,
    yaw, pitch, roll, fov,
    ro, rd // This function assigns ro and rd
  );

  // Compose the scene:

  // Sky
  col = get_sky_color(rd);

  // Ground
  float floorHeight = 0.0;
  if (hit_plane(ro, rd, floorHeight, travel, p))
  {
    col = get_ground_color(p, rd);
    col = apply_fog(col, p, rd, travel);
  }

  // Northern Light
  float cloudTop = 3.130376;
  float cloudBottom = 0.973546;
  float cloud_num = 50.0;
  vec3 cloud_col = vec3(0.);


  for (float i = 0.; i < cloud_num; i += 1.){
    if (hit_plane(ro, rd, mix(cloudTop, cloudBottom, i / cloud_num), travel, p))
    {
      cloud_col += 0.257 * (i / cloud_num) * get_cloud_layer_color(col, p, rd);
      cloud_col = apply_fog(cloud_col, p, rd, travel);
    }
  }

  col += cloud_col;

  // // Clouds 2
  // cloudHeight = 0.79;
  // if (hit_plane(ro, rd, cloudHeight, travel, p))
  // {
  //   col = get_cloud_layer_color(col, p, rd);
  //   col = apply_fog(col, p, rd, travel);
  // }


  // Add a vertical plane

  // vec3 mountainCenter = vec3(-2.8, -10.8416, -1000);
  // vec2 mountainSize = vec2(300000.0, 72.0);
  // float mountainYaw = 0.300 * PI / 2.;
  // float mountainTravel;
  // vec3 mountainp;
  // vec2 mountainuv;

  // if (
  //   hit_vertical_plane(ro, rd,
  //                 mountainCenter, mountainSize, mountainYaw,
  //                 mountainTravel, mountainp, mountainuv )
  // ) {
  //   col = mix(col, 
  //             texture(u_tex_mountain, vec2(mountainuv.x * mountainSize.x / 100., mountainuv.y)).rgb,
  //             texture(u_tex_mountain_alpha, vec2(mountainuv.x * mountainSize.x / 100., mountainuv.y)).r
  //   );
  // }


// bool hit_vertical_plane(
//     vec3 ro,
//     vec3 rd,
//     vec3 center,
//     vec2 size,
//     float yawTurns,
//     out float travel,
//     out vec3 p,
//     out vec2 uv
// )


  /////// POST PROCESSING

  // Apply a glass frame
  float glass_frame = texture_exact(u_tex_windowglass).r;
  col = col + smoothstep(0.2 * sin(0.5 * u_time + 3.) + 0.2, 0.948, glass_frame);

  // Frame
  vec3 colFrame = texture(u_tex_windowframe, uv_aspect_corrected).rgb - texture(u_tex_clouds, uv_aspect_corrected).rgb * 0.292 + vec3(0.703, 0.729, 0.851) * 0.082;
  float d = sdRoundedBox(uv_aspect_corrected, vec2(0.432), 0.309);
  float mask = smoothstep(-.005, .005, d);
  col = mix(col, colFrame, mask);
  // Let's reuse the "rounded box distance" for a bit of lighting on the frame
  col = mix(col, vec3(1.2), (1.0 - smoothstep(-0.017, 0.017, d)) * mask * mask);
  col = mix(col, vec3(1.2), (-0.172 - -2.198 * texture(u_tex_windowglass, uv_aspect_corrected).b * smoothstep(0.082 * sin(0.5 * u_time) + 0.091 , 0.0, d)) * mask * mask);
  col = mix(col, col + -1.48896 * d, mask);
  col = mix(col, col + 0.5 * texture(u_tex_clouds, uv_aspect_corrected * 2.).r * smoothstep(0.02 * sin(0.5 * u_time + 3.) - 0.021, 0., d), (1. - mask));

  // Tonemap, we control the exposure here
  col = tanh(col * 1.0);

  // Vignette
  col *= smoothstep( 0.0 , 0.75, 1.0 - length(uv_aspect_corrected));

  // Color limiting and dithering
  float colors = 8.0;
  float values = 4.;
  col = dither(uv, col, u_tex_dither, colors, values);

  // col = vec3(d + 0.65);


  fragColor = vec4(col, 1.0);
}
