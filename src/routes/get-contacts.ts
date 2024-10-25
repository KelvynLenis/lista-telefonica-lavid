import { ZodTypeProvider } from "fastify-type-provider-zod"
import { connectToDatabase } from "../lib/database"
import Contact from "../lib/database/models/contact.model"
import z from "zod"
import { FastifyInstance } from "fastify"

export async function getContacts(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/contacts', {
      schema: {
        // summary: 'Get all contacts',
        // tags: ['contact'],
        // response: {
        //   201: z.array(z.object({
        //     contactName: z.string(),
        //     phoneNumber: z.string(),
        //   }))
        // }
      }
    }, async (request, reply) => {
      await connectToDatabase()

      const contacts = await Contact.find()

      if (!contacts) throw new Error('No contacts found')

      return reply.status(201).send(contacts)
    })
}