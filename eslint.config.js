import eslintConfigPrettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';

const sharedGlobals = {
	URL: 'readonly',
	console: 'readonly',
	fetch: 'readonly',
	setTimeout: 'readonly'
};

export default [
	{
		ignores: [
			'.DS_Store',
			'.env',
			'.env.*',
			'.svelte-kit/**',
			'build/**',
			'dist/**',
			'node_modules/**',
			'package/**',
			'package-lock.json',
			'pnpm-lock.yaml',
			'yarn.lock',
			'!.env.example'
		]
	},
	{
		files: ['**/*.cjs'],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'commonjs',
			globals: {
				...sharedGlobals,
				module: 'readonly',
				process: 'readonly',
				require: 'readonly'
			}
		}
	},
	{
		files: ['**/*.{js,svelte}'],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: sharedGlobals
		}
	},
	...svelte.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		rules: {
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/require-each-key': 'off'
		}
	},
	eslintConfigPrettier
];
