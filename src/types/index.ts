export interface Event {
	id: string;
	question: string;
	outcome?: boolean;
	image_url: string;
	ends_at: number;
}
