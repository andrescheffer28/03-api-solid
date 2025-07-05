import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "src/repositories/check-ins-repository";
import { GymsRepository } from "src/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "src/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

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
        userLatitude,
        userLongitude,
    }: CheckInUserCaseRequest): Promise<CheckInUserCaseResponse>{
        const gym = await this.gymRepository.findById(gymId)

        if(!gym){
            throw new ResourceNotFoundError()
        }

        // se a academia existe, calcular a distancia entre o usuário e a academia
        const distance = getDistanceBetweenCoordinates(
            { 
                latitude: userLatitude, 
                longitude: userLongitude 
            },
            { 
                latitude: gym.latitude.toNumber(), 
                longitude: gym.longitude.toNumber() 
            }
        )

        const MAX_DISTANCE_IN_KM = 0.1

        if(distance > MAX_DISTANCE_IN_KM){
            throw new MaxDistanceError()
        }

        const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
            userId,
            new Date(),
        )

        if(checkInOnSameDay){
            throw new MaxNumberOfCheckInsError()
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