import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInsRepository implements CheckInsRepository{
    public items: CheckIn[] = []

    async findByUserIdOnDate(userId: string, date: Date){
        
        //seguindo o tdd, essa é 1° implementação pra dar verde
        //fazer a validação apenas por user id e n com base na data, na parte de refatoração
        //será corrigido

        // a ideia é criar mais testes para entender o caminho q o código deve seguir
        const checkInOnSameDate = this.items.find(
            (checkIn) => checkIn.user_id === userId,
        )

        if(!checkInOnSameDate){
            return null
        }

        return checkInOnSameDate
    }
    
    async create(data: Prisma.CheckInUncheckedCreateInput){
       const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,  
            created_at: new Date(),
        }

        this.items.push(checkIn)

        return checkIn
    }
    
}