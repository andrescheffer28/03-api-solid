import { PrismaUsersRepository } from "src/repositories/prisma/prisma-users-repository"
import { RegisterUserCase } from "../register"

// centralizador da criação do caso de uso

// função que devolve os casos de uso do controller com todas as dependências
export function makeRegisterUserCase(){
    const usersRepository = new PrismaUsersRepository()
    const registerUserCase = new RegisterUserCase(usersRepository)

    return registerUserCase
}