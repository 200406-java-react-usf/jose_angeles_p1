import {UserSchema, ReimbursementSchema} from './schemas';
import {User} from '../models/user';
import {Reimbursement} from '../models/reimbursement';

export function mapUserResultSet(resultSet: UserSchema): User {
    if (!resultSet) {
        return {} as User;
    };

    return new User (
        resultSet.ers_user_id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.email,
        resultSet.role
    );
};

export function mapReimbursementsResultSet (resultSet: ReimbursementSchema): Reimbursement {
    if (!resultSet) {
        return {} as Reimbursement;
    }

    return new Reimbursement (
        resultSet.reimb_id,
        resultSet.amount,
        resultSet.submitted,
        resultSet.resolved,
        resultSet.description,
        resultSet.author,
        resultSet.resolver,
        resultSet.status,
        resultSet.type
    )
}