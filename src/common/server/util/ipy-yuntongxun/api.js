// Generated by CoffeeScript 1.12.2
(function() {
  var getAuthorization, getSig, getTimestamp, init, js2xmlparser, merge, ref, request;

  js2xmlparser = require('js2xmlparser');

  request = require('request');

  ref = require('./util.js'), getTimestamp = ref.getTimestamp, getAuthorization = ref.getAuthorization, getSig = ref.getSig, merge = ref.merge;

  init = function(config) {
    var accountSid, apiFactory, appId, authToken, baseUrl, callApi, confApiFactory, log, softVersion;
    accountSid = config.accountSid;
    authToken = config.authToken;
    appId = config.appId;
    baseUrl = config.baseUrl;
    softVersion = config.softVersion;
    if (config.log) {
      log = config.log;
    } else {
      log = function(e, r, b, action) {
        if (e) {
          return console.log('\n' + e);
        } else {
          if (action) {
            console.log('\nResult of ' + action + ':');
          }
          console.log('\n');
          return console.dir(b);
        }
      };
    }
    callApi = function(args) {
      var headers, options, sid, timestamp, token, uri;
      if (!args.format) {
        if (/\/ivr\//i.test(args.api)) {
          args.format = 'XML';
        } else {
          args.format = 'JSON';
        }
      } else {
        args.format = args.format.toUpperCase();
      }
      if (!args.method) {
        args.method = 'POST';
      } else {
        args.method = args.method.toUpperCase();
      }
      if (/{accountSid}/i.test(args.api)) {
        sid = accountSid;
        token = authToken;
      } else if (/{subAccountSid}/i.test(args.api)) {
        sid = args.sid;
        token = args.token;
        if (!sid || !token) {
          throw new Error('subaccount sid and token are required.');
        }
      }
      uri = baseUrl + args.api.replace(/{SoftVersion}/i, softVersion).replace(/{(sub)?accountSid}/i, sid);
      timestamp = getTimestamp();
      headers = {
        'Authorization': getAuthorization(sid, timestamp),
        'Accept': 'application/json'
      };
      if (args.format === 'JSON') {
        headers['Content-Type'] = 'application/json;charset=utf-8;';
      } else if (args.format === 'XML') {
        headers['Content-Type'] = 'application/xml;charset=utf-8;';
      }
      options = {
        method: args.method,
        uri: uri,
        followAllRedirects: true,
        rejectUnauthorized: false,
        timeout: 5000,
        headers: headers
      };
      if (!args.params) {
        args.params = {};
      }
      if (args.method === 'GET') {
        args.params.appId = appId;
        options.qs = args.params;
      } else {
        if (args.format === 'JSON') {
          args.params.appId = appId;
          options.json = args.params;
        } else if (args.format === 'XML') {
          if (!args.params.data) {
            pargs.arams.data = {};
          }
          args.params.data['Appid'] = appId;
          options.body = js2xmlparser(args.params.root || 'Request', args.params.data);
        }
      }
      if (!options.qs) {
        options.qs = {};
      }
      options.qs.sig = getSig(sid, token, timestamp);
      return request(options, function(e, r, b) {
        if (typeof b === 'string') {
          try {
            b = JSON.parse(b);
          } catch (error) {
            e = error;
            return typeof callback === "function" ? callback(new Error('Parse response error: ' + b)) : void 0;
          }
        }
        return typeof args.callback === "function" ? args.callback(e, r, b) : void 0;
      });
    };
    apiFactory = function(name, api, method) {
      return function(args, callback) {
        if (typeof args === 'function') {
          callback = args;
          args = {};
        }
        return callApi({
          method: method || 'POST',
          api: api,
          params: args,
          callback: function(e, r, b) {
            log(e, r, b, name);
            return typeof callback === "function" ? callback(e, b, r) : void 0;
          }
        });
      };
    };
    confApiFactory = function(action) {
      var api, params;
      params = {};
      if (action.toLowerCase() === 'createconf') {
        api = '/{SoftVersion}/Accounts/{accountSid}/ivr/createconf';
      } else {
        api = '/{SoftVersion}/Accounts/{accountSid}/ivr/conf?confid={id}';
      }
      return function(args, callback) {
        if (typeof args === 'function') {
          callback = args;
          args = {};
        }
        params.root = 'Request';
        params.data = {};
        params.data[action] = {};
        params.data[action]['@'] = args;
        return callApi({
          api: api.replace('{id}', args.confid),
          params: params,
          callback: function(e, r, b) {
            log(e, r, b, action);
            return typeof callback === "function" ? callback(e, b, r) : void 0;
          }
        });
      };
    };
    return {
      accountInfo: apiFactory('AccountInfo', '/{SoftVersion}/Accounts/{accountSid}/AccountInfo', 'get'),
      createSubAccount: apiFactory('CreateSubAccount', '/{SoftVersion}/Accounts/{accountSid}/SubAccounts'),
      getSubAccounts: apiFactory('GetSubAccounts', '/{SoftVersion}/Accounts/{accountSid}/GetSubAccounts'),
      querySubAccountByName: apiFactory('QuerySubAccountByName', '/{SoftVersion}/Accounts/{accountSid}/QuerySubAccountByName'),
      closeSubAccount: apiFactory('CloseSubAccount', '/{SoftVersion}/Accounts/{accountSid}/CloseSubAccount'),
      billRecords: apiFactory('BillRecords', '/{SoftVersion}/Accounts/{accountSid}/BillRecords'),
      message: apiFactory('Message', '/{SoftVersion}/Accounts/{accountSid}/SMS/Messages'),
      templateSMS: apiFactory('TemplateSMS', '/{SoftVersion}/Accounts/{accountSid}/SMS/TemplateSMS'),
      callback: apiFactory('Callback', '/{SoftVersion}/SubAccounts/{subAccountSid}/Calls/Callback'),
      landingCalls: apiFactory('LandingCalls', '/{SoftVersion}/Accounts/{accountSid}/Calls/LandingCalls'),
      voiceVerify: apiFactory('VoiceVerify', '/{SoftVersion}/Accounts/{accountSid}/Calls/VoiceVerify'),
      createConf: confApiFactory('CreateConf'),
      dismissConf: confApiFactory('DismissConf'),
      joinConf: confApiFactory('JoinConf'),
      inviteJoinConf: confApiFactory('InviteJoinConf'),
      quitConf: confApiFactory('QuitConf'),
      confMute: confApiFactory('ConfMute'),
      confUnMute: confApiFactory('ConfUnMute'),
      confPlay: confApiFactory('ConfPlay'),
      confStopPlay: confApiFactory('ConfStopPlay'),
      confRecord: confApiFactory('ConfRecord'),
      confStopRecord: confApiFactory('ConfStopRecord'),
      confVolumeAdjust: confApiFactory('ConfVolumeAdjust'),
      confMemberPause: confApiFactory('ConfMemberPause'),
      confMemberResume: confApiFactory('ConfMemberResume'),
      confAlarmClock: confApiFactory('ConfAlarmClock'),
      queryConfState: confApiFactory('QueryConfState')
    };
  };

  exports.init = init;

}).call(this);
