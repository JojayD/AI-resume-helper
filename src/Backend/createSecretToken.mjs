import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createSecretToken = (user) => {
	const payload = {
		userId: user._id, // Typically the user's database ID.
		username: user.username,
		password: user.password
	};
	return jwt.sign(payload, process.env.SECRET_KEY, {
		expiresIn: 3 * 24 * 60 * 60,
	});
};
