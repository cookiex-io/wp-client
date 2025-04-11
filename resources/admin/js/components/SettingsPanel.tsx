import {
	Grid,
	Card,
	Title,
	Text,
	Button,
	Divider,
	Group,
	TextInput,
	Select,
	Switch,
	MultiSelect,
	Alert,
	LoadingOverlay,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { runtimeConfig } from '../config';
import { IconInfoCircle } from '@tabler/icons-react';
import { ConsentBannerScreen } from './Consent/ConsentBannerScreen';

export function SettingsPanel() {
	const [domainId, setDomainId] = useState('');
	const [gtmId, setGtmId] = useState('');
	const [gtmEnabled, setGtmEnabled] = useState(false);
	const [language, setLanguage] = useState<any>('en');
	const [loading, setLoading] = useState(true);
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
		vi: 'Vietnamese'
	});

	useEffect(() => {
		try {
			setLoading(true);
			runtimeConfig
				.apiFetch({
					path: '/cookiex/v1/settings',
				})
				.then((res: any) => {
					setDomainId(res.domainId);
					setGtmId(res.gtmId);
					setGtmEnabled(res.gtmEnabled);
					setAutoBlockCookies(res.autoBlockCookies);
					setLanguage(res.language);
					setCookiePreference(res.cookiePreference);
					setServerCountry(res.serverCountry);
					setLanguagesAvailable(res.languagesAvailable);
				});

			setLoading(false);
		} catch (error) {
			console.error('Failed to fetch settings:', error);
			setLoading(false);
		}
	}, []);

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
			}),
		};

		try {
			const response: any = await runtimeConfig.apiFetch(options);
			setSuccessMessage(response);
		} catch (error: any) {
			if ('code' in error && error.code === 'invalid_nonce') {
				setErrorMessage('Security check failed.');
			} else {
				setErrorMessage('Could not save settings');
			}
		}
	};

	return (
		<>
			{loading && (
				<LoadingOverlay
					visible={true}
					zIndex={1000}
					overlayProps={{ radius: 'sm', blur: 2 }}
					loaderProps={{ color: 'green', type: 'bars' }}
				/>
			)}
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
			<Grid gutter="lg" mt="md">
				{/* General Settings */}
				<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
					<Card
						withBorder
						shadow="sm"
						radius="md"
						padding="lg"
						style={{
							display: 'flex',
							flexDirection: 'column',
							minHeight: '300px',
							height: '100%',
						}}
					>
						<Title order={3}>General Settings</Title>
						<input
							type="hidden"
							name="serverCountry"
							value={serverCountry}
						/>
						<Divider my="md" />
						<Group gap="sm" grow>
							<Text size="sm">Connect domain ID (UUID)</Text>
							<Group>
								<TextInput
									value={domainId}
									onChange={(e) =>
										setDomainId(e.currentTarget.value)
									}
									placeholder="E.g. 123e4567-e89b-12d3-a456-426614174000"
								/>
							</Group>
						</Group>
						<Group gap="sm" grow mt="sm">
							<Text size="sm">Auto Block Cookies</Text>
							<Switch
								checked={autoBlockCookies}
								color="green"
								onChange={(event) =>
									setAutoBlockCookies(
										event.currentTarget.checked
									)
								}
								size="sm"
							/>
						</Group>
						<Group gap="sm" grow mt="sm">
							<Text size="sm">Language</Text>
							<Select
								value={language}
								onChange={setLanguage}
								data={Object.entries(languagesAvailable).map(
									([code, name]) => ({
										value: code,
										label: name,
									})
								)}
							/>
						</Group>
						<Divider my="md" />
						<Title order={4}>Google Tag Manager</Title>
						<Group gap="sm" grow mt="sm">
							<Text size="sm">Enable Google Tag Manager</Text>
							<Switch
								checked={gtmEnabled}
								color="green"
								onChange={(event) =>
									setGtmEnabled(event.currentTarget.checked)
								}
								size="sm"
							/>
						</Group>
						{gtmEnabled && (
							<>
								<Group gap="sm" grow mt="sm">
									<Text size="sm">
										Enter Google Tag Manager ID
									</Text>
									<TextInput
										value={gtmId}
										onChange={(e) =>
											setGtmId(e.currentTarget.value)
										}
										placeholder="Google Tag Manager ID"
									/>
								</Group>
								<Group gap="sm" grow mt="sm">
									<Text size="sm">
										Choose Google Tag Manager cookies
									</Text>
									<MultiSelect
										data={[
											'Preferences',
											'Marketing',
											'Analytics',
										]}
										value={cookiePreference}
										onChange={setCookiePreference}
									/>
								</Group>
							</>
						)}
						<div style={{ flexGrow: 1 }}></div>
						<Button
							mt="lg"
							color="#0078b4"
							onClick={updateSettings}
						>
							Save Changes
						</Button>
					</Card>
				</Grid.Col>

				{/* Consent Banner Settings */}
				<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
					<Card
						withBorder
						shadow="sm"
						radius="md"
						padding="lg"
						style={{
							display: 'flex',
							flexDirection: 'column',
							minHeight: '300px',
							height: '100%',
						}}
					>
						<Title order={3}>Consent Banner Settings</Title>
						<Divider my="md" />
						<ConsentBannerScreen />
						<div style={{ flexGrow: 1 }}></div>
						<Button mt="lg" color="#0078b4">
							Customize more on portal
						</Button>
					</Card>
				</Grid.Col>
			</Grid>
		</>
	);
}
