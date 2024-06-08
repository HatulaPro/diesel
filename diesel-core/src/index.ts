import babel, { traverse } from '@babel/core';
export const POC = 'REPLACING';

type CreateMacroParams<Output> = {
	transform(tokens: string[]): Output;
};

type Macro<Output> = (input: TemplateStringsArray) => Output;

export function $createMacro<Output = any>(params: CreateMacroParams<Output>): Macro<Output> {
	return () => console.log('This is what it is') as Output;
}

export const $num = $createMacro<number>({
	transform(tokens: string[]) {
		if (tokens.length < 1) throw new Error('Can not do that');

		return parseInt(tokens[0]);
	},
});
export namespace Diesel {
	export function transform(code: string): string {
		const parsed = babel.parse(code);
		if (!parsed) throw new Error('can not transform');

		traverse(parsed, {
			TaggedTemplateExpression(path) {
				if (path.node.tag.type === 'Identifier' && path.node.tag.name === '$num') {
					(path.parent as any)[path.parentKey] = babel.types.numericLiteral(1234);
				}
			},
		});

		const fromAST = babel.transformFromAstSync(parsed);
		if (!fromAST?.code) throw new Error('can not transform');

		return fromAST.code;
	}
}
