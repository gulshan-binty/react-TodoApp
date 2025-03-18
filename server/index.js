require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const cors = require('cors')
const router= require("./routes")

const app = express()
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));
app.use(express.json())
app.use(cors());
app.use("/api",router)




const port = process.env.PORT||4000
async function startServer() {
    await connectToMongoDB();
    app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
    });
}
startServer();