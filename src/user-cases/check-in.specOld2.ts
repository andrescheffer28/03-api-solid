import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from 'src/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUserCase } from './check-in'
import { InMemoryGymsRepository } from 'src/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymsRepository
let sut: CheckInUserCase

describe('Check-in Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymRepository = new InMemoryGymsRepository()
        sut = new CheckInUserCase(checkInsRepository,gymRepository)

        // garante q todos os testes q vão executar, já tenham uma academia criada
        gymRepository.items.push({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(0),
            longitude: new Decimal(0),
        })

        vi.useFakeTimers()
    })

    afterEach(() =>{
        vi.useRealTimers()
    })

    it('should be able to Check in', async () =>{

        const { checkIn } = await sut.execute({

            gymId: 'gym-01',
            userId: 'user-01',

            //nesse teste n é relevante
            userLatitude: 0,
            userLongitude: 0,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () =>{
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        
        //realiza o primeiro check in
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',

            //nesse teste n é relevante
            userLatitude: 0,
            userLongitude: 0,
        })

        //realiza um novo check in
        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',

            //nesse teste n é relevante
            userLatitude: 0,
            userLongitude: 0,
        })).rejects.toBeInstanceOf(Error)
    })

    it('should be able to check in twice but in different days', async () =>{
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        
        //realiza o primeiro check in
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',

            //nesse teste n é relevante
            userLatitude: 0,
            userLongitude: 0,
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        //realiza um novo check in
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',

            //nesse teste n é relevante
            userLatitude: 0,
            userLongitude: 0,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to Check in on distant gym', async () =>{

        gymRepository.items.push({
            id: 'gym-02',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-20.3905607),
            longitude: new Decimal(-40.3478296),
        })

        await expect(() => 
            sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -20.3603626,
            userLongitude: -40.3359609,
        })).rejects.toBeInstanceOf(Error)
    })

})