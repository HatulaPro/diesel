import { Compiler } from './compiler';
import { SimpleRunner } from './runner';

export namespace Diesel {
	export function transform(code: string): string {
		return new Compiler(new SimpleRunner()).transform(code);
	}
}
