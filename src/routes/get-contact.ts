import { ObjectId } from "mongoose"
import { connectToDatabase } from "../lib/database"
import Contact from "../lib/database/models/contact.model"
import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

export async function getContactById(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.get('/contacts/:id', {
			schema: {
				summary: 'Get a contact',
				tags: ['contact'],
				params: z.object({
					id: z.string(),
				}),
				// response: {
				// 	201: z.object({
				// 		contactName: z.string(),
				// 		phoneNumber: z.string(),
				// 	})
				// }
			}
		}, async (request, reply) => {
			const { id } = request.params as { id: string }
			await connectToDatabase()

			const user = await Contact.findById(id)

			if (!user) throw new Error('User not found')

			return reply.status(201).send(user)
		})
}