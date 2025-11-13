import { Router } from 'express';
import { addTodo, listTodos, getTodo, updateTodo, markTodoCompleted, deleteTodo } from '../controllers/todoController';
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, addTodo);
router.get("/", requireAuth, listTodos);
router.get("/:id", requireAuth, getTodo);
router.patch("/:id", requireAuth, updateTodo);
router.patch("/:id/complete", requireAuth, markTodoCompleted);
router.delete("/:id", requireAuth, deleteTodo);

export default router;