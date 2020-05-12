import {User} from '../models/user';
import {CrudRepository} from './crud-repo';
import {InternalServerError} from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import {mapUserResultSet} from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<User> {
    
}
