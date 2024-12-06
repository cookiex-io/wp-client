'use client';

import { Image } from '@mantine/core';

export function AdminHeader() {
	return (
		<header className="cookiex-admin-header">
			<Image
				w="180"
				src="/wp-content/plugins/cookiex-consent-management-platform/dist/static/logo.svg"
				alt="Cookiex logo"
			/>
		</header>
	);
}
