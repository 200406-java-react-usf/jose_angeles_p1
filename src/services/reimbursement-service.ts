import { Reimbursement } from '../models/reimbursement';
import { ReimbursementRepository } from '../repos/reimbursement-repo';
import {isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject} from '../util/validator';
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";

export class ReimbursementService {
    constructor (private reimbursementRepo: ReimbursementRepository) {
        this.reimbursementRepo = reimbursementRepo;
    }

    async getAllReimbursements(): Promise<Reimbursement[]> {
        let reimbursements = await this.reimbursementRepo.getAll();
        if (reimbursements.length == 0){
            throw new ResourceNotFoundError('There aren\'t any reimbursements available');
        }
        return reimbursements;
    }

    async getReimbursementById(id: number): Promise<Reimbursement> {
        if (!isValidId(id)) {
            throw new BadRequestError('The id is not valid');
        }
        let reimbursement = await this.reimbursementRepo.getById(id);
        if (!isEmptyObject(reimbursement)) {
            throw new ResourceNotFoundError('There is no reimbursement for given id');
        };
        return reimbursement;
    }

    async addNewReimbursement (newReimb: Reimbursement): Promise<Reimbursement> {
        try{
            if (!isValidObject(newReimb, 'id')) {
                throw new BadRequestError('Invalid property values found in provided reimbursement');
            }
            const persistedReimb = await this.reimbursementRepo.addNew(newReimb);
            return persistedReimb;
        } catch (e) {
            throw e;
        }   
    }

    async updateReimbursement (updatedReimb: Reimbursement): Promise<boolean> {
        try {
            if (!isValidObject(updatedReimb, 'id') || !isValidObject(updatedReimb.id)) {
                throw new BadRequestError('Invalid property values found in given reimbursement');
            }
            if (!updatedReimb) {
                throw new ResourceNotFoundError();
            }
            let persistedReimb = await this.reimbursementRepo.update(updatedReimb);
            return persistedReimb;
        } catch (e) {
            throw e;
        }
    }

    async deleteReimbursementById (jsonObj: object): Promise<boolean> {
        let keys = Object.keys(jsonObj);
        let val = keys[0];
        let reimbId = +jsonObj[val];
        try {
            if (!isValidId(reimbId)) {
                throw new BadRequestError('Invalid id provided');
            }
            let deletedReimb = this.reimbursementRepo.deleteById(reimbId);
            return deletedReimb;
        } catch (e) {
            throw e;
        }
    }
}