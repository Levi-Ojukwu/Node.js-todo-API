/** @format */

import type { Response } from "express";
import Todo, { type ITodo } from "../models/Todo";
import type { AuthRequest } from "../middleware/auth";

// Method to add todo
export async function addTodo(req: AuthRequest, res: Response) {
	try {
		// Destructure ( title, description, deadline, completedAt, tags)
		const { title, description, deadline, tags } = req.body as {
			title: string;
			description: string;
			deadline: string;
			tags?: string[];
		};

		// Check is the request body are missing
		if (!title || !description || !deadline) {
			return res.status(400).json({ message: "All fields required" });
		}

		// Create a new todo post
		const todo = await Todo.create({
			title,
			description,
			deadline: new Date(deadline),
			tags: tags || [],
			user: req.userId,
		});

		return res.status(201).json({ message: "Todo added successfully", todo });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Failed to add todo" });
	}
}

// Method to get all todos
export async function listTodos(req: AuthRequest, res: Response) {
	try {
		const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });

		return res.status(200).json(todos);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Failed to fetch todos" });
	}
}

// Method to get a todo by ID
export async function getTodo(req: AuthRequest, res: Response) {
	try {
		// Destructure the ID from the request parameters
		const { id } = req.params as { id: string };

		// Use Todo.findById passing in the ID to find the todo
		const todo = await Todo.findById({ _id: id, user: req.userId });

		// Check if the todo exists
		if (!todo) {
			return res.status(404).json({ message: "Not found" });
		}

		// Return the todo
		return res.json(todo);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Failed to get todo" });
	}
}

// Method to update a todo
export async function updateTodo(req: AuthRequest, res: Response) {
	try {
		// Destructure the id from the request parameters
		const { id } = req.params as { id: string };

		const todo: ITodo | null = await Todo.findById({ _id: id, user: req.userId });

		// Check if the todo exists
		if (!todo) {
			return res.status(404).json({ message: "Todo not found" });
		}

		// For the update, destructure the title, description, deadline, and tags from the request body
		const { title, description, deadline, tags } = req.body as {
			title: string;
			description: string;
			deadline: string;
			tags?: string[];
		};

		// Use typeof check to make sure the destructured body are of the required types before updating them on our todo object
		if (typeof title === "string") todo.title = title;
		if (typeof description === "string") todo.description = description;
		if (typeof deadline === "string") todo.deadline = new Date(deadline);
		if (Array.isArray(tags)) todo.tags = tags;

		// Save the updated todo
		await todo.save();

		// Return the updated todo
		return res.status(200).json({ message: "Todo updated successfully", todo });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Failed to update todo" });
	}
}

// Method to mark a todo as completed
export async function markTodoCompleted(req: AuthRequest, res: Response) {
	try {
		// Destructure the ID from the request parameter
		const { id } = req.params as { id: string };

		// Find the todo by ID and ensure it belongs to the logged-in user
		const todo: ITodo | null = await Todo.findOne({
			_id: id,
			user: req.userId,
		});

		// If todo not found, send 404 response
		if (!todo) {
			return res.status(404).json({ message: "Todo not found" });
		}

		// If already complete, return 400 response
		if (todo.completedAt) {
			return res
				.status(400)
				.json({ message: "Todo already marked as completed" });
		}

		// Mark todo as completed
		todo.completedAt = new Date();

		// Save changes
		await todo.save();

		// Return success response
		return res.status(200).json({ message: "Todo marked as completed", todo });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: "Failed to mark todo as completed" });
	}
}

// Method to delete a todo
export async function deleteTodo(req: AuthRequest, res: Response) {
	try {
		// Destructure ID from request parameters
		const { id } = req.params as { id: string };

		// Delete the todo only if it belongs to the logged-in user
		const todo = await Todo.findOneAndDelete({ _id: id, user: req.userId });

		if (!todo) {
			return res.status(404).json({ message: "Todo not found" });
		}

		return res.status(200).json({ message: "Todo deleted successfully" });
	} catch (error) {
        return res.status(500).json({ message: "Failed to delete todo" });
    }
}

export default { addTodo, listTodos, getTodo, updateTodo, markTodoCompleted, deleteTodo }
