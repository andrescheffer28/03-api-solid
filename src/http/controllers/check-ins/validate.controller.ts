import { FastifyRequest, FastifyReply } from 'fastify'
import { makeValidateCheckInUseCase } from 'src/user-cases/factories/make-validate-check-in-use-case'
import { z } from "zod"

export async function validate(request: FastifyRequest, reply: FastifyReply){
    const validateCheckInParamsSChema = z.object({
        checkInId: z.string().uuid(),
    })

    const { checkInId } = validateCheckInParamsSChema.parse(request.body)

    const validateCheckInUseCase = makeValidateCheckInUseCase()

    await validateCheckInUseCase.execute({
        checkInId
    })

    return reply.status(204).send()
}