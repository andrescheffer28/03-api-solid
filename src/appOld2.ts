import fastify from "fastify"
import { appRoutes } from "./http/controllers/users/routes"
import { ZodError } from "zod"
import { env } from "./env"

export const app = fastify()

app.register(appRoutes)

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