/** @format */

import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

// Method to register a new user
export async function register(req: Request, res: Response) {
	try {
		// Destructure the name, email, password, and profile_image from the request body
		const { name, email, password, profile_image } = req.body as {
			name: string;
			email: string;
			profile_image: string;
			password: string;
		};

		// Check if the name, email, and password field are missing
		if (!name || !email || !password) {
			res.status(400).json({ message: "All fields required" });
		}

		// Check if the user is already registered
		const existing = await User.findOne({ email });
		if (existing) {
			res.status(401).json({ message: "User already registered" });
		}

		// Password hash for security
		const passwordHash = await bcrypt.hash(password, 10);

		// Handle image. Checks if the file was uploaded using req.file. If so create a URL for the file. Otherwise, the image URL will be undefined
		const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

		// Use our user model to create a new document with the user's name, email, the new hashed password, and profile image.
		const user = await User.create({ name, email, passwordHash, imageUrl });

		// Generate a json web token
		const token = jwt.sign(
			{ userId: String(user._id) },
			process.env.JWT_SECRET as string,
			{ expiresIn: "7d" },
		);

		// Send a successful response
		return res
			.status(200)
			.json({ token, user: { id: String(user._id), name, email, imageUrl } });
	} catch (error) {
		return res.status(500).json({ message: "Registration failed" });
	}
}

// Method to login
export async function login(req: Request, res: Response) {
	try {
		// Destructure the email and password from the request body
		const { email, password } = req.body as { email: string; password: string };

		if (!email || !password) {
			return res.status(401).json({ message: "All fields required" });
		}

		// Find the user from the database using their email
		const user = await User.findOne({ email });

		// Check if the user exists
		if (!user) {
			return res.status(401).json({ message: "Invalid user" });
		}

		// Compare the plain text password with the stored hash password
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) {
			return res.status(401).json({ message: "Incorrect password" });
		}

		// Generate and sign a new jwt if all both checks pass (user is authenticated
		const token = jwt.sign(
			{ userId: String(user._id) },
			process.env["JWT_SECRET"] as string,
			{ expiresIn: "7d" },
		);

		// Send a successful response
		return res.status(200).json({
			token,
			user: { id: String(user._id), name: user.name, email: user.email },
		});
	} catch (error) {
		return res.status(500).json({ message: "Login failed" });
	}
}

// Method to get user profile
export async function getProfile (req: AuthRequest, res: Response) {
	try {
		// Find the currently logged-in user and return all their details except the password 
		const user = await User.findById(req.userId).select("-passwordHash");

		// Check if user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Return the user
		return res.status(200).json(user) 
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Failed to get user profile" })
	}
}

export async function updateProfile (req: AuthRequest, res: Response) {
	try {
		// Destructure the { name, password, and profile_image } from the request body
		const { name, password, profile_image } = req.body;

		// Find user by ID
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the name field is of string type and update the name 
		if (typeof name === "string" && name.trim() !== "") {
			user.name = name.trim();
		}

		// Check if the password field is of string type, then update the password and harsh the new password
		if (typeof password === "string" && password.trim() !== "") {
			const salt = await bcrypt.genSalt(10);

			user.passwordHash = await bcrypt.hash(password, salt);
		}

		// Check if the profile_image field is of type string, then update the imaage
		if (typeof profile_image === "string" && profile_image.trim() !== "") {
			user.profile_image = profile_image;
		}

		// Save the update
		await user.save();

		// Return success response
		return res.status(200).json({ message: "User profile updated successfully", user }) 
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Failed to update profile" })
	}
}

export default { register, login, getProfile, updateProfile }
