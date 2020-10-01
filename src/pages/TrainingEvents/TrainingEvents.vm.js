/* global session */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'TrainingEvents',
  data: () => ({
    start: '2019-04-02',
    startMenu: false,
    today: '2019-01-08',
    type: 'month',
    end: '2019-01-06',
    events: [
      {
        title: 'Vacation',
        details: 'Going to the beach!',
        date: '2019-04-30',
        open: false
      },
      {
        title: 'Vacation',
        details: 'Going to the beach!',
        date: '201-04-31',
        open: false
      },
      {
        title: 'The challenges of motherhood',
        details: 'Going to the beach!',
        date: '2019-04-01',
        open: false
      },
      {
        title: 'Meeting',
        details: 'Spending time on how we do not have enough time',
        date: '2019-04-07',
        open: false
      },
      {
        title: 'First-time parents',
        details: 'Celebrate responsibly',
        date: '2019-04-03',
        open: false
      },
      {
        title: 'Conference',
        details: 'Mute myself the whole time and wonder why I am on this call',
        date: '2019-04-21',
        open: false
      },
      {
        title: 'Hackathon',
        details: 'Code like there is no tommorrow',
        date: '2019-04-01',
        open: false
      }
    ]
  }),
  computed: {
    // convert the list of events into a map of lists keyed by date
    eventsMap () {
      const map = {};
      // eslint-disable-next-line no-return-assign
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e));
      return map;
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!session.isOnline())
    {
      // return;
      next({ path: '/login' });
    }
    else
    {
      next();
    }
  },
  methods: {
    open (event) {
      alert(event.title);
    }
  }
};
