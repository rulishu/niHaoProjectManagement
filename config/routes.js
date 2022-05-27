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
        redirect: `/${localStorage.getItem('userAccount')}`,
      },
      {
        path: '/tissue',
        name: '组织',
        isAuth: true,
        hideInMenu: true,
        side: true,
        routes: [
          {
            path: '/tissue/projectList',
            name: '项目列表',
            component: '@/pages/ProjectList',
            hideInMenu: true,
            isAuth: false,
          },
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
            icon: 'circle-o',
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
            icon: 'down-circle-o',
            component: '@/pages/Project/Task',
            navigate: (navigate, location) => {
              const id = sessionStorage.getItem('projectId')
              navigate(`/tissue/${id}/task`)
            },
            isAuth: true,
          },
          {
            path: '/tissue/:projectId/task',
            name: '任务管理',
            isAuth: true,
            hideInMenu: true,
            routes: [
              {
                path: '/tissue/:projectId/task',
                name: '任务列表',
                component: '@/pages/Project/Task',
                isAuth: true,
                navigate:
                  "(navigate) => {navigate(`/tissue/${sessionStorage.getItem('projectId')}/task`)}",
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
                path: '/tissue/:projectId/taskInfo/:id',
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
        navigate:
          "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}`)}",
      },
      // {
      //   path: '/project/taskBoard/:projectId',
      //   name: '任务看板',
      //   icon: 'down-circle-o',
      //   component: '@/pages/TaskBoard',
      //   navigate: (navigate, location) => {
      //     const id = sessionStorage.getItem('projectId')
      //     navigate(`/project/TaskBoard/${id}`)
      //   },
      //   isAuth: true,
      // },
      {
        path: '/:userAccount',
        name: '用户主页',
        isAuth: true,
        hideInMenu: true,
        side: true,
        routes: [
          {
            path: '/:userAccount/dashboard',
            name: '工作台',
            hideInMenu: true,
            component: '@/pages/WorkBench',
            navigate:
              "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}`)}/dashboard",
          },
          {
            path: '/:userAccount/projectList',
            name: '项目列表',
            component: '@/pages/ProjectList',
            hideInMenu: true,
            isAuth: false,
            navigate:
              "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/projectList`)}",
          },
          {
            path: '/:userAccount/todoList',
            name: '待办事项列表',
            component: '@/pages/TodoList',
            hideInMenu: true,
            isAuth: false,
            navigate:
              "(navigate) => {navigate(`/${sessionStorage.getItem('userAccount')}/todoList`)}",
          },
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
            icon: 'circle-o',
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
            icon: 'down-circle-o',
            component: '@/pages/Project/Task',
            navigate: (navigate, location) => {
              const userId = sessionStorage.getItem('userAccount')
              const id = sessionStorage.getItem('projectId')
              navigate(`/${userId}/${id}/task`)
            },
            isAuth: true,
          },
          {
            path: '/:userAccount/:projectId/task',
            name: '任务管理',
            isAuth: true,
            hideInMenu: true,
            routes: [
              {
                path: '/:userAccount/:projectId/task',
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
                path: '/:userAccount/:projectId/taskInfo/:id',
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
            path: '/Authority/dictionary',
            name: '数据字典',
            icon: 'date',
            component: '@/pages/Dictionary',
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
      {
        path: '/404',
        name: '404',
        hideInMenu: true,
        component: '404',
      },
      {
        path: '*',
        name: '404',
        component: '404',
      },
    ],
  },
]

export default routes
