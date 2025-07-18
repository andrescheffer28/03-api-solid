import { prisma } from "src/lib/prisma"
import { Prisma } from '@prisma/client'
import { UsersRepository } from "../users-repository"

export class PrismaUsersRepository implements UsersRepository{
    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: {
                id,  
            },
        })

        return user
    }
    
    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email,  
            },
        })

        return user
    }
    // contera varios métodos q irão interceptar as portas de entrada
    // para qualquer operação do banco de dados

    async create(data: Prisma.UserCreateInput){ 
        const user = await prisma.user.create({
            data,
        })

        return user // o caso de uso caso queira trabalhar com o usuário criado pode
    }
}