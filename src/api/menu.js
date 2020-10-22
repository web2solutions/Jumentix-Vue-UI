const Menu = [{
  title: 'Dashboard',
  // group: 'apps',
  icon: 'dashboard',
  name: 'Dashboard',
  roles: ['*']
}, {
  divider: true,
  roles: ['admin', 'agency']
}, {
  title: 'Configuration',
  group: 'configuration_management',
  // component: 'widgets',
  icon: 'widgets',
  items: [/* {
    name: 'CaseStatus',
    icon: 'widgets',
    badge: 'new',
    title: 'Case Statuses',
    component: 'CaseStatus',
    roles: ['admin', 'agency']
  }, {
    name: 'CaseNoteType',
    icon: 'widgets',
    badge: 'new',
    title: 'Case Note Types',
    component: 'CaseNoteType',
    roles: ['admin', 'agency']
  }, {
    name: 'CaseType',
    icon: 'widgets',
    badge: 'new',
    title: 'Case Types',
    component: 'CaseType',
    roles: ['admin', 'agency']
  }, {
    name: 'Family',
    icon: 'widgets',
    badge: 'new',
    title: 'Family',
    component: 'Family',
    roles: []
  }, */{
      name: 'Human',
      icon: 'widgets',
      badge: 'new',
      title: 'People',
      component: 'Human',
      roles: ['admin', 'agency']
    }, {
      name: 'User',
      icon: 'widgets',
      badge: 'new',
      title: 'System Accounts',
      component: 'User',
      roles: ['admin', 'agency']
    }/* , {
    name: 'Program',
    icon: 'widgets',
    badge: 'new',
    title: 'Programs',
    component: 'Program',
    roles: ['admin', 'agency']
  }, {
    name: 'Phase',
    icon: 'widgets',
    badge: 'new',
    title: 'Phases',
    component: 'Phase',
    roles: ['admin', 'agency']
  }, {
    name: 'Group',
    icon: 'widgets',
    badge: 'new',
    title: 'Groups',
    component: 'Group',
    roles: ['admin', 'agency']
  }, {
    name: 'Role',
    icon: 'widgets',
    badge: 'new',
    title: 'Roles',
    component: 'Role',
    roles: ['admin', 'agency']
  }, {
    name: 'SubRole',
    icon: 'widgets',
    badge: 'new',
    title: 'Sub Roles',
    component: 'SubRole',
    roles: ['admin', 'agency']
  }, {
    name: 'Setup',
    icon: 'widgets',
    badge: 'new',
    title: 'System Setup',
    component: 'Setup',
    roles: ['admin']
  } */],
  roles: []
}, {
  divider: true,
  roles: []
}, {
  title: 'Users',
  // group: 'apps',
  icon: 'fas fa-users-cog',
  name: 'User',
  roles: []
}, {
  title: 'Entity Manager',
  // group: 'apps',
  icon: 'business',
  name: 'EntityManager',
  roles: ['OFF']
}, /* , {
  title: 'Contact',
  icon: 'people_outline',
  name: 'ContactsDashboard',
  roles: ['staff', 'admin', 'manager', 'caseworker', 'agency']
}, {
  title: 'My Family',
  // group: 'apps',
  icon: 'fas fa-users',
  name: 'MyFamily',
  roles: ['parent', 'child']
}, {
  title: 'My Cases',
  // group: 'apps',
  icon: 'insert_drive_file',
  name: 'MyCases',
  roles: ['parent', 'child']
} */ {
  title: 'My Finance',
  // group: 'apps',
  icon: 'local_atm',
  name: 'MyFinance',
  roles: []
}, {
  title: 'Finance',
  // group: 'apps',
  icon: 'local_atm',
  name: 'Finance',
  roles: []
}, /* {
  title: 'Cases',
  // group: 'apps',
  icon: 'insert_drive_file',
  name: 'Cases',
  roles: ['admin', 'manager', 'caseworker', 'agency', 'staff']
}, {
  name: 'Form',
  icon: 'widgets',
  badge: 'new',
  title: 'Forms',
  component: 'Form',
  roles: ['admin', 'agency']
}, {
  title: 'Tasks',
  // group: 'apps',
  icon: 'format_list_bulleted',
  name: 'Tasks',
  roles: ['admin', 'caseworker', 'manager', 'staff', 'agency']
}, {
  title: 'Programs',
  // group: 'apps',
  icon: 'format_list_bulleted',
  name: 'ProgramAdd',
  roles: ['admin', 'agency', 'manager']
}, {
  title: 'Groups',
  // group: 'apps',
  icon: 'fas fa-layer-group',
  name: 'Group',
  roles: ['admin', 'agency', 'manager']
}, */ {
  title: 'Surveys',
  // group: 'apps',
  icon: 'poll',
  name: 'Survey',
  roles: ['admin', 'agency', 'manager']
}, {
  title: 'Messages',
  // group: 'apps',
  name: 'Mail',
  icon: 'email',
  roles: ['OFF']
}, {
  title: 'Documents',
  // group: 'apps',
  icon: 'library_books',
  name: 'Documents',
  roles: ['OFF']
}, {
  title: 'Events',
  // group: 'apps',
  icon: 'fas fa-chalkboard-teacher',
  name: 'TrainingEvents',
  roles: []
}, {
  title: 'Resources',
  // group: 'apps',
  icon: 'library_books',
  name: 'Resources',
  roles: ['OFF']
}, {
  title: 'Reports',
  // group: 'apps',
  icon: 'report',
  name: 'Reports',
  roles: ['OFF']
}, {
  title: 'Caseworker',
  // group: 'apps',
  icon: 'settings',
  name: 'Caseworker',
  roles: ['OFF']
}, {
  title: 'Organizations',
  // group: 'apps',
  icon: 'business',
  name: 'Organizations',
  roles: []
}, {
  title: 'Account',
  // group: 'apps',
  icon: 'account_circle',
  name: 'Account',
  roles: ['OFF']
}, {
  title: 'Help',
  // group: 'apps',
  icon: 'help_outline',
  name: 'Help',
  roles: ['OFF']
}, {
  divider: true,
  roles: ['admin']
}, {
  header: 'Swagger based UI Elements',
  roles: ['admin']
}, {
  name: 'Human',
  icon: 'widgets',
  badge: 'new',
  title: 'People',
  component: 'Human',
  roles: ['admin', 'agency']
}, {
  name: 'User',
  icon: 'widgets',
  badge: 'new',
  title: 'System Accounts',
  component: 'User',
  roles: ['admin', 'agency']
}, {
  title: 'Chat',
  // group: 'apps',
  icon: 'chat_bubble',
  name: 'Chat',
  roles: []
}, {
  title: 'Logout',
  // group: 'apps',
  icon: 'exit_to_app',
  name: 'Logout',
  roles: ['*']
}]
// reorder menu
Menu.forEach((item) => {
  if (item.items) {
    item.items.sort((x, y) => {
      const textA = x.title.toUpperCase()
      const textB = y.title.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
  }
})

export default Menu
