import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { UserAlreadyExistsError } from 'src/user-cases/errors/user-already-exists-error'
import { makeRegisterUserCase } from 'src/user-cases/factories/make-register-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply){
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        })
    })

    const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body)

    try{
        const createGymUserCase = makeCreateGymUserCase()

        await createGymUserCase.execute({
            title,
            description,
            phone,
            latitude,
            longitude
        })

    }catch(err){
        if(err instanceof UserAlreadyExistsError){
            return reply.status(409).send({ message: err.message })
        }

        throw err
    }

    return reply.status(201).send()
}