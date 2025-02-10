import React, { useEffect, useState } from 'react';
import {
	Container,
	Title,
	Text,
	Button,
	Center,
	Image,
	Paper,
	Stepper,
	Progress,
	Stack,
} from '@mantine/core';
import { runtimeConfig } from '../config';

const onboardingSteps = [
	{ id: 1, title: '1. Registering your domain', description: '' },
	{ id: 2, title: '2. Scanning your site for cookies', description: '' },
	{ id: 3, title: '3. Creating your banner', description: '' },
	{ id: 4, title: '4. Activating consent management', description: '' },
];

export function Welcome(props: any) {
	const [currentStep, setCurrentStep] = useState(0);
	const [onboardNow, setOnboardNow] = useState(false);
	const [stepDescriptions, setStepDescriptions] = useState(
		onboardingSteps.map(() => '')
	);
	const progressValue = (currentStep / onboardingSteps.length) * 100;

	const handleOnboardingComplete = () => {
		props.onComplete?.();
		props.renderComponent('Dashboard');
	};

	const updateStepDescription = (step: number, description: string) => {
		setStepDescriptions((prev) => {
			const newDescriptions = [...prev];
			newDescriptions[step] = description;
			return newDescriptions;
		});
	};

	useEffect(() => {
		if (onboardNow && currentStep < onboardingSteps.length) {
			const timer = setTimeout(() => {
				setCurrentStep((prevStep) => prevStep + 1);
			}, 2000);
			switch (currentStep) {
				case 0:
					updateStepDescription(0, 'Registering your domain');
					runtimeConfig
						.apiFetch({
							path: '/cookiex/v1/register',
							method: 'POST',
						})
						.then((response: any) => {
							if (response.status) {
								updateStepDescription(
									0,
									'Domain registered with ID: ' +
										response.domainId
								);
								setCurrentStep((prevStep) => prevStep + 1);
							}
						})
						.catch((error) => {
							updateStepDescription(
								0,
								'Registration unsuccessful' + error
							);
						});
					break;
				case 1:
					// Start cookie scanning
					updateStepDescription(1, 'Scanning your site for cookies');
					runtimeConfig
						.apiFetch({
							path: '/cookiex/v1/quickscan',
							method: 'POST',
						})
						.then((response: any) => {
							if (response.status) {
								let description =
									'Cookies scanned successfully';

								// Add additional details if available
								if (response.type === 'existing') {
									const scanDate = new Date(
										response.last_scan
									).toLocaleDateString();
									description =
										`Last scan from ${scanDate}\n` +
										`Pages scanned: ${response.pages}\n` +
										`Cookies found: ${response.cookies_count}`;
								} else if (response.type === 'quick') {
									description =
										`Quick scan completed\n` +
										`Cookies found: ${response.cookies_count}`;
								}

								updateStepDescription(1, description);
								setCurrentStep((prevStep) => prevStep + 1);
							}
						})
						.catch((error) => {
							updateStepDescription(
								1,
								'Scanning failed, please try again: ' + error
							);
						});
					break;
				case 2:
					updateStepDescription(2, 'Creating your banner');
					updateStepDescription(2, 'Banner created successfully');
					setCurrentStep((prevStep) => prevStep + 1);
					break;
				case 3:
					runtimeConfig
						.apiFetch({
							path: '/cookiex/v1/enable-consent-management',
							method: 'POST',
						})
						.then((response: any) => {
							if (response.status) {
								updateStepDescription(
									3,
									'Consent management activated'
								);
								setCurrentStep((prevStep) => prevStep + 1);
							}
						})
						.catch((error) => {
							updateStepDescription(
								3,
								'Consent management activation failed' + error
							);
						});
					break;
			}
			return () => clearTimeout(timer);
		}
	}, [currentStep, onboardNow]);

	return (
		<Container size="md" mt="md">
			<Center>
				<Image w="180" src={runtimeConfig.logoUrl} alt="Cookiex logo" />
			</Center>
			<Progress value={progressValue} size="xs" radius="xs" mt="md" />
			<Paper shadow="md" p="md" radius="md" pos="relative">
				{!onboardNow && (
					<Paper
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: 'rgba(255, 255, 255, 0.99)',
							zIndex: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Stack align="center" gap="xs">
							<Title order={1} ta="center">
								Cookie Compliance Made Easy
							</Title>
							<Text size="lg" ta="center" maw={500} mx="auto">
								Seamlessly track cookie consents using
								personalized cookie banners and handle all your
								cookie compliance tasks with ease
							</Text>
							<Text
								fs="italic"
								ta="center"
								maw={500}
								mx="auto"
								mt="md"
							>
								When you start below, your domain name will be
								used to register with the cookie consent
								management service
							</Text>
							<Button
								radius="md"
								size="xl"
								mt="md"
								onClick={() => setOnboardNow(true)}
							>
								Configure Now
							</Button>
						</Stack>
					</Paper>
				)}
				<Stepper active={currentStep} size="md" orientation="vertical">
					<Stepper.Completed>
						<Button
							radius="md"
							size="xl"
							onClick={handleOnboardingComplete}
						>
							Go to Dashboard
						</Button>
					</Stepper.Completed>
					{onboardingSteps.map((step, index) => (
						<Stepper.Step
							key={step.id}
							label={step.title}
							description={stepDescriptions[index]}
						></Stepper.Step>
					))}
				</Stepper>
			</Paper>
		</Container>
	);
}
