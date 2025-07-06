import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { InvalidCredentialsError } from 'src/user-cases/errors/invalid-credentials-error'
import { makeAuthenticateUserCase } from 'src/user-cases/factories/make-authenticate-use-case'

export async function authenticate(request: FastifyRequest, reply: FastifyReply){
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try{
        const authenticateUserCase = makeAuthenticateUserCase()

        const { user } = await authenticateUserCase.execute({
            email,
            password,
        })

        //apartir do momento q o fastifyJwt foi importado na aplicação,
        //alguns novos métodos surgiram dentro de request e reply
        const token = await reply.jwtSign(
            {},
            {
                sign: {
                    sub: user.id,
                }
            }
        )

        return reply.status(200).send({
            token,
        })

    }catch(err){
        if(err instanceof InvalidCredentialsError){
            return reply.status(409).send({ message: err.message })
        }

        throw err // se o erro n for conhecido, n será tratado por mim, mas pelo fastify
    }
}