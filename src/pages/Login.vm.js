/* global session, $t store */


export default
{
  props:
  {
    username:
    {
      type: String
    },
    password:
    {
      type: String
    },
    resetFn: Function
  },
  data: () => ({
    loading: false,
    what: 'login', // changePassword
    form:
    {
      username:
      {
        disabled: false,
        placeholder: 'Type the username',
        value: ''
      },
      password:
      {
        disabled: false,
        placeholder: 'Type the password',
        value: ''
      },
    },
    form2:
    {
      new_password:
      {
        disabled: false,
        placeholder: 'Type the new password',
        value: ''
      },
      confirm_password:
      {
        disabled: false,
        placeholder: 'Confirm the new password',
        value: ''
      },
    },
    model:
    {
      username: '',
      password: ''
    }
  }),
  computed: {
    swagger () {
      return this.store.state.swagger;
    }
  },
  methods: {
    updatePassword () {
      let scope = this;
      let new_password = scope.$refs.new_password.value.trim();
      let confirm_password = scope.$refs.confirm_password.value.trim();
      let sigInBtn = scope.$refs.sigInBtn;
      console.log(session.user());

      if (new_password.toString() !== confirm_password.toString()) {
        alert('New password and it confirmation does not match');
        return;
      }
      if (new_password.length < 6) {
        alert('Password need to have at least 6 chars.');
        return;
      }

      scope.loading = true;

      scope.form2.new_password.disabled = true;
      scope.form2.confirm_password.disabled = true;

      session.updatePassword({
        userId: session.user()._id,
        new_password,
        confirm_password,
        success: (response) =>
        {
          console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx', response);
          // scope.$router.push('/dashboard');

          scope.form.username.disabled = false;
          scope.form.password.disabled = false;
          scope.loading = false;

          scope.$router.push('/dashboard');
        },
        error: (err) =>
        {
          // alert(err);
          console.log(err);
          scope.form.username.disabled = false;
          scope.form.password.disabled = false;
          scope.loading = false;
        }
      });
    },
    login ()
    {
      let scope = this;
      let username = scope.$refs.username.value.trim();
      let password = scope.$refs.password.value.trim();
      let sigInBtn = scope.$refs.sigInBtn;
      scope.loading = true;
      // sigInBtn.loading = true;
      
      if (scope.rememberMe)
      {
        localStorage.setItem('username', username);
      }
      else
      {
        localStorage.setItem('username', '');
      }

      scope.form.username.disabled = true;
      scope.form.password.disabled = true;
      

      session.login({
        username,
        password,
        success: (sessionData) =>
        {
          
          console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx', sessionData);
          scope.store.commit('setSession', sessionData);
          // 
          // scope.loading = false;
          // sigInBtn.false
          

          if (sessionData.user.changePasswordNextLogin)
          {
            scope.what = 'changePassword';
            scope.loading = false;
            alert('You need to change your password');
          }
          else
          {
            scope.$router.push('/dashboard');
          }
        },
        onExpires: () =>
        {
          alert('Session expired');
        },
        error: (err) =>
        {
          // alert(err);
          console.log(err);
          scope.form.username.disabled = false;
          scope.form.password.disabled = false;
          scope.loading = false;
        }
      });
    }
  }
};
