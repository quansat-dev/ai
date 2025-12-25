import child_process from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import externalLink from '@svelte-put/preprocess-external-link';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();

/** @type {import('@sveltejs/kit').Config} */
export default {
	compilerOptions: {
		experimental: {
			async: true,
		},
	},
	kit: {
		adapter: adapter({
			config: path.join(__dirname, 'wrangler.json'),
		}),
		alias: {
			$routes: path.resolve(__dirname, 'src/routes'),
			$data: path.resolve(__dirname, 'src/data'),
		},
		env: {
			publicPrefix: 'VITE_PUBLIC_',
			privatePrefix: 'VITE_PRIVATE_',
		},
		experimental: {
			remoteFunctions: true,
		},
		version: {
			name: `#${commitHash}@${Date.now()}`,
			// pollInterval: 10_000, // every 10 seconds
		},
	},
	preprocess: [
		externalLink({
			hosts: ['www.sveltevietnam.dev', 'sveltevietnam.dev'],
			attributes: {
				target: '_blank',
				rel: 'noopener noreferrer external',
			},
		}),
		vitePreprocess(),
	],
	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'alt-shift',
			holdMode: true,
			showToggleButton: 'always',
			toggleButtonPos: 'bottom-left',
		},
	},
};
