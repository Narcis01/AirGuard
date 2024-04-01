const chai = require('chai');
const expect = chai.expect;
const request = require('supertest')
const sinon = require('sinon');
const rewire = require('rewire');
var sandbox = sinon.createSandbox();
var addressRoute = require('./address');
var addressModel = require('../models/address');
const { response } = require('express');

describe('Address', () => {
    afterEach(() => {
        addressRoute = rewire('./address.js');
        sandbox.restore();
    });

    let getDataStub, createStub, findByIdAndDeleteStub, findByIdAndUpdateStub;

    context('GET /address/getAll', () => {
        beforeEach(() => {
            getDataStub = sandbox.stub(addressModel, 'find').resolves([{
                location: "location",
                room: "room"
            }]);

            addressRoute = rewire('./address.js');
        })

        it('should get addresses from db', () => {
            request(addressRoute).get('/address/getAll')
                .expect(200)
                .end((err, response) => {
                    expect(getDataStub).to.have.been.calledOnce;
                    expect(response.body).to.have.property('location').to.equal('location');
                    expect(response.body).to.have.property('romm').to.equal('room');

                })
        })
    });

    context('Post /address/create', () => {
        beforeEach(() => {
            createStub = sandbox.stub(addressModel, 'create').resolves({
                location: "location",
                room: "room"
            })

            addressRoute = rewire('./address.js');
        });
        it('should create a post', () => {
            request(addressRoute).post('/address/create')
                .expect(200)
                .send({
                    location: "location",
                    room: "room"
                })
                .end((err, response) => {
                    expect(createStub).to.have.been.calledOnce;
                    expect(response.body).to.have.property('data').to.equal(createStub);
                })
        })
    });

    context('Delete /delete/:id', () => {
        beforeEach(() => {
            findByIdAndDeleteStub = sandbox.stub(addressModel, 'findByIdAndDelete').resolves('fake_delete');
            addressRoute = rewire('./address.js');

        })

        it('should delete', () => {
            request(addressRoute).delete('/address/delete/123')
                .expect(200)
                .end((err, response) => {
                    expect(findByIdAndDeleteStub).to.have.been.caledWithMath({ id: "123" });
                })
        })
    });

   
})