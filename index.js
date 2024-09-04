/*/ ==================================== */
/*/ ============  INDEX.JS  ============ */
/*/ ==================================== */
/*/
  0. Introduction
  1. Imports
  2. Configs
  3. Class
  4. Useage
/*/

/*/ ==================================== */
/*/ ========  0. INTRODUCTION  ========= */
/*/ ==================================== */
/*/ 
  ColorLerper is a simple module to help with color
    variation for designing UIs color shades.

  It can take a color or a list of colors and return a list of colors
    that are shades of the original color used as the base.

  The shades are based on the color's saturation and lightness.
  The class is designed to be used with the HSL color model
    to get a more natural color variation without shifting the hue.

  example: I have this color <#1e9e3c> and I want to get a list
    of colors that are shades (darker and lighter) of this color.
  
  The class will return a list of colors that are
    shades of the original color like so: 
    {
      "100": "#e1f9e7",
      "200": "#a5eeb6",
      "300": "#69e285",
      "400": "#2dd754",
      "500": "#1e9e3c",
      "600": "#188030",
      "700": "#126125",
      "800": "#0d4319",
      "900": "#07250e"
    }

  Author: @Lallethu (on GitHub) - VYB Studio
/*/

/*/ ==================================== */
/*/ ============  1. IMPORTS  ========== */
/*/ ==================================== */
const fs = require('fs');
const path = require('path');

/*/ ==================================== */
/*/ ============  2. CONFIGS  ========== */
/*/ ==================================== */
const COLORS = {
	SUCCESS: '#1e9e3c',
	INFO: '#28b6d2',
	WARN: '#9e5c1e',
	DANGER: '#9e231e',
	PRIMARY: '#2339c2',
	SECONDARY: '#ffcd35',
	GREY: '#4d5b70',
};
const FILE_PATH = path.join(__dirname, 'colors.json');
const STEPS = 9;

/*/ ==================================== */
/*/ ============  3. CLASS  ============ */
/*/ ==================================== */
class ColorLerper {
	constructor(colors = COLORS, steps = STEPS) {
		this.colors = colors;
		this.steps = steps;
	}

	/** generateShades
	 * @description Generates shades of the base color
	 * @param {string} baseColor  - HEX color
	 * @returns {Object}  - Object of shades
	 * @memberof ColorLerper
	 * @instance
	 * @public
	 */
	generateShades(baseColor) {
		const baseHSL = this.hexToHSL(baseColor);
		const lightShades = this.generateLightShades(baseHSL);
		const darkShades = this.generateDarkShades(baseHSL);
		const shades = { ...lightShades, 500: baseColor, ...darkShades };
		return shades;
	}

	/** generateLightShades
	 * @description Generates light shades of the base color
	 * @param {Object} baseHSL  - Object of HSL color
	 * @returns {Object}  - Object of light shades
	 * @private
	 * @memberof ColorLerper
	 * @instance
	 */
	generateLightShades(baseHSL) {
		const lightStepSize = (baseHSL.l - 5) / (this.steps / 2);
		const lightShades = {};
		let index = 600;
		for (let i = 1; i <= this.steps / 2; i++) {
			const lightness = baseHSL.l - lightStepSize * i;
			const shadeColor = this.hslToHex({
				h: baseHSL.h,
				s: baseHSL.s,
				l: lightness,
			});
			lightShades[index] = shadeColor;
			index += 100;
		}
		return lightShades;
	}

	/** generateDarkShades
	 * @description Generates dark shades of the base color
	 * @param {Object} baseHSL  - Object of HSL color
	 * @returns {Object}  - Object of dark shades
	 * @private
	 * @memberof ColorLerper
	 * @instance
	 */
	generateDarkShades(baseHSL) {
		const darkStepSize = (100 - baseHSL.l) / (this.steps / 2);
		const darkShades = {};
		let index = 400;
		for (let i = 1; i <= this.steps / 2; i++) {
			const lightness = baseHSL.l + darkStepSize * i;
			const shadeColor = this.hslToHex({
				h: baseHSL.h,
				s: baseHSL.s,
				l: lightness,
			});
			darkShades[index] = shadeColor;
			index -= 100;
		}
		return darkShades;
	}

	/** hexToHSL
	 * @description Converts HEX color to HSL color
	 * @param {string} hex  - HEX color
	 * @returns {Object} - Object of HSL color
	 */
	hexToHSL(hex) {
		let r = 0, g = 0, b = 0;
		if (hex.length === 4) {
			r = parseInt(hex[1] + hex[1], 16);
			g = parseInt(hex[2] + hex[2], 16);
			b = parseInt(hex[3] + hex[3], 16);
		} else if (hex.length === 7) {
			r = parseInt(hex[1] + hex[2], 16);
			g = parseInt(hex[3] + hex[4], 16);
			b = parseInt(hex[5] + hex[6], 16);
		}

		(r /= 255), (g /= 255), (b /= 255);
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		let h,
			s,
			l = (max + min) / 2;

		if (max === min) {
			h = s = 0;
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		return { h: h * 360, s: s * 100, l: l * 100 };
	}

	/** hslToHex
	 * @description Converts HSL color to HEX color
	 * @param {Object} hsl  - Object of HSL color
	 * @returns {string}  - HEX color
	 */
	hslToHex(hsl) {
		let { h, s, l } = hsl;
		h /= 360;
		s /= 100;
		l /= 100;
		let r, g, b;

		if (s === 0) {
			r = g = b = l;
		} else {
			// local function to convert the hue to rgb
			const hue2rgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		// local function to convert to hex string
		const toHex = (x) => {
			const hex = Math.round(x * 255).toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		};

		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}

	/**  exportShades
	 * @description Exports the shades to a JSON file
	 * @param {Object} shades  - Object of shades
	 * @param {string} filePath  - Path to save the shades
	 */
	exportShades(shades, filePath = FILE_PATH) {
		if (!fs.existsSync('shades')) {
			fs.mkdirSync('shades');
		}

		const shadesJSON = JSON.stringify(shades, null, 2);
		fs.writeFileSync(filePath, shadesJSON);
	}
}

/*/ ==================================== */
/*/ ============  4. USEAGE  =========== */
/*/ ==================================== */
const colorLerper = new ColorLerper();

for (const color in COLORS) {
	const shades = colorLerper.generateShades(COLORS[color]);
	colorLerper.exportShades(
		shades,
		path.join('shades', `${color}Shades.json`)
	);
}
