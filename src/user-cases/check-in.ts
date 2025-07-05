import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "src/repositories/check-ins-repository";
import { GymsRepository } from "src/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CheckInUserCaseRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckInUserCaseResponse {
    checkIn: CheckIn
}

export class CheckInUserCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymRepository: GymsRepository
    ){}

    async execute({ 
        userId,
        gymId,
    }: CheckInUserCaseRequest): Promise<CheckInUserCaseResponse>{
        const gym = await this.gymRepository.findById(gymId)

        if(!gym){
            throw new ResourceNotFoundError()
        }

        // se a academia existe, calcular a distancia entre o usuário e a academia

        const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
            userId,
            new Date(),
        )

        if(checkInOnSameDay){
            throw new Error()
        }

        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return {
            checkIn,
        }
    }
}