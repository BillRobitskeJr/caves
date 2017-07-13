import 'mocha';
import { expect } from 'chai';

import * as http from 'http';
import Server from '../../src/server/Server';

describe('Server', function() {
  context('when starting a server', function() {
    before(function() {
      this._server = new Server();
    });

    it('should not throw an error', function() {
      expect(this._server.start()).to.not.throw;
    });

    it('should respond on port 3000, path "/"', function(done) {
      http.get({
        port: 3000,
        path: '/'
      }, res => {
        expect(res.statusCode).to.equal(200);
        expect(res.headers['content-type']).to.have.string('text/html');
        done();
      });
    });
  });
});