# ColorLerper

![ColorLerper Logo](color-lerper-icon.png "Nice lil logo")

## Description

This is a simple tool to interpolate a color for its light and dark variants. It is useful for creating a color palette for a design system.

The colors will be set in a folder (shades by default, but you can change it in the config) with the following structure:

```json
DANGERShades.json
{
  "100": "#f9e2e1",
  "200": "#eea8a5",
  "300": "#e26d69",
  "400": "#d7332d",
  "500": "#9e231e",
  "600": "#801c18",
  "700": "#611612",
  "800": "#430f0d",
  "900": "#250807"
  ... (if more steps are defined in the config)
}
```

## Installation

```bash
npm i
```

## Usage

```bash
npm run start
```

### Configuration

Make sure the folder exists in the root of the project. You can change the folder name in the `index.js` file.

You can configure the color and the number of steps for the interpolation directly in the `index.js` file.

```javascript
const COLORS = {
  DANGER: '#9e231e',
  secondary: '#00FF00',
  tertiary: '#0000FF',
};
const STEPS = 5;
```

## License

[MIT License](LICENSE)
