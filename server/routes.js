const express= require ("express")
const nodemailer= require('nodemailer')
const router= express.Router()
const {getConnectedClient}=require("./database")
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("tododb").collection("todos");
    return collection;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aahifab@gmail.com',
    pass: 'vnmx irri eiiq guxc'
  }
});

const sendTodoEmail = async (email, todo) => {
  try {
    if (!email) {
      console.error("Email is missing. Cannot send email.");
      return;
    }

    const mailOptions = {
      from: 'aahifab@gmail.com',
      to: email,
      subject: `New Todo Created: ${todo.title}`,
      text: `A new todo has been created:\n\nTitle: ${todo.title}\nDescription: ${todo.description}\nDue Date: ${todo.dueDate}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};



// GET/todos
router.get('/todos', async (req, res) => {
  const collection = getCollection();

  // The target time to filter by (2:00:00 AM)
  const targetTime = "2:00:00 AM";

  // Find todos where the time portion of the dueDate matches 2:00:00 AM
  const todos = await collection.find({
    // dueDate: {
    //   $regex: `^.*${targetTime}$`,  // Match dueDate strings ending with "2:00:00 AM"
    // }
  }).toArray();

  res.status(200).json(todos);
});


// GET /todos/:id - Fetch a single todo by ID
router.get("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid todo ID" });
    }

    try {
        const todo = await collection.findOne({ _id: new ObjectId(id) });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// POST/todos
router.post('/todos', async (req, res) => {
  try {
    const collection = getCollection();
    const { title, description, tags, dueDate, image, email } = req.body;

    // Validate request body
    if (!title || !email) {
      return res.status(400).json({ message: "Title and Email are required" });
    }

    // Create new Todo object
    const newTodo = { title, description, tags, dueDate, image, email };

    // Insert todo into the database
    const result = await collection.insertOne(newTodo);

    // Send email notification AFTER inserting into the database
    await sendTodoEmail(email, newTodo);

    res.status(201).json({ _id: result.insertedId, newTodo });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Failed to create todo", error: error.message });
  }
});


// PUT/todos
router.put("/todos/:id", async (req, res) => {
    try {
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);

        const { title, description, tags, dueDate, image,email } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        // Ensure tags is an array
        if (tags && !Array.isArray(tags)) {
            return res.status(400).json({ message: "Tags must be an array." });
        }

        const updateFields = {
            title,
            description,
            tags: tags || [],
            dueDate: dueDate || null,
            image: image || "",
            email
        };

        const result = await collection.updateOne({ _id }, { $set: updateFields });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo updated successfully", updatedTodo: updateFields });

    } catch (error) {
        console.error("Error updating Todo:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// DELETE/todos
router.delete("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    try {
        const result = await collection.deleteOne({ _id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports=router