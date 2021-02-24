const axios = require('axios');

class BillyClient {
  constructor(apiToken) {
    this.apiToken = apiToken;
  }

  async request(method, url, body) {
    try {
      const res = await axios({
        baseURL: 'https://api.billysbilling.com/v2',
        method,
        url,
        headers: {
          'X-Access-Token': this.apiToken,
          'Content-Type': 'application/json',
        },
        data: body,
      });

      if (res.status >= 400) {
        console.log();
        next(res);
        return res;
        throw new Error(
          `${method}: ${url} failed with ${res.status} - ${res.data}`
        );
      }

      return res.data;
    } catch (e) {
      next(res);
      console.error(e);
      throw e;
    }
  }
}

module.exports = BillyClient;
