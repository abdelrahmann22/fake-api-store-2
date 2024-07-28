export class Products {
	async getItems(): Promise<any[]> {
		const url: string = "https://fakestoreapi.com/products";
		try {
			const response = await fetch(url, {
				method: 'GET'
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const items = await response.json();
			return items;
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
			throw error;
		}
	}
}

