require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const compressRoute = require("./routes/routes");
const app = express();
const port = process.env.PORT || 8000;

//let's create cors option
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

//let's use some middlewares
app.use(cors());

app.use(express.json());
app.use(fileUpload());
app.use("/api/v2",compressRoute);

//let's create our server

app.listen(port,()=>{
    console.log("connected to the server at port",port);
});
