import z from "zod"
import { connectToDatabase } from "../lib/database"
import Contact from "../lib/database/models/contact.model"
import { ContactProps } from "../types"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { FastifyInstance } from "fastify"

export async function updateContact(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/contacts/:id', {
      schema: {
        summary: 'Update a contact',
        tags: ['contact'],
        body: z.object({
          contactName: z.string(),
          phoneNumber: z.string(),
          location: z.object({
            type: z.string(),
            coordinates: z.array(z.number())
          }),
          views: z.number()
        }),
        params: z.object({
          id: z.string()
        }),
        response: {
          201: z.object({
            contactName: z.string(),
            phoneNumber: z.string(),
            location: z.object({
              type: z.string(),
              coordinates: z.array(z.number())
            }),
            views: z.number().default(0)
          })
        }
      }
    }, async (request, reply) => {
      const { contactName, phoneNumber, location, views } = request.body as ContactProps
      const { id } = request.params

      await connectToDatabase()

      const updatedContact = await Contact.findOneAndUpdate({ _id: id }, {
        contactName,
        phoneNumber,
        location,
        views
      }, { new: true })

      if (!updatedContact) throw new Error('Contact update failed')

      return reply.status(201).send(updatedContact)
    })
}