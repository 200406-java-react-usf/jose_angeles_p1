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

    async authenticateUser(un: string, pw: string): Promise<User> {
        try {
            // check to see if the un and pw are strings
            if (!isValidStrings(un, pw)) {
                throw new BadRequestError();
            }
            
            let authUser: User;
            
            // check if the user really exists by these credentials
            authUser = await this.userRepository.getUserByCredentials(un, pw);
           
            // check if what we got is empty
            if (isEmptyObject(authUser)) {
                throw new AuthenticationError('Bad credentials provided.');
            }

            // return the authUser after password is removed
            return this.removePassword(authUser);

        } catch (e) {
            throw e;
        }
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

    async deleteUserById(id: number): Promise<boolean> {
        try {
            // validate if id is a number
            if (!isValidId(id)) {
                throw new BadRequestError('Invalid id provided');
            }

            // call deleteById on user repos and store boolean
            let deletedUser = await this.userRepository.deleteById(id);

            // just return the boolean which is most likely true
            return deletedUser;
        } catch (e) {
            throw e;
        }
    }

    // we make this function to remove the password from the User
    private removePassword(user: User): User {
        // if there is no password, then just return the user
        if(!user || !user.password) return user;

        // else, pass a copy of user with password deleted
        let usr = {...user};
        delete usr.password;
        return usr;   
    }
}