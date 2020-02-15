const request = require('supertest')

const app = require('../app')

describe('Post endpoints', () => {
  it('Shuld create a new post', async () => {
    const res = await request(app)
      .post('/api/player/create')
      .send({
        name: 'Francisco', name_lower: 'francisco', won: 9
      })
    expect(res.statusCode).toEqual(200)
  })
})