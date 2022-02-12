import express from 'express';


const router = express.Router();

const posts = 'https://api.hatchways.io/assessment/blog/posts';

router.get(posts, (req, res) => {
  res.send(hi);
  console.log(req)
})


export default router;