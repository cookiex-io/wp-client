'use client';

import { Image } from '@mantine/core';
import logo from '../../assets/logo.svg';

export function AdminHeader() {
	return (
		<header className="cookiex-admin-header">
			<Image w="180" src={logo} alt="Cookiex logo" />
		</header>
	);
}
