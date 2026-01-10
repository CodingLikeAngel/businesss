import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Minimal server-side `window` shim to avoid ReferenceError during prerender.
if (typeof (globalThis as any).window === 'undefined') {
	(globalThis as any).window = {
		innerWidth: 1024,
		innerHeight: 768,
		scrollX: 0,
		scrollY: 0,
		addEventListener: () => {},
		removeEventListener: () => {},
		requestAnimationFrame: (cb: Function) => setTimeout(cb as any, 0),
		cancelAnimationFrame: (id: any) => clearTimeout(id),
		navigator: { userAgent: 'server' },
	};
}

if (typeof (globalThis as any).document === 'undefined') {
	(globalThis as any).document = {
		createElement: (tag: string) => ({
			style: {},
			getContext: (_: string) => null,
			appendChild: () => {},
			setAttribute: () => {},
			classList: { add: () => {}, remove: () => {} },
			querySelector: () => null,
		}),
		getElementById: () => null,
		body: { appendChild: () => {} },
		addEventListener: () => {},
		removeEventListener: () => {},
	};
}

// Minimal Hammer.js mock for server to avoid runtime errors during prerender.
if (typeof (globalThis as any).Hammer === 'undefined') {
	(globalThis as any).Hammer = class {
		constructor() {}
		on() {}
		destroy() {}
	};
}
const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;
