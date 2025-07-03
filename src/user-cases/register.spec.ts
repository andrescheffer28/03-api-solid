import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUserCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from 'src/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

//o que está no before each n é globalmente visível para os testes,
//logo é declarado as variáveis sem inicialização, deixando essa tarefa no beforeEach
let usersRepository: InMemoryUsersRepository
let sut: RegisterUserCase

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUserCase(usersRepository)
    })

    it('should be able to register', async () =>{

        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'johndoe1@exemple.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () =>{

        const { user } = await sut.execute({
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

        const email = 'johndoe1@exemple.com'

        await sut.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })

// a promisse só tem duas alternativas. Ou Resolve / Reject

        await expect(() =>
            sut.execute({
                name: 'John Doe',
                email,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})