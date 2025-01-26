export const generateColorFromName = (email: string) => {
	const name = email.split('@')[0]; // Extract part before "@"
	const hash = name
		.split('')
		.reduce((acc, char) => acc + char.charCodeAt(0), 0);
	return `hsl(${hash % 360}, 40%, 50%)`; // Use HSL format correctly
};

export const getInitials = (email: string) => {
	const name = email.split('@')[0]; // Extract part before "@"
	const parts = name.split('.'); // Split name by dots if present, e.g., "john.doe"
	return parts.length > 1
		? parts[0][0].toUpperCase() + parts[1][0].toUpperCase() // First initial of each part
		: name.substring(0, 2).toUpperCase(); // First two letters of the name if no dot
};

export const getName = (email: string) => {
	const name = email.split('@')[0];
	return name;
};

export const formatDate = (date: Date): string => {
	const day = String(date.getDate()).padStart(2, '0'); // Pad with leading zeros if necessary
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const regulations = [
	{
		label: 'GDPR',
		value: 'gdpr',
		description:
			'The selected opt-in banner supports GDPR (EU & UK), LGPD (Brazil), PIPEDA (Canada), Law 25 (Quebec), POPIA (South Africa), nFADP (Switzerland), Privacy Act (Australia), PDPL (Saudi Arabia), PDPL (Argentina), PDPL (Andorra), DPA (Faroe Island), DPDP (India)',
	},
	{
		label: 'US State Laws',
		value: 'us',
		description:
			'The selected opt-out banner supports CCPA/CPRA (California), VCDPA (Virginia), CPA (Colorado), CTDPA (Connecticut), & UCPA (Utah)',
	},
];

export const consentOptionsData: any[] = [
	{ checked: true, label: 'Necessary' },
	{ checked: false, label: 'Preferences' },
	{ checked: false, label: 'Statistics' },
	{ checked: false, label: 'Marketing' },
];

export const themesConfig: any[] = [
	{
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
		consentOptions: consentOptionsData,
	},
	{
		background: '#000',
		type: 'Dark',
		buttonStyle: 'Mixed',
		textColor: '#fff',
		highlight: 'gray',
		buttonCustomizeBackGround: '#fff',
		buttonCustomizeTextColor: '#000',
		buttonCustomizeVariant: 'filled',
		buttonCustomizeBorder: '#fff',
		buttonRejectBackGround: '#fff',
		buttonRejectTextColor: '#000',
		buttonRejectVariant: 'filled',
		buttonRejectBorder: '#fff',
		buttonAcceptBackGround: '#fff',
		buttonAcceptTextColor: '#000',
		buttonAcceptVariant: 'filled',
		buttonAcceptBorder: '#fff',
		consentOptions: consentOptionsData,
	},
	{
		background: '#fff',
		type: 'Custom',
		buttonStyle: 'Mixed',
		textColor: '#000',
		highlight: '#0078b4',
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
		consentOptions: consentOptionsData,
	},
];

export const layouts = [
	{
		layoutType: 'Box',
		bannerValue: 'leftBottomPopUp',
		styles: {
			border: '1px solid #eaeaea',
			left: '7px',
			bottom: '7px',
			padding: '10px',
			position: 'absolute',
			width: '40%',
		},
		text: 'Box',
	},
	{
		layoutType: 'Banner',
		bannerValue: 'bannerBottom',
		styles: {
			border: '1px solid #eaeaea',
			left: '5px',
			bottom: '7px',
			padding: '5px',
			position: 'absolute',
			width: '80%',
		},
		text: 'Banner',
	},
	{
		layoutType: 'PopUp',
		bannerValue: 'popUpCenter',
		styles: {
			border: '1px solid #eaeaea',
			left: '30%',
			bottom: '30%',
			padding: '10px',
			position: 'absolute',
			width: '40%',
		},
		text: 'Popup',
	},
];

export const languageOptions = [
	{ label: 'Hindi', value: 'hi' },
	{ label: 'Bengali', value: 'bn' },
	{ label: 'Telugu', value: 'tg' },
	{ label: 'Marathi', value: 'mr' },
	{ label: 'Tamil', value: 'ta' },
	{ label: 'Urdu', value: 'ur' },
	{ label: 'Gujarati', value: 'gr' },
	{ label: 'Kannada', value: 'kn' },
	{ label: 'English', value: 'en' },
	{ label: 'Odisha', value: 'od' },
	{ label: 'Malayalam', value: 'ml' },
	{ label: 'Punjabi', value: 'pb' },
	{ label: 'Assam', value: 'as' },
];

export const additionalOptions: any = {
	isPreferences: false,
	isStatistics: false,
	isMarketing: false,
	isDisplayCloseIcon: false,
};

export const finalConsentConfig: any = {
	regulation: regulations[0],
	language: 'en',
	layout: 'Box',
	alignment: 'leftBottomPopUp',
	theme: themesConfig[0],
	isLogoDisplay: true,
	logo: '',
	method: '',
	type: '',
	additionalDetailsConfig: additionalOptions,
	baseUrl: window.location.hostname,
};
