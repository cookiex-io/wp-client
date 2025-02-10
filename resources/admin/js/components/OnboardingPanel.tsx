import React from 'react';
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

interface OnboardingPanelProps {
	progressValue: number;
	onboardNow: boolean;
	currentStep: number;
	stepDescriptions: string[];
	onboardingSteps: Array<{
		id: number;
		title: string;
		description: string;
	}>;
	logoUrl: string;
	onStartOnboarding: () => void;
	onComplete: () => void;
}

export function OnboardingPanel({
	progressValue,
	onboardNow,
	currentStep,
	stepDescriptions,
	onboardingSteps,
	logoUrl,
	onStartOnboarding,
	onComplete,
}: OnboardingPanelProps) {
	return (
		<Container size="md" mt="md">
			<Center>
				<Image w="180" src={logoUrl} alt="Cookiex logo" />
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
								onClick={onStartOnboarding}
							>
								Configure Now
							</Button>
						</Stack>
					</Paper>
				)}
				<Stepper active={currentStep} size="md" orientation="vertical">
					<Stepper.Completed>
						<Button radius="md" size="xl" onClick={onComplete}>
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
