import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from 'src/repositories/in-memory/in-memory-users-repository'
import { getUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let  usersRepository: InMemoryUsersRepository
let sut: getUserProfileUseCase


describe('Get User profile use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new getUserProfileUseCase(usersRepository)
    })

    it('should be able to get user profile', async () =>{
    const createdUser = await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe1@exemple.com',
            password_hash: await hash('123456',6),
        })

        const { user } = await sut.execute({
            userId: createdUser.id,
        })

        //espero q depois de criar o perfil do usuário e tentar buscar o perfil do usuário
        // retorne o nome
        expect(user.name).toEqual('John Doe')
    })

    it('should not be able to get user profile with a wrong id', async () =>{

        await expect(() => sut.execute({
            userId: 'non-existing-id',
        }),).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})