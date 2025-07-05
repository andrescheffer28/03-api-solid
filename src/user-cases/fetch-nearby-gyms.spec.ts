import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from 'src/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Featch Nearby Gyms UseCase', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(gymsRepository)
    })

    it('should be able to fetch nearby gyms', async () =>{

        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -20.3603626,
            longitude: -40.3359609,
        })

        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -19.9370374,
            longitude: -40.7747741,
        })

        const { gyms } = await sut.execute({
            userLatitude: -20.3603626,
            userLongitude: -40.3359609,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' })
        ])
    })
})