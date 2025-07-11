import { CreateGymUseCase } from "../create-gym"
import { PrismaGymsRepository } from "src/repositories/prisma/prisma-gyms-repository"

export function makeCreateGymUseCase(){
    const gymsRepository = new PrismaGymsRepository()
    const useCase = new CreateGymUseCase(gymsRepository)

    return useCase
}