'use client';
import { Drawer, Stack, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface Props {
	burger?: React.ReactNode;
}

export function AdminHeader({ burger }: Props) {
	const [opened, { close }] = useDisclosure(false);

	return (
		<header className="cookiex-admin-header">
			{burger && burger}
			<Image
				w="120"
				src="https://staging.cookiex.io/static/media/logo.e0877046d5242b4d1441.png"
			/>
			<Drawer
				opened={opened}
				onClose={close}
				title="Settings"
				position="right"
				transitionProps={{ duration: 0 }}
			>
				<Stack gap="lg">
					<h1>Hello</h1>
				</Stack>
			</Drawer>
		</header>
	);
}
