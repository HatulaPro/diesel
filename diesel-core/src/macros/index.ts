export namespace Diesel {
	export type CreateMacroParams<Output> = {
		transform(tokens: string[]): Output;
	};

	export type Macro<Output> = (input: TemplateStringsArray) => Output;

	export function $createMacro<Output = any>(params: CreateMacroParams<Output>): Macro<Output> {
		return () => console.log('This is what it is') as Output;
	}

	export const $num = $createMacro<number>({
		transform(tokens: string[]) {
			if (tokens.length < 1) throw new Error('Can not do that');

			return parseInt(tokens[0]);
		},
	});
}
