const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const moment = require("moment");
const join = require("path").join;

//post service
class PostService {
  constructor() {
    this.posts = [];
  }
  async find() {
    return this.posts;
  }
  async create(data) {
    const post = {
      id: this.posts.length + 1,
      title: data.title,
      text: data.text,
      time: moment().format("MMMM Do YYYY, h:mm:ss a")
    };
    this.posts.push(post);
    return post;
  }
}

// Creates an ExpressJS compatible Feathers application
const app = express(feathers());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.configure(express.rest());
app.configure(socketio());

app.use("/posts", new PostService());
app.use(express.errorHandler());

const PORT = process.env.PORT || 3030;

app.on("connection", conn => app.channel("stream").join(conn));
app.publish(data => app.channel("stream"));

app
  .listen(PORT)
  .on("listening", () => console.log(`server is runnig on port ${PORT}`));

app.service("posts").create({
  title: "Welcome",
  text: "Hello Ayman, How are you man!"
});
