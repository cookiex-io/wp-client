// Mock implementation of wp.apiFetch
const wpApiFetch = async (options: any) => {
	const baseUrl = '';
	const url = options.path.startsWith('http')
		? options.path
		: baseUrl + options.path;

	try {
		const response = await fetch(url, {
			method: options.method || 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(options.headers || {}),
			},
			body: options.body ? options.body : undefined,
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		return response.json();
	} catch (error) {
		console.error('API Fetch Error:', error);
		throw error;
	}
};

export default wpApiFetch;
