import React from 'react';
import {
	Paper,
	Grid,
	Group,
	Stack,
	Button,
	Anchor,
	Text,
	rem,
} from '@mantine/core';

// Inline SVG from your design (you can replace with any icon)
function TrustDockIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg width="77" height="80" viewBox="0 0 77 80" fill="none" {...props}>
			<g filter="url(#f0)">
				<path
					d="M62.9622 43.0585V12.4831L38.4987 7.76685L14.0352 12.4831V43.0585C14.0352 48.1437 16.6355 52.9626 20.1518 57.0902V17.225L38.4987 13.6862L56.8472 17.2234V57.0869C54.9815 59.2782 52.8592 61.2738 50.7321 63.0111V21.9637L38.4987 19.6056L26.2669 21.9637V63.0111C28.2106 64.5959 30.2554 66.0523 32.3884 67.3713L32.3836 26.7056L38.4987 25.5282L44.6154 26.7072L44.6106 67.3729C41.6429 69.1984 39.2799 70.2331 38.4987 70.2331V31.4476"
					stroke="url(#g0)"
					strokeWidth="2.52083"
					strokeLinecap="round"
					strokeLinejoin="round"
					shapeRendering="crispEdges"
				/>
			</g>
			<defs>
				<filter
					id="f0"
					x="8.77466"
					y="6.50647"
					width="59.448"
					height="72.9871"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="4" />
					<feGaussianBlur stdDeviation="2" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
					/>
					<feBlend
						in2="BackgroundImageFix"
						result="effect1_dropShadow"
					/>
					<feBlend
						in="SourceGraphic"
						in2="effect1_dropShadow"
						result="shape"
					/>
				</filter>
				<linearGradient
					id="g0"
					x1="38.4987"
					y1="7.76685"
					x2="38.4987"
					y2="70.2331"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="white" />
					<stop offset="1" stopColor="#C4C4C4" />
				</linearGradient>
			</defs>
		</svg>
	);
}

type Props = {
	onCreateAccount?: () => void;
	onConnectAccount?: () => void;
};

export default function UpgradeCard({
	onCreateAccount,
	onConnectAccount,
}: Props) {
	return (
		<Paper
			shadow="md"
			radius={rem(16)}
			p={rem(24)}
			mt={rem(24)}
			style={{
				background: '#0078B4',
				color: '#fff',
				boxShadow:
					'0 1px 2px 0 rgba(0,0,0,0.30), 0 2px 6px 2px rgba(0,0,0,0.15)',
			}}
		>
			<Grid
				align="center"
				gutter={24}
				// Desktop: text (left) + CTA (right)
				// Mobile: stack (text on top, CTA below)
			>
				<Grid.Col span={{ base: 12, md: 8 }}>
					<Group align="flex-start" gap={16} wrap="nowrap">
						<TrustDockIcon
							style={{ flexShrink: 0, width: 77, height: 77 }}
						/>

						<Stack gap={5} style={{ flex: 1 }}>
							<Text
								component="h3"
								fw={700}
								// Inter-like sizing; feel free to tweak
								style={{
									fontFamily:
										'Inter, -apple-system, Roboto, Helvetica, sans-serif',
									fontSize: rem(24),
									lineHeight: 1.1,
									margin: 0,
									color: '#fff',
								}}
							>
								Upgrade to unlock custom CSS and other advanced
								features
							</Text>

							<Text
								style={{
									fontFamily:
										'Roboto, -apple-system, Roboto, Helvetica, sans-serif',
									fontSize: rem(14),
									lineHeight: rem(20),
									letterSpacing: '0.25px',
									color: '#fff',
									opacity: 0.95,
								}}
							>
								To upgrade, create a new Cookiex account, or
								connect to an existing account and access
								premium features! After connecting, you can
								manage all your settings from the web app.
							</Text>
						</Stack>
					</Group>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 4 }}>
					<Stack
						align="center"
						gap={10}
						p={rem(12)}
						style={{
							borderRadius: rem(15),
							background:
								'linear-gradient(90deg, rgba(255, 255, 255, 0.38) 0%, rgba(188, 215, 228, 0.38) 45.67%, rgba(255, 255, 255, 0.38) 100%)',
						}}
					>
						<Button
							fullWidth
							onClick={onCreateAccount}
							radius={rem(16)}
							h={rem(56)}
							styles={{
								root: {
									background: '#3CC83C',
								},
							}}
							// Keep label close to Figma (Roboto 16 / 24 lh / 0.15 tracking)
							fw={500}
							fz={rem(16)}
						>
							New ? Create an Account
						</Button>

						<Text
							fz={rem(16)}
							fw={500}
							style={{
								fontFamily:
									'Roboto, -apple-system, Roboto, Helvetica, sans-serif',
								lineHeight: rem(24),
								letterSpacing: '0.15px',
								textAlign: 'center',
								color: '#fff',
							}}
						>
							Already have an account?{' '}
							<Anchor
								onClick={onConnectAccount}
								underline="always"
								c="white"
								style={{ opacity: 0.95 }}
							>
								Connect your existing account
							</Anchor>
						</Text>
					</Stack>
				</Grid.Col>
			</Grid>
		</Paper>
	);
}
