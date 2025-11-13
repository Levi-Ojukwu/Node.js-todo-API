/** @format */

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
	// Attach the user ID to the request object after verifying the token
	userId?: string;
}

// Create middleware function
export function requireAuth(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		// get the user's authorization token from the header
		const header = req.headers["authorization"];

		// Validate the header
		if (!header || !header.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Extract the token if the bearer is valid. Remove bearer prefix and trim the whitespace
		const token = header.replace("Bearer ", "").trim();

		// A secret variable to store our jwt secret
		const secret = process.env["JWT_SECRET"];

		// Check if the secret key is missing.
		if (!secret) {
			return res.status(500).json({ message: "Internal server error" });
		}

		// Validate the token by calling jwt.verify, passing in the token and the secret
		// This function will throw a new error if token is invalid or expired
		const payload = jwt.verify(token, secret) as { userId: string };
		req.userId = payload.userId;

		// Pass control to the next middleware function in the chain
		next();
	} catch (error) {
		console.error(error);
		return res.status(401).json({ message: "Invalid token" });
	}
}
