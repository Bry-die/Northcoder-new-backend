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
    it('responds with a status 200', () => request
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.an('Object');
      }));
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
          it('all incorrect methods respond with a 405', () => {
            const invalid = ['delete', 'put', 'patch'];
            return Promise.all(invalid.map(method => request[method](url1).expect(405)));
          });
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
      it('"limit" is a query which dictates the number of results and is defaulted to 10', () => request
        .get('/api/articles?limit=5')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(5);
        }));
      it('"sort_by" is a query which determines the sort_criteria defaults to date', () => request
        .get(url2)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].created_at).to.equal('2018-11-15T00:00:00.000Z');
        }));
      it('"p" is a query which determines what page you are on', () => request
        .get('/api/articles?p=2')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(2);
        }));
      it('"sort_ascending" is a bool which changes the sort order defaults to false', () => request
        .get('/api/articles?sort_ascending=true')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].created_at).to.equal('1969-12-31T23:00:00.000Z');
        }));
      it('all incorrect methods respond with a 405', () => {
        const invalid = ['delete', 'put', 'patch', 'post'];
        return Promise.all(invalid.map(method => request[method](url2).expect(405)));
      });
      describe('/:article_id', () => {
        const url3 = '/api/articles/1';
        it('GET returns a status 200 and returns an specific artical based on the id', () => request
          .get('/api/articles/1')
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.an('Object');
            expect(article).have.all.keys(['article_id', 'title', 'author', 'votes', 'comment_count', 'created_at', 'topic']);
            expect(article.article_id).to.equal(1);
          }));
        it('GET, if parametric is valid but doesn\'t exist return 404 and appropriate msg', () => request
          .get('/api/articles/1234567')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('no data for this endpoint...');
          }));
        it('if the param is not valid responds with a 400 and an error message', () => request
          .get('/api/articles/banana')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('bad request, malformed param...');
          }));
        it('PATCH respondes with status 201 and increases the votes of the artcile', () => request
          .patch('/api/articles/1')
          .send({ inc_votes: 1000 })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).to.be.an('Object');
            expect(article.votes).to.equal(1100);
          }));
        it('PATCH respondes with status 201 and decreases the votes of the artcile', () => request
          .patch('/api/articles/1')
          .send({ inc_votes: -100 })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).to.be.an('Object');
            expect(article.votes).to.equal(0);
          }));
        it('responds with a 400 status and malformed body message when not in the correct format', () => request
          .patch('/api/articles/1')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('bad request malformed body...');
          }));
        it('PATCH, if parametric is valid but doesn\'t exist return 404 and appropriate msg', () => request
          .patch('/api/articles/1234567890')
          .send({ inc_votes: 100 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('no data for this endpoint...');
          }));
        it('DELETE \'s the article and responds with an empty object', () => request
          .delete('/api/articles/1')
          .expect(202)
          .then(({ body }) => {
            expect(body).to.be.an('Object');
            expect(body).to.eql({});
          }));
        it('all incorrect methods respond with a 405', () => {
          const invalid = ['put', 'post'];
          return Promise.all(invalid.map(method => request[method](url3).expect(405)));
        });
        describe('/comments', () => {
          const url4 = '/api/articles/1/comments';
          it('GET returns a status 200 and responds with an array of comment objects', () => request
            .get(url4)
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.an('Array');
              expect(comments[0]).to.have.all.keys(['comment_id', 'votes', 'created_at', 'author', 'body']);
            }));
          it('"limit" is a query which dictates the number of results and is defaulted to 10', () => request
            .get('/api/articles/1/comments?limit=5')
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).to.equal(5);
            }));
          it('"sort_by" is a query which determines the sort_criteria defaults to date', () => request
            .get(url4)
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments[0].created_at).to.equal('2017-08-04T23:00:00.000Z');
            }));
          it('"p" is a query which determines what page you are on', () => request
            .get('/api/articles/1/comments?p=2')
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).to.equal(3);
            }));
          it('"sort_ascending" is a bool which changes the sort order defaults to false', () => request
            .get('/api/articles/1/comments?sort_ascending=true')
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments[0].created_at).to.equal('2016-02-08T00:00:00.000Z');
            }));
          it('GET, if parametric is valid but doesn\'t exist return 404 and appropriate msg', () => request
            .get('/api/articles/1234567890/comments')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('no data for this endpoint...');
            }));
          it('POST adds a new comment, body and user_id to the correct article', () => request
            .post(url4)
            .send({ body: 'love me some comments', user_id: 1 })
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(comment).to.be.an('Object');
              expect(comment).to.have.all.keys(['comment_id', 'body', 'user_id', 'article_id', 'created_at', 'votes']);
              expect(comment.comment_id).to.equal(19);
            }));
          it('POST, responds with a 400 status and malformed body message when not in the correct format', () => request
            .patch(url4)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('bad request malformed body...');
            }));
          it('all incorrect methods respond with a 405', () => {
            const invalid = ['put', 'delete', 'patch'];
            return Promise.all(invalid.map(method => request[method](url4).expect(405)));
          });
        });
      });
    });
    describe('/comments', () => {
      describe('/:comment_id', () => {
        const url5 = '/api/comments/1';
        it('PATCH respondes with status 201 and increases the votes of the comment', () => request
          .patch(url5)
          .send({ inc_votes: 1000 })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an('Object');
            expect(comment.votes).to.equal(1100);
          }));
        it('PATCH respondes with status 201 and decreases the votes of the comment', () => request
          .patch(url5)
          .send({ inc_votes: -1000 })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an('Object');
            expect(comment.votes).to.equal(-900);
          }));
        it('PATCH, if parametric is valid but doesn\'t exist return 404 and appropriate msg', () => request
          .patch('/api/comments/1234567890')
          .send({ inc_votes: 100 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('no data for this endpoint...');
          }));
        it('DELETE \'s the comment and responds with an empty object', () => request
          .delete(url5)
          .expect(202)
          .then(({ body }) => {
            expect(body).to.be.an('Object');
            expect(body).to.eql({});
          }));
        it('all incorrect methods respond with a 405', () => {
          const invalid = ['put', 'get', 'post'];
          return Promise.all(invalid.map(method => request[method](url5).expect(405)));
        });
      });
    });
    describe('/users', () => {
      const url6 = '/api/users';
      it('GET returns a status 200 and an array of user objects', () => request
        .get(url6)
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).to.be.an('Array');
          expect(users.length).to.equal(3);
          expect(users[0]).to.have.all.keys(['user_id', 'username', 'avatar_url', 'name']);
          expect(users[0].user_id).to.equal(1);
        }));
      it('all incorrect methods respond with a 405', () => {
        const invalid = ['put', 'patch', 'post', 'delete'];
        return Promise.all(invalid.map(method => request[method](url6).expect(405)));
      });
      describe('/:user_id', () => {
        const url7 = '/api/users/1';
        it('GET returns a status 200 and a single user object', () => request
          .get(url7)
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.be.an('Object');
            expect(user).to.have.all.keys(['user_id', 'username', 'avatar_url', 'name']);
            expect(user.user_id).to.equal(1);
          }));
        it('GET, if parametric is valid but doesn\'t exist return 404 and appropriate msg', () => request
          .get('/api/users/1234567890')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('no data for this endpoint...');
          }));
        it('all incorrect methods respond with a 405', () => {
          const invalid = ['put', 'patch', 'post', 'delete'];
          return Promise.all(invalid.map(method => request[method](url7).expect(405)));
        });
      });
    });
  });
});
