import fastify from "fastify";
import { createContact } from "./routes/create-contact";
import { getContactById } from "./routes/get-contact";
import { getContacts } from "./routes/get-contacts";
import { updateContact } from "./routes/update-contact";
import { deleteContact } from "./routes/delete-contact";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import fastifyRedis from "@fastify/redis";
import fastifyWebsocket from "@fastify/websocket";
import { emitAlert } from "./routes/emit-alert";

const app = fastify();

app.register(fastifyCors, {
	origin: "*",
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyWebsocket)
app.register(fastifyRedis, {
	host: 'redis-12070.c308.sa-east-1-1.ec2.redns.redis-cloud.com',
	password: process.env.REDIS_PASSWORD,
	port: 12070
})

app.register(createContact)
app.register(getContactById)
app.register(getContacts)
app.register(updateContact)
app.register(deleteContact)
app.register(emitAlert)

app.listen({ port: 3333, host: '0.0.0.0' })
	.then(() => {
		console.log("Server is running on port 3333");
	})