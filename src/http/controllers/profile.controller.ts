import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply){

    //busca o token dentro cabeçalho, e se existir, irá validar se ele foi realmente gerado pela aplicação
    await request.jwtVerify()

    console.log(request.user.sub)

    return reply.status(200).send()
}