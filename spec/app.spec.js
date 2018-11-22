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
      it('returns a 404 and an appropriate error message', () => request
        .get('/api/bananas')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('page not found...');
        }));
    });
    describe('/topics', () => {
      const url = '/api/topics';
      it('GET returns staus 200 and an array of topics', () => request
        .get(url)
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an('Array');
          expect(topics.length).to.equal(2);
          expect(topics[0]).to.have.all.keys(['slug', 'description']);
          expect(topics[0].slug).to.equal('mitch');
        }));
      it('POST returns a status 201 and the object that was sent', () => request
        .post(url)
        .send({ slug: 'carrots', description: 'orange and delicious' })
        .expect(201)
        .then(({ body: { topic } }) => {
          expect(topic).to.be.an('Object');
          expect(topic).to.have.all.keys(['slug', 'description']);
          expect(topic.slug).to.equal('carrots');
        }));
      it('if the POST request violates not-null constraint returns a 400 and error msg', () => request
        .post(url)
        .send({ balls: 'balls are bouncy' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('violating not-null constraint...');
        }));
      it('if the POST request has malformed body returns a 400 and error msg', () => request
        .post(url)
        .send({ ahh: 1235 })
        .expect(400));
      it('if the POST request is valid but the slug is taken return 422 and error message', () => request
        .post(url)
        .send({ slug: 'mitch', description: 'great guy' })
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.equal('inprocessable entity...');
        }));
      it('all incorrect methods respond with a 405', () => {
        const invalid = ['delete', 'put', 'patch'];
        return Promise.all(invalid.map(method => request[method](url).expect(405)));
      });
      describe('/:topics', () => {
        describe('/articles', () => {
          const url1 = '/api/topics/mitch/articles';
          it('GET returns a status 200 and an array of article objects', () => request
            .get(url1)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.an('Array');
              expect(articles.length).to.equal(10);
              expect(articles[0]).to.have.all.keys(['author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic']);
              expect(articles[0].topic).to.equal('mitch');
            }));
          it('if parametric is valid but doesn\'t exist return 404 and appropriate msg', () => request
            .get('/api/topics/carrots/articles')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('no data for this endpoint...');
            }));
          it('"limit" is a query which dictates the number of results and is defaulted to 10', () => request
            .get('/api/topics/mitch/articles?limit=5')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(5);
            }));
          it('"sort_by" is a query which determines the sort_criteria defaults to date', () => request
            .get(url1)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[9].created_at).to.equal('1969-12-31T23:00:00.000Z');
            }));
          it('"p" is a query which determines what page you are on', () => request
            .get('/api/topics/mitch/articles?p=2')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(1);
            }));
          it('"sort_ascending" is a bool which changes the sort order defaults to false', () => request
            .get('/api/topics/mitch/articles?sort_ascending=true')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0].created_at).to.equal('1969-12-31T23:00:00.000Z');
            }));
          it('POST adds a new article with title, body and user_id', () => request
            .post(url1)
            .send({ title: 'having fun!', body: 'this is a body', user_id: 1 })
            .expect(201)
            .then(({ body: { article } }) => {
              expect(article).to.be.an('Object');
              expect(article).to.have.all.keys(['title', 'body', 'user_id', 'article_id', 'topic', 'created_at', 'votes']);
              expect(article.article_id).to.equal(13);
            }));
        });
      });
    });
    describe('/articles', () => {
      const url2 = '/api/articles';
      it('GET returns a status 200 and response with an array of article objects', () => request
        .get(url2)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an('Array');
          expect(articles.length).to.equal(10);
          expect(articles[0]).to.have.all.keys(['author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic']);
        }));
    });
  });
});
