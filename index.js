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

// app.get("/:id", (req, res) => {
//   console.log(req.params);
//   res.send('I am here');
//   res.end();
// })

app.get("/", (req, res) => {
  res.send('Try different tags: For instance; /politics, /tech')
})


app.get("/:tag", (req, res) => {

  const cat = req.params.tag;
  const myUrl = `${url}?tag=${cat}`;
  request(myUrl, function (error, response, body) {

    //console.log('body:', JSON.parse(body));
    res.send(JSON.parse(body))
  });

})

app.get("/api/posts", async (req, res) => {
  const temp = req.query.tags;
  console.log("temp:", temp);
  const tags = temp.split(',');
  let posts = [];


  const getPosts = (cat) => {
    return new Promise((resolve, reject) => {
      const myUrl = `${url}?tag=${cat}`;
      console.log("myUrl", myUrl)
      request(myUrl, function (error, response, body) {
        posts = posts.concat(JSON.parse(body).posts)
        resolve()
        //console.log('body:', JSON.parse(body).posts);

      });
    })
  }

  for (let t of tags) {
    await getPosts(t);
  }
  const sortBy = req.query.sortBy;
  posts.sort((first, second) => first[sortBy] - second[sortBy])
  res.send(posts);
})


app.get('*', (req, res) => {
  res.status(404);
  res.send('This is not the page you are looking for')
})



app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`)
})