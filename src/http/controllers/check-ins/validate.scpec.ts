import request from 'supertest'
import { app } from 'src/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from 'src/utils/create-and-authenticate-use'
import { prisma } from 'src/lib/prisma'

describe('Validate Check-in (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })


    it('should be able to validate a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data:{
                title: 'JavaScript Gym',
                latitude: 0,
                longitude: 0,
            }
        })

        let checkIn = await prisma.checkIn.create({
            data: {
                gym_id: gym.id,
                user_id: user.id
            }
        })

        const response = await request(app.server)
            .patch(`/checkins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(204)

          checkIn = await prisma.checkIn.findFirstOrThrow({
            where:{
                id: checkIn.id,
            }
          })

          expect(checkIn.validated_at).toEqual(expect.any(Date))
    })
})