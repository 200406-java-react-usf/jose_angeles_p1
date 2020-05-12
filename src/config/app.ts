import { UserRepository } from '../repos/users-repo';
import { UserService } from '../services/user-service';

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

export {
    userRepo,
    userService
}