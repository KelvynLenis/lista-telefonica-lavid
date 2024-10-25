import { ZodTypeProvider } from "fastify-type-provider-zod"
import { connectToDatabase } from "../lib/database"
import Contact from "../lib/database/models/contact.model"
import z from "zod"
import { FastifyInstance } from "fastify"

export async function deleteContact(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/contacts/:id', {
      schema: {
        summary: 'Delete a contact',
        tags: ['contact'],
        params: z.object({
          id: z.string(),
        }),
        // response: {
        //   201: z.object({
        //     contactName: z.string(),
        //     phoneNumber: z.string(),
        //   })
        // }
      }
    }, async (request, reply) => {
      const { id } = request.params as { id: string }

      await connectToDatabase()

      const deletedContact = await Contact.findByIdAndDelete({ _id: id })

      if (!deletedContact) throw new Error('Contact delete failed')

      return JSON.parse(JSON.stringify(deletedContact))
    }
    )
}