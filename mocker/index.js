const { login, verify, logout, reloadAuth } = require('./login')
const { selectPage, milestonesSave } = require('./milestone')
const { allusersqueryByPage } = require('./allusers')
const { dictqueryByPage, dictqueryAll } = require('./dictionary')
const {
  managerAssignmentselectPage,
  managerAssignmentselectById,
} = require('./project')

const proxy = {
  'GET /api/user': { id: 1, username: 'kenny', sex: 6 },
  'POST /api/user': { id: 1, username: 'kenny', sex: 6 },
  'POST /api/login': login,
  'POST /api/logout': logout,
  'GET /api/user/verify': verify,
  'POST /api/reloadAuth': reloadAuth,
  'POST /api/milestones/selectPage': selectPage,
  'POST /api/milestones/milestonesSave': milestonesSave,
  'POST /api/managerUser/queryByPage': allusersqueryByPage,
  'POST /api/dict/queryByPage': dictqueryByPage,
  'POST /api/dict/queryAll': dictqueryAll,
  'POST /api/ManagerAssignment/selectPage': managerAssignmentselectPage,
  'POST //api/ManagerAssignment/selectById': managerAssignmentselectById,
}

module.exports = proxy
