import { Gym, Prisma } from "@prisma/client";

// é preciso buscar a academia no banco de dados, para obter informações como latitudo, longitude...
// para a validação
export interface GymsRepository{
    findById(id: string): Promise<Gym | null>
    searchMany(query: string, page: number): Promise<Gym[]>
    create(data: Prisma.GymCreateInput): Promise<Gym>
}