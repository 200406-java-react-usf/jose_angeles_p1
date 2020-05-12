import { User } from '../models/user';
import { UserRepository } from '../repos/users-repo';
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
}