export default [
  {
    path: '*',
    meta: {
      public: true
    },
    redirect: {
      path: '/404'
    }
  },
  {
    path: '/404',
    meta: {
      public: true
    },
    name: 'NotFound',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/NotFound.vue'
    )
  },
  {
    path: '/403',
    meta: {
      public: true
    },
    name: 'AccessDenied',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Deny.vue'
    )
  },
  {
    path: '/500',
    meta: {
      public: true
    },
    name: 'ServerError',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Error.vue'
    )
  },
  {
    path: '/MAPForms',
    meta: {
      public: true
    },
    name: 'MAPForms',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MAPForms/Index.vue'
    )
  },
  
  {
    path: '/login',
    meta: {
      public: true
    },
    name: 'Login',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Login.vue'
    )
  },
  {
    path: '/logout',
    meta: {
      public: true
    },
    name: 'Logout',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Logout.vue'
    )
  },
  {
    path: '/',
    meta: { },
    name: 'Root',
    redirect: {
      name: 'Dashboard'
    }
  },
  {
    path: '/dashboard',
    meta: { breadcrumb: false, title: 'Dashboard' },
    name: 'Dashboard',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Dashboard.vue'
    )
  },

  // ===>
  {
    path: '/Human',
    meta: {
      breadcrumb: false,
      title: 'People',
      entity: 'Human', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'Human',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Human/listing/View.vue'
    )
  }, {
    path: '/Human/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Person',
      entity: 'Human', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditHuman',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Human/formEdit/Index.vue'
    )
  }, {
    path: '/Human/new',
    meta: {
      breadcrumb: false,
      title: 'New Person',
      entity: 'Human', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'CreateHuman',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Human/formCreate/Index.vue'
    )
  }, {
    path: '/Human/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'Human', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'AddHumanSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Human/formSchema/Index.vue'
    )
  }, {
    path: '/Human/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'Human', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditHumanSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Human/formSchema/Index.vue'
    )
  },

  // ===>
  {
    path: '/Consumidor',
    meta: {
      breadcrumb: false,
      title: 'Consumidores',
      entity: 'Consumidor', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'Consumidor',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Consumidor/listing/View.vue'
    )
  }, {
    path: '/Consumidor/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Consumidor',
      entity: 'Consumidor', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'EditConsumidor',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Consumidor/formEdit/Index.vue'
    )
  }, {
    path: '/Consumidor/new',
    meta: {
      breadcrumb: false,
      title: 'New Consumidor',
      entity: 'Consumidor', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'CreateConsumidor',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Consumidor/formCreate/Index.vue'
    )
  }, {
    path: '/Consumidor/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'Consumidor', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'AddConsumidorSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Consumidor/formSchema/Index.vue'
    )
  }, {
    path: '/Consumidor/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'Consumidor', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'EditConsumidorSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Consumidor/formSchema/Index.vue'
    )
  },

  // ===>
  {
    path: '/Produto',
    meta: {
      breadcrumb: false,
      title: 'Produtoes',
      entity: 'Produto', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'Produto',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Produto/listing/View.vue'
    )
  }, {
    path: '/Produto/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Produto',
      entity: 'Produto', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'EditProduto',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Produto/formEdit/Index.vue'
    )
  }, {
    path: '/Produto/new',
    meta: {
      breadcrumb: false,
      title: 'New Produto',
      entity: 'Produto', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'CreateProduto',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Produto/formCreate/Index.vue'
    )
  }, {
    path: '/Produto/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'Produto', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'AddProdutoSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Produto/formSchema/Index.vue'
    )
  }, {
    path: '/Produto/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'Produto', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'EditProdutoSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Produto/formSchema/Index.vue'
    )
  },

  // ===>
  {
    path: '/Fornecedor',
    meta: {
      breadcrumb: false,
      title: 'Fornecedores',
      entity: 'Fornecedor', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'Fornecedor',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Fornecedor/listing/View.vue'
    )
  }, {
    path: '/Fornecedor/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Fornecedor',
      entity: 'Fornecedor', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'EditFornecedor',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Fornecedor/formEdit/Index.vue'
    )
  }, {
    path: '/Fornecedor/new',
    meta: {
      breadcrumb: false,
      title: 'New Fornecedor',
      entity: 'Fornecedor', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'CreateFornecedor',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Fornecedor/formCreate/Index.vue'
    )
  }, {
    path: '/Fornecedor/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'Fornecedor', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'AddFornecedorSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Fornecedor/formSchema/Index.vue'
    )
  }, {
    path: '/Fornecedor/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'Fornecedor', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'nome' // swagger gen
    },
    name: 'EditFornecedorSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Fornecedor/formSchema/Index.vue'
    )
  },

  // ===>
  {
    path: '/User',
    meta: {
      breadcrumb: false,
      title: 'Users',
      entity: 'User', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'username' // swagger gen
    },
    name: 'User',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/User/listing/View.vue'
    )
  }, {
    path: '/User/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit User',
      entity: 'User', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'username' // swagger gen
    },
    name: 'EditUser',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/User/formEdit/Index.vue'
    )
  }, {
    path: '/User/new',
    meta: {
      breadcrumb: false,
      title: 'New User',
      entity: 'User', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'username' // swagger gen
    },
    name: 'CreateUser',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/User/formCreate/Index.vue'
    )
  }, {
    path: '/User/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'User', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'username' // swagger gen
    },
    name: 'AddUserSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/User/formSchema/Index.vue'
    )
  }, {
    path: '/User/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'User', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'username' // swagger gen
    },
    name: 'EditUserSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/User/formSchema/Index.vue'
    )
  },
  {
    path: '/privacy',
    meta: {
      breadcrumb: false,
      title: 'Your Privacy'
    },
    name: 'Privacy',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Privacy/Privacy.vue'
    )
  },
  
  {
    path: '/chat',
    meta: {
      public: false,
      title: 'Chat'
    },
    name: 'Chat',
    component: () => import(
      /* webpackChunkName: "routes" */
      '@/components/chat/ChatMessaging.vue'
    ),
    redirect: {
      path: '/chat/messaging'
    },
    children: [
      {
        path: '/chat/messaging/:_id?',
        meta: {
          public: true
        },
        name: 'ChatMessaging',
        props: true,
        components: {
          default: () => import(
            /* webpackChunkName: "routes" */
            /* webpackMode: "lazy-once" */
            '@/components/chat/ChatMessaging.vue'
          )
        }
      },
      {
        path: '/chat/contact/:_id?',
        meta: {
          public: true
        },
        name: 'ChatContact',
        components: {
          default: () => import(
            /* webpackChunkName: "routes" */
            /* webpackMode: "lazy-once" */
            '@/components/chat/ChatContact.vue'
          )

        }
      }
    ]
  },
  {
    path: '/mail',
    meta: {
      public: true
    },
    name: 'Mail',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/components/email/Layout.vue'
    ),
    redirect: {
      path: '/mail/all'
    },
    children: [
      {
        path: '/mail/:mailType',
        meta: {
          public: true
        },
        name: 'MailIndex',
        component: () => import(
          /* webpackChunkName: "routes" */
          /* webpackMode: "lazy-once" */
          '@/components/email/List.vue'
        )
      },
      {
        path: '/mail/0/:_id',
        meta: {
          public: true
        },
        name: 'MailDetail',
        component: () => import(
          /* webpackChunkName: "routes" */
          /* webpackMode: "lazy-once" */
          '@/components/email/Reply.vue'
        )
      }
    ]
  },
  {
    path: '/surveys',
    meta: {
      breadcrumb: false,
      title: 'Surveys',
      entity: 'Survey', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'Survey',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Survey/View.vue'
    )
  }
]
