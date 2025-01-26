import {
	Container,
	Grid,
	Card,
	Title,
	Text,
	Button,
	Divider,
} from '@mantine/core';
import { ConsentBannerScreen } from '../components/Consent/ConsentBannerScreen';

function ConsentDashboard() {
	return (
		<Container fluid mt={20}>
			<Grid gutter="lg">
				{/* Consent Banner Settings */}
				<Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
					<Card
						withBorder
						shadow="sm"
						radius="md"
						padding="lg"
						style={{
							display: 'flex',
							flexDirection: 'column',
							minHeight: '300px',
							height: '100%',
						}}
					>
						<Title order={3}>Consent Banner Settings</Title>
						<Text mt="xs" color="dimmed">
							Manage cookie consent banner.
						</Text>
						<Divider my="md" />
						<Title order={5} mb={20}>
							Consent Banner Configuration
						</Title>
						<ConsentBannerScreen />
						<div style={{ flexGrow: 1 }}></div>
						<Button mt="lg" color="#0078b4">
							Customize more on portal
						</Button>
					</Card>
				</Grid.Col>

				{/* Consent Analytics */}
				<Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
					<Card
						withBorder
						shadow="sm"
						radius="md"
						padding="lg"
						style={{
							display: 'flex',
							flexDirection: 'column',
							minHeight: '300px',
							height: '100%',
						}}
					>
						<Title order={3}>Consent Analytics</Title>
						<Text mt="xs" color="dimmed">
							Analyze consent data.
						</Text>
						<Divider my="md" />
						<Text mt="sm" size="sm">
							Consent analytics shows the data of consents given
							by the users on the consent banner present on your
							domain.
						</Text>
						<Text mt="sm" size="sm">
							Opt-in Consent - 16
						</Text>
						<Text mt="sm" size="sm">
							Opt-out Consent - 5
						</Text>
						<Text mt="sm" size="sm">
							Average time to Consent - 5 min
						</Text>
						<Text mt="sm" size="sm">
							Most Consented Cookie Category - Preferences
						</Text>
						<Text mt="sm" size="sm">
							Least Consented Cookie Category - Marketing
						</Text>
						<div style={{ flexGrow: 1 }}></div>
						<Button mt="lg" color="#0078b4">
							View Report on CMP
						</Button>
					</Card>
				</Grid.Col>

				{/* Cookie Scan Status */}
				<Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
					<Card
						withBorder
						shadow="sm"
						radius="md"
						padding="lg"
						style={{
							display: 'flex',
							flexDirection: 'column',
							minHeight: '300px',
							height: '100%',
						}}
					>
						<Title order={3}>Cookie Scan Status</Title>
						<Text mt="xs" color="dimmed">
							&nbsp;
						</Text>
						<Divider my="md" />
						<Text size="sm">Necessary - 15</Text>
						<Text size="sm" mt={10}>
							Preferences - 12
						</Text>
						<Text size="sm" mt={10}>
							Marketing - 12
						</Text>
						<Text size="sm" mt={10}>
							Unclassified - 12
						</Text>
						<Divider my="md" />
						<Title order={5}>Deep Scan</Title>
						<Text mt="xs" size="sm">
							Please run a deep scan of your domain to get all
							cookies and trackers present.
						</Text>
						<div style={{ flexGrow: 1 }}></div>
						<Button mt="lg" color="#0078b4">
							Run Deep Scan
						</Button>
					</Card>
				</Grid.Col>
			</Grid>
		</Container>
	);
}

export default ConsentDashboard;
