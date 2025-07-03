import { expect, describe, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from 'src/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUserCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {

    it('should be able to register', async () =>{
      
        const UsersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUserCase(UsersRepository)
        // system under test

        await UsersRepository.create({
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
      
        const UsersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUserCase(UsersRepository)
        // system under test

        expect(() => sut.execute({
            email: 'johndoe1@exemple.com',
            password: '123456',
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () =>{
      
        const UsersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUserCase(UsersRepository)

        await UsersRepository.create({
            name: 'John Doe',
            email: 'johndoe1@exemple.com',
            password_hash: await hash('123456',6)
        })

        expect(() => sut.execute({
            email: 'johndoe1@exemple.com',
            password: '123123',
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})