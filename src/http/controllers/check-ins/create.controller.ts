import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCheckInUseCase } from 'src/user-cases/factories/make-check-in-use-case'
import { makeCreateGymUseCase } from 'src/user-cases/factories/make-create-gym-use-case'
import { z } from "zod"

export async function create(request: FastifyRequest, reply: FastifyReply){
    const createCheckInParamsSChema = z.object({
        gymId: z.string().uuid(),
    })
    
    const createCheckInodySchema = z.object({
       latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        })
    })

    const { gymId } = createCheckInParamsSChema.parse(request.params)
    const { latitude, longitude } = createCheckInodySchema.parse(request.body)

    const checkInUseCase = makeCheckInUseCase()

    await checkInUseCase.execute({
        gymId,
        userId: request.user.sub,
        userLatitude: latitude,
        userLongitude: longitude
    })

    return reply.status(201).send()
}