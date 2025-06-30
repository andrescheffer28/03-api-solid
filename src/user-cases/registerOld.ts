import { hash } from "bcryptjs"
import { prisma } from "src/lib/prisma"
import { PrismaUsersRepository } from "src/repositories/prisma/prisma-users-repository"

// para criar um usuário é necessário
interface registerUserCaseRequest {
    name: string
    email: string
    password: string
}

// SOLID

// D - Dependency Inversion Principle
// ao inves do caso de uso instanciar a dependencia
// a dependencias serão recebidas como parâmetros

export async function registerUserCase({
    name, email, password,
}: registerUserCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email,  
        },
    })

    /*
    if (userWithSameEmail){
        return reply.status(409).send()
    }*/ // não faz sentido usar o reply pois é algo especifico da parte http da aplicação

    if (userWithSameEmail){
        throw new Error('E-mail already exists.')
    }

    // o caso de uso, de registro dos usuários tem uma dependência no repositório do prisma 
    // se o repositório do prisma n existir, o caso de uso para de funcionar
    const prismaUsersRepository = new PrismaUsersRepository()

    await prismaUsersRepository.create({
        name,
        email,
        password_hash,
    })
}