//BUG collections not being registerd correctly
//Fix might be to return an empty array and not include the user because it inclues the collection user
//dbuser dbmaster1234
//jo23 1234
import { fileURLToPath } from "url";
import { inspect } from "util";
import { dirname } from "path";
import path from "path";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createSecretToken } from "./createSecretToken.mjs";
import OpenAI from "openai";
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
//OPEN AI CALLS
dotenv.config({ path: "../../.env" });

const developmentUrl = "http://localhost:5173";
const productionUrl =
	"https://ai-resume-helper-git-deploy-branch-jojayds-projects.vercel.app";
const url =
	process.env.NODE_ENV === "development" ? developmentUrl : productionUrl;

console.log("Currently in ", url);

console.log("MongoDB URI:", process.env.URI);

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 3000;
const corsOptions = {
	origin: true,
	credentials: true,
	optionsSuccessStatus: 200, // For legacy browser support
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.options
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

mongoose
	.connect(process.env.URI)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 *MONGOOSE FOR USER AND PASSWORD
 */
// This should be stored securely and should be unique to your application.

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

const User = mongoose.model("User", UserSchema);

/**
	post to get register user
*/

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/register", async (req, res) => {
	try {
		console.log("Here is the req body", req.body);
		const { username, password } = req.body;
		const existingUser = await User.findOne({ username });
		console.log("Does user exsist", existingUser);
		if (existingUser) {
			return res.json({ message: "User already exists" });
		} else {
			const user = new User({ username, password });
			const savedUser = await user.save();
			console.log("user saved", savedUser);
			const { token, payload } = createSecretToken(user);
			console.log("The token", token);
			res.cookie("token", token, {
				withCredentials: true,
				httpOnly: true,
			});

			console.log(payload);
			const database = client.db(payload.userId);
			const collection = database.collection("First conversation");
			await collection.insertOne({
				user_message: "",
				system_message: "Welcome to the AI resume helper",
			});

			res.status(201).json({
				message: "User successfully registered",
				success: true,
				user,
				collection_name: "First conversation",
				token,
			});
		}
	} catch (error) {
		res.status(500).json("Error registering user");
	}
});

app.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).send("User not found");
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).send("Invalid credentials");
		}

		const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
			expiresIn: "1h",
		});
		console.log("Logging token", token);
		res.status(201).json({ token, user });
	} catch (err) {
		console.log(err);
	}
});

app.get("/logout", (req, res) => {
	res.cookie("token", "", { expires: new Date(0) });
	res.send("Logged out");
});

/**
 * MONGODB
 */

/**	
				FOR ChatMessage.jsx
*/

app.post("/ai", (req, res) => {
	const { dataBaseName, collectionName, userMessage } = req.body;
	console.log("Result from client: ", userMessage); // Log the parsed JSON body
	try {
		main(userMessage).then((gptRes) => {
			console.log(`\nSending to client: ${gptRes}`);
			res.json({ system_message: gptRes });
			storeDatabase(userMessage, gptRes, dataBaseName, collectionName).then(
				(res) => {
					console.log(`This is the result ${res}`);
				}
			);
		});
	} catch (error) {
		res.send({ userMessage: "Error on server side" });
	}
});

/**
 * get_db
 * @returns conversation of databse aka documents
 */
app.get("/get_db", async (req, res) => {
	if (!client) {
		return res.status(500).send({ error: "Database client not initialized" });
	}

	const userDatabase = req.query.databaseName;
	const collectionName = req.query.collectionName;
	console.log(`userDatabase get_db app recieved: ${userDatabase}`);
	console.log(`userDatabase collectionName recieved: ${collectionName}`);

	const database = client.db(userDatabase);
	try {
		// const collArray = await fetchAllConversations(database);
		const collectionsArray = await database.listCollections().toArray();
		const collectionNames = collectionsArray.map((coll) => {
			console.log("Mapping through", coll.name, coll);
			return coll.name;
		}); // Extract the names of the collections
		console.log(`Here is collection array \n ${collectionsArray}`);
		console.log(`Here is collectionNames  \n ${collectionNames}`);
		let db_res;
		db_res = await retrieveDatabase(userDatabase, collectionName);
		console.log("Found collection in database", userDatabase);

		const conversationArray = db_res.map((val, index) => ({
			index: index,
			user_message: val.user_message,
			system_message: val.system_message,
		}));

		console.log(conversationArray);
		res.json(conversationArray);
	} catch (error) {
		console.error("Error accessing database", inspect(error, { depth: null }));
		res.status(500).send({ error: "Internal server error" });
	}
});

app.post("/create_collection", async (req, res) => {
	const { collectionName, databaseName } = req.query;
	console.log(
		`Logging collectionName\n ${collectionName}\n Logging database ${databaseName}`
	);
	const database = client.db(databaseName);
	try {
		await database.createCollection(collectionName);
		const response = fetchAllConversations(databaseName);
		response.then((response) => {
			res.json(response);
		});
	} catch (error) {
		console.log("Error in /create_collection", error);
	}
});

app.delete("/delete_collection", async (req, res) => {
	try {
		const { deletedCollectionName, databaseName } = req.query;

		// const response = req.query.deletedCollectionName;
		console.log("Delete response:", deletedCollectionName);
		const database = client.db(databaseName);
		const collections = await database.collection(deletedCollectionName).drop();
		console.log(collections);
		if (collections) {
			console.log();
			const collection = fetchAllConversations(databaseName);
			collection.then((response) => {
				console.log("Logging response: ", response);
				res.json(response);
			});
		}
	} catch (e) {
		console.log(e);
		res.status(500).send("An error occurred while deleting the collection");
	}
});

async function main(input) {
	console.log(typeof input);
	try {
		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content:
						"You are an assistant that help people with making their resumes better",
				},
				{
					role: "user",
					content: input,
				},
			],
			model: "gpt-3.5-turbo",
		});

		console.log(
			`Response from GPT-3.5: ${completion.choices[0].message.content}\n`
		);
		return completion.choices[0].message.content;
	} catch (error) {
		console.log("Error completing chat: ", error);
	}
}

//TO SEND DB FOR CHANGE IN FRONTEND FOR WATCH COLLECTION

async function retrieveDatabase(dataBase, collectionName) {
	const database = client.db(dataBase);
	const collection = database.collection(collectionName);
	const docs = await collection.find({}).toArray();
	return docs.map((doc) => ({
		user_message: doc.user_message,
		system_message: doc.system_message,
	}));
}

async function watchCollection() {
	// async function watchDatabase() {
	try {
		await client.connect();
		console.log("Connected to MongoDB.");
		const database = client.db("conversations");

		let changeStream = database.watch();

		changeStream.on("change", (change) => {
			console.log("Received a change in the database:", change);

			// Assuming 'wss' is your WebSocket server instance
			// and you have already defined 'retrieveDatabase' to fetch the latest data
			retrieveDatabase()
				.then((res_db) => {
					wss.clients.forEach((client) => {
						if (client.readyState === WebSocket.OPEN) {
							client.send(JSON.stringify(res_db)); // Make sure 'res_db' is in the desired format
						}
					});
				})
				.catch(console.error);
		});
	} catch (error) {
		console.error("Failed to set up change stream:", error);
	}
	// }
}

async function storeDatabase(
	user_input,
	system_input,
	databaseName,
	collectionName
) {
	const database = client.db(databaseName);
	const conversations = database.collection(collectionName);

	const doc = {
		user_message: String(user_input),
		system_message: String(system_input),
	};

	const result = await conversations.insertOne(doc);
	console.log("Document inserted with _id:", result.insertedId);
}

const simulateAsyncPause = async () => {
	await new Promise((resolve) => {
		setTimeout(resolve, 1000);
	});
};

app.get("/get_conversations", (req, res) => {
	const data = req.query.database;
	console.log("Get conversation data: ", data);
	console.log("getconvo called");
	try {
		const response = fetchAllConversations(data);
		console.log("Response from get_conversation", response);
		response.then((response) => {
			res.json(response);
		});
	} catch (Error) {
		Error;
	}
});

/**
 * @return array of converations
 */
async function fetchAllConversations(database) {
	const dataBase = client.db(database);

	// Use listCollections to get an array of collection information
	const collections = await dataBase.listCollections().toArray();
	let collectionNames = collections.map((coll) => {
		if (coll.name != "users") {
			return coll.name;
		}
	});

	if (collectionNames.length <= 0) {
		collectionNames = [];
	}

	// Extract the names of the collections
	console.log(collectionNames); // Log the actual names of the collections
	return collectionNames;
}

async function run() {
	try {
		await client.connect();
		console.log("MongoDB connected");

		// Call watchCollection here after successful connection
		await watchCollection();

		server.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});

		wss.on("connection", function connection(ws) {
			console.log("A client connected");
			ws.on("message", function incoming(message) {
				console.log("received: %s", message);
			});
		});
	} catch (err) {
		console.error("Failed to connect to MongoDB", err);
	}
}

run().catch(console.dir);
