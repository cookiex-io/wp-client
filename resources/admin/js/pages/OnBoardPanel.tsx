import {
	Container,
	Card,
	Title,
	Text,
	Button,
	Divider,
	Tabs,
	Accordion,
	Stack,
	Timeline,
	ThemeIcon,
	Group,
} from '@mantine/core';
import { IconCheck, IconCircleFilled } from '@tabler/icons-react';
import OverView from './OverView';
import { CookieBanner } from './CookieBanner';
import { runtimeConfig } from '../config';
import { useState } from 'react';

function OnBoardPanel() {
	const [openedItems, setOpenedItems] = useState<string[]>(['description']);

	const handleCloseAccordion = () => {
		setOpenedItems([]);
	};

	const openCMP = () => {
		window.open(
			runtimeConfig.cmpRedirectUrl,
			'_blank',
			'noopener,noreferrer'
		);
	};

	return (
		<Container fluid>
			<Tabs defaultValue="dashboard">
				<Tabs.List style={{ fontSize: '1.2rem' }}>
					<Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
					<Tabs.Tab value="settings">Cookie Banner</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="dashboard">
					<Container fluid>
						<Accordion
							variant="outline"
							mt={30}
							multiple
							value={openedItems}
							onChange={setOpenedItems}
							style={{ border: '1px solid #dee2e6' }}
						>
							<Accordion.Item value="description">
								<Accordion.Control>
									<Stack gap={0}>
										<Title order={6}>
											Get started with CookieX
										</Title>
										<Text size="sm" mt="xs">
											{
												"Welcome to CookieX To become legally compliant for your use of cookies' here's what you need to do."
											}
										</Text>
									</Stack>
								</Accordion.Control>
								<Accordion.Panel>
									<Divider />
									<Timeline
										active={1}
										lineWidth={5}
										bulletSize={30}
										pt={30}
									>
										<Timeline.Item
											bullet={<IconCheck size={30} />}
											title="Activate your cookie banner"
										>
											{/* eslint-disable-next-line react/no-unescaped-entities */}
											<Text c="dimmed" size="sm">
												Wel done! 🎉 You have
												successfully implemented a
												cookie banner on your website.
											</Text>
											<Text c="dimmed" size="sm">
												&nbsp;
											</Text>
										</Timeline.Item>

										<Timeline.Item
											mt={30}
											color="#eaeaea"
											bullet={
												<ThemeIcon
													variant="outline"
													radius="xl"
													size="md"
												>
													<IconCircleFilled
														color="#0078b4"
														style={{
															width: '70%',
															height: '70%',
														}}
													/>
												</ThemeIcon>
											}
											title="Connect and scan your website"
										>
											<Text c="dimmed" size="sm">
												To initiate an automatic cookie
												scan, you need to connect to the
												CookieYes web app. By connecting
												you can:
											</Text>
										</Timeline.Item>
									</Timeline>
									<Group mt={20}>
										<Button
											variant="filled"
											onClick={openCMP}
										>
											Connect to Web App
										</Button>
										<Button
											variant="subtle"
											onClick={handleCloseAccordion}
										>
											Do it later
										</Button>
									</Group>
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>

						<Card
							withBorder
							mt={20}
							mb={20}
							style={{ borderRadius: '0px' }}
						>
							<Card.Section withBorder inheritPadding py="xs">
								<Group justify="space-between">
									<Text fw={500}>OverView</Text>
								</Group>
							</Card.Section>
							<Card.Section withBorder inheritPadding py="xs">
								<OverView />
							</Card.Section>
							<Card.Section withBorder inheritPadding py="xs">
								<Group>
									<Button variant="subtle">
										Customize Banner
									</Button>
								</Group>
							</Card.Section>
						</Card>
					</Container>
					<Divider />
				</Tabs.Panel>

				<Tabs.Panel
					value="settings"
					mt={30}
					style={{ border: '1px solid #dee2e6' }}
				>
					<CookieBanner />
				</Tabs.Panel>
			</Tabs>
		</Container>
	);
}

export default OnBoardPanel;
