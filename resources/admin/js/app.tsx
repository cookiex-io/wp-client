'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import {
	Box,
	Container,
	createTheme,
	Grid,
	MantineProvider,
} from '@mantine/core';
import { AdminHeader } from './components/Headers/AdminHeader';
import OnBoardPanel from './pages/OnBoardPanel';

export function App() {
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
			<Container fluid>
				<Box style={{ height: '100vh' }}>
					<Box bg="#fff">
						<AdminHeader />
					</Box>
					<Grid>
						<Grid.Col span={12}>
							<Box p="md" style={{ height: '100vh' }}>
								<OnBoardPanel />
							</Box>
						</Grid.Col>
					</Grid>
				</Box>
			</Container>
		</MantineProvider>
	);
}
