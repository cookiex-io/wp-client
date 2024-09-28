'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Box, Grid, MantineProvider } from '@mantine/core';
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

	return (
		<>
			<MantineProvider>
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
