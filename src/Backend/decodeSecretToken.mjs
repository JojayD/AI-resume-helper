export const decodeToken = (token) => {
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		return decoded;
	} catch (error) {
		// Token is invalid or expired
		return null;
	}
};
