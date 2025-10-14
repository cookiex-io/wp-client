import React, { useEffect } from 'react';
import {
	Container,
	Paper,
	Stepper,
	Progress,
	Grid,
	Button,
	Loader,
	Group,
	Text,
	ThemeIcon,
	Badge,
	Box,
	Alert,
	rem,
} from '@mantine/core';
import {
	IconX,
	IconClock,
	IconCheck,
	IconRefresh,
	IconInfoCircle,
} from '@tabler/icons-react';

interface OnboardingPanelProps {
	progressValue: number;
	onboardNow: boolean;
	currentStep: number;
	stepDescriptions: string[];
	stepStatuses: ('completed' | 'failed' | 'pending')[];
	onboardingSteps: Array<{ id: number; title: string; description: string }>;
	onStartOnboarding: () => void;
	onComplete: () => void;
}

export function OnboardingPanel({
	progressValue,
	onboardNow,
	currentStep,
	stepDescriptions,
	stepStatuses,
	onboardingSteps,
	onStartOnboarding,
	onComplete,
}: OnboardingPanelProps) {
	useEffect(() => {
		onStartOnboarding();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (
			currentStep === onboardingSteps.length &&
			stepStatuses[onboardingSteps.length - 1] === 'completed'
		) {
			onComplete();
		}
	}, [currentStep, stepStatuses, onboardingSteps.length, onComplete]);

	const retryNeeded = stepStatuses.some((s) => s === 'failed');
	const completedCount = stepStatuses.filter((s) => s === 'completed').length;

	const getStepColor = (status: 'completed' | 'failed' | 'pending') => {
		switch (status) {
			case 'failed':
				return 'red';
			case 'completed':
				return 'teal';
			default:
				return 'gray';
		}
	};

	const StepStatusIcon = ({
		index,
		status,
	}: {
		index: number;
		status: 'completed' | 'failed' | 'pending';
	}) => {
		if (status === 'failed') {
			return (
				<ThemeIcon size={30} radius="xl" variant="light" color="red">
					<IconX size={16} />
				</ThemeIcon>
			);
		}
		if (status === 'completed') {
			return (
				<ThemeIcon size={30} radius="xl" variant="light" color="teal">
					<IconCheck size={16} />
				</ThemeIcon>
			);
		}
		if (index === currentStep) {
			return (
				<ThemeIcon size={30} radius="xl" variant="light" color="blue">
					<Loader size="xs" />
				</ThemeIcon>
			);
		}
		return (
			<ThemeIcon size={30} radius="xl" variant="light" color="gray">
				<IconClock size={16} />
			</ThemeIcon>
		);
	};

	return (
		<Container size="lg" px="md" py="lg">
			{/* Header Section */}
			<Box
				mb="lg"
				p="md"
				style={{
					borderRadius: rem(12),
					background:
						'linear-gradient(90deg, rgba(0,120,180,0.08) 0%, rgba(32,201,151,0.05) 100%)',
					border: '1px solid var(--mantine-color-gray-3)',
				}}
			>
				<Group justify="space-between" wrap="wrap">
					<Group gap="xs">
						<Text fw={700} fz="lg" c="blue.7">
							Onboarding Progress
						</Text>
						<Badge variant="light" color="teal">
							{completedCount}/{onboardingSteps.length} Completed
						</Badge>
					</Group>

					{onboardNow && (
						<Group gap="xs" style={{ minWidth: 220 }}>
							<Text fz="sm" c="dimmed">
								{Math.round(progressValue)}%
							</Text>
							<Progress
								value={progressValue}
								striped
								animated
								radius="xl"
								size="lg"
								color="blue"
								style={{ flex: 1 }}
							/>
						</Group>
					)}
				</Group>
			</Box>

			<Grid gutter="lg" justify="center">
				<Grid.Col span={{ base: 12, md: 10, lg: 8 }}>
					<Paper
						shadow="md"
						radius="lg"
						p="xl"
						withBorder
						style={{
							borderColor: 'var(--mantine-color-gray-3)',
							background: '#fff',
						}}
					>
						{/* Stepper */}
						<Stepper
							active={currentStep}
							orientation="vertical"
							size="sm"
							color="blue"
							allowNextStepsSelect={false}
							styles={{
								stepBody: { paddingLeft: rem(8), gap: rem(2) },
								stepLabel: {
									fontFamily: 'Inter, sans-serif',
									fontStyle: 'normal',
									fontWeight: 600,
									fontSize: rem(20),
									color: 'var(--mantine-color-dark-9)',
								},
								stepDescription: {
									fontFamily: 'Inter, sans-serif',
									fontStyle: 'normal',
									fontSize: rem(16),
									lineHeight: rem(40),
									fontWeight: 500,
									color: 'var(--mantine-color-dimmed)',
									marginTop: rem(2),
								},
								separator: {
									borderLeft:
										'2px dashed var(--mantine-color-gray-4)',
									marginLeft: rem(14),
									height: rem(24),
								},
							}}
						>
							{onboardingSteps.map((step, index) => {
								const status = stepStatuses[index];
								return (
									<Stepper.Step
										key={step.id}
										label={step.title}
										description={
											stepDescriptions[index] ??
											step.description
										}
										color={getStepColor(status)}
										icon={
											<StepStatusIcon
												index={index}
												status={status}
											/>
										}
									/>
								);
							})}
						</Stepper>

						{/* Retry Section */}
						{retryNeeded && (
							<>
								<Alert
									mt="xl"
									color="red"
									variant="light"
									radius="md"
									icon={<IconInfoCircle size={18} />}
									title="Some steps need your attention"
								>
									A few onboarding steps failed. Please retry
									to fix them.
								</Alert>

								<Group justify="center" mt="xl">
									<Button
										leftSection={<IconRefresh size={16} />}
										color="blue"
										variant="filled"
										onClick={onStartOnboarding}
									>
										Retry Setup
									</Button>
								</Group>
							</>
						)}
					</Paper>
				</Grid.Col>
			</Grid>
		</Container>
	);
}
