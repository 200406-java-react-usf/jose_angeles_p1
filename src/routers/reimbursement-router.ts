import express from 'express';
import { reimbursementService } from '../config/app';

export const ReimbursementRouter = express.Router();

const ReimbService = reimbursementService;

ReimbursementRouter.get('', async (req, res) => {
    try {
        let payload = await ReimbService.getAllReimbursements();
        res.status(200).json(payload);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.get('/:id', async (req, res) => {
    const id = +req.params.id;
    try {
        let payload = await ReimbService.getReimbursementById(id);
        res.status(200).json(payload);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.post('', async (req, res) => {
    console.log('POST REQUEST RECEIVED AT /reimbursements');
    console.log(req.body);

    try {
        let newReimb = await ReimbService.addNewReimbursement(req.body);
        return res.status(200).json(newReimb);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }  
});

ReimbursementRouter.put('', async (req, res) => {
    console.log('PUT REQUEST RECEIVED AT /reimbursements');
    console.log(req.body);

    try {
        let updatedReimb = await ReimbService.updateReimbursement(req.body);
        res.status(200).json(updatedReimb);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }    
});

ReimbursementRouter.delete('', async (req, res) => {
    console.log('DELETE REQUEST RECEIVED AT /reimbursements');
    console.log(req.body);
    try {
        let deletedReimb = await ReimbService.deleteReimbursementById(req.body);
        res.status(200).json(deletedReimb);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }    
});