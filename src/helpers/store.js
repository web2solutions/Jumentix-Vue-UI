/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        session: {},
        swagger: {},
        online_users: [],
        announcements: [],
        setup: {},
        modules: {
            Messages: {
                _total: 0,
                box_type: 'INBOX',
                t_inbox: 0,
                t_sent: 0,
                t_archinbox: 0,
                t_archsent: 0,
                inbox_messages: []
            },
        },
        FormBuilder: {
            selectedField: false
        }
    },
    mutations: {
        modulesMessagesSetTotal(state, n) {
            state.modules.Messages._total  = n;
            if( state.modules.Messages.box_type === 'INBOX' ) state.modules.Messages.t_inbox  = n;
            if( state.modules.Messages.box_type === 'SENT' ) state.modules.Messages.t_sent  = n;
            if( state.modules.Messages.box_type === 'ARCHINBOX' ) state.modules.Messages.t_archinbox  = n;
            if( state.modules.Messages.box_type === 'ARCHSENT' ) state.modules.Messages.t_archsent  = n;
        },
        modulesMessagesSetTotalInbox(state, n) {
            state.modules.Messages.t_inbox  = n;
            state.modules.Messages._total  = n;
        },
        modulesMessagesSetTotalSent(state, n) {
            state.modules.Messages.t_sent  = n;
            state.modules.Messages._total  = n;
        },
        modulesMessagesSetTotalArchInbox(state, n) {
            state.modules.Messages.t_archinbox  = n;
            state.modules.Messages._total  = n;
        },
        modulesMessagesSetTotalArchSent(state, n) {
            state.modules.Messages.t_archsent  = n;
            state.modules.Messages._total  = n;
        },
        modulesMessagesBoxType(state, t) {
            state.modules.Messages.box_type  = t;
        },
        modulesMessagesSetInboxMessages(state, msgs) {
            msgs.forEach( msg => {
                state.modules.Messages.inbox_messages.push( msg );
            } );
        },
        modulesMessagesSetInbox(state, msgs) {
            msgs.forEach( msg => {
                state.modules.Messages.inbox_messages.push( msg );
            } );
        },
        setSession(state, session) {
            state.session  = session;
        },
        setSwagger(state, swagger) {
            state.swagger  = swagger;
        },
        setOnlineUsers(state, users) {
            state.online_users = users;
        },
        addAgencyAnouncement(state, msg) {
          let found = false;
          console.log(msg.uuid)
          for( let index in state.announcements )
          {
            console.log(state.announcements[index].uuid);
            if(state.announcements[index].uuid === msg.uuid)
            {
              found = true;
              break
            } 
          }
          if(!found) state.announcements.unshift( msg );
        },
        setSetup(state, setup) {
            state.setup = setup;
        },
        fmSetSelectedField(state, field) {
            console.warn('fmSetSelectedField', field)
            state.FormBuilder.selectedField  = field;
        },
    }
})
