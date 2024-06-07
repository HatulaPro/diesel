import { Plugin, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Weird import for it to update in dev mode
import { POC } from '../diesel-core/dist/index.mjs';

const plugin: Plugin = {
	name: 'Diesel Vite',
	transform(code: string) {
		return code.replace('%WOW%', `${POC}`);
	},
};

export default defineConfig({
	plugins: [plugin, react()],
});
