import { FastifyInstance } from "fastify";
import { register } from "./controllers/register.controller";
import { authenticate } from "./controllers/authenticate.controller";
import { profile } from "./controllers/profile.controller";
import { verifyJWT } from "./middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)// route de criação de autenticação

    // rotas que só poderam ser chamadas quando o usuário
    // estiver autenticado
    app.get('/me', { onRequest: [verifyJWT] }, profile)
}