import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from 'src/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from 'src/repositories/in-memory/in-memory-gyms-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymRepository = new InMemoryGymsRepository()
        sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
    })

    it('should be able to fetch check-in history', async () =>{

        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01',
        })

        const { checkIns } = await sut.execute({
            userId: 'user-01',
            page: 1,
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-01' }),
            expect.objectContaining({ gym_id: 'gym-02' })
        ])
    })

    it('should be able to fetch paginated user check-in history', async () =>{

        for(let i = 1; i <= 22; i++){
            await checkInsRepository.create({
                gym_id: `gym-${i}`,
                user_id: 'user-01',
            })
        }

        const { checkIns } = await sut.execute({
            userId: 'user-01',
            page: 2,
        })
        

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-21' }),
            expect.objectContaining({ gym_id: 'gym-22' })
        ])
    })
})