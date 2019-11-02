//mongoose_exemple_2

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


const PersonModel = Mongoose.model("person", {
    firstname: String,
    lastname: String
});


const ProfessionModel = Mongoose.model("profession", {
    title: String,
    people: [{ type: Schema.Types.ObjectId, ref: 'PersonModel'}]
});


/*Story.findOne({_id: 'xxxxxxx'}).populate('person', 'name age').exec(function(err, story) {
  console.log('Story title: ', story.title);
  console.log('Story creator', story.person.name);
});*/


// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

app.post("/profession", async (request, response) => {

    console.log("Create person!");

    try {
        var profession = new ProfessionModel(request.body);
        var result = await profession.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/profession", async (request, response) => {
    try {
        var result = await ProfessionModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});




//profession 5db54739bcb5eb223ce7f956
//people 5db541bc86d84c21f6b2621a
app.post("/profession/:id/user/:userID", async (request, response) => {

    console.log("Create person!");


     try {
        var profession = await ProfessionModel.findById(request.params.id).exec();
        var person = await PersonModel.findById(request.params.userID).exec();

        profession.people.push(person);
        var result = await profession.save();

        response.send(result);

    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/person", async (request, response) => {

    console.log("Create person!");

    try {
        var person = new PersonModel(request.body);
        var result = await person.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.get("/people", async (request, response) => {
    try {
        var result = await PersonModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/person/:id", async (request, response) => {
    try {
        var person = await PersonModel.findById(request.params.id).exec();
        response.send(person);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/profession/:id", async (request, response) => {

     try {
        var profession = await ProfessionModel.findById(request.params.id).exec();
        response.send(profession);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.put("/person/:id", async (request, response) => {
    try {
        var person = await PersonModel.findById(request.params.id).exec();
        person.set(request.body);
        var result = await person.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.delete("/person/:id", async (request, response) => {
    try {
        var result = await PersonModel.deleteOne({ _id: request.params.id }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});