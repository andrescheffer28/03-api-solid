import { FastifyRequest, FastifyReply } from 'fastify'
import { hash } from 'bcryptjs'
import { prisma } from "src/lib/prisma"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply){
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    //isso é uma camada de uma aplicação sempre presente independente de qm cria o usuário
    // importante separar para reaproveitar a estrutura
    const userWithSameEmail = await prisma.user.findUnique({ // procura o registro único na tabela (só chaves primárias ou @unique)
        where: {
            email,  
        },
    })

    if (userWithSameEmail){
        return reply.status(409).send()
    }

    const password_hash = await hash(password, 6)

    await prisma.user.create({
        data:{
            name,
            email,
            password_hash,
        }
    })

    return reply.status(201).send()
}