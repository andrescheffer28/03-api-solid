import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from 'src/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUserCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUserCase

describe('Check-in Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUserCase(checkInsRepository)

        //creação do mocking
        vi.useFakeTimers()
    })

    //boa prática é depois de criar um mocking restar pro estado original
    afterEach(() =>{
        vi.useRealTimers()
    })

    it('should be able to Check in', async () =>{
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        const { checkIn } = await sut.execute({
            //em nenhum momento do user-case por enquanto é feito a verificação
            // se o usuário e academia existem, logo gymId e userId podem ser iguais a qualquer string
            gymId: 'gym-01',
            userId: 'user-01',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    //teste criado usando o tdd (desenvolvimento orientado a testes)
    // 1° etapa é red (erro no teste)
    // 2° etapa é green, codando o mínimo possível
    // 3° etapa de refatoração
    it('should not be able to check in twice in the same day', async () =>{
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        
        //realiza o primeiro check in
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        //realiza um novo check in
        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })).rejects.toBeInstanceOf(Error)
    })

    it('should be able to check in twice but in different days', async () =>{
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        
        //realiza o primeiro check in
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        //realiza um novo check in
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})