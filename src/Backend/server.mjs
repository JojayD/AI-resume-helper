//dbuser dbmaster1234
import dotenv from "dotenv";
// import openai  from "openai";
// import { OpenAIApi, Configuration } from 'openai';
import OpenAI from "openai";
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
//OPEN AI CALLS

dotenv.config();
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json()); // Use express.json() for parsing JSON bodies

dotenv.config();
console.log("Here is the API KEY", process.env.OPENAI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main(input) {
	console.log("Before chat completion:", input);
	try {
		// const completion = await openai.chat.completions.create({
		// 	messages: [{ role: "system", content: String({ input }) }],
		// 	model: "gpt-3.5-turbo",
		// });
		// console.log(completion.choices[0]);

		const assistant = await openai.beta.assistants.create({
			name: "Resume Helper",
			instructions:
				"You are a person that critiques resumes and enhances the user.",
			model: "gpt-3.5-turbo",
		});
		const thread = await openai.beta.threads.create();
		const threadedMessage = await openai.beta.threads.messages.create(thread.id, {
			role: "user",
			content: String({ input }),
		});
		console.log("THREADED MESSAGE\n_________\n",threadedMessage);

		const run = await openai.beta.threads.runs.create(thread.id, {
			assistant_id: assistant.id,
		});

		console.log("RUN\n_________\n", run);

		const messages = await openai.beta.threads.messages.list(thread.id);
		console.log("MESSAGE\n_________\n", messages);
	} catch (error) {
		console.log("Error completing chat: ", error);
	}
}

app.post("/ai", (req, res) => {
	const result = req.body.message;
	console.log("Result from client: ", result); // Log the parsed JSON body
	try {
		main(result);
		res.send({ message: "Data received" });
	} catch (error) {
		res.send({ message: "Error on server side" });
	}
});

app.post("/", (req, res) => {
	const result = req.body;
	console.log("Result from client: ", result); // Log the parsed JSON body
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
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

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
run().catch(console.dir);
