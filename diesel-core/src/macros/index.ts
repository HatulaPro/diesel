export type Macro<Output> = (input: TemplateStringsArray) => Output;

export function $createMacro<Output = any>(transform: (tokens: string[]) => Output): Macro<Output> {
	throw new Error('Should be removed during build');
}
