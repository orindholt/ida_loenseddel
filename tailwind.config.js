/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html"],
	theme: {
		extend: {
			colors: {
				tan: "rgb(242, 242, 242)",
				blue: "rgb(15, 69, 204)",
				info: "rgb(15, 69, 204, 0.1)",
				active: "rgb(15, 69, 204, 0.3)",
				hover: "rgba(0, 0, 0, 0.15)",
			},
			fontFamily: {
				montserrat: "'Montserrat', sans-serif",
			},
		},
	},
	plugins: [],
};
