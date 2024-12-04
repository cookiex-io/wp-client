'use client';

import { Image } from '@mantine/core';

export function AdminHeader() {
	return (
		<header className="cookiex-admin-header">
			<Image w="180" src="static/logo.svg" alt="Cookiex logo" />
		</header>
	);
}
