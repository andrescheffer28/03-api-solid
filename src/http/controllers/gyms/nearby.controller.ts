import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchNearbyGymsUseCase } from 'src/user-cases/factories/make-fetch-nearby-gyms-use-case'
import { z } from "zod"

export async function nearby(request: FastifyRequest, reply: FastifyReply){
    const nearbyGymsQuerySchema = z.object({
        latitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 180
        })
    })

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

    const fetchNearbyGymsUserCase = makeFetchNearbyGymsUseCase()

    const { gyms } = await fetchNearbyGymsUserCase.execute({
        userLatitude: latitude,
        userLongitude: longitude
    })

    return reply.status(200).send({
        gyms
    })
}