import type { APIFetchOptions } from '@wordpress/api-fetch';

export async function prepare() {
	if (process.env.NODE_ENV === 'development') {
		const { workerStart } = await import('./__devel__/mocks/browser');
		const { developmentConfig } = await import('./__devel__/overrides');
		Object.assign(runtimeConfig, developmentConfig);
		return workerStart();
	}
	// Else: production mode
	const { default: apiFetch } = await import('@wordpress/api-fetch');
	const productionConfig = {
		logoUrl:
			'/wp-content/plugins/cookiex-consent-management-platform/dist/static/logo.svg',
		apiFetch,
	} as const;
	Object.assign(runtimeConfig, productionConfig);

	return Promise.resolve();
}

export const runtimeConfig = {
	logoUrl: '',
	apiFetch: <T = any>(options?: APIFetchOptions) =>
		Promise.resolve({
			options,
		} as T),
};
