const taskRouter: RouteConfigsTable = {
  path: '/task',
  meta: {
    icon: 'lock',
    title: '任务管理',
    rank: 2
  },
  children: [
    {
      path: '/task/project/index',
      name: 'Servers',
      component: () => import('@/views/task/project-management/list/index.vue'),
      meta: {
        title: '项目列表',
        showParent: true
      }
    }
  ]
};
export default taskRouter;
