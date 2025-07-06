import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository{
    findById(id: string): Promise<CheckIn | null>
    findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
    countByUserId(userId: string): Promise<number>
    // procura se existe um check-in de um usuário em uma determinada data
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    save(checkIn: CheckIn): Promise<CheckIn>
}