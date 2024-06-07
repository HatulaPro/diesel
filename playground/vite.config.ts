import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	optimizeDeps: {
		// We don't want vite to optimize it, since it would ignore updates in dev mode
		exclude: ['diesel-core'],
	},
	plugins: [react()],
});
