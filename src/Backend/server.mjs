//dbuser dbmaster1234
import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
//OPEN AI CALLS

dotenv.config();
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
		const date = new Date();
		const currentDate = date.getMonth() + date.getDay() + date.getFullYear();
		const currentTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
		console.log(currentTime);

		console.log(
			`Response from GPT-4: ${completion.choices[0].message.content}\n`
		);
		return completion.choices[0].message.content;
	} catch (error) {
		console.log("Error completing chat: ", error);
	}
}

app.post("/ai", (req, res) => {
	const resultClient = req.body.user_message;
	console.log("Result from client: ", resultClient); // Log the parsed JSON body
	try {
		main(resultClient).then((gpt_res) => {
			console.log(`\nSending to client: ${gpt_res}`);
			res.json({ system_message: gpt_res });
			storeDatabase(resultClient, gpt_res).then((res) => {
				console.log(`This is the result ${res}`);
			});
		});
	} catch (error) {
		res.send({ user_message: "Error on server side" });
	}
});

app.post("/get_db", (req, res) => {});

app.post("/", (req, res) => {
	const result = req.body;
	console.log("Result from client: ", result); // Log the parsed JSON body
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
	retrieveDatabase();
});

async function retrieveDatabase() {
	const database = client.db("conversations");
	const collections = database.collection("user_conversations");

	const docs = await collections.find({}).toArray();

	console.log(docs);
}

async function storeDatabase(user_input, system_input) {
	const database = client.db("conversations");
	const conversations = database.collection("user_conversations");

	const doc = {
		time: "time",
		user_message: user_input,
		system_message: system_input,
	};
	const result = await conversations.insertOne(doc);
	console.log(result.insertedId);
}

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
	} catch (error) {
		console.log(`Error: ${error}`);
	} finally {
	}
}

run().catch(console.dir);
