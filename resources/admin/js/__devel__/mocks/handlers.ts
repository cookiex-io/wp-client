import { delay, http, HttpResponse } from 'msw';

// Add state variable to track welcome status
let showWelcome = true;

export const handlers = [
	http.post('/cookiex/v1/clear-welcome', async () => {
		// 50ms network round trip
		await delay(50);
		showWelcome = false;
		return HttpResponse.json({ success: true }, { status: 200 });
	}),

	http.get('/cookiex/v1/welcome-status', () => {
		// Return the current welcome status
		return HttpResponse.json(
			{ show_welcome: showWelcome },
			{ status: 200 }
		);
	}),

	http.get('/cookiex/v1/settings', () => {
		return HttpResponse.json(
			{
				domainId: '123e4567-e89b-12d3-a456-426614174000',
				language: 'en',
				autoBlockCookies: true,
				gtmEnabled: false,
				gtmId: '',
				cookiePreference: {},
				serverCountry: 'in',
				languagesAvailable: {
					en: 'English',
					fr: 'Français',
					es: 'Español',
					pt: 'Português',
					ar: 'العربية',
				},
			},
			{ status: 200 }
		);
	}),

	http.post('/cookiex/v1/save-settings', () => {
		return HttpResponse.json('Settings saved successfully', {
			status: 200,
		});
	}),

	http.post('/cookiex/v1/register', async () => {
		await delay(50);
		return HttpResponse.json(
			{
				status: true,
			},
			{ status: 200 }
		);
	}),

	http.post('/cookiex/v1/quickscan', async () => {
		await delay(50);
		return HttpResponse.json(
			{
				status: true,
				type: 'existing',
				last_scan: new Date().toISOString(),
				pages: 5,
				cookies_count: 15,
			},
			{ status: 200 }
		);
	}),

	http.post('/cookiex/v1/enable-consent-management', async () => {
		await delay(50);
		return HttpResponse.json(
			{
				status: true,
			},
			{ status: 200 }
		);
	}),
];
