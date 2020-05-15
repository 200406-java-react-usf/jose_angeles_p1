import { User } from '../models/user';
import { UserRepository } from '../repos/user-repo';
import {isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject} from '../util/validator';
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";

export class UserService {
    constructor(private userRepository: UserRepository) {
        this.userRepository = userRepository;
    }
    async getAllUsers(): Promise<User[]> {
        let users = await this.userRepository.getAll();
        if (users.length == 0) {
            throw new ResourceNotFoundError('There aren\'t any users in the DB');
        }
        return users;       
    }

    async getUserById(id: number): Promise<User> {
        if (!isValidId(id)) {
            throw new BadRequestError('This is not a valid id');
        };
        let user = await this.userRepository.getById(id);
        if (isEmptyObject(user)) {
            throw new ResourceNotFoundError('There aren\'t any user with given id');
        };
        return user;
    }

    async addNewUser(newUser: User): Promise<User> {
        try {
            if (!isValidObject(newUser, 'username')) {
                throw new BadRequestError('Invalid property value found in provided user');
            }
            const persistedUser = await this.userRepository.addNew(newUser);
            return persistedUser;
        } catch (e) {
            throw e;
        }
    }

    async updateUser(updateUser: User): Promise<boolean> {
        try {
            if (!isValidObject(updateUser, 'id')) {
                throw new BadRequestError('Invalid properly value found in provided user');
            }
            const persistedUser = await this.userRepository.update(updateUser);
            return persistedUser;
        } catch (e) {
            throw e;
        }
    }

    async deleteUserById(jsonObj: object): Promise<boolean> {
        let keys = Object.keys(jsonObj);
        let val = keys[0];
        let userId = +jsonObj[val];
        try {
            if (!isValidId(userId)) {
                throw new BadRequestError('Invalid id provided');
            }
            let deletedUser = await this.userRepository.deleteById(userId);

            if (!deletedUser) {
                throw new ResourceNotFoundError('The provided id doesn\'t exist or has already been deleted')
            }
            return deletedUser;
        } catch (e) {
            throw e;
        }
    }
}