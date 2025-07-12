import { FastifyInstance } from "fastify";

import { verifyJWT } from "../../middlewares/verify-jwt";
import { create } from "./create.controller";
import { history } from "./history.controller";
import { metrics } from "./metrics.controller";
import { validate } from "./validate.controller";

export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    //como o chekin vai sempre precisar do id, pode ser passado pela rota
    app.get('/check-ins/history', history)
    app.get('/check-ins/history', metrics)

    app.post('/gym/:gymId/check-ins', create)
    app.patch('/check-ins/:checkInId/validate', validate)
}