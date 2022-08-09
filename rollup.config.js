import { terser } from "rollup-plugin-terser";

export default {
	input: "src/js/main.js",
	output: {
		file: "dist/main.min.js",
		format: "cjs",
		plugins: [terser()],
	},
};
