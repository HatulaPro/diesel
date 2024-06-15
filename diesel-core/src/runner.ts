import { Runner } from './compiler';

const AsyncFunction = (async () => {}).constructor as FunctionConstructor;

export class SimpleRunner implements Runner {
	run<Output>(func: () => Output): Promise<Output> {
		return new Promise<Output>(async (res, rej) => {
			try {
				const result = await func();
				res(result);
			} catch (e) {
				rej(e);
			}
		});
	}

	toFunction(code: string, options: { tokensParamName: string | null }): () => any {
		return new AsyncFunction(options.tokensParamName || 'tokens', code) as () => any;
	}
}
