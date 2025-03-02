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
	IconX,
	IconClock,
	IconCircleFilled,
} from '@tabler/icons-react';
import OverView from './OverView';
import { CookieBanner } from './CookieBanner';
import { runtimeConfig } from '../config';
import { useState, useEffect, useCallback } from 'react';
import { finalConsentConfig } from '../utils/utils';

const onboardingSteps = [
	{ id: 1, title: '1. Registering your domain', description: '' },
	{ id: 2, title: '2. Scanning your site for cookies', description: '' },
	{ id: 3, title: '3. Creating your banner', description: '' },
	{ id: 4, title: '4. Activating consent management', description: '' },
];

function OnBoardPanel() {
	const [loading, setLoading] = useState(true);
	const [openedItems, setOpenedItems] = useState<string[]>(['description']);
	const [currentStep, setCurrentStep] = useState(0);
	const [consentConfig, setConsentConfig] = useState<any>(finalConsentConfig);
	const [isOnBoardCompleted, setIsOnBoardCompleted] =
		useState<boolean>(false);
	const [stepStatuses, setStepStatuses] = useState(
		onboardingSteps.map(() => 'pending') // pending, success, failed
	);
	const [stepDescriptions, setStepDescriptions] = useState(
		onboardingSteps.map(() => '')
	);

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

	const openCMP = () => {
		if (selectedOption) {
			const url = `${runtimeConfig.cmpRedirectUrl}/connect?website=${consentConfig?.domainUrl}&mode=${selectedOption}`;
			window.open(url, '_blank', 'noopener,noreferrer');
		}
	};

	const updateStep = (stepIndex: any, status: any, description = '') => {
		setStepStatuses((prev) => {
			const updated = [...prev];
			updated[stepIndex] = status;
			return updated;
		});

		setStepDescriptions((prev) => {
			const updated = [...prev];
			updated[stepIndex] = description;
			return updated;
		});

		if (status === 'failed') {
			return;
		}

		// ✅ If last step succeeds, mark onboarding as complete
		if (stepIndex === onboardingSteps.length - 1 && status === 'success') {
			setTimeout(() => {
				setIsOnBoardCompleted(false);
			}, 1000);
		}
	};

	// ✅ Fetch onboarding status once
	useEffect(() => {
		runtimeConfig
			.apiFetch({ path: '/cookiex/v1/welcome-status' })
			.then((response) => {
				setIsOnBoardCompleted(response.show_welcome);
			});
	}, []);

	// ✅ Process steps sequentially
	const executeStep = useCallback(async () => {
		if (!isOnBoardCompleted || currentStep >= onboardingSteps.length) {
			return;
		}

		// ✅ Stop execution if any previous step has failed
		if (
			stepStatuses.some(
				(status, index) => index < currentStep && status === 'failed'
			)
		) {
			return;
		}

		try {
			switch (currentStep) {
				case 0: {
					updateStep(0, 'pending', 'Registering your domain...');
					const registerResponse = await runtimeConfig.apiFetch({
						path: '/cookiex/v1/register',
						method: 'POST',
					});

					if (registerResponse.status) {
						updateStep(
							0,
							'success',
							'Domain registered successfully!'
						);
						setCurrentStep(1);
					} else {
						updateStep(0, 'failed', 'Domain registration failed.');
					}
					break;
				}

				case 1: {
					updateStep(
						1,
						'pending',
						'Scanning your site for cookies...'
					);
					const scanResponse = await runtimeConfig.apiFetch({
						path: '/cookiex/v1/quickscan',
						method: 'POST',
					});

					if (scanResponse.status) {
						updateStep(
							1,
							'success',
							'Cookies scanned successfully.'
						);
						setCurrentStep(2);
					} else {
						updateStep(1, 'failed', 'Cookie scanning failed.');
					}
					break;
				}

				case 2: {
					updateStep(2, 'pending', 'Creating your banner...');
					await new Promise((resolve) => setTimeout(resolve, 1000));
					updateStep(2, 'success', 'Banner created successfully.');
					setCurrentStep(3);
					break;
				}

				case 3: {
					updateStep(
						3,
						'pending',
						'Activating consent management...'
					);
					const consentResponse = await runtimeConfig.apiFetch({
						path: '/cookiex/v1/enable-consent-management',
						method: 'POST',
					});

					if (consentResponse.status) {
						updateStep(
							3,
							'success',
							'Consent management activated.'
						);
					} else {
						updateStep(3, 'failed', 'Activation failed.');
					}
					break;
				}
			}
		} catch (error) {
			updateStep(currentStep, 'failed', 'An error occurred.');
		}
	}, [currentStep, isOnBoardCompleted, stepStatuses]);

	useEffect(() => {
		executeStep();
	}, [currentStep, executeStep]);

	useEffect(() => {
		try {
			setLoading(true);
			runtimeConfig
				.apiFetch({
					path: '/cookiex/v1/settings',
				})
				.then((res: any) => {
					setConsentConfig(res);
				});
			setLoading(false);
		} catch (error) {
			console.error('Failed to fetch settings:', error);
			setLoading(false);
		}
	}, []);

	const getStepIcon = (status: string) => {
		if (status === 'success') {
			return (
				<ThemeIcon color="blue" size={30} radius="xl">
					<IconCheck size={20} />
				</ThemeIcon>
			);
		}
		if (status === 'failed') {
			return (
				<ThemeIcon color="red" size={30} radius="xl">
					<IconX size={20} />
				</ThemeIcon>
			);
		}
		return (
			<ThemeIcon color="gray" size={30} radius="xl">
				<IconClock size={20} />
			</ThemeIcon>
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
											<Timeline
												active={currentStep}
												lineWidth={5}
												bulletSize={30}
												pt={30}
											>
												{onboardingSteps.map(
													(step, index) => {
														// Determine line color based on step status
														let lineColor = 'gray'; // Default

														if (
															stepStatuses[
																index
															] === 'failed'
														) {
															lineColor = 'red';
														} else if (
															stepStatuses[
																index
															] === 'success'
														) {
															lineColor = 'blue';
														}

														return (
															<Timeline.Item
																key={step.id}
																bullet={getStepIcon(
																	stepStatuses[
																		index
																	]
																)}
																title={
																	step.title
																}
																style={{
																	'&::before':
																		{
																			backgroundColor:
																				lineColor,
																		},
																}}
															>
																<Text
																	c={
																		stepStatuses[
																			index
																		] ===
																		'failed'
																			? 'red'
																			: 'dimmed'
																	}
																	size="sm"
																>
																	{stepDescriptions[
																		index
																	] ||
																		'Pending...'}
																</Text>
															</Timeline.Item>
														);
													}
												)}
												{isOnBoardCompleted &&
													stepStatuses.some(
														(status) =>
															status === 'failed'
													) && (
														<Group mt="md">
															<Button
																color="red"
																onClick={() => {
																	// ✅ Reset all statuses to "pending"
																	setStepStatuses(
																		onboardingSteps.map(
																			() =>
																				'pending'
																		)
																	);
																	setStepDescriptions(
																		onboardingSteps.map(
																			() =>
																				''
																		)
																	);
																	setCurrentStep(
																		0
																	); // Restart from step 0
																}}
															>
																Retry
															</Button>
														</Group>
													)}
											</Timeline>
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
