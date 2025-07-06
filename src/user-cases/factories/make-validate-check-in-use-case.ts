import { PrismaCheckInsRepository } from "src/repositories/prisma/prisma-check-ins-repository"
import { ValidateCheckInUserCase } from "../validate-check-in"

export function makeValidateCheckInUseCase(){
    const checkInsRepository = new PrismaCheckInsRepository()
    const useCase = new ValidateCheckInUserCase(checkInsRepository)

    return useCase
}