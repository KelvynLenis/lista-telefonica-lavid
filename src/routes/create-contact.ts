import { ZodTypeProvider } from "fastify-type-provider-zod";
import { connectToDatabase } from "../lib/database"
import Contact from "../lib/database/models/contact.model"
import { ContactProps } from "../types"
import { FastifyInstance } from "fastify";
import z from "zod";

export async function createContact(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/contacts', {
      schema: {
        summary: 'Create a contact',
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

      await connectToDatabase()

      await Contact.create({
        contactName,
        phoneNumber,
        location,
        views
      })

      return reply.status(201).send({ contactName, phoneNumber, location, views })
    })
}