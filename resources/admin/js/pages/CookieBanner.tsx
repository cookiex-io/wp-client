import {
	Text,
	Button,
	Divider,
	Group,
	TextInput,
	Select,
	Switch,
	MultiSelect,
	Alert,
	Paper,
	Image,
	Accordion,
	Timeline,
	Stack,
	rem,
	Box,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { runtimeConfig } from '../config';
import {
	IconDevices,
	IconInfoCircle,
	IconPalette,
	IconPointFilled,
	IconShieldCheckFilled,
} from '@tabler/icons-react';
import { ConsentBannerScreen } from '../components/Consent/ConsentBannerScreen';
import { regulations, finalConsentConfig, themesConfig } from '../utils/utils';
import { BannerTheme } from '../components/Consent/BannerTheme';
import { ButtonTheme } from '../components/Consent/ButtonTheme';
import UpgradeCard from '../components/Consent/UpgradeCard';
import colorgradient from '../assets/colorgradient.webp';
import classes from './CookieBanner.module.css';

declare let Cookiex: {
	new (): {
		init: (theme: { domainId: string; domainName: string }) => void;
	};
};

export function CookieBanner(props: any) {
	const [domainId, setDomainId] = useState('');
	const [gtmId, setGtmId] = useState('');
	const [gtmEnabled, setGtmEnabled] = useState(false);
	const [language, setLanguage] = useState<any>('en');
	const [autoBlockCookies, setAutoBlockCookies] = useState(false);
	const [cookiePreference, setCookiePreference] = useState<any[]>([]);
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [serverCountry, setServerCountry] = useState('in');
	const [languagesAvailable, setLanguagesAvailable] = useState<
		Record<string, string>
	>({
		en: 'English',
		ar: 'Arabic',
		bg: 'Bulgarian',
		zh: 'Chinese',
		cs: 'Czech',
		da: 'Danish',
		nl: 'Dutch',
		fi: 'Finnish',
		fr: 'French',
		de: 'German',
		el: 'Greek',
		he: 'Hebrew',
		hi: 'Hindi',
		hu: 'Hungarian',
		id: 'Indonesian',
		it: 'Italian',
		ja: 'Japanese',
		ko: 'Korean',
		ms: 'Malay',
		no: 'Norwegian',
		pl: 'Polish',
		pt: 'Portuguese',
		ro: 'Romanian',
		ru: 'Russian',
		es: 'Spanish',
		sv: 'Swedish',
		th: 'Thai',
		tr: 'Turkish',
		uk: 'Ukrainian',
		vi: 'Vietnamese',
	});
	const [colorScheme, setColorScheme] = useState('Light');
	const [bannerPreview] = useState<any>(true);
	const [regulation, setRegulation] = useState<any>(regulations[0]);
	const [consentConfig, setConsentConfig] = useState<any>(finalConsentConfig);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const filteredTheme = themesConfig.filter(
			(theme) => theme.type === colorScheme
		);
		if (consentConfig.theme) {
			consentConfig.theme = filteredTheme[0];
		}
		consentConfig.type = colorScheme;
		generatePreview(regulation, false, {
			theme: filteredTheme[0],
			type: colorScheme,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [colorScheme]);

	useEffect(() => {
		setConsentConfig(props?.consentConfig?.theme || finalConsentConfig);
		setDomainId(props?.consentConfig?.domainId);
		setGtmId(props?.consentConfig?.gtmId);
		setGtmEnabled(props?.consentConfig?.gtmEnabled);
		setAutoBlockCookies(props?.consentConfig?.autoBlockCookies);
		setLanguage(props?.consentConfig?.language);
		setCookiePreference(props?.consentConfig?.cookiePreference);
		setServerCountry(props?.consentConfig?.serverCountry);
		setLanguagesAvailable(props?.consentConfig?.languagesAvailable);
		setRegulation(props?.consentConfig?.regulation || regulations[0]);
		setColorScheme(props?.consentConfig?.theme?.type || 'Light');

		if (bannerPreview) {
			generatePreview(regulation, false, props?.consentConfig?.theme);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.consentConfig]);

	const validateInputs = () => {
		setErrorMessage('');
		if (!domainId) {
			setErrorMessage('Please enter a valid UUID for the domain ID.');
			return false;
		}
		if (gtmEnabled) {
			if (!gtmId) {
				setErrorMessage('GTM ID cannot be empty when GTM is enabled.');
				return false;
			}
			if (cookiePreference.length === 0) {
				setErrorMessage(
					'Please select at least one cookie preference when GTM is enabled.'
				);
				return false;
			}
		}
		if (!language) {
			setErrorMessage('Please select a primary language.');
			return false;
		}
		setErrorMessage('');
		return true;
	};

	const updateSettings = async () => {
		setLoading(true);
		if (!validateInputs()) {
			return;
		}

		const options = {
			path: '/cookiex/v1/save-settings',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				language,
				autoBlockCookies,
				gtmEnabled,
				gtmId,
				cookiePreference,
				theme: consentConfig,
			}),
		};

		try {
			const response: any = await runtimeConfig.apiFetch(options);

			if (response.status === 'success') {
				setSuccessMessage(response.message); // ✅ Use only the string message
			} else {
				setErrorMessage(response.message || 'Could not save settings');
			}
		} catch (error: any) {
			if ('code' in error && error.code === 'invalid_nonce') {
				setErrorMessage('Security check failed.');
			} else {
				setErrorMessage('Could not save settings');
			}
		} finally {
			setLoading(false);
		}
	};

	const generatePreview = (
		regulationType: any,
		initialPreview: boolean,
		themeObj: any
	) => {
		if (consentConfig.regulation) {
			consentConfig.regulation = regulationType;
		}

		if (bannerPreview) {
			generateHTML(regulationType, initialPreview, themeObj);
		}
	};

	const handleLayout = (fieldName: any, value: any, regulationObj: any) => {
		consentConfig[fieldName] = value;
		generatePreview(regulationObj, false, null);
	};

	const generateHTML = (
		regulationType: any,
		initialPreview: boolean,
		themeObj: any
	) => {
		const loadExternalScript = (src: any) => {
			return new Promise<void>((resolve, reject) => {
				const script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = src;

				script.onload = () => {
					resolve();
				};

				script.onerror = () => {
					reject(new Error(`Failed to load script ${src}`));
				};

				document.head.appendChild(script);
			});
		};

		setTimeout(function () {
			loadExternalScript(runtimeConfig.previewUrl)
				.then(() => {
					const theme: any = {
						domainId,
						selectorId: 'coookiex-comp-banner-preview',
						theme: {
							layout: consentConfig.layout || 'Box',
							alignment:
								consentConfig.alignment || 'leftBottomPopUp',
							theme:
								themeObj?.theme ||
								consentConfig?.theme ||
								finalConsentConfig.theme,
							bannerContent:
								consentConfig.bannerContent ||
								finalConsentConfig.bannerContent,
							type: themeObj?.type || consentConfig.type,
							regulation: regulationType,
						},
						initialPreview,
					};

					const cookiex = new Cookiex();
					cookiex.init(theme);
				})
				.catch((error) => {
					console.error('Error loading external script:', error);
				});
		}, 1000);
	};

	const handleCustomStyles = (colorValue: any, type: any) => {
		const style = `${type}`;
		consentConfig.theme[style] = colorValue;
		generatePreview(regulation, false, null);
	};

	const handleCustomButtonStyles = (
		colorValue: any,
		buttonType: any,
		type: any
	) => {
		const style = `${buttonType}${type}`;
		consentConfig.theme[style] = colorValue;
		generatePreview(regulation, false, null);
	};

	return (
		<>
			{errorMessage && (
				<Alert
					variant="light"
					color="red"
					icon={<IconInfoCircle />}
					mb={10}
				>
					{errorMessage}
				</Alert>
			)}

			{successMessage && (
				<Alert
					variant="light"
					color="green"
					icon={<IconInfoCircle />}
					mb={10}
				>
					{successMessage}
				</Alert>
			)}
			<Box className={classes.cookiexGrid}>
				<div className={classes.cookiexPreviewWrapper}>
					<div className="cookiex-preview-wrapper">
						<div className="cookiex-preview-box">
							<Image
								src={colorgradient}
								alt="Preview Background"
							/>
						</div>
						<div id="coookiex-comp-banner-preview" />
					</div>
				</div>
				<div className={classes.cookiexSettingsPanel}>
					<Accordion
						variant="contained"
						defaultValue="general"
						classNames={{
							root: 'custom-accordion',
						}}
					>
						<Accordion.Item value="general">
							<Accordion.Control
								className={classes.sectionTitle}
								icon={<IconShieldCheckFilled size={25} />}
							>
								General Settings
							</Accordion.Control>
							<Accordion.Panel className="themed-bg">
								<Timeline
									active={4}
									lineWidth={2}
									color="#0078B4"
									bulletSize={20}
									styles={{
										item: { minHeight: 50 },
										itemBullet: {
											border: '2px solid #228be6',
											background: '#deedf5',
											color: '#228be6',
										},
									}}
								>
									<Timeline.Item
										bullet={
											<IconPointFilled
												color="#228be6"
												size={13}
											/>
										}
									>
										<Stack gap="sm">
											<input
												type="hidden"
												name="serverCountry"
												value={serverCountry}
											/>
											<Text
												className={
													classes.subTimeLineTitle
												}
											>
												Connect domain ID (UUID)
											</Text>
											<TextInput
												value={domainId}
												onChange={(e) =>
													setDomainId(
														e.currentTarget.value
													)
												}
												placeholder="E.g. 123e4567-e89b-12d3-a456-426614174000"
											/>
										</Stack>
									</Timeline.Item>
									<Timeline.Item
										bullet={
											<IconPointFilled
												color="#228be6"
												size={13}
											/>
										}
									>
										<Group gap="xs" justify="space-between">
											<Text
												className={
													classes.subTimeLineTitle
												}
											>
												Auto Block Cookies
											</Text>
											<div style={{ flex: '0 0 auto' }}>
												<Switch
													checked={autoBlockCookies}
													color="#0078B4"
													onChange={(event) =>
														setAutoBlockCookies(
															event.currentTarget
																.checked
														)
													}
													size="xs"
												/>
											</div>
										</Group>
									</Timeline.Item>
									{languagesAvailable && (
										<Timeline.Item
											bullet={
												<IconPointFilled
													color="#228be6"
													size={13}
												/>
											}
										>
											<Stack gap="sm">
												<Text
													className={
														classes.subTimeLineTitle
													}
												>
													Language
												</Text>
												{languagesAvailable && (
													<Select
														value={language}
														onChange={setLanguage}
														data={Object.entries(
															languagesAvailable
														).map(
															([code, name]) => ({
																value: code,
																label: name,
															})
														)}
													/>
												)}
											</Stack>
										</Timeline.Item>
									)}
									<Timeline.Item
										bullet={
											<IconPointFilled
												color="#228be6"
												size={13}
											/>
										}
									>
										<Group
											gap="sm"
											justify="space-between"
											mt="sm"
										>
											<Text
												className={
													classes.subTimeLineTitle
												}
											>
												Enable Google Tag Manager
											</Text>
											<Switch
												checked={gtmEnabled}
												color="#0078B4"
												onChange={(event) =>
													setGtmEnabled(
														event.currentTarget
															.checked
													)
												}
												size="xs"
											/>
										</Group>
									</Timeline.Item>
									{gtmEnabled && (
										<>
											<Timeline.Item
												bullet={
													<IconPointFilled
														color="#228be6"
														size={13}
													/>
												}
											>
												<Stack gap="sm" mt="sm">
													<Text
														className={
															classes.subTimeLineTitle
														}
													>
														Enter Google Tag Manager
														ID
													</Text>
													<TextInput
														value={gtmId}
														onChange={(e) =>
															setGtmId(
																e.currentTarget
																	.value
															)
														}
														placeholder="Google Tag Manager ID"
													/>
												</Stack>
											</Timeline.Item>
											<Timeline.Item
												bullet={
													<IconPointFilled
														color="#228be6"
														size={13}
													/>
												}
											>
												<Stack gap="sm" mt="sm">
													<Text
														className={
															classes.subTimeLineTitle
														}
													>
														Choose Google Tag
														Manager cookies
													</Text>
													<MultiSelect
														data={[
															'Preferences',
															'Marketing',
															'Analytics',
														]}
														value={cookiePreference}
														onChange={
															setCookiePreference
														}
													/>
												</Stack>
											</Timeline.Item>
										</>
									)}
								</Timeline>
							</Accordion.Panel>
						</Accordion.Item>

						<Accordion.Item value="design">
							<Accordion.Control
								className={classes.sectionTitle}
								icon={<IconDevices size={25} />}
							>
								Design
							</Accordion.Control>
							<Accordion.Panel className="themed-bg">
								<ConsentBannerScreen
									consentConfig={consentConfig}
									regulation={regulation}
									handleLayout={handleLayout}
									setRegulation={setRegulation}
									subTimeLineTitle={classes.subTimeLineTitle}
								/>
							</Accordion.Panel>
						</Accordion.Item>

						<Accordion.Item value="colorScheme">
							<Accordion.Control
								className={classes.sectionTitle}
								icon={<IconPalette size={25} />}
							>
								Color Schemes
							</Accordion.Control>
							<Accordion.Panel className="themed-bg">
								<Text
									className={classes.subTimeLineTitle}
									mt="md"
								>
									Theme
								</Text>
								<Select
									allowDeselect={false}
									defaultValue={colorScheme}
									onChange={(value) => {
										if (value !== null) {
											setColorScheme(value);
										} else {
											setColorScheme('Light'); // or some other default value
										}
									}}
									data={[
										{
											value: 'Light',
											label: 'Light',
										},
										{
											value: 'Dark',
											label: 'Dark',
										},
										{
											value: 'Custom',
											label: 'Custom',
										},
									]}
								/>
								{colorScheme === 'Custom' && (
									<Paper
										p="lg"
										style={{
											minHeight: '300px',
											height: '100%',
										}}
										radius="md"
									>
										{colorScheme === 'Custom' && (
											<div>
												<BannerTheme
													customStyles={
														handleCustomStyles
													}
													background={
														consentConfig?.theme
															?.background ||
														'#fff'
													}
													name="background"
													label="Background"
													description=""
													subTimeLineTitle={
														classes.subTimeLineTitle
													}
												/>
												<BannerTheme
													customStyles={
														handleCustomStyles
													}
													background={
														consentConfig?.theme
															?.textColor ||
														'#000'
													}
													name="textColor"
													label="Text Color"
													description="Choose the color of all texts within the banner"
													subTimeLineTitle={
														classes.subTimeLineTitle
													}
												/>
												<BannerTheme
													customStyles={
														handleCustomStyles
													}
													background={
														consentConfig?.theme
															?.highlight ||
														'#fff'
													}
													name="highlight"
													label="Highlight"
													description="Choose your highlight color that will impact all links and active toggles in your banner"
													subTimeLineTitle={
														classes.subTimeLineTitle
													}
												/>
												<Divider my="sm" />
												{regulation.value ===
													'gdpr' && (
													<>
														<Group justify="left">
															<Text
																className={
																	classes.subTimeLineTitle
																}
															>
																{' '}
																Button 1 (Reject
																All){' '}
															</Text>
														</Group>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonRejectBackGround ||
																'#fff'
															}
															label="BackGround"
															type="buttonReject"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonRejectTextColor ||
																'#000'
															}
															label="TextColor"
															type="buttonReject"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonRejectBorder ||
																'#fff'
															}
															label="Border"
															type="buttonReject"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
														<Divider my="sm" />
														<Group justify="left">
															<Text
																className={
																	classes.subTimeLineTitle
																}
															>
																Button 2
																(Accept){' '}
															</Text>
														</Group>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonAcceptBackGround ||
																'#fff'
															}
															label="BackGround"
															type="buttonAccept"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonAcceptTextColor ||
																'#000'
															}
															label="TextColor"
															type="buttonAccept"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonAcceptBorder ||
																'#fff'
															}
															label="Border"
															type="buttonAccept"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
														<Divider my="sm" />
														<Group justify="left">
															<Text
																className={
																	classes.subTimeLineTitle
																}
															>
																Button 3
																(Customize)
															</Text>
														</Group>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonCustomizeBackGround ||
																'#fff'
															}
															label="BackGround"
															type="buttonCustomize"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonCustomizeTextColor ||
																'#000'
															}
															label="TextColor"
															type="buttonCustomize"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonCustomizeBorder ||
																'#fff'
															}
															label="Border"
															type="buttonCustomize"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
													</>
												)}
												{regulation.value === 'us' && (
													<>
														<Group
															justify="left"
															mt={20}
														>
															<Text
																className={
																	classes.subTimeLineTitle
																}
															>
																{' '}
																Button 1 (Do Not
																Sell My Info){' '}
															</Text>
														</Group>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonRejectBackGround ||
																'#fff'
															}
															label="BackGround"
															type="buttonReject"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonRejectTextColor ||
																'#000'
															}
															label="TextColor"
															type="buttonReject"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
														<ButtonTheme
															customStyles={
																handleCustomButtonStyles
															}
															background={
																consentConfig
																	?.theme
																	?.buttonRejectBorder ||
																'#fff'
															}
															label="Border"
															type="buttonReject"
															description=""
															subTimeLineTitle={
																classes.subTimeLineTitle
															}
														/>
													</>
												)}
											</div>
										)}
									</Paper>
								)}
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
					<Button
						h={rem(56)}
						fullWidth
						color="#0078B4"
						mt="xs"
						onClick={updateSettings}
						loading={loading}
					>
						Save Changes
					</Button>
				</div>
			</Box>
			<UpgradeCard
				onCreateAccount={() => {
					// e.g. open your signup flow
					window.open(
						`${runtimeConfig.cmpRedirectUrl}/register`,
						'_blank'
					);
				}}
				onConnectAccount={() => {
					// e.g. open connect account modal/flow
					window.open(
						`${runtimeConfig.cmpRedirectUrl}/login`,
						'_blank'
					);
				}}
			/>
		</>
	);
}
