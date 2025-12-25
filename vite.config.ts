import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import postcssColorScheme from 'postcss-color-scheme';
import postcssCustomMedia from 'postcss-custom-media';
import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
	define: {
		__BUILD_TIMESTAMP__: JSON.stringify(Date.now()),
	},
	optimizeDeps: {
		/**
		 * pre-bundle in advance to prevent
		 * reloading on navigation during dev
		 * @see {@link https://github.com/sveltejs/kit/issues/11793}
		 */
		include: [],
	},
	plugins: [tailwindcss(), qrcode(), sveltekit()],
	css: {
		transformer: 'postcss',
		postcss: {
			plugins: [postcssCustomMedia(), postcssColorScheme({ name: 'media' })],
		},
	},
});
