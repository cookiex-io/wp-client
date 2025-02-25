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
import { useState, useEffect } from 'react';

const onboardingSteps = [
	{ id: 1, title: '1. Registering your domain', description: '' },
	{ id: 2, title: '2. Scanning your site for cookies', description: '' },
	{ id: 3, title: '3. Creating your banner', description: '' },
	{ id: 4, title: '4. Activating consent management', description: '' },
];

function OnBoardPanel() {
	const [openedItems, setOpenedItems] = useState<string[]>(['description']);
	const [currentStep, setCurrentStep] = useState(0);
	const [isOnBoardCompleted, setIsOnBoardCompleted] =
		useState<boolean>(false);
	const [stepStatuses, setStepStatuses] = useState(
		onboardingSteps.map(() => 'pending') // pending, success, failed
	);
	const [stepDescriptions, setStepDescriptions] = useState(
		onboardingSteps.map(() => '')
	);

	const handleCloseAccordion = () => {
		setOpenedItems([]);
	};

	const openCMP = () => {
		window.open(
			runtimeConfig.cmpRedirectUrl,
			'_blank',
			'noopener,noreferrer'
		);
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

		if (stepIndex === onboardingSteps.length - 1 && status === 'success') {
			setTimeout(() => {
				setIsOnBoardCompleted(false);
			}, 1000);
		}
	};

	useEffect(() => {
		runtimeConfig
			.apiFetch({ path: '/cookiex/v1/welcome-status' })
			.then((response: any) => {
				setIsOnBoardCompleted(response.show_welcome);
			});
	}, []);

	useEffect(() => {
		if (isOnBoardCompleted && currentStep < onboardingSteps.length) {
			switch (currentStep) {
				case 0:
					updateStep(0, 'pending', 'Registering your domain...');
					runtimeConfig
						.apiFetch({
							path: '/cookiex/v1/register',
							method: 'POST',
						})
						.then((response) => {
							if (response.status) {
								updateStep(
									0,
									'success',
									'Domain registered successfully!'
								);
								setCurrentStep((prevStep) => prevStep + 1);
							} else {
								updateStep(
									0,
									'failed',
									'Domain registration failed.'
								);
							}
						})
						.catch(() =>
							updateStep(0, 'failed', 'Registration failed.')
						);
					break;
				case 1:
					updateStep(
						1,
						'pending',
						'Scanning your site for cookies...'
					);
					runtimeConfig
						.apiFetch({
							path: '/cookiex/v1/quickscan',
							method: 'POST',
						})
						.then((response) => {
							if (response.status) {
								updateStep(
									1,
									'success',
									'Cookies scanned successfully.'
								);
								setCurrentStep((prevStep) => prevStep + 1);
							} else {
								updateStep(
									1,
									'failed',
									'Cookie scanning failed.'
								);
							}
						})
						.catch(() =>
							updateStep(1, 'failed', 'Scanning failed.')
						);
					break;
				case 2:
					updateStep(2, 'success', 'Banner created successfully.');
					setCurrentStep((prevStep) => prevStep + 1);
					break;
				case 3:
					updateStep(
						3,
						'pending',
						'Activating consent management...'
					);
					runtimeConfig
						.apiFetch({
							path: '/cookiex/v1/enable-consent-management',
							method: 'POST',
						})
						.then((response) => {
							if (response.status) {
								updateStep(
									3,
									'success',
									'Consent management activated.'
								);
								setCurrentStep((prevStep) => prevStep + 1);
							} else {
								updateStep(3, 'failed', 'Activation failed.');
							}
						})
						.catch(() =>
							updateStep(3, 'failed', 'Activation failed.')
						);
					break;
			}
		}
	}, [currentStep, isOnBoardCompleted]);

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
												(step, index) => (
													<Timeline.Item
														key={step.id}
														bullet={getStepIcon(
															stepStatuses[index]
														)}
														title={step.title}
													>
														<Text
															c={
																stepStatuses[
																	index
																] === 'failed'
																	? 'red'
																	: 'dimmed'
															}
															size="sm"
														>
															{stepDescriptions[
																index
															] || 'Pending...'}
														</Text>
													</Timeline.Item>
												)
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
														Well done! 🎉 You have
														successfully implemented
														a cookie banner on your
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
														To initiate an automatic
														cookie scan, you need to
														connect to the CookieYes
														web app. By connecting
														you can:
													</Text>
												</Timeline.Item>
											</Timeline>
											<Group mt="md">
												<Button
													color="blue"
													onClick={openCMP}
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
					<CookieBanner />
				</Tabs.Panel>
			</Tabs>
		</Container>
	);
}

export default OnBoardPanel;
