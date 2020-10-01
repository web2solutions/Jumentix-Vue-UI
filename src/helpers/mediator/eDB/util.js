import Cursor from './Cursor';

export function validName(nickname)
 {
     let regex = /^\w*$/
     return regex.exec(nickname) !== null
 }

 export function copy(obj, targetObj)
 {
     targetObj = targetObj ||
     {}
     for (let i in obj)
     {
         targetObj[i] = obj[i]
     }

     return targetObj
 }


 export function findIndex(arr, id)
 {
     let len = arr.length

     while (len--)
     {
         if (arr[len].id === id)
         {
             return len
         }
     }

     return -1
 }

 export function sanitizeString(message)
 {
     return message.replace(/(<([^>]+)>)/ig, '').substring(0, 35)
 }


 export function uuid()
 {
     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
     {
         let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
         return v.toString(16)
     })
 }

 export function isDefined(variable)
 {
     return typeof variable !== 'undefined'
 }

 export function isNumber(n)
 {
     return !isNaN(parseFloat(n)) && isFinite(n);
 }

 export function isArray(n)
 {
     return Array.isArray(n)
 }

 export function isEmail(email)
 {
     let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(email);
 }


 export function isObject(val)
 {
     if (val === null)
     {
         return false;
     }
     return ((typeof val === 'function') || (typeof val === 'object'));
 }


 export function comparer(a, b)
 {
     return a < b ? -1 : a > b ? 1 : 0
 }



 export function isDate(x)
 {
     return (null != x) && !isNaN(x) && ("undefined" !== typeof x.getDate);
 }


 export function getPersonalRoomName(user_id, agency_id)
 {
     return 'agency_' + agency_id + "_user_" + user_id
 }





 export function promisifyRequest(request)
 {
     return new Promise(function(resolve, reject)
     {
         request.onsuccess = function(e)
         {
             //console.log(e)
             resolve(request.result)
         }

         request.onerror = function(e)
         {
             reject(request.error)
         }
     })
 }

 export function promisifyRequestCall(obj, method, args)
 {
     let request
     let p = new Promise(function(resolve, reject)
     {
         request = obj[method].apply(obj, args)
         promisifyRequest(request).then(resolve, reject)
     })

     p.request = request
     return p
 }

 export function promisifyCursorRequestCall(obj, method, args)
 {
     let p = promisifyRequestCall(obj, method, args)
     return p.then(function(value)
     {
         if (!value) return
         return new Cursor(value, p.request)
     })
 }

 export function proxyProperties(ProxyClass, targetProp, properties)
 {
     properties.forEach(function(prop)
     {
         Object.defineProperty(ProxyClass.prototype, prop,
         {
             get : function()
             {
                 return this[targetProp][prop]
             },
             set : function(val)
             {
                 this[targetProp][prop] = val
             }
         })
     })
 }

 export function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties)
 {
     properties.forEach(function(prop)
     {
         if (!(prop in Constructor.prototype)) return
         ProxyClass.prototype[prop] = function()
         {
             return promisifyRequestCall(this[targetProp], prop, arguments)
         }
     })
 }

 export function proxyMethods(ProxyClass, targetProp, Constructor, properties)
 {
     properties.forEach(function(prop)
     {
         if (!(prop in Constructor.prototype)) return
         ProxyClass.prototype[prop] = function()
         {
             return this[targetProp][prop].apply(this[targetProp], arguments)
         }
     })
 }

 export function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties)
 {
     properties.forEach(function(prop)
     {
         if (!(prop in Constructor.prototype)) return
         ProxyClass.prototype[prop] = function()
         {
             return promisifyCursorRequestCall(this[targetProp], prop, arguments)
         }
     })
 }


 export function toArray(arr)
 {
     return Array.prototype.slice.call(arr);
 }

 export function isMatched (query = {}, record = {}, logicalOperator = 'or')
 {
    let _isMatched = false
    let queryKeys = Object.keys(query)
    let recordKeys = Object.keys(record)
    let nToMatch = logicalOperator === 'or' ? 1 : queryKeys.length
    let nMatched = 0

    if (queryKeys.length < 1) return false
    if (recordKeys.length < 1) return false
    
    if (queryKeys.length > 0 && recordKeys.length > 0)
    {
      for (let filter in query)
      {
        if (query.hasOwnProperty(filter))
        {
          if (record[filter])
          {
            let filterValue = query[filter]
            let recordValue = record[filter]
            if (typeof filterValue === 'string') filterValue = filterValue.toLowerCase().trim()
            if (typeof recordValue === 'string') recordValue = recordValue.toLowerCase().trim()

            if (filterValue === recordValue)
            {
              nMatched += 1;
              if (nMatched === nToMatch)
              {
                _isMatched = true;
                break;
              }
            }
          }
        }
      }
    }
    return _isMatched
 }
