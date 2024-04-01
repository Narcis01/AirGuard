const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewire = require('rewire');
var sandbox = sinon.createSandbox();
var dataController = require('./dataController')
const DataRaspberry = require('../models/dataRaspberry')
const { getData, postData, updateData } = require('./dataController')


describe('Data controller', () => {
    let sampleData;
    let findStub;
    let createStub;
    let sampleCreate;
    let sampleUpdate;
    let findByIdAndUpdateStub;
    beforeEach(() => {
        sampleData = [{
            temperature: 23,
            co2: 10,
            humidity: 15,
            light: 520,
            dust: 10,
            date: "2023-12-10T08:26:43.115Z",
            address: "id"
        },
        {
            temperature: 23,
            co2: 10,
            humidity: 15,
            light: 520,
            dust: 10,
            date: "2023-12-12T08:26:43.115Z"
        }];
        sampleCreate = {
            temperature: 23,
            co2: 10,
            humidity: 15,
            light: 520,
            dust: 10,
            date: "2023-12-10T08:26:43.115Z"
        }
        sampleUpdate = {
            temperature: 33,
            co2: 10,
            humidity: 15,
            light: 520,
            dust: 10,
            date: "2023-12-10T08:26:43.115Z"
        }
        findStub = sandbox.stub(DataRaspberry, 'find').resolves(sampleData);
        createStub = sandbox.stub(DataRaspberry, 'create').resolves(sampleCreate);
        findByIdAndUpdateStub = sandbox.stub(DataRaspberry, 'findByIdAndUpdate').resolves(sampleUpdate);
    })

    afterEach(() => {
        dataController = rewire('./dataController')
        sandbox.restore();

    });
    context('Get data method', () => {
        it('should get data without range', async () => {
            const req = {
                query: {},
                params: {
                    id: "id"
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            await getData(req, res);

            expect(findStub.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: sampleData })).to.be.true;
        })

        it('should get data with range', async () => {
            const req = {
                query: {
                    startDate: '2023-12-10',
                    endDate: '2023-12-12',
                },
                params: {
                    id: "id"
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            }

            await getData(req, res);

            expect(findStub.calledOnce).to.be.true;
            expect(findStub.firstCall.args[0].date.$gte).to.equal('2023-12-10');
            expect(findStub.firstCall.args[0].date.$lte).to.equal('2023-12-12');
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: sampleData })).to.be.true;
        })
    });

    context('Post method', () => {
        it('should create a new raspberryData', async () => {
            const req = {
                body: {
                    temperature: 23,
                    co2: 10,
                    humidity: 15,
                    light: 520,
                    dust: 10,
                    date: "2023-12-10T08:26:43.115Z"
                }
            }
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            }
            await postData(req, res);
            expect(createStub.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: "data saved", data: sampleCreate })).to.be.true;
        })

    });

    context('Update method', () => {
        it('should update', async () => {
            const req = {
                params: {
                    id: 1
                },
                body: {
                    temperature: 33,
                    co2: 10,
                    humidity: 15,
                    light: 520,
                    dust: 10,
                    date: "2023-12-10T08:26:43.115Z"
                }
            }
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            }
            await updateData(req, res);

            expect(findByIdAndUpdateStub.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({message: "Data updated",data: sampleUpdate})).to.be.true;
        })
    })

})