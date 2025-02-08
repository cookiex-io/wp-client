'use client';

import { Grid, Paper, Text, Radio, Divider } from '@mantine/core';
import React, { useState } from 'react';

function ConsentBannerScreen() {
	const [layoutType, setLayoutType] = useState('Box');
	const [bannerValue, setBannerValue] = useState('leftBottomPopUp');

	const layouts = [
		{
			layoutType: 'Box',
			bannerValue: 'leftBottomPopUp',
			styles: {
				border: '1px solid #eaeaea',
				padding: '10px',
				position: 'absolute',
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
				left: '30%',
				bottom: '30%',
				padding: '10px',
				position: 'absolute',
				width: '40%',
			},
			text: 'Popup',
		},
	];

	return (
		<React.Fragment>
			<>
				<Grid>
					<Grid.Col
						span={{ base: 12, md: 12, lg: 12 }}
						style={{ borderRadius: '8px', background: '#fff' }}
					>
						<div>
							<Paper withBorder shadow="0" p="sm">
								<Text size="xs" mb="lg" fw={500}>
									Banner Layout{' '}
								</Text>
								<Grid>
									{layouts.map((layout: any, index) => (
										<Grid.Col
											key={index}
											span={{
												base: 12,
												sm: 6,
												md: 4,
												lg: 4,
											}}
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
														minHeight: '80px',
														height: '100%',
													}}
													onClick={() => {
														setLayoutType(
															layout.layoutType
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
														<span
															className="primary"
															style={{
																left: '-8px',
																top: '-7px',
																position:
																	'absolute',
																background:
																	'#0078b4',
																borderRadius:
																	'20px',
																fontSize:
																	'13px',
																color: '#fff',
																padding:
																	'0px 5px 0px 5px',
															}}
														>
															&#10003;
														</span>
													)}
												</Paper>
												<Text
													size="xs"
													mt={5}
													ta="center"
												>
													{layout.text}
												</Text>
											</div>
										</Grid.Col>
									))}
								</Grid>
								<Divider my="sm" />
								{layoutType === 'Box' && (
									<Radio.Group
										mt={15}
										mb={15}
										value={bannerValue}
										onChange={(e: any) => {
											setBannerValue(e);
										}}
									>
										<Grid>
											<Grid.Col span={6}>
												<Radio
													size="xs"
													value="leftBottomPopUp"
													label="Bottom Left"
												/>
											</Grid.Col>
											<Grid.Col span={6}>
												<Radio
													size="xs"
													value="rightBottomPopUp"
													label="Bottom Right"
												/>
											</Grid.Col>
											<Grid.Col span={6}>
												<Radio
													size="xs"
													value="leftTopPopUp"
													label="Top Left"
												/>
											</Grid.Col>
											<Grid.Col span={6}>
												<Radio
													size="xs"
													value="rightTopPopUp"
													label="Top Right"
												/>
											</Grid.Col>
										</Grid>
									</Radio.Group>
								)}
							</Paper>
						</div>
					</Grid.Col>
				</Grid>
			</>
		</React.Fragment>
	);
}

export { ConsentBannerScreen };
