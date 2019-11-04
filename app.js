//webservice To-Do list with Mongoose



const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");

var app = Express();
var Schema = Mongoose.Schema


app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//app.post("/person", async (request, response) => {});
//app.get("/people", async (request, response) => {});
//app.get("/person/:id", async (request, response) => {});
//app.put("/person/:id", async (request, response) => {});
//app.delete("/person/:id", async (request, response) => {});

app.listen(3000, () => {
    console.log("Listening at :3000...");
});


Mongoose.connect("mongodb://localhost/thepolyglotdeveloper");


const TaskModel = Mongoose.model("task", {
    title: String,
    timestamp: String,
    done: Boolean
});


const ListModel = Mongoose.model("list", {
    title: String,
    latitude: String,
    longitude: String,
    timestamp: String,
    tasks: [{ type: Schema.Types.ObjectId, ref: 'TaskModel'}]
});


const UserModel = Mongoose.model("user", {
    email: String,
    password: String,
    timestamp: String,
    lists: [{ type: Schema.Types.ObjectId, ref: 'ListModel'}]
});



app.get("/info", async (request, response) => {
    
    response.status(200).send("ToDoListWebservice by Giovanne Dias");
    
});


app.get("/users", async (request, response) => {
    try {
        var result = await UserModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.post("/user", async (request, response) => {


    try {
        var user = new UserModel(request.body);
        var result = await user.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.get("/user/:id", async (request, response) => {
    try {
        var user = await UserModel.findById(request.params.id).exec();

         // Website you wish to allow to connect
         response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

        // Request methods you wish to allow
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        response.setHeader('Access-Control-Allow-Credentials', true);

        response.send(user);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.put("/user/:id", async (request, response) => {
    try {
        var user = await UserModel.findById(request.params.id).exec();
        user.set(request.body);
        var result = await user.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.delete("/user/:id", async (request, response) => {
    try {
        var result = await UserModel.deleteOne({ _id: request.params.id }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.post("/user/:id/list/", async (request, response) => {


     try {
        var user = await UserModel.findById(request.params.id).exec();
        var list = new ListModel(request.body);
        var result = await list.save();
        user.lists.push(list);
        result = await user.save();

        console.log("list was created");


        response.send(list);

    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/user/:id/lists/", async (request, response) => {



     try {
        var user = await UserModel.findById(request.params.id).populate('lists', 'title latitude longitude',ListModel).exec();

        response.send(user);

    } catch (error) {
        response.status(500).send(error);
    }
});
//Story.findOne({_id: 'xxxxxxx'}).populate('person', 'name age').exec(function(err, story) {


app.get("/user/:id/list/:id", async (request, response) => {


     try {
        var list = await ListModel.findById(request.params.id).exec();

        response.send(list);

    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/list/:id", async (request, response) => {


     try {
        var list = await ListModel.findById(request.params.id).exec();

        response.send(list);

    } catch (error) {
        response.status(500).send(error);
    }
});


app.get("/user/:id/list/:id/tasks", async (request, response) => {


     try {

        var list = await ListModel.findById(request.params.id).populate('tasks', 'title',TaskModel).exec();


        response.send(list);

    } catch (error) {
        response.status(500).send(error);
    }
});


//create new task for a user and list

app.post("/user/:userID/list/:listID/task", async (request, response) => {


     try {

        var list = await ListModel.findById(request.params.listID).exec();
 		var task = new TaskModel(request.body);
        var result = await task.save();
        list.tasks.push(task);
        result = await list.save();

        response.send(result);

    } catch (error) {
        response.status(500).send(error);
    }
});


/*

{
    "lists": [],
    "_id": "5db54f1412b4b222bda26308",
    "email": "test@test.com",
    "password": "123123",
    "__v": 0
}






*/


