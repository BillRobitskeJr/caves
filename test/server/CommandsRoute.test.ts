import 'mocha';
import { expect } from 'chai';

import Server from '../../src/server/Server';
import * as http from 'http';

describe('/api/commands route', function() {
  const PORT = 3002;

  describe('POST-ing commands to /api/commands', function() {
    before(function() {
      this.server = new Server(PORT);
      this.server.start();
    });
    after(function() {
      this.server.stop();
    });

    context('when POST-ing an unknown command', function() {
      before(function(done) {
        this.command = 'regard existance fondly';
        this.expected = {
          action: 'regard',
          target: 'existance'
        }
        const body = JSON.stringify({
          data: {
            type: 'commands',
            properties: {
              rawCommand: this.command
            }
          }
        });
        const request = http.request({
          method: 'POST',
          port: PORT,
          hostname: 'localhost',
          path: '/api/commands',
          headers: {
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
          }
        }, res => {
          this.response = res;
          let data = '';
          res.on('data', chunk => { data += chunk; });
          res.on('end', () => {
            try {
              this.responseData = JSON.parse(data);
            } catch(e) {
              this.responseData = null;
            }
            done();
          });
        });
        request.write(body);
        request.end();
      });

      it('should respond with HTTP 201', function() {
        expect(this.response).to.have.property('statusCode').that.equals(201);
      });
      it('should respond with a valid JSON API object', function() {
        expect(this.response).to.have.property('headers');
        expect(this.response.headers).to.have.property('content-type').that.equals('application/vnd.api+json');
        expect(this.responseData).to.have.property('data').that.is.an('object');
        expect(this.responseData.data).to.have.property('id').that.is.a('string');
        expect(this.responseData.data).to.have.property('type').that.is.a('string').that.equals('commands');
      });
      it('should respond with "commands" resource matching the POST-ed one', function() {
        const command = this.responseData.data;
        expect(command).to.have.property('properties').that.is.an('object');
        expect(command.properties).to.have.property('rawCommand').that.equals(this.command);
        expect(command.properties).to.have.property('action').that.equals(this.expected.action);
        expect(command.properties).to.have.property('target').that.equals(this.expected.target);
        expect(command.properties).to.have.property('timestamp');
        expect(new Date(command.properties.timestamp)).to.not.be.NaN;
      });
      it('should responded with an included "responses" resource', function() {
        expect(this.responseData.data).to.have.property('relationships').that.is.an('object');
        expect(this.responseData.data.relationships).to.have.property('response').that.is.an('oject');
        expect(this.responseData.data.relationships.response).to.have.property('id').that.is.a('string');
        expect(this.responseData.data.relationships.response).to.have.property('type').that.equals('responses');
        expect(this.responseData).to.have.property('included').that.is.an('array');
        expect(this.responseData.included.length).to.be.above(0);
        const response = this.responseData.included.find((resource: any) => resource.id === this.responseData.data.relationships.response.id && resource.type === this.responseData.data.relationships.response.type);
        expect(response).to.exist;
        expect(response).to.have.property('properties').that.is.an('object');
        expect(response.properties).to.have.property('textResponse').that.is.a('string');
        expect(response.properties).to.have.property('timestamp');
        expect(new Date(response.properties.timestamp)).to.not.be.NaN;
      });
    });
  });
});
