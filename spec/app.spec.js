process.env.NODE_ENV = "test";
const { expect } = require("chai");
const app = require("../app");
const request = require("supertest")(app);

describe('/', () => {
    describe('/api', () => {
        describe('/topics', () => {
            it('GET returns staus 200 and an array of topics', () => {
                return request.get('/api/topics').expect(200).then(({ body: { topics } }) => {
                    expect(topics).to.be.an('Array');
                    expect(topics.length).to.equal(2);
                    expect(topics[0]).to.have.all.keys(['slug', 'description']);
                    expect(topics[0].slug).to.equal('mitch');
                });
            });
        });
    });
});