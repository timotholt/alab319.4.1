// routes/grades.mjs
import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Create a single grade entry
router.post("/", async (req, res) => {

    // Access grades collection and treat the req.body as a document for mongo
    let collection = await db.collection("grades");
    let newDocument = req.body;

    // Convert student_id to learner_id
    if (newDocument.student_id) {
        newDocument.learner_id = newDocument.student_id;
        delete newDocument.student_id;
    }

    // MongoMe!
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

// Get a single grade entry
router.get("/:id", async (req, res) => {

    // Access grades collection and get query from parameters
    let collection = await db.collection("grades");
    let query = { _id: ObjectId(req.params.id) };

    // MongoMe!
    let result = await collection.findOne(query);

    // Uh oh!
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {

    // Access grades collection and get query from parameters
    let collection = await db.collection("grades");
    let query = { _id: ObjectId(req.params.id) };

    // MongoMe!
    let result = await collection.updateOne(query, {
        $push: { scores: req.body }
    });

    // Uh oh!
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {

    // Access grades collection and get query from parameters
    let collection = await db.collection("grades");
    let query = { _id: ObjectId(req.params.id) };

    // MongoMe!
    let result = await collection.updateOne(query, {
        $pull: { scores: req.body }
    });

    // Uh oh!
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// Delete a single grade entry
router.delete("/:id", async (req, res) => {
    
    // Access grades collection and get query from parameters
    let collection = await db.collection("grades");
    let query = { _id: ObjectId(req.params.id) };

    // MongoMe!
    let result = await collection.deleteOne(query);

    // Uh oh!
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {

    // Redirect to /learner/{student_id}
    res.redirect(`learner/${req.params.id}`);
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {

    // Access grades collection and get query from parameters
    let collection = await db.collection("grades");
    let query = { learner_id: Number(req.params.id) };

    // Check for class_id parameter
    if (req.query.class) query.class_id = Number(req.query.class);

    // MongoMe!
    let result = await collection.find(query).toArray();

    // Uh oh!
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {

    // Access grades collection and get query from parameters
    let collection = await db.collection("grades");
    let query = { learner_id: Number(req.params.id) };

    // MongoMe!
    let result = await collection.deleteOne(query);

    // Uh oh!
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// Get a class's grade data
router.get("/class/:id", async (req, res) => {

    // Access grades collection and get query from parameters
    let collection = await db.collection("grades");
    let query = { class_id: Number(req.params.id) };

    // Check for learner_id parameter
    if (req.query.learner) query.learner_id = Number(req.query.learner);

    // MongoMe!
    let result = await collection.find(query).toArray();

    // Uh oh!
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// Update a class id
router.patch("/class/:id", async (req, res) => {

    // Access grades collection and get query from parameters
    let collection = await db.collection("grades");
    let query = { class_id: Number(req.params.id) };

    // MongoMe!
    let result = await collection.updateMany(query, {
    $set: { class_id: req.body.class_id }
    });

    // Uh oh!
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// Delete a class
router.delete("/class/:id", async (req, res) => {

    // Access grades collection and get query from parameters
    let collection = await db.collection("grades");
    let query = { class_id: Number(req.params.id) };

    // MongoMe!
    let result = await collection.deleteMany(query);

    // Uh oh!
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

export default router;