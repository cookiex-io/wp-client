import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create the worker instance
export const worker = setupWorker(...handlers);

// Configure the worker
const workerStart = async () => {
	// Custom configurations for the service worker
	await worker.start({
		serviceWorker: {
			url: '/mockServiceWorker.js', // Adjust this path based on your public URL structure
		},
		onUnhandledRequest: 'bypass',
	});
};

export { workerStart };
