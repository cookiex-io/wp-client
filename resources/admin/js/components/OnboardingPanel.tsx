import React, { useEffect } from 'react';
import {
	Container,
	Paper,
	Stepper,
	Progress,
	Grid,
	Button,
	Loader,
	rem,
} from '@mantine/core';
import { IconX, IconClock } from '@tabler/icons-react';

// ✅ Define inline styles for Mantine v7
const stepperStyles = {
	root: {
		backgroundColor: '#fff',
	},
	progress: {
		height: rem(8),
		borderRadius: rem(6),
		backgroundColor: '#f1f3f5',
	},
	stepLabel: {
		fontSize: rem(16),
		color: '#000',
	},
	stepDescription: {
		fontSize: rem(16),
		color: '#000',
	},
	stepIcon: {
		width: rem(15),
		height: rem(15),
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: rem(16),
	},
	stepCompletedIcon: {
		color: '#228be6',
		backgroundColor: '#e7f5ff',
		padding: rem(4),
		borderRadius: rem(20),
	},
	stepFailedIcon: {
		color: '#fa5252',
		backgroundColor: '#ffe3e3',
		padding: rem(4),
		borderRadius: rem(20),
	},
	stepPendingIcon: {
		color: '#228be6',
		border: '1px solid',
		backgroundColor: '#f8f9fa',
		padding: rem(4),
		borderRadius: rem(20),
	},
	retryButton: {
		marginTop: rem(16),
		display: 'flex',
	},
};

interface OnboardingPanelProps {
	progressValue: number;
	onboardNow: boolean;
	currentStep: number;
	stepDescriptions: string[];
	stepStatuses: ('completed' | 'failed' | 'pending')[];
	onboardingSteps: Array<{
		id: number;
		title: string;
		description: string;
	}>;
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

	// ✅ Auto-call onComplete when last step is completed
	useEffect(() => {
		if (
			currentStep === onboardingSteps.length &&
			stepStatuses[onboardingSteps.length - 1] === 'completed'
		) {
			onComplete();
		}
	}, [currentStep, stepStatuses, onboardingSteps.length, onComplete]);

	// ✅ Check if any step has failed
	const retryNeeded = stepStatuses.some((status) => status === 'failed');

	const getStepIcon = (
		index: number,
		status: 'completed' | 'failed' | 'pending'
	) => {
		if (index === currentStep && status === 'pending') {
			return <Loader color="blue" size="xs" />;
		}

		switch (status) {
			case 'failed':
				return <IconX style={stepperStyles.stepFailedIcon} size={18} />;
			case 'pending':
				return (
					<IconClock
						style={stepperStyles.stepPendingIcon}
						size={30}
					/>
				);
			default:
				return null;
		}
	};

	const getStepColor = (status: 'completed' | 'failed' | 'pending') => {
		if (status === 'failed') {
			return 'red';
		}
		if (status === 'completed') {
			return 'blue';
		}
		return 'gray';
	};

	return (
		<Container size="responsive" style={stepperStyles.root} mt="md">
			<Grid>
				<Grid.Col span={6}>
					{onboardNow && (
						<Progress
							style={stepperStyles.progress}
							striped
							animated
							value={progressValue}
							size="md"
							radius="xs"
							mb="md"
							color="blue"
						/>
					)}
					<Paper>
						<Stepper
							active={currentStep}
							size="xs"
							orientation="vertical"
							styles={{
								stepLabel: {
									fontWeight: 700,
									color: '#0078b4',
								},
								stepDescription: {
									fontSize: rem(12),
									color: '#868e96',
								},
								separator: {
									borderWidth: rem(4),
									borderColor: '#0078b4',
								},
								stepIcon: {
									width: rem(10),
									height: rem(10),
									borderRadius: '50%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: rem(16),
								},
							}}
						>
							{onboardingSteps.map((step, index) => {
								const status = stepStatuses[index];

								return (
									<Stepper.Step
										key={step.id}
										label={
											<span
												style={stepperStyles.stepLabel}
											>
												{step.title}
											</span>
										}
										description={
											<span
												style={
													stepperStyles.stepDescription
												}
											>
												{stepDescriptions[index]}
											</span>
										}
										color={getStepColor(status)}
										icon={getStepIcon(index, status)}
									/>
								);
							})}
						</Stepper>

						{/* ✅ Show "Retry" button when any step fails */}
						{retryNeeded && (
							<div style={stepperStyles.retryButton}>
								<Button
									color="red"
									size="md"
									onClick={onStartOnboarding}
								>
									Retry
								</Button>
							</div>
						)}
					</Paper>
				</Grid.Col>
			</Grid>
		</Container>
	);
}
