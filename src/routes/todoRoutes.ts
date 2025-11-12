import { Router } from 'express';
import { addTodo, listTodos, getTodo, updateTodo, markTodoCompleted, deleteTodo } from '../controllers/todoController';

const router = Router();

router.post("/", addTodo);
router.get("/", listTodos);
router.get("/:id", getTodo);
router.patch("/:id", updateTodo);
router.patch("/:id/complete", markTodoCompleted);
router.delete("/:id", deleteTodo);

export default router;