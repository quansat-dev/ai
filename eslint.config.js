import { fileURLToPath, URL } from 'node:url';

import { defineConfig as definePresetConfig } from '@vnphanquang/eslint-config';
import { defineConfig as defineEslintConfig } from 'eslint/config';

import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

/**
 * @param {import('@sveltejs/kit').Config} [svelteConfig]
 * @param {import('eslint').Linter.Config[]} [additionals]
 * @returns {Promise<import('eslint').Linter.Config[]>}
 */
export async function defineConfig(svelteConfig, additionals = []) {
	const presets = /** @type {import('eslint').Linter.Config[]} */ (
		await definePresetConfig({
			gitignorePath,
			...(svelteConfig ? { svelte: { config: svelteConfig } } : {}),
		})
	);
	return defineEslintConfig([
		...presets,
		...additionals,
		{
			languageOptions: {
				globals: {
					MaybePromise: 'readonly',
				},
			},
		},
	]);
}

export default defineConfig(svelteConfig);
