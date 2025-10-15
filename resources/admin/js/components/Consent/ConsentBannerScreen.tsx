'use client';

import {
	Grid,
	Paper,
	Text,
	Radio,
	useMantineTheme,
	Timeline,
	Flex,
	Select,
	Popover,
	SimpleGrid,
} from '@mantine/core';
import { IconInfoCircle, IconPointFilled } from '@tabler/icons-react';
import React, { useState } from 'react';
import { regulations } from '../../utils/utils';
import { useDisclosure } from '@mantine/hooks';

function ConsentBannerScreen(props: any) {
	const theme = useMantineTheme();
	const [regulation] = useState<any>(props?.regulation || regulations[0]);
	const [layoutType, setLayoutType] = useState(
		props?.consentConfig?.layout || 'Box'
	);
	const [bannerValue, setBannerValue] = useState(
		props?.consentConfig?.alignment || 'leftBottomPopUp'
	);
	const [openedContent, { open: openContent, close: closeContent }] =
		useDisclosure(false); // For content drawer

	const layouts = [
		{
			layoutType: 'Box',
			bannerValue: 'leftBottomPopUp',
			styles: {
				border: '1px solid #eaeaea',
				padding: '10px',
				position: 'absolute',
				backgroundColor: theme.colors[theme.primaryColor][6],
				width: '40%',
				left:
					bannerValue === 'leftBottomPopUp' ||
					bannerValue === 'leftTopPopUp'
						? '7px'
						: 'auto',
				right:
					bannerValue === 'rightBottomPopUp' ||
					bannerValue === 'rightTopPopUp'
						? '7px'
						: 'auto',
				bottom:
					bannerValue === 'leftBottomPopUp' ||
					bannerValue === 'rightBottomPopUp'
						? '7px'
						: 'auto',
				top:
					bannerValue === 'leftTopPopUp' ||
					bannerValue === 'rightTopPopUp'
						? '7px'
						: 'auto',
			},
			text: 'Box',
		},
		{
			layoutType: 'Banner',
			bannerValue: 'bannerBottom',
			styles: {
				border: '1px solid #eaeaea',
				backgroundColor: theme.colors[theme.primaryColor][6],
				left: '5px',
				bottom: '7px',
				padding: '5px',
				position: 'absolute',
				width: '80%',
			},
			text: 'Banner',
		},
		{
			layoutType: 'PopUp',
			bannerValue: 'popUpCenter',
			styles: {
				border: '1px solid #eaeaea',
				backgroundColor: theme.colors[theme.primaryColor][6],
				left: '30%',
				bottom: '30%',
				padding: '10px',
				position: 'absolute',
				width: '40%',
			},
			text: 'Popup',
		},
	];

	const handleConsentBannerChange = (
		fieldName: any,
		value: any,
		regulationObj: any
	) => {
		props.handleLayout(fieldName, value, regulationObj);
	};

	return (
		<React.Fragment>
			<>
				<Timeline
					active={4}
					lineWidth={2}
					color="#0078B4"
					bulletSize={20}
					styles={{
						item: { minHeight: 50 },
						itemBullet: {
							border: '2px solid #228be6',
							background: '#deedf5',
							color: '#228be6',
						},
					}}
				>
					<Timeline.Item
						bullet={<IconPointFilled color="#228be6" size={13} />}
					>
						<Text
							mb="xs"
							mt="lg"
							className={props.subTimeLineTitle}
						>
							Consent Template
						</Text>
						<Flex>
							<Select
								mr={10}
								placeholder="Choose a regulation"
								allowDeselect={false}
								searchable
								data={regulations.map((reg) => ({
									value: reg.value,
									label: reg.label,
								}))}
								defaultValue={regulation.value}
								onChange={(value) => {
									const selectedRegulation = regulations.find(
										(reg) => reg.value === value
									);
									props.setRegulation(selectedRegulation);
									handleConsentBannerChange(
										'regulation',
										selectedRegulation,
										selectedRegulation
									);
								}}
							/>
							<Popover
								width={300}
								position="right"
								withArrow
								shadow="md"
								opened={openedContent}
							>
								<Popover.Target>
									<IconInfoCircle
										onMouseEnter={openContent}
										onMouseLeave={closeContent}
									/>
								</Popover.Target>
								<Popover.Dropdown
									style={{
										pointerEvents: 'none',
									}}
								>
									<Text size="sm">
										{regulation?.description}
									</Text>
								</Popover.Dropdown>
							</Popover>
						</Flex>
					</Timeline.Item>
					<Timeline.Item
						bullet={<IconPointFilled color="#228be6" size={13} />}
					>
						<Text
							mb="xs"
							mt="lg"
							className={props.subTimeLineTitle}
						>
							Banner Layout{' '}
						</Text>
						<Grid>
							{layouts.map((layout: any, index) => (
								<Grid.Col
									key={index}
									span={{ base: 3, md: 4, lg: 4 }}
								>
									<div>
										<Paper
											shadow="0px"
											withBorder
											p="lg"
											style={{
												position: 'relative',
												width: '100%',
												display: 'flex',
												flexDirection: 'column',
												minHeight: '50px',
												height: '100%',
											}}
											onClick={() => {
												handleConsentBannerChange(
													'layout',
													layout.layoutType,
													regulation
												);
												setLayoutType(
													layout.layoutType
												);
												handleConsentBannerChange(
													'alignment',
													layout.bannerValue,
													regulation
												);
												setBannerValue(
													layout.bannerValue
												);
											}}
										>
											<div
												className="fill-primary"
												style={layout.styles}
											></div>
											{layoutType ===
												layout.layoutType && (
												<div
													style={{
														left: '-8px',
														top: '-7px',
														position: 'absolute',
													}}
												>
													<svg
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
															fill="#18ba51"
														/>
														<path
															d="M15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L11.7071 14.7071C11.3166 15.0976 10.6834 15.0976 10.2929 14.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929C8.68342 10.9024 9.31658 10.9024 9.70711 11.2929L11 12.5858L14.2929 9.29289C14.6834 8.90237 15.3166 8.90237 15.7071 9.29289Z"
															fill="white"
														/>
													</svg>
												</div>
											)}
										</Paper>
										<Text
											className={props.subTimeLineTitle}
											style={{ fontSize: '0.725rem' }}
											mt={5}
											ta="center"
										>
											{layout.text === 'Box' && 'Box'}
											{layout.text === 'Banner' &&
												'Banner'}
											{layout.text === 'Popup' && 'Popup'}
										</Text>
									</div>
								</Grid.Col>
							))}
						</Grid>
					</Timeline.Item>
					{(layoutType === 'Box' || layoutType === 'Banner') && (
						<Timeline.Item
							bullet={
								<IconPointFilled color="#228be6" size={13} />
							}
						>
							<>
								<Text
									mb="xs"
									mt="lg"
									className={props.subTimeLineTitle}
								>
									Alignment{' '}
								</Text>
								<Radio.Group
									mt={5}
									mb={5}
									value={bannerValue}
									onChange={(e: any) => {
										handleConsentBannerChange(
											'alignment',
											e,
											regulation
										);
										setBannerValue(e);
									}}
									classNames={{
										label: props.subTimeLineTitle,
									}}
								>
									<SimpleGrid cols={2}>
										{layoutType === 'Box' && (
											<>
												<Radio
													size="xs"
													className={
														props.subTimeLineTitle
													}
													color="#18ba51"
													value="leftBottomPopUp"
													label="Bottom Left"
												/>
												<Radio
													color="#18ba51"
													className={
														props.subTimeLineTitle
													}
													size="xs"
													value="rightBottomPopUp"
													label="Bottom Right"
												/>
												<Radio
													color="#18ba51"
													className={
														props.subTimeLineTitle
													}
													size="xs"
													value="leftTopPopUp"
													label="Top Left"
												/>
												<Radio
													color="#18ba51"
													className={
														props.subTimeLineTitle
													}
													size="xs"
													value="rightTopPopUp"
													label="Top Right"
												/>
											</>
										)}
										{layoutType === 'Banner' && (
											<>
												<Radio
													size="xs"
													className={
														props.subTimeLineTitle
													}
													value="bannerTop"
													label="Top"
												/>
												<Radio
													size="xs"
													className={
														props.subTimeLineTitle
													}
													value="bannerBottom"
													label="Bottom"
												/>
											</>
										)}
									</SimpleGrid>
								</Radio.Group>
							</>
						</Timeline.Item>
					)}
				</Timeline>
			</>
		</React.Fragment>
	);
}

export { ConsentBannerScreen };
