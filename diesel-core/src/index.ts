import babel, { traverse } from '@babel/core';

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
