import { Gym, Prisma } from "@prisma/client";

//permite diferenciar na hora de enviar, o q é latitude e o q é longitude
export interface findManyNearbyParams{
    latitude: number
    longitude: number
}
// quando for chamar o método devera ser
// findManyNearby({ latitude: 1212312...}) ficando mais descritivo

// é preciso buscar a academia no banco de dados, para obter informações como latitudo, longitude...
// para a validação
export interface GymsRepository{
    findById(id: string): Promise<Gym | null>
    findManyNearby(params: findManyNearbyParams): Promise<Gym[]>
    searchMany(query: string, page: number): Promise<Gym[]>
    create(data: Prisma.GymCreateInput): Promise<Gym>
}