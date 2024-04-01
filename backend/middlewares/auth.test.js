const chai = require('chai');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const User = require('../models/user');
const { isAuthenticatedUser } = require('./auth');
const expect = chai.expect;
const sandbox = sinon.createSandbox();
const rewire = require('rewire');
const ErrorHandler = require('../utils/errorHandler');

describe('isAuthenticatedUser middleware', () => {

    afterEach(() => {
        auth = rewire('./auth');
        sandbox.restore();
    })

    beforeEach(() => {
        verifyStub = sandbox.stub(jwt, 'verify').returns({ id: user._id });
        findByIdStub = sandbox.stub(User, 'findById').returns(user);

        auth = rewire('./auth');
    })

    const JWT_SECRET = 'ASFDGHGJFDGF';
    const user = new User({ _id: 123, username: 'user', password: 'password' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    let verifyStub, findByIdStub;


    it('should pass with valid token', async () => {
        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };

        const res = {};
        const next = sinon.spy();

        await isAuthenticatedUser(req, res, next);
        expect(req.user).to.deep.equal(user);
        expect(next.calledOnce).to.be.true;
    });


    it('should fail without token', async () => {
        const req = {
            headers: {}
        };

        const res = {};
        const next = sinon.spy();
        await isAuthenticatedUser(req, res, next);
        expect(next.calledWithMatch(sinon.match.instanceOf(ErrorHandler))).to.be.true;
    })


})