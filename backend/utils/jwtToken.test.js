const sendToken = require('./jwtToken');
const chai = require('chai');
const expect = chai.expect;

const mockResponse = () => {
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

    return res;
};


describe('sendToken', () => {
    it('should send token in response ', () => {
        const user = {
            getJwtToken: () => 'fake-token'
        };

        const statusCode = 200;
        const res = mockResponse();

        sendToken(user, statusCode, res);

        expect(res.statusCode).to.equal(statusCode);
        expect(res.json).to.be.a.string;
        expect(res.cookie.name).to.equal('token');
        expect(res.cookie).to.have.property('value').to.equal('fake-token');
    })
})