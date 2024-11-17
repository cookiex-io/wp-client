import {
	Card,
	Text,
	Button,
	Grid,
	Center,
	Container,
	Title,
} from '@mantine/core';
import { IconUserPlus, IconLogin } from '@tabler/icons-react';
import React from 'react';

function DashboardPage(props: any) {
	const handleSignUpClick = () => {
		window.open('https://app.cookiex.io/register', '_blank'); // Opens the link in a new tab
	};

	const handleSettings = (label: any) => {
		props.renderComponent(label);
	};

	return (
		<React.Fragment>
			<>
				<Container fluid>
					<Title mt="lg" mb="lg" order={2}>
						Dashboard
					</Title>
					<Grid mt="xl">
						<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
							<Card
								shadow="xl"
								radius="md"
								withBorder
								pb="xl"
								pt="xl"
							>
								<Center>
									<IconUserPlus
										color="green"
										size={48}
										stroke={1}
									/>
								</Center>
								<Center>
									<Title order={5} mt="md">
										Create an Account on Cookiex
									</Title>
								</Center>
								<Center>
									<Text
										size="sm"
										ta="center"
										mt="sm"
										pl={70}
										pr={70}
									>
										Create your free account and get instant
										access to the Cookiex editor. Sign up
										with
									</Text>
								</Center>
								<Center>
									<Button
										radius="sm"
										size="sm"
										mt="md"
										onClick={handleSignUpClick}
									>
										Sign Up
									</Button>
								</Center>
							</Card>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
							<Card
								shadow="xl"
								radius="md"
								withBorder
								pb="xl"
								pt="xl"
							>
								<Center>
									<IconLogin
										color="green"
										size={48}
										stroke={1}
									/>
								</Center>
								<Center>
									<Title order={5} mt="md">
										Already Have an Account
									</Title>
								</Center>
								<Center>
									<Text
										size="sm"
										ta="center"
										mt="sm"
										pl={70}
										pr={70}
									>
										Already have an account then connect
										your domain in the button below.
									</Text>
								</Center>
								<Center>
									<Button
										onClick={() =>
											handleSettings('Settings')
										}
										radius="sm"
										size="sm"
										mt="md"
									>
										Connect Your Domain
									</Button>
								</Center>
							</Card>
						</Grid.Col>
					</Grid>
				</Container>
			</>
		</React.Fragment>
	);
}

export { DashboardPage };
