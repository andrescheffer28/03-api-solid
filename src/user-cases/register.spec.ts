import { expect, describe, it } from 'vitest'
import { RegisterUserCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from 'src/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {

    it('should be able to register', async () =>{
      
        const UsersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUserCase(UsersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe1@exemple.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () =>{
      
        const UsersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUserCase(UsersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe1@exemple.com',
            password: '123456',
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash,
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email', async () =>{
      
        const UsersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUserCase(UsersRepository)

        const email = 'johndoe1@exemple.com'

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })

// a promisse só tem duas alternativas. Ou Resolve / Reject

        expect(() =>
            registerUseCase.execute({
                name: 'John Doe',
                email,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})