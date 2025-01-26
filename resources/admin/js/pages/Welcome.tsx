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
	const progressValue = (currentStep / onboardingSteps.length) * 100;

	const handleOnboardingComplete = () => {
		props.onComplete?.();
		props.renderComponent('ConsentDashboard');
	};

	useEffect(() => {
		if (onboardNow && currentStep < onboardingSteps.length) {
			const timer = setTimeout(() => {
				setCurrentStep((prevStep) => prevStep + 1);
			}, 2000);
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
								used to register the cookie consent management
								service
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
					{onboardingSteps.map((step) => (
						<Stepper.Step key={step.id} label={step.title}>
							<Text size="sm" c="dimmed">
								{step.description}
							</Text>
						</Stepper.Step>
					))}
				</Stepper>
			</Paper>
		</Container>
	);
}
