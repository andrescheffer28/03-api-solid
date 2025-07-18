import request from 'supertest'
import { app } from 'src/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from 'src/utils/create-and-authenticate-use'
import { prisma } from 'src/lib/prisma'

describe('Create Check-in (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })


    it('should be able to create a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const gym = await prisma.gym.create({
            data:{
                title: 'JavaScript Gym',
                latitude: 0,
                longitude: 0,
            }
        })

        const response = await request(app.server)
            .post(`/gym/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: 0,
                longitude: 0,
            })

        expect(response.statusCode).toEqual(201)
    })
})