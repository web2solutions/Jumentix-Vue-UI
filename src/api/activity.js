
const Items =   [

  {
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGqLx7wMSo52wlsR6Z-wSojQce5u7qiQnnMA&usqp=CAU',
    timeString: 'Just now',
    color: 'primary',
    text: 'Michael finished  one task just now.'
  },
  {
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnlwn0zWYxGemFG6uiE_I2Huf0014n2VNvWg&usqp=CAU',
    timeString: '30 min ago',
    color: 'teal',
    text: 'Jim created a new  task.'
  },
  {
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_OaPA7drGndqjDmxDyDgWkdC0LaelKp-EZg&usqp=CAU',
    timeString: '1 hour ago',
    color: 'indigo',
    text: 'Li completed the PSD to html convert.'
  },
  {
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKT57havtBtcZuS9y0hs6E11W9KHINVQytQ&usqp=CAU',
    timeString: '3 hour ago',
    color: 'pink',
    text: 'Michael upload a new pic.'
  },
  {
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2OrIDKQCWglckcgRWp33lt7TRQII-KOJdVQ&usqp=CAU',
    timeString: '10 min ago',
    color: 'cyan',
    text: 'Li assigned a a task to Michael'
  },

];

const getActivity = (limit) => {
  return (limit) ? Items.slice(0, limit) : Items;
};


export default {
  getActivity
};
