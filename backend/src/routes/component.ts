import { Router } from 'express';
import {
  createComponent,
  getComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
} from '../controllers/component';

const router = Router();

router.post('/', createComponent);
router.get('/', getComponents);
router.get('/:id', getComponentById);
router.put('/:id', updateComponent);
router.delete('/:id', deleteComponent);

export default router;
