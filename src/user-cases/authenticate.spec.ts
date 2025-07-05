import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from 'src/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUserCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let  usersRepository: InMemoryUsersRepository
let sut: AuthenticateUserCase


describe('Authenticate Use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUserCase(usersRepository)
    })

    it('should be able to register', async () =>{
        // system under test

        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe1@exemple.com',
            password_hash: await hash('123456',6)
        })

        const { user } = await sut.execute({
            email: 'johndoe1@exemple.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () =>{

        await expect(() => sut.execute({
            email: 'johndoe1@exemple.com',
            password: '123456',
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () =>{

        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe1@exemple.com',
            password_hash: await hash('123456',6)
        })

        await expect(() => sut.execute({
            email: 'johndoe1@exemple.com',
            password: '123123',
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})