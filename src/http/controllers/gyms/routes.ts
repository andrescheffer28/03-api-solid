import { FastifyInstance } from "fastify";

import { verifyJWT } from "../../middlewares/verify-jwt";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT) // todas as rotas q estiverem dentro desse arquivo de rota vão chamar o middleware hook
}