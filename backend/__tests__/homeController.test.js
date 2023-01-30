const request = require("supertest");
const app = require("../app.js");
const { User} = require("../seeders/fakerUserData");

global.app = app;

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2OTcyZGEyLWJkZmYtNGI1Mi1iMjY0LTM1ZjMxZWM3OTQzNiIsImlhdCI6MTY2OTU1MTkwOCwiZXhwIjoxNjY5NTU1NTA4fQ.1eCGdQKwth7zqv2ZbxI66Q7f-sphbegCle6kEOfbsrU";
const user = User();

describe('User login testing:', () => {
    it('Valid login and password of an existing user', (done) => {
        request(app)
        .post('/signin')
        .send({
            email:"administrator@dietcomposer.pl",
            password:"Admin"
        }).then(res => {
            expect(res.status).toBe(200);
            done();
        });
    });

    it('Valid login and password of an existing user should return token, refresh token adn message', (done) => {
        request(app)
        .post('/signin')
        .send({
            email:"administrator@dietcomposer.pl",
            password:"Admin"
        }).then(res => {
            expect(res.body.token).toBeTruthy();
            expect(res.body.tokenToRefresh).toBeTruthy();
            expect(res.body.message).toEqual('Zalogowano!');
            done();
        });
    });
    
    it('Unregistered user', (done) => {
        request(app)
        .post('/signin')
        .send({
            email:"Unregistered@dietcomposer.pl",
            password:"Admin"
        }).then(res => {
            expect(res.status).toBe(409);
            done();
        });
    });

    it('Valid login and incorrect password of an existing user', (done) => {
        request(app)
        .post('/signin')
        .send({
            email:"administrator@dietcomposer.pl",
            password:"BadPassword"
        }).then(res => {
            expect(res.status).toBe(401);
            done();
        });
    });

    it('Incorrect number of parameters', (done) => {
        request(app)
        .post('/signin')
        .send({
            password:"BadPassword"
        }).then(res => {
            expect(res.status).toBe(500);
            done();
        });
    });
});

describe('User registration testing:', () => {

    it('Should return 409 when user exist', (done) => {
        request(app)
        .post('/signup')
        .send({
            userName: "Administrator",
            email:"administrator@dietcomposer.pl",
            password:"Admin"
        }).then(res => {
            expect(res.status).toBe(409);
            done();
        });
    });

    it('Should return validation error(500) when given invalid userName', (done) => {
        request(app)
        .post('/signup')
        .send({
            userName: "NewU!#ser",
            email:"newUser@dietcomposer.pl",
            password:"newUser"
        }).then(res => {
            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Validation error: Validation is on userName failed");
            done();
        });
    });

    it('Should return validation error(500) when given invalid email', (done) => {
        request(app)
        .post('/signup')
        .send({
            userName: "NewUser",
            email:"newUser",
            password:"newUser"
        }).then(res => {
            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Validation error: Validation is on email failed");
            done();
        });
    });

    it('Corretctly data shoud registratrion user', (done) => {
        request(app)
        .post('/signup')
        .send({
            userName: "NewUser",
            email:"newUser@dietcomposer.pl",
            password:"newUser"
        }).then(res => {
            expect(res.status).toBe(201);
            expect(res.body.message).toBe("Stworzono nowego użytkownika!");
            done();
        });
    });
});

describe('Guest recipes testing:', () => {
    it('Should return number off all recipes on database', (done) => {
        request(app)
        .get('/all')
        .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).not.toBeNull();
            done();
        });
    });
    it('Should return selected recipe by url', (done) => {
        request(app)
        .get('/recipe/0cbaf7d5-38cc-4eed-bb16-c5d06977328c')
        .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).not.toBeNull();
            done();
        });
    });
    describe('Testing the rule filtering mechanism:', () => {

        it('Should return error code(404) without number of pages', (done) => {
            request(app)
            .get('/filteredRecipes')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('x-access-token', token)
            .then(res => {
                expect(res.status).toBe(404);
                done();
            });
        });
        it('Should return first page selected recipe by url', (done) => {
            request(app)
            .get('/filteredRecipes?page=1')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).not.toBeNull();
                done();
            });
        });
        it('Should return first page selected recipe by url with user token', (done) => {
            request(app)
            .get('/filteredRecipes?page=1')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('x-access-token', token)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).not.toBeNull();
                done();
            });
        });
        it('Should return second page selected recipe by url', (done) => {
            request(app)
            .get('/filteredRecipes?page=2')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).not.toBeNull();
                done();
            });
        });
        it('Should return second page selected recipe by url and user token', (done) => {
            request(app)
            .get('/filteredRecipes?page=2')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('x-access-token', token)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).not.toBeNull();
                done();
            });
        });
        it('Should return first page selected recipe by url with filter level', (done) => {
            request(app)
            .get('/filteredRecipes?page=1&category=obiad')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).not.toBeNull();
                done();
            });
        });
        it('Should return first page selected recipe by url with filter level and user token', (done) => {
            request(app)
            .get('/filteredRecipes?page=1&category=obiad')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('x-access-token', token)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).not.toBeNull();
                done();
            });
        });
        it('Should return error(404) not interval server with user token', (done) => {
            request(app)
            .get('/filteredRecipes?pages=1&cukierki=lizaki')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .then(res => {
                expect(res.status).toBe(404);
                expect(res.body).not.toBeNull();
                done();
            });
        });
    });
});
