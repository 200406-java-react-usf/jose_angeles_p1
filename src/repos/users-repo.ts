import {User} from '../models/user';
import {CrudRepository} from './crud-repo';
import {InternalServerError} from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import {mapUserResultSet} from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<User> {
    baseQuery = `select u.ers_user_id as id, 
                        u.username, 
                        u.password, 
                        u.first_name as fname, 
                        u.last_name as lname, 
                        u.email, 
                        r.role_name as role 
                        from ers_users u join 
                        ers_user_roles r 
                        on u.user_role_id = r.role_id`;

    async getAll(): Promise<User[]> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql);
            return rs.rows;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getById(id: number): Promise<User> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where u.ers_user_id = $1`;
            let rs = await client.query(sql, [id]);
            return rs.rows[0];
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
            let roleId = (await client.query(`select role_id 
                                                from ers_user_roles r 
                                                where r.role_name = $1`, [newUser.role])).rows[0].role_id;                                               
            let sql = `insert into ers_users (username, password, first_name, last_name, email, user_role_id) values
            ($1, $2, $3, $4, $5, $6) returning ers_user_id`;
            let rs = await client.query(sql, [newUser.username, newUser.password, 
                                                newUser.fn, newUser.ln, newUser.email, 
                                                roleId]); 
            newUser.id = rs.rows[0].ers_user_id;
            return newUser;
        } catch (e) {
            throw new InternalServerError('Couldn\'t add given user, your username and email must be unique');
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
                                        user.fn, user.ln, user.email, user.role]);
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
