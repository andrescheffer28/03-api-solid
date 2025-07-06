import { PrismaCheckInsRepository } from "src/repositories/prisma/prisma-check-ins-repository"
import { CheckInUserCase } from "../check-in"
import { PrismaGymsRepository } from "src/repositories/prisma/prisma-gyms-repository"

export function makeCheckInUseCase(){
    const checkInsRepository = new PrismaCheckInsRepository()
    const gymsRepository = new PrismaGymsRepository
    const useCase = new CheckInUserCase(checkInsRepository, gymsRepository)

    return useCase
}