const Projects =  [
  {
    username: 'Dessie',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGqLx7wMSo52wlsR6Z-wSojQce5u7qiQnnMA&usqp=CAU',
    name: 'Template PSD',
    deadline: '2 days later',
    progress: 90,
    color: 'pink',
  },
  {
    username: 'Jakayla',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnlwn0zWYxGemFG6uiE_I2Huf0014n2VNvWg&usqp=CAU', 
    name: 'Logo Design',
    deadline: '1 weeks later',
    progress: 70,
    color: 'success'
  },
  {
    username: 'Ludwiczakpawel',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_OaPA7drGndqjDmxDyDgWkdC0LaelKp-EZg&usqp=CAU',
    name: 'REST API',
    deadline: '1 Month later',
    progress: 50,
    color: 'info'
  },
  {
    username: 'Damenleeturks',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKT57havtBtcZuS9y0hs6E11W9KHINVQytQ&usqp=CAU',
    name: 'API Unit Test',
    deadline: '2 Month later',
    progress: 30,
    color: 'teal'
  },
  {
    username: 'Caspergrl',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2OrIDKQCWglckcgRWp33lt7TRQII-KOJdVQ&usqp=CAU',
    name: 'Project Deploy',
    deadline: 'half year later',
    progress: 15,
    color: 'grey'
  },

];

const getProject = (limit) => {
  return (limit) ? Projects.slice(0, limit) : Projects;
};


export {
  Projects,
  getProject
};
