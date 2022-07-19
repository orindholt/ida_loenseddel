/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html"],
	theme: {
		extend: {
			colors: {
				tan: "rgb(242, 242, 242)",
				blue: "rgb(15, 69, 204)",
				info: "rgb(15, 69, 204, 0.05)",
				active: "rgb(15, 69, 204, 0.25)",
				hover: "rgb(15, 69, 204, 0.15)",
			},
			fontFamily: {
				montserrat: "'Montserrat', sans-serif",
			},
		},
	},
	plugins: [],
};
