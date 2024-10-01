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

function DashboardPage() {
	return (
		<React.Fragment>
			<>
				<Container fluid>
					<Title mt="lg" mb="lg" order={2}>
						Dashboard
					</Title>
					<Grid mt="xl">
						<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
							<Card shadow="xs" radius="md">
								<Center>
									<IconUserPlus size={48} stroke={1} />
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
										color="orange"
										radius="sm"
										size="sm"
										mt="sm"
									>
										Sign Up
									</Button>
								</Center>
							</Card>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
							<Card shadow="xs" radius="md">
								<Center>
									<IconLogin size={48} stroke={1} />
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
										color="orange"
										radius="sm"
										size="sm"
										mt="sm"
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
