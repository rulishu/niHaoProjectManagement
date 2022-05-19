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
        redirect: '/home',
      },
      {
        path: '/home',
        name: '工作台',
        component: '@/pages/WorkBench',
        hideInMenu: true,
      },
      {
        path: '/projectList',
        name: '项目列表',
        component: '@/pages/ProjectList',
        hideInMenu: true,
        isAuth: false,
      },
      {
        path: '/todoList',
        name: '待办事项列表',
        component: '@/pages/TodoList',
        hideInMenu: true,
        isAuth: false,
      },
      {
        path: '/projectOverview/:projectId',
        name: '项目概览',
        component: '@/pages/ProjectOverview',
        isAuth: true,
        navigate:
          "(navigate) => {navigate(`/projectOverview/${sessionStorage.getItem('projectId')}`)}",
      },
      {
        path: '/milestone/:projectId',
        name: '里程碑',
        component: '@/pages/Milestone',
        navigate:
          "(navigate) => {navigate(`/milestone/${sessionStorage.getItem('id')}`)}",
        isAuth: true,
      },
      {
        path: '/milestone',
        name: '里程碑',
        hideInMenu: true,
        isAuth: true,
        routes: [
          {
            path: '/milestone/newMilestone/:projectId',
            name: '新增里程碑',
            component: '@/pages/Milestone/NewMilestone',
            isAuth: true,
            hideInMenu: true,
            navigate:
              "(navigate) => {navigate(`/milestone/newMilestone/${sessionStorage.getItem('id')}`)}",
          },
          {
            path: '/milestone/editMilestone/:projectId/:milestonesId',
            name: '编辑里程碑',
            component: '@/pages/Milestone/NewMilestone',
            isAuth: true,
            hideInMenu: true,
            navigate:
              "(navigate) => {navigate(`/milestone/editMilestone/${sessionStorage.getItem('id')}/${sessionStorage.getItem('milestonesId')}`)}",
          },
          {
            path: '/milestone/milestoneInfo/:projectId/:milestonesId',
            name: '里程碑详情',
            component: '@/pages/Milestone/MilestoneInfo',
            isAuth: true,
            hideInMenu: true,
            navigate:
              "(navigate) => {navigate(`/milestone/milestoneInfo/${sessionStorage.getItem('id')}/${sessionStorage.getItem('milestonesId')}`)}",
          },
        ],
      },
      {
        path: '/project/task/:projectId',
        name: '任务列表',
        component: '@/pages/Project/Task',
        navigate: (navigate, location) => {
          const id = sessionStorage.getItem('projectId')
          navigate(`/project/task/${id}`)
        },
        isAuth: true,
      },
      {
        path: '/project',
        name: '任务管理',
        isAuth: true,
        hideInMenu: true,
        routes: [
          {
            path: '/project/task/:projectId',
            name: '任务列表',
            component: '@/pages/Project/Task',
            isAuth: true,
          },
          {
            path: '/project/newIssue',
            name: '新增任务',
            hideInMenu: true,
            component: '@/pages/Project/NewIssue',
            isAuth: true,
          },
          {
            path: '/project/taskInfo/:projectId/:id',
            name: '任务详情',
            component: '@/pages/Project/TaskInfo',
            hideInMenu: true,
            isAuth: true,
          },
        ],
      },
      {
        path: '/team',
        name: '团队管理',
        component: '@/pages/TeamManagement',
        isAuth: false,
      },
      {
        path: '/team',
        name: '团队管理',
        hideInMenu: true,
        isAuth: true,
        routes: [
          {
            path: '/team/teamItem/:id',
            name: '团队详情',
            component: '@/pages/TeamManagement/TeamItem',
            hideInMenu: true,
            isAuth: true,
          },
        ],
      },
      {
        path: '/usersManagement/:projectId',
        name: '成员管理',
        component: '@/pages/UsersManagement',
        isAuth: true,
        navigate:
          "(navigate) => {navigate(`/usersManagement/${sessionStorage.getItem('projectId')}`)}",
      },
      {
        path: '/Authority',
        name: '系统管理',
        isAuth: true,
        routes: [
          {
            path: '/Authority/users',
            name: '用户管理',
            component: '@/pages/Authority/AllUsers',
            isAuth: true,
            // navigate:
            //   "(navigate) => {navigate(`/users/:projectId/${sessionStorage.getItem('projectId')}`)}",
          },
          {
            path: '/Authority/RoleManagement',
            name: '角色管理',
            component: '@/pages/Authority/RoleManagement',
            isAuth: true,
          },
          {
            path: '/Authority/MenuManagement',
            name: '菜单管理',
            component: '@/pages/Authority/MenuManagement',
            isAuth: true,
          },
          {
            path: '/Authority/DepartmentPage',
            name: '部门管理',
            component: '@/pages/Authority/DepartmentPage',
            isAuth: true,
          },
          {
            path: '/Authority/PostManagement',
            name: '岗位管理',
            component: '@/pages/Authority/PostManagement',
            isAuth: true,
          },
          {
            path: '/Authority/dictionary',
            name: '数据字典',
            component: '@/pages/Dictionary',
            isAuth: true,
          },
        ],
      },
      {
        path: '/projectAuth',
        name: '项目权限',
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
