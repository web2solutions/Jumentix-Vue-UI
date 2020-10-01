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
    path: '/setup',
    meta: {
      public: true
    },
    name: 'Setup',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Setup/Setup.vue'
    )
  },
  {
    path: '/setup/agency',
    meta: {
      breadcrumb: false,
      title: 'Setup Agency',
      public: true
    },
    name: 'SetupAgency',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Setup/Agency.vue'
    )
  },
  {
    path: '/setup/roles',
    meta: {
      public: true
    },
    name: 'SetupRoles',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Setup/Roles.vue'
    )
  },
  {
    path: '/setup/portal-configuration',
    meta: {
      public: true
    },
    name: 'SetupPortal',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Setup/PortalConfig.vue'
    )
  },
  {
    path: '/setup/outsideOrganization',
    meta: {
      public: true
    },
    name: 'SetupOutsideOrganization',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Setup/outsideOrganization.vue'
    )
  },
  {
    path: '/setup/users',
    meta: {
      public: true
    },
    name: 'SetupUser',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Setup/Users.vue'
    )
  },
  {
    path: '/setup/programs',
    meta: {
      public: true
    },
    name: 'SetupPrograms',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Setup/Programs.vue'
    )
  },
  {
    path: '/setup/task-status',
    meta: {
      public: true
    },
    name: 'SetupTaskStatus',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Setup/TaskStatus.vue'
    )
  },
  {
    path: '/setup/task-configuration',
    meta: {
      public: true
    },
    name: 'SetupTaskConfig',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Setup/TaskConfig.vue'
    )
  },
  {
    path: '/setup/phase',
    meta: {
      public: true
    },
    name: 'SetupPhases',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Setup/Phases.vue'
    )
  },
  {
    path: '/setup/groups',
    meta: {
      public: true
    },
    name: 'SetupGroups',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Setup/Groups.vue'
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
  {
    path: '/finance',
    meta: {
      breadcrumb: false,
      title: 'Finance'
    },
    name: 'Finance',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Finance.vue'
    )
  },
  {
    path: '/invoices',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Invoices'
    },
    name: 'Invoices',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Invoices/Invoices.vue'
    )
  },
  {
    path: '/invoices-client/:id',
    meta: {
      breadcrumb: false,
      title: 'Finance - Client Invoices'
    },
    name: 'InvoicesClient',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Invoices/InvoicesClient.vue'
    )
  },
  {
    path: '/payments-client/:id',
    meta: {
      breadcrumb: false,
      title: 'Finance - Client Payments'
    },
    name: 'PaymentsClient',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Payments/PaymentsClient.vue'
    )
  },
  {
    path: '/customer-invoices/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Customer Invoices'
    },
    name: 'InvoicesCustomer',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Invoices/InvoicesCustomer.vue'
    )
  },
  {
    path: '/invoice/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Invoice'
    },
    name: 'InvoiceView',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Invoices/InvoiceView.vue'
    )
  },
  {
    path: '/invoice-payment/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Invoice Payment'
    },
    name: 'InvoicePayment',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Invoices/InvoicePayment.vue'
    )
  },
  {
    path: '/invoice-create',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Create Invoice'
    },
    name: 'InvoicesCreate',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Invoices/InvoicesCreate.vue'
    )
  },
  {
    path: '/invoice-edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Edit Invoice'
    },
    name: 'InvoicesEdit',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Invoices/InvoicesEdit.vue'
    )
  },
  {
    path: '/payments',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Payments'
    },
    name: 'Payments',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Payments/Payments.vue'
    )
  },
  {
    path: '/Payment/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Payment'
    },
    name: 'PaymentView',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Payments/PaymentsView.vue'
    )
  },
  {
    path: '/summary/:id',
    meta: {
      breadcrumb: false,
      title: 'Finance - Summary'
    },
    name: 'Summary',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Summary.vue'
    )
  },
  {
    path: '/clients-add',
    meta: {
      breadcrumb: false,
      title: 'Personal Contact Creation'
    },
    name: 'ClientsAdd',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Clients/ClientsAdd.vue'
    )
  },
  {
    path: '/clients',
    meta: {
      breadcrumb: false,
      title: 'Clients',
      entity: 'Human', // swagger gen
      itemKey: 'first_name' // swagger gen
    },
    name: 'Clients',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Clients/Clients.vue'
    )
  },
  {
    path: '/contact',
    meta: {
      breadcrumb: false,
      title: 'Contacts',
      entity: 'Human', // swagger gen
      itemKey: 'first_name' // swagger gen
    },
    name: 'Contact',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Client/Client.vue'
    ),
    props: (route) => ({ query: route.params })
  },
  {
    path: '/contact-details/:id',
    meta: {
      breadcrumb: false,
      title: 'Contact Details'
    },
    name: 'ContactDetails',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Client/ContactDetails.vue'
    )
  },
  {
    path: '/clients-search',
    meta: {
      breadcrumb: false,
      title: 'Clients / Search'
    },
    name: 'ClientsSearch',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Clients/ClientsSearch.vue'
    )
  },

  {
    path: '/contacts/dashboard',
    meta: {
      breadcrumb: false,
      title: 'Contacts Dashboard',
      entity: 'Human', // swagger gen
      itemKey: 'first_name' // swagger gen
    },
    name: 'ContactsDashboard',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Contact/Dashboard.vue'
    ),
    props: (route) => ({ query: route.params })
  },
  {
    path: '/contacts/family/view/:id',
    meta: {
      breadcrumb: false,
      title: 'Family Dashboard',
      entity: 'Family', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'ContactsFamilyView',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Contact/Family/view.vue'
    ),
    props: (route) => ({ query: route.params })
  },
  {
    path: '/contacts/family/add',
    meta: {
      breadcrumb: false,
      title: 'Family Add',
      entity: 'Family', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'ContactsFamilyAdd',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Contact/Family/add.vue'
    ),
    props: (route) => ({ query: route.params })
  },
  {
    path: '/contacts/person/:id',
    meta: {
      breadcrumb: false,
      title: 'Person Dashboard',
      entity: 'Person', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'ContactsPersonView',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Contact/Person/view.vue'
    ),
    props: (route) => ({ query: route.params })
  },

  // ===>
  {
    path: '/Program',
    meta: {
      breadcrumb: false,
      title: 'Program',
      entity: 'Program', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'Program',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Program/listing/View.vue'
    )
  }, {
    path: '/Program/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Program',
      entity: 'Program', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditProgram',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Program/formEdit/Index.vue'
    )
  }, {
    path: '/Program/new',
    meta: {
      breadcrumb: false,
      title: 'New Program',
      entity: 'Program', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'CreateProgram',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Program/formCreate/Index.vue'
    )
  }, {
    path: '/Program/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'Program', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'AddProgramSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Program/formSchema/Index.vue'
    )
  }, {
    path: '/Program/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'Program', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditProgramSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Program/formSchema/Index.vue'
    )
  },

  // ===>
  {
    path: '/Role',
    meta: {
      breadcrumb: false,
      title: 'Roles',
      entity: 'Role', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'Role',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Role/listing/View.vue'
    )
  }, {
    path: '/Role/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Role',
      entity: 'Role', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditRole',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Role/formEdit/Index.vue'
    )
  }, {
    path: '/Role/new',
    meta: {
      breadcrumb: false,
      title: 'New Role',
      entity: 'Role', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'CreateRole',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Role/formCreate/Index.vue'
    )
  }, {
    path: '/Role/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'Role', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'AddRoleSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Role/formSchema/Index.vue'
    )
  }, {
    path: '/Role/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'Role', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditRoleSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Role/formSchema/Index.vue'
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
    path: '/Form',
    meta: {
      breadcrumb: false,
      title: 'Form',
      entity: 'Form', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'Form',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Form/listing/View.vue'
    )
  }, {
    path: '/Form/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Form',
      entity: 'Form', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditForm',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Form/formEdit/Index.vue'
    )
  }, {
    path: '/Form/new',
    meta: {
      breadcrumb: false,
      title: 'New Form',
      entity: 'Form', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'CreateForm',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Form/formCreate/Index.vue'
    )
  }, {
    path: '/Form/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'Form', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'AddFormSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Form/formSchema/Index.vue'
    )
  }, {
    path: '/Form/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'Form', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditFormSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Form/formSchema/Index.vue'
    )
  },

  // ===>
  {
    path: '/Family',
    meta: {
      breadcrumb: false,
      title: 'Family',
      entity: 'Family', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'Family',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Family/listing/View.vue'
    )
  }, {
    path: '/Family/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Family',
      entity: 'Family', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditFamily',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Family/formEdit/Index.vue'
    )
  }, {
    path: '/Family/new',
    meta: {
      breadcrumb: false,
      title: 'New Family',
      entity: 'Family', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'CreateFamily',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Family/formCreate/Index.vue'
    )
  }, {
    path: '/Family/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'Family', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'AddFamilySubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Family/formSchema/Index.vue'
    )
  }, {
    path: '/Family/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'Family', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditFamilySubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Family/formSchema/Index.vue'
    )
  },

  // ===>
  {
    path: '/SubRole',
    meta: {
      breadcrumb: false,
      title: 'Sub Roles',
      entity: 'SubRole', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'SubRole',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/SubRole/listing/View.vue'
    )
  }, {
    path: '/SubRole/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Role',
      entity: 'SubRole', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditSubRole',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/SubRole/formEdit/Index.vue'
    )
  }, {
    path: '/SubRole/new',
    meta: {
      breadcrumb: false,
      title: 'New Sub Role',
      entity: 'SubRole', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'CreateSubRole',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/SubRole/formCreate/Index.vue'
    )
  }, {
    path: '/SubRole/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'SubRole', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'AddSubRoleSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/SubRole/formSchema/Index.vue'
    )
  }, {
    path: '/SubRole/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'SubRole', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditSubRoleSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/SubRole/formSchema/Index.vue'
    )
  },

  // ===>
  {
    path: '/Group',
    meta: {
      breadcrumb: false,
      title: 'Groups',
      entity: 'Group', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'Group',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Group/listing/View.vue'
    )
  }, {
    path: '/Group/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Group',
      entity: 'Group', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditGroup',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Group/formEdit/Index.vue'
    )
  }, {
    path: '/Group/new',
    meta: {
      breadcrumb: false,
      title: 'New Group',
      entity: 'Group', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'CreateGroup',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Group/formCreate/Index.vue'
    )
  }, {
    path: '/Group/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'Group', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'AddGroupSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Group/formSchema/Index.vue'
    )
  }, {
    path: '/Group/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'Group', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditGroupSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Group/formSchema/Index.vue'
    )
  },

  // ===>
  {
    path: '/CaseType',
    meta: {
      breadcrumb: false,
      title: 'Case Types',
      entity: 'CaseType', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'type' // swagger gen
    },
    name: 'CaseType',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseType/listing/View.vue'
    )
  }, {
    path: '/CaseType/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Case Type',
      entity: 'CaseType', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'type' // swagger gen
    },
    name: 'EditCaseType',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseType/formEdit/Index.vue'
    )
  }, {
    path: '/CaseType/new',
    meta: {
      breadcrumb: false,
      title: 'New Case Type',
      entity: 'CaseType', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'type' // swagger gen
    },
    name: 'CreateCaseType',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseType/formCreate/Index.vue'
    )
  }, {
    path: '/CaseType/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'CaseType', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'type' // swagger gen
    },
    name: 'AddCaseTypeSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseType/formSchema/Index.vue'
    )
  }, {
    path: '/CaseType/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'CaseType', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'type' // swagger gen
    },
    name: 'EditCaseTypeSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseType/formSchema/Index.vue'
    )
  },
  // ===>
  {
    path: '/CaseNoteType',
    meta: {
      breadcrumb: false,
      title: 'Case Note Types',
      entity: 'CaseNoteType', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'type' // swagger gen
    },
    name: 'CaseNoteType',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseNoteType/listing/View.vue'
    )
  }, {
    path: '/CaseNoteType/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Case Note Type',
      entity: 'CaseNoteType', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'type' // swagger gen
    },
    name: 'EditCaseNoteType',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseNoteType/formEdit/Index.vue'
    )
  }, {
    path: '/CaseNoteType/new',
    meta: {
      breadcrumb: false,
      title: 'New Case Note Type',
      entity: 'CaseNoteType', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'type' // swagger gen
    },
    name: 'CreateCaseNoteType',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseNoteType/formCreate/Index.vue'
    )
  }, {
    path: '/CaseNoteType/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'CaseNoteType', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'type' // swagger gen
    },
    name: 'AddCaseNoteTypeSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseNoteType/formSchema/Index.vue'
    )
  }, {
    path: '/CaseNoteType/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'CaseNoteType', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'type' // swagger gen
    },
    name: 'EditCaseNoteTypeSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseNoteType/formSchema/Index.vue'
    )
  },

  // ===>
  {
    path: '/CaseStatus',
    meta: {
      breadcrumb: false,
      title: 'Case Statuses',
      entity: 'CaseStatus', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'status' // swagger gen
    },
    name: 'CaseStatus',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseStatus/listing/View.vue'
    )
  }, {
    path: '/CaseStatus/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Case Status',
      entity: 'CaseStatus', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'status' // swagger gen
    },
    name: 'EditCaseStatus',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseStatus/formEdit/Index.vue'
    )
  }, {
    path: '/CaseStatus/new',
    meta: {
      breadcrumb: false,
      title: 'New Case Status',
      entity: 'CaseStatus', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'status' // swagger gen
    },
    name: 'CreateCaseStatus',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseStatus/formCreate/Index.vue'
    )
  }, {
    path: '/CaseStatus/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'CaseStatus', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'status' // swagger gen
    },
    name: 'AddCaseStatusSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseStatus/formSchema/Index.vue'
    )
  }, {
    path: '/CaseStatus/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'CaseStatus', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'status' // swagger gen
    },
    name: 'EditCaseStatusSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/CaseStatus/formSchema/Index.vue'
    )
  },

  // ===>
  {
    path: '/Phase',
    meta: {
      breadcrumb: false,
      title: 'Phases',
      entity: 'Phase', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'Phase',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Phase/listing/View.vue'
    )
  }, {
    path: '/Phase/edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Edit Phase',
      entity: 'Phase', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditPhase',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Phase/formEdit/Index.vue'
    )
  }, {
    path: '/Phase/new',
    meta: {
      breadcrumb: false,
      title: 'New Phase',
      entity: 'Phase', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'CreatePhase',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Phase/formCreate/Index.vue'
    )
  }, {
    path: '/Phase/edit/:id/schema/:schemaName/:mode',
    meta: {
      breadcrumb: false,
      title: 'Add Sub Document',
      entity: 'Phase', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'AddPhaseSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Phase/formSchema/Index.vue'
    )
  }, {
    path: '/Phase/edit/:id/schema/:schemaName/:mode/:schemaid',
    meta: {
      breadcrumb: false,
      title: 'Edit Sub Document',
      entity: 'Phase', // swagger gen
      itemKey: '_id', // swagger gen
      itemLabel: 'name' // swagger gen
    },
    name: 'EditPhaseSubDocument',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Phase/formSchema/Index.vue'
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
    path: '/organization',
    meta: {
      breadcrumb: false,
      title: 'Organization',
      entity: 'Organization', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'Organization',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Organization/View.vue'
    )
  },
  {
    path: '/organization-type',
    meta: {
      breadcrumb: false,
      title: 'Organization Types',
      entity: 'OrganizationType', // swagger gen
      itemKey: 'type' // swagger gen
    },
    name: 'OrganizationType',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/OrganizationType/View.vue'
    )
  },
  {
    path: '/organization-service',
    meta: {
      breadcrumb: false,
      title: 'Organization Services',
      entity: 'OrganizationService', // swagger gen
      itemKey: 'service' // swagger gen
    },
    name: 'OrganizationService',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/OrganizationService/View.vue'
    )
  },

  {
    path: '/events',
    meta: {
      breadcrumb: false,
      title: 'Events',
      entity: 'Event', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'Event',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Event/View.vue'
    )
  },
  {
    path: '/event-category',
    meta: {
      breadcrumb: false,
      title: 'Event Category',
      entity: 'EventCategory', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'EventCategory',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/EventCategory/View.vue'
    )
  },
  {
    path: '/event-sub-category',
    meta: {
      breadcrumb: false,
      title: 'Event Sub Category',
      entity: 'EventSubCategory', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'EventSubCategory',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/EventSubCategory/View.vue'
    )
  },

  {
    path: '/event-setting',
    meta: {
      breadcrumb: false,
      title: 'Event Setting',
      entity: 'EventSetting', // swagger gen
      itemKey: 'default_timezone' // swagger gen
    },
    name: 'EventSetting',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/EventSetting/View.vue'
    )
  },
  //
  {
    path: '/document-template',
    meta: {
      breadcrumb: false,
      title: 'Document Templates',
      entity: 'DocumentTemplate', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'DocumentTemplate',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/DocumentTemplate/View.vue'
    )
  },
  {
    path: '/signatures',
    meta: {
      breadcrumb: false,
      title: 'Signatures',
      entity: 'Signature', // swagger gen
      itemKey: 'signature' // swagger gen
    },
    name: 'Signature',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Signature/View.vue'
    )
  },

  {
    path: '/transactions',
    meta: {
      breadcrumb: false,
      title: 'Transactions',
      entity: 'Transaction', // swagger gen
      itemKey: '_id' // swagger gen
    },
    name: 'Transaction',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Transaction/View.vue'
    )
  },
  {
    path: '/stages',
    meta: {
      breadcrumb: false,
      title: 'Stages',
      entity: 'Stage', // swagger gen
      itemKey: 'label' // swagger gen
    },
    name: 'Stage',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Stage/View.vue'
    )
  },
  {
    path: '/wallets',
    meta: {
      breadcrumb: false,
      title: 'Wallets',
      entity: 'Wallet', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'Wallet',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Wallet/View.vue'
    )
  },
  {
    path: '/invoice-terms',
    meta: {
      breadcrumb: false,
      title: 'Invoice Terms',
      entity: 'InvoiceTerm', // swagger gen
      itemKey: 'label' // swagger gen
    },
    name: 'InvoiceTerm',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/InvoiceTerm/View.vue'
    )
  },
  {
    path: '/invoice',
    meta: {
      breadcrumb: false,
      title: 'Invoices',
      entity: 'Invoice', // swagger gen
      itemKey: 'invoice_number' // swagger gen
    },
    name: 'Invoice',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Invoice/View.vue'
    )
  },
  {
    path: '/goodies',
    meta: {
      breadcrumb: false,
      title: 'Goodies - Products and Services',
      entity: 'Good', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'Good',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Good/View.vue'
    )
  },
  {
    path: '/finance-category',
    meta: {
      breadcrumb: false,
      title: 'Finance Category',
      entity: 'FinanceCategory', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'FinanceCategory',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/FinanceCategory/View.vue'
    )
  },
  {
    path: '/finance-sub-category',
    meta: {
      breadcrumb: false,
      title: 'Finance Sub Category',
      entity: 'FinanceSubCategory', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'FinanceSubCategory',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/FinanceSubCategory/View.vue'
    )
  },
  {
    path: '/finance-late-fee',
    meta: {
      breadcrumb: false,
      title: 'Finance Late Fee',
      entity: 'FinanceLateFee', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'FinanceLateFee',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/FinanceLateFee/View.vue'
    )
  },

  {
    path: '/expenses',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Expenses'
    },
    name: 'Expenses',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Expenses.vue'
    )
  },
  {
    path: '/statement/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Statement'
    },
    name: 'Statement',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Statements/Statement.vue'
    )
  },
  {
    path: '/statements',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Statements'
    },
    name: 'Statements',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Statements/Statements.vue'
    )
  },
  {
    path: '/statements-client/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Statements Client'
    },
    name: 'StatementsClient',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Statements/StatementsClient.vue'
    )
  },
  {
    path: '/items',
    meta: {
      breadcrumb: false,
      title: 'Finance Items - Products and Services',
      entity: 'Good', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'Items',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Finance/Items.vue'
    )
  },

  {
    path: '/task-status',
    meta: {
      breadcrumb: false,
      title: 'TaskStatus',
      entity: 'TaskStatus', // swagger gen
      itemKey: 'status' // swagger gen
    },
    name: 'TaskStatus',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/TaskStatus/View.vue'
    )
  },

  {
    path: '/tasks',
    meta: {
      breadcrumb: false,
      title: 'Your Tasks'
    },
    name: 'Tasks',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Tasks/Tasks.vue'
    )
  },
  {
    path: '/tasks-list/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Tasks List'
    },
    name: 'TasksList',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Tasks/TasksList.vue'
    )
  },
  {
    path: '/tasks-details/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Tasks Details'
    },
    name: 'TasksDetails',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Tasks/TasksDetails.vue'
    )
  },
  {
    path: '/tasks-reference',
    meta: {
      breadcrumb: false,
      title: 'Your Tasks Reference'
    },
    name: 'TasksReference',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Tasks/TasksReference.vue'
    )
  },
  {
    path: '/tasks-view/case/:case/group/:group',
    meta: {
      breadcrumb: false,
      title: 'Tasks View'
    },
    name: 'TaskView',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Tasks/TaskView.vue'
    )
  },
  {
    path: '/sub-tasks-view/case/:case/group/:group/task/:task/phase/:phase',
    meta: {
      breadcrumb: false,
      title: 'Sub Tasks View'
    },
    name: 'SubTaskView',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Tasks/SubTaskView.vue'
    )
  },
  {
    path: '/program-add',
    meta: {
      breadcrumb: false,
      title: 'Program Creation'
    },
    name: 'ProgramAdd',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Programs/ProgramAdd.vue'
    )
  },
  {
    path: '/documents',
    meta: {
      breadcrumb: false,
      title: 'Your Documents'
    },
    name: 'Documents',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Documents/Documents.vue'
    )
  },
  {
    path: '/training-events',
    meta: {
      breadcrumb: false,
      title: 'Your Training & Events'
    },
    name: 'TrainingEvents',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/TrainingEvents/TrainingEvents.vue'
    )
  },
  {
    path: '/events-purchase/:id',
    meta: {
      breadcrumb: false,
      title: 'Events Purchase'
    },
    name: 'EventsPurchase',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/TrainingEvents/EventsPurchase.vue'
    )
  },
  {
    path: '/events-view/:id',
    meta: {
      breadcrumb: false,
      title: 'Events View'
    },
    name: 'EventsView',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/TrainingEvents/EventsView.vue'
    )
  },
  {
    path: '/events-rsvp/:id',
    meta: {
      breadcrumb: false,
      title: 'Events RSVP'
    },
    name: 'EventsRSVP',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/TrainingEvents/EventsRSVP.vue'
    )
  },
  {
    path: '/resources',
    meta: {
      breadcrumb: false,
      title: 'Your Resources'
    },
    name: 'Resources',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Resources/Resources.vue'
    )
  },
  {
    path: '/caseworker',
    meta: {
      breadcrumb: false,
      title: 'Your Caseworker'
    },
    name: 'Caseworker',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Caseworker/Caseworker.vue'
    )
  },
  {
    path: '/reports',
    meta: {
      breadcrumb: false,
      title: 'Your Reports'
    },
    name: 'Reports',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Reports/Reports.vue'
    )
  },
  {
    path: '/configuration',
    meta: {
      breadcrumb: false,
      title: 'Your Configuration'
    },
    name: 'Configuration',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Configuration/Configuration.vue'
    )
  },
  {
    path: '/entity-manager',
    meta: {
      breadcrumb: false,
      title: 'Your Entity Manager'
    },
    name: 'EntityManager',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/EntityManager/EntityManager.vue'
    )
  },
  {
    path: '/help',
    meta: {
      breadcrumb: false,
      title: 'Your Help'
    },
    name: 'Help',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Help/Help.vue'
    )
  },
  {
    path: '/account',
    meta: {
      breadcrumb: false,
      title: 'Your Account'
    },
    name: 'Account',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Account/Account.vue'
    )
  },
  {
    path: '/account-info',
    meta: {
      breadcrumb: false,
      title: 'Your Account Info'
    },
    name: 'AccountInfo',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Account/AccountInfo.vue'
    )
  },
  {
    path: '/account-preference',
    meta: {
      breadcrumb: false,
      title: 'Your Account Preference'
    },
    name: 'AccountPreference',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Account/AccountPreference.vue'
    )
  },
  {
    path: '/account-dashboard',
    meta: {
      breadcrumb: false,
      title: 'Dashboard Configuration'
    },
    name: 'AccountDashboard',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Account/AccountDashboard.vue'
    )
  },
  {
    path: '/account-relationships',
    meta: {
      breadcrumb: false,
      title: 'Your Account Relationships'
    },
    name: 'AccountRelationships',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Account/AccountRelationships.vue'
    )
  },
  {
    path: '/account-security',
    meta: {
      breadcrumb: false,
      title: 'Your Account Security'
    },
    name: 'AccountSecurity',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Account/AccountSecurity.vue'
    )
  },
  {
    path: '/account-references',
    meta: {
      breadcrumb: false,
      title: 'Your Account References'
    },
    name: 'AccountReferences',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Account/AccountReferences.vue'
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
    path: '/users-listing',
    meta: {
      breadcrumb: false,
      title: 'User Listing'
    },
    name: 'UsersListing',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Users/UsersListing.vue'
    )
  },
  {
    path: '/user-details/:id',
    meta: {
      breadcrumb: false,
      title: 'User Details'
    },
    name: 'UserDetails',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Users/User.vue'
    )
  },
  // {
  //   path: '/case-notes',
  //   meta: {
  //     breadcrumb: false,
  //     title: 'Case Notes'
  //   },
  //   name: 'CaseNotes',
  //   component: () => import(
  //     /* webpackChunkName: "routes" */
  //     /* webpackMode: "lazy-once" */
  //     `@/pages/Finance/CaseNotes/CaseNotes.vue`
  //   )
  // },
  {
    path: '/case-notes',
    meta: {
      breadcrumb: false,
      title: 'Case Notes'
    },
    name: 'CaseNotes',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Case/CaseNotes.vue'
    )
  },
  {
    path: '/case-note-create',
    meta: {
      breadcrumb: false,
      title: 'Create Case Note'
    },
    name: 'CaseNotesCreate',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Case/CaseNotesCreate.vue'
    )
  },

  {
    path: '/cases',
    meta: {
      breadcrumb: false,
      title: 'Cases',
      entity: 'Case', // swagger gen
      itemKey: 'display_name' // swagger gen
    },
    name: 'Case',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Case/View.vue'
    ),
    props: (route) => ({ query: route.params })
  },
  {
    path: '/case',
    meta: {
      breadcrumb: false,
      title: 'Cases',
      entity: 'Case', // swagger gen
      itemKey: 'display_name' // swagger gen
    },
    name: 'Cases',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Case/Case.vue'
    ),
    props: (route) => ({ query: route.params })
  },
  {
    path: '/case-create',
    meta: {
      breadcrumb: false,
      title: 'Create a new Case',
      entity: 'Case', // swagger gen
      itemKey: 'display_name' // swagger gen
    },
    name: 'CaseCreate',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Case/CaseCreate.vue'
    ),
    props: (route) => ({ query: route.params })
  },
  {
    path: '/case-edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Case Edit',
      entity: 'Case', // swagger gen
      itemKey: 'display_name' // swagger gen
    },
    name: 'CaseEdit',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Case/CaseEdit.vue'
    ),
    props: (route) => ({ query: route.params })
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
  },
  
  {
    path: '/task-',
    meta: {
      breadcrumb: false,
      title: 'Tasks',
      entity: 'Task', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'Task',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Task/View.vue'
    )
  },
  {
    path: '/tasks-group/:id',
    meta: {
      breadcrumb: false,
      title: 'Tasks Group',
      entity: 'TaskGroup', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'TasksGroup',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Tasks/TasksGroup.vue'
    )
  },
  {
    path: '/tasks-sub-group/:id',
    meta: {
      breadcrumb: false,
      title: 'Tasks Subgroup',
      entity: 'TaskSubGroup', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'TasksSubGroup',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Tasks/TasksSubGroup.vue'
    )
  },
  {
    path: '/my-cases',
    meta: {
      breadcrumb: false,
      title: 'My Cases',
      entity: 'Case', // swagger gen
      itemKey: 'display_name' // swagger gen
    },
    name: 'MyCases',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyCases/MyCases.vue'
    ),
    props: (route) => ({ query: route.params })
  },
  {
    path: '/my-cases/case/:id',
    meta: {
      breadcrumb: false,
      title: 'Cases View',
      entity: 'Case', // swagger gen
      itemKey: 'display_name' // swagger gen
    },
    name: 'MyCaseView',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyCases/Case.vue'
    ),
    props: true
    // props: (route) => ({ query: route.params })
  },
  {
    path: '/case-view/:id',
    meta: {
      breadcrumb: false,
      title: 'Cases View',
      entity: 'Case', // swagger gen
      itemKey: 'display_name' // swagger gen
    },
    name: 'CaseView',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Case/CaseView.vue'
    ),
    props: (route) => ({ query: route.params })
  },
  {
    path: '/my-Family',
    meta: {
      breadcrumb: false,
      title: 'My Family',
      entity: 'Family', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'MyFamily',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFamily/MyFamily.vue'
    ),
    props: (route) => ({ query: route.params })
  },
  {
    path: '/my-finance',
    meta: {
      breadcrumb: false,
      title: 'My Finance'
    },
    name: 'MyFinance',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Finance.vue'
    )
  },
  {
    path: '/my-finance/invoices',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Invoices'
    },
    name: 'MyInvoices',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Invoices/Invoices.vue'
    )
  },
  {
    path: '/my-finance/invoices-client/:id',
    meta: {
      breadcrumb: false,
      title: 'Finance - Client Invoices'
    },
    name: 'MyInvoicesClient',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Invoices/InvoicesClient.vue'
    )
  },
  {
    path: '/my-finance/payments-client/:id',
    meta: {
      breadcrumb: false,
      title: 'Finance - Client Payments'
    },
    name: 'MyPaymentsClient',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Payments/PaymentsClient.vue'
    )
  },
  {
    path: '/my-finance/customer-invoices/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Customer Invoices'
    },
    name: 'MyInvoicesCustomer',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Invoices/InvoicesCustomer.vue'
    )
  },
  {
    path: '/my-finance/invoice/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Invoice'
    },
    name: 'MyInvoiceView',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Invoices/InvoiceView.vue'
    )
  },
  {
    path: '/my-finance/invoice-payment/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Invoice Payment'
    },
    name: 'MyInvoicePayment',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Invoices/InvoicePayment.vue'
    )
  },
  {
    path: '/my-finance/invoice-create',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Create Invoice'
    },
    name: 'MyInvoicesCreate',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Invoices/InvoicesCreate.vue'
    )
  },
  {
    path: '/my-finance/invoice-edit/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Edit Invoice'
    },
    name: 'MyInvoicesEdit',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Invoices/InvoicesEdit.vue'
    )
  },
  {
    path: '/my-finance/payments',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Payments'
    },
    name: 'MyPayments',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Payments/Payments.vue'
    )
  },
  {
    path: '/my-finance/Payment/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Payment'
    },
    name: 'MyPaymentView',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Payments/PaymentsView.vue'
    )
  },
  {
    path: '/my-finance/summary/:id',
    meta: {
      breadcrumb: false,
      title: 'Finance - Summary'
    },
    name: 'MySummary',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Summary.vue'
    )
  },
  {
    path: '/my-finance/expenses',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Expenses'
    },
    name: 'MyExpenses',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Expenses.vue'
    )
  },
  {
    path: '/my-finance/statement/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Statement'
    },
    name: 'MyStatement',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Statements/Statement.vue'
    )
  },
  {
    path: '/my-finance/statements',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Statements'
    },
    name: 'MyStatements',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Statements/Statements.vue'
    )
  },
  {
    path: '/my-finance/statements-client/:id',
    meta: {
      breadcrumb: false,
      title: 'Your Finance - Statements Client'
    },
    name: 'MyStatementsClient',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Statements/StatementsClient.vue'
    )
  },
  {
    path: '/my-finance/items',
    meta: {
      breadcrumb: false,
      title: 'Finance Items - Products and Services',
      entity: 'Good', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'MyItems',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/MyFinance/Items.vue'
    )
  },
  {
    path: '/organizations',
    meta: {
      breadcrumb: false,
      title: 'Organizations Dashboard',
      entity: 'Organization', // swagger gen
      itemKey: 'name' // swagger gen
    },
    name: 'Organizations',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Organizations/Organizations.vue'
    )
  },

  // {
  //   path: '/calendar',
  //   meta: { breadcrumb: true },
  //   name: 'Calendar',
  //   component: (a) => import(
  //     /* webpackChunkName: "routes" */
  //     /* webpackMode: "lazy-once" */
  //     `@/pages/Calendar.vue`
  //   )
  // },
  {
    path: '/media',
    meta: { },
    name: 'Media',
    props: (route) => ({ type: route.query.type }),
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Media.vue'
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
    path: '/FormBuilder',
    meta: {
      public: true
    },
    name: 'FormBuilder',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/components/FormBuilder/Layout.vue'
    )
  },
  {
    path: '/components/alert',
    meta: { breadcrumb: true },
    name: 'components/alerts',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Alert.vue'
    )
  },
  {
    path: '/components/avatar',
    meta: { breadcrumb: true },
    name: 'components/avatars',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Avatar.vue'
    )
  },
  {
    path: '/components/badge',
    meta: { breadcrumb: true },
    name: 'components/badges',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Badge.vue'
    )
  },
  {
    path: '/components/button',
    meta: { breadcrumb: true },
    name: 'components/buttons',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Button.vue'
    )
  },
  {
    path: '/components/parallax',
    meta: { breadcrumb: true },
    name: 'components/parallax',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Parallax.vue'
    )
  },
  {
    path: '/components/snackbar',
    meta: { breadcrumb: true },
    name: 'components/snackbar',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Snackbar.vue'
    )
  },
  {
    path: '/components/chip',
    meta: { breadcrumb: true },
    name: 'components/chips',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Chip.vue'
    )
  },
  {
    path: '/components/card',
    meta: { breadcrumb: true },
    name: 'components/cards',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Cards.vue'
    )
  },
  {
    path: '/components/table',
    meta: { breadcrumb: true },
    name: 'components/tables',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Tables.vue'
    )
  },
  {
    path: '/components/carousel',
    meta: { breadcrumb: true },
    name: 'components/carousels',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Carousels.vue'
    )
  },
  {
    path: '/components/dialog',
    meta: { breadcrumb: true },
    name: 'components/dialogs',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Dialogs.vue'
    )
  },
  {
    path: '/components/icon',
    meta: { breadcrumb: true },
    name: 'components/icons',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Icon.vue'
    )
  },
  {
    path: '/components/progress',
    meta: { breadcrumb: true },
    name: 'components/progress',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Progress.vue'
    )
  },
  {
    path: '/components/slider',
    meta: { breadcrumb: true },
    name: 'components/sliders',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Slider.vue'
    )
  },
  {
    path: '/components/tooltip',
    meta: { breadcrumb: true },
    name: 'components/tooltips',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Tooltip.vue'
    )
  },
  {
    path: '/components/pagination',
    meta: { breadcrumb: true },
    name: 'components/paginations',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Pagination.vue'
    )
  },
  {
    path: '/pickers/datepicker',
    meta: { breadcrumb: true },
    name: 'pickers/datepicker',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Datepicker.vue'
    )
  },
  {
    path: '/components/typography',
    meta: { breadcrumb: true },
    name: 'components/typography',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Typography.vue'
    )
  },
  {
    path: '/components/color',
    meta: { breadcrumb: true },
    name: 'components/color',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Colors.vue'
    )
  },
  {
    path: '/pickers/timepicker',
    meta: { breadcrumb: true },
    name: 'pickers/timepicker',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/ui/Timepicker.vue'
    )
  },
  {
    path: '/layout/bottomsheets',
    meta: { breadcrumb: true },
    name: 'components/bottom-sheets',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/layout/BottomSheets.vue'
    )
  },
  {
    path: '/layout/expansion-panel',
    meta: { breadcrumb: true },
    name: 'components/expansion-panels',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/layout/ExpansionPanels.vue'
    )
  },
  {
    path: '/layout/footer',
    meta: { breadcrumb: true },
    name: 'components/footer',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/layout/Footers.vue'
    )
  },
  {
    path: '/layout/timeline',
    meta: { breadcrumb: true },
    name: 'components/timeline',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/layout/Timeline.vue'
    )
  },
  {
    path: '/layout/list',
    meta: { breadcrumb: true },
    name: 'components/lists',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/layout/Lists.vue'
    )
  },
  {
    path: '/layout/toolbar',
    meta: { breadcrumb: true },
    name: 'components/toolbar',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/layout/Toolbar.vue'
    )
  },
  {
    path: '/layout/jumbotron',
    meta: { breadcrumb: true },
    name: 'components/jumbotrons',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/layout/Jumbotrons.vue'
    )
  },
  {
    path: '/layout/menu',
    meta: { breadcrumb: true },
    name: 'components/menus',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/layout/Menus.vue'
    )
  },
  {
    path: '/layout/navigation-drawer',
    meta: { breadcrumb: true },
    name: 'components/navigation-drawers',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/layout/NavigationDrawers.vue'
    )
  },
  {
    path: '/layout/tabs',
    meta: { breadcrumb: true },
    name: 'components/tabs',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/layout/Tabs.vue'
    )
  },
  // {
  //   path: '/forms/basic',
  //   meta: { breadcrumb: true },
  //   name: 'components/basic-forms',
  //   component: () => import(
  //     /* webpackChunkName: "routes" */
  //     /* webpackMode: "lazy-once" */
  //     `@/pages/form/BasicForms.vue`
  //   )
  // },
  // {
  //   path: '/forms/selects',
  //   meta: { breadcrumb: true },
  //   name: 'components/selects',
  //   component: () => import(
  //     /* webpackChunkName: "routes" */
  //     /* webpackMode: "lazy-once" */
  //     `@/pages/form/Selects.vue`
  //   )
  // },
  // {
  //   path: '/forms/editor',
  //   meta: { breadcrumb: true },
  //   name: 'components/editors',
  //   component: () => import(
  //     /* webpackChunkName: "routes" */
  //     /* webpackMode: "lazy-once" */
  //     `@/pages/form/Editors.vue`
  //   )
  // },
  // {
  //   path: '/forms/selection-controls',
  //   meta: { breadcrumb: true },
  //   name: 'components/selection-controls',
  //   component: () => import(
  //     /* webpackChunkName: "routes" */
  //     /* webpackMode: "lazy-once" */
  //     `@/pages/form/SelectionControls.vue`
  //   )
  // },
  // {
  //   path: '/forms/text-fields',
  //   meta: { breadcrumb: true },
  //   name: 'components/text-fields',
  //   component: () => import(
  //     /* webpackChunkName: "routes" */
  //     /* webpackMode: "lazy-once" */
  //     `@/pages/form/TextFields.vue`
  //   )
  // },
  // {
  //   path: '/forms/steppers',
  //   meta: { breadcrumb: true },
  //   name: 'components/steppers',
  //   component: () => import(
  //     /* webpackChunkName: "routes" */
  //     /* webpackMode: "lazy-once" */
  //     `@/pages/form/Steppers.vue`
  //   )
  // },
  {
    path: '/widgets/social',
    meta: { breadcrumb: true },
    name: 'components/social',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/widgets/Social.vue'
    )
  },
  {
    path: '/widgets/post',
    meta: { breadcrumb: true },
    name: 'components/widget-post',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/widgets/Post.vue'
    )
  },
  {
    path: '/widgets/statistic',
    meta: { breadcrumb: true },
    name: 'components/statistic',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/widgets/Statistic.vue'
    )
  },
  {
    path: '/widgets/chart',
    meta: { breadcrumb: true },
    name: 'components/chart',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/widgets/Chart.vue'
    )
  },
  {
    path: '/widgets/list',
    meta: { breadcrumb: true },
    name: 'components/widget-list',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/widgets/List.vue'
    )
  }
]
