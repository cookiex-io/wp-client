'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Box, createTheme, Grid, MantineProvider } from '@mantine/core';
import { useState } from 'react';
import { AdminHeader } from './components/Headers/AdminHeader';
import { Navbar } from './components/NavBar/NavBar';

import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { FAQScreen } from './pages/FAQScreen';

export function App() {
	const [componentName, setComponentName] = useState('DashBoard');
	const [active, setActive] = useState('DashBoard');

	const renderComponent = (cName: any) => {
		setActive(cName);
		setComponentName(cName);
	};

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
		<>
			<MantineProvider theme={theme}>
				<Box style={{ height: '100vh' }}>
					<Box bg="#fff">
						<AdminHeader />
					</Box>
					<Grid>
						<Grid.Col span={3}>
							<Box
								p="md"
								style={{
									height: '100vh',
									borderRight: '1px solid #eaeaea',
								}}
							>
								<Navbar
									active={active}
									renderComponent={renderComponent}
								/>
							</Box>
						</Grid.Col>
						<Grid.Col span={9}>
							<Box p="md" style={{ height: '100vh' }}>
								{componentName === 'DashBoard' && (
									<DashboardPage
										renderComponent={renderComponent}
									/>
								)}
								{componentName === 'Settings' && (
									<SettingsPage />
								)}
								{componentName === 'Support' && <FAQScreen />}
							</Box>
						</Grid.Col>
					</Grid>
				</Box>
			</MantineProvider>
		</>
	);
}
