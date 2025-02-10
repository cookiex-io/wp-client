import React, { useEffect, useState } from 'react';
import { OnboardingPanel } from '../components/OnboardingPanel';
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
		}
	}, [currentStep, onboardNow]);

	return (
		<OnboardingPanel
			progressValue={progressValue}
			onboardNow={onboardNow}
			currentStep={currentStep}
			stepDescriptions={stepDescriptions}
			onboardingSteps={onboardingSteps}
			logoUrl={runtimeConfig.logoUrl}
			onStartOnboarding={() => setOnboardNow(true)}
			onComplete={handleOnboardingComplete}
		/>
	);
}
