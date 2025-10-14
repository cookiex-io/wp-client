import { useEffect, useState } from 'react';
import {
	Grid,
	Card,
	Text,
	Button,
	Divider,
	Tooltip,
	Paper,
	Image,
	Stack,
} from '@mantine/core';
import { runtimeConfig } from '../config';
import { IconRefresh, IconWorld } from '@tabler/icons-react';
import classes from './OverView.module.css';
import cookieIcon from '../assets/ic_outline-cookie.svg';
import cutCookieIcon from '../assets/ic_outline-cut-cookie.svg';
import { COLORS } from '../utils/utils';

function OverView(props: any) {
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

	const openCMP = (link: string) => {
		window.open(
			`${runtimeConfig.cmpRedirectUrl}/${link}`,
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
		<Grid gutter="lg" mt="md" mb="md">
			<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
				<Card
					shadow="sm"
					padding="lg"
					radius="md"
					withBorder
					style={{
						display: 'flex',
						flexDirection: 'column',
						minHeight: '300px',
						height: '100%',
						margin: 'auto',
						fontFamily: 'Inter, sans-serif',
					}}
				>
					{/* Header */}
					<Text className={classes.overViewCardTitle} fw={600}>
						Consent Analytics
					</Text>
					<Text
						className={classes.overViewCardDescription}
						fw={500}
						mb="md"
						c="#718096"
					>
						Consent analytics shows the data of consents given by
						users on the consent banner present on your domain.
					</Text>
					<Divider mb="md" />

					<Grid gutter="md">
						<Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
							<Stack>
								<div>
									<Text
										className={
											classes.overViewCardDescription
										}
										fw={700}
									>
										Opt-in Consent
									</Text>
									<Text
										className={
											classes.overViewCardValueDesc
										}
									>
										{analyticsData.optIns}
									</Text>
								</div>

								<div>
									<Text
										className={
											classes.overViewCardDescription
										}
										fw={700}
									>
										Opt-out Consent
									</Text>
									<Text
										className={
											classes.overViewCardValueDesc
										}
									>
										{analyticsData.optOuts}
									</Text>
								</div>
								<div>
									<Text
										className={
											classes.overViewCardDescription
										}
										fw={700}
									>
										Average time to Consent
									</Text>
									<Text
										className={
											classes.overViewCardValueDesc
										}
										fw={600}
										c={COLORS.brand}
									>
										{analyticsData.averageConsentTime}
									</Text>
								</div>
							</Stack>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 6, lg: 7 }}>
							<Stack>
								<div>
									<Text
										className={
											classes.overViewCardDescription
										}
										fw={700}
									>
										Most Consented Cookie Category
									</Text>
									<Text
										className={
											classes.overViewCardValueDesc
										}
									>
										{analyticsData.mostConsentedCategory}
									</Text>
								</div>

								<div>
									<Text
										className={
											classes.overViewCardDescription
										}
										fw={700}
									>
										Least Consented Cookie Category
									</Text>
									<Text
										className={
											classes.overViewCardValueDesc
										}
									>
										{analyticsData.leastConsentedCategory}
									</Text>
								</div>
							</Stack>
						</Grid.Col>
					</Grid>
					<div style={{ flexGrow: 1 }}></div>
					<Tooltip
						label="Please connect to the web app to view detailed analytics report on CMP"
						disabled={props.isConnected}
						position="top"
						withArrow
					>
						<Button
							variant="outline"
							fullWidth
							radius="16px"
							h={56}
							onClick={() => openCMP('analytics')}
							disabled={!props.isConnected}
							mt="lg"
							leftSection={<IconWorld size={16} />}
						>
							View Report On CMP
						</Button>
					</Tooltip>
				</Card>
			</Grid.Col>

			<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
				<Card
					shadow="sm"
					padding="lg"
					radius="md"
					withBorder
					style={{
						display: 'flex',
						flexDirection: 'column',
						minHeight: '300px',
						height: '100%',
						margin: 'auto',
						fontFamily: 'Inter, sans-serif',
					}}
				>
					{/* Header */}
					<Text className={classes.overViewCardTitle} fw={600}>
						Cookie Scan Status
					</Text>
					<Text
						className={classes.overViewCardDescription}
						mb="md"
						fw={500}
						c="#718096"
					>
						Here you can see the current status of your cookie
						banner.
					</Text>
					<Divider mb="md" />
					<Grid gutter="md" style={{ width: '100%' }}>
						<Grid.Col span={{ base: 12, sm: 8 }}>
							<Paper
								shadow="xs"
								p="md"
								radius="md"
								style={{
									position: 'relative',
									backgroundColor: '#D1FADF',
									overflow: 'hidden',
									textAlign: 'center',
									minHeight: '230px',
									maxHeight: '230px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									background: '#D1FADF',
									boxShadow:
										'0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.30)',
								}}
							>
								<div
									style={{
										position: 'absolute',
										top: '0px',
										left: '0px',
									}}
								>
									<Image
										src={cutCookieIcon}
										alt="Cookie"
										style={{
											height: '91px',
										}}
									/>
								</div>

								<div
									style={{
										position: 'absolute',
										bottom: '10px',
										right: '10px',
									}}
								>
									<Image
										src={cookieIcon}
										alt="Cookie"
										style={{
											width: '91px',
											height: '91px',
											aspectRatio: '1/1',
										}}
									/>
								</div>
								<Stack
									gap={1}
									align="center"
									justify="center"
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										position: 'relative',
										zIndex: 2,
										height: '100%',
										textAlign: 'center',
									}}
								>
									<Text
										className={
											classes.overViewCardDescription
										}
										c="#027A48"
										fw={700}
									>
										Banner Status
									</Text>
									<Text fw={500} c="#027A48" fz="sm">
										Active
									</Text>
									<Text
										className={classes.overViewCardSubDesc}
										mt={4}
										mb="sm"
										c="#027A48"
									>
										Consent banner is running smoothly and
										tracking user preferences properly.
									</Text>
									<Button
										size="xs"
										variant="filled"
										color="#027A48"
										style={{ padding: '5px 12px' }}
										leftSection={<IconRefresh size={14} />}
									>
										Scan Now
									</Button>
								</Stack>
							</Paper>
						</Grid.Col>
						<Grid.Col span={{ base: 12, sm: 4 }}>
							<div>
								<Stack gap={6}>
									<Text
										className={
											classes.overViewCardDescription
										}
										fw={700}
									>
										Necessary
									</Text>
									<Text
										className={
											classes.overViewCardValueDesc
										}
									>
										{scanData.necessary}
									</Text>
									<Text
										className={
											classes.overViewCardDescription
										}
										fw={700}
									>
										Preferences
									</Text>
									<Text
										className={
											classes.overViewCardValueDesc
										}
									>
										{scanData.preferences}
									</Text>
									<Text
										className={
											classes.overViewCardDescription
										}
										fw={700}
									>
										Marketing
									</Text>
									<Text
										className={
											classes.overViewCardValueDesc
										}
									>
										{scanData.marketing}
									</Text>
									<Text
										className={
											classes.overViewCardDescription
										}
										fw={700}
									>
										Unclassified
									</Text>
									<Text
										className={
											classes.overViewCardValueDesc
										}
									>
										{scanData.unclassified}
									</Text>
								</Stack>
							</div>
						</Grid.Col>
					</Grid>
					<div style={{ flexGrow: 1 }}></div>
					<Tooltip
						label="Please connect to the web app to run a deep scan of your domain"
						disabled={props.isConnected}
						position="top"
						withArrow
					>
						<Button
							onClick={() => openCMP('privacy-audits')}
							disabled={!props.isConnected}
							variant="outline"
							fullWidth
							radius="16px"
							h={56}
							mt="lg"
							leftSection={<IconRefresh size={16} />}
						>
							Run Deep Scan
						</Button>
					</Tooltip>
				</Card>
			</Grid.Col>
		</Grid>
	);
}

export default OverView;
