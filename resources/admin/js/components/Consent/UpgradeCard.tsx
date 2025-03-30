import {
	Card,
	Title,
	Text,
	Button,
	Anchor,
	Center,
	Space,
} from '@mantine/core';
import { runtimeConfig } from '../../config';

function UpgradeCard() {
	const openCMP = () => {
		window.open(
			runtimeConfig.cmpRedirectUrl,
			'_blank',
			'noopener,noreferrer'
		);
	};

	return (
		<Card
			padding="lg"
			radius="md"
			withBorder
			style={{
				minHeight: '300px',
				height: '100%',
				textAlign: 'center',
			}}
		>
			<Title order={4} mt="xs">
				Upgrade to unlock custom CSS and other advanced features
			</Title>

			<Text size="sm" mt="xs" color="dimmed">
				To upgrade, create a new Cookiex account, or connect to an
				existing account and access premium features! After connecting,
				you can manage all your settings from the web app.
			</Text>

			<Space h="md" />
			<Center>
				<Button w={200} mt="md" color="green" onClick={openCMP}>
					New? Create an Account
				</Button>
			</Center>
			<Space h="md" />
			<Text size="sm" mt="xs" onClick={openCMP}>
				Already have an account?{' '}
				<Anchor href="#" size="sm" color="blue">
					Connect your existing account
				</Anchor>
			</Text>
		</Card>
	);
}

export { UpgradeCard };
