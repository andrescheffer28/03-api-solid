import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { PrismaUsersRepository } from 'src/repositories/prisma/prisma-users-repository'
import { AuthenticateUserCase } from 'src/user-cases/authenticate'
import { InvalidCredentialsError } from 'src/user-cases/errors/invalid-credentials-error'

export async function authenticate(request: FastifyRequest, reply: FastifyReply){
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try{
        const usersRepository = new PrismaUsersRepository()
        const authenticateUserCase = new AuthenticateUserCase(usersRepository)

        await authenticateUserCase.execute({
            email,
            password,
        })

    }catch(err){
        if(err instanceof InvalidCredentialsError){
            return reply.status(409).send({ message: err.message })
        }

        throw err // se o erro n for conhecido, n será tratado por mim, mas pelo fastify
    }

    return reply.status(200).send()
}