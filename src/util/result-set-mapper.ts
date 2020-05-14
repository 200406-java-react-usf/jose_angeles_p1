import {UsersSchema} from './schemas';
import {User} from '../models/user';

export function mapUserResultSet(resultSet: UsersSchema): User {
    if (!resultSet) {
        return {} as User;
    };

    return new User (
        resultSet.id,
        resultSet.username,
        resultSet.password,
        resultSet.fn,
        resultSet.ln,
        resultSet.email,
        resultSet.role
    );
};