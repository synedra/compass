/* eslint no-console:0 */
const assert = require('assert');
const Connection = require('../');
const connect = Connection.connect;
const mock = require('mock-require');
const sinon = require('sinon');
const SSHTunnel = require('@mongodb-js/ssh-tunnel').default;

const setupListeners = () => {};

describe('connection model connector', () => {
  describe('local', () => {
    if (process.env.EVERGREEN_BUILD_VARIANT === 'rhel') {
      // TODO: COMPASS-4866
      // eslint-disable-next-line no-console
      console.warn(
        'test suites using mongodb-runner are flaky on RHEL, skipping'
      );
      return;
    }

    before(
      require('mongodb-runner/mocha/before')({ port: 27018 })
    );

    after(
      require('mongodb-runner/mocha/after')({ port: 27018 })
    );

    it('should return connection config when connected successfully', (done) => {
      Connection.from('mongodb://localhost:27018', (parseErr, model) => {
        if (parseErr) throw parseErr;

        connect(
          model,
          setupListeners,
          (connectErr, client, _tunnel, { url, options }) => {
            if (connectErr) throw connectErr;

            assert.strictEqual(
              url,
              'mongodb://localhost:27018/?readPreference=primary&ssl=false'
            );

            assert.deepStrictEqual(options, {
              // Driver brought this behaviour back in v3.6.3+ (but will remove in v4), we don't need to handle directConnection ourselves
              // See https://github.com/mongodb/node-mongodb-native/pull/2719
              // directConnection: true,
              readPreference: 'primary',
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

            client.close(true);
            done();
          }
        );
      });
    });

    it('should connect to `localhost:27018 with model`', (done) => {
      Connection.from('mongodb://localhost:27018', (parseErr, model) => {
        assert.equal(parseErr, null);
        connect(model, setupListeners, (connectErr, client) => {
          assert.equal(connectErr, null);
          client.close(true);
          done();
        });
      });
    });

    it('should connect to `localhost:27018 with object`', (done) => {
      connect(
        { port: 27018, host: 'localhost' },
        setupListeners,
        (err, client) => {
          assert.equal(err, null);
          client.close(true);
          done();
        }
      );
    });

    describe('ssh tunnel failures', () => {
      let closeSpy;

      mock('@mongodb-js/ssh-tunnel', {
        default: class MockTunnel extends SSHTunnel {
          constructor(...args) {
            super(...args);
            this.serverClose = closeSpy = sinon.spy(
              this.serverClose.bind(this)
            );
          }
        }
      });

      const MockConnection = mock.reRequire('../lib/extended-model');
      const mockConnect = mock.reRequire('../lib/connect');

      it('should close ssh tunnel if the connection fails', (done) => {
        const model = new MockConnection({
          hostname: 'localhost',
          port: 27020,
          sshTunnel: 'USER_PASSWORD',
          sshTunnelHostname: 'my.ssh-server.com',
          sshTunnelPassword: 'password',
          sshTunnelUsername: 'my-user',
          extraOptions: { serverSelectionTimeoutMS: 100 }
        });

        assert(model.isValid());
        mockConnect(model, setupListeners, (err) => {
          try {
            // must throw error here, because the connection details are invalid
            assert.ok(err);
            // assert that tunnel.close() was called once
            assert.ok(
              closeSpy.calledOnce,
              'Expected tunnel.close to be called exactly once'
            );
            done();
          } catch (e) {
            done(e);
          }
        });
      });

      it('should propagate tunnel error if tunnel fails to connect', (done) => {
        const model = new MockConnection({
          hostname: 'localhost',
          port: 27020,
          sshTunnel: 'USER_PASSWORD',
          sshTunnelHostname: 'my.ssh-server.com',
          sshTunnelPassword: 'password',
          sshTunnelUsername: 'my-user',
          extraOptions: {
            serverSelectionTimeoutMS: 1000,
            socketTimeoutMS: 1000
          }
        });

        assert(model.isValid());
        mockConnect(model, setupListeners, (err) => {
          try {
            const regex = /ENOTFOUND my.ssh-server.com/;

            assert.ok(err);
            assert.ok(
              regex.test(err.message),
              `Expected "${err.message}" to match ${regex}`
            );
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });
  });

  /**
   * Originally `data` here was a `mongodb-connection-fixture` library export,
   * but none of the cloud services in the fixture are available anymore and
   * as such the library was removed and these tests are skipped
   */
  describe.skip('cloud #slow', () => {
    const data = { MATRIX: [], SSH_TUNNEL_MATRIX: [] };

    data.MATRIX.map((d) => {
      it.skip('should connect to ' + d.name, (done) => {
        connect(d, setupListeners, (err, client) => {
          if (err) {
            return done(err);
          }

          client.close(true);
          done();
        });
      });
    });

    data.SSH_TUNNEL_MATRIX.map((d) => {
      it.skip(`connects via the sshTunnel to ${d.sshTunnelHostname}`, (done) => {
        connect(d, setupListeners, (err, client) => {
          if (err) {
            return done(err);
          }

          client.close(true);
          done();
        });
      });
    });
  });
});
