process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const db = require('../db/connection');

const request = supertest(app);

describe('/', () => {
  beforeEach(() => db.migrate
    .rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run()));
  after(() => db.destroy());
  describe('/api', () => {
    describe('404', () => {
      it('returns a 404 and an appropriate error message', () => request.get('/api/bananas').expect(404).then(({ body }) => {
        expect(body.msg).to.equal('page not found...');
      }));
    });
    describe('/topics', () => {
      const url = '/api/topics';
      it('GET returns staus 200 and an array of topics', () => request.get(url).expect(200).then(({ body: { topics } }) => {
        expect(topics).to.be.an('Array');
        expect(topics.length).to.equal(2);
        expect(topics[0]).to.have.all.keys(['slug', 'description']);
        expect(topics[0].slug).to.equal('mitch');
      }));
      describe('/:topics', () => {
        describe('/articles', () => {
          const url1 = '/api/topics/cats/articles';
          it('GET returns a status 200 and an array of article objects', () => request.get(url1).expect(200).then(({ body: { articles } }) => {
            expect(articles).to.be.an('Array');
            expect(articles[0]).to.have.all.keys(['author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic']);
            expect(articles[0].topic).to.equal('cats');
          }));
          it('if parametric is valid but doesn\'t exist return 404 and appropriate msg', () => request.get('/api/topics/carrots/articles').expect(404).then(({ body }) => {
            expect(body.msg).to.equal('no data for this endpoint...');
          }));
          it('if the parameter is no valid returns a status 400', () => request.get('/api/topics/1/articles').expect(400).then(({ body }) => {
            expect(body.msg).to.equal('bad request malformed param...');
          }));
        });
      });
    });
  });
});
