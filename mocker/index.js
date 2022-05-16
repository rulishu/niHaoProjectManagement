const { login, verify, logout, reloadAuth } = require('./login')
const { selectPage, milestonesSave } = require('./milestone')

const proxy = {
  'GET /api/user': { id: 1, username: 'kenny', sex: 6 },
  'POST /api/user': { id: 1, username: 'kenny', sex: 6 },
  'POST /api/login': login,
  'POST /api/logout': logout,
  'GET /api/user/verify': verify,
  'POST /api/reloadAuth': reloadAuth,
  'POST /api/milestones/selectPage': selectPage,
  'POST /api/milestones/milestonesSave': milestonesSave,
}

module.exports = proxy
