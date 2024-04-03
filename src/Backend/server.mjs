//TODO need to give all the conversations
//dbuser dbmaster1234
import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";

//OPEN AI CALLS

dotenv.config();
const PORT = 3000;
const PORT2 = 3001;
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
dotenv.config();

wss.on("connection", function connection(ws) {
	console.log("A client connected");

	// You can also listen for messages from clients if needed
	ws.on("message", function incoming(message) {
		console.log("received: %s", message);
	});
});

const uri =
	"mongodb+srv://dbUser:dbmaster1234@cluster0.a8oc8fr.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

/**

FOR ChatMessage.jsx

*/

app.post("/ai", (req, res) => {
	const resultClient = req.body.user_message;
	const resultClientDatabase = req.body.document;
	console.log("Result from client: ", resultClient); // Log the parsed JSON body
	try {
		main(resultClient).then((gpt_res) => {
			console.log(`\nSending to client: ${gpt_res}`);
			res.json({ system_message: gpt_res });
			storeDatabase(resultClient, gpt_res, resultClientDatabase).then((res) => {
				console.log(`This is the result ${res}`);
			});
		});
	} catch (error) {
		res.send({ user_message: "Error on server side" });
	}
});

/**
 * get_db
 * @returns database
 */
app.get("/get_db", async (req, res) => {
	if (!client) {
		return res.status(500).send({ error: "Database client not initialized" });
	}

	const userDatabase = req.query.databaseName;
	console.log(`userDatabase get_db app recieved: ${userDatabase}`);
	if (!userDatabase) {
		return res
			.status(400)
			.send({ error: "databaseName query parameter is required" });
	}

	const database = client.db("conversations");

	try {
		const collArray = await fetchAllConversations(database);

		let db_res;
		if (!collArray.includes(userDatabase)) {
			console.log("Not in database, creating", userDatabase);
			db_res = await database.createCollection(userDatabase);
			// Initialize db_res to an empty array if the collection is new
			db_res = [];
		} else {
			console.log("Found collection in database", userDatabase);
			db_res = await retrieveDatabase(userDatabase);
		}

		const conversationArray = db_res.map((val, index) => ({
			index: index,
			user_message: val.user_message,
			system_message: val.system_message,
		}));

		console.log(conversationArray);
		res.json(conversationArray);
	} catch (error) {
		console.error("Error accessing database", error);
		res.status(500).send({ error: "Internal server error" });
	}
});

app.post("/create_collection", async (req, res) => {
	const collection_name = req.query.collection;
	const database = client.db("conversations");
	try {
		await database.createCollection(collection_name);
		const response = fetchAllConversations();
		response.then((response) => {
			res.json(response);
		});
	} catch (error) {
		console.log("Error in /create_collection", error);
	}
});

app.post("/", (req, res) => {
	const result = req.body;
	console.log("Result from client: ", result); // Log the parsed JSON body
});

app.delete("/delete_collection", async (req, res) => {
	try {
		const response = req.query.deletedCollectionName;
		console.log("Delete response: ", response);
		const database = client.db("conversations");
		const collections = database.collection(response);
		const drop_status = await collections.drop();
		if (drop_status) {
			const collection = fetchAllConversations();
			collection.then((response) => {
				res.json(response);
			});
		}
	} catch (e) {
		console.log(e);
		res.status(500).send("An error occurred while deleting the collection");
	}
});

app.listen(PORT, (req, res) => {
	console.log(`Listening on port ${PORT}`);
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
			`Response from GPT-4: ${completion.choices[0].message.content}\n`
		);
		return completion.choices[0].message.content;
	} catch (error) {
		console.log("Error completing chat: ", error);
	}
}

//TO SEND DB FOR CHANGE IN FRONTEND FOR WATCH COLLECTION

async function retrieveDatabase(collectionName) {
	const database = client.db("conversations");
	const collections = database.collection(collectionName);
	const docs = await collections.find({}).toArray();
	if (docs.length > 0) {
		console.log("Logging docs from retrieveDatabase", docs);
		return docs;
	} else {
		return [];
	}
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

async function storeDatabase(user_input, system_input, databaseName) {
	const database = client.db("conversations");
	const conversations = database.collection(databaseName);

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
	console.log("getconvo called");

	try {
		const response = fetchAllConversations();
		response.then((response) => {
			res.json(response);
		});
	} catch (Error) {
		console.log();
		Error;
	}
});

/**
 * @return array of converations
 */
async function fetchAllConversations() {
	let names = [];
	const database = client.db("conversations");

	// Use listCollections to get an array of collection information
	const collections = await database.listCollections().toArray();
	const collectionNames = collections.map((coll) => coll.name); // Extract the names of the collections

	// // Map over the collection names to fetch documents from each collection
	// const conversationPromises = collectionNames.map(async (collName) => {
	// 	const collection = database.collection(collName);
	// 	const elements = await collection.find().toArray(); // Use toArray to get all documents in the collection
	// 	// Assuming you want to collect all documents into 'names'
	// 	elements.forEach((element) => names.push(element));
	// });

	// Wait for all the document fetching operations to complete
	// await Promise.all(conversationPromises);

	console.log(names); // 'names' now contains all documents from all collections
	return collectionNames;
}

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
		await simulateAsyncPause();
	} catch (error) {
		console.log(`Error: ${error}`);
	} finally {
	}
}

server.listen(PORT2, () => {
	console.log(`Server running on port ${PORT2}`);
	watchCollection().catch(console.error);
});

watchCollection();

run().catch(console.dir);
