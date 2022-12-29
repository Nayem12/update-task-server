const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());





// MiddleWare
app.use(cors())
app.use(express.json())
require("dotenv").config()
//Database connection

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.3e6mwvl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const TaskCollection = client.db("Taske").collection("TaskCollection");
        const CommentCollection = client.db("Taske").collection("CommentCollection");

        app.post("/task", async (req, res) => {
            const task = req.body
            const result = await TaskCollection.insertOne(task)
            res.send(result)
        })

        // Task Get Api
        app.get("/task/:email", async (req, res) => {
            const email = req.params.email
            // console.log(email)
            const query = { email: email }
            const result = await TaskCollection.find(query).toArray()
            res.send(result)
        })
        app.get("/task/:id", async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await TaskCollection.findOne(query)
            res.send(result);
        })
        // Task Update complete
        app.put("/task/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    isCompleted: true
                },
            };
            const result = await TaskCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        // Task Not Completed Api
        app.put("/tasks/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    isCompleted: false
                },
            };
            const result = await TaskCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        // Post Api for comment
        app.post("/taskcomment", async (req, res) => {
            const addComment = req.body
            console.log(addComment)

            const result = await CommentCollection.insertOne(addComment)
            res.send(result)
        })

        // Task Delete
        app.delete("/task/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await TaskCollection.deleteOne(query)
            res.send(result)
        })
        // task update
        app.put('/updateTask', async (req, res) => {
            const id = req.query.id;
            console.log(id)
            const updatedData = req.body;
            console.log(updatedData)
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    task: updatedData.task,
                    taskDescription: updatedData.taskDescription
                },
            };
            const result = await TaskCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
    }
    finally {

    }
}

run().catch(err => console.log(err))


app.get('/', async (req, res) => {
    res.send('Taskey server is running');
})

app.listen(port, () => console.log(`Taskey running on ${port}`))
