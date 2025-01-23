import { http, HttpResponse } from 'msw';

export const handlers = [
	http.get('/cookiex/v1/settings', () => {
		return HttpResponse.json(
			{
				domainId: '',
				language: 'en',
				autoBlockCookies: false,
				gtmEnabled: false,
				gtmId: '',
				cookiePreference: {},
			},
			{ status: 200 }
		);
	}),

	http.post('/cookiex/v1/save-settings', () => {
		return HttpResponse.json('Settings saved successfully', {
			status: 200,
		});
	}),
];
