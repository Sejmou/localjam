import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import DrizzleORMMigrations from '@proj-airi/unplugin-drizzle-orm-migrations/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson(), DrizzleORMMigrations()],
	optimizeDeps: {
		exclude: ['@electric-sql/pglite']
	}
});
