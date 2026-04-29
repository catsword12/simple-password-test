const { expect } = require('chai');
const { app, server, io } = require('../server');

// Basic test to ensure the server module exports the required objects
describe('Server', () => {
  it('exports the Express app, HTTP server, and Socket.IO instance', () => {
    expect(app).to.be.a('function');
    expect(server).to.have.property('listen').that.is.a('function');
    expect(io).to.have.property('on').that.is.a('function');
  });
});