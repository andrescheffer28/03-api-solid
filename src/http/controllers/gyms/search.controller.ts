import { FastifyRequest, FastifyReply } from 'fastify'
import { makeSearchGymsUseCase } from 'src/user-cases/factories/make-search-gyms-use-case'
import { z } from "zod"

export async function search(request: FastifyRequest, reply: FastifyReply){
    const searchGymsQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1)
    })

    const { query, page } = searchGymsQuerySchema.parse(request.query)

    const searchGymUserCase = makeSearchGymsUseCase()

    const { gyms } = await searchGymUserCase.execute({
        query: query,
        page,
    })

    return reply.status(200).send({
        gyms
    })
}