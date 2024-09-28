import {
	Title,
	Grid,
	TextInput,
	Button,
	Switch,
	Select,
	Group,
	Text,
	Paper,
	Container,
	Divider,
	MultiSelect,
	Alert,
	LoadingOverlay,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';

const languageNames = {
	en: 'English',
	hi: 'Hindi',
	bn: 'Bengali',
	tg: 'Telugu',
	mr: 'Marathi',
	ta: 'Tamil',
	ur: 'Urdu',
	gr: 'Gujarati',
	kn: 'Kannada',
	od: 'Odia',
	ml: 'Malayalam',
	pb: 'Punjabi',
	as: 'Assamese',
};

const SettingsPage = () => {
	const [domainId, setDomainId] = useState('');
	const [gtmId, setGtmId] = useState('');
	const [gtmEnabled, setGtmEnabled] = useState(false);
	const [autoBlockCookies, setAutoBlockCookies] = useState(false);
	const [loading, setLoading] = useState(true);
	const [language, setLanguage] = useState<any>('en');
	const [cookiePreference, setCookiePreference] = useState<any[]>([]);
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const icon = <IconInfoCircle />;

	useEffect(() => {
		fetchSettings();
	}, []);

	const fetchSettings = async () => {
		try {
			setLoading(true);
			const response: any = await apiFetch({
				path: '/cookiex/v1/settings',
			});

			if (response) {
				setTimeout(function () {
					setDomainId(response.domainId);
					setGtmId(response.gtmId);
					setGtmEnabled(response.gtmEnabled);
					setAutoBlockCookies(response.autoBlockCookies);
					setLanguage(response.language);
					setCookiePreference(response.cookiePreference);
				}, 1000);
			}
			setLoading(false);
		} catch (error) {
			console.error('Failed to fetch settings:', error);
			setLoading(false);
		}
	};

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
			setErrorMessage('Please select a main language.');
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
				domainId,
				language,
				autoBlockCookies,
				gtmEnabled,
				gtmId,
				cookiePreference,
			}),
		};

		try {
			const response: any = await apiFetch(options);
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
		<React.Fragment>
			{loading && (
				<LoadingOverlay
					visible={true}
					zIndex={1000}
					overlayProps={{ radius: 'sm', blur: 2 }}
					loaderProps={{ color: 'orange', type: 'bars' }}
				/>
			)}
			<>
				<Container fluid>
					<Title mt="lg" mb="lg" order={2}>
						Settings
					</Title>
					<Paper withBorder shadow="sm" p="lg" radius="md">
						{errorMessage && (
							<Alert
								variant="light"
								color="red"
								icon={icon}
								mb={10}
							>
								{errorMessage}
							</Alert>
						)}

						{successMessage && (
							<Alert
								variant="light"
								color="green"
								icon={icon}
								mb={10}
							>
								{successMessage}
							</Alert>
						)}
						<Title order={5}>General Settings</Title>
						<Grid mt="sm">
							<Grid.Col
								span={{ base: 12, md: 12, lg: 8 }}
								mt="sm"
							>
								<Group gap="sm" grow>
									<Text size="sm">
										Connect domain ID (UUID)
									</Text>
									<Group>
										<TextInput
											value={domainId}
											onChange={(e) =>
												setDomainId(
													e.currentTarget.value
												)
											}
											placeholder="E.g. 123e4567-e89b-12d3-a456-426614174000"
										/>
									</Group>
								</Group>
							</Grid.Col>
							<Grid.Col
								span={{ base: 12, md: 12, lg: 8 }}
								mt="sm"
							>
								<Group gap="sm" grow>
									<Text size="sm">Select main language</Text>
									<Group>
										<Select
											placeholder="Auto-Select"
											data={Object.entries(
												languageNames
											).map(([key, value]) => ({
												value: key,
												label: value,
											}))}
											value={language}
											onChange={setLanguage}
											w={185}
										/>
									</Group>
								</Group>
							</Grid.Col>
							<Grid.Col
								span={{ base: 12, md: 12, lg: 8 }}
								mt="sm"
							>
								<Group gap="sm" grow>
									<Text size="sm">Auto Block Cookies</Text>
									<Group>
										<Switch
											checked={autoBlockCookies}
											onChange={(event) =>
												setAutoBlockCookies(
													event.currentTarget.checked
												)
											}
											size="sm"
										/>
									</Group>
								</Group>
							</Grid.Col>
						</Grid>
						<Divider my="lg" />
						<Title order={5}>Google Tag Manager</Title>
						<Grid mt="sm">
							<Grid.Col
								span={{ base: 12, md: 12, lg: 8 }}
								mt="sm"
							>
								<Group gap="sm" grow>
									<Text size="sm">
										Enable Google Tag Manager
									</Text>
									<Group>
										<Switch
											checked={gtmEnabled}
											onChange={(event) =>
												setGtmEnabled(
													event.currentTarget.checked
												)
											}
											size="sm"
										/>
									</Group>
								</Group>
							</Grid.Col>
							<Grid.Col
								span={{ base: 12, md: 12, lg: 8 }}
								mt="sm"
							>
								{gtmEnabled && (
									<Group gap="sm" grow>
										<Text size="sm">
											Enter Google Tag Manager ID
										</Text>
										<Group>
											<TextInput
												value={gtmId}
												onChange={(e) =>
													setGtmId(
														e.currentTarget.value
													)
												}
												placeholder="Google Tag Manager ID"
											/>
										</Group>
									</Group>
								)}
							</Grid.Col>
							<Grid.Col
								span={{ base: 12, md: 12, lg: 8 }}
								mt="sm"
							>
								{gtmEnabled && (
									<Group gap="sm" grow>
										<Text size="sm">
											Choose Google Tag Manager cookies
										</Text>
										<Group>
											<MultiSelect
												data={[
													'Preferences',
													'Marketing',
													'Analytics',
												]}
												value={cookiePreference}
												onChange={setCookiePreference}
												w={185}
											/>
										</Group>
									</Group>
								)}
							</Grid.Col>
						</Grid>
						<Divider my="lg" />
						<Button
							color="orange"
							radius="md"
							onClick={updateSettings}
						>
							Save Changes
						</Button>
					</Paper>
				</Container>
			</>
		</React.Fragment>
	);
};

export { SettingsPage };
