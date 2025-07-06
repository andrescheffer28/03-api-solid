import { PrismaUsersRepository } from "src/repositories/prisma/prisma-users-repository"
import { getUserProfileUseCase } from "../get-user-profile"

export function makeGetUserProfileUseCase(){
    const usersRepository = new PrismaUsersRepository()
    const useCase = new getUserProfileUseCase(usersRepository)

    return useCase
}