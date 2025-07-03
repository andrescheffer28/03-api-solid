import { UsersRepository } from "src/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileUseCaseRequest {
    userId: string
}

interface GetUserProfileUseCaseRequest {
    user: User
}

export class getUserProfileUseCase {
    constructor(
        private usersRepository: UsersRepository
    ){}

    async execute({ 
        userId,
    }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseRequest>{
        const user = await this.usersRepository.findById(userId)

        if(!user){
            throw new ResourceNotFoundError()
        }

        return {
            user,
        }
    }
}