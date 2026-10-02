import { Router } from 'express';
import {
  createFabric,
  getFabrics,
  getFabricById,
  updateFabric,
  deleteFabric,
} from '../controllers/fabric';

const router = Router();

router.post('/', createFabric);
router.get('/', getFabrics);
router.get('/:id', getFabricById);
router.put('/:id', updateFabric);
router.delete('/:id', deleteFabric);

export default router;
