const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewire = require('rewire');
var sandbox = sinon.createSandbox();
var authController = require('./authController');
const User = require('../models/user');
const { registerUser, loginUser, logout } = require('./authController')

describe('AuthController', () => {
    let createUserStub;
    let sampleUser;
    let loginStub;
    let selectStub;
    beforeEach(() => {
        sampleUser = {
            username: 'username',
            password: '123',
            getJwtToken: sinon.stub().returns('token'),
            comparePassword: sinon.stub().resolves(true),
           
        }
        createUserStub = sandbox.stub(User, 'create').resolves(sampleUser)
        loginStub = sandbox.stub(User, 'findOne');
        loginStub.withArgs({username: 'username'}).returns({select: sandbox.stub().withArgs('+password').resolves(sampleUser)})
    })

    afterEach(() => {
        authController = rewire('./authController')
        sandbox.restore();

    });

    context('Register method', () => {
        it('should register an user', async () => {
            const req = {
                body: {
                    username: 'username',
                    password: '123'
                }
            };
            
            const res = {};
            res.status = status => {
                res.statusCode = status;
                return res;
            };
        
            res.cookie = (name, value, options) => {
                res.cookie = {name, value, options };
                return res;
            };
        
            res.json = data => {
                res.json = data;
                return res;
            };

            await registerUser(req, res);
            expect(createUserStub.calledOnce).to.be.true
            expect(res.statusCode).to.equal(200);
            expect(res.json).to.be.a.string;
        });
 
        it('should throw error with no body', async () => {
            const req = {
                body: {}
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };
            const next = sinon.spy();
            await registerUser(req,res,next);
            
            expect(next.calledOnce).to.true;
            expect(createUserStub.calledOnce).to.be.false;
        })
    });

    context('Login method', () => {
        
        it('should login', async() => {
            const req = {
                body: {
                    username: 'username',
                    password: '123'
                }
            };
            const res = {};
            res.status = status => {
                res.statusCode = status;
                return res;
            };
        
            res.cookie = (name, value, options) => {
                res.cookie = {name, value, options };
                return res;
            };
        
            res.json = data => {
                res.json = data;
                return res;
            };

            const next = sinon.spy();

            await loginUser(req,res, next);

            expect(loginStub.calledOnce).to.be.true;
            expect(res.statusCode).to.equal(200);
            expect(res.cookie.name).to.equal('token');
            expect(res.json).to.be.a.string;
        });

        it('should fail without username or password', async () => {
            const req = {
                body: {}
            };
            const res = {};
            res.status = status => {
                res.statusCode = status;
                return res;
            };
        
            res.cookie = (name, value, options) => {
                res.cookie = {name, value, options };
                return res;
            };
        
            res.json = data => {
                res.json = data;
                return res;
            };

            const next = sinon.spy();

            await loginUser(req, res, next);

            expect(loginStub.calledOnce).to.be.false;
            expect(next.calledOnce).to.be.true

        })
        
    })

    context('Logout method',  () => {
        it('should log out', async () => {
            const req = {};
            const res = {};
            res.status = status => {
                res.statusCode = status;
                return res;
            };
        
            res.cookie = (name, value, options) => {
                res.cookie = {name, value, options };
                return res;
            };
            res.json = data => {
                res.json = data;
                return res;
            };

            await logout(req, res);
            expect(res.statusCode).to.equal(200);
            expect(res.cookie.name).to.equal('token');
            expect(res.cookie.value).to.equal('none')
            expect(res.json).to.be.a.string;
        })
    })
})