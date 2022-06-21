/* eslint-disable no-template-curly-in-string */
// eslint-disable-next-line no-unused-vars
import React from 'react'

const routes = [
  {
    path: '/login',
    component: '@/layouts/UserLayout',
  },
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    routes: [
      {
        index: true,
        redirect: `/dashboard`,
      },
      {
        path: '/dashboard',
        name: '工作台',
        hideInMenu: true,
        hiddenMainMenu: true,
        component: '@/pages/WorkBench',
        navigate: '(navigate) => {navigate(`/dashboard',
      },
      {
        path: '/projectList',
        name: '项目列表',
        hiddenMainMenu: true,
        component: '@/pages/ProjectList',
        hideInMenu: true,
        isAuth: false,
        navigate: '(navigate) => {navigate(`/projectList`)}',
      },
      {
        path: '/todoList',
        name: '待办事项列表',
        hiddenMainMenu: true,
        component: '@/pages/TodoList',
        hideInMenu: true,
        isAuth: false,
        navigate: '(navigate) => {navigate(`/todoList`)}',
      },
      {
        path: '/tissue',
        name: '组织',
        isAuth: true,
        hideInMenu: true,
        side: true,
        routes: [
          {
            path: '/tissue/:projectId',
            name: '项目概览',
            icon: 'appstore-o',
            component: '@/pages/ProjectOverview',
            isAuth: true,
            navigate:
              "(navigate) => {navigate(`/tissue/${sessionStorage.getItem('projectId')}`)}",
          },
          {
            path: '/tissue/:projectId/milestone',
            name: '里程碑',
            icon: 'coffee',
            component: '@/pages/Milestone',
            navigate:
              "(navigate) => {navigate(`/tissue/${sessionStorage.getItem('projectId')}/milestone`)}",
            isAuth: true,
          },
          {
            path: '/tissue/:projectId/milestone',
            name: '里程碑',
            hideInMenu: true,
            isAuth: true,
            routes: [
              {
                path: '/tissue/:projectId/milestone/newMilestone',
                name: '新增里程碑',
                component: '@/pages/Milestone/NewMilestone',
                isAuth: true,
                hideInMenu: true,
                navigate:
                  "(navigate) => {navigate(`/tissue/${sessionStorage.getItem('projectId')}/milestone/newMilestone`)}",
              },
              {
                path: '/tissue/:projectId/milestone/editMilestone/:milestonesId',
                name: '编辑里程碑',
                component: '@/pages/Milestone/NewMilestone',
                isAuth: true,
                hideInMenu: true,
                navigate:
                  "(navigate) => {navigate(`/tissue/${sessionStorage.getItem('projectId')}/milestone/editMilestone/${sessionStorage.getItem('milestonesId')}`)}",
              },
              {
                path: '/tissue/:projectId/milestone/milestoneInfo/:milestonesId',
                name: '里程碑详情',
                component: '@/pages/Milestone/MilestoneInfo',
                isAuth: true,
                hideInMenu: true,
                navigate:
                  "(navigate) => {navigate(`/tissue/${sessionStorage.getItem('projectId')}/milestone/milestoneInfo/${sessionStorage.getItem('milestonesId')}`)}",
              },
            ],
          },
          {
            path: '/tissue/:projectId/task',
            name: '任务列表',
            icon: 'paper-clip',
            component: '@/pages/Project/Task',
            navigate: (navigate, location) => {
              const id = sessionStorage.getItem('projectId')
              navigate(`/tissue/${id}/task?2`)
            },
            isAuth: true,
          },
          {
            path: '/tissue/:projectId/task',
            name: '任务列表',
            isAuth: true,
            hideInMenu: true,
            routes: [
              {
                path: '/tissue/:projectId/task',
                name: '任务列表',
                component: '@/pages/Project/Task',
                isAuth: true,
                navigate:
                  "(navigate) => {navigate(`/tissue/${sessionStorage.getItem('projectId')}/task?2`)}",
              },
              {
                path: '/tissue/:projectId/taskBoard',
                name: '任务看板',
                component: '@/pages/TaskBoard',
                isAuth: true,
                navigate:
                  "(navigate) => {navigate(`/tissue/${sessionStorage.getItem('projectId')}/taskBoard`)}",
              },
              {
                path: '/tissue/:projectId/task/newIssue',
                name: '新增任务',
                hideInMenu: true,
                component: '@/pages/Project/NewIssue',
                isAuth: true,
                navigate:
                  "(navigate) => {navigate(`/tissue/${sessionStorage.getItem('projectId')}/task/newIssue`)}",
              },
              {
                path: '/tissue/:projectId/task/taskInfo/:id',
                name: '任务详情',
                component: '@/pages/Project/TaskInfo',
                hideInMenu: true,
                isAuth: true,
                navigate:
                  "(navigate) => {navigate(`/tissue/${sessionStorage.getItem('projectId')}/task/taskInfo/:id`)}",
              },
            ],
          },
          {
            path: '/tissue/:projectId/usersManagement',
            name: '成员管理',
            icon: 'user',
            component: '@/pages/UsersManagement',
            isAuth: true,
            navigate:
              "(navigate) => {navigate(`/tissue/${sessionStorage.getItem('projectId')}/usersManagement`)}",
          },
        ],
      },
      {
        path: '/:userAccount',
        name: '用户主页',
        component: '@/pages/Authority/AllUsers/UserHome',
        hideInMenu: true,
        hiddenMainMenu: true,
        navigate:
          "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}`)}",
      },
      {
        path: '/:userAccount',
        name: '用户主页',
        isAuth: true,
        hideInMenu: true,
        side: true,
        routes: [
          {
            path: '/:userAccount/:projectId',
            name: '项目概览',
            icon: 'appstore-o',
            component: '@/pages/ProjectOverview',
            isAuth: true,
            navigate:
              "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/${sessionStorage.getItem('projectId')}`)}",
          },
          {
            path: '/:userAccount/:projectId/milestone',
            name: '里程碑',
            icon: 'coffee',
            component: '@/pages/Milestone',
            navigate:
              "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/${sessionStorage.getItem('projectId')}/milestone`)}",
            isAuth: true,
          },
          {
            path: '/:userAccount/:projectId/milestone',
            name: '里程碑',
            hideInMenu: true,
            isAuth: true,
            routes: [
              {
                path: '/:userAccount/:projectId/milestone/newMilestone',
                name: '新增里程碑',
                component: '@/pages/Milestone/NewMilestone',
                isAuth: true,
                hideInMenu: true,
                navigate:
                  "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/${sessionStorage.getItem('projectId')}/milestone/newMilestone`)}",
              },
              {
                path: '/:userAccount/:projectId/milestone/editMilestone/:milestonesId',
                name: '编辑里程碑',
                component: '@/pages/Milestone/NewMilestone',
                isAuth: true,
                hideInMenu: true,
                navigate:
                  "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/${sessionStorage.getItem('projectId')}/milestone/editMilestone/${sessionStorage.getItem('milestonesId')}`)}",
              },
              {
                path: '/:userAccount/:projectId/milestone/milestoneInfo/:milestonesId',
                name: '里程碑详情',
                component: '@/pages/Milestone/MilestoneInfo',
                isAuth: true,
                hideInMenu: true,
                navigate:
                  "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/${sessionStorage.getItem('projectId')}/milestone/milestoneInfo/${sessionStorage.getItem('milestonesId')}`)}",
              },
            ],
          },
          {
            path: '/:userAccount/:projectId/task',
            name: '任务列表',
            icon: 'paper-clip',
            component: '@/pages/Project/Task',
            navigate: (navigate, location) => {
              const userId = sessionStorage.getItem('userAccount')
              const id = sessionStorage.getItem('projectId')
              navigate(`/${userId}/${id}/task?2`)
            },
            isAuth: true,
          },
          {
            path: '/:userAccount/:projectId/taskBoard',
            name: '任务看板',
            icon: 'table',
            component: '@/pages/TaskBoard',
            isAuth: true,
            navigate:
              "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/${sessionStorage.getItem('projectId')}/taskBoard`)}",
          },
          {
            path: '/:userAccount/:projectId/task',
            name: '任务列表',
            isAuth: true,
            hideInMenu: true,
            routes: [
              {
                path: '/:userAccount/:projectId/task?2',
                name: '任务列表',
                component: '@/pages/Project/Task',
                isAuth: true,
              },
              {
                path: '/:userAccount/:projectId/task/newIssue',
                name: '新增任务',
                hideInMenu: true,
                component: '@/pages/Project/NewIssue',
                isAuth: true,
              },
              {
                path: '/:userAccount/:projectId/task/taskInfo/:id',
                name: '任务详情',
                component: '@/pages/Project/TaskInfo',
                hideInMenu: true,
                isAuth: true,
              },
            ],
          },
          {
            path: '/:userAccount/:projectId/usersManagement',
            name: '成员管理',
            icon: 'user',
            component: '@/pages/UsersManagement',
            isAuth: true,
            navigate:
              "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/${sessionStorage.getItem('projectId')}/usersManagement`)}",
          },
          {
            path: '/:userAccount/:projectId/labels',
            name: '标签管理',
            icon: 'tags-o',
            component: '@/pages/Project/LabelManage',
            isAuth: true,
            navigate:
              "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/${sessionStorage.getItem('projectId')}/labels`)}",
          },
          {
            path: '/:userAccount/:projectId/labels',
            name: '标签管理',
            hideInMenu: true,
            icon: 'tags-o',
            isAuth: true,
            routes: [
              {
                path: '/:userAccount/:projectId/labels/new',
                name: '新增标签',
                component: '@/pages/Project/LabelManage/NewEditLabel',
                isAuth: true,
                hideInMenu: true,
                navigate:
                  "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/${sessionStorage.getItem('projectId')}/labels/new`)}",
              },
              {
                path: '/:userAccount/:projectId/labels/:labelsId',
                name: '编辑标签',
                component: '@/pages/Project/LabelManage/NewEditLabel',
                isAuth: true,
                hideInMenu: true,
                navigate:
                  "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/${sessionStorage.getItem('projectId')}/labels/${sessionStorage.getItem('labelsId')}`)}",
              },
            ],
          },
        ],
      },
      {
        path: '/Authority',
        name: '系统管理',
        hideInMenu: true,
        isAuth: true,
        side: true,
        routes: [
          {
            path: '/Authority/users',
            name: '用户管理',
            icon: 'user',
            component: '@/pages/Authority/AllUsers',
            isAuth: true,
            // navigate:
            //   "(navigate) => {navigate(`/users/:projectId/${sessionStorage.getItem('projectId')}`)}",
          },
          {
            path: '/Authority/RoleManagement',
            name: '角色管理',
            icon: 'smile-o',
            component: '@/pages/Authority/RoleManagement',
            isAuth: true,
          },
          {
            path: '/Authority/MenuManagement',
            name: '菜单管理',
            icon: 'menu',
            component: '@/pages/Authority/MenuManagement',
            isAuth: true,
          },
          {
            path: '/Authority/DepartmentPage',
            name: '部门管理',
            icon: 'appstore-o',
            component: '@/pages/Authority/DepartmentPage',
            isAuth: true,
          },
          {
            path: '/Authority/DepartmentPageRefactor',
            name: '部门管理2',
            icon: 'appstore-o',
            component: '@/pages/Authority/DepartmentPageRefactor',
            isAuth: false,
          },
          {
            path: '/Authority/PostManagement',
            name: '岗位管理',
            icon: 'square-o',
            component: '@/pages/Authority/PostManagement',
            isAuth: true,
          },
          {
            path: '/Authority/migrate',
            name: '第三方迁移配置',
            icon: 'shopping-cart',
            isAuth: true,
            routes: [
              {
                path: '/Authority/migrate/source',
                name: '数据迁移源',
                component: '@/pages/Authority/Migrate/MigrateSource',
              },
              {
                path: '/Authority/migrate/control',
                name: '数据迁移',
                component: '@/pages/Authority/Migrate/MigrateControl',
              },
              {
                path: '/Authority/migrate/control/:synchId',
                name: '数据迁移同步数据',
                component:
                  '@/pages/Authority/Migrate/MigrateControl/MigrateControlSynch',
                hideInMenu: true,
              },
              {
                path: '/Authority/migrate/detail',
                name: '迁移日志',
                component: '@/pages/Authority/Migrate/MigrateDetail',
              },
            ],
          },
          {
            path: '/Authority/dictionary',
            name: '数据字典',
            icon: 'date',
            component: '@/pages/Dictionary',
            isAuth: true,
          },
          {
            path: '/Authority/team',
            name: '团队管理',
            icon: 'usergroup-add',
            component: '@/pages/TeamManagement',
            isAuth: true,
          },
        ],
      },
      {
        path: '/projectAuth',
        name: '团队管理权限',
        component: '@/pages/ProjectAuth',
        hideInMenu: true,
      },
      {
        path: '/403',
        name: '403',
        hideInMenu: true,
        component: '403',
      },
      {
        path: '/500',
        name: '500',
        hideInMenu: true,
        component: '500',
      },
      // {
      //   path: '/404',
      //   name: '404',
      //   hideInMenu: true,
      //   component: '404',
      // },
      {
        path: '*',
        name: '404',
        component: '404',
      },
    ],
  },
]

export default routes
