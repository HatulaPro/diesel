import { Plugin, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Weird import for it to update in dev mode
import { Diesel } from '../diesel-core/dist/index.mjs';

const plugin = (): Plugin => {
	return {
		name: 'Diesel Vite',
		transform(code: string, id: string) {
			if (id.includes('node_modules') || (!id.endsWith('.js') && !id.endsWith('.ts') && !id.endsWith('tsx') && !id.endsWith('jsx'))) return null;

			return Diesel.transform(code);
		},
	};
};

export default defineConfig({
	plugins: [plugin(), react()],
});
