import { prisma } from "src/lib/prisma"
import { Prisma } from '@prisma/client'
import { UsersRepository } from "../users-repository"

//nos repositórios de usuário para q sigam essa interface
//pode ser usado implements UsersRepository
export class PrismaUsersRepository implements UsersRepository{
    // contera varios métodos q irão interceptar as portas de entrada
    // para qualquer operação do banco de dados

    async create(data: Prisma.UserCreateInput){ 
        const user = await prisma.user.create({
            data,
        })

        return user // o caso de uso caso queira trabalhar com o usuário criado pode
    }
}