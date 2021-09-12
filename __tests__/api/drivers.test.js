import http from 'http'
import fetch from 'isomorphic-unfetch'
import listen from 'test-listen'
import { apiResolver } from 'next/dist/server/api-utils'
import handler from '../../pages/api/drivers/index'

describe("/api/drivers handler", () => {
  let server;
  let url;

  beforeAll((done) => {
    server = http.createServer((req, res) => apiResolver(req, res, undefined, handler))
    listen(server).then((resp) => {
      url = resp;
      done();
    });
  })

  afterAll(done => {
    server.close(done)
  })

  test("responds 200 to GET", async () => {
    const response = await fetch(`${url}/api/drivers`)
    expect(response.status).toBe(200)
  })

  test("return valid drivers info", async () => {
    const response = await fetch(`${url}/api/drivers`)
    const drivers = await response.json();

    expect(drivers.drivers).toBeInstanceOf(Array)
    if ((drivers.length ?? 0) > 0) {
      expect(drivers[0]).toHaveProperty('_id')
      expect(drivers[0]).toHaveProperty('name')
      expect(drivers[0]).toHaveProperty('age')
      expect(drivers[0]).toHaveProperty('team')
      expect(drivers[0]).toHaveProperty('races')
    }
  })

  test("filter response by driver name", async () => {
    const response = await fetch(`${url}/api/drivers?name=mcdaniel`)
    const drivers = await response.json();

    expect(drivers.drivers).toBeInstanceOf(Array)
    expect(drivers.drivers.length).toBeGreaterThanOrEqual(1)
    expect(drivers.drivers[0].name).toBe('Mcdaniel')
  })

})