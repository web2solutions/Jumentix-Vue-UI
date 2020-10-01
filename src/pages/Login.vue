<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center pb-4">
                  <img src="/static/logo.png" alt="JumentiX" height="120">
                </div>
                
                <v-form v-if="what === 'login'">
                  <v-text-field 
                    append-icon="person" name="username" ref="username" 
                    label="Username" type="text" :disabled="form.username.disabled" v-model="form.username.value"
                    v-on:keyup.enter="login"
                  ></v-text-field>
                  <v-text-field 
                    append-icon="lock" name="password" ref="password" 
                    label="Password" id="password" type="password" :disabled="form.password.disabled" 
                    v-model="form.password.value"
                    v-on:keyup.enter="login"
                  ></v-text-field>
                </v-form>

                <v-form v-if="what === 'changePassword'">
                  <v-text-field 
                    append-icon="lock" name="new_password" ref="new_password" 
                    label="New password" id="new_password" type="password" :disabled="form2.new_password.disabled" 
                    v-model="form2.new_password.value"
                    v-on:keyup.enter="updatePassword"
                  ></v-text-field>
                  <v-text-field 
                    append-icon="lock" name="confirm_password" ref="confirm_password" 
                    label="Confirm password" id="confirm_password" type="password" :disabled="form2.confirm_password.disabled" 
                    v-model="form2.confirm_password.value"
                    v-on:keyup.enter="updatePassword"
                  ></v-text-field>
                </v-form>

              </v-card-text>
              <v-card-actions>
                <!-- <v-btn icon>
                  <v-icon color="blue">fa fa-facebook-square fa-lg</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon color="red">fa fa-google fa-lg</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon color="light-blue">fa fa-twitter fa-lg</v-icon>
                </v-btn> -->
                <v-spacer></v-spacer>
                <v-btn block color="primary" @click="login" ref="sigInBtn" :loading="loading" v-if="what === 'login'">Login</v-btn>
                <v-btn block color="primary" @click="updatePassword" ref="sigInBtn" :loading="loading" v-if="what === 'changePassword'">Update Password</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import Login from './Login.vm.js';
export default Login;
</script>
<style scoped lang="css">
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
