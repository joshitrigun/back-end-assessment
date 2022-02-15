//test whether the return is object or array

describe('url Endpoints', () => {

  it('GET /post should show all users', async () => {
    const res = await requestWithSupertest.get('http://localhost:4000/tech');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('users')
  });

  it('GET /api/posts should have sorted results', async () => {
    const res = await requestWithSupertest.get('http://localhost:4000/api/posts?tags=tech,politics&sortBy=reads');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('users')
  })
});

//we can also test the return json to have the object sorted according to the id/likes or other params