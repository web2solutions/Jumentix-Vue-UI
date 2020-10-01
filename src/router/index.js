/* global session */
import Vue from 'vue';
import Router from 'vue-router';
import paths from './paths';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import session from '../helpers/session';
import store from '../helpers/store';
import Mediator from '../Mediator';

let isSetEvents = false;
let systemTables = [];

// start HELPER functions
async function updateUserSession (eventObj) {
  let $session = JSON.parse(JSON.stringify(session.getSession()));
  if (eventObj.data._id !== $session.user._id) return;
  let modifiedUser = JSON.parse(JSON.stringify(eventObj.data));
  let humanId = modifiedUser.human;
  // console.log('setting USER session based on document received from mediator', $session);
  // console.log('humanId', humanId);
  // console.log('modifiedUser', modifiedUser);
  try {
    let humanDocument = await Mediator.client.store.models.Human.get(humanId);
    // console.log('humanDocument', humanDocument);
    // see lib/auth/service/mw.service.js on back end
    modifiedUser.human = humanDocument;
    modifiedUser.id = modifiedUser._id;
    modifiedUser.name = humanDocument.first_name + ' ' + humanDocument.last_name;
    modifiedUser.user_email = modifiedUser.username;
    // modifiedUser.agency_id = 'aaaa'
    // modifiedUser.group_id = ''
    modifiedUser.photo = modifiedUser.avatar;
    modifiedUser.user_id = modifiedUser._id;
    modifiedUser.role = modifiedUser.roles[0];
    modifiedUser.user_type = modifiedUser.roles[0];
    $session.user = modifiedUser;
    store.commit('setSession', $session);
    session.setSession($session);
  } catch (e) {
    console.warn('session was not updated', e);
  }
}

async function updateHumanSession (eventObj) {
  let $session = JSON.parse(JSON.stringify(session.getSession()));
  if (eventObj.data._id !== $session.user.human._id) return;
  
  let humanDocument = eventObj.data;
  let userId = humanDocument.user;
  let modifiedUser = await Mediator.client.store.models.User.get(userId);
  let humanId = modifiedUser.human;
  // console.log('setting HUMAN session based on document received from mediator', $session);
  // console.log('modifiedUser', modifiedUser);
  // console.log('humanId', humanId);
  // console.log('humanDocument', humanDocument);
  // see lib/auth/service/mw.service.js on back end
  modifiedUser.human = humanDocument;
  modifiedUser.id = modifiedUser._id;
  modifiedUser.name = modifiedUser.human.first_name + ' ' + modifiedUser.human.last_name;
  modifiedUser.user_email = modifiedUser.username;
  // modifiedUser.agency_id = 'aaaa'
  // modifiedUser.group_id = ''
  modifiedUser.photo = modifiedUser.avatar;
  modifiedUser.user_id = modifiedUser._id;
  modifiedUser.role = modifiedUser.roles[0];
  modifiedUser.user_type = modifiedUser.roles[0];
  $session.user = modifiedUser;
  store.commit('setSession', $session);
  session.setSession($session);
}

async function dataSyncEventListener (eventObj) {
  console.log('------------>>> data:sync', eventObj);
  // console.log('eventObj.action', eventObj.action);
  if (eventObj.success) {
    if (eventObj.action === 'update' || eventObj.action === 'create' || eventObj.action === 'restore' || eventObj.action === 'delete' || eventObj.action === 'add_sub_document' || eventObj.action === 'edit_sub_document' || eventObj.action === 'delete_sub_document') {
      // console.log(Mediator.client.store);
      try {
        let newDocument = await Mediator.client.store.models[eventObj.entity].put(eventObj.data);
        // console.log(eventObj.entity, newDocument);
      } catch (e) {
        // console.log('error updating doc ', e);
      }

      if (eventObj.entity === 'User') {
        await updateUserSession(eventObj);
      } else if (eventObj.entity === 'Human') {
        await updateHumanSession(eventObj);
      }
    } else if (eventObj.action === 'delete_hard') {
      try {
        let newDocument = await Mediator.client.store.models[eventObj.entity].delete(eventObj.data._id);
        // console.log(eventObj.entity, newDocument);
      } catch (e) {
        // console.log('error deleting doc ', e);
      }
    }
  }
  // eventObj.action
  // eventObj.entity
  // eventObj.data
}

function setEvents (client) {
  if (isSetEvents) return;
  client.on('data:sync', dataSyncEventListener);

  client.on('agency:message:global:send', function (eventObj) {
    // console.log('agency:message:global:send');
    // console.log(eventObj);
    store.commit('addAgencyAnouncement', eventObj);
  });
  // this.client.destroyEvent( on_agencyGlobalMessageSendEvent );
  client.on('agency:message:global:receive', function (eventObj) {
    // console.log('agency:message:global:receive');
    // console.log(eventObj);
    store.commit('addAgencyAnouncement', eventObj);
  });



  isSetEvents = true;
}

// end HELPER functions

Vue.use(Router);

const router = new Router({
  base: '/',
  mode: 'hash',
  linkActiveClass: 'active',
  routes: paths
});

// router gards
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (session.isOnline()) {
    let $session = session.getSession();
    // console.log('router session', $session);
    
    if (!!store.state.swagger.info === false) {
      session.swagger({
        success: response => {
          store.commit('setSwagger', response);
          $session.swagger = response;
          Mediator.start($session, () => {
            // console.log(Mediator.client);
            setEvents(Mediator.client);
            store.commit('setSession', $session);
            next();
          });
        },
        error: (xhr, ajaxOptions, thrownError) => {
          Mediator.start($session, () => {
            // console.log(Mediator.client);
            setEvents(Mediator.client);
            store.commit('setSession', $session);
            next();
          });
        }
      });
    } else {
      Mediator.start($session, () => {
        // console.log(Mediator.client);
        setEvents(Mediator.client);
        store.commit('setSession', $session);
        next();
      });
    }
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  // ...
  NProgress.done();
  // console.log('router session.isOnline() ', session.isOnline());
  if (!session.isOnline()) {
    router.push('/login', () => {});
  }
});

export default router;
