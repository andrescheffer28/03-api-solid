import '@fastify/jwt'

declare module '@fastify/jwt'{
    export interface fastifyJWT{
        user: {
            sub: string
        }
    }
}