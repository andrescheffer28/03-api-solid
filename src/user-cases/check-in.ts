import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "src/repositories/check-ins-repository";

interface CheckInUserCaseRequest {
    userId: string
    gymId: string
}

interface CheckInUserCaseResponse {
    checkIn: CheckIn
}

export class CheckInUserCase {
    constructor(private checkInsRepository: CheckInsRepository){}

    async execute({ 
        userId,
        gymId,
    }: CheckInUserCaseRequest): Promise<CheckInUserCaseResponse>{
        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return {
            checkIn,
        }
    }
}