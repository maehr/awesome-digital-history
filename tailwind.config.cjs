/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#d11937',
					secondary: '#afafaf',
					accent: '#37CDBE',
					neutral: '#010000',
					'base-100': '#F0F0F0',
					info: '#63c8c8',
					success: '#95b96e',
					warning: '#d7b95a',
					error: '#dc878c'
				}
			}
		]
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")]
};
