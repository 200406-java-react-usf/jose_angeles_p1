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

    // the following functions will validate data and call the userRepo
    async getAllUsers(): Promise<User[]> {
        // call getAll() 
        let users = await this.userRepository.getAll();

        // make sure that what we got is not empty
        if (users.length == 0) {
            throw new ResourceNotFoundError('There aren\'t any users in the DB');
        }

        // return all the users
        return users;       
    }

    async getUserById(id: number): Promise<User> {
        // validate id to make sure id is a number
        if (!isValidId(id)) {
            throw new BadRequestError('This is not a valid id');
        };

        // call getById from userRepo
        let user = await this.userRepository.getById(id);

        // make sure what we got does exist
        if (isEmptyObject(user)) {
            throw new ResourceNotFoundError('There aren\'t any user with given id');
        };

        // just return our user
        return user;
    }

    async addNewUser(newUser: User): Promise<User> {
        try {
            // is our input a valid User?
            if (!isValidObject(newUser, 'username')) {
                throw new BadRequestError('Invalid property value found in provided user');
            }

            // run addNew from user repo and store that value
            const persistedUser = await this.userRepository.addNew(newUser);

            // return stored value
            return persistedUser;
        } catch (e) {
            throw e;
        }
    }

    async updateUser(updateUser: User): Promise<boolean> {
        try {
            // is our input a valid User?
            if (!isValidObject(updateUser, 'id')) {
                throw new BadRequestError('Invalid properly value found in provided user');
            }

            // run update from user repo and store that value
            const persistedUser = await this.userRepository.update(updateUser);

            // return stored value
            return persistedUser;
        } catch (e) {
            throw e;
        }
    }

    async deleteUserById(jsonObj: object): Promise<boolean> {
        // in the next 3 lines we extract the id from the object passed
        let keys = Object.keys(jsonObj);
        let val = keys[0];
        let userId = +jsonObj[val];

        try {
            // validate if id is a number
            if (!isValidId(userId)) {
                throw new BadRequestError('Invalid id provided');
            }

            // call deleteById on user repos and store boolean
            let deletedUser = await this.userRepository.deleteById(userId);

            // just return the boolean which is most likely true
            return deletedUser;
        } catch (e) {
            throw e;
        }
    }
}