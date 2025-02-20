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
