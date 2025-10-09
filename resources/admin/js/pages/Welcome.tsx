import { useEffect, useState, useRef } from 'react';
import { OnboardingPanel } from '../components/OnboardingPanel';
import { runtimeConfig } from '../config';
import { finalConsentConfig } from '../utils/utils';

const onboardingSteps = [
	{ id: 1, title: '1. Registering your domain', description: '' },
	{ id: 2, title: '2. Scanning your site for cookies', description: '' },
	{ id: 3, title: '3. Creating your banner', description: '' },
	{ id: 4, title: '4. Activating consent management', description: '' },
];

type StepStatus = 'completed' | 'failed' | 'pending';

export function Welcome(props: any) {
	const [currentStep, setCurrentStep] = useState(0);
	const [tempToken, setTempToken] = useState('');
	const [onboardNow, setOnboardNow] = useState(false);
	const [stepDescriptions, setStepDescriptions] = useState(
		onboardingSteps.map(() => '')
	);
	const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
		Array(onboardingSteps.length).fill('pending') as StepStatus[]
	);
	const [consentConfig] = useState<any>(finalConsentConfig);
	const prevStep = useRef<number | null>(null);

	const handleOnboardingComplete = () => {
		props.onComplete?.();
		props.handleOnboardingComplete(tempToken);
	};

	const executeStep = async (step: number) => {
		if (prevStep.current === step) {
			return;
		}
		prevStep.current = step;

		switch (step) {
			case 0:
				updateStep(0, 'Registering your domain', 'pending');
				try {
					const response = await runtimeConfig.apiFetch({
						path: '/cookiex/v1/register',
						method: 'POST',
					});

					if (response.status) {
						setTempToken(response?.temp_token);
						updateStep(
							0,
							`Domain registered with ID: ${response.domainId}`,
							'completed'
						);
					} else {
						updateStep(0, 'Registration failed', 'failed');
					}
				} catch (error) {
					console.error('❌ Register API Error:', error);
					updateStep(
						0,
						'Registration unsuccessful: ' + error,
						'failed'
					);
				}
				break;

			case 1:
				updateStep(1, 'Scanning your site for cookies', 'pending');
				try {
					const response = await runtimeConfig.apiFetch({
						path: '/cookiex/v1/quickscan',
						method: 'POST',
					});

					let description = 'Cookies scanned successfully';
					if (response.type === 'existing') {
						const scanDate = new Date(
							response.last_scan
						).toLocaleDateString();
						description = `Last scan from ${scanDate}\nPages scanned: ${response.pages}\nCookies found: ${response.cookies_count}`;
					} else if (response.type === 'quick') {
						description = `Quick scan completed\nCookies found: ${response.cookies_count}`;
					}
					updateStep(
						1,
						description,
						response.status ? 'completed' : 'failed'
					);
				} catch (error) {
					console.error('❌ Scan API Error:', error);
					updateStep(
						1,
						'Scanning failed, please try again: ' + error,
						'failed'
					);
				}
				break;

			case 2:
				updateStep(2, 'Creating your banner', 'pending');

				setTimeout(async () => {
					try {
						const options = {
							path: '/cookiex/v1/save-settings',
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								theme: consentConfig,
							}),
						};

						const response: any =
							await runtimeConfig.apiFetch(options);

						if (response.status) {
							updateStep(
								2,
								'Banner created successfully',
								'completed'
							);
						} else {
							updateStep(2, 'Banner creation failed', 'failed');
						}
					} catch (error: any) {
						console.error('❌ Save Settings API Error:', error);
						updateStep(
							2,
							'Banner creation failed: ' + error,
							'failed'
						);
					}
				}, 2000); // Keep the delay if needed
				break;

			case 3:
				updateStep(3, 'Activating consent management', 'pending');

				try {
					const response = await runtimeConfig.apiFetch({
						path: '/cookiex/v1/enable-consent-management',
						method: 'POST',
					});

					if (response.status === true) {
						updateStep(
							3,
							'Consent management activated',
							'completed'
						);
					} else {
						updateStep(
							3,
							'Consent management activation failed (Invalid response)',
							'failed'
						);
					}
				} catch (error) {
					console.error('❌ Consent API Error:', error);
					updateStep(
						3,
						'Consent management activation failed: ' + error,
						'failed'
					);
				}
				break;
		}
	};

	useEffect(() => {
		if (onboardNow && stepStatuses[currentStep] !== 'completed') {
			executeStep(currentStep);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onboardNow, currentStep]);

	const updateStep = (
		step: number,
		description: string,
		status: StepStatus
	) => {
		setStepDescriptions((prev) => {
			const newDescriptions = [...prev];
			newDescriptions[step] = description;
			return newDescriptions;
		});

		setStepStatuses((prevStatuses) => {
			const newStatuses: StepStatus[] = [...prevStatuses];
			newStatuses[step] = status;
			return newStatuses;
		});

		if (status === 'completed' && step + 1 <= onboardingSteps.length) {
			setTimeout(() => {
				setCurrentStep((prevSp) => prevSp + 1);
			}, 1000);
		}
	};

	const progressValue = (currentStep / onboardingSteps.length) * 100;

	return (
		<OnboardingPanel
			progressValue={progressValue}
			onboardNow={onboardNow}
			currentStep={currentStep}
			stepDescriptions={stepDescriptions}
			stepStatuses={stepStatuses}
			onboardingSteps={onboardingSteps}
			onStartOnboarding={() => setOnboardNow(true)}
			onComplete={handleOnboardingComplete}
		/>
	);
}
