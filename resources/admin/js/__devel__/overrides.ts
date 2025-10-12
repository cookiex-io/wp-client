import wpApiFetch from './mocks/wp-api-fetch';

export const developmentConfig = {
	logoUrl: 'https://cdn.cookiex.io/brand/logo.svg',
	previewUrl: 'http://localhost:8081/dist/cookiex.min.js',
	cmpRedirectUrl: 'https://staging.cookiex.io',
	apiFetch: wpApiFetch,
} as const;
