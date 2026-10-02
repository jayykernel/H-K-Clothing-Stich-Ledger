import { Router } from 'express';
import {
  calculateAndSaveCosting,
  getCostingRecords,
  getCostingRecordById,
} from '../controllers/costing';

const router = Router();

router.post('/', calculateAndSaveCosting);
router.get('/', getCostingRecords);
router.get('/:id', getCostingRecordById);

export default router;
