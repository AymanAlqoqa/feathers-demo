const socket = io("http://localhost:3030");
const app = feathers();
app.configure(feathers.socketio(socket));

const sendPost = async event => {
  const title = document.getElementById("post-title");
  const text = document.getElementById("post-text");

  if (!title.value.trim() || !text.value.trim()) {
    return -1;
  }
  event.preventDefault();
  const post = {
    title: title.value,
    text: text.value
  };

  await app.service("posts").create(post);
  title.value = "";
  text.value = "";
};

const renderPost = data => {
  document.getElementById("posts").innerHTML += `
  <div class="card bg-secondary my-3">
              <div class="card-body">
                <p class="lead">${data.title}</p>

                <em>${data.text}</em>
                <br />
                <small>${data.time}</small>
              </div>
            </div>
  `;
};

//sending the post
document.getElementById("submit").addEventListener("click", sendPost);

const init = async () => {
  const posts = await app.service("posts").find();
  posts.forEach(renderPost);

  //render real time posts
  app.service("posts").on("created", renderPost);
};
init();
