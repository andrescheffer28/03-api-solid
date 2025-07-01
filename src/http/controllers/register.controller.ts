import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { RegisterUserCase } from 'src/user-cases/register'
import { PrismaUsersRepository } from 'src/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from 'src/user-cases/errors/user-already-exists-error'

export async function register(request: FastifyRequest, reply: FastifyReply){
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try{
        const usersRepository = new PrismaUsersRepository()

        //princípio da inversão de independência
        // é preciso instanciar a classe e passar como parâmetro quais são as dependências
        const registerUserCase = new RegisterUserCase(usersRepository)

        await registerUserCase.execute({ //utiliza o método execute criado em register.ts
            name,
            email,
            password,
        })

    }catch(err){
        if(err instanceof UserAlreadyExistsError){
            return reply.status(409).send({ message: err.message })
        }

        return reply.status(500).send() // TODO: fix me
    }

    return reply.status(201).send()
}