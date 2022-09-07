#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

uniform sampler2D u_text0;

vec3 convertRGB(vec3 value) {
  return value / 255.;
}

void main(){
  vec2 coord = gl_FragCoord.xy / u_resolution;
  vec4 image = texture2D(u_text0, coord);

  // fake uniforms, these are uniforms when used in a WMSGLTileLayer
  float uFactor = 1.;
  float uCustomMin = 0.;
  float uCustomMax = 10.;
  float customRange = uCustomMax - uCustomMin;

	// Color ramp. The alpha value represents the elevation for that RGB colour stop.
  vec4 colours[11];
  colours[0]  = vec4(convertRGB(vec3(255., 255., 178.)),  (customRange / 10. * 0.) + uCustomMin);
  colours[1]  = vec4(convertRGB(vec3(255., 235., 144.)),  (customRange / 10. * 1.) + uCustomMin);
  colours[2]  = vec4(convertRGB(vec3(255., 215., 109.)),  (customRange / 10. * 2.) + uCustomMin);
  colours[3]  = vec4(convertRGB(vec3(254., 192.,  85)),  (customRange / 10. * 3.) + uCustomMin);
  colours[4]  = vec4(convertRGB(vec3(254., 166.,  73)),  (customRange / 10. * 4.) + uCustomMin);
  colours[5]  = vec4(convertRGB(vec3(253., 141.,  60)),  (customRange / 10. * 5.) + uCustomMin);
  colours[6]  = vec4(convertRGB(vec3(248., 108.,  48)),  (customRange / 10. * 6.) + uCustomMin);
  colours[7]  = vec4(convertRGB(vec3(243.,  75.,  37)),  (customRange / 10. * 7.) + uCustomMin);
  colours[8]  = vec4(convertRGB(vec3(230.,  47.,  33)),  (customRange / 10. * 8.) + uCustomMin);
  colours[9]  = vec4(convertRGB(vec3(210.,  23.,  35)),  (customRange / 10. * 9.) + uCustomMin);
  colours[10] = vec4(convertRGB(vec3(189.,   0.,  38)), (customRange / 10. * 10.) + uCustomMin);

  // RGB values are 0-1, multiply with 255 to get 0-255 range
  float value = (
      image.r * 255. * 256. * 256. + 
      image.g * 255. * 256. + 
      image.b * 255.
      ) * uFactor;

  // // This shows the real tile, comment everything after the next line
  // gl_FragColor.rgba = image.rgba;

	gl_FragColor.rgb = colours[0].rgb;

  if (image.a == 0. ) {
    gl_FragColor = vec4(1., 1., 1., 0.);
  } else {
    for (int i = 0; i < 10; i++) {
      // Do a smoothstep of the values between steps. If the result is > 0
      // (meaning "the value is higher than the lower bound of this step"),
      // then replace the colour with a linear blend of the step.
      // If the result is 1, this means that the real colour will be applied
      // in a later loop.

      gl_FragColor.rgb = mix(
        gl_FragColor.rgb,
        colours[i + 1].rgb,
        // step(colours[i + 1].a, value)
        smoothstep( colours[i].a, colours[i+1].a, value )
      );
    }

    gl_FragColor.a = 1.;
  }
}