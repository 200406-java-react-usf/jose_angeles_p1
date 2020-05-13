import {User} from '../models/user';
import {CrudRepository} from './crud-repo';
import {InternalServerError} from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import {mapUserResultSet} from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<User> {


    async getAll(): Promise<User[]> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `select * from ers_users`;
            let rs = await client.query(sql);
            return rs.rows.map(mapUserResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getById(number: number): Promise<User> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `select * from ers_users where ers_user_id = $1`;
            let rs = await client.query(sql);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async addNew(newUser: User): Promise<User> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `insert into ers_users (username, password, first_name, last_name, email, user_role_id) values
            ($1, $2, $3, $4, $5, $6) returning ers_user_id`;
            let rs = await client.query(sql, [newUser.username, newUser.password, 
                                                newUser.fn, newUser.ln, newUser.email, 
                                                newUser.role_id]); 
            newUser.id = rs.rows[0].id;
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async update(user: User): Promise<boolean> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `update ers_users set username = $2,
                                            password = $3,
                                            first_name = $4,
                                            last_name = $5,
                                            email = $6,
                                            user_role_id = $7
                                            where ers_user_id = $1    
                                            returning ers_user_id`;
            let rs = await client.query(sql, [user.id, user.username, user.password, 
                                        user.fn, user.ln, user.email, user.role_id]);
        if(rs.rowCount) return true;    
        return false;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async deleteById(id: number): Promise<boolean> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `delete from ers_users where ers_user_id = $1`;
            let rs = await client.query(sql, [id]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }
    
}
