import { terser } from "rollup-plugin-terser";

export default {
	input: "src/js/script.js",
	output: {
		file: "dist/script.min.js",
		format: "cjs",
		plugins: [terser()],
	},
};
