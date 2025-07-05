import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from 'src/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUserCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUserCase

describe('Check-in Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUserCase(checkInsRepository)
    })

    it('should be able to Check in', async () =>{

        const { checkIn } = await sut.execute({
            //em nenhum momento do user-case por enquanto é feito a verificação
            // se o usuário e academia existem, logo gymId e userId podem ser iguais a qualquer string
            gymId: 'gym-01',
            userId: 'user-01',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})