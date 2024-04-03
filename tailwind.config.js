/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"iphone-recieve": "#e5e5ea",
				"iphone-sent": "#0b93f6;",
				customColor: "#F3F3F3",
			},
		},
	},
	plugins: [],
};
