import { delay, http, HttpResponse } from 'msw';

// Add state variable to track welcome status
let showWelcome = true;
const isPluginConnected = true;

let tempToken = 'mocked-initial-token';
let tokenLastUpdated = Date.now();
let bannerPreview = false; // Default state for banner preview

let userDetails = {
	email: 'user@example.com',
	emailVerified: true,
	joinedOn: '2025-03-09T12:34:56.789Z',
	name: 'John Doe',
};

/**
 * Helper function to refresh the temp token.
 */
const refreshTempToken = () => {
	tempToken = `mocked-token-${Date.now()}`;
	tokenLastUpdated = Date.now();
	return {
		status: 'refreshed',
		message: 'Temp token refreshed successfully.',
		token: tempToken,
	};
};

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
				domainUrl: 'https://www.rempute.com',
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
				theme: {
					layout: 'Box',
					alignment: 'leftBottomPopUp',
					theme: {
						background: '#fff',
						type: 'Light',
						buttonStyle: 'Mixed',
						textColor: '#000',
						highlight: '#4CAF50',
						buttonCustomizeBackGround: '#0078b4',
						buttonCustomizeTextColor: '#fff',
						buttonCustomizeVariant: 'filled',
						buttonCustomizeBorder: '#0078b4',
						buttonRejectBackGround: '#fff',
						buttonRejectTextColor: '#0078b4',
						buttonRejectVariant: 'filled',
						buttonRejectBorder: '#0078b4',
						buttonAcceptBackGround: '#0078b4',
						buttonAcceptTextColor: '#fff',
						buttonAcceptVariant: 'filled',
						buttonAcceptBorder: '#0078b4',
						consentOptions: [
							{
								checked: true,
								label: 'Necessary',
							},
							{
								checked: false,
								label: 'Preferences',
							},
							{
								checked: false,
								label: 'Statistics',
							},
							{
								checked: false,
								label: 'Marketing',
							},
						],
						bannerPrefBg: '#fff',
						bannerPrefTxtClr: '#000',
						bannerPrefBtnAllowSelBackGround: '#0078b4',
						bannerPrefBtnAllowSelTextColor: '#fff',
						bannerPrefBtnAllowSelVariant: 'filled',
						bannerPrefBtnAllowSelBorder: '#0078b4',
						bannerPrefBtnRejBackGround: '#fff',
						bannerPrefBtnRejTextColor: '#0078b4',
						bannerPrefBtnRejVariant: 'filled',
						bannerPrefBtnRejBorder: '#0078b4',
						bannerPrefBtnAcptAllBackGround: '#0078b4',
						bannerPrefBtnAcptAllTextColor: '#fff',
						bannerPrefBtnAcptAllVariant: 'filled',
						bannerPrefBtnAcptAllBorder: '#0078b4',
						bannerPreflanguageDd: '#000',
						bannerReconsentBg: '#fff',
						bannerReconsentTextColor: '#000',
						bannerReconsntBtnWithDrawBackGround: '#fff',
						bannerReconsntBtnWithDrawTextColor: '#0078b4',
						bannerReconsntBtnWithDrawVariant: 'filled',
						bannerReconsntBtnWithDrawBorder: '#0078b4',
						bannerReconsntBtnUpdtCnsntBackGround: '#0078b4',
						bannerReconsntBtnUpdtCnsntTextColor: '#fff',
						bannerReconsntBtnUpdtCnsntVariant: 'filled',
						bannerReconsntBtnUpdtCnsntBorder: '#0078b4',
					},
					type: 'Light',
					regulation: {
						label: 'US State Laws',
						value: 'us',
						description:
							'The selected opt-out banner supports CCPA/CPRA (California), VCDPA (Virginia), CPA (Colorado), CTDPA (Connecticut), & UCPA (Utah)',
					},
					bannerContent: {
						title: 'We value your privacy',
						description:
							"We use cookies to enhance your browsing experience, serve personalized ads or content and analyze your traffic By clicking 'Accept', you consent to our use of cookies.",
						options: {
							Necessary: 'Necessary',
							Preferences: 'Preferences',
							Statistics: 'Statistics',
							Marketing: 'Marketing',
							Unclassified: 'Unclassified',
						},
						CookieConsent: 'Cookie Consent',
						ConsentID: 'Consent ID',
						ConsentGiven: 'You have given consent for the use of',
						Timestamp: 'Timestamp',
						Cookies: 'Cookies',
						descriptions: {
							Necessary:
								'These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.',
							Preferences:
								'Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region you are in.',
							Statistics:
								'Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.',
							Marketing:
								'Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.',
							Unclassified:
								'Unclassified cookies are those that we are currently working on categorizing, in collaboration with the providers of each individual cookie.',
						},
						Accept: 'Accept All',
						AllowSelection: 'Allow Selection',
						Reject: 'Reject All',
						Customize: 'Customize',
						WithdrawConsent: 'Withdraw Consent',
						UpdateConsent: 'Update Consent',
						modalTitle: 'Cookie Consent',
						modalDescription:
							'Select the categories of cookies you consent to use.',
						savePreferences: 'Save Preferences',
						alwaysActive: 'Always Active',
						active: 'Active',
						inactive: 'Inactive',
						CookieName: 'Cookie Name',
						CookieDescription: 'Cookie Description',
						MaxStorageDuration: 'Max Storage Duration',
						Type: 'Type',
						Ok: 'Ok',
						modalSubDescription:
							'Your opt-out settings for this website have been respected since we detected a Global Privacy Control signal from your browser and, therefore, you cannot change this setting.',
						Cancel: 'Cancel',
						NotSellData: 'Do Not Sell My Personal Information',
						policyUrl: '',
					},
				},
			},

			{ status: 200 }
		);
	}),

	http.post('/cookiex/v1/save-settings', () => {
		return HttpResponse.json({
			status: 'success',
			message: 'Settings retrieved successfully',
			data: {
				domainId: '67cd617dc09b17267d62b35b',
				language: 'en',
				autoBlockCookies: false,
				gtmEnabled: false,
				gtmId: '',
				cookiePreference: [],
				serverCountry: 'in',
				languagesAvailable: {
					en: 'English',
					fr: 'Fran\u00e7ais',
					es: 'Espa\u00f1ol',
					pt: 'Portugu\u00eas',
					ar: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
				},
				theme: '{"regulation":{"label":"GDPR","value":"gdpr","description":"The selected opt-in banner supports GDPR (EU & UK), LGPD (Brazil), PIPEDA (Canada), Law 25 (Quebec), POPIA (South Africa), nFADP (Switzerland), Privacy Act (Australia), PDPL (Saudi Arabia), PDPL (Argentina), PDPL (Andorra), DPA (Faroe Island), DPDP (India)"},"language":"en","layout":"Box","alignment":"leftBottomPopUp","theme":{"background":"#000","type":"Dark","buttonStyle":"Mixed","textColor":"#fff","highlight":"gray","buttonCustomizeBackGround":"#fff","buttonCustomizeTextColor":"#000","buttonCustomizeVariant":"filled","buttonCustomizeBorder":"#fff","buttonRejectBackGround":"#fff","buttonRejectTextColor":"#000","buttonRejectVariant":"filled","buttonRejectBorder":"#fff","buttonAcceptBackGround":"#fff","buttonAcceptTextColor":"#000","buttonAcceptVariant":"filled","buttonAcceptBorder":"#fff","consentOptions":[{"checked":true,"label":"Necessary"},{"checked":false,"label":"Preferences"},{"checked":false,"label":"Statistics"},{"checked":false,"label":"Marketing"},{"checked":false,"label":"Unclassified"}],"bannerPrefBg":"#fff","bannerPrefTxtClr":"#000","bannerPrefBtnAllowSelBackGround":"#0078b4","bannerPrefBtnAllowSelTextColor":"#fff","bannerPrefBtnAllowSelVariant":"filled","bannerPrefBtnAllowSelBorder":"#0078b4","bannerPrefBtnRejBackGround":"#fff","bannerPrefBtnRejTextColor":"#0078b4","bannerPrefBtnRejVariant":"filled","bannerPrefBtnRejBorder":"#0078b4","bannerPrefBtnAcptAllBackGround":"#0078b4","bannerPrefBtnAcptAllTextColor":"#fff","bannerPrefBtnAcptAllVariant":"filled","bannerPrefBtnAcptAllBorder":"#0078b4","bannerPreflanguageDd":"#000","bannerReconsentBg":"#fff","bannerReconsentTextColor":"#000","bannerReconsntBtnWithDrawBackGround":"#fff","bannerReconsntBtnWithDrawTextColor":"#0078b4","bannerReconsntBtnWithDrawVariant":"filled","bannerReconsntBtnWithDrawBorder":"#0078b4","bannerReconsntBtnUpdtCnsntBackGround":"#0078b4","bannerReconsntBtnUpdtCnsntTextColor":"#fff","bannerReconsntBtnUpdtCnsntVariant":"filled","bannerReconsntBtnUpdtCnsntBorder":"#0078b4"},"isLogoDisplay":true,"logo":"","method":"","type":"Dark","additionalDetailsConfig":{"isPreferences":false,"isStatistics":false,"isMarketing":false,"isDisplayCloseIcon":false},"baseUrl":"13.234.32.75","bannerContent":{"title":"We value your privacy","description":"We use cookies to enhance your browsing experience,serve personalized ads or content and analyze your traffic By clicking \'Accept\', you consent to our use of cookies.","options":{"Necessary":"Necessary","Preferences":"Preferences","Statistics":"Statistics","Marketing":"Marketing","Unclassified":"Unclassified"},"CookieConsent":"Cookie Consent","ConsentID":"Consent ID","ConsentGiven":"You have given consent for the use of","Timestamp":"Timestamp","Cookies":"Cookies","descriptions":{"Necessary":"These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.","Preferences":"Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region you are in.","Statistics":"Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.","Marketing":"Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.","Unclassified":"Unclassified cookies are those that we are currently working on categorizing, in collaboration with the providers of each individual cookie."},"Accept":"Accept All","AllowSelection":"Allow Selection","Reject":"Reject All","Customize":"Customize","WithdrawConsent":"Withdraw Consent","UpdateConsent":"Update Consent","modalTitle":"Cookie Consent","modalDescription":"Select the categories of cookies you consent to use.","savePreferences":"Save Preferences","alwaysActive":"Always Active","active":"Active","inactive":"Inactive","CookieName":"Cookie Name","CookieDescription":"Cookie Description","MaxStorageDuration":"Max Storage Duration","Type":"Type","Ok":"Ok","modalSubDescription":"Your opt-out settings for this website have been respected since we detected a Global Privacy Control signal from your browser and, therefore, you cannot change this setting.","Cancel":"Cancel","NotSellData":"Do Not Sell My Personal Information","policyUrl":""}}',
			},
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

	http.get('/cookiex/v1/analytics', () => {
		return HttpResponse.json({
			data: {
				status: 'success',
				message: 'Analytics data retrieved successfully.',
				data: {
					averageTimeToConsent: null,
					leastAcceptedCookie: 'Marketing',
					mostAcceptedCookie: 'Unclassified',
					totalOptOuts: 0,
					totalOptIns: 0,
					chartData: [],
				},
			},
			headers: [],
			status: 200,
		});
	}),

	http.get('/cookiex/v1/cookie-scan', () => {
		return HttpResponse.json({
			data: {
				status: 'success',
				message: 'Cookie scan data retrieved successfully.',
				data: {
					domainId: '67cd617dc09b17267d62b35b',
					domainUrl: 'https://13.234.32.75',
					frequency: 'Monthly',
					status: 'Completed',
					history: [
						{
							id: '67cd61c5764e0533d4876927',
							status: 'Completed',
							pages: 5,
							cookiesCount: 2,
							scannedOn: '2025-03-09T09:39:17.055Z',
						},
						{
							id: '67cd6185764e0533d4876926',
							status: 'Completed',
							pages: 1,
							cookiesCount: 2,
							scannedOn: '2025-03-09T09:38:12.901Z',
						},
					],
					latestScanResult: {
						server: 'IN',
						status: 'Completed',
						pages: 5,
						necessaryCookies: 1,
						preferenceCookies: 0,
						statisticsCookies: 0,
						marketingCookies: 0,
						unclassifiedCookies: 1,
						cookiesCount: 2,
						scannedOn: '2025-03-09T09:39:17.055Z',
					},
					nextScan: '2025-04-08T09:39:17.460Z',
				},
			},
			headers: [],
			status: 200,
		});
	}),

	http.get('/cookiex/v1/connection-status', () => {
		return HttpResponse.json(
			{
				status: 'success',
				message: isPluginConnected
					? 'Plugin is connected.'
					: 'Plugin is not connected.',
				connected: isPluginConnected,
			},
			{ status: 200 }
		);
	}),

	http.get('/cookiex/v1/validate-temp-token', async () => {
		await delay(50); // Simulate network latency

		const tokenExpiryTime = 15 * 60 * 1000; // 15 minutes in milliseconds
		const tokenAge = Date.now() - tokenLastUpdated;

		if (!tempToken || tokenAge >= tokenExpiryTime) {
			return HttpResponse.json(refreshTempToken(), { status: 200 });
		}

		return HttpResponse.json(
			{
				status: 'success',
				message: 'Valid temp token.',
				token: tempToken,
			},
			{ status: 200 }
		);
	}),

	http.post('/cookiex/v1/disconnect', async () => {
		await delay(50); // Simulate network delay

		return HttpResponse.json(
			{
				status: 'success',
				message: 'Plugin successfully disconnected.',
			},
			{ status: 200 }
		);
	}),

	http.get('/cookiex/v1/fetch-banner-preview', async () => {
		await delay(50); // Simulate network delay
		return HttpResponse.json(
			{
				status: 'success',
				bannerPreview,
			},
			{ status: 200 }
		);
	}),

	http.post('/cookiex/v1/save-banner-preview', async () => {
		await delay(50);
		bannerPreview = true;

		return HttpResponse.json(
			{
				status: 'success',
				message: 'Banner preview setting saved successfully.',
			},
			{ status: 200 }
		);
	}),

	http.get('/cookiex/v1/user-details', async () => {
		await delay(50);
		return HttpResponse.json(
			{
				status: 'success',
				message: 'User details retrieved successfully.',
				data: userDetails,
			},
			{ status: 200 }
		);
	}),
];
