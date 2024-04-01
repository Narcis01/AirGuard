const chai = require('chai');
const expect = chai.expect;
const request = require('supertest')
const sinon = require('sinon');
const rewire = require('rewire');
var sandbox = sinon.createSandbox();
const ErrorHandler = require('../utils/errorHandler');
var dataRoute = require('./data.js');
var dataRaspberry = require('../models/dataRaspberry');
var isAuth = require('../middlewares/auth')

describe('DATA FROM RASPBERRY', () => {

    afterEach(() => {
        dataRoute = rewire('./data.js')
        sandbox.restore();

    });

    let getDataStub, createStub, findByIdAndDeleteStub, findByIdAndUpdateStub,isAuthenticaedUserStub;


    context('GET /data', () => {

        beforeEach(() => {
            getDataStub = sandbox.stub(dataRaspberry, 'find').resolves([{
                temperature: 20,
                co2: 20,
                humidity: 20
            }]);

            dataRoute = rewire('./data.js')
        })

        it('should get data from db', () => {
            request(dataRoute).get('/data/123')
                .expect(200)
                .end((err, response) => {
                    expect(getDataStub).to.have.been.calledOnce;
                    expect(response.body).to.have.property('temperature').to.equal(20);
                    expect(response.body).to.have.property('co2').to.equal(20);
                    expect(response.body).to.have.property('humidity').to.equal(20);
                    done();
                })
        })
    });

    context('POST /post', () => {

        beforeEach(() => {
            createStub = sandbox.stub(dataRaspberry, 'create').resolves({
                temperature: 20,
                co2: 20,
                humidity: 20
            });

            dataRoute = rewire('./data.js');
        })

        it('should save the data', () => {
            request(dataRoute).post('/post')
                .expect(200)
                .send({
                    temperature: 20,
                    co2: 20,
                    humidity: 20
                })
                .end((err, response) => {
                    expect(response.body).to.have.property('message').to.equal('data saved');
                    expect(response.body).to.have.property('data').to.equal(createStub);
                    done();
                })
        })
    })

    context('DELETE /delete/:id', () => {
        beforeEach(() => {
            findByIdAndDeleteStub = sandbox.stub(dataRaspberry, 'findByIdAndDelete').resolves('fake_delete');

            
        })


        it('should delete', () => {
            request(dataRaspberry).delete('/delete/123')
                .expect(200)
                .end((err, response) => {
                    expect(findByIdAndDeleteStub).to.have.been.caledWithMath({ id: "123" });
                    expect(response.body).to.have.property('message').to.equal('Data deleted');
                    done();
                })
        })
    });

    context('UPDATE /update/:id', () => {

        beforeEach(() => {
            findByIdAndUpdateStub = sandbox.stub(dataRaspberry, 'findByIdAndUpdate').resolves('fake_update');

            dataRaspberry = rewire('./data.js')
        })

        it('should update', () => {
            request(dataRaspberry).put('/update/123')
                .expect(200)
                .send({
                    id: 123,
                    temperature: 20,
                    co2: 20,
                    humidity: 20
                })
                .end((err, response) => {
                    expect(findByIdAndUpdateStub).to.have.been.calledOnce;
                    expect(response.body).to.have.property('message').to.equal('Data updated');
                    done();
                })
        })
    })

    context('RESET /reset', () => {
        it('should reset the db when you are logged in', () => {
            isAuthenticaedUserStub = sandbox.stub(isAuth, 'isAuthenticatedUser').resolves((req,res,next) => {
                next();
            });
            dataRaspberry = rewire('./data.js');
            request(dataRaspberry).get('/reset/id')
                .expect(200)
                .end((err, response) => {
                    expect(isAuthenticaedUserStub).to.have.been.calledOnce;
                    expect(response.body).to.have.property('message').to.equal('Reset');
                    done();
                })
        })

        it('should fail because you are not logged in', () => {
            isAuthenticaedUserStub = sandbox.stub(isAuth, 'isAuthenticatedUser').rejects(new ErrorHandler('fake_error', 401));
            dataRaspberry = rewire('./data.js');
            request(dataRaspberry).get('/reset/id')
                .expect(401)
                .end((err, response) => {
                    expect(response.body).to.have.property('error').to.equal('fake_error')
                    done();
                })

        })
    })

})