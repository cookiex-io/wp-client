import {
	Divider,
	Tabs,
	Accordion,
	Text,
	Container,
	Title,
	Paper,
} from '@mantine/core';
import React from 'react';

export function FAQScreen() {
	return (
		<React.Fragment>
			<Container fluid>
				<Title mt="lg" mb="lg" order={2}>
					Support
				</Title>
				<Paper p="md">
					<Tabs
						defaultValue="general"
						styles={(theme) => ({
							tab: {
								fontWeight: 600,
								fontSize: '14px',
								padding: '10px 10px 20px 10px',
							},
							panel: {
								padding: '20px 10px',
								backgroundColor: theme.white,
								borderRadius: '0 0 8px 8px',
							},
						})}
					>
						<Tabs.List>
							<Tabs.Tab value="general">General</Tabs.Tab>
							<Tabs.Tab value="configuration">
								Configuration
							</Tabs.Tab>
							<Tabs.Tab value="privacy">Privacy Policy</Tabs.Tab>
							<Tabs.Tab value="consentRecords">
								Consent Records
							</Tabs.Tab>
							<Tabs.Tab value="consentBanner">
								Consent Banner
							</Tabs.Tab>
							<Tabs.Tab value="integration">Integration</Tabs.Tab>
							<Tabs.Tab value="analytics">Analytics</Tabs.Tab>
							<Tabs.Tab value="regulations">Regulations</Tabs.Tab>
							<Tabs.Tab value="reseller">
								Reseller Program
							</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value="general" pt="xs">
							<Text fw={700} mb="md">
								Frequently asked questions
							</Text>
							<Divider my="lg" />
							<Accordion
								chevronPosition="left"
								styles={(theme) => ({
									control: {
										color: theme.colors.blue[6], // Make the control text blue
										'&:hover': {
											backgroundColor:
												theme.colors.blue[0], // Optional: change background on hover
										},
									},
								})}
							>
								<Accordion.Item value="q1">
									<Accordion.Control>
										How do I install Cookiex CMP?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q2">
									<Accordion.Control>
										How can I style my banner?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q3">
									<Accordion.Control>
										What subscription should I choose?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q4">
									<Accordion.Control>
										How do I know what plan I subscribed to?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q5">
									<Accordion.Control>
										Do subdomains require a separate
										subscription?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Tabs.Panel>

						<Tabs.Panel value="configuration" pt="xs">
							<Text fw={700} mb="md">
								Configuration FAQs
							</Text>
							<Divider my="lg" />
							<Accordion
								chevronPosition="left"
								styles={(theme) => ({
									control: {
										color: theme.colors.blue[6],
										'&:hover': {
											backgroundColor:
												theme.colors.blue[0],
										},
									},
								})}
							>
								<Accordion.Item value="q6">
									<Accordion.Control>
										How do I configure the Cookiex CMP?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q7">
									<Accordion.Control>
										What settings should I use for different
										regions?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q8">
									<Accordion.Control>
										Can I customize the consent banner
										appearance?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Tabs.Panel>

						<Tabs.Panel value="privacy" pt="xs">
							<Text fw={700} mb="md">
								Privacy Policy FAQs
							</Text>
							<Divider my="lg" />
							<Accordion
								chevronPosition="left"
								styles={(theme) => ({
									control: {
										color: theme.colors.blue[6],
										'&:hover': {
											backgroundColor:
												theme.colors.blue[0],
										},
									},
								})}
							>
								<Accordion.Item value="q9">
									<Accordion.Control>
										What information does Cookiex collect?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q10">
									<Accordion.Control>
										How is user data protected?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q11">
									<Accordion.Control>
										How can users request data deletion?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Tabs.Panel>

						<Tabs.Panel value="consentRecords" pt="xs">
							<Text fw={700} mb="md">
								Consent Records FAQs
							</Text>
							<Divider my="lg" />
							<Accordion
								chevronPosition="left"
								styles={(theme) => ({
									control: {
										color: theme.colors.blue[6],
										'&:hover': {
											backgroundColor:
												theme.colors.blue[0],
										},
									},
								})}
							>
								<Accordion.Item value="q12">
									<Accordion.Control>
										How are consent records stored?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q13">
									<Accordion.Control>
										Can I export consent records?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q14">
									<Accordion.Control>
										How long are consent records retained?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Tabs.Panel>

						<Tabs.Panel value="consentBanner" pt="xs">
							<Text fw={700} mb="md">
								Consent Banner FAQs
							</Text>
							<Divider my="lg" />
							<Accordion
								chevronPosition="left"
								styles={(theme) => ({
									control: {
										color: theme.colors.blue[6],
										'&:hover': {
											backgroundColor:
												theme.colors.blue[0],
										},
									},
								})}
							>
								<Accordion.Item value="q15">
									<Accordion.Control>
										How do I customize the consent banner?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q16">
									<Accordion.Control>
										Can I preview the consent banner
										changes?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q17">
									<Accordion.Control>
										What languages does the consent banner
										support?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Tabs.Panel>

						<Tabs.Panel value="integration" pt="xs">
							<Text fw={700} mb="md">
								Integration FAQs
							</Text>
							<Divider my="lg" />
							<Accordion
								chevronPosition="left"
								styles={(theme) => ({
									control: {
										color: theme.colors.blue[6],
										'&:hover': {
											backgroundColor:
												theme.colors.blue[0],
										},
									},
								})}
							>
								<Accordion.Item value="q18">
									<Accordion.Control>
										What platforms does Cookiex integrate
										with?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q19">
									<Accordion.Control>
										How do I integrate Cookiex with my CMS?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q20">
									<Accordion.Control>
										Is there an API for developers?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Tabs.Panel>

						<Tabs.Panel value="analytics" pt="xs">
							<Text fw={700} mb="md">
								Analytics FAQs
							</Text>
							<Divider my="lg" />
							<Accordion
								chevronPosition="left"
								styles={(theme) => ({
									control: {
										color: theme.colors.blue[6],
										'&:hover': {
											backgroundColor:
												theme.colors.blue[0],
										},
									},
								})}
							>
								<Accordion.Item value="q21">
									<Accordion.Control>
										How can I track consent analytics?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q22">
									<Accordion.Control>
										Can I integrate analytics with Google
										Analytics?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q23">
									<Accordion.Control>
										How do I interpret the analytics data?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Tabs.Panel>

						<Tabs.Panel value="regulations" pt="xs">
							<Text fw={700} mb="md">
								Regulations FAQs
							</Text>
							<Divider my="lg" />
							<Accordion
								chevronPosition="left"
								styles={(theme) => ({
									control: {
										color: theme.colors.blue[6],
										'&:hover': {
											backgroundColor:
												theme.colors.blue[0],
										},
									},
								})}
							>
								<Accordion.Item value="q24">
									<Accordion.Control>
										What regulations does Cookiex comply
										with?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q25">
									<Accordion.Control>
										How does Cookiex handle GDPR compliance?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q26">
									<Accordion.Control>
										Are there regional differences in
										regulations?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Tabs.Panel>

						<Tabs.Panel value="reseller" pt="xs">
							<Text fw={700} mb="md">
								Reseller Program FAQs
							</Text>
							<Divider my="lg" />
							<Accordion
								chevronPosition="left"
								styles={(theme) => ({
									control: {
										color: theme.colors.blue[6],
										'&:hover': {
											backgroundColor:
												theme.colors.blue[0],
										},
									},
								})}
							>
								<Accordion.Item value="q27">
									<Accordion.Control>
										How can I become a Cookiex reseller?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q28">
									<Accordion.Control>
										What are the benefits of being a
										reseller?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="q29">
									<Accordion.Control>
										Is there a reseller dashboard available?
									</Accordion.Control>
									<Accordion.Panel>
										Here you can provide the answer or
										information related to the question.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Tabs.Panel>
					</Tabs>
				</Paper>
			</Container>
		</React.Fragment>
	);
}
