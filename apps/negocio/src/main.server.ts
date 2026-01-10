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
		addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
			console.log(`Event listener added for event type: ${type}`);
		},
		removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
			console.log(`Event listener removed for event type: ${type}`);
		},
		requestAnimationFrame: (cb: (time: number) => void) => setTimeout(() => cb(Date.now()), 0),
		cancelAnimationFrame: (id: number) => clearTimeout(id),
		navigator: { userAgent: 'server' },
	};
}

if (typeof (globalThis as any).document === 'undefined') {
	(globalThis as any).document = {
		createElement: (tag: string) => ({
			style: {},
			getContext: (_: string) => null,
			appendChild: (child: any) => {
				(this as any).children = (this as any).children || [];
				(this as any).children.push(child);
			},
			setAttribute: (name: string, value: string) => {
				(this as any)[name] = value;
			},
			classList: { 
				add: (className: string) => {
					(this as any)[className] = true;
				}, 
				remove: (className: string) => {
					delete (this as any)[className];
				} 
			},
			querySelector: () => null,
		}),
		getElementById: () => null,
		body: { 
			appendChild: (child: any) => {
				(this as any).children = (this as any).children || [];
				(this as any).children.push(child);
			},
		},
		addEventListener: () => {},
		removeEventListener: () => {},
	};
}

// Minimal Hammer.js mock for server to avoid runtime errors during prerender.
if (typeof (globalThis as any).Hammer === 'undefined') {
	(globalThis as any).Hammer = class {
		// Intentionally left empty for server-side Hammer.js mock
		// Empty constructor intentionally omitted as it's not needed
		on() { //}
		destroy() {}
	};
}
const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;
    function destroy() {
        throw new Error('Function not implemented.');
    }

