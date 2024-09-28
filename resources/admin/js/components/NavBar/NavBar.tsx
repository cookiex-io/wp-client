'use client';

import { Flex, ScrollArea, Text } from '@mantine/core';

import {
	IconHome,
	IconAdjustmentsHorizontal,
	IconHeadset,
} from '@tabler/icons-react';

export function Navbar(props: any) {
	const handleSettings = (label: any) => {
		props.renderComponent(label);
	};

	const handleKeyDown = (event: React.KeyboardEvent, label: string) => {
		if (event.key === 'Enter' || event.key === ' ') {
			handleSettings(label);
		}
	};

	return (
		<>
			<ScrollArea className="ck-navbar-links">
				<Flex
					className={`ck-navbar-linksInner ${props.active === 'DashBoard' ? 'ckActive' : ''}`}
					onClick={() => handleSettings('DashBoard')}
					onKeyDown={(e) => handleKeyDown(e, 'DashBoard')}
					role="button"
					tabIndex={0}
				>
					<IconHome /> &nbsp;{' '}
					<Text ml="xs" fw={600}>
						DashBoard
					</Text>
				</Flex>
				<Flex
					className={`ck-navbar-linksInner ${props.active === 'Settings' ? 'ckActive' : ''}`}
					onClick={() => handleSettings('Settings')}
					onKeyDown={(e) => handleKeyDown(e, 'Settings')}
					role="button"
					tabIndex={0}
				>
					<IconAdjustmentsHorizontal /> &nbsp;{' '}
					<Text ml="xs" fw={600}>
						Settings
					</Text>
				</Flex>
				<Flex
					className={`ck-navbar-linksInner ${props.active === 'Support' ? 'ckActive' : ''}`}
					onClick={() => handleSettings('Support')}
					onKeyDown={(e) => handleKeyDown(e, 'Support')}
					role="button"
					tabIndex={0}
				>
					<IconHeadset /> &nbsp;{' '}
					<Text ml="xs" fw={600}>
						Support
					</Text>
				</Flex>
			</ScrollArea>
		</>
	);
}
