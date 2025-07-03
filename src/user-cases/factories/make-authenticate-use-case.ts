import { PrismaUsersRepository } from "src/repositories/prisma/prisma-users-repository"
import { AuthenticateUserCase } from "../authenticate"

export function makeAuthenticateUserCase(){
    const usersRepository = new PrismaUsersRepository()
    const authenticateUserCase = new AuthenticateUserCase(usersRepository)

    return authenticateUserCase
}