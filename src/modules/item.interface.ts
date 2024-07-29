export interface Item {
	id: number; // Assuming you have an ID for each item
	title: string;
	price: number;
	image: string;
	category: string;
	quantity?: number; // Optional quantity property
}
