import request from 'request';
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/users.js';
import morgan from 'morgan';
const app = express();

const PORT = 4000;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/users', userRoutes);


const url = 'https://api.hatchways.io/assessment/blog/posts';


app.get("/", (req, res) => {
  res.status(200).json('Try different tags: For instance; /politics, /tech')
})


app.get("/:tag", (req, res) => {

  const cat = req.params.tag;
  const myUrl = `${url}?tag=${cat}`;
  request(myUrl, function (error, response, body) {

    //console.log('body:', JSON.parse(body));
    res.status(200).send(JSON.parse(body))
  });

})

app.get("/api/posts", async (req, res) => {
  const temp = req.query.tags;
  console.log("temp:", temp);
  if (!temp) {
    return res.status(400).send({
      "error": "Tags paramter is required"
    })
  }
  const sortBy = req.query.sortBy;
  if (sortBy && ((sortBy !== "likes") && (sortBy !== "authorId") && (sortBy !== "id") && (sortBy !== "popularity") && (sortBy !== "reads"))) {
    return res.status(400).send({
      "error": "sortBy paramter is invalid"
    })
  }
  const direction = req.query.direction;
  if (direction && (direction !== "asc" && direction !== "desc")) {
    return res.status(400).send({
      "error": "direction parameter is invalid"
    })
  }
  const tags = temp.split(',');
  let posts = [];

  const getPosts = (cat) => {
    return new Promise((resolve, reject) => {
      const myUrl = `${url}?tag=${cat}`;
      console.log("myUrl", myUrl);

      request(myUrl, function (error, response, body) {
        posts = posts.concat(JSON.parse(body).posts)
        resolve()
        //console.log('body:', JSON.parse(body).posts);

      })
    })
  }

  for (let t of tags) {
    await getPosts(t);
  }



  posts.sort((first, second) => direction === 'asc' ? first[sortBy] - second[sortBy] : second[sortBy] - first[sortBy])
  res.send(posts);
})


app.get('*', (req, res) => {
  res.status(404);
  res.send("Tags parameter is required")
})



app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`)
})