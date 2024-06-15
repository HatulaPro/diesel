import generator from '@babel/generator';
import babel, { ParseResult, traverse, types as t, template } from '@babel/core';
const generate = generator.default;

const CREATE_MACRO_NAME = '$createMacro';

type MacroFunc<Output> = (tokens: string[]) => Output;

export type Macro<Output = any> = {
	name: string;
	func: MacroFunc<Output>;
};

export interface Runner {
	run<Output>(func: () => Output): Promise<Output>;
	toFunction(code: string, options: { tokensParamName: string | null }): () => any;
}

export class Compiler {
	private runner: Runner;

	constructor(runner: Runner) {
		this.runner = runner;
	}

	transform(code: string) {
		const parsed = babel.parse(code);
		if (!parsed) throw new Error('can not transform');

		const macros = this.getMacros(parsed);
		const getMacroByName = (name: string): Macro | undefined => {
			return macros.find((macro) => name === macro.name);
		};

		traverse(parsed, {
			TaggedTemplateExpression(path) {
				if (t.isIdentifier(path.node.tag)) {
					const macro = getMacroByName(path.node.tag.name);
					if (!macro) return;
					const res = macro.func([path.node.quasi.quasis[0].value.raw]);
					path.replaceWith(t.valueToNode(res));
				}
			},
		});

		const fromAST = babel.transformFromAstSync(parsed);
		if (!fromAST?.code) throw new Error('can not transform');

		return fromAST.code;
	}

	private getMacros(parsed: ParseResult): Macro[] {
		const runner = this.runner;
		const macros: Macro[] = [];

		traverse(parsed, {
			VariableDeclarator(path) {
				const initValue = path.node.init;
				if (!t.isCallExpression(initValue)) return;
				if (!t.isIdentifier(initValue.callee) || initValue.callee.name !== CREATE_MACRO_NAME) return;

				if (!t.isIdentifier(path.node.id)) throw new Error(`The ${CREATE_MACRO_NAME} function must be assigned to an identifier.`);
				if (initValue.arguments.length !== 1) throw new Error(`The ${CREATE_MACRO_NAME} function expects 1 argument.`);
				if (!t.isArrowFunctionExpression(initValue.arguments[0]) && !t.isFunctionExpression(initValue.arguments[0]))
					throw new Error(`The ${CREATE_MACRO_NAME} function expects function expression.`);

				const functionExpression: t.ArrowFunctionExpression | t.FunctionExpression = initValue.arguments[0];
				let tokensParamName: string | null = null;
				if (t.isIdentifier(functionExpression.params[0])) {
					tokensParamName = functionExpression.params[0].name;
				}

				const code: string = t.isBlockStatement(functionExpression.body)
					? generate(functionExpression.body).code
					: `return ${generate(functionExpression.body).code}`;
				const name = path.node.id.name;
				if (name[0] !== '$') throw new Error(`Macros must begin with a '$'`);

				try {
					macros.push({
						func: runner.toFunction(code, { tokensParamName }),
						name,
					});
					path.remove();
				} catch (e) {
					console.error(e);
					throw new Error(`Can not create macro '$${name}'`);
				}
			},
		});

		return macros;
	}
}
