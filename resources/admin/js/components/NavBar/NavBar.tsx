'use client';

import { useState } from 'react';
import { ScrollArea } from '@mantine/core';

import {
	IconHome,
	IconAdjustmentsHorizontal,
	IconHeadset,
} from '@tabler/icons-react';

export function Navbar(props: any) {
	const [active, setActive] = useState('DashBoard');

	const handleSettings = (label: any) => {
		setActive(label);
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
				<div
					className={`ck-navbar-linksInner ${active === 'DashBoard' ? 'ckActive' : ''}`}
					onClick={() => handleSettings('DashBoard')}
					onKeyDown={(e) => handleKeyDown(e, 'DashBoard')}
					role="button"
					tabIndex={0}
				>
					<IconHome /> &nbsp; DashBoard
				</div>
				<div
					className={`ck-navbar-linksInner ${active === 'Settings' ? 'ckActive' : ''}`}
					onClick={() => handleSettings('Settings')}
					onKeyDown={(e) => handleKeyDown(e, 'Settings')}
					role="button"
					tabIndex={0}
				>
					<IconAdjustmentsHorizontal /> &nbsp; Settings
				</div>
				<div
					className={`ck-navbar-linksInner ${active === 'Support' ? 'ckActive' : ''}`}
					onClick={() => handleSettings('Support')}
					onKeyDown={(e) => handleKeyDown(e, 'Support')}
					role="button"
					tabIndex={0}
				>
					<IconHeadset /> &nbsp; Support
				</div>
			</ScrollArea>
		</>
	);
}
