
export function validName(nickname)
{
    let regex = /^\w*$/;
    return regex.exec(nickname) !== null;
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

export function serviceErrorResponse( error )
{
    return {
        error
    }
}

export function serviceResponse( error, record )
{
    error = error || false
    record = record  || false
    return {
        error,
        record
    }
}

export function findIndex(arr, el)
{
    let len = arr.length

    while (len--)
    {
        if (arr[len].el === el)
        {
            return len;
        }
    }

    return -1;
}

export function sanitizeString(message)
{
    return message.replace(/(<([^>]+)>)/ig, '').substring(0, 35);
}


export function uuid()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
    {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
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



export function isDate(dt)
{
    return (null !== dt) && !isNaN(dt) && ("undefined" !== typeof dt.getDate);
}


export function getPersonalRoomName(userId, companyId)
{
    return 'agency_' + companyId + "_user_" + userId
}





let job_properties = [
    'uuid',
    'from',
    'to',
    'createdAt',
    'updatedAt',
    'entity',
    'action',
    'payload',
    'data',
    'success',
    'error',
    'status',
    'source'
];

export function getValidatedResource(payload, params)
{
    let hash = {};
    for (let param in payload)
    {
        if (payload.hasOwnProperty(param))
        {
            if (payload[param] !== null && payload[param] !== "")
            {
                if (params.indexOf(param) !== -1)
                {
                    hash[param] = payload[param];
                }
            }
        }
    }
    return hash;
}


export function validateJob(job)
{
    let isJSON = false,
        total_properties_in_contract = 0,
        total_properties_in_job = 0;

    try
    {
        JSON.stringify(job);
        isJSON = true;
    }
    catch (e)
    {
        // statements
        isJSON = false;
    }

    if (!isJSON)
    {
        return false;
    }

    total_properties_in_contract = job_properties.length;

    for (let p in job)
    {
        if (job.hasOwnProperty(p))
        {
            if (job_properties.indexOf(p) > -1)
            {
                total_properties_in_job += 1;
            }
        }
    }
    return total_properties_in_job >= total_properties_in_contract;
}


export function emailPayload(payload)
{
    let isJSON = false;
    try
    {
        JSON.stringify(payload);
        isJSON = true;
    }
    catch (e)
    {
        // statements
        isJSON = false;
    }

    if (!isJSON)
    {
        return false;
    }

    if (!payload.message)
    {
        return false;
    }

    if (!payload.subject)
    {
        return false;
    }

    if (!payload.to)
    {
        return false;
    }

    if (payload.message === '')
    {
        return false;
    }

    if (payload.subject === '')
    {
        return false;
    }

    if (payload.to === '')
    {
        return false;
    }

    return true;
}




export function mailOptions(from, to, subject, message, files)
{
    files = files || [];
    return {
        from : from, // sender address
        to : to, // list of receivers
        //cc:'second@domain.com',
        //bcc:'secretagent@company.gov',
        //'h:Reply-To': 'reply2this@company.com',
        subject : subject, // Subject line
        //text: message, // plain text body
        html : message, // html body
        attachments : files,
        priority : "high",
        attachDataUrls : true,
        //encoding
        //textEncoding: "quoted-printable"
        //messageId
    }
}


export function formatMessage(job, data)
{
    let _message = `
        <tr>
          <td align="left" valign="top">
            <h2>Job ID:</h2>
            <p>${job.uuid}</p>
          </td>
        </tr>
        <tr>
          <td align="left" valign="top">
            <h2>Task:</h2>
            <p>${job.action} ${job.entity}</p>
          </td>
        </tr>
    `
    _message += `
        <tr>
          <td align="left" valign="top">
            <h2>Request information:</h2>
          </td>
        </tr>
        <tr>
          <td align="left" valign="top">
    `

    for (let p in job.payload)
    {
        _message += ` <p> <b>${p}</b>:  ${job.payload[p]}</p>`
    }

    _message += `
          </td>
        </tr>
    `

    _message += `
        <tr>
          <td align="left" valign="top">
            <h2>Job execution information:</h2>
          </td>
        </tr>
        <tr>
          <td align="left" valign="top">
    `

    for (let p in data)
    {
        if (typeof data[p] === 'number' || typeof data[p] === 'string') _message += ` <p> <b>${p}</b>:  ${data[p]}</p>`
        if (typeof data[p] === 'object')
        {
            _message += ` <p> <b>${p}</b>:</p>`
            _message += ` <ul>`
            for (let i in data[p])
            {
                if (typeof data[p][i] === 'number' || typeof data[p][i] === 'string') _message += ` <li> <b>${i}</b>: ${data[p][i]}</li>`
            }
            _message += ` </ul>`
        }
    }

    _message += `
          </td>
        </tr>
    `

    return _message
}


export function encodeString(str)
{
    let buf = [],
        i =  null;

    for (i = str.length - 1; i >= 0; i--)
    {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }

    return buf.join('');
}

export function decodeString(str)
{
    return str.replace(/&#(\d+);/g, function(match, dec)
    {
        return String.fromCharCode(dec);
    });
}
