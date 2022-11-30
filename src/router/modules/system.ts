const systemRouter: RouteConfigsTable = {
  path: '/system',
  meta: {
    icon: 'setting',
    title: '系统管理',
    rank: 2
  },
  children: [
    {
      path: '/system/server/index',
      name: 'server',
      component: () =>
        import('@/views/system/servers-management/list/index.vue'),
      meta: {
        title: '存储服务器管理'
      }
    },
    {
      path: '/system/monitoring/index',
      name: 'Monitoring',
      component: () =>
        import('@/views/system/monitoring-management/list/index.vue'),
      meta: {
        title: '监控管理'
      }
    },
    {
      path: '/system/monitoring/detail/:id',
      name: 'MonitoringDetail',
      component: () =>
        import('@/views/system/monitoring-management/detail/index.vue'),
      meta: {
        showLink: false,
        title: '监控详情'
      }
    },
    {
      path: '/system/monitoring/detail/:id/:tab',
      name: 'MonitoringDetailTab',
      component: () =>
        import('@/views/system/monitoring-management/detail/index.vue'),
      meta: {
        showLink: false,
        title: '监控详情'
      }
    },
    {
      path: '/system/parse/index',
      name: 'Parse',
      component: () => import('@/views/system/parse/list/index.vue'),
      meta: {
        title: '解析管理'
      }
    },
    {
      path: '/system/model/index',
      name: 'Model',
      component: () => import('@/views/system/model-management/list/index.vue'),
      meta: {
        title: '计算模型管理'
      }
    }
  ]
};
export default systemRouter;
