import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import z from "zod";
import Contact from "../lib/database/models/contact.model";
import { connectToDatabase } from "../lib/database";

export async function emitAlert(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/alert/:id', {
      websocket: true,
      schema: {
        params: z.object({
          id: z.string()
        })
      }
    }, async (socket, request) => {
      const redisSubscriber = app.redis.duplicate();  // Duplica o cliente Redis para assinaturas
      const redisPublisher = app.redis.duplicate();   // Duplica o cliente Redis para publicações
      const { id } = request.params

      socket.on("open", () => {
        console.log("Connection opened!");
      });

      redisSubscriber.subscribe('notifications');

      redisSubscriber.on('message', async (channel, message) => {
        console.log('Message received from Redis:', message);
        console.log('Channel:', channel);
        socket.send('Notificação de alerta!');

        await connectToDatabase()

        await Contact.findOneAndUpdate({ _id: id }, {
          alertEmitted: true
        })

      });

      socket.on('message', async message => {
        redisPublisher.publish('notifications', message.toString());
        // socket.send('Mensagem recebida com sucesso!');
      })

      socket.on('close', async () => {
        console.log('Connection closed.');
        await redisSubscriber.unsubscribe('notifications'); // Desassina o canal ao fechar a conexão
        await redisSubscriber.quit(); // Encerra o cliente Redis
        await redisPublisher.quit();  // Encerra o cliente Redis
      });

    })
}