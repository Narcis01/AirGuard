const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewire = require('rewire');
var sandbox = sinon.createSandbox();
var addressController = require('./addressController');
var addressModel = require('../models/address');
const { createAddress, getAllAddresses, updateAddress } = require('./addressController')

describe('Address controller', () => {
    let sampleFind, findStub, createStub, sampleCreate, sampleUpdate, findByIdAndUpdate;

    afterEach(() => {
        addressController = rewire('./addressController');
        sandbox.restore();
    });

    context('Create method', () => {
        beforeEach(() => {
            sampleCreate = {
                location: "location",
                room: "room"
            };
            createStub = sandbox.stub(addressModel, 'create').resolves(sampleCreate);
        });

        it('should create an address', async () => {
            const req = {
                body: sampleCreate
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            await createAddress(req, res);

            expect(createStub.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
        })

    });

    context('Get all method', () => {
        beforeEach(() => {
            sampleFind = [{ location: 'loc1', room: 'room1' },
            { location: 'loc2', room: 'room2' }];
            findStub = sandbox.stub(addressModel, 'find').resolves(sampleFind);
        });

        it('should return all addresses',async () =>  {
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            await getAllAddresses(req, res);

            expect(findStub.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
        })
    });

    context('Update method', () => {
        beforeEach(() => {
            sampleUpdate = {
                location: 'location',
                room: 'room'
            };
            findByIdAndUpdate = sandbox.stub(addressModel, 'findByIdAndUpdate').resolves(sampleUpdate);
        });

        it('should update', async () => {
            const req = {
                params: {
                    id: 123
                },
                body: {
                    location: 'location',
                    room: 'room'
                }
            }
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            await updateAddress(req, res);

            expect(findByIdAndUpdate.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
        })
    })
})