'use client';

import { Image } from '@mantine/core';
import { runtimeConfig } from '../../config';

export function AdminHeader() {
	return (
		<header className="cookiex-admin-header">
			<Image w="180" src={runtimeConfig.logoUrl} alt="Cookiex logo" />
		</header>
	);
}
