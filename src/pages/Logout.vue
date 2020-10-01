<template>
  <v-app id="logout">
  </v-app>
</template>
<script>
/* global session, $t, MessageMediatorClient */
export default {
  created () {
    session.logout();
  }
};
</script>
