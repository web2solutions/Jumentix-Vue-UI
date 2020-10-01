export default [
  {
    name: 'APP_LOGIN_SUCCESS',
    callback: function (e) {
      this.$router.push({ path: 'dashboard' });
    }
  },
  {
    name: 'APP_LOGOUT',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Logout successfully.'
      };
      this.$router.replace({ path: '/login' });
    }
  },
  {
    name: 'APP_PAGE_LOADED',
    callback: function (e) {
    }
  },
  {
    name: 'APP_AUTH_FAILED',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Token has expired'
      };
      this.$router.replace({ path: '/login' });
      // this.$router.push('/login');
      // this.$message.error('Token has expired');
    }
  },
  {
    name: 'APP_LOGIN_FAILED',
    callback: function (msg) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: msg
      };
    }
  },
  {
    name: 'APP_BAD_REQUEST',
    // @error api response data
    callback: function (msg) {
      // this.$message.error(msg);
      this.snackbar = {
        show: true,
        color: 'red',
        text: msg
      };
    }
  },
  {
    name: 'APP_NAVIGATE',
    // @error api response data
    callback: function (url) {
      // this.$message.error(msg);
      this.$router.push(url);
    }
  },
  {
    name: 'APP_ACCESS_DENIED',
    // @error api response data
    callback: function (msg) {
      this.$message.error(msg);
      this.$router.push('/forbidden');
    }
  },
  {
    name: 'GO_ACCOUNT',
    // @error api response data
    callback: function (msg) {
      this.$router.push('account-info');
    }
  },
  
  {
    name: 'APP_RESOURCE_DELETED',
    // @error api response data
    callback: function (msg) {
      this.$message.success(msg);
    }
  },
  {
    name: 'APP_RESOURCE_UPDATED',
    // @error api response data
    callback: function (msg) {
      this.$message.success(msg);
    }
  },

];
