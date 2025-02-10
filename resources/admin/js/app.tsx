'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Box, createTheme, Grid, MantineProvider } from '@mantine/core';
import { useState, useEffect } from 'react';
import { AdminHeader } from './components/Headers/AdminHeader';

import { FAQScreen } from './pages/FAQScreen';
import { Welcome } from './pages/Welcome';
import { runtimeConfig } from './config';
import Dashboard from './pages/Dashboard';

export function App() {
	const [componentName, setComponentName] = useState('Dashboard');
	const [showWelcome, setShowWelcome] = useState<boolean | null>(null);

	const renderComponent = (cName: any) => {
		setComponentName(cName);
	};

	useEffect(() => {
		// Check if we should show welcome screen
		runtimeConfig
			.apiFetch({ path: '/cookiex/v1/welcome-status' })
			.then((response: any) => {
				setShowWelcome(response.show_welcome);
			});
	}, []);

	// Show nothing while loading
	if (showWelcome === null) {
		return null;
	}

	const theme = createTheme({
		colors: {
			blue: [
				'#e6f7ff',
				'#b3e6ff',
				'#80d5ff',
				'#4dc4ff',
				'#1ab3ff',
				'#0099e6',
				'#0078b4',
				'#005580',
				'#00334d',
				'#00111a',
			],
			green: [
				'#e8f5e9',
				'#c8e6c9',
				'#a5d6a7',
				'#81c784',
				'#66bb6a',
				'#4caf50',
				'#43a047',
				'#388e3c',
				'#2e7d32',
				'#1b5e20',
			],
		},
		primaryColor: 'blue',
	});

	return (
		<MantineProvider theme={theme}>
			{showWelcome ? (
				<Welcome
					renderComponent={renderComponent}
					onComplete={() => {
						runtimeConfig.apiFetch({
							path: '/cookiex/v1/clear-welcome',
						});
						setShowWelcome(false);
					}}
				/>
			) : (
				<Box style={{ height: '100vh' }}>
					<Box bg="#fff">
						<AdminHeader />
					</Box>
					<Grid>
						<Grid.Col span={12}>
							<Box p="md" style={{ height: '100vh' }}>
								{componentName === 'Dashboard' && <Dashboard />}
								{componentName === 'Support' && <FAQScreen />}
							</Box>
						</Grid.Col>
					</Grid>
				</Box>
			)}
		</MantineProvider>
	);
}
