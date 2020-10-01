const Tasks =   [

  {
    status: 'In-Progress',
    color: 'blue',
    icon: 'fas fa-spinner',
    comments: [],
    description: 'Please print and download the child abuse document and get it notorized by a local notary',
    worker: false
  },
  {
    status: 'Open',
    color: 'blue',
    // icon: 'radio_button_unchecked',
    comments: [],
    description: 'Send notarized document to circuit court',
    worker: true
  },
  {
    status: 'Completed',
    color: 'green',
    icon: 'fas fa-check-circle',
    comments: ['1', '2'],
    description: 'Upload a copy of the notorized child abuse document.',
    worker: false
  },
  {
    status: 'Under Review',
    icon: 'fas fa-clipboard-list',
    color: 'orange',
    comments: [1, 2, 3],
    description: 'Please complete the financial statement',
    worker: false
  },
  {
    status: 'Need Attention',
    color: 'red',
    icon: 'error',
    comments: ['1', 2],
    description: 'Send notarized document to circuit court',
    worker: true
  }

];

const getTaskByStatus = (status) => {
  return (status === 'All') ? Tasks : Tasks.filter(x => x.status === status);
};
const getTaskWorker = (status) => {
  return Tasks.filter(x => x.worker === true);
};

export default Tasks;

export {
  Tasks,
  getTaskByStatus,
  getTaskWorker
};
