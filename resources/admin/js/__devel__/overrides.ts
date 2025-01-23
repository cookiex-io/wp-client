import wpApiFetch from './mocks/wp-api-fetch';

export const developmentConfig = {
	logoUrl: 'https://cdn.cookiex.io/brand/logo.svg',
	apiFetch: wpApiFetch,
} as const;
