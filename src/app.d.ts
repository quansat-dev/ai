declare global {
	type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

