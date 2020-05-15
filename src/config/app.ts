import { UserRepository } from '../repos/user-repo';
import { UserService } from '../services/user-service';
import { ReimbursementRepository} from '../repos/reimbursement-repo';

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

export {
    userRepo,
    userService
}