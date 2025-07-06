import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserProfileUseCase } from 'src/user-cases/factories/make-get-user-profile-use-case'

export async function profile(request: FastifyRequest, reply: FastifyReply){

    //busca o token dentro cabeçalho, e se existir, irá validar se ele foi realmente gerado pela aplicação
    await request.jwtVerify()

    const getUserProfile = makeGetUserProfileUseCase()

    const { user } = await getUserProfile.execute({
        userId: request.user.sub
    })

    return reply.status(200).send({
        user: {
            ...user,
            password_hash: undefined
        }
    })
}