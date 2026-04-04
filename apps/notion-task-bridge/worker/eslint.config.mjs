import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['node_modules/**', 'dist/**', '.wrangler/**', 'src/generated/**', 'worker-configuration.d.ts'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	eslintConfigPrettier,
	{
		files: ['**/*.mjs'],
		languageOptions: {
			globals: globals.nodeBuiltin,
			ecmaVersion: 2022,
			sourceType: 'module',
		},
	},
);
