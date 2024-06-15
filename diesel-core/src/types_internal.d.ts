// Have to do this because babel and TS are stupid
declare module '@babel/generator' {
	export default {
		default: (ast: t.Node, opts?: GeneratorOptions, code?: string | { [filename: string]: string }) => GeneratorResult,
	};
}
