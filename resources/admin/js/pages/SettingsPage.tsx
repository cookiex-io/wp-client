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
} from '@mantine/core';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

/* eslint-disable camelcase, no-undef */
declare const cookiex_cmp: { nonce: string; apiUrl: string };
/* eslint-enable camelcase, no-undef */

const SettingsPage = () => {
	const [domainId, setDomainId] = useState('');
	const [gtmId, setGtmId] = useState('');
	const [gtmEnabled, setGtmEnabled] = useState(false);
	const [loading, setLoading] = useState(true);
	/* eslint-disable camelcase, no-undef */
	const cookiexData = cookiex_cmp;
	/* eslint-enable camelcase, no-undef */

	useEffect(() => {
		axios.defaults.headers.common['X-WP-Nonce'] = cookiexData.nonce;
		const fetchSettings = async () => {
			try {
				setLoading(true);
				console.error(loading);
				const responses = await Promise.all([
					axios.get(`${cookiexData.apiUrl}domain-id/`),
					axios.get(`${cookiexData.apiUrl}gtm-id/`),
				]);
				setDomainId(responses[0].data.domainId);
				setGtmId(responses[1].data.gtmId);
				setGtmEnabled(responses[1].data.gtmEnabled);
				console.error(gtmEnabled);
				setLoading(false);
			} catch (error) {
				console.error('Failed to fetch settings:', error);
				setLoading(false);
			}
		};
		fetchSettings();
	}, []);

	const updateDomainId = async () => {
		try {
			const response = await axios.post(
				`${cookiexData.apiUrl}domain-id/`,
				{ domainId }
			);
			console.error('Domain ID updated:', response.data);
		} catch (error) {
			console.error('Failed to update domain ID:', error);
		}
	};

	const updateGtmId = async () => {
		try {
			const response = await axios.post(`${cookiexData.apiUrl}gtm-id/`, {
				gtmId,
				gtmEnabled,
			});
			console.error('GTM ID updated:', response.data);
		} catch (error) {
			console.error('Failed to update GTM ID:', error);
		}
	};
	return (
		<React.Fragment>
			<>
				<Container fluid>
					<Title mt="lg" mb="lg" order={2}>
						Settings
					</Title>
					<Paper withBorder shadow="sm" p="lg" radius="md">
						<Title order={5}>General Settings</Title>
						<Grid mt="sm">
							<Grid.Col span={{ base: 12, md: 6, lg: 8 }} mt="sm">
								<Group
									gap="sm"
									grow
									onSubmit={(e) => e.preventDefault()}
								>
									<Text size="sm">Connect domain id</Text>
									<Group>
										<TextInput
											value={domainId}
											onChange={(e) =>
												setDomainId(
													e.currentTarget.value
												)
											}
											placeholder="E.g. www.cookies.com"
										/>
									</Group>
								</Group>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6, lg: 8 }} mt="sm">
								<Group gap="sm" grow>
									<Text size="sm">Select main language</Text>
									<Group>
										<Select
											placeholder="Auto-Select"
											data={[
												'English',
												'Spanish',
												'French',
											]}
											w={185}
										/>
									</Group>
								</Group>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6, lg: 8 }} mt="sm">
								<Group gap="sm" grow>
									<Text size="sm">
										Auto detect language from website
										location
									</Text>
									<Group>
										<Switch size="sm" />
									</Group>
								</Group>
							</Grid.Col>
						</Grid>
						<Divider my="lg" />
						<Title order={5}>Google Tag Manager</Title>
						<Grid mt="sm">
							<Grid.Col span={{ base: 12, md: 6, lg: 8 }} mt="sm">
								<Group
									onSubmit={(e) => e.preventDefault()}
									gap="sm"
									grow
								>
									<Text size="sm">
										Enable Google Tag Manager
									</Text>
									<Group>
										<Switch
											checked={gtmEnabled}
											size="sm"
										/>
									</Group>
								</Group>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6, lg: 8 }} mt="sm">
								<Group gap="sm" grow>
									<Text size="sm">
										Enter Google Tag Manager id
									</Text>
									<Group>
										<TextInput
											value={gtmId}
											onChange={(e) =>
												setGtmId(e.currentTarget.value)
											}
											placeholder="Google Tag Manager id"
										/>
									</Group>
								</Group>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6, lg: 8 }} mt="sm">
								<Group gap="sm" grow>
									<Text size="sm">
										Choose Google Tag Manager cookies
									</Text>
									<Group>
										<Select
											placeholder="Preferences"
											data={[
												'Preferences',
												'Marketing',
												'Analytics',
											]}
											w={185}
										/>
									</Group>
								</Group>
							</Grid.Col>
						</Grid>
						<Divider my="lg" />
						<Button
							onClick={() => {
								updateDomainId();
								updateGtmId();
							}}
							color="orange"
							radius="md"
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
