export interface ContactProps {
	contactName: string
	phoneNumber: string
	location: {
		type: string
		coordinates: number[]
	}
	views?: number
}
