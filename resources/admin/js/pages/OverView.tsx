import { useEffect, useState } from 'react';
import { Grid, Card, Title, Text, Button, Divider } from '@mantine/core';
import { runtimeConfig } from '../config';

function OverView() {
	const [analyticsData, setAnalyticsData] = useState({
		optIns: 0,
		optOuts: 0,
		averageConsentTime: 'N/A',
		mostConsentedCategory: 'N/A',
		leastConsentedCategory: 'N/A',
	});

	const [scanData, setScanData] = useState({
		necessary: 0,
		preferences: 0,
		marketing: 0,
		unclassified: 0,
		statistics: 0,
	});

	const openCMP = () => {
		window.open(
			runtimeConfig.cmpRedirectUrl,
			'_blank',
			'noopener,noreferrer'
		);
	};

	const fetchAnalytics = async () => {
		try {
			const response = await runtimeConfig.apiFetch({
				path: '/cookiex/v1/analytics',
				method: 'GET',
			});

			if (response?.data?.status === 'success' && response?.data?.data) {
				const analytics = response?.data?.data;

				setAnalyticsData({
					optIns: analytics.totalOptIns || 0,
					optOuts: analytics.totalOptOuts || 0,
					averageConsentTime: analytics.averageTimeToConsent || 'N/A',
					mostConsentedCategory:
						analytics.mostAcceptedCookie || 'N/A',
					leastConsentedCategory:
						analytics.leastAcceptedCookie || 'N/A',
				});
			}
		} catch (error) {
			console.error('Error fetching analytics:', error);
		}
	};

	const fetchScanData = async () => {
		try {
			// ✅ Ensure apiFetch works correctly
			const response = await runtimeConfig.apiFetch({
				path: '/cookiex/v1/cookie-scan',
				method: 'GET',
			});

			if (
				response?.data?.status === 'success' &&
				response?.data?.data?.latestScanResult
			) {
				const latestScan = response?.data?.data?.latestScanResult;

				setScanData({
					necessary: latestScan?.necessaryCookies ?? 0,
					preferences: latestScan?.preferenceCookies ?? 0,
					marketing: latestScan?.marketingCookies ?? 0, // ✅ Fixed wrong property
					statistics: latestScan?.statisticsCookies ?? 0,
					unclassified: latestScan?.unclassifiedCookies ?? 0,
				});
			} else {
				console.error(
					'Scan data retrieval failed:',
					response?.data?.message
				);
			}
		} catch (error) {
			console.error('Error fetching scan data:', error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				await Promise.all([fetchAnalytics(), fetchScanData()]);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	return (
		<Grid gutter="lg" mt="md">
			<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
				<Card
					withBorder
					shadow="sm"
					radius="md"
					padding="lg"
					style={{
						display: 'flex',
						flexDirection: 'column',
						minHeight: '300px',
						height: '100%',
					}}
				>
					<Title order={3}>Consent Analytics</Title>
					<Divider my="md" />
					<Text mt="sm" size="sm">
						Consent analytics shows the data of consents given by
						users on the consent banner present on your domain.
					</Text>
					<Text mt="sm" size="sm">
						Opt-in Consent - {analyticsData.optIns}
					</Text>
					<Text mt="sm" size="sm">
						Opt-out Consent - {analyticsData.optOuts}
					</Text>
					<Text mt="sm" size="sm">
						Average time to Consent -{' '}
						{analyticsData.averageConsentTime}
					</Text>
					<Text mt="sm" size="sm">
						Most Consented Cookie Category -{' '}
						{analyticsData.mostConsentedCategory}
					</Text>
					<Text mt="sm" size="sm">
						Least Consented Cookie Category -{' '}
						{analyticsData.leastConsentedCategory}
					</Text>
					<div style={{ flexGrow: 1 }}></div>
					<Button mt="lg" color="#0078b4" onClick={openCMP}>
						View Report on CMP
					</Button>
				</Card>
			</Grid.Col>

			<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
				<Card
					withBorder
					shadow="sm"
					radius="md"
					padding="lg"
					style={{
						display: 'flex',
						flexDirection: 'column',
						minHeight: '300px',
						height: '100%',
					}}
				>
					<Title order={3}>Cookie Scan Status</Title>
					<Divider my="md" />
					<Text size="sm">Necessary - {scanData.necessary}</Text>
					<Text size="sm" mt={10}>
						Preferences - {scanData.preferences}
					</Text>
					<Text size="sm" mt={10}>
						Marketing - {scanData.marketing}
					</Text>
					<Text size="sm" mt={10}>
						Unclassified - {scanData.unclassified}
					</Text>
					<Divider my="md" />
					<Title order={5}>Deep Scan</Title>
					<Text mt="xs" size="sm">
						Please run a deep scan of your domain to get all cookies
						and trackers present.
					</Text>
					<div style={{ flexGrow: 1 }}></div>
					<Button mt="lg" color="#0078b4" onClick={openCMP}>
						Run Deep Scan
					</Button>
				</Card>
			</Grid.Col>
		</Grid>
	);
}

export default OverView;
