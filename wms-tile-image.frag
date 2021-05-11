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

float colourToNumber(float red, float green, float blue) {
  return red * 255. * pow(2., 16.) + green * 255. * pow(2., 8.) + blue * 255.;
  // return (red << 16.0) + (green << 8.0) + blue;
}

void main(){
  float globalMin = 0.810405;
  float globalMax = 115.151;
  float customMin = 20.;
  float customMax = 80.;
  float range = globalMax - globalMin;
  float customRange = customMax - customMin;

  vec2 coord = gl_FragCoord.xy / u_resolution;
  vec4 image = texture2D(u_text0, coord);


	// Color ramp. The alpha value represents the pixel value for that RGB stop
  vec4 colours[11];
	// colours[0] = vec4(convertRGB(vec3(0., 0., 0.)),  ((customRange / 10. * 0. +  (customMin - globalMin)) / range));
	// colours[1] = vec4(convertRGB(vec3(25., 153., 25.)),  ((customRange / 10. * 1. +  (customMin - globalMin)) / range));
	// colours[2] = vec4(convertRGB(vec3(51., 51., 51.)),  ((customRange / 10. * 2. +  (customMin - globalMin)) / range));
	// colours[3] = vec4(convertRGB(vec3(76., 204., 76.)),  ((customRange / 10. * 3. +  (customMin - globalMin)) / range));
	// colours[4] = vec4(convertRGB(vec3(102., 102., 102.)),  ((customRange / 10. * 4. +  (customMin - globalMin)) / range));
	// colours[5] = vec4(convertRGB(vec3(127., 255., 127.)),  ((customRange / 10. * 5. +  (customMin - globalMin)) / range));
	// colours[6] = vec4(convertRGB(vec3(153., 153., 153.)),  ((customRange / 10. * 6. +  (customMin - globalMin)) / range));
	// colours[7] = vec4(convertRGB(vec3(179., 50., 179.)),  ((customRange / 10. * 7. +  (customMin - globalMin)) / range));
	// colours[8] = vec4(convertRGB(vec3(204., 204., 204.)),  ((customRange / 10. * 8. +  (customMin - globalMin)) / range));
	// colours[9] = vec4(convertRGB(vec3(230., 101., 230.)),  ((customRange / 10. * 9. +  (customMin - globalMin)) / range));
	// colours[10] = vec4(convertRGB(vec3(255., 255., 255.)),  ((customRange / 10. * 10. +  (customMin - globalMin)) / range));	
  
  colours[0] = vec4(convertRGB(vec3(71.,  73. , 163.)),  ((customRange / 10. * 0. +  (customMin - globalMin)) / range));
	colours[1] = vec4(convertRGB(vec3(76.,  76. , 202.)),  ((customRange / 10. * 1. +  (customMin - globalMin)) / range));
	colours[2] = vec4(convertRGB(vec3(76.,  93. , 253.)),  ((customRange / 10. * 2. +  (customMin - globalMin)) / range));
	colours[3] = vec4(convertRGB(vec3(75.,  164., 253.)),  ((customRange / 10. * 3. +  (customMin - globalMin)) / range));
	colours[4] = vec4(convertRGB(vec3(77.,  238., 245.)),  ((customRange / 10. * 4. +  (customMin - globalMin)) / range));
	colours[5] = vec4(convertRGB(vec3(132., 250., 184.)),  ((customRange / 10. * 5. +  (customMin - globalMin)) / range));
	colours[6] = vec4(convertRGB(vec3(196., 254., 128.)),  ((customRange / 10. * 6. +  (customMin - globalMin)) / range));
	colours[7] = vec4(convertRGB(vec3(249., 237., 72. )),  ((customRange / 10. * 7. +  (customMin - globalMin)) / range));
	colours[8] = vec4(convertRGB(vec3(255., 177., 75. )),  ((customRange / 10. * 8. +  (customMin - globalMin)) / range));
	colours[9] = vec4(convertRGB(vec3(251., 109., 75. )),  ((customRange / 10. * 9. +  (customMin - globalMin)) / range));
	colours[10] = vec4(convertRGB(vec3(195., 75. , 75. )), ((customRange / 10. * 10. + (customMin - globalMin)) / range));

  float totalRGB = (
   255.0 * 256.0 * 256.0 +
   255.0 * 256.0 +
	 255.0
  );


  gl_FragColor.rgb = colours[0].rgb;

  if (image.a == 0. ) {
    gl_FragColor = vec4(1., 1., 1., 0.);
  } else {
    for (int i=0; i < 10; i++) {
      // Do a smoothstep of the values between steps. If the result is > 0
      // (meaning "the height is higher than the lower bound of this step"),
      // then replace the colour with a linear blend of the step.
      // If the result is 1, this means that the real colour will be applied
      // in a later loop.

      float value = colourToNumber(image.r, image.g, image.b);
      float pct = (value - 0.) / (totalRGB - 0.);
      float v = pct * (globalMax - globalMin) + globalMin;

      gl_FragColor.rgb = mix(
        gl_FragColor.rgb,
        colours[i+1].rgb,
        // step( colours[i].a, image.r)
        smoothstep( colours[i].a, colours[i+1].a, v / range)
      );
    }
  }

  // gl_FragColor.rgb = image.rgb;
	gl_FragColor.a = 1.;
}
