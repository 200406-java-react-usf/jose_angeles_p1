import {Reimbursement} from '../models/reimbursement';
import {CrudRepository} from './crud-repo';
import {InternalServerError} from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import {mapReimbursementResultSet} from '../util/result-set-mapper';

// export the ReimbursementRepository
export class ReimbursementRepository implements CrudRepository<Reimbursement> {
    baseQuery = `select r.reimb_id, 
                        r.amount, 
                        r.submitted, 
                        r.resolved, 
                        r.description, 
                        u.username as author, 
                        u2.username as resolver,
                        s.reimb_status as status,
                        t.reimb_type as type
                        from ers_reimbursements r 
                        join ers_users u 
                        on r.author_id = u.ers_user_id 
                        join ers_users u2
                        on r.resolver_id = u2.ers_user_id 
                        join ers_reimbursement_statuses s
                        on r.reimb_status_id = s.reimb_status_id 
                        join ers_reimbursement_types t 
                        on r.reimb_type_id = t.reimb_type_id`;

    // the following methods will be called from ReimbursementService 
    async getAll(): Promise<Reimbursement[]> {
        let client: PoolClient;
        try {
            // make connection to DB
            client = await connectionPool.connect();

            // baseQuery to getAllReimb
            let sql = `${this.baseQuery}`;

            // run the query
            let rs = await client.query(sql);
            
            // map all reimb and return them
            return rs.rows.map(mapReimbursementResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getById(id: number): Promise<Reimbursement> {
        let client: PoolClient;
        try {
            // connection to db
            client = await connectionPool.connect();

            // this is our query
            let sql = `${this.baseQuery} where r.reimb_id = $1`;

            // run our query
            let rs = await client.query(sql, [id]);
            
            // map the resultSet and return it
            return mapReimbursementResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async addNew(newReimbursement: Reimbursement): Promise<Reimbursement> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            // we need to get author id 
            let authorId = (await client.query(`select ers_user_id 
                                                from ers_user 
                                                where username = $1`, [newReimbursement.author])).rows[0].ers_user_id;
                                                
            // we need to get resolver id                                    
            let resolverId = (await client.query(`select ers_user_id 
                                                from ers_user 
                                                where username = $1`, [newReimbursement.resolver])).rows[0].ers_user_id;

            // we need to get the status Id                                     
            let statusId = (await client.query(`select reimb_status_id 
                                                from ers_reimbursement_statuses 
                                                where reimb_status = $1`, [newReimbursement.status])).rows[0].reimb_status_id;

            // we need to get the type id                                   
            let typeId = (await client.query(`select reimb_type_id 
                                                from ers_reimbursement_types 
                                                where reimb_type = $1`, [newReimbursement.type])).rows[0].reimb_type_id; 
                                                
            // query to create new reimbursement                                  
            let sql = `insert into ers_reimbursements (amount, submitted, resolved, description,
                                                author_id, resolver_id, reimb_status_id, reimb_type_id) values
                                                ($1, $2, $3, $4, $5, $6, $7, $8) returning reimb_id`;
            
            // run query                                    
            let rs = await client.query(sql, [newReimbursement.amount, newReimbursement.submitted, 
                                                newReimbursement.resolved, newReimbursement.description, 
                                                authorId, resolverId, statusId, typeId]); 
                                                console.log(rs.rows[0]);
            
            // make the new reimbursement id equal to the id created by the db
            newReimbursement.id = rs.rows[0].reimb_id;

            // return the new reimb
            return newReimbursement;
        } catch (e) {
            throw new InternalServerError('Couldn\'t add given reimbursement');
        } finally {
            client && client.release();
        }
    }

    async update(updatedReimbursement: Reimbursement): Promise<boolean> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            // we need to get author id
            let authorId = (await client.query(`select ers_user_id 
                                                from ers_user 
                                                where username = $1`, [updatedReimbursement.author])).rows[0].ers_user_id; 

            // we need to get resolver id                                     
            let resolverId = (await client.query(`select ers_user_id 
                                                from ers_user 
                                                where username = $1`, [updatedReimbursement.resolver])).rows[0].ers_user_id;

            // we need to get the status Id                                    
            let statusId = (await client.query(`select reimb_status_id 
                                                from ers_reimbursement_statuses 
                                                where reimb_status = $1`, [updatedReimbursement.status])).rows[0].reimb_status_id;

            // we need to get the type id                                    
            let typeId = (await client.query(`select reimb_type_id 
                                                from ers_reimbursement_types 
                                                where reimb_type = $1`, [updatedReimbursement.type])).rows[0].reimb_type_id;
            
            // query to update reimb                                    
            let sql = `update ers_reimbursements set amount = $2,
                                                submitted = $3,
                                                resolved = $4,
                                                description = $5,
                                                author_id = $6,
                                                resolver_id = $7,
                                                reimb_status_id = $8,
                                                reimb_type_id = $9
                                                where reimb_id = $1`;                                            
            
            // run query                                    
            let rs = await client.query(sql,[updatedReimbursement.id, updatedReimbursement.amount, 
                                            updatedReimbursement.submitted, updatedReimbursement.resolved, 
                                            updatedReimbursement.description, authorId, resolverId,
                                            statusId, typeId]);

            // return boolean                                 
            if(rs.rowCount) return true;    
            return false;
        } catch (e) {
            throw new InternalServerError('Invalid input to update user');
        } finally {
            client && client.release();
        }
    }

    async deleteById(id: number): Promise<boolean> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();

            // query to delete reimb
            let sql = `delete from ers_reimbursements where reimb_id = $1`;

            // run query
            await client.query(sql, [id]);

            // always return true if query ran successfully
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }   
}
