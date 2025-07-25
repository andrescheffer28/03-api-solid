import fastify from "fastify"
import { userRoutes } from "./http/controllers/users/routes"
import { ZodError } from "zod"
import { env } from "./env"
import fastifyJwt from "@fastify/jwt"
import { gymsRoutes } from "./http/controllers/gyms/routes"
import { checkInsRoutes } from "./http/controllers/check-ins/route"

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
})

app.register(userRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
    if(error instanceof ZodError){ // se o erro for de validação
        return reply
            .status(400)
            .send({ message: 'Validation error.', issues: error.format()})
    }

    if(env.NODE_ENV != 'production'){
        console.error(error)
    }else{
        // TODO: here we should log to an external tool like DataDog/NewRelic/Sentry
        // enviar o erro desconhecido para alguma ferramenta analizar
    }

    return reply.status(500).send({ message: 'Internal server error.'})
})