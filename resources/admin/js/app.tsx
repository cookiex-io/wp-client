'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Box, Burger, Grid, MantineProvider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import { AdminHeader } from './components/Headers/AdminHeader';
import { Navbar } from './components/NavBar/NavBar';

import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { FAQScreen } from './pages/FAQScreen';

export function App() {
	const [opened, { toggle }] = useDisclosure();
	const [componentName, setComponentName] = useState('DashBoard');

	const renderComponent = (cName: any) => {
		setComponentName(cName);
	};

	return (
		<>
			<MantineProvider>
				<Box style={{ height: '100vh' }}>
					<Box bg="#fff">
						<AdminHeader
							burger={
								<Burger
									opened={opened}
									onClick={toggle}
									hiddenFrom="sm"
									size="sm"
									mr="xl"
								/>
							}
						/>
					</Box>
					<Grid>
						<Grid.Col span={3}>
							<Box bg="#fff" p="md" style={{ height: '100vh' }}>
								<Navbar renderComponent={renderComponent} />
							</Box>
						</Grid.Col>
						<Grid.Col span={9}>
							<Box
								p="md"
								bg="#f2f2f8"
								style={{ height: '100vh' }}
							>
								{componentName === 'DashBoard' && (
									<DashboardPage />
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
