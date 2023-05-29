import { User } from '../model/user';

export interface IDbUserRepository {
    findOrCreateUser(address: string): Promise<User>;
}