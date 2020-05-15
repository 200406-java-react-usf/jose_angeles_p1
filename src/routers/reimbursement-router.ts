import express from 'express';
import { reimbursementService } from '../config/app';

export const ReimbRouter = express.Router();

const ReimbService = reimbursementService;

ReimbRouter.get('', async (req, res) => {
    try {
        let payload = await ReimbService.getAllReimbursements();
        res.status(200).json(payload);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }
});

ReimbRouter.get('/:id', async (req, res) => {
    const id = +req.params.id;
    try {
        let payload = await ReimbService.getReimbursementById(id);
        res.status(200).json(payload);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }
});

ReimbRouter.post('', async (req, res) => {
    console.log('POST REQUEST RECEIVED AT /reimbursements');
    console.log(req.body);

    try {
        let newReimb = await ReimbService.addNewReimbursement(req.body);
        return res.status(200).json(newReimb);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }  
});

ReimbRouter.put('', async (req, res) => {
    console.log('PUT REQUEST RECEIVED AT /reimbursements');
    console.log(req.body);

    try {
        let updatedReimb = await ReimbService.updateReimbursement(req.body);
        res.status(200).json(updatedReimb);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }    
});

ReimbRouter.delete('', async (req, res) => {
    console.log('DELETE REQUEST RECEIVED AT /reimbursements');
    console.log(req.body);
    try {
        let deletedReimb = await ReimbService.deleteReimbursementById(req.body);
        res.status(200).json(deletedReimb);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }    
});