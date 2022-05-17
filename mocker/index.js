const proxy = {
  _proxy: {
    proxy: {
      // '/api(.*)': 'http://192.168.188.61:8083/',
      '/api(.*)': 'https://dtpms-dev.nihaosi.com',
    },
    changeHost: true,
  },
}

module.exports = proxy
