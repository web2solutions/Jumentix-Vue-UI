/* eslint-disable */
/* global $ */
// import swal from 'sweetalert2';
import moment from 'moment-timezone'
import $ from "jquery"
import {
  sha512
}
from 'js-sha512'
import is from 'is_js'
import { uuid } from './mediator/eDB/util';

export default (function(global) {
  if (typeof global.localStorage === 'undefined') {
    global.localStorage = {
      _storage: {},
      setItem: function(key, value) {
        this._storage[key] = value
      },
      getItem: function(key) {
        return this._storage[key] || null
      }
    }
  }
  let _session_id_ = false;
  if( global.localStorage.getItem(sha512('MAP_session_id')) && global.localStorage.getItem(sha512('MAP_session_id')) !== 'false' ) 
  {
    _session_id_ = global.localStorage.getItem(sha512('MAP_session_id'))
  }
  else
  {
    _session_id_ = uuid()
    global.localStorage.setItem(sha512('MAP_session_id'), _session_id_)
  }

  let token = null,
    user = null,
    role = null,

    // host = 'http://' + window.location.hostname + (window.location.port === '' ? '' : ':' + window.location.port),
    // api_URL = host + '/api/',

    host = 'http://a243.test.myadoptionportal.com/',
    api_URL = 'http://a243.test.myadoptionportal.com/api/',

    env = 'test',
    version = 'v1',
    //api_auth_URL = 'http://auth.' + env + '.myadoptionportal.com/api/' + version + '/',
    expires = null,
    onExpires = false,
    online = false,
    setEnv = (_env = 'production') => {
      if (window.location.hostname.indexOf('localhost') > -1) {
        env = 'dev';
        _env = 'dev';
      }
      else if (window.location.hostname.indexOf('-prod') > -1) {
        env = 'production';
        _env = 'production';
      }
      else if (window.location.hostname.indexOf('map-ui-test') > -1) {
        env = 'testMac';
        _env = 'testMac';
      }
      else if (window.location.hostname.indexOf('ui.test') > -1) {
        env = 'test';
        _env = 'test';
      }
      // console.log('xxxxxxxxxxxx env', env )
      // console.log('xxxxxxxxxxxx _env', _env )
      if (_env === 'testMac') {
        // console.log('>>>>>>> set testMac', env )
        env = 'testMac'
        api_URL = 'https://map-api-test.myadoptionportal.com/api/'
        host = 'https://map-api-test.myadoptionportal.com/'
      } 
      else if (_env === 'production') {
        // console.log('>>>>>>> set production', env )
        env = 'production'
        api_URL = 'https://a243-prod.myadoptionportal.com/api/'
        host = 'https://a243-prod.myadoptionportal.com/'
      } 
      else if (_env === 'dev') {
        // console.log('>>>>>>> set testMac', env )
        env = 'dev'
        api_URL = 'http://localhost:3001/api/'
        host = 'http://localhost:3001/'
      }
      // console.log(host)
      // console.log(host)
      // console.log(api_URL)
    },
    handleErrorResponse = (xhr, ajaxOptions, thrownError) => {
      if (xhr.responseJSON) {
        if (xhr.responseJSON.message) {
          if (xhr.responseJSON.message.results) {
            return xhr.responseJSON.message.results.errors.map((e) => {
              return e.code + " - " + e.message + "<br>"
            })
          } else if (xhr.responseJSON.message.errors) {
            return (xhr.responseJSON.message.errors.map((e) => {
              return e.message + "<br>"
            }))

          } else {
            return xhr.responseJSON.message

          }
        } else if (xhr.responseJSON.error && xhr.responseJSON.error.errors) {
          return (xhr.responseJSON.error.errors.map((e) => {
            return e.message + "<br>"
          }))
        }
        return false
      }
      return false
    },
    toB = (str) => {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1)
        }))
    },
    fromB = (str) => {
      return decodeURIComponent(atob(str).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    },
    logout = () => {
      global.localStorage.setItem(sha512('MAP_session_data'), "0")
      global.localStorage.setItem(sha512('MAP_session_id'), "false")
      // if (location) location.href = location.origin !== "null" ? location.origin : location.href
      window.getApp.$emit('APP_LOGOUT')
    },
    login = (c) => {
      let username = c.username,
        password = sha512.hex(c.password),
        success = c.success || false,
        error = c.error || false,
        _env = c.env || env,
        payload = null;

      setEnv(_env)

      onExpires = c.onExpires || false

      if (password.length < 6) {
        if (error) error("Password need to have at least 6 chars.")
        return
      }
      let os = 'unknown';
      let browser = 'unknown';
      let device = 'unknown';
      let user_agent = window.navigator.userAgent;
      let ip = 'unknown';
      let geolocation = 'unknown';

      if (is.mac())
      {
        os = 'Mac OS X'
      }
      else if (is.windows())
      {
        os = 'Windows'
      }
      else if (is.linux())
      {
        os = 'Linux'
      }
      else if (is.ios())
      {
        os = 'ios'
      }
      else if (is.android())
      {
        os = 'Android'
      }
      else if (is.android())
      {
        os = 'Android'
      }

      if (is.chrome())
      {
        browser = 'Chrome'
      }
      else if (is.firefox())
      {
        browser = 'Firefox'
      }
      else if (is.ie())
      {
        browser = 'Internet Explorer'
      }
      else if (is.edge())
      {
        browser = 'Microsoft Edge'
      }
      else if (is.opera())
      {
        browser = 'Opera'
      }
      else if (is.safari())
      {
        browser = 'Safari'
      }
      else if (is.phantom())
      {
        browser = 'Phantom'
      }

      if (is.desktop())
      {
        device = 'Desktop'
      }
      else if (is.tablet())
      {
        device = 'Tablet'
      }
      else if (is.mobile())
      {
        device = 'Mobile'
      }
      else if (is.androidPhone())
      {
        device = 'Android Phone'
      }
      else if (is.androidTablet())
      {
        device = 'Android Tablet'
      }
      else if (is.blackberry())
      {
        device = 'Blackberry'
      }
      else if (is.windowsPhone())
      {
        device = 'Windows Phone'
      }
      else if (is.windowsTablet())
      {
        device = 'Windows Tablet'
      }
      else if (is.ipod())
      {
        device = 'Ipod'
      }
      else if (is.ipad())
      {
        device = 'Ipad'
      }
      else if (is.iphone())
      {
        device = 'Iphone'
      }
      
      _session_id_ = uuid()
      global.localStorage.setItem(sha512('MAP_session_id'), _session_id_)
      

      payload = {
        username,
        password,
        info:{
          session_id: _session_id_,
          browser,
          os,
          device, 
          user_agent
        }
      }
      
      $.getJSON('https://ssl.geoplugin.net/json.gp?k=d43aac490da2ebf3', function(geodata) {
        // // console.log(JSON.stringify(geodata, null, 2));

        payload.info.ip = geodata.geoplugin_request
        payload.info.geolocation = geodata.geoplugin_latitude + ' ' + geodata.geoplugin_longitude
        payload.info.country = geodata.geoplugin_countryName
        payload.info.city = geodata.geoplugin_city
        payload.info.state = geodata.geoplugin_region
        // // // console.log(api_auth_URL)
        // // // console.log(api_URL)
        $.ajax({
          method: "POST",
          url: api_URL + "authentication",
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(payload),
          success: (response) => {
            // // console.log('call setSession from login')
            setSession(response, success)

          },
          error: (xhr, ajaxOptions, thrownError) => {
            window.getApp.$emit('APP_LOGIN_FAILED', handleErrorResponse(xhr, ajaxOptions, thrownError))
            if (error) error(handleErrorResponse(xhr, ajaxOptions, thrownError))
          }
        })
      });
      
    },
    updatePassword = (c) => {
        let user_id = c.user_id,
            new_password = c.new_password,
            confirm_password = c.confirm_password,
            success = c.success || false,
            error = c.error || false,
            _env = c.env || env,
            payload = null;

        setEnv(_env)

        if (c.new_password.toString() !== c.confirm_password.toString()) {
            alert("New password and it confirmation does not match")
            return
        }
        if (c.new_password.length < 6) {
            alert("Password need to have at least 6 chars.")
            return
        }
        payload = {
            changePasswordNextLogin: false,
            password: new_password,
            last_password_change: (new Date()).toISOString()
        }
        ajax({
            method: "PUT",
            url: "User/" + user_id,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(payload),
            success: (response) => {
                // console.log(response)
                if (success) success()
            },
            error: (xhr, ajaxOptions, thrownError) => {
                // console.log('XXXXXXXXXXXXXX------>', xhr)
                if (error) error(handleErrorResponse(xhr, ajaxOptions, thrownError))
            }
        })
    },
    _login = (c) => {
      let username = c.username,
        password = c.password,

        success = c.success || false,
        error = c.error || false,
        _env = c.env || env,
        payload = null;

      setEnv(_env)

      onExpires = c.onExpires || false

      if (password.length < 6) {
        if (error) error("Password need to have at least 6 chars.")
        return
      }
      payload = {
        username,
        password,
      }
      $.ajax({
        method: "POST",
        url: api_URL + "authentication",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(payload),
        success: (response) => {
          // // console.log('call setSession from _login')
          setSession(response, success)
        },
        error: (xhr, ajaxOptions, thrownError) => {
          /*swal.fire({
              title: "Forbidden",
              text: handleErrorResponse(xhr, ajaxOptions, thrownError),
              type: "error"
          })
          setTimeout(() => {
              swal.stopLoading();
              swal.close();
          }, 3000)*/
          if (error) error(handleErrorResponse(xhr, ajaxOptions, thrownError))
        }
      })
    },
    setSession = (response, success) => {
      // console.log('-----> setSession', response);
      delete response.status
      delete response.message

      token = response.token
      user = response.user

      // console.log('-----> setSession user', response.user);

      role = response.user.role
      expires = response.expires
      response.env = env
      response.id = _session_id_

      // // console.log('_session_id_', _session_id_);
      // // console.log('token', token);
      // // console.log('user', user);
      // // console.log('role', role);
      // // console.log('expires', expires);
      // // console.log('response.env', response.env);
      // // console.log('response.id', response.id);
      // // console.log('response', response);

      global.localStorage.setItem(sha512('MAP_session_data'), toB(JSON.stringify(response)))

      online = true

      if (env.toLowerCase().indexOf('test') > -1 || env.toLowerCase().indexOf('prod') > -1) {
        //api_URL = response.api + '/api/' + version + '/'
      }

      checkToken()

      if (success) success(response)
      return response
    },
    getSession = () => {
      let localSession = null;
      try {
        localSession = global.localStorage.getItem(sha512('MAP_session_data'))
      } catch (e) {
        localSession = false;
        global.localStorage.setItem(sha512('MAP_session_data'), "0")
      }

      if (localSession === "0") {
        localSession = false
      }
      if (localSession) {
        try {
          localSession = JSON.parse(fromB(localSession))
        } catch (e) {
          global.localStorage.setItem(sha512('MAP_session_data'), "0")
        }
      } else {
        global.localStorage.setItem(sha512('MAP_session_data'), "0");
      }
      return localSession;
    },
    checkTokenIterval = null,
    checkToken = () => {
      checkTokenIterval = setInterval(() => {
        let now = moment().toDate()
        if (now > moment(expires).toDate()) {
          global.localStorage.setItem(sha512('MAP_session_data'), "0")
          online = false
          if (onExpires) onExpires()
          clearInterval(checkTokenIterval)
          alert("Session expired. Please do login again.")
          // window.getApp.$emit('APP_AUTH_FAILED')
        }
      }, 5000)
    },
    ajax = (c) => {
      // // // console.log('c.url', c.url)
      // // // console.log('api_URL + c.url', api_URL)
      c.method = c.method || 'GET'
      c.beforeSend = (request) => {
        request.setRequestHeader("Authorization", "Bearer " + token)
        /*swal.fire({
            title: "Data transfer",
            text: "Performing server " + c.method    + " request",
            type: "warning"
        })*/
      }

      const success = c.success,
        error = c.error;

      c.success = (a) => {
        /*swal.stopLoading();
        swal.close();
        swal.fire({
            title: "Data transfer",
            text: "Data is ready",
            type: "success"
        })

        setTimeout(() => {
            swal.stopLoading();
            swal.close();
        }, 1000)
        */
        success(a)
      }
      c.error = (a, b, c) => {
        /*swal.fire({
            title: "Data transfer",
            text: "Data is not ready",
            type: "error"
        })

        setTimeout(() => {
            swal.stopLoading();
            swal.close();
        }, 1000)*/

        error(a, b, c)
      }

      c.url = api_URL + c.url
      $.ajax(c)
    },
    http = (c) => {
      c = JSON.parse(JSON.stringify(c))
      let _env = c.env || env;
      let _URL = c.url;
      setEnv(_env)
      return new Promise(async function(resolve, reject) {
        let response = {
          data: null,
          error: null
        }
        // // // console.log('c.url', c.url)
        // // // console.log('api_URL + c.url', api_URL)
        //c.method = c.method || 'GET'
        c.type = c.type || 'GET'
        c.beforeSend = (request) => {
          // // console.log('calling HTTP', c.url)
          request.setRequestHeader("Authorization", "Bearer " + token)
        }
        c.dataType = 'json'
        c.contentType = 'application/json'
        c.success = (a) => {
          response.data = a.data
          //response.data = a.data
          resolve(a)
        }
        c.error = (a, b, c) => {
          
          let errorMessage = '';
          let objResponse = JSON.parse(a.responseText)
          // console.log(objResponse)
          if (objResponse.error) {
            // swagger validation
            if (objResponse.error.results) {
              objResponse.error.results.errors.forEach(e => {
                errorMessage = errorMessage + `${e.description}: ${e.message} \n`
              });
            }
            else if (objResponse.error.code && objResponse.error.code === 11000) {
              let fields = Object.keys(objResponse.error.keyValue)
              // console.log(fields)
              // console.log(objResponse.error.keyValue)
              errorMessage = `There is already a ${_URL} document with ${fields[0]} equal to ${objResponse.error.keyValue[fields[0]]}`;
            } 
            else {
              errorMessage = objResponse.message || objResponse.error
            }
          } else {
            errorMessage = objResponse.message || objResponse.error
          }
          response.error = errorMessage

          if (a.status === 401 || a.status === 403) {
            logout()
            resolve(response)
          }

          // response.error = handleErrorResponse(a, b, c)
          if (response.error === 'Unauthorized') {
            logout()
            resolve(response)
          } else {
            // console.log(response.error)
            window.getApp.$emit('APP_BAD_REQUEST', response.error)
            resolve(response)
          }

        }

        c.url = api_URL + c.url
        $.ajax(c)
      })
    },
    upload = (c) => {
      let _env = c.env || env;

      setEnv(_env)
      return new Promise(async function(resolve, reject) {
        let response = {
          data: null,
          error: null
        }
        // var formData = new FormData();
        // formData.append('fileUpload', event.target.files[0]);
        //c.data = formData
        // // console.log('CDATA', c.data);
        c.type = 'PATCH'
        c.cache = false
        c.contentType = false
        c.processData = false
        c.beforeSend = (request) => {
          request.setRequestHeader("Authorization", "Bearer " + token)
          request.setRequestHeader("Accept", "application/json")
        }
        //c.dataType = 'json'
        //c.contentType = 'application/json'
        c.success = (a) => {
          response.data = a.data
          if (c.bus)
          {
            c.bus.$emit('fileProgressComplete');
          }
          resolve(a)
        }
        c.error = (a, b, c) => {
          let errorMessage = '';
          let objResponse = JSON.parse(a.responseText)
          // // console.log(objResponse)
          if (objResponse.error) {
            // swagger validation
            if (objResponse.error.results) {
              objResponse.error.results.errors.forEach(e => {
                errorMessage = errorMessage + `${e.description}: ${e.message} \n`
              });
            } else {
              errorMessage = objResponse.message
            }
          } else {
            errorMessage = objResponse.message
          }
          response.error = errorMessage

          // response.error = handleErrorResponse(a, b, c)
          if (response.error === 'Unauthorized') {
            logout()
            reject(response)
          } else {
            window.getApp.$emit('APP_BAD_REQUEST', response.error)
            resolve(response)
          }
        }

        c.url = api_URL + c.url
        c.xhr = function () { // Custom XMLHttpRequest
          var myXhr = $.ajaxSettings.xhr();
          if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
              myXhr.upload.addEventListener('progress', function(event) {
                  /* faz alguma coisa durante o progresso do upload */
                  //// // console.log('uploader arguments', arguments);
                  if (c.bus)
                  {
                    c.bus.$emit('fileProgress', event);
                  }
              }, false);
          }
          return myXhr;
        }
        $.ajax(c)
      })
    },
    swagger = (c) => {
      // // console.log('SWAGGGER >>>>>>>>>>>>>')
      c = c || {}
      c.method = 'GET'

      let _env = c.env || env;

      setEnv(_env)


      const success = c.success,
        error = c.error;

      c.success = (a) => {
        success(a)
      }
      c.error = (a, b, c) => {
        error(a, b, c)
      }

      c.url = host + 'api-docs'
      $.ajax(c)
    },
    api = null;

  global.onload = () => {
    api.isOnline()
  }

  api = {
    login: login,
    updatePassword: updatePassword,
    setEnv: setEnv,
    _login: _login,
    token: () => {
      return token
    },
    user: () => {
      // // console.log('sesession user ', user)
      return user
    },
    role: () => {
      return role
    },
    expires: () => {
      return expires
    },
    isOnline: () => {
      // // console.log();
      let localSession = global.localStorage.getItem(sha512('MAP_session_data')) || false,
        now = null;
      if (localSession === "0") {
        localSession = false
      }
      if (localSession) {
        try {
          localSession = JSON.parse(fromB(localSession))
          // // // console.log( '------->>>> session localSession', localSession )
          online = true
        } catch (e) {
          global.localStorage.setItem(sha512('MAP_session_data'), "0")
          online = false
        }
        // // console.log( '######### isOnline : ()', online )
      } else {
        global.localStorage.setItem(sha512('MAP_session_data'), "0");
        // // console.log( '######### isOnline : ()', online )
        return false
      }


      // // console.log( '------->>>> isOnline', online )
      if (online) {
        
        token = localSession.token
        user = localSession.user
        role = localSession.user.role
        expires = localSession.expires
        env = localSession.env


        online = true

        if (env.toLowerCase().indexOf('test') > -1 || env.toLowerCase().indexOf('prod') > -1) {
          //api_URL = localSession.api + '/api/' + version + '/'
        }
      } else {
        return false
      }

      now = moment().toDate()

      if (now > moment(expires).toDate()) {
        global.localStorage.setItem(sha512('MAP_session_data'), "0")
        return false
      }

      if (online) {
        checkToken()
      }

      return online
    },
    ajax: ajax,
    http: http,
    upload: upload,
    swagger: swagger,
    logout: logout,
    getSession,
    setSession: setSession,
    //id: _session_id_
  }

  return api
})(window || global)


//export { session }


//window.session = session
