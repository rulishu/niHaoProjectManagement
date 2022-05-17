const proxy = {
  _proxy: {
    proxy: {
      // '/api(.*)': 'http://192.168.188.61:8083/',
      '/api(.*)': 'http://192.168.188.222:33202/',
    },
    changeHost: true,
  },
}

module.exports = proxy
