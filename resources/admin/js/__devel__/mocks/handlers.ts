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
