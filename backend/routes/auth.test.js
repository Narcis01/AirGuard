const chai = require('chai');
const expect = chai.expect;
const request = require('supertest')
const sinon = require('sinon');


var auth = require('./auth');
var sandbox = sinon.createSandbox();
var user = require('../models/user');
var isAuth = require('../middlewares/auth')
const { response } = require('express');
const { afterEach } = require('mocha');
const rewire = require('rewire');

describe('AUTH', () => {
    afterEach(() => {
        auth = rewire('./auth');
        sandbox.restore();
    })
    
    
    let createStub, findStub;

    context('REGISTER ', () => {

        beforeEach(() => {
            createStub = sandbox.stub(user, 'create').resolves({ username: 'fakeUser', password: 'fakePassword' });

            auth = rewire('./auth');
        })

        it('should register an user', () => {
            request(auth).post('/register')
                .expect(200)
                .send({ username: 'user', password: 'password' })
                .end((err, response) => {
                    expect(createStub).to.have.been.calledOnce;
                    expect(response.body).to.have.property('token');
                    done(err);
                })
        })

        it('should throw an error for no username or password ', () => {
            request(auth).post('/register')
                .expect(400)
                .send({})
                .end((err, response) => {
                    expect(createStub).to.not.be.call;
                    expect(response.body).to.have.property('error').to.equal('No username or password');
                    done(err);
                })
        })

    })

    context('LOGIN', () => {
        beforeEach(() => {
            findStub = sandbox.stub(user, 'findOne').resolves({ username: 'fakeUser', password: 'fakePassword' })

            auth = rewire('./auth');
        })


        it('should login an user', () => {
            request(auth).post('/login')
                .expect(200)
                .send({ username: 'user', password: 'password' })
                .end((err, response) => {
                    expect(findStub).to.have.been.calledOnce;
                    expect(response.body).to.have.property('token');
                    done(err);
                })
        });

        it('should throw error for no body', () => {
            request(auth).post('/login')
                .expect(400)
                .send({})
                .end((err, response) => {
                    expect(response.body).to.have.property('error').to.equal('No username or password')
                    done(err);
                })
        })

        it('should throw error for invalid username', () => {
            request(auth).post('/login')
                .expect(400)
                .send({ username: 'wrongUser', password: 'fakePassword' })
                .end((err, response) => {
                    expect(response.body).to.have.property('error').to.equal('Invalid username');
                    expect(findStub).to.have.been.calledOnce;
                    done(err);
                })
        })

        it('should throw error for invalid password', () => {
            request(auth).post('/login')
                .expect(400)
                .send({ username: 'fakeUser', password: '123' })
                .end((err, response) => {
                    expect(response.body).to.have.property('error').to.equal('Invalid password');
                    expect(findStub).to.have.been.calledOnce;
                    done(err);
                })
        })
    })

    context('LOGOUT', () => {
        beforeEach(() => {
            isAuthenticaedUserStub = sandbox.stub(isAuth, 'isAuthenticatedUser').resolves((req, res, next) => {
                next();
            })

            auth = rewire('./auth');
        })

        it('should logout successfully', () => {
            request(auth).get('/logout')
                .expect(200)
                .end((err, response) => {
                    expect(response.body).to.have.property('message').to.equal('Logged out');
                    done(err);
                })
        })

        it('should throw error for not being logged in', ()=>{
            
            request(auth).get('/logout')
                .expect(401)
                .end((err, response) =>{
                    expect(response.body).to.have.property('error').to.equal('fake_error')
                    done(err);
                })
        })
    })

})
