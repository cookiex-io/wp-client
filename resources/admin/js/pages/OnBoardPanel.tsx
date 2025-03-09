import {
	Container,
	Card,
	Title,
	Text,
	Button,
	Divider,
	Tabs,
	Accordion,
	Stack,
	Timeline,
	ThemeIcon,
	Group,
	Modal,
	Box,
	LoadingOverlay,
} from '@mantine/core';
import { IconCheck, IconCircleFilled } from '@tabler/icons-react';
import OverView from './OverView';
import { CookieBanner } from './CookieBanner';
import { runtimeConfig } from '../config';
import { useState, useEffect } from 'react';
import { finalConsentConfig } from '../utils/utils';
import { Welcome } from './Welcome';

function OnBoardPanel() {
	const [loading, setLoading] = useState(true);
	const [openedItems, setOpenedItems] = useState<string[]>(['description']);
	const [consentConfig, setConsentConfig] = useState<any>(finalConsentConfig);
	const [tempToken, setTempToken] = useState('');
	const [isOnBoardCompleted, setIsOnBoardCompleted] =
		useState<boolean>(false);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<
		'login' | 'register' | null
	>(null);

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedOption(null); // Reset selection when modal closes
	};

	const handleCloseAccordion = () => {
		setOpenedItems([]);
	};

	const openCMP = async () => {
		const currentUrl = window.location.href;
		const urlObject = new URL(currentUrl);
		const domainUrl = urlObject.origin;
		const tokenRes = (await validateTempToken()) || tempToken;
		const token = window.btoa(tokenRes);
		if (selectedOption) {
			const url = `${runtimeConfig.cmpRedirectUrl}/connect?website=${consentConfig?.domainUrl || domainUrl}&mode=${selectedOption}&token=${token}`;
			window.open(url, '_blank', 'noopener,noreferrer');
		}
	};

	async function validateTempToken() {
		try {
			const response = await runtimeConfig.apiFetch({
				path: '/cookiex/v1/validate-temp-token',
				method: 'GET',
			});

			if (response) {
				return response;
			}

			console.error('Token validation failed:', response);
			return null;
		} catch (error) {
			console.error('Error validating temp token:', error);
			return null;
		}
	}

	const handleOnboardingComplete = (token: string) => {
		setIsOnBoardCompleted(false);
		setTempToken(token);
	};

	useEffect(() => {
		runtimeConfig
			.apiFetch({ path: '/cookiex/v1/welcome-status' })
			.then((response) => {
				setIsOnBoardCompleted(response.show_welcome);
			});
	}, []);

	useEffect(() => {
		try {
			setLoading(true);
			runtimeConfig
				.apiFetch({
					path: '/cookiex/v1/settings',
				})
				.then((res: any) => {
					if (res.status) {
						setIsOnBoardCompleted(false);
						const parsedData = {
							...res.data,
							theme:
								typeof res.data.theme === 'string'
									? JSON.parse(res.data.theme)
									: res.data.theme,
						};
						setConsentConfig(parsedData);
					}
				});
			setLoading(false);
		} catch (error) {
			console.error('Failed to fetch settings:', error);
			setLoading(false);
		}
	}, []);

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

			<Container fluid>
				<Tabs defaultValue="dashboard">
					<Tabs.List style={{ fontSize: '1.2rem' }}>
						<Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
						{!isOnBoardCompleted && (
							<Tabs.Tab value="settings">Cookie Banner</Tabs.Tab>
						)}
					</Tabs.List>

					<Tabs.Panel value="dashboard">
						<Container fluid>
							<Accordion
								variant="outline"
								mt={30}
								multiple
								value={openedItems}
								onChange={setOpenedItems}
								style={{ border: '1px solid #dee2e6' }}
							>
								<Accordion.Item value="description">
									<Accordion.Control>
										<Stack gap={0}>
											<Title order={6}>
												Get started with CookieX
											</Title>
											<Text size="sm" mt="xs">
												{
													"Welcome to CookieX. To become legally compliant for your use of cookies, here's what you need to do."
												}
											</Text>
										</Stack>
									</Accordion.Control>
									<Accordion.Panel>
										<Divider />
										{isOnBoardCompleted && (
											<Welcome
												handleOnboardingComplete={
													handleOnboardingComplete
												}
											/>
										)}
										{!isOnBoardCompleted && (
											<>
												<Timeline
													active={1}
													bulletSize={30}
													lineWidth={5}
													pt={30}
												>
													<Timeline.Item
														title="Activate your cookie banner"
														bullet={
															<ThemeIcon
																color="blue"
																size={30}
																radius="xl"
															>
																<IconCheck
																	size={20}
																/>
															</ThemeIcon>
														}
													>
														<Text size="xs">
															Well done! 🎉 You
															have successfully
															implemented a cookie
															banner on your
															website.
														</Text>
													</Timeline.Item>
													<Timeline.Item
														title="Connect and scan your website"
														bullet={
															<ThemeIcon
																variant="outline"
																size={30}
																radius="xl"
															>
																<IconCircleFilled
																	color="white"
																	size={20}
																/>
															</ThemeIcon>
														}
													>
														<Text size="xs">
															To initiate an
															automatic cookie
															scan, you need to
															connect to the
															CookieYes web app.
															By connecting you
															can:
														</Text>
													</Timeline.Item>
												</Timeline>
												<Group mt="md">
													<Button
														color="blue"
														onClick={
															handleOpenModal
														}
													>
														Connect to Web App
													</Button>
													<Button
														variant="subtle"
														onClick={
															handleCloseAccordion
														}
													>
														Do it later
													</Button>
												</Group>
											</>
										)}
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
							{!isOnBoardCompleted && (
								<>
									<Card
										withBorder
										mt={20}
										mb={20}
										style={{ borderRadius: '0px' }}
									>
										<Card.Section
											withBorder
											inheritPadding
											py="xs"
										>
											<Group justify="space-between">
												<Text fw={500}>OverView</Text>
											</Group>
										</Card.Section>
										<Card.Section
											withBorder
											inheritPadding
											py="xs"
											bg="#f1f3f5"
										>
											<OverView />
										</Card.Section>
									</Card>
									<Divider />
								</>
							)}
						</Container>
					</Tabs.Panel>

					<Tabs.Panel
						value="settings"
						mt={30}
						style={{ border: '1px solid #dee2e6' }}
						p={20}
					>
						{consentConfig && (
							<CookieBanner consentConfig={consentConfig} />
						)}
					</Tabs.Panel>
				</Tabs>
				<Modal
					opened={isModalOpen}
					onClose={handleCloseModal}
					title="Connect to Web App"
					centered
					size="md"
				>
					<Box
						p="md"
						mt="sm"
						style={(theme) => ({
							border: `2px solid ${selectedOption === 'login' ? theme.colors.blue[6] : theme.colors.gray[4]}`,
							borderRadius: theme.radius.sm,
							backgroundColor: theme.colors.gray[1],
							cursor: 'pointer',
							transition: 'border-color 0.2s',
							'&:hover': {
								borderColor: theme.colors.blue[6],
							},
						})}
						onClick={() => setSelectedOption('login')}
					>
						<Text fw={600}>Already have a CookieX account?</Text>
						<Text size="sm" color="dimmed">
							If you have an existing web app account, simply log
							in and connect to get started seamlessly.
						</Text>
					</Box>

					{/* Divider */}
					<Divider label="OR" labelPosition="center" my="md" />

					{/* Don't have an account Box */}
					<Box
						p="md"
						style={(theme) => ({
							border: `2px solid ${selectedOption === 'register' ? theme.colors.blue[6] : theme.colors.gray[4]}`,
							borderRadius: theme.radius.sm,
							backgroundColor: theme.colors.gray[1],
							cursor: 'pointer',
							transition: 'border-color 0.2s',
							'&:hover': {
								borderColor: theme.colors.blue[6],
							},
						})}
						onClick={() => setSelectedOption('register')}
					>
						<Text fw={600}>{"Don't have a CookieX account?"}</Text>
						<Text size="sm" color="dimmed">
							{
								'Join CookieX to take control of your website’s compliance effortlessly. Register now to get started with consent management.'
							}
						</Text>
					</Box>
					<Group mt="md">
						{selectedOption && (
							<Button color="blue" onClick={openCMP}>
								{selectedOption === 'login'
									? 'Login & Connect'
									: 'Register & Connect'}
							</Button>
						)}
					</Group>
				</Modal>
			</Container>
		</>
	);
}

export default OnBoardPanel;
