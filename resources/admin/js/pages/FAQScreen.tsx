import { Tabs, Accordion, Text, Container, Title, Paper } from '@mantine/core';
import React, { useEffect, useState } from 'react';

export function FAQScreen() {
	const [categories, setCategories] = useState([]);
	const [faqData, setFaqData] = useState([]);

	useEffect(() => {
		// fetch categories from static URL
		fetch('https://cdn.cookiex.io/info/wp/faqCategories.json')
			.then((response) => response.json())
			.then((data) => setCategories(data))
			.catch((error) =>
				console.error('Error loading FAQ categories:', error)
			);

		// Fetch data from static URL
		fetch('https://cdn.cookiex.io/info/wp/faqData.json')
			.then((response) => response.json())
			.then((data) => setFaqData(data))
			.catch((error) => console.error('Error loading FAQ data:', error));
	}, []);

	const getQuestionsByCategory = (category: string) => {
		return faqData.filter((item: any) =>
			item.categories.includes(category)
		);
	};

	return (
		<React.Fragment>
			<Container fluid>
				<Title mt="lg" mb="lg" order={2}>
					Support
				</Title>
				<Paper p="md" shadow="md" withBorder>
					<Tabs
						variant="outline"
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
							{categories.map((category) => (
								<Tabs.Tab key={category} value={category}>
									<Text size="xs">
										{category.charAt(0).toUpperCase() +
											category.slice(1)}
									</Text>
								</Tabs.Tab>
							))}
						</Tabs.List>

						{categories.map((category) => (
							<Tabs.Panel key={category} value={category}>
								<Accordion>
									{getQuestionsByCategory(category).map(
										(faq: any, index) => (
											<Accordion.Item
												key={index}
												value={faq.question}
											>
												<Accordion.Control>
													{faq.question}
												</Accordion.Control>
												<Accordion.Panel>
													<Text>{faq.answer}</Text>
												</Accordion.Panel>
											</Accordion.Item>
										)
									)}
								</Accordion>
							</Tabs.Panel>
						))}
					</Tabs>
				</Paper>
			</Container>
		</React.Fragment>
	);
}
