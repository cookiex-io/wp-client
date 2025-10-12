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
	rem,
	Paper,
	Image,
} from '@mantine/core';
import {
	IconCheck,
	IconCircleFilled,
	IconLayoutGrid,
	IconPencilBolt,
	IconSettings,
	IconWorld,
	IconX,
} from '@tabler/icons-react';
import OverView from './OverView';
import { CookieBanner } from './CookieBanner';
import { runtimeConfig } from '../config';
import { useState, useEffect } from 'react';
import { finalConsentConfig, COLORS } from '../utils/utils';
import { Welcome } from './Welcome';
import classes from './OnBoardPanel.module.css';
import CookieIcon from '../assets/logo-icon.svg';

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
	const [userDetails, setUserDetails] = useState<any>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isWebsiteConnecting, setIsWebsiteConnecting] = useState(false);
	const [disconnectMessage, setDisconnectMessage] = useState<string | null>(
		null
	);
	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
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

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				const response = await runtimeConfig.apiFetch({
					path: '/cookiex/v1/user-details',
					method: 'GET',
					headers: { accept: 'application/json' },
				});

				if (response) {
					setUserDetails(response.data);
				}
			} catch (error) {
				console.error('Error fetching user details:', error);
			}
		};

		if (isConnected) {
			fetchUserDetails();
		}
	}, [isConnected]);

	const openCMP = async (selectedOpt: 'login' | 'register' | null) => {
		setIsWebsiteConnecting(true);
		const currentUrl = window.location.href;
		const urlObject = new URL(currentUrl);
		const domainUrl = urlObject.origin;
		const tokenRes = (await validateTempToken()) || tempToken;
		const token = window.btoa(tokenRes);

		if (selectedOpt) {
			const url = `${runtimeConfig.cmpRedirectUrl}/connect?website=${consentConfig?.domainUrl || domainUrl}&mode=${selectedOpt}&token=${token}`;
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
				// Convert string "1"/"0" or "true"/"false" to boolean
				const isCompleted =
					response.show_welcome === '1' ||
					response.show_welcome === 1 ||
					response.show_welcome === true;

				setIsOnBoardCompleted(isCompleted);
			})
			.catch((error) => {
				console.error('Failed to fetch welcome status', error);
			});
	}, [isOnBoardCompleted]);

	useEffect(() => {
		fetchSettings();
	}, []);

	const fetchSettings = async () => {
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
	};

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

	const RenderConntectedSection = () => {
		return (
			<Card mt={20} p="md" withBorder>
				<Group>
					<Text className={classes.dashboardGetStarted} fw={600}>
						Your website is connected to CookieX Web App
					</Text>
				</Group>
				<Text className={classes.dashboardGetStartedDesc} mt="xs">
					You can access all the plugin settings (Cookie Banner,
					Cookie Manager, Languages, and Policy Generators) on the web
					app and unlock new features like Cookie Scanner and Consent
					Log.
				</Text>
				<Group mt="md">
					<Button
						className={classes.dashboardGetStartedButton}
						radius="16px"
						color="blue"
						component="a"
						href={`${runtimeConfig.cmpRedirectUrl}/dashboard`}
						target="_blank"
						leftSection={<IconWorld />}
					>
						Go to Web App
					</Button>
				</Group>
			</Card>
		);
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
						<RenderConntectedSection />
					</div>
				) : (
					<>
						<Box
							style={{
								display: 'flex',
								padding: '16px 0px',
								flexDirection: 'column',
								alignItems: 'flex-start',
								background: COLORS.page,
								position: 'relative',
								width: '100%',
							}}
						>
							<Box
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'flex-start',
									width: '100%',
									marginBottom: '16px',
								}}
							>
								<Tabs
									defaultValue="dashboard"
									variant="outline"
									classNames={{
										root: classes.root,
										list: classes.list,
										tab: classes.tab,
										tabLabel: classes.tabLabel,
									}}
									value={activeTab}
									onChange={setActiveTab}
								>
									<Tabs.List>
										<Tabs.Tab
											value="dashboard"
											leftSection={
												<IconLayoutGrid size={24} />
											}
										>
											Dashboard
										</Tabs.Tab>
										{!isOnBoardCompleted && (
											<Tabs.Tab
												value="settings"
												onClick={fetchSettings}
												leftSection={
													<IconPencilBolt size={24} />
												}
											>
												Consent Banner
											</Tabs.Tab>
										)}
										{isConnected && (
											<Tabs.Tab
												value="siteSettings"
												leftSection={
													<IconSettings size={24} />
												}
											>
												Site Settings
											</Tabs.Tab>
										)}
									</Tabs.List>
									<Box
										bg="#F8FAFB"
										style={{ border: '1px solid #E5E5E5' }}
									>
										<Tabs.Panel value="siteSettings">
											<div style={{ padding: '16px' }}>
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
												<RenderConntectedSection />
												<Card p="lg" mt={20} withBorder>
													<Card.Section
														p="md"
														pl="lg"
													>
														<Text fw={600}>
															Details of the
															Company/User
														</Text>
													</Card.Section>
													<Divider />
													{userDetails && (
														<Stack p="xs">
															<div>
																<Text size="sm">
																	<strong>
																		Name:
																	</strong>{' '}
																</Text>
																<Text c="#0BA565">
																	{userDetails.name ||
																		'N/A'}
																</Text>
															</div>
															<div>
																<Text size="sm">
																	<strong>
																		Email:
																	</strong>{' '}
																</Text>
																<Text c="#0BA565">
																	{userDetails.email ||
																		'N/A'}
																</Text>
															</div>
															<div>
																<Text size="sm">
																	<strong>
																		Email
																		Verified:
																	</strong>{' '}
																</Text>
																<Text c="#0BA565">
																	{userDetails.emailVerified
																		? 'Yes'
																		: 'No'}
																</Text>
															</div>
															<div>
																<Text size="sm">
																	<strong>
																		Joined
																		On:
																	</strong>{' '}
																</Text>
																<Text c="#0BA565">
																	{userDetails.joinedOn ||
																		'N/A'}
																</Text>
															</div>
														</Stack>
													)}

													<Group mt="md">
														<Button
															className={
																classes.dashboardGetStartedButton
															}
															radius="16px"
															color="blue"
															component="a"
															href={`${runtimeConfig.cmpRedirectUrl}/dashboard`}
															target="_blank"
															leftSection={
																<IconWorld />
															}
														>
															Go to Web App
														</Button>

														<Button
															className={
																classes.dashboardGetStartedButton
															}
															color="red"
															radius="16px"
															variant="outline"
															onClick={
																handleDisconnect
															}
														>
															Disconnect
														</Button>
													</Group>
												</Card>
											</div>
										</Tabs.Panel>
										<Tabs.Panel value="dashboard">
											<Container fluid>
												{isConnected &&
												!showFirstTimeScreen ? (
													<RenderConntectedSection />
												) : (
													<>
														<Accordion
															className={
																classes.dashboardSection
															}
															variant="outline"
															mt={30}
															multiple
															value={openedItems}
															onChange={
																setOpenedItems
															}
															style={{
																border: '1px solid #dee2e6',
															}}
														>
															<Accordion.Item value="description">
																<Accordion.Control>
																	<Stack
																		gap={10}
																	>
																		<Title
																			className={
																				classes.dashboardGetStarted
																			}
																		>
																			{
																				'Get started with CookieX'
																			}
																		</Title>
																		<Text
																			className={
																				classes.dashboardGetStartedDesc
																			}
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
																				color="#0FA958"
																				active={
																					1
																				}
																				bulletSize={
																					24
																				}
																				lineWidth={
																					2
																				}
																				pt={
																					30
																				}
																				classNames={{
																					itemTitle:
																						classes.timeLineTitle,
																				}}
																			>
																				<Timeline.Item
																					lineVariant="dashed"
																					title="Activate your cookie banner"
																					bullet={
																						<ThemeIcon
																							color="#0FA958"
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
																					<Text
																						className={
																							classes.timeLineDesc
																						}
																					>
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
																					<Text
																						className={
																							classes.timeLineDesc
																						}
																					>
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
																					className={
																						classes.dashboardGetStartedButton
																					}
																					radius="16px"
																					color="blue"
																					onClick={
																						handleOpenModal
																					}
																					loading={
																						isWebsiteConnecting
																					}
																					leftSection={
																						<IconWorld />
																					}
																				>
																					Go
																					to
																					Web
																					App
																				</Button>
																				<Button
																					className={
																						classes.dashboardDoItLaterButton
																					}
																					onClick={
																						handleCloseAccordion
																					}
																				>
																					Do
																					it
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
														<Title
															order={3}
															mt={20}
															mb={20}
														>
															Overview
														</Title>
														<OverView
															isConnected={
																isConnected
															}
															classes={classes}
														/>
														<Divider />
													</>
												)}
											</Container>
										</Tabs.Panel>
										<Tabs.Panel
											value="settings"
											mt={30}
											style={{
												border: '1px solid #dee2e6',
											}}
											p={20}
										>
											{consentConfig && (
												<CookieBanner
													consentConfig={
														consentConfig
													}
												/>
											)}
										</Tabs.Panel>
									</Box>
								</Tabs>
							</Box>
						</Box>

						<Modal
							opened={isModalOpen}
							onClose={handleCloseModal}
							withCloseButton={false}
							centered
							size={rem(500)}
							radius="md"
							padding="xl"
						>
							<Box
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: 19,
									background: COLORS.page,
								}}
							>
								<Group
									justify="space-between"
									align="center"
									w="100%"
								>
									<Group gap={4}>
										<Image
											src={CookieIcon}
											alt="Logo"
											w={30}
											h={28}
										/>
										<Text c={COLORS.brand} fw={700} fz={14}>
											Connect to Web App
										</Text>
									</Group>
									<IconX
										onClick={handleCloseModal}
										size={18}
										color={COLORS.brand}
									/>
								</Group>

								<Paper
									withBorder
									p={16}
									bg={COLORS.lightBlueBg}
									style={{
										border: `1px solid ${COLORS.lightBlueBorder}`,
										borderRadius: 4,
										gap: 10,
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<Text fw={700} fz={14}>
										Already have a CookieX account ?
									</Text>
									<Text c={COLORS.textMuted} fz={16}>
										If you have an existing web app account,
										simply login and connect to get started
										seamlessly
									</Text>
									<Button
										w={109}
										h={36}
										radius={9}
										bg={COLORS.brand}
										onClick={() => openCMP('login')}
									>
										<Text c="#FFF" fz={16}>
											Sign In
										</Text>
									</Button>
								</Paper>

								<Divider
									size="sm"
									label="OR"
									labelPosition="center"
								/>

								<Paper
									withBorder
									p={16}
									bg={COLORS.lightBlueBg}
									style={{
										border: `1px solid ${COLORS.lightBlueBorder}`,
										borderRadius: 4,
										gap: 10,
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<Text fw={700} fz={14}>
										Don’t have CookieX account ?
									</Text>
									<Text c={COLORS.textMuted} fz={16}>
										Join Cookiex to take control of your
										website’s compliance effortlessly.
										Register now to get started with consent
										management.
									</Text>
									<Button
										w={109}
										h={36}
										radius={9}
										bg={COLORS.brand}
										onClick={() => openCMP('register')}
									>
										<Text c="#FFF" fz={16}>
											Sign Up
										</Text>
									</Button>
								</Paper>
							</Box>
						</Modal>
					</>
				)}
			</Container>
		</>
	);
}

export default OnBoardPanel;
