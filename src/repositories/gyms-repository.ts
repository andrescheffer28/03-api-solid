import { Gym } from "@prisma/client";

// é preciso buscar a academia no banco de dados, para obter informações como latitudo, longitude...
// para a validação
export interface GymsRepository{
    findById(id: string): Promise<User | null>
}