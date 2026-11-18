#version 300 es
precision highp float;

struct KeyboardAction {
    float pressed;
    float timeSincePressed;
    float timeSinceReleased;
    float pressedThisFrame;
    float releasedThisFrame;
};
struct MouseAction {
    float pressed;
    float timeSincePressed;
    float timeSinceReleased;
    float pressedThisFrame;
    float releasedThisFrame;
    vec2 pressPosition;
    vec2 releasePosition;
    float cancelled;
};
// Per-key state and timing; index with KEY_* constants or KEY_ANY.
uniform KeyboardAction u_keyboard[122];
// Per-button state, timing, and positions; index with MOUSE_* constants or MOUSE_ANY.
uniform MouseAction u_mouseButtons[6];
const int KEY_COUNT = 121;
const int KEY_ANY = KEY_COUNT;
const int MOUSE_COUNT = 5;
const int MOUSE_ANY = MOUSE_COUNT;
const int KEY_A = 0;
const int KEY_B = 1;
const int KEY_C = 2;
const int KEY_D = 3;
const int KEY_E = 4;
const int KEY_F = 5;
const int KEY_G = 6;
const int KEY_H = 7;
const int KEY_I = 8;
const int KEY_J = 9;
const int KEY_K = 10;
const int KEY_L = 11;
const int KEY_M = 12;
const int KEY_N = 13;
const int KEY_O = 14;
const int KEY_P = 15;
const int KEY_Q = 16;
const int KEY_R = 17;
const int KEY_S = 18;
const int KEY_T = 19;
const int KEY_U = 20;
const int KEY_V = 21;
const int KEY_W = 22;
const int KEY_X = 23;
const int KEY_Y = 24;
const int KEY_Z = 25;
const int KEY_0 = 26;
const int KEY_1 = 27;
const int KEY_2 = 28;
const int KEY_3 = 29;
const int KEY_4 = 30;
const int KEY_5 = 31;
const int KEY_6 = 32;
const int KEY_7 = 33;
const int KEY_8 = 34;
const int KEY_9 = 35;
const int KEY_SPACE = 36;
const int KEY_ENTER = 37;
const int KEY_ESCAPE = 38;
const int KEY_TAB = 39;
const int KEY_BACKSPACE = 40;
const int KEY_DELETE = 41;
const int KEY_INSERT = 42;
const int KEY_HOME = 43;
const int KEY_END = 44;
const int KEY_PAGE_UP = 45;
const int KEY_PAGE_DOWN = 46;
const int KEY_ARROW_LEFT = 47;
const int KEY_ARROW_RIGHT = 48;
const int KEY_ARROW_UP = 49;
const int KEY_ARROW_DOWN = 50;
const int KEY_SHIFT_LEFT = 51;
const int KEY_SHIFT_RIGHT = 52;
const int KEY_CONTROL_LEFT = 53;
const int KEY_CONTROL_RIGHT = 54;
const int KEY_ALT_LEFT = 55;
const int KEY_ALT_RIGHT = 56;
const int KEY_META_LEFT = 57;
const int KEY_META_RIGHT = 58;
const int KEY_BACKQUOTE = 59;
const int KEY_MINUS = 60;
const int KEY_EQUAL = 61;
const int KEY_BRACKET_LEFT = 62;
const int KEY_BRACKET_RIGHT = 63;
const int KEY_BACKSLASH = 64;
const int KEY_SEMICOLON = 65;
const int KEY_QUOTE = 66;
const int KEY_COMMA = 67;
const int KEY_PERIOD = 68;
const int KEY_SLASH = 69;
const int KEY_CAPS_LOCK = 70;
const int KEY_NUM_LOCK = 71;
const int KEY_SCROLL_LOCK = 72;
const int KEY_PRINT_SCREEN = 73;
const int KEY_PAUSE = 74;
const int KEY_CONTEXT_MENU = 75;
const int KEY_INTL_BACKSLASH = 76;
const int KEY_INTL_RO = 77;
const int KEY_INTL_YEN = 78;
const int KEY_F1 = 79;
const int KEY_F2 = 80;
const int KEY_F3 = 81;
const int KEY_F4 = 82;
const int KEY_F5 = 83;
const int KEY_F6 = 84;
const int KEY_F7 = 85;
const int KEY_F8 = 86;
const int KEY_F9 = 87;
const int KEY_F10 = 88;
const int KEY_F11 = 89;
const int KEY_F12 = 90;
const int KEY_F13 = 91;
const int KEY_F14 = 92;
const int KEY_F15 = 93;
const int KEY_F16 = 94;
const int KEY_F17 = 95;
const int KEY_F18 = 96;
const int KEY_F19 = 97;
const int KEY_F20 = 98;
const int KEY_F21 = 99;
const int KEY_F22 = 100;
const int KEY_F23 = 101;
const int KEY_F24 = 102;
const int KEY_NUMPAD_0 = 103;
const int KEY_NUMPAD_1 = 104;
const int KEY_NUMPAD_2 = 105;
const int KEY_NUMPAD_3 = 106;
const int KEY_NUMPAD_4 = 107;
const int KEY_NUMPAD_5 = 108;
const int KEY_NUMPAD_6 = 109;
const int KEY_NUMPAD_7 = 110;
const int KEY_NUMPAD_8 = 111;
const int KEY_NUMPAD_9 = 112;
const int KEY_NUMPAD_ADD = 113;
const int KEY_NUMPAD_SUBTRACT = 114;
const int KEY_NUMPAD_MULTIPLY = 115;
const int KEY_NUMPAD_DIVIDE = 116;
const int KEY_NUMPAD_DECIMAL = 117;
const int KEY_NUMPAD_ENTER = 118;
const int KEY_NUMPAD_EQUAL = 119;
const int KEY_NUMPAD_COMMA = 120;
const int MOUSE_LEFT = 0;
const int MOUSE_MIDDLE = 1;
const int MOUSE_RIGHT = 2;
const int MOUSE_BACK = 3;
const int MOUSE_FORWARD = 4;

// Shader time in seconds.
uniform float u_time;
uniform float u_duration;
// Current pass width and height in pixels.
uniform vec2 u_resolution;
// Pointer position normalized from 0 to 1, measured from the bottom-left.
uniform vec2 u_mouse;
// 1 while a pointer button is held; otherwise 0.
uniform float u_mouseButton;
// Cumulative pointer drag in aspect-correct sketch coordinates.
uniform vec2 u_drag;
// Cumulative horizontal and vertical scroll.
uniform vec2 u_scroll;
// Zoom toward the pointer: offset in xy and sampling scale in z.
uniform vec3 u_zoom_towards_mouse;
// Current pass width divided by its height.
uniform float u_aspect;
// Current pass resolution scale; 1 is full size.
uniform float u_pixelScale;
// Built-in sky cubemap; sample with a 3D direction.
uniform samplerCube u_sky1;
// Reserved timeline position in seconds; not currently supplied by the app.
uniform float u_timeline_time; // no-edit
// Reserved timeline duration in seconds; not currently supplied by the app.
uniform float u_timeline_duration; // no-edit

in vec2 vUV;

// Color texture rendered by the first pass, available in the second pass.
uniform sampler2D u_pass_1;
// Data texture written to fragData by the first pass, available in the second pass.
uniform sampler2D u_pass_1_data;
// Previous rendered frame, available when frame feedback is enabled.
uniform sampler2D u_previous_frame;

#ifdef USE_SECOND_PASS
layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec4 fragData;
#else
out vec4 fragColor;
#endif

#define PI         3.141592653589793
#define TAU        6.28318530718

#define SURF_DIST  0.001
#define EPSILON    0.0001


float saturate(float v) {
    return clamp(v, 0.0, 1.0);
}

float unpackRGBAToDepth(vec4 value) {
    const vec4 bitShift = vec4(
            1.0 / (256.0 * 256.0 * 256.0),
            1.0 / (256.0 * 256.0),
            1.0 / 256.0,
            1.0
        );
    return dot(value, bitShift);
}

vec3 blend_normal(vec3 base, vec3 over, float alpha) {
    return mix(base, over, clamp(alpha, 0.0, 1.0));
}

vec3 blend_add(vec3 base, vec3 over, float alpha) {
    return base + over * clamp(alpha, 0.0, 1.0);
}

vec3 blend_screen(vec3 base, vec3 over, float alpha) {
    vec3 o = over * clamp(alpha, 0.0, 1.0);
    return 1.0 - (1.0 - base) * (1.0 - o);
}

vec3 blend_softlight(vec3 base, vec3 over, float alpha) {
    // Lightweight soft-light approximation for artistic mixing.
    vec3 o = mix(vec3(0.5), over, clamp(alpha, 0.0, 1.0));
    return mix(
        sqrt(max(base, 0.0)) * (2.0 * o - 1.0) + 2.0 * base * (1.0 - o),
        base - (1.0 - 2.0 * o) * base * (1.0 - base),
        step(0.5, o)
    );
}

vec3 blend(float mode, vec3 col_1, vec3 col_2, float strength) {
    float m = floor(mode + 0.5);

    if (m < 0.5) {
        // 0 = normal over
        return blend_normal(col_1, col_2, strength);
    } else if (m < 1.5) {
        // 1 = additive
        return blend_add(col_1, col_2, strength);
    } else if (m < 2.5) {
        // 2 = screen
        return blend_screen(col_1, col_2, strength);
    } else {
        // 3 = soft light
        return blend_softlight(col_1, col_2, strength);
    }
}


void mix_passes(vec3 col_1, float depth_1, vec4 col_2, float depth_2, out vec3 col, out float depth, float blendMode)
{
    // Small epsilon keeps 8-bit depth quantisation and filtering from
    // producing flickery edge swaps where the two depths are effectively equal.
    bool pass2_in_front = depth_2 > 0.005 && depth_2 + 0.002 < depth_1;

    if (blendMode < -0.5) {
        // No blending — original depth-test behavior
        col = pass2_in_front ? col_2.rgb : col_1;
    } else if (pass2_in_front) {
        // Blend geo over raymarch only when geo is actually in front.
        // geoCol is rendered with NormalBlending over (0,0,0,0), so its RGB
        // is pre-multiplied by its alpha. Un-premultiply for correct blending.
        float a = clamp(col_2.a, 0.0, 1.0);
        vec3 unPre = a > 0.001 ? col_2.rgb / a : vec3(0.0);
        col = blend(blendMode, col_1, unPre, a);
    } else {
        // Geo is behind — keep raymarch color unmodified.
        col = col_1;
    }

    depth = pass2_in_front ? depth_2 : depth_1;
}

// Shadertoy
//
#ifndef iResolution
// Shadertoy's is a vec3 whose .z is the pixel aspect, which is always 1 here.
#define iResolution vec3(u_resolution, 1.0)
#endif

#ifndef iTime
#define iTime u_time
#endif

#ifndef iTimeDelta
// No per-frame delta uniform exists; shaders that use this are almost always
// just scaling something small by it, and a fixed step is closer than zero.
#define iTimeDelta (1.0 / 60.0)
#endif

#ifndef iFrame
#define iFrame int(u_time * 60.0)
#endif

#ifndef iFrameRate
#define iFrameRate 60.0
#endif

#ifndef iMouse
// u_mouse is 0..1 from the bottom-left; Shadertoy's is in pixels. The zw half
// is the click position, which Shadertoy leaves negative while the button is
// up — a convention shaders test with `iMouse.z > 0.0`.
#define iMouse vec4(u_mouse * u_resolution, \
                    (u_mouseButton > 0.5 ? 1.0 : -1.0) * u_mouse * u_resolution)
#endif

#ifndef iDate
// Year, month (0-based), day, seconds-since-midnight. Static: nothing here
// tracks wall-clock time, and shaders use it as a seed far more often than as
// a clock.
#define iDate vec4(2026.0, 0.0, 1.0, u_time)
#endif

#ifndef iSampleRate
#define iSampleRate 44100.0
#endif

uniform sampler2D u_audio_all;

struct AudioHelper {
    float volume;
    float volumeSmooth;
    float peak;
    float bass;
    float mids;
    float treble;
    float brightness;
    float isActive;
    float bpm;
    float beat;
    float beatPhase;
    float beatPulse;
    float duration;
    float currentTime;
    float volumeRaw;
};

AudioHelper read_audio_data(sampler2D audio_sampler) {
    vec3 levels = texelFetch(audio_sampler, ivec2(0, 0), 0).gba;
    vec3 bands = texelFetch(audio_sampler, ivec2(1, 0), 0).gba;
    vec3 state = texelFetch(audio_sampler, ivec2(2, 0), 0).gba;
    vec3 timing = texelFetch(audio_sampler, ivec2(3, 0), 0).gba;
    vec3 playback = texelFetch(audio_sampler, ivec2(4, 0), 0).gba;
    return AudioHelper(levels.x, levels.y, levels.z, bands.x, bands.y, bands.z,
        state.x, state.y, state.z, timing.x, timing.y, timing.z, playback.x, playback.y, playback.z);
}

float audio_spectrum(sampler2D audio_sampler, float position) {
    float index = clamp(position, 0.0, 1.0) * 511.0;
    int left = int(floor(index));
    float a = texelFetch(audio_sampler, ivec2(left, 0), 0).r;
    float b = texelFetch(audio_sampler, ivec2(min(left + 1, 511), 0), 0).r;
    return mix(a, b, fract(index));
}

float audio_waveform(sampler2D audio_sampler, float position) {
    float index = clamp(position, 0.0, 1.0) * 511.0;
    int left = int(floor(index));
    float a = texelFetch(audio_sampler, ivec2(left, 1), 0).r;
    float b = texelFetch(audio_sampler, ivec2(min(left + 1, 511), 1), 0).r;
    return mix(a, b, fract(index)) * 2.0 - 1.0;
}
