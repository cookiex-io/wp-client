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
import {
	IconCheck,
	IconCircleCheckFilled,
	IconCircleFilled,
	IconExternalLink,
} from '@tabler/icons-react';
import OverView from './OverView';
import { CookieBanner } from './CookieBanner';
import { runtimeConfig } from '../config';
import { useState, useEffect } from 'react';
import { finalConsentConfig } from '../utils/utils';
import { Welcome } from './Welcome';

function OnBoardPanel() {
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<any>('dashboard'); // Default to dashboard
	const [openedItems, setOpenedItems] = useState<string[]>(['description']);
	const [consentConfig, setConsentConfig] = useState<any>(finalConsentConfig);
	const [tempToken, setTempToken] = useState('');
	const [isOnBoardCompleted, setIsOnBoardCompleted] =
		useState<boolean>(false);
	const [showFirstTimeScreen, setShowFirstTimeScreen] = useState(false);
	const [isConnected, setIsConnected] = useState(false);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isWebsiteConnecting, setIsWebsiteConnecting] = useState(false);
	const [disconnectMessage, setDisconnectMessage] = useState<string | null>(
		null
	);
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

	useEffect(() => {
		const checkConnectionStatus = async () => {
			try {
				const response = await runtimeConfig.apiFetch({
					path: '/cookiex/v1/connection-status',
					method: 'GET',
				});

				if (response.connected) {
					setIsConnected(true);
					setShowFirstTimeScreen(false);
				} else {
					setIsConnected(false);
				}
				setLoading(false);
			} catch (error) {
				console.error('Error checking connection status:', error);
				setLoading(false);
			}
		};

		// Check connection status once when the component loads
		checkConnectionStatus();
	}, [isConnected, showFirstTimeScreen]);

	const openCMP = async () => {
		setIsWebsiteConnecting(true);
		const currentUrl = window.location.href;
		const urlObject = new URL(currentUrl);
		const domainUrl = urlObject.origin;
		const tokenRes = (await validateTempToken()) || tempToken;
		const token = window.btoa(tokenRes);

		if (selectedOption) {
			const url = `${runtimeConfig.cmpRedirectUrl}/connect?website=${consentConfig?.domainUrl || domainUrl}&mode=${selectedOption}&token=${token}`;
			window.open(url, '_blank', 'noopener,noreferrer');
			setIsModalOpen(false);
			// Poll for connection status every 15 seconds
			const interval = setInterval(async () => {
				try {
					const statusResponse = await runtimeConfig.apiFetch({
						path: '/cookiex/v1/connection-status',
						method: 'GET',
					});

					if (statusResponse?.connected) {
						setIsWebsiteConnecting(false);
						setIsConnected(true);
						setShowFirstTimeScreen(true);
						clearInterval(interval);
					}
				} catch (error) {
					console.error('Error fetching connection status:', error);
				}
			}, 15000);
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

	const handleUserAcknowledgement = async () => {
		setShowFirstTimeScreen(false);
	};

	const handleDisconnect = async () => {
		try {
			const response = await runtimeConfig.apiFetch({
				path: '/cookiex/v1/disconnect',
				method: 'POST',
			});

			if (response.status === 'success') {
				setDisconnectMessage(
					response.message || 'Successfully disconnected.'
				);
				setIsConnected(false);
				setTimeout(function () {
					setActiveTab('dashboard');
				}, 1000);
			} else {
				setDisconnectMessage('Failed to disconnect. Please try again.');
			}
		} catch (error) {
			console.error('Error disconnecting:', error);
			setDisconnectMessage('An error occurred while disconnecting.');
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

			<Container fluid>
				{isConnected && showFirstTimeScreen ? (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							minHeight: '70vh', // Ensures it covers the full viewport height
							width: '100%', // Full width
						}}
					>
						<Card p="xl">
							<Group justify="center">
								<IconCircleCheckFilled
									size={50}
									color="green"
								/>
							</Group>
							<Title ta="center" order={4} mt="md">
								Your website is connected to CookieX Web App
							</Title>
							<Text ta="center" size="sm" mt="sm">
								You can now continue to manage all settings from
								your web app account.
							</Text>
							<Group justify="center" mt="md">
								<Button
									color="blue"
									component="a"
									href={`${runtimeConfig.cmpRedirectUrl}/dashboard`}
									target="_blank"
									onClick={handleUserAcknowledgement}
									rightSection={<IconExternalLink />}
								>
									Go to Web App
								</Button>
							</Group>
						</Card>
					</div>
				) : (
					<>
						<Tabs value={activeTab} onChange={setActiveTab}>
							<Tabs.List style={{ fontSize: '1.2rem' }}>
								<Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
								{!isOnBoardCompleted && (
									<Tabs.Tab value="settings">
										Cookie Banner
									</Tabs.Tab>
								)}
								{isConnected && (
									<Tabs.Tab value="siteSettings">
										Site Settings
									</Tabs.Tab>
								)}
							</Tabs.List>
							<Tabs.Panel value="siteSettings">
								{disconnectMessage && (
									<Text
										color={
											disconnectMessage.includes(
												'Successfully'
											)
												? 'green'
												: 'red'
										}
										mb={10}
										mt={10}
									>
										{disconnectMessage}
									</Text>
								)}
								<Card p="lg" mt={20}>
									<Group align="center">
										<IconCircleCheckFilled
											size={30}
											color="green"
										/>
										<Title order={4}>
											Your website is connected to CookieX
										</Title>
									</Group>

									<Text size="sm" mt="xs">
										You can access all the plugin settings
										(Cookie Banner, Cookie Manager,
										Languages & Policy Generators) on the
										web app and unlock new features like
										Cookie Scan and Consent Log.
									</Text>

									<Divider my="md" />

									<Stack p="xs">
										<Text size="sm">
											<strong>Email:</strong>{' '}
											sqs@eefef.com
										</Text>
										<Text size="sm">
											<strong>Site Key:</strong>{' '}
											37fbc26b38391d2f7322dd82
										</Text>
										<Text size="sm">
											<strong>Plan:</strong> Free
										</Text>
									</Stack>

									<Group mt="md">
										<Button
											color="blue"
											component="a"
											href={`${runtimeConfig.cmpRedirectUrl}/dashboard`}
											target="_blank"
											rightSection={<IconExternalLink />}
										>
											Go to Web App
										</Button>

										<Button
											color="red"
											variant="outline"
											onClick={handleDisconnect}
										>
											Disconnect
										</Button>
									</Group>
								</Card>
							</Tabs.Panel>
							<Tabs.Panel value="dashboard">
								<Container fluid>
									{isConnected && !showFirstTimeScreen ? (
										<Card mt={20} p="xl" pl={0}>
											<Group>
												<IconCircleCheckFilled
													size={20}
													color="green"
												/>
												<Text fw={500}>
													Your website is connected to
													CookieX Web App
												</Text>
											</Group>
											<Text size="sm" mt="xs">
												You can access all the plugin
												settings (Cookie Banner, Cookie
												Manager, Languages, and Policy
												Generators) on the web app and
												unlock new features like Cookie
												Scanner and Consent Log.
											</Text>
											<Group mt="md">
												<Button
													color="blue"
													component="a"
													href={`${runtimeConfig.cmpRedirectUrl}/dashboard`}
													target="_blank"
													rightSection={
														<IconExternalLink />
													}
												>
													Go to Web App
												</Button>
											</Group>
										</Card>
									) : (
										<>
											<Accordion
												variant="outline"
												mt={30}
												multiple
												value={openedItems}
												onChange={setOpenedItems}
												style={{
													border: '1px solid #dee2e6',
												}}
											>
												<Accordion.Item value="description">
													<Accordion.Control>
														<Stack gap={0}>
															<Title order={6}>
																Get started with
																CookieX
															</Title>
															<Text
																size="sm"
																mt="xs"
															>
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
																	bulletSize={
																		30
																	}
																	lineWidth={
																		5
																	}
																	pt={30}
																>
																	<Timeline.Item
																		title="Activate your cookie banner"
																		bullet={
																			<ThemeIcon
																				color="blue"
																				size={
																					30
																				}
																				radius="xl"
																			>
																				<IconCheck
																					size={
																						20
																					}
																				/>
																			</ThemeIcon>
																		}
																	>
																		<Text size="xs">
																			Well
																			done!
																			🎉
																			You
																			have
																			successfully
																			implemented
																			a
																			cookie
																			banner
																			on
																			your
																			website.
																		</Text>
																	</Timeline.Item>
																	<Timeline.Item
																		title="Connect and scan your website"
																		bullet={
																			<ThemeIcon
																				variant="outline"
																				size={
																					30
																				}
																				radius="xl"
																			>
																				<IconCircleFilled
																					color="white"
																					size={
																						20
																					}
																				/>
																			</ThemeIcon>
																		}
																	>
																		<Text size="xs">
																			To
																			initiate
																			an
																			automatic
																			cookie
																			scan,
																			you
																			need
																			to
																			connect
																			to
																			the
																			CookieYes
																			web
																			app.
																			By
																			connecting
																			you
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
																		loading={
																			isWebsiteConnecting
																		}
																		rightSection={
																			<IconExternalLink />
																		}
																	>
																		Connect
																		to Web
																		App
																	</Button>
																	<Button
																		variant="subtle"
																		onClick={
																			handleCloseAccordion
																		}
																	>
																		Do it
																		later
																	</Button>
																</Group>
															</>
														)}
													</Accordion.Panel>
												</Accordion.Item>
											</Accordion>
										</>
									)}
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
														<Text fw={500}>
															OverView
														</Text>
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
									<CookieBanner
										consentConfig={consentConfig}
									/>
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
								<Text fw={600}>
									Already have a CookieX account?
								</Text>
								<Text size="sm" color="dimmed">
									If you have an existing web app account,
									simply log in and connect to get started
									seamlessly.
								</Text>
							</Box>

							{/* Divider */}
							<Divider
								label="OR"
								labelPosition="center"
								my="md"
							/>

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
								<Text fw={600}>
									{"Don't have a CookieX account?"}
								</Text>
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
					</>
				)}
			</Container>
		</>
	);
}

export default OnBoardPanel;
