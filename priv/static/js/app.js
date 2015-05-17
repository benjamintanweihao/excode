(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.define({'phoenix': function(exports, require, module){ "use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.__esModule = true;
var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
var CHANNEL_EVENTS = {
  close: "phx_close",
  error: "phx_error",
  join: "phx_join",
  reply: "phx_reply",
  leave: "phx_leave"
};

var Push = (function () {

  // Initializes the Push
  //
  // chan - The Channel
  // event - The event, ie `"phx_join"`
  // payload - The payload, ie `{user_id: 123}`
  // mergePush - The optional `Push` to merge hooks from

  function Push(chan, event, payload, mergePush) {
    var _this = this;

    _classCallCheck(this, Push);

    this.chan = chan;
    this.event = event;
    this.payload = payload || {};
    this.receivedResp = null;
    this.afterHooks = [];
    this.recHooks = {};
    this.sent = false;
    if (mergePush) {
      mergePush.afterHooks.forEach(function (hook) {
        return _this.after(hook.ms, hook.callback);
      });
      for (var status in mergePush.recHooks) {
        if (mergePush.recHooks.hasOwnProperty(status)) {
          this.receive(status, mergePush.recHooks[status]);
        }
      }
    }
  }

  Push.prototype.send = function send() {
    var _this = this;

    var ref = this.chan.socket.makeRef();
    var refEvent = this.chan.replyEventName(ref);

    this.chan.on(refEvent, function (payload) {
      _this.receivedResp = payload;
      _this.matchReceive(payload);
      _this.chan.off(refEvent);
      _this.cancelAfters();
    });

    this.startAfters();
    this.sent = true;
    this.chan.socket.push({
      topic: this.chan.topic,
      event: this.event,
      payload: this.payload,
      ref: ref
    });
  };

  Push.prototype.receive = function receive(status, callback) {
    if (this.receivedResp && this.receivedResp.status === status) {
      callback(this.receivedResp.response);
    }
    this.recHooks[status] = callback;
    return this;
  };

  Push.prototype.after = function after(ms, callback) {
    var timer = null;
    if (this.sent) {
      timer = setTimeout(callback, ms);
    }
    this.afterHooks.push({ ms: ms, callback: callback, timer: timer });
    return this;
  };

  // private

  Push.prototype.matchReceive = function matchReceive(_ref) {
    var status = _ref.status;
    var response = _ref.response;
    var ref = _ref.ref;

    var callback = this.recHooks[status];
    if (!callback) {
      return;
    }

    if (this.event === CHANNEL_EVENTS.join) {
      callback(this.chan);
    } else {
      callback(response);
    }
  };

  Push.prototype.cancelAfters = function cancelAfters() {
    this.afterHooks.forEach(function (hook) {
      clearTimeout(hook.timer);
      hook.timer = null;
    });
  };

  Push.prototype.startAfters = function startAfters() {
    this.afterHooks.map(function (hook) {
      if (!hook.timer) {
        hook.timer = setTimeout(function () {
          return hook.callback();
        }, hook.ms);
      }
    });
  };

  return Push;
})();

var Channel = exports.Channel = (function () {
  function Channel(topic, message, callback, socket) {
    _classCallCheck(this, Channel);

    this.topic = topic;
    this.message = message;
    this.callback = callback;
    this.socket = socket;
    this.bindings = [];
    this.afterHooks = [];
    this.recHooks = {};
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.message);

    this.reset();
  }

  Channel.prototype.after = function after(ms, callback) {
    this.joinPush.after(ms, callback);
    return this;
  };

  Channel.prototype.receive = function receive(status, callback) {
    this.joinPush.receive(status, callback);
    return this;
  };

  Channel.prototype.rejoin = function rejoin() {
    this.reset();
    this.joinPush.send();
  };

  Channel.prototype.onClose = function onClose(callback) {
    this.on(CHANNEL_EVENTS.close, callback);
  };

  Channel.prototype.onError = function onError(callback) {
    var _this = this;

    this.on(CHANNEL_EVENTS.error, function (reason) {
      callback(reason);
      _this.trigger(CHANNEL_EVENTS.close, "error");
    });
  };

  Channel.prototype.reset = function reset() {
    var _this = this;

    this.bindings = [];
    var newJoinPush = new Push(this, CHANNEL_EVENTS.join, this.message, this.joinPush);
    this.joinPush = newJoinPush;
    this.onError(function (reason) {
      setTimeout(function () {
        return _this.rejoin();
      }, _this.socket.reconnectAfterMs);
    });
    this.on(CHANNEL_EVENTS.reply, function (payload) {
      _this.trigger(_this.replyEventName(payload.ref), payload);
    });
  };

  Channel.prototype.on = function on(event, callback) {
    this.bindings.push({ event: event, callback: callback });
  };

  Channel.prototype.isMember = function isMember(topic) {
    return this.topic === topic;
  };

  Channel.prototype.off = function off(event) {
    this.bindings = this.bindings.filter(function (bind) {
      return bind.event !== event;
    });
  };

  Channel.prototype.trigger = function trigger(triggerEvent, msg) {
    this.bindings.filter(function (bind) {
      return bind.event === triggerEvent;
    }).map(function (bind) {
      return bind.callback(msg);
    });
  };

  Channel.prototype.push = function push(event, payload) {
    var pushEvent = new Push(this, event, payload);
    pushEvent.send();

    return pushEvent;
  };

  Channel.prototype.replyEventName = function replyEventName(ref) {
    return "chan_reply_" + ref;
  };

  Channel.prototype.leave = function leave() {
    var _this = this;

    return this.push(CHANNEL_EVENTS.leave).receive("ok", function () {
      _this.socket.leave(_this);
      _this.reset();
    });
  };

  return Channel;
})();

var Socket = exports.Socket = (function () {

  // Initializes the Socket
  //
  // endPoint - The string WebSocket endpoint, ie, "ws://example.com/ws",
  //                                               "wss://example.com"
  //                                               "/ws" (inherited host & protocol)
  // opts - Optional configuration
  //   transport - The Websocket Transport, ie WebSocket, Phoenix.LongPoller.
  //               Defaults to WebSocket with automatic LongPoller fallback.
  //   heartbeatIntervalMs - The millisec interval to send a heartbeat message
  //   reconnectAfterMs - The millisec interval to reconnect after connection loss
  //   logger - The optional function for specialized logging, ie:
  //            `logger: function(msg){ console.log(msg) }`
  //   longpoller_timeout - The maximum timeout of a long poll AJAX request.
  //                        Defaults to 20s (double the server long poll timer).
  //
  // For IE8 support use an ES5-shim (https://github.com/es-shims/es5-shim)
  //

  function Socket(endPoint) {
    var opts = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Socket);

    this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
    this.flushEveryMs = 50;
    this.reconnectTimer = null;
    this.channels = [];
    this.sendBuffer = [];
    this.ref = 0;
    this.transport = opts.transport || window.WebSocket || LongPoller;
    this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 30000;
    this.reconnectAfterMs = opts.reconnectAfterMs || 5000;
    this.logger = opts.logger || function () {}; // noop
    this.longpoller_timeout = opts.longpoller_timeout || 20000;
    this.endPoint = this.expandEndpoint(endPoint);

    this.resetBufferTimer();
  }

  Socket.prototype.protocol = function protocol() {
    return location.protocol.match(/^https/) ? "wss" : "ws";
  };

  Socket.prototype.expandEndpoint = function expandEndpoint(endPoint) {
    if (endPoint.charAt(0) !== "/") {
      return endPoint;
    }
    if (endPoint.charAt(1) === "/") {
      return "" + this.protocol() + ":" + endPoint;
    }

    return "" + this.protocol() + "://" + location.host + "" + endPoint;
  };

  Socket.prototype.disconnect = function disconnect(callback, code, reason) {
    if (this.conn) {
      this.conn.onclose = function () {}; // noop
      if (code) {
        this.conn.close(code, reason || "");
      } else {
        this.conn.close();
      }
      this.conn = null;
    }
    callback && callback();
  };

  Socket.prototype.connect = function connect() {
    var _this = this;

    this.disconnect(function () {
      _this.conn = new _this.transport(_this.endPoint);
      _this.conn.timeout = _this.longpoller_timeout;
      _this.conn.onopen = function () {
        return _this.onConnOpen();
      };
      _this.conn.onerror = function (error) {
        return _this.onConnError(error);
      };
      _this.conn.onmessage = function (event) {
        return _this.onConnMessage(event);
      };
      _this.conn.onclose = function (event) {
        return _this.onConnClose(event);
      };
    });
  };

  Socket.prototype.resetBufferTimer = function resetBufferTimer() {
    var _this = this;

    clearTimeout(this.sendBufferTimer);
    this.sendBufferTimer = setTimeout(function () {
      return _this.flushSendBuffer();
    }, this.flushEveryMs);
  };

  // Logs the message. Override `this.logger` for specialized logging. noops by default

  Socket.prototype.log = function log(msg) {
    this.logger(msg);
  };

  // Registers callbacks for connection state change events
  //
  // Examples
  //
  //    socket.onError function(error){ alert("An error occurred") }
  //

  Socket.prototype.onOpen = function onOpen(callback) {
    this.stateChangeCallbacks.open.push(callback);
  };

  Socket.prototype.onClose = function onClose(callback) {
    this.stateChangeCallbacks.close.push(callback);
  };

  Socket.prototype.onError = function onError(callback) {
    this.stateChangeCallbacks.error.push(callback);
  };

  Socket.prototype.onMessage = function onMessage(callback) {
    this.stateChangeCallbacks.message.push(callback);
  };

  Socket.prototype.onConnOpen = function onConnOpen() {
    var _this = this;

    clearInterval(this.reconnectTimer);
    if (!this.conn.skipHeartbeat) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = setInterval(function () {
        return _this.sendHeartbeat();
      }, this.heartbeatIntervalMs);
    }
    this.rejoinAll();
    this.stateChangeCallbacks.open.forEach(function (callback) {
      return callback();
    });
  };

  Socket.prototype.onConnClose = function onConnClose(event) {
    var _this = this;

    this.log("WS close:");
    this.log(event);
    clearInterval(this.reconnectTimer);
    clearInterval(this.heartbeatTimer);
    this.reconnectTimer = setInterval(function () {
      return _this.connect();
    }, this.reconnectAfterMs);
    this.stateChangeCallbacks.close.forEach(function (callback) {
      return callback(event);
    });
  };

  Socket.prototype.onConnError = function onConnError(error) {
    this.log("WS error:");
    this.log(error);
    this.stateChangeCallbacks.error.forEach(function (callback) {
      return callback(error);
    });
  };

  Socket.prototype.connectionState = function connectionState() {
    switch (this.conn && this.conn.readyState) {
      case SOCKET_STATES.connecting:
        return "connecting";
      case SOCKET_STATES.open:
        return "open";
      case SOCKET_STATES.closing:
        return "closing";
      default:
        return "closed";
    }
  };

  Socket.prototype.isConnected = function isConnected() {
    return this.connectionState() === "open";
  };

  Socket.prototype.rejoinAll = function rejoinAll() {
    this.channels.forEach(function (chan) {
      return chan.rejoin();
    });
  };

  Socket.prototype.join = function join(topic, message, callback) {
    var chan = new Channel(topic, message, callback, this);
    this.channels.push(chan);
    if (this.isConnected()) {
      chan.rejoin();
    }
    return chan;
  };

  Socket.prototype.leave = function leave(chan) {
    this.channels = this.channels.filter(function (c) {
      return !c.isMember(chan.topic);
    });
  };

  Socket.prototype.push = function push(data) {
    var _this = this;

    var callback = function () {
      return _this.conn.send(JSON.stringify(data));
    };
    if (this.isConnected()) {
      callback();
    } else {
      this.sendBuffer.push(callback);
    }
  };

  // Return the next message ref, accounting for overflows

  Socket.prototype.makeRef = function makeRef() {
    var newRef = this.ref + 1;
    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }

    return this.ref.toString();
  };

  Socket.prototype.sendHeartbeat = function sendHeartbeat() {
    this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.makeRef() });
  };

  Socket.prototype.flushSendBuffer = function flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach(function (callback) {
        return callback();
      });
      this.sendBuffer = [];
    }
    this.resetBufferTimer();
  };

  Socket.prototype.onConnMessage = function onConnMessage(rawMessage) {
    this.log("message received:");
    this.log(rawMessage);

    var _JSON$parse = JSON.parse(rawMessage.data);

    var topic = _JSON$parse.topic;
    var event = _JSON$parse.event;
    var payload = _JSON$parse.payload;

    this.channels.filter(function (chan) {
      return chan.isMember(topic);
    }).forEach(function (chan) {
      return chan.trigger(event, payload);
    });
    this.stateChangeCallbacks.message.forEach(function (callback) {
      callback(topic, event, payload);
    });
  };

  return Socket;
})();

var LongPoller = exports.LongPoller = (function () {
  function LongPoller(endPoint) {
    _classCallCheck(this, LongPoller);

    this.retryInMs = 5000;
    this.endPoint = null;
    this.token = null;
    this.sig = null;
    this.skipHeartbeat = true;
    this.onopen = function () {}; // noop
    this.onerror = function () {}; // noop
    this.onmessage = function () {}; // noop
    this.onclose = function () {}; // noop
    this.upgradeEndpoint = this.normalizeEndpoint(endPoint);
    this.pollEndpoint = this.upgradeEndpoint + (/\/$/.test(endPoint) ? "poll" : "/poll");
    this.readyState = SOCKET_STATES.connecting;

    this.poll();
  }

  LongPoller.prototype.normalizeEndpoint = function normalizeEndpoint(endPoint) {
    return endPoint.replace("ws://", "http://").replace("wss://", "https://");
  };

  LongPoller.prototype.endpointURL = function endpointURL() {
    return this.pollEndpoint + ("?token=" + encodeURIComponent(this.token) + "&sig=" + encodeURIComponent(this.sig));
  };

  LongPoller.prototype.closeAndRetry = function closeAndRetry() {
    this.close();
    this.readyState = SOCKET_STATES.connecting;
  };

  LongPoller.prototype.ontimeout = function ontimeout() {
    this.onerror("timeout");
    this.closeAndRetry();
  };

  LongPoller.prototype.poll = function poll() {
    var _this = this;

    if (!(this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting)) {
      return;
    }

    Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), function (resp) {
      if (resp) {
        var status = resp.status;
        var token = resp.token;
        var sig = resp.sig;
        var messages = resp.messages;

        _this.token = token;
        _this.sig = sig;
      } else {
        var status = 0;
      }

      switch (status) {
        case 200:
          messages.forEach(function (msg) {
            return _this.onmessage({ data: JSON.stringify(msg) });
          });
          _this.poll();
          break;
        case 204:
          _this.poll();
          break;
        case 410:
          _this.readyState = SOCKET_STATES.open;
          _this.onopen();
          _this.poll();
          break;
        case 0:
        case 500:
          _this.onerror();
          _this.closeAndRetry();
          break;
        default:
          throw "unhandled poll status " + status;
      }
    });
  };

  LongPoller.prototype.send = function send(body) {
    var _this = this;

    Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), function (resp) {
      if (!resp || resp.status !== 200) {
        _this.onerror(status);
        _this.closeAndRetry();
      }
    });
  };

  LongPoller.prototype.close = function close(code, reason) {
    this.readyState = SOCKET_STATES.closed;
    this.onclose();
  };

  return LongPoller;
})();

var Ajax = exports.Ajax = (function () {
  function Ajax() {
    _classCallCheck(this, Ajax);
  }

  Ajax.request = function request(method, endPoint, accept, body, timeout, ontimeout, callback) {
    if (window.XDomainRequest) {
      var req = new XDomainRequest(); // IE8, IE9
      this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
    } else {
      var req = window.XMLHttpRequest ? new XMLHttpRequest() : // IE7+, Firefox, Chrome, Opera, Safari
      new ActiveXObject("Microsoft.XMLHTTP"); // IE6, IE5
      this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
    }
  };

  Ajax.xdomainRequest = function xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
    var _this = this;

    req.timeout = timeout;
    req.open(method, endPoint);
    req.onload = function () {
      var response = _this.parseJSON(req.responseText);
      callback && callback(response);
    };
    if (ontimeout) {
      req.ontimeout = ontimeout;
    }

    // Work around bug in IE9 that requires an attached onprogress handler
    req.onprogress = function () {};

    req.send(body);
  };

  Ajax.xhrRequest = function xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
    var _this = this;

    req.timeout = timeout;
    req.open(method, endPoint, true);
    req.setRequestHeader("Content-Type", accept);
    req.onerror = function () {
      callback && callback(null);
    };
    req.onreadystatechange = function () {
      if (req.readyState === _this.states.complete && callback) {
        var response = _this.parseJSON(req.responseText);
        callback(response);
      }
    };
    if (ontimeout) {
      req.ontimeout = ontimeout;
    }

    req.send(body);
  };

  Ajax.parseJSON = function parseJSON(resp) {
    return resp && resp !== "" ? JSON.parse(resp) : null;
  };

  return Ajax;
})();

Ajax.states = { complete: 4 };
 }});
if(typeof(window) === 'object' && !window.Phoenix){ window.Phoenix = require('phoenix') };
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);(typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a))}};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(f,h,$){var a='placeholder' in h.createElement('input'),d='placeholder' in h.createElement('textarea'),i=$.fn,c=$.valHooks,k,j;if(a&&d){j=i.placeholder=function(){return this};j.input=j.textarea=true}else{j=i.placeholder=function(){var l=this;l.filter((a?'textarea':':input')+'[placeholder]').not('.placeholder').bind({'focus.placeholder':b,'blur.placeholder':e}).data('placeholder-enabled',true).trigger('blur.placeholder');return l};j.input=a;j.textarea=d;k={get:function(m){var l=$(m);return l.data('placeholder-enabled')&&l.hasClass('placeholder')?'':m.value},set:function(m,n){var l=$(m);if(!l.data('placeholder-enabled')){return m.value=n}if(n==''){m.value=n;if(m!=h.activeElement){e.call(m)}}else{if(l.hasClass('placeholder')){b.call(m,true,n)||(m.value=n)}else{m.value=n}}return l}};a||(c.input=k);d||(c.textarea=k);$(function(){$(h).delegate('form','submit.placeholder',function(){var l=$('.placeholder',this).each(b);setTimeout(function(){l.each(e)},10)})});$(f).bind('beforeunload.placeholder',function(){$('.placeholder').each(function(){this.value=''})})}function g(m){var l={},n=/^jQuery\d+$/;$.each(m.attributes,function(p,o){if(o.specified&&!n.test(o.name)){l[o.name]=o.value}});return l}function b(m,n){var l=this,o=$(l);if(l.value==o.attr('placeholder')&&o.hasClass('placeholder')){if(o.data('placeholder-password')){o=o.hide().next().show().attr('id',o.removeAttr('id').data('placeholder-id'));if(m===true){return o[0].value=n}o.focus()}else{l.value='';o.removeClass('placeholder');l==h.activeElement&&l.select()}}}function e(){var q,l=this,p=$(l),m=p,o=this.id;if(l.value==''){if(l.type=='password'){if(!p.data('placeholder-textinput')){try{q=p.clone().attr({type:'text'})}catch(n){q=$('<input>').attr($.extend(g(this),{type:'text'}))}q.removeAttr('name').data({'placeholder-password':true,'placeholder-id':o}).bind('focus.placeholder',b);p.data({'placeholder-textinput':q,'placeholder-id':o}).before(q)}p=p.removeAttr('id').hide().prev().attr('id',o).show()}p.addClass('placeholder');p[0].value=p.attr('placeholder')}else{p.removeClass('placeholder')}}}(this,document,jQuery));

/*! jQuery UI - v1.10.3 - 2013-09-06
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js
* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */

(function(e,t){function i(t,i){var s,a,o,r=t.nodeName.toLowerCase();return"area"===r?(s=t.parentNode,a=s.name,t.href&&a&&"map"===s.nodeName.toLowerCase()?(o=e("img[usemap=#"+a+"]")[0],!!o&&n(o)):!1):(/input|select|textarea|button|object/.test(r)?!t.disabled:"a"===r?t.href||i:i)&&n(t)}function n(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var s=0,a=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,n){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),n&&n.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var n,s,a=e(this[0]);a.length&&a[0]!==document;){if(n=a.css("position"),("absolute"===n||"relative"===n||"fixed"===n)&&(s=parseInt(a.css("zIndex"),10),!isNaN(s)&&0!==s))return s;a=a.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++s)})},removeUniqueId:function(){return this.each(function(){a.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,n){return!!e.data(t,n[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var n=e.attr(t,"tabindex"),s=isNaN(n);return(s||n>=0)&&i(t,!s)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,n){function s(t,i,n,s){return e.each(a,function(){i-=parseFloat(e.css(t,"padding"+this))||0,n&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var a="Width"===n?["Left","Right"]:["Top","Bottom"],o=n.toLowerCase(),r={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+n]=function(i){return i===t?r["inner"+n].call(this):this.each(function(){e(this).css(o,s(this,i)+"px")})},e.fn["outer"+n]=function(t,i){return"number"!=typeof t?r["outer"+n].call(this,t):this.each(function(){e(this).css(o,s(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,n){var s,a=e.ui[t].prototype;for(s in n)a.plugins[s]=a.plugins[s]||[],a.plugins[s].push([i,n[s]])},call:function(e,t,i){var n,s=e.plugins[t];if(s&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(n=0;s.length>n;n++)e.options[s[n][0]]&&s[n][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var n=i&&"left"===i?"scrollLeft":"scrollTop",s=!1;return t[n]>0?!0:(t[n]=1,s=t[n]>0,t[n]=0,s)}})})(jQuery);(function(t,e){var i=0,s=Array.prototype.slice,n=t.cleanData;t.cleanData=function(e){for(var i,s=0;null!=(i=e[s]);s++)try{t(i).triggerHandler("remove")}catch(o){}n(e)},t.widget=function(i,s,n){var o,a,r,h,l={},c=i.split(".")[0];i=i.split(".")[1],o=c+"-"+i,n||(n=s,s=t.Widget),t.expr[":"][o.toLowerCase()]=function(e){return!!t.data(e,o)},t[c]=t[c]||{},a=t[c][i],r=t[c][i]=function(t,i){return this._createWidget?(arguments.length&&this._createWidget(t,i),e):new r(t,i)},t.extend(r,a,{version:n.version,_proto:t.extend({},n),_childConstructors:[]}),h=new s,h.options=t.widget.extend({},h.options),t.each(n,function(i,n){return t.isFunction(n)?(l[i]=function(){var t=function(){return s.prototype[i].apply(this,arguments)},e=function(t){return s.prototype[i].apply(this,t)};return function(){var i,s=this._super,o=this._superApply;return this._super=t,this._superApply=e,i=n.apply(this,arguments),this._super=s,this._superApply=o,i}}(),e):(l[i]=n,e)}),r.prototype=t.widget.extend(h,{widgetEventPrefix:a?h.widgetEventPrefix:i},l,{constructor:r,namespace:c,widgetName:i,widgetFullName:o}),a?(t.each(a._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,r,i._proto)}),delete a._childConstructors):s._childConstructors.push(r),t.widget.bridge(i,r)},t.widget.extend=function(i){for(var n,o,a=s.call(arguments,1),r=0,h=a.length;h>r;r++)for(n in a[r])o=a[r][n],a[r].hasOwnProperty(n)&&o!==e&&(i[n]=t.isPlainObject(o)?t.isPlainObject(i[n])?t.widget.extend({},i[n],o):t.widget.extend({},o):o);return i},t.widget.bridge=function(i,n){var o=n.prototype.widgetFullName||i;t.fn[i]=function(a){var r="string"==typeof a,h=s.call(arguments,1),l=this;return a=!r&&h.length?t.widget.extend.apply(null,[a].concat(h)):a,r?this.each(function(){var s,n=t.data(this,o);return n?t.isFunction(n[a])&&"_"!==a.charAt(0)?(s=n[a].apply(n,h),s!==n&&s!==e?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):e):t.error("no such method '"+a+"' for "+i+" widget instance"):t.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+a+"'")}):this.each(function(){var e=t.data(this,o);e?e.option(a||{})._init():t.data(this,o,new n(a,this))}),l}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(e,s){s=t(s||this.defaultElement||this)[0],this.element=t(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=t.widget.extend({},this.options,this._getCreateOptions(),e),this.bindings=t(),this.hoverable=t(),this.focusable=t(),s!==this&&(t.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===s&&this.destroy()}}),this.document=t(s.style?s.ownerDocument:s.document||s),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:t.noop,_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:t.noop,widget:function(){return this.element},option:function(i,s){var n,o,a,r=i;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof i)if(r={},n=i.split("."),i=n.shift(),n.length){for(o=r[i]=t.widget.extend({},this.options[i]),a=0;n.length-1>a;a++)o[n[a]]=o[n[a]]||{},o=o[n[a]];if(i=n.pop(),s===e)return o[i]===e?null:o[i];o[i]=s}else{if(s===e)return this.options[i]===e?null:this.options[i];r[i]=s}return this._setOptions(r),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return this.options[t]=e,"disabled"===t&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!e).attr("aria-disabled",e),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var o,a=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=o=t(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,o=this.widget()),t.each(n,function(n,r){function h(){return i||a.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof r?a[r]:r).apply(a,arguments):e}"string"!=typeof r&&(h.guid=r.guid=r.guid||h.guid||t.guid++);var l=n.match(/^(\w+)\s*(.*)$/),c=l[1]+a.eventNamespace,u=l[2];u?o.delegate(u,c,h):s.bind(c,h)})},_off:function(t,e){e=(e||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(e).undelegate(e)},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){t(e.currentTarget).addClass("ui-state-hover")},mouseleave:function(e){t(e.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){t(e.currentTarget).addClass("ui-state-focus")},focusout:function(e){t(e.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}})})(jQuery);(function(t){var e=!1;t(document).mouseup(function(){e=!1}),t.widget("ui.mouse",{version:"1.10.3",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.bind("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).bind("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!e){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,n=1===i.which,a="string"==typeof this.options.cancel&&i.target.nodeName?t(i.target).closest(this.options.cancel).length:!1;return n&&!a&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===t.data(i.target,this.widgetName+".preventClickEvent")&&t.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return s._mouseMove(t)},this._mouseUpDelegate=function(t){return s._mouseUp(t)},t(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),e=!0,!0)):!0}},_mouseMove:function(e){return t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button?this._mouseUp(e):this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){return t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),!1},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})})(jQuery);(function(t,e){function i(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function s(e,i){return parseInt(t.css(e,i),10)||0}function n(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var a,o=Math.max,r=Math.abs,l=Math.round,h=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;t.position={scrollbarWidth:function(){if(a!==e)return a;var i,s,n=t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=n.children()[0];return t("body").append(n),i=o.offsetWidth,n.css("overflow","scroll"),s=o.offsetWidth,i===s&&(s=n[0].clientWidth),n.remove(),a=i-s},getScrollInfo:function(e){var i=e.isWindow?"":e.element.css("overflow-x"),s=e.isWindow?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,a="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:a?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]);return{element:i,isWindow:s,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},t.fn.position=function(e){if(!e||!e.of)return f.apply(this,arguments);e=t.extend({},e);var a,p,g,m,v,_,b=t(e.of),y=t.position.getWithinInfo(e.within),k=t.position.getScrollInfo(y),w=(e.collision||"flip").split(" "),D={};return _=n(b),b[0].preventDefault&&(e.at="left top"),p=_.width,g=_.height,m=_.offset,v=t.extend({},m),t.each(["my","at"],function(){var t,i,s=(e[this]||"").split(" ");1===s.length&&(s=h.test(s[0])?s.concat(["center"]):c.test(s[0])?["center"].concat(s):["center","center"]),s[0]=h.test(s[0])?s[0]:"center",s[1]=c.test(s[1])?s[1]:"center",t=u.exec(s[0]),i=u.exec(s[1]),D[this]=[t?t[0]:0,i?i[0]:0],e[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===w.length&&(w[1]=w[0]),"right"===e.at[0]?v.left+=p:"center"===e.at[0]&&(v.left+=p/2),"bottom"===e.at[1]?v.top+=g:"center"===e.at[1]&&(v.top+=g/2),a=i(D.at,p,g),v.left+=a[0],v.top+=a[1],this.each(function(){var n,h,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=s(this,"marginLeft"),_=s(this,"marginTop"),x=u+f+s(this,"marginRight")+k.width,C=d+_+s(this,"marginBottom")+k.height,M=t.extend({},v),T=i(D.my,c.outerWidth(),c.outerHeight());"right"===e.my[0]?M.left-=u:"center"===e.my[0]&&(M.left-=u/2),"bottom"===e.my[1]?M.top-=d:"center"===e.my[1]&&(M.top-=d/2),M.left+=T[0],M.top+=T[1],t.support.offsetFractions||(M.left=l(M.left),M.top=l(M.top)),n={marginLeft:f,marginTop:_},t.each(["left","top"],function(i,s){t.ui.position[w[i]]&&t.ui.position[w[i]][s](M,{targetWidth:p,targetHeight:g,elemWidth:u,elemHeight:d,collisionPosition:n,collisionWidth:x,collisionHeight:C,offset:[a[0]+T[0],a[1]+T[1]],my:e.my,at:e.at,within:y,elem:c})}),e.using&&(h=function(t){var i=m.left-M.left,s=i+p-u,n=m.top-M.top,a=n+g-d,l={target:{element:b,left:m.left,top:m.top,width:p,height:g},element:{element:c,left:M.left,top:M.top,width:u,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>a?"top":n>0?"bottom":"middle"};u>p&&p>r(i+s)&&(l.horizontal="center"),d>g&&g>r(n+a)&&(l.vertical="middle"),l.important=o(r(i),r(s))>o(r(n),r(a))?"horizontal":"vertical",e.using.call(this,t,l)}),c.offset(t.extend(M,{using:h}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,l=n-r,h=r+e.collisionWidth-a-n;e.collisionWidth>a?l>0&&0>=h?(i=t.left+l+e.collisionWidth-a-n,t.left+=l-i):t.left=h>0&&0>=l?n:l>h?n+a-e.collisionWidth:n:l>0?t.left+=l:h>0?t.left-=h:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,l=n-r,h=r+e.collisionHeight-a-n;e.collisionHeight>a?l>0&&0>=h?(i=t.top+l+e.collisionHeight-a-n,t.top+=l-i):t.top=h>0&&0>=l?n:l>h?n+a-e.collisionHeight:n:l>0?t.top+=l:h>0?t.top-=h:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,a=n.offset.left+n.scrollLeft,o=n.width,l=n.isWindow?n.scrollLeft:n.offset.left,h=t.left-e.collisionPosition.marginLeft,c=h-l,u=h+e.collisionWidth-o-l,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-o-a,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-l,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,a=n.offset.top+n.scrollTop,o=n.height,l=n.isWindow?n.scrollTop:n.offset.top,h=t.top-e.collisionPosition.marginTop,c=h-l,u=h+e.collisionHeight-o-l,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-o-a,t.top+p+f+g>c&&(0>s||r(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-l,t.top+p+f+g>u&&(i>0||u>r(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,s,n,a,o=document.getElementsByTagName("body")[0],r=document.createElement("div");e=document.createElement(o?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&t.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(a in s)e.style[a]=s[a];e.appendChild(r),i=o||document.documentElement,i.insertBefore(e,i.firstChild),r.style.cssText="position: absolute; left: 10.7432222px;",n=t(r).offset().left,t.support.offsetFractions=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()})(jQuery);(function(t,e){var i="ui-effects-";t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=h(),n=s._rgba=[];return i=i.toLowerCase(),f(l,function(t,a){var o,r=a.re.exec(i),l=r&&a.parse(r),h=a.space||"rgba";return l?(o=s[h](l),s[c[h].cache]=o[c[h].cache],n=s._rgba=o._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,a.transparent),s):a[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var a,o="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,l=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],h=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=h.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),h.fn=t.extend(h.prototype,{parse:function(n,o,r,l){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(o),o=e);var u=this,d=t.type(n),p=this._rgba=[];return o!==e&&(n=[n,o,r,l],d="array"),"string"===d?this.parse(s(n)||a._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof h?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var a=s.cache;f(s.props,function(t,e){if(!u[a]&&s.to){if("alpha"===t||null==n[t])return;u[a]=s.to(u._rgba)}u[a][e.idx]=i(n[t],e,!0)}),u[a]&&0>t.inArray(null,u[a].slice(0,3))&&(u[a][3]=1,s.from&&(u._rgba=s.from(u[a])))}),this):e},is:function(t){var i=h(t),s=!0,n=this;return f(c,function(t,a){var o,r=i[a.cache];return r&&(o=n[a.cache]||a.to&&a.to(n._rgba)||[],f(a.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===o[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=h(t),n=s._space(),a=c[n],o=0===this.alpha()?h("transparent"):this,r=o[a.cache]||a.to(o._rgba),l=r.slice();return s=s[a.cache],f(a.props,function(t,n){var a=n.idx,o=r[a],h=s[a],c=u[n.type]||{};null!==h&&(null===o?l[a]=h:(c.mod&&(h-o>c.mod/2?o+=c.mod:o-h>c.mod/2&&(o-=c.mod)),l[a]=i((h-o)*e+o,n)))}),this[n](l)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=h(e)._rgba;return h(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),s=i.pop();return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),h.fn.parse.prototype=h.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,a=t[2]/255,o=t[3],r=Math.max(s,n,a),l=Math.min(s,n,a),h=r-l,c=r+l,u=.5*c;return e=l===r?0:s===r?60*(n-a)/h+360:n===r?60*(a-s)/h+120:60*(s-n)/h+240,i=0===h?0:.5>=u?h/c:h/(2-c),[Math.round(e)%360,i,u,null==o?1:o]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],a=t[3],o=.5>=s?s*(1+i):s+i-s*i,r=2*s-o;return[Math.round(255*n(r,o,e+1/3)),Math.round(255*n(r,o,e)),Math.round(255*n(r,o,e-1/3)),a]},f(c,function(s,n){var a=n.props,o=n.cache,l=n.to,c=n.from;h.fn[s]=function(s){if(l&&!this[o]&&(this[o]=l(this._rgba)),s===e)return this[o].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[o].slice();return f(a,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=h(c(d)),n[o]=d,n):h(d)},f(a,function(e,i){h.fn[e]||(h.fn[e]=function(n){var a,o=t.type(n),l="alpha"===e?this._hsla?"hsla":"rgba":s,h=this[l](),c=h[i.idx];return"undefined"===o?c:("function"===o&&(n=n.call(this,c),o=t.type(n)),null==n&&i.empty?this:("string"===o&&(a=r.exec(n),a&&(n=c+parseFloat(a[2])*("+"===a[1]?1:-1))),h[i.idx]=n,this[l](h)))})})}),h.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var a,o,r="";if("transparent"!==n&&("string"!==t.type(n)||(a=s(n)))){if(n=h(a||n),!d.rgba&&1!==n._rgba[3]){for(o="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&o&&o.style;)try{r=t.css(o,"backgroundColor"),o=o.parentNode}catch(l){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(l){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=h(e.elem,i),e.end=h(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},h.hook(o),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},a=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,a={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(a[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(a[i]=n[i]);return a}function s(e,i){var s,n,o={};for(s in i)n=i[s],e[s]!==n&&(a[s]||(t.fx.step[s]||!isNaN(parseFloat(n)))&&(o[s]=n));return o}var n=["add","remove","toggle"],a={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(jQuery.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(e,a,o,r){var l=t.speed(a,o,r);return this.queue(function(){var a,o=t(this),r=o.attr("class")||"",h=l.children?o.find("*").addBack():o;h=h.map(function(){var e=t(this);return{el:e,start:i(this)}}),a=function(){t.each(n,function(t,i){e[i]&&o[i+"Class"](e[i])})},a(),h=h.map(function(){return this.end=i(this.el[0]),this.diff=s(this.start,this.end),this}),o.attr("class",r),h=h.map(function(){var e=this,i=t.Deferred(),s=t.extend({},l,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,h.get()).done(function(){a(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),l.complete.call(o[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,a){return s?t.effects.animateClass.call(this,{add:i},s,n,a):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,a){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,a):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(i){return function(s,n,a,o,r){return"boolean"==typeof n||n===e?a?t.effects.animateClass.call(this,n?{add:s}:{remove:s},a,o,r):i.apply(this,arguments):t.effects.animateClass.call(this,{toggle:s},n,a,o)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,a){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,a)}})}(),function(){function s(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function n(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}t.extend(t.effects,{version:"1.10.3",save:function(t,e){for(var s=0;e.length>s;s++)null!==e[s]&&t.data(i+e[s],t[0].style[e[s]])},restore:function(t,s){var n,a;for(a=0;s.length>a;a++)null!==s[a]&&(n=t.data(i+s[a]),n===e&&(n=""),t.css(s[a],n))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},a=document.activeElement;try{a.id}catch(o){a=document.body}return e.wrap(s),(e[0]===a||t.contains(e[0],a))&&t(a).focus(),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).focus()),e},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var a=e.cssUnit(i);a[0]>0&&(n[i]=a[0]*s+a[1])}),n}}),t.fn.extend({effect:function(){function e(e){function s(){t.isFunction(a)&&a.call(n[0]),t.isFunction(e)&&e()}var n=t(this),a=i.complete,r=i.mode;(n.is(":hidden")?"hide"===r:"show"===r)?(n[r](),s()):o.call(n[0],i,s)}var i=s.apply(this,arguments),n=i.mode,a=i.queue,o=t.effects.effect[i.effect];return t.fx.off||!o?n?this[n](i.duration,i.complete):this.each(function(){i.complete&&i.complete.call(this)}):a===!1?this.each(e):this.queue(a||"fx",e)},show:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="show",this.effect.call(this,i)}}(t.fn.show),hide:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="hide",this.effect.call(this,i)}}(t.fn.hide),toggle:function(t){return function(e){if(n(e)||"boolean"==typeof e)return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s}})}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}()})(jQuery);(function(t){var e=/up|down|vertical/,i=/up|left|vertical|horizontal/;t.effects.effect.blind=function(s,n){var a,o,r,l=t(this),h=["position","top","bottom","left","right","height","width"],c=t.effects.setMode(l,s.mode||"hide"),u=s.direction||"up",d=e.test(u),p=d?"height":"width",f=d?"top":"left",g=i.test(u),m={},v="show"===c;l.parent().is(".ui-effects-wrapper")?t.effects.save(l.parent(),h):t.effects.save(l,h),l.show(),a=t.effects.createWrapper(l).css({overflow:"hidden"}),o=a[p](),r=parseFloat(a.css(f))||0,m[p]=v?o:0,g||(l.css(d?"bottom":"right",0).css(d?"top":"left","auto").css({position:"absolute"}),m[f]=v?r:o+r),v&&(a.css(p,0),g||a.css(f,r+o)),a.animate(m,{duration:s.duration,easing:s.easing,queue:!1,complete:function(){"hide"===c&&l.hide(),t.effects.restore(l,h),t.effects.removeWrapper(l),n()}})}})(jQuery);(function(t){t.effects.effect.bounce=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","height","width"],l=t.effects.setMode(o,e.mode||"effect"),h="hide"===l,c="show"===l,u=e.direction||"up",d=e.distance,p=e.times||5,f=2*p+(c||h?1:0),g=e.duration/f,m=e.easing,v="up"===u||"down"===u?"top":"left",_="up"===u||"left"===u,b=o.queue(),y=b.length;for((c||h)&&r.push("opacity"),t.effects.save(o,r),o.show(),t.effects.createWrapper(o),d||(d=o["top"===v?"outerHeight":"outerWidth"]()/3),c&&(a={opacity:1},a[v]=0,o.css("opacity",0).css(v,_?2*-d:2*d).animate(a,g,m)),h&&(d/=Math.pow(2,p-1)),a={},a[v]=0,s=0;p>s;s++)n={},n[v]=(_?"-=":"+=")+d,o.animate(n,g,m).animate(a,g,m),d=h?2*d:d/2;h&&(n={opacity:0},n[v]=(_?"-=":"+=")+d,o.animate(n,g,m)),o.queue(function(){h&&o.hide(),t.effects.restore(o,r),t.effects.removeWrapper(o),i()}),y>1&&b.splice.apply(b,[1,0].concat(b.splice(y,f+1))),o.dequeue()}})(jQuery);(function(t){t.effects.effect.clip=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","height","width"],l=t.effects.setMode(o,e.mode||"hide"),h="show"===l,c=e.direction||"vertical",u="vertical"===c,d=u?"height":"width",p=u?"top":"left",f={};t.effects.save(o,r),o.show(),s=t.effects.createWrapper(o).css({overflow:"hidden"}),n="IMG"===o[0].tagName?s:o,a=n[d](),h&&(n.css(d,0),n.css(p,a/2)),f[d]=h?a:0,f[p]=h?0:a/2,n.animate(f,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){h||o.hide(),t.effects.restore(o,r),t.effects.removeWrapper(o),i()}})}})(jQuery);(function(t){t.effects.effect.drop=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","opacity","height","width"],o=t.effects.setMode(n,e.mode||"hide"),r="show"===o,l=e.direction||"left",h="up"===l||"down"===l?"top":"left",c="up"===l||"left"===l?"pos":"neg",u={opacity:r?1:0};t.effects.save(n,a),n.show(),t.effects.createWrapper(n),s=e.distance||n["top"===h?"outerHeight":"outerWidth"](!0)/2,r&&n.css("opacity",0).css(h,"pos"===c?-s:s),u[h]=(r?"pos"===c?"+=":"-=":"pos"===c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}})}})(jQuery);(function(t){t.effects.effect.explode=function(e,i){function s(){b.push(this),b.length===u*d&&n()}function n(){p.css({visibility:"visible"}),t(b).remove(),g||p.hide(),i()}var a,o,r,l,h,c,u=e.pieces?Math.round(Math.sqrt(e.pieces)):3,d=u,p=t(this),f=t.effects.setMode(p,e.mode||"hide"),g="show"===f,m=p.show().css("visibility","hidden").offset(),v=Math.ceil(p.outerWidth()/d),_=Math.ceil(p.outerHeight()/u),b=[];for(a=0;u>a;a++)for(l=m.top+a*_,c=a-(u-1)/2,o=0;d>o;o++)r=m.left+o*v,h=o-(d-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-o*v,top:-a*_}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:v,height:_,left:r+(g?h*v:0),top:l+(g?c*_:0),opacity:g?0:1}).animate({left:r+(g?0:h*v),top:l+(g?0:c*_),opacity:g?1:0},e.duration||500,e.easing,s)}})(jQuery);(function(t){t.effects.effect.fade=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"toggle");s.animate({opacity:n},{queue:!1,duration:e.duration,easing:e.easing,complete:i})}})(jQuery);(function(t){t.effects.effect.fold=function(e,i){var s,n,a=t(this),o=["position","top","bottom","left","right","height","width"],r=t.effects.setMode(a,e.mode||"hide"),l="show"===r,h="hide"===r,c=e.size||15,u=/([0-9]+)%/.exec(c),d=!!e.horizFirst,p=l!==d,f=p?["width","height"]:["height","width"],g=e.duration/2,m={},v={};t.effects.save(a,o),a.show(),s=t.effects.createWrapper(a).css({overflow:"hidden"}),n=p?[s.width(),s.height()]:[s.height(),s.width()],u&&(c=parseInt(u[1],10)/100*n[h?0:1]),l&&s.css(d?{height:0,width:c}:{height:c,width:0}),m[f[0]]=l?n[0]:c,v[f[1]]=l?n[1]:0,s.animate(m,g,e.easing).animate(v,g,e.easing,function(){h&&a.hide(),t.effects.restore(a,o),t.effects.removeWrapper(a),i()})}})(jQuery);(function(t){t.effects.effect.highlight=function(e,i){var s=t(this),n=["backgroundImage","backgroundColor","opacity"],a=t.effects.setMode(s,e.mode||"show"),o={backgroundColor:s.css("backgroundColor")};"hide"===a&&(o.opacity=0),t.effects.save(s,n),s.show().css({backgroundImage:"none",backgroundColor:e.color||"#ffff99"}).animate(o,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===a&&s.hide(),t.effects.restore(s,n),i()}})}})(jQuery);(function(t){t.effects.effect.pulsate=function(e,i){var s,n=t(this),a=t.effects.setMode(n,e.mode||"show"),o="show"===a,r="hide"===a,l=o||"hide"===a,h=2*(e.times||5)+(l?1:0),c=e.duration/h,u=0,d=n.queue(),p=d.length;for((o||!n.is(":visible"))&&(n.css("opacity",0).show(),u=1),s=1;h>s;s++)n.animate({opacity:u},c,e.easing),u=1-u;n.animate({opacity:u},c,e.easing),n.queue(function(){r&&n.hide(),i()}),p>1&&d.splice.apply(d,[1,0].concat(d.splice(p,h+1))),n.dequeue()}})(jQuery);(function(t){t.effects.effect.puff=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"hide"),a="hide"===n,o=parseInt(e.percent,10)||150,r=o/100,l={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()};t.extend(e,{effect:"scale",queue:!1,fade:!0,mode:n,complete:i,percent:a?o:100,from:a?l:{height:l.height*r,width:l.width*r,outerHeight:l.outerHeight*r,outerWidth:l.outerWidth*r}}),s.effect(e)},t.effects.effect.scale=function(e,i){var s=t(this),n=t.extend(!0,{},e),a=t.effects.setMode(s,e.mode||"effect"),o=parseInt(e.percent,10)||(0===parseInt(e.percent,10)?0:"hide"===a?0:100),r=e.direction||"both",l=e.origin,h={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()},c={y:"horizontal"!==r?o/100:1,x:"vertical"!==r?o/100:1};n.effect="size",n.queue=!1,n.complete=i,"effect"!==a&&(n.origin=l||["middle","center"],n.restore=!0),n.from=e.from||("show"===a?{height:0,width:0,outerHeight:0,outerWidth:0}:h),n.to={height:h.height*c.y,width:h.width*c.x,outerHeight:h.outerHeight*c.y,outerWidth:h.outerWidth*c.x},n.fade&&("show"===a&&(n.from.opacity=0,n.to.opacity=1),"hide"===a&&(n.from.opacity=1,n.to.opacity=0)),s.effect(n)},t.effects.effect.size=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","width","height","overflow","opacity"],l=["position","top","bottom","left","right","overflow","opacity"],h=["width","height","overflow"],c=["fontSize"],u=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],d=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=t.effects.setMode(o,e.mode||"effect"),f=e.restore||"effect"!==p,g=e.scale||"both",m=e.origin||["middle","center"],v=o.css("position"),_=f?r:l,b={height:0,width:0,outerHeight:0,outerWidth:0};"show"===p&&o.show(),s={height:o.height(),width:o.width(),outerHeight:o.outerHeight(),outerWidth:o.outerWidth()},"toggle"===e.mode&&"show"===p?(o.from=e.to||b,o.to=e.from||s):(o.from=e.from||("show"===p?b:s),o.to=e.to||("hide"===p?b:s)),a={from:{y:o.from.height/s.height,x:o.from.width/s.width},to:{y:o.to.height/s.height,x:o.to.width/s.width}},("box"===g||"both"===g)&&(a.from.y!==a.to.y&&(_=_.concat(u),o.from=t.effects.setTransition(o,u,a.from.y,o.from),o.to=t.effects.setTransition(o,u,a.to.y,o.to)),a.from.x!==a.to.x&&(_=_.concat(d),o.from=t.effects.setTransition(o,d,a.from.x,o.from),o.to=t.effects.setTransition(o,d,a.to.x,o.to))),("content"===g||"both"===g)&&a.from.y!==a.to.y&&(_=_.concat(c).concat(h),o.from=t.effects.setTransition(o,c,a.from.y,o.from),o.to=t.effects.setTransition(o,c,a.to.y,o.to)),t.effects.save(o,_),o.show(),t.effects.createWrapper(o),o.css("overflow","hidden").css(o.from),m&&(n=t.effects.getBaseline(m,s),o.from.top=(s.outerHeight-o.outerHeight())*n.y,o.from.left=(s.outerWidth-o.outerWidth())*n.x,o.to.top=(s.outerHeight-o.to.outerHeight)*n.y,o.to.left=(s.outerWidth-o.to.outerWidth)*n.x),o.css(o.from),("content"===g||"both"===g)&&(u=u.concat(["marginTop","marginBottom"]).concat(c),d=d.concat(["marginLeft","marginRight"]),h=r.concat(u).concat(d),o.find("*[width]").each(function(){var i=t(this),s={height:i.height(),width:i.width(),outerHeight:i.outerHeight(),outerWidth:i.outerWidth()};f&&t.effects.save(i,h),i.from={height:s.height*a.from.y,width:s.width*a.from.x,outerHeight:s.outerHeight*a.from.y,outerWidth:s.outerWidth*a.from.x},i.to={height:s.height*a.to.y,width:s.width*a.to.x,outerHeight:s.height*a.to.y,outerWidth:s.width*a.to.x},a.from.y!==a.to.y&&(i.from=t.effects.setTransition(i,u,a.from.y,i.from),i.to=t.effects.setTransition(i,u,a.to.y,i.to)),a.from.x!==a.to.x&&(i.from=t.effects.setTransition(i,d,a.from.x,i.from),i.to=t.effects.setTransition(i,d,a.to.x,i.to)),i.css(i.from),i.animate(i.to,e.duration,e.easing,function(){f&&t.effects.restore(i,h)})})),o.animate(o.to,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){0===o.to.opacity&&o.css("opacity",o.from.opacity),"hide"===p&&o.hide(),t.effects.restore(o,_),f||("static"===v?o.css({position:"relative",top:o.to.top,left:o.to.left}):t.each(["top","left"],function(t,e){o.css(e,function(e,i){var s=parseInt(i,10),n=t?o.to.left:o.to.top;return"auto"===i?n+"px":s+n+"px"})})),t.effects.removeWrapper(o),i()}})}})(jQuery);(function(t){t.effects.effect.shake=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","height","width"],o=t.effects.setMode(n,e.mode||"effect"),r=e.direction||"left",l=e.distance||20,h=e.times||3,c=2*h+1,u=Math.round(e.duration/c),d="up"===r||"down"===r?"top":"left",p="up"===r||"left"===r,f={},g={},m={},v=n.queue(),_=v.length;for(t.effects.save(n,a),n.show(),t.effects.createWrapper(n),f[d]=(p?"-=":"+=")+l,g[d]=(p?"+=":"-=")+2*l,m[d]=(p?"-=":"+=")+2*l,n.animate(f,u,e.easing),s=1;h>s;s++)n.animate(g,u,e.easing).animate(m,u,e.easing);n.animate(g,u,e.easing).animate(f,u/2,e.easing).queue(function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}),_>1&&v.splice.apply(v,[1,0].concat(v.splice(_,c+1))),n.dequeue()}})(jQuery);(function(t){t.effects.effect.slide=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","width","height"],o=t.effects.setMode(n,e.mode||"show"),r="show"===o,l=e.direction||"left",h="up"===l||"down"===l?"top":"left",c="up"===l||"left"===l,u={};t.effects.save(n,a),n.show(),s=e.distance||n["top"===h?"outerHeight":"outerWidth"](!0),t.effects.createWrapper(n).css({overflow:"hidden"}),r&&n.css(h,c?isNaN(s)?"-"+s:-s:s),u[h]=(r?c?"+=":"-=":c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}})}})(jQuery);(function(t){t.effects.effect.transfer=function(e,i){var s=t(this),n=t(e.to),a="fixed"===n.css("position"),o=t("body"),r=a?o.scrollTop():0,l=a?o.scrollLeft():0,h=n.offset(),c={top:h.top-r,left:h.left-l,height:n.innerHeight(),width:n.innerWidth()},d=s.offset(),u=t("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(e.className).css({top:d.top-r,left:d.left-l,height:s.innerHeight(),width:s.innerWidth(),position:a?"fixed":"absolute"}).animate(c,e.duration,e.easing,function(){u.remove(),i()})}})(jQuery);

/*! jquery.slimscroll */
/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.1
 *
 */
(function(f){jQuery.fn.extend({slimScroll:function(h){var a=f.extend({width:"auto",height:"250px",size:"7px",color:"#000",position:"right",distance:"1px",start:"top",opacity:0.4,alwaysVisible:!1,disableFadeOut:!1,railVisible:!1,railColor:"#333",railOpacity:0.2,railDraggable:!0,railClass:"slimScrollRail",barClass:"slimScrollBar",wrapperClass:"slimScrollDiv",allowPageScroll:!1,wheelStep:20,touchScrollStep:200,borderRadius:"7px",railBorderRadius:"7px"},h);this.each(function(){function r(d){if(s){d=d||
window.event;var c=0;d.wheelDelta&&(c=-d.wheelDelta/120);d.detail&&(c=d.detail/3);f(d.target||d.srcTarget||d.srcElement).closest("."+a.wrapperClass).is(b.parent())&&m(c,!0);d.preventDefault&&!k&&d.preventDefault();k||(d.returnValue=!1)}}function m(d,f,h){k=!1;var e=d,g=b.outerHeight()-c.outerHeight();f&&(e=parseInt(c.css("top"))+d*parseInt(a.wheelStep)/100*c.outerHeight(),e=Math.min(Math.max(e,0),g),e=0<d?Math.ceil(e):Math.floor(e),c.css({top:e+"px"}));l=parseInt(c.css("top"))/(b.outerHeight()-c.outerHeight());
e=l*(b[0].scrollHeight-b.outerHeight());h&&(e=d,d=e/b[0].scrollHeight*b.outerHeight(),d=Math.min(Math.max(d,0),g),c.css({top:d+"px"}));b.scrollTop(e);b.trigger("slimscrolling",~~e);v();p()}function C(){window.addEventListener?(this.addEventListener("DOMMouseScroll",r,!1),this.addEventListener("mousewheel",r,!1),this.addEventListener("MozMousePixelScroll",r,!1)):document.attachEvent("onmousewheel",r)}function w(){u=Math.max(b.outerHeight()/b[0].scrollHeight*b.outerHeight(),D);c.css({height:u+"px"});
var a=u==b.outerHeight()?"none":"block";c.css({display:a})}function v(){w();clearTimeout(A);l==~~l?(k=a.allowPageScroll,B!=l&&b.trigger("slimscroll",0==~~l?"top":"bottom")):k=!1;B=l;u>=b.outerHeight()?k=!0:(c.stop(!0,!0).fadeIn("fast"),a.railVisible&&g.stop(!0,!0).fadeIn("fast"))}function p(){a.alwaysVisible||(A=setTimeout(function(){a.disableFadeOut&&s||(x||y)||(c.fadeOut("slow"),g.fadeOut("slow"))},1E3))}var s,x,y,A,z,u,l,B,D=30,k=!1,b=f(this);if(b.parent().hasClass(a.wrapperClass)){var n=b.scrollTop(),
c=b.parent().find("."+a.barClass),g=b.parent().find("."+a.railClass);w();if(f.isPlainObject(h)){if("height"in h&&"auto"==h.height){b.parent().css("height","auto");b.css("height","auto");var q=b.parent().parent().height();b.parent().css("height",q);b.css("height",q)}if("scrollTo"in h)n=parseInt(a.scrollTo);else if("scrollBy"in h)n+=parseInt(a.scrollBy);else if("destroy"in h){c.remove();g.remove();b.unwrap();return}m(n,!1,!0)}}else{a.height="auto"==a.height?b.parent().height():a.height;n=f("<div></div>").addClass(a.wrapperClass).css({position:"relative",
overflow:"hidden",width:a.width,height:a.height});b.css({overflow:"hidden",width:a.width,height:a.height});var g=f("<div></div>").addClass(a.railClass).css({width:a.size,height:"100%",position:"absolute",top:0,display:a.alwaysVisible&&a.railVisible?"block":"none","border-radius":a.railBorderRadius,background:a.railColor,opacity:a.railOpacity,zIndex:90}),c=f("<div></div>").addClass(a.barClass).css({background:a.color,width:a.size,position:"absolute",top:0,opacity:a.opacity,display:a.alwaysVisible?
"block":"none","border-radius":a.borderRadius,BorderRadius:a.borderRadius,MozBorderRadius:a.borderRadius,WebkitBorderRadius:a.borderRadius,zIndex:99}),q="right"==a.position?{right:a.distance}:{left:a.distance};g.css(q);c.css(q);b.wrap(n);b.parent().append(c);b.parent().append(g);a.railDraggable&&c.bind("mousedown",function(a){var b=f(document);y=!0;t=parseFloat(c.css("top"));pageY=a.pageY;b.bind("mousemove.slimscroll",function(a){currTop=t+a.pageY-pageY;c.css("top",currTop);m(0,c.position().top,!1)});
b.bind("mouseup.slimscroll",function(a){y=!1;p();b.unbind(".slimscroll")});return!1}).bind("selectstart.slimscroll",function(a){a.stopPropagation();a.preventDefault();return!1});g.hover(function(){v()},function(){p()});c.hover(function(){x=!0},function(){x=!1});b.hover(function(){s=!0;v();p()},function(){s=!1;p()});b.bind("touchstart",function(a,b){a.originalEvent.touches.length&&(z=a.originalEvent.touches[0].pageY)});b.bind("touchmove",function(b){k||b.originalEvent.preventDefault();b.originalEvent.touches.length&&
(m((z-b.originalEvent.touches[0].pageY)/a.touchScrollStep,!0),z=b.originalEvent.touches[0].pageY)});w();"bottom"===a.start?(c.css({top:b.outerHeight()-c.outerHeight()}),m(0,!0)):"top"!==a.start&&(m(f(a.start).position().top,null,!0),a.alwaysVisible||c.hide());C()}});return this}});jQuery.fn.extend({slimscroll:jQuery.fn.slimScroll})})(jQuery);

/*! sprintf.js | Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro> | 3 clause BSD license */
(function(e){function r(e){return Object.prototype.toString.call(e).slice(8,-1).toLowerCase()}function i(e,t){for(var n=[];t>0;n[--t]=e);return n.join("")}var t=function(){return t.cache.hasOwnProperty(arguments[0])||(t.cache[arguments[0]]=t.parse(arguments[0])),t.format.call(null,t.cache[arguments[0]],arguments)};t.format=function(e,n){var s=1,o=e.length,u="",a,f=[],l,c,h,p,d,v;for(l=0;l<o;l++){u=r(e[l]);if(u==="string")f.push(e[l]);else if(u==="array"){h=e[l];if(h[2]){a=n[s];for(c=0;c<h[2].length;c++){if(!a.hasOwnProperty(h[2][c]))throw t('[sprintf] property "%s" does not exist',h[2][c]);a=a[h[2][c]]}}else h[1]?a=n[h[1]]:a=n[s++];if(/[^s]/.test(h[8])&&r(a)!="number")throw t("[sprintf] expecting number but found %s",r(a));switch(h[8]){case"b":a=a.toString(2);break;case"c":a=String.fromCharCode(a);break;case"d":a=parseInt(a,10);break;case"e":a=h[7]?a.toExponential(h[7]):a.toExponential();break;case"f":a=h[7]?parseFloat(a).toFixed(h[7]):parseFloat(a);break;case"o":a=a.toString(8);break;case"s":a=(a=String(a))&&h[7]?a.substring(0,h[7]):a;break;case"u":a>>>=0;break;case"x":a=a.toString(16);break;case"X":a=a.toString(16).toUpperCase()}a=/[def]/.test(h[8])&&h[3]&&a>=0?"+"+a:a,d=h[4]?h[4]=="0"?"0":h[4].charAt(1):" ",v=h[6]-String(a).length,p=h[6]?i(d,v):"",f.push(h[5]?a+p:p+a)}}return f.join("")},t.cache={},t.parse=function(e){var t=e,n=[],r=[],i=0;while(t){if((n=/^[^\x25]+/.exec(t))!==null)r.push(n[0]);else if((n=/^\x25{2}/.exec(t))!==null)r.push("%");else{if((n=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(t))===null)throw"[sprintf] huh?";if(n[2]){i|=1;var s=[],o=n[2],u=[];if((u=/^([a-z_][a-z_\d]*)/i.exec(o))===null)throw"[sprintf] huh?";s.push(u[1]);while((o=o.substring(u[0].length))!=="")if((u=/^\.([a-z_][a-z_\d]*)/i.exec(o))!==null)s.push(u[1]);else{if((u=/^\[(\d+)\]/.exec(o))===null)throw"[sprintf] huh?";s.push(u[1])}n[2]=s}else i|=2;if(i===3)throw"[sprintf] mixing positional and named placeholders is not (yet) supported";r.push(n)}t=t.substring(n[0].length)}return r};var n=function(e,n,r){return r=n.slice(0),r.splice(0,0,e),t.apply(null,r)};e.sprintf=t,e.vsprintf=n})(typeof exports!="undefined"?exports:window);

function guid() {
	function _p8(s) {
		var p = (Math.random().toString(16)+"000000000").substr(2,8);
		return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
	}
	return _p8() + _p8(true) + _p8(true) + _p8();
}

;require.register("web/static/js/game", function(exports, require, module) {
"use strict";

var Socket = require("phoenix").Socket;

var GAME_SINGLE_PLAYER_WAIT_TIME = 3;

var user = null;

(function () {
  hljs.tabReplace = "    ";

  var socket = new Socket("/ws");
  socket.connect();

  var channel = null;

  var GameState = function GameState() {
    this.gameStatus = ko.observable("Loading...");
    this.gameStatusCss = ko.observable("");
    this.timer = ko.observable("");
    this.timerCss = ko.observable("");
    this.timerRunning = ko.observable(false);
    this.started = ko.observable(false);
    this.gamecode = ko.observable("");
    this.projectName = ko.observable("");
    this.langCss = ko.observable("");
    this.isMultiplayer = ko.observable(false);
    this.players = ko.observableArray();
  };

  var playerMapping = {
    player0: "success",
    player1: "info",
    player2: "warning",
    player3: "danger"
  };

  var Player = function Player(id, numId, name) {
    this.id = id;
    this.name = ko.observable(name);
    this.percentage = ko.observable(0);
    this.cssClass = ko.observable("player" + numId);
    this.colorClass = ko.observable(playerMapping[this.cssClass()]);
  };

  Player.prototype.formattedName = function (n) {
    return this.name().length > n ? this.name().substr(0, n - 1) + "&hellip;" : this.name();
  };

  var viewModel = {
    loaded: ko.observable(false),
    loading: ko.observable(false),
    completionText: ko.observable(""),
    stats: {
      time: ko.observable(""),
      speed: ko.observable(0),
      typeables: ko.observable(0),
      keystrokes: ko.observable(0),
      percentUnproductive: ko.observable(0),
      mistakes: ko.observable(0)
    },
    game: new GameState(),
    hideCompletionDialog: function hideCompletionDialog() {
      $("#completion-dialog").modal("hide");
    }
  };

  ko.applyBindings(viewModel);

  var $gamecode = null;

  var game = null;
  var exercise = null;
  var nonTypeables = null;

  var CodeCursor = function CodeCursor(cfg) {
    this.playerId = cfg.playerId;
    this.playerName = cfg.playerName;
    this.cursor = cfg.cursor;
    this.code = cfg.code;
    this.codeLength = cfg.code.length;
    this.pos = 0;
    this.keystrokes = 0;
    this.isMistaken = false;
    this.mistakePathLength = 0;
    this.mistakes = 0;
    this.mistakePositions = [];

    this.isMainPlayer = cfg.isMainPlayer || false;

    this.onCorrectKey = cfg.onCorrectKey || function () {};
    this.onAdvanceCursor = cfg.onAdvanceCursor || function () {};
    this.onRetreatCursor = cfg.onRetreatCursor || function () {};
    this.onGameComplete = cfg.onGameComplete || function () {};

    this.cursor.addClass(this.playerName);
  };

  CodeCursor.prototype.processKey = function (key) {
    if (this.isMistaken) {
      this.mistakePathKey();
    } else if (key === this.code.charAt(this.pos)) {
      this.correctKey();
    } else {
      this.incorrectKey();
    }
  };

  CodeCursor.prototype.advanceCursor = function () {
    this.advanceCursorWithClass(this.playerName);
  };

  CodeCursor.prototype.advanceCursorWithClass = function (curClass, trailingClass) {
    this.keystrokes++;
    this.pos++;

    this.cursor.removeClass(curClass);
    if (this.isMainPlayer) {
      this.cursor.removeClass("untyped");
      this.cursor.addClass("typed");
    }
    this.cursor.addClass(trailingClass);

    this.cursor = this.cursor.nextAll(".code-char").first();
    this.cursor.addClass(curClass);

    this.onAdvanceCursor.call(this, this);
  };

  CodeCursor.prototype.retreatCursor = function () {
    this.retreatCursorWithClass(this.playerName);
  };

  CodeCursor.prototype.retreatCursorWithClass = function (curClass, trailingClass) {
    this.keystrokes++;
    this.pos--;
    this.mistakePathLength--;

    this.cursor.removeClass(curClass);
    this.cursor = this.cursor.prevAll(".code-char").first();

    this.cursor.removeClass(trailingClass);
    if (this.isMainPlayer) {
      this.cursor.removeClass("typed");
      this.cursor.addClass("untyped");
    }
    this.cursor.addClass(curClass);

    this.onRetreatCursor.call(this, this);
  };

  CodeCursor.prototype.correctKey = function () {
    this.advanceCursorWithClass(this.playerName);

    this.onCorrectKey.call(this, this);
    if (this.pos === this.codeLength) {
      this.onGameComplete.call(this, this);
    }
  };

  CodeCursor.prototype.incorrectKey = function () {
    if (this.pos < this.codeLength - 1) {
      this.isMistaken = true;
      this.mistakes++;
      this.mistakePositions.push(this.pos);
      this.advanceCursorWithClass(this.playerName, "mistake");
      this.mistakePathLength++;
    }
    this.cursor.addClass("mistaken");
  };

  CodeCursor.prototype.mistakePathKey = function () {
    if (this.pos < this.codeLength - 1) {
      if (this.mistakePathLength < 10) {
        this.advanceCursorWithClass(this.playerName + " mistaken", "mistake-path");
        this.mistakePathLength++;
      }
    }
  };

  CodeCursor.prototype.backspaceKey = function () {
    if (this.isMistaken) {
      this.retreatCursorWithClass(this.playerName + " mistaken", "mistake-path mistake");

      if (this.mistakePathLength === 0) {
        this.isMistaken = false;
        this.cursor.removeClass("mistaken");
      }
    }
  };

  CodeCursor.prototype.destroy = function () {
    this.cursor.removeClass(this.playerName);
  };

  var state = {
    time: null,
    startTime: null,
    code: null,
    playerCursor: null,
    opponents: 0,
    opponentCursors: {}
  };

  var bindCodeCharacters = function bindCodeCharacters() {
    $gamecode = $("#gamecode");

    var codemap = [];
    var $contents = $gamecode.contents();

    _.each($contents, function (elem, elIdx) {
      var $elem = $(elem);

      if ($elem.is(nonTypeables)) {
        // Handle special case of end-of-line comment
        var $prev = $($contents.get(elIdx - 1)),
            $next = $($contents.get(elIdx + 1));

        if ($prev && $next) {
          // End-of-line comment is preceded by non-newline and
          // followed by newline
          var isEndOfLineComment = !$prev.text().match(/\n\s*$/) && $next.text().charAt(0) === "\n";

          if (isEndOfLineComment) {
            // Add the return at the end of the previous
            // element
            codemap.push({
              char: "\n",
              beforeComment: true,
              idx: $prev.text().search(/\s*$/),
              elIdx: elIdx - 1,
              el: $prev
            });
          }
        }
        return;
      }

      var text = $elem.text();
      _.each(text, function (s, i) {
        codemap.push({
          char: s,
          beforeComment: false,
          idx: i,
          elIdx: elIdx,
          el: $elem
        });
      });
    });

    var iterativeFilter = function iterativeFilter(collection, state, loopFn) {
      var indices = {};
      var addSection = function addSection(lastIdx, curIdx) {
        var start = lastIdx + 1,
            howMany = curIdx - start;

        if (howMany > 0) {
          for (var i = start; i < start + howMany; i++) {
            indices[i] = true;
          }
        }
      };

      _.each(collection, function (piece, i) {
        loopFn.call(state, piece, i, addSection);
      });

      return _.filter(collection, function (piece, i) {
        return !indices[i];
      });
    };

    codemap = iterativeFilter(codemap, {
      leadingSearch: true,
      trailingSearch: false,
      lastNewline: -1,
      lastTypeable: -1,
      setMode: function setMode(mode) {
        this.leadingSearch = mode === "leading";
        this.trailingSearch = mode === "trailing";
      }
    }, function (piece, i, addSection) {
      if (piece.char === " " || piece.char === "\t") {
        // Skip over
        return;
      } else if (piece.char === "\n") {
        // New line
        if (this.trailingSearch) {
          this.setMode("leading");
          addSection(this.lastTypeable, i);
        }
        this.lastNewline = i;
      } else {
        // Typeable
        if (this.leadingSearch) {
          this.setMode("trailing");
          addSection(this.lastNewline, i);
        }
        this.lastTypeable = i;
      }
    });

    codemap = iterativeFilter(codemap, {
      firstTypeableFound: false,
      newlineFound: false,
      typeableFound: false,
      lastRelevantNewline: -1,
      setFound: function setFound(found) {
        this.newlineFound = found === "newline";
        this.typeableFound = found === "typeable";
        if (found === "typeable") {
          this.firstTypeableFound = true;
        }
      }
    }, function (piece, i, addSection) {
      if (piece.char === " " || piece.char === "\t") {
        // Skip over
        return;
      } else if (piece.char === "\n") {
        // Newline
        if (this.firstTypeableFound && !this.newlineFound) {
          this.lastRelevantNewline = i;
        }
        this.setFound("newline");
      } else {
        if (this.newlineFound) {
          addSection(this.lastRelevantNewline, i);
        }
        this.setFound("typeable");
      }
    });

    var isTextNode = function isTextNode(el) {
      return el.get(0).nodeType === 3;
    };

    // Group remaining code chars by original element, and loop through
    // every element group and replace the element's text content with the
    // wrapped code chars
    var groupedCodemap = _.groupBy(codemap, function (piece) {
      return piece.elIdx;
    });
    _.each(groupedCodemap, function (codeGroup) {
      var $elem = codeGroup[0].el,
          text = $elem.text();

      var collapseCodeGroup = function collapseCodeGroup(codeGroup, text) {
        var chunks = [],
            idx = 0;

        _.each(codeGroup, function (piece) {
          chunks.push(text.slice(idx, piece.idx));
          idx = piece.idx + 1;

          if (piece.char === "\n") {
            chunks.push("<span class=\"code-char return-char\"></span>");
            if (!piece.beforeComment) {
              chunks.push("\n");
            }
          } else {
            chunks.push("<span class=\"code-char\">" + piece.char + "</span>");
          }
        });

        chunks.push(text.slice(idx, text.length));
        return chunks.join("");
      };

      if (isTextNode($elem)) {
        $elem.replaceWith(collapseCodeGroup(codeGroup, text));
      } else {
        // Re-add highlighting classes to the new spans
        var oldClass = $elem.attr("class");
        var $newContent = $(collapseCodeGroup(codeGroup, text));
        $elem.replaceWith($newContent);
        $newContent.addClass(oldClass);
      }
    });
    $gamecode.find(".code-char").addClass("untyped");
  };

  var checkGameState = function checkGameState() {
    viewModel.game.timerRunning(game.starting || game.started);
    viewModel.game.started(game.started);
    addRemoveOpponents();

    if (game.started) {
      setStarting();
      startGame();
    } else if (game.starting) {
      setStarting();
    } else {
      resetStarting();
    }
  };

  var fullyStarted = false;
  var startGame = function startGame() {
    if (fullyStarted) {
      return;
    }

    viewModel.game.gameStatus("Go!");
    viewModel.game.gameStatusCss("text-info control-panel-go");
    fullyStarted = true;
    channel.push("ingame:started");
  };

  var setStarting = function setStarting() {
    if (fullyStarted) {
      return;
    }

    viewModel.game.gameStatus("Get ready... ");

    updateTime();
    if (!state.playerCursor) {
      state.playerCursor = new CodeCursor({
        isMainPlayer: true,
        playerId: user.id,
        playerName: "player",
        cursor: $gamecode.find(".code-char").first(),
        code: state.code,
        onAdvanceCursor: onPlayerAdvanceCursor,
        onRetreatCursor: emitCursorRetreat,
        onGameComplete: completeGame
      });
    }
  };

  var addRemoveOpponents = function addRemoveOpponents() {
    // Remove opponents that are no longer in-game
    _.each(state.opponentCursors, function (cursor, opponentId) {
      if (!_.contains(game.players, opponentId)) {
        removeOpponent(opponentId);
      }
    });

    // Add new opponents that are not in the list yet
    _.each(game.players, function (player, i) {
      // Do not add self as an opponent
      if (player.id != user.id && !(player.id in state.opponentCursors)) {
        addOpponent(player.id, game.players[i].name);
      }
    });
  };

  var addOpponent = function addOpponent(opponentId, opponentName) {
    state.opponents++;
    state.opponentCursors[opponentId] = new CodeCursor({
      playerId: opponentId,
      playerName: "opponent" + state.opponents,
      cursor: $gamecode.find(".code-char").first(),
      code: state.code,
      onAdvanceCursor: updatePlayerProgress
    });
    viewModel.game.players.push(new Player(opponentId, state.opponents, opponentName));
  };

  var removeOpponent = function removeOpponent(opponentId) {
    state.opponents--;
    if (opponentId in state.opponentCursors) {
      state.opponentCursors[opponentId].destroy();
      delete state.opponentCursors[opponentId];
    }

    var match = ko.utils.arrayFirst(viewModel.game.players(), function (player) {
      return player.id == opponentId;
    });
    if (match) {
      viewModel.game.players.remove(match);
    }
  };

  var updatePlayerProgress = function updatePlayerProgress(cursor) {
    var match = ko.utils.arrayFirst(viewModel.game.players(), function (player) {
      return player.id == cursor.playerId;
    });
    if (match) {
      match.percentage(cursor.pos / cursor.codeLength * 100 | 0);
    }
  };

  var onPlayerAdvanceCursor = function onPlayerAdvanceCursor(cursor) {
    scrollToCursor(cursor);
    updatePlayerProgress(cursor);
    emitCursorAdvance();
  };

  var scrollToCursor = function scrollToCursor(cursor) {
    // Make sure the cursor DOM element exists
    if (cursor.cursor.length) {
      var windowHeight = $(window).height(),
          isAnimating = $("html, body").is(":animated"),
          cursorPos = cursor.cursor.offset().top,
          windowPos = $(window).scrollTop() + windowHeight;

      // Begin scrolling when 25% from the bottom
      if (windowPos - cursorPos < windowHeight * 0.25 && !isAnimating) {
        $("html, body").animate({
          // Move to 25% from top
          scrollTop: cursorPos - windowHeight * 0.25
        }, 1000);
      }
    }
  };

  var addInitialPlayer = function addInitialPlayer() {
    viewModel.game.players.push(new Player(user.id, 0, user.name));
  };

  var emitCursorAdvance = function emitCursorAdvance() {
    channel.push("ingame:advancecursor", {
      player_id: user.id
    });
  };

  var emitCursorRetreat = function emitCursorRetreat() {
    channel.push("ingame:retreatcursor", {
      player_id: user.id
    });
  };

  var completeGame = function completeGame(cursor) {
    game.isComplete = true;
    clearTimeout(timeId);
    lastTimestamp = null;

    var stats = {
      time: state.time,
      keystrokes: cursor.keystrokes,
      mistakes: cursor.mistakes };

    var CHARACTERS_PER_WORD = 5;
    var MILLISECONDS_PER_MINUTE = 60000;

    var realTime = (moment().unix() - state.startTime) * 1000;
    stats.time = realTime;
    stats.typeables = exercise.typeableCode.length;
    stats.speed = parseInt(stats.typeables / CHARACTERS_PER_WORD * (1 / (stats.time / MILLISECONDS_PER_MINUTE)));
    stats.percentUnproductive = 1 - stats.typeables / stats.keystrokes;

    channel.push("ingame:complete", {
      stats: stats
    });
  };

  var timeId = null;
  var lastTimestamp = null;
  var updateTime = (function (_updateTime) {
    var _updateTimeWrapper = function updateTime() {
      return _updateTime.apply(this, arguments);
    };

    _updateTimeWrapper.toString = function () {
      return _updateTime.toString();
    };

    return _updateTimeWrapper;
  })(function () {
    if (game.starting && !game.isComplete) {
      if (state.startTime) {
        state.time = (moment().unix() - state.startTime) * 1000;
      }
      var t = moment.duration(state.time);
      var minutes = t.minutes();
      var seconds = t.seconds();
      seconds = state.time < 0 ? -seconds + 1 : seconds;

      viewModel.game.timer(sprintf("%s%d:%02d", state.time < 0 ? "T-" : "", minutes, seconds));
      viewModel.game.timerCss(state.time < 0 ? "label-warning" : "label-info");

      // Increment with smaller granularity for the cruicial starting time
      if (lastTimestamp && !state.startTime) {
        state.time += (moment().unix() - lastTimestamp) * 1000;
      }
      lastTimestamp = moment().unix();

      // Schedule the start of the game if close enough
      if (state.time > -2500 && state.time < 0) {
        setTimeout(startGame, -state.time);
      }

      timeId = setTimeout(updateTime, 100);
    }
  });

  var resetStarting = function resetStarting() {
    viewModel.game.gameStatus("Waiting for players...");
    if (state.playerCursor) {
      state.playerCursor.destroy();
      state.playerCursor = null;
    }

    clearTimeout(timeId);
    lastTimestamp = null;
  };

  var wrapFullyStarted = function wrapFullyStarted(fn) {
    return function () {
      if (fullyStarted) {
        fn.apply(this, arguments);
      }
    };
  };

  var keys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  keys = keys.concat(_.map(keys, function (k) {
    return k.toUpperCase();
  }));
  keys = keys.concat(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);
  keys = keys.concat(["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "{", "]", "}", "\\", "|", "'", "\"", ";", ":", "/", "?", ".", ">", ",", "<"]);
  keys = keys.concat(["enter", "space", "shift+space", "shift+enter"]);

  Mousetrap.bind(keys, wrapFullyStarted(function (e, key) {
    e.preventDefault();

    if (state.time < 0) return;

    key = _.contains(["space", "shift+space"], key) ? " " : _.contains(["enter", "shift+enter"], key) ? "\n" : key;

    state.playerCursor.processKey(key);
  }));

  Mousetrap.bind(["backspace", "shift+backspace"], wrapFullyStarted(function (e, key) {
    e.preventDefault();
    state.playerCursor.backspaceKey();
  }));

  var pathTokens = window.location.pathname.split("/");
  var game_id = pathTokens[2];
  var player_id = pathTokens[4];

  socket.join("games:" + game_id, { player_id: player_id }).receive("ok", function (chan) {

    channel = chan;

    chan.push("ingame:ready");

    chan.on("ingame:ready:res", function (payload) {
      if (!payload.success) {
        alert("Opps, something went wrong!");
        return;
      }

      user = payload.player;
      game = payload.game;
      exercise = payload.game.exercise;
      exercise.code = exercise.code.replace(/(^\n+)|(\s+$)/g, "") + "\n";

      var highlight = exercise.lang in hljs.listLanguages() ? hljs.highlight(exercise.lang, exercise.code, true) : hljs.highlightAuto(exercise.code);

      var NON_TYPEABLES = ["comment", "template_comment", "diff", "javadoc", "phpdoc"];

      var commentlessCode = $($.parseHTML(highlight.value)).removeClass(NON_TYPEABLES.join(" "));
      exercise.highlitCode = highlight.value;
      exercise.commentlessCode = commentlessCode.text();
      exercise.typeableCode = exercise.commentlessCode.replace(/(^[ \t]+)|([ \t]+$)/gm, "").replace(/\n+/g, "\n").trim() + "\n";
      exercise.typeables = exercise.typeableCode.length;

      state.code = exercise.typeableCode;
      state.startTime = game.startTime;

      nonTypeables = payload.nonTypeables; // TODO: This is not set properly

      viewModel.loaded(true);
      viewModel.loading(false);
      viewModel.game.isMultiplayer(!game.isSinglePlayer);
      viewModel.game.gameStatus("Waiting for players...");
      viewModel.game.gamecode(exercise.code);
      viewModel.game.projectName(exercise.projectName);
      viewModel.game.langCss("language-" + game.lang);

      hljs.initHighlighting();
      bindCodeCharacters();
      addInitialPlayer();
      checkGameState();
    });

    chan.on("ingame:complete:res", function (payload) {
      game = payload.game;
      var message;
      if (game.isSinglePlayer) {
        message = "You completed the code! Well done!";
      } else {
        if (game.winner.id === user.id) {
          message = "Congratulations! You got 1st place!";
        } else {
          message = "Nicely done!";
        }
      }

      viewModel.completionText(message);
      viewModel.stats.time(moment(payload.stats.time).format("mm:ss"));
      viewModel.stats.speed(payload.stats.speed | 0);
      viewModel.stats.typeables(payload.stats.typeables | 0);
      viewModel.stats.keystrokes(payload.stats.keystrokes | 0);
      viewModel.stats.percentUnproductive((payload.stats.percentUnproductive * 100).toFixed(2));
      viewModel.stats.speed(payload.stats.speed | 0);
      viewModel.stats.mistakes(payload.stats.mistakes | 0);

      var $dialog = $("#completion-dialog");
      $dialog.on("shown.bs.modal", function () {
        var rows = $("#completion-dialog .row"),
            animIdx = 0;

        var animateSingle = function animateSingle(row) {
          $(row).animate({
            opacity: 1,
            left: 0
          }, {
            queue: true,
            duration: 200,
            complete: function complete() {
              enqueueAnimation();
            }
          });
        };

        var enqueueAnimation = function enqueueAnimation() {
          if (animIdx < rows.length) {
            animateSingle(rows[animIdx++]);
          }
        };

        enqueueAnimation();
      });
      $dialog.modal("show");
    });

    chan.on("ingame:advancecursor", function (payload) {
      var opponent_id = payload.player_id;
      if (opponent_id in state.opponentCursors) {
        state.opponentCursors[opponent_id].advanceCursor();
      }
    });

    chan.on("ingame:retreatcursor", function (payload) {
      var opponent_id = payload.player_id;
      if (opponent_id in state.opponentCursors) {
        state.opponentCursors[opponent_id].retreatCursor();
      }
    });

    chan.on("ingame:update", function (payload) {
      game = payload.game;
      state.startTime = game.startTime;
      state.time = game.timeLeft;
      checkGameState();
    });
  });

  viewModel.loading(true);
})();});

require.register("web/static/js/lobby", function(exports, require, module) {
"use strict";

var Socket = require("phoenix").Socket;

(function () {
  var Game = function Game(opts) {
    this.id = opts.id;
    this.lang = ko.observable(opts.lang);
    this.numPlayers = ko.observable(opts.numPlayers);
    this.maxPlayers = ko.observable(opts.maxPlayers);
    this.status = ko.observable(opts.status);
    this.statusText = ko.observable(opts.statusText);
    this.statusCss = ko.computed(function () {
      var bindings = {
        waiting: "text-warning",
        ingame: "text-success"
      };
      return bindings[this.status()];
    }, this);
    this.isJoinable = ko.observable(opts.isJoinable);
    this.joinCss = ko.observable();

    this.join = (function () {
      $("button.join-btn").attr("disabled", "disabled");
      $("button.game-type").attr("disabled", "disabled");
      $("button.back-btn").attr("disabled", "disabled");
      $("button.lang").attr("disabled", "disabled");
      this.joinCss("join-choice");

      channel.push("games:join", { game: this.id, player: player });
    }).bind(this);

    this.update = (function (item) {
      var self = this;
      _.forOwn(item, function (val, key) {
        if (key in this) {
          if (ko.isObservable(this[key])) {
            this[key](val);
          } else {
            this[key] = val;
          }
        }
      }, this);
    }).bind(this);
  };

  var viewModel = {
    games: ko.observableArray(),
    loading: ko.observable(false),
    loaded: ko.observable(false),
    newGameType: ko.observable(""),
    setGameType: function setGameType(gameType) {
      this.newGameType(gameType);
      this.slideForward();
    },
    slideForward: function slideForward() {
      $(".gametype-container").hide("slide", { direction: "left" });
      $(".lang-container").show("slide", { direction: "right" });
    },
    newGame: function newGame(lang) {
      $("button.back-btn").attr("disabled", "disabled");
      $("button.lang").attr("disabled", "disabled");
      $("button.join-btn").attr("disabled", "disabled");
      $("button.lang-" + lang).addClass("lang-choice");

      channel.push("games:create", {
        lang: lang,
        player: player,
        gameType: this.newGameType()
      });
    }
  };

  ko.applyBindings(viewModel);

  var socket = new Socket("/ws");
  socket.connect();

  var channel = null;

  var player = {
    id: chance.guid(),
    name: chance.name()
  };

  socket.join("lobby", { player: player }).receive("ok", function (chan) {

    channel = chan;

    chan.on("games:fetch:res", function (payload) {
      var games = _.map(payload.games, function (g) {
        return new Game(g);
      });

      viewModel.games(games);
      viewModel.loading(false);
      viewModel.loaded(true);
    });

    chan.on("games:create:res", function (payload) {
      if (payload.success) {
        location.href = "/games/" + payload.game.id + "/player/" + player.id;
      }
    });

    chan.on("games:join:res", function (payload) {
      if (payload.success) {
        location.href = "/games/" + payload.game.id + "/player/" + player.id;
      }
    });

    setInterval(function () {
      chan.push("games:fetch");
    }, 1000);
  });

  viewModel.loading(true);
})();});

require.register("web/static/js/plugins", function(exports, require, module) {
"use strict";

window.log = function () {
  log.history = log.history || [];log.history.push(arguments);if (this.console) {
    arguments.callee = arguments.callee.caller;var a = [].slice.call(arguments);typeof console.log === "object" ? log.apply.call(console.log, console, a) : console.log.apply(console, a);
  }
};
(function (b) {
  function c() {}for (var d = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","), a; a = d.pop();) {
    b[a] = b[a] || c;
  }
})((function () {
  try {
    console.log();return window.console;
  } catch (err) {
    return window.console = {};
  }
})());

/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function (f, h, $) {
  var a = ("placeholder" in h.createElement("input")),
      d = ("placeholder" in h.createElement("textarea")),
      i = $.fn,
      c = $.valHooks,
      k,
      j;if (a && d) {
    j = i.placeholder = function () {
      return this;
    };j.input = j.textarea = true;
  } else {
    j = i.placeholder = function () {
      var l = this;l.filter((a ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({ "focus.placeholder": b, "blur.placeholder": e }).data("placeholder-enabled", true).trigger("blur.placeholder");return l;
    };j.input = a;j.textarea = d;k = { get: function get(m) {
        var l = $(m);return l.data("placeholder-enabled") && l.hasClass("placeholder") ? "" : m.value;
      }, set: function set(m, n) {
        var l = $(m);if (!l.data("placeholder-enabled")) {
          return m.value = n;
        }if (n == "") {
          m.value = n;if (m != h.activeElement) {
            e.call(m);
          }
        } else {
          if (l.hasClass("placeholder")) {
            b.call(m, true, n) || (m.value = n);
          } else {
            m.value = n;
          }
        }return l;
      } };a || (c.input = k);d || (c.textarea = k);$(function () {
      $(h).delegate("form", "submit.placeholder", function () {
        var l = $(".placeholder", this).each(b);setTimeout(function () {
          l.each(e);
        }, 10);
      });
    });$(f).bind("beforeunload.placeholder", function () {
      $(".placeholder").each(function () {
        this.value = "";
      });
    });
  }function g(m) {
    var l = {},
        n = /^jQuery\d+$/;$.each(m.attributes, function (p, o) {
      if (o.specified && !n.test(o.name)) {
        l[o.name] = o.value;
      }
    });return l;
  }function b(m, n) {
    var l = this,
        o = $(l);if (l.value == o.attr("placeholder") && o.hasClass("placeholder")) {
      if (o.data("placeholder-password")) {
        o = o.hide().next().show().attr("id", o.removeAttr("id").data("placeholder-id"));if (m === true) {
          return o[0].value = n;
        }o.focus();
      } else {
        l.value = "";o.removeClass("placeholder");l == h.activeElement && l.select();
      }
    }
  }function e() {
    var q,
        l = this,
        p = $(l),
        m = p,
        o = this.id;if (l.value == "") {
      if (l.type == "password") {
        if (!p.data("placeholder-textinput")) {
          try {
            q = p.clone().attr({ type: "text" });
          } catch (n) {
            q = $("<input>").attr($.extend(g(this), { type: "text" }));
          }q.removeAttr("name").data({ "placeholder-password": true, "placeholder-id": o }).bind("focus.placeholder", b);p.data({ "placeholder-textinput": q, "placeholder-id": o }).before(q);
        }p = p.removeAttr("id").hide().prev().attr("id", o).show();
      }p.addClass("placeholder");p[0].value = p.attr("placeholder");
    } else {
      p.removeClass("placeholder");
    }
  }
})(undefined, document, jQuery);

/*! jQuery UI - v1.10.3 - 2013-09-06
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js
* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */

(function (e, t) {
  function i(t, i) {
    var s,
        a,
        o,
        r = t.nodeName.toLowerCase();return "area" === r ? (s = t.parentNode, a = s.name, t.href && a && "map" === s.nodeName.toLowerCase() ? (o = e("img[usemap=#" + a + "]")[0], !!o && n(o)) : !1) : (/input|select|textarea|button|object/.test(r) ? !t.disabled : "a" === r ? t.href || i : i) && n(t);
  }function n(t) {
    return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function () {
      return "hidden" === e.css(this, "visibility");
    }).length;
  }var s = 0,
      a = /^ui-id-\d+$/;e.ui = e.ui || {}, e.extend(e.ui, { version: "1.10.3", keyCode: { BACKSPACE: 8, COMMA: 188, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, LEFT: 37, NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108, NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SPACE: 32, TAB: 9, UP: 38 } }), e.fn.extend({ focus: (function (t) {
      return function (i, n) {
        return "number" == typeof i ? this.each(function () {
          var t = this;setTimeout(function () {
            e(t).focus(), n && n.call(t);
          }, i);
        }) : t.apply(this, arguments);
      };
    })(e.fn.focus), scrollParent: function scrollParent() {
      var t;return (t = e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
        return /(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"));
      }).eq(0) : this.parents().filter(function () {
        return /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"));
      }).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t);
    }, zIndex: function zIndex(i) {
      if (i !== t) {
        return this.css("zIndex", i);
      }if (this.length) for (var n, s, a = e(this[0]); a.length && a[0] !== document;) {
        if ((n = a.css("position"), ("absolute" === n || "relative" === n || "fixed" === n) && (s = parseInt(a.css("zIndex"), 10), !isNaN(s) && 0 !== s))) {
          return s;
        }a = a.parent();
      }return 0;
    }, uniqueId: function uniqueId() {
      return this.each(function () {
        this.id || (this.id = "ui-id-" + ++s);
      });
    }, removeUniqueId: function removeUniqueId() {
      return this.each(function () {
        a.test(this.id) && e(this).removeAttr("id");
      });
    } }), e.extend(e.expr[":"], { data: e.expr.createPseudo ? e.expr.createPseudo(function (t) {
      return function (i) {
        return !!e.data(i, t);
      };
    }) : function (t, i, n) {
      return !!e.data(t, n[3]);
    }, focusable: function focusable(t) {
      return i(t, !isNaN(e.attr(t, "tabindex")));
    }, tabbable: function tabbable(t) {
      var n = e.attr(t, "tabindex"),
          s = isNaN(n);return (s || n >= 0) && i(t, !s);
    } }), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function (i, n) {
    function s(t, i, n, s) {
      return (e.each(a, function () {
        i -= parseFloat(e.css(t, "padding" + this)) || 0, n && (i -= parseFloat(e.css(t, "border" + this + "Width")) || 0), s && (i -= parseFloat(e.css(t, "margin" + this)) || 0);
      }), i);
    }var a = "Width" === n ? ["Left", "Right"] : ["Top", "Bottom"],
        o = n.toLowerCase(),
        r = { innerWidth: e.fn.innerWidth, innerHeight: e.fn.innerHeight, outerWidth: e.fn.outerWidth, outerHeight: e.fn.outerHeight };e.fn["inner" + n] = function (i) {
      return i === t ? r["inner" + n].call(this) : this.each(function () {
        e(this).css(o, s(this, i) + "px");
      });
    }, e.fn["outer" + n] = function (t, i) {
      return "number" != typeof t ? r["outer" + n].call(this, t) : this.each(function () {
        e(this).css(o, s(this, t, !0, i) + "px");
      });
    };
  }), e.fn.addBack || (e.fn.addBack = function (e) {
    return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
  }), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = (function (t) {
    return function (i) {
      return arguments.length ? t.call(this, e.camelCase(i)) : t.call(this);
    };
  })(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), e.support.selectstart = "onselectstart" in document.createElement("div"), e.fn.extend({ disableSelection: function disableSelection() {
      return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (e) {
        e.preventDefault();
      });
    }, enableSelection: function enableSelection() {
      return this.unbind(".ui-disableSelection");
    } }), e.extend(e.ui, { plugin: { add: function add(t, i, n) {
        var s,
            a = e.ui[t].prototype;for (s in n) a.plugins[s] = a.plugins[s] || [], a.plugins[s].push([i, n[s]]);
      }, call: function call(e, t, i) {
        var n,
            s = e.plugins[t];if (s && e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType) for (n = 0; s.length > n; n++) e.options[s[n][0]] && s[n][1].apply(e.element, i);
      } }, hasScroll: function hasScroll(t, i) {
      if ("hidden" === e(t).css("overflow")) {
        return !1;
      }var n = i && "left" === i ? "scrollLeft" : "scrollTop",
          s = !1;return t[n] > 0 ? !0 : (t[n] = 1, s = t[n] > 0, t[n] = 0, s);
    } });
})(jQuery);(function (t, e) {
  var i = 0,
      s = Array.prototype.slice,
      n = t.cleanData;t.cleanData = function (e) {
    for (var i, s = 0; null != (i = e[s]); s++) try {
      t(i).triggerHandler("remove");
    } catch (o) {}n(e);
  }, t.widget = function (i, s, n) {
    var o,
        a,
        r,
        h,
        l = {},
        c = i.split(".")[0];i = i.split(".")[1], o = c + "-" + i, n || (n = s, s = t.Widget), t.expr[":"][o.toLowerCase()] = function (e) {
      return !!t.data(e, o);
    }, t[c] = t[c] || {}, a = t[c][i], r = t[c][i] = function (t, i) {
      return this._createWidget ? (arguments.length && this._createWidget(t, i), e) : new r(t, i);
    }, t.extend(r, a, { version: n.version, _proto: t.extend({}, n), _childConstructors: [] }), h = new s(), h.options = t.widget.extend({}, h.options), t.each(n, function (i, n) {
      return t.isFunction(n) ? (l[i] = (function () {
        var t = function t() {
          return s.prototype[i].apply(this, arguments);
        },
            e = function e(t) {
          return s.prototype[i].apply(this, t);
        };return function () {
          var i,
              s = this._super,
              o = this._superApply;return (this._super = t, this._superApply = e, i = n.apply(this, arguments), this._super = s, this._superApply = o, i);
        };
      })(), e) : (l[i] = n, e);
    }), r.prototype = t.widget.extend(h, { widgetEventPrefix: a ? h.widgetEventPrefix : i }, l, { constructor: r, namespace: c, widgetName: i, widgetFullName: o }), a ? (t.each(a._childConstructors, function (e, i) {
      var s = i.prototype;t.widget(s.namespace + "." + s.widgetName, r, i._proto);
    }), delete a._childConstructors) : s._childConstructors.push(r), t.widget.bridge(i, r);
  }, t.widget.extend = function (i) {
    for (var n, o, a = s.call(arguments, 1), r = 0, h = a.length; h > r; r++) for (n in a[r]) o = a[r][n], a[r].hasOwnProperty(n) && o !== e && (i[n] = t.isPlainObject(o) ? t.isPlainObject(i[n]) ? t.widget.extend({}, i[n], o) : t.widget.extend({}, o) : o);return i;
  }, t.widget.bridge = function (i, n) {
    var o = n.prototype.widgetFullName || i;t.fn[i] = function (a) {
      var r = "string" == typeof a,
          h = s.call(arguments, 1),
          l = this;return (a = !r && h.length ? t.widget.extend.apply(null, [a].concat(h)) : a, r ? this.each(function () {
        var s,
            n = t.data(this, o);return n ? t.isFunction(n[a]) && "_" !== a.charAt(0) ? (s = n[a].apply(n, h), s !== n && s !== e ? (l = s && s.jquery ? l.pushStack(s.get()) : s, !1) : e) : t.error("no such method '" + a + "' for " + i + " widget instance") : t.error("cannot call methods on " + i + " prior to initialization; " + "attempted to call method '" + a + "'");
      }) : this.each(function () {
        var e = t.data(this, o);e ? e.option(a || {})._init() : t.data(this, o, new n(a, this));
      }), l);
    };
  }, t.Widget = function () {}, t.Widget._childConstructors = [], t.Widget.prototype = { widgetName: "widget", widgetEventPrefix: "", defaultElement: "<div>", options: { disabled: !1, create: null }, _createWidget: function _createWidget(e, s) {
      s = t(s || this.defaultElement || this)[0], this.element = t(s), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e), this.bindings = t(), this.hoverable = t(), this.focusable = t(), s !== this && (t.data(s, this.widgetFullName, this), this._on(!0, this.element, { remove: function remove(t) {
          t.target === s && this.destroy();
        } }), this.document = t(s.style ? s.ownerDocument : s.document || s), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init();
    }, _getCreateOptions: t.noop, _getCreateEventData: t.noop, _create: t.noop, _init: t.noop, destroy: function destroy() {
      this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus");
    }, _destroy: t.noop, widget: function widget() {
      return this.element;
    }, option: function option(i, s) {
      var n,
          o,
          a,
          r = i;if (0 === arguments.length) {
        return t.widget.extend({}, this.options);
      }if ("string" == typeof i) if ((r = {}, n = i.split("."), i = n.shift(), n.length)) {
        for (o = r[i] = t.widget.extend({}, this.options[i]), a = 0; n.length - 1 > a; a++) o[n[a]] = o[n[a]] || {}, o = o[n[a]];if ((i = n.pop(), s === e)) {
          return o[i] === e ? null : o[i];
        }o[i] = s;
      } else {
        if (s === e) {
          return this.options[i] === e ? null : this.options[i];
        }r[i] = s;
      }return (this._setOptions(r), this);
    }, _setOptions: function _setOptions(t) {
      var e;for (e in t) this._setOption(e, t[e]);return this;
    }, _setOption: function _setOption(t, e) {
      return (this.options[t] = e, "disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!e).attr("aria-disabled", e), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this);
    }, enable: function enable() {
      return this._setOption("disabled", !1);
    }, disable: function disable() {
      return this._setOption("disabled", !0);
    }, _on: function _on(i, s, n) {
      var o,
          a = this;"boolean" != typeof i && (n = s, s = i, i = !1), n ? (s = o = t(s), this.bindings = this.bindings.add(s)) : (n = s, s = this.element, o = this.widget()), t.each(n, function (n, r) {
        function h() {
          return i || a.options.disabled !== !0 && !t(this).hasClass("ui-state-disabled") ? ("string" == typeof r ? a[r] : r).apply(a, arguments) : e;
        }"string" != typeof r && (h.guid = r.guid = r.guid || h.guid || t.guid++);var l = n.match(/^(\w+)\s*(.*)$/),
            c = l[1] + a.eventNamespace,
            u = l[2];u ? o.delegate(u, c, h) : s.bind(c, h);
      });
    }, _off: function _off(t, e) {
      e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.unbind(e).undelegate(e);
    }, _delay: function _delay(t, e) {
      function i() {
        return ("string" == typeof t ? s[t] : t).apply(s, arguments);
      }var s = this;return setTimeout(i, e || 0);
    }, _hoverable: function _hoverable(e) {
      this.hoverable = this.hoverable.add(e), this._on(e, { mouseenter: function mouseenter(e) {
          t(e.currentTarget).addClass("ui-state-hover");
        }, mouseleave: function mouseleave(e) {
          t(e.currentTarget).removeClass("ui-state-hover");
        } });
    }, _focusable: function _focusable(e) {
      this.focusable = this.focusable.add(e), this._on(e, { focusin: function focusin(e) {
          t(e.currentTarget).addClass("ui-state-focus");
        }, focusout: function focusout(e) {
          t(e.currentTarget).removeClass("ui-state-focus");
        } });
    }, _trigger: function _trigger(e, i, s) {
      var n,
          o,
          a = this.options[e];if ((s = s || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], o = i.originalEvent)) for (n in o) n in i || (i[n] = o[n]);return (this.element.trigger(i, s), !(t.isFunction(a) && a.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented()));
    } }, t.each({ show: "fadeIn", hide: "fadeOut" }, function (e, i) {
    t.Widget.prototype["_" + e] = function (s, n, o) {
      "string" == typeof n && (n = { effect: n });var a,
          r = n ? n === !0 || "number" == typeof n ? i : n.effect || i : e;n = n || {}, "number" == typeof n && (n = { duration: n }), a = !t.isEmptyObject(n), n.complete = o, n.delay && s.delay(n.delay), a && t.effects && t.effects.effect[r] ? s[e](n) : r !== e && s[r] ? s[r](n.duration, n.easing, o) : s.queue(function (i) {
        t(this)[e](), o && o.call(s[0]), i();
      });
    };
  });
})(jQuery);(function (t) {
  var e = !1;t(document).mouseup(function () {
    e = !1;
  }), t.widget("ui.mouse", { version: "1.10.3", options: { cancel: "input,textarea,button,select,option", distance: 1, delay: 0 }, _mouseInit: function _mouseInit() {
      var e = this;this.element.bind("mousedown." + this.widgetName, function (t) {
        return e._mouseDown(t);
      }).bind("click." + this.widgetName, function (i) {
        return !0 === t.data(i.target, e.widgetName + ".preventClickEvent") ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : undefined;
      }), this.started = !1;
    }, _mouseDestroy: function _mouseDestroy() {
      this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
    }, _mouseDown: function _mouseDown(i) {
      if (!e) {
        this._mouseStarted && this._mouseUp(i), this._mouseDownEvent = i;var s = this,
            n = 1 === i.which,
            a = "string" == typeof this.options.cancel && i.target.nodeName ? t(i.target).closest(this.options.cancel).length : !1;return n && !a && this._mouseCapture(i) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
          s.mouseDelayMet = !0;
        }, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = this._mouseStart(i) !== !1, !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === t.data(i.target, this.widgetName + ".preventClickEvent") && t.removeData(i.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (t) {
          return s._mouseMove(t);
        }, this._mouseUpDelegate = function (t) {
          return s._mouseUp(t);
        }, t(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), i.preventDefault(), e = !0, !0)) : !0;
      }
    }, _mouseMove: function _mouseMove(e) {
      return t.ui.ie && (!document.documentMode || 9 > document.documentMode) && !e.button ? this._mouseUp(e) : this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1, this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted);
    }, _mouseUp: function _mouseUp(e) {
      return (t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)), !1);
    }, _mouseDistanceMet: function _mouseDistanceMet(t) {
      return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance;
    }, _mouseDelayMet: function _mouseDelayMet() {
      return this.mouseDelayMet;
    }, _mouseStart: function _mouseStart() {}, _mouseDrag: function _mouseDrag() {}, _mouseStop: function _mouseStop() {}, _mouseCapture: function _mouseCapture() {
      return !0;
    } });
})(jQuery);(function (t, e) {
  function i(t, e, i) {
    return [parseFloat(t[0]) * (p.test(t[0]) ? e / 100 : 1), parseFloat(t[1]) * (p.test(t[1]) ? i / 100 : 1)];
  }function s(e, i) {
    return parseInt(t.css(e, i), 10) || 0;
  }function n(e) {
    var i = e[0];return 9 === i.nodeType ? { width: e.width(), height: e.height(), offset: { top: 0, left: 0 } } : t.isWindow(i) ? { width: e.width(), height: e.height(), offset: { top: e.scrollTop(), left: e.scrollLeft() } } : i.preventDefault ? { width: 0, height: 0, offset: { top: i.pageY, left: i.pageX } } : { width: e.outerWidth(), height: e.outerHeight(), offset: e.offset() };
  }t.ui = t.ui || {};var a,
      o = Math.max,
      r = Math.abs,
      l = Math.round,
      h = /left|center|right/,
      c = /top|center|bottom/,
      u = /[\+\-]\d+(\.[\d]+)?%?/,
      d = /^\w+/,
      p = /%$/,
      f = t.fn.position;t.position = { scrollbarWidth: function scrollbarWidth() {
      if (a !== e) {
        return a;
      }var i,
          s,
          n = t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
          o = n.children()[0];return (t("body").append(n), i = o.offsetWidth, n.css("overflow", "scroll"), s = o.offsetWidth, i === s && (s = n[0].clientWidth), n.remove(), a = i - s);
    }, getScrollInfo: function getScrollInfo(e) {
      var i = e.isWindow ? "" : e.element.css("overflow-x"),
          s = e.isWindow ? "" : e.element.css("overflow-y"),
          n = "scroll" === i || "auto" === i && e.width < e.element[0].scrollWidth,
          a = "scroll" === s || "auto" === s && e.height < e.element[0].scrollHeight;return { width: a ? t.position.scrollbarWidth() : 0, height: n ? t.position.scrollbarWidth() : 0 };
    }, getWithinInfo: function getWithinInfo(e) {
      var i = t(e || window),
          s = t.isWindow(i[0]);return { element: i, isWindow: s, offset: i.offset() || { left: 0, top: 0 }, scrollLeft: i.scrollLeft(), scrollTop: i.scrollTop(), width: s ? i.width() : i.outerWidth(), height: s ? i.height() : i.outerHeight() };
    } }, t.fn.position = function (e) {
    if (!e || !e.of) return f.apply(this, arguments);e = t.extend({}, e);var a,
        p,
        g,
        m,
        v,
        _,
        b = t(e.of),
        y = t.position.getWithinInfo(e.within),
        k = t.position.getScrollInfo(y),
        w = (e.collision || "flip").split(" "),
        D = {};return (_ = n(b), b[0].preventDefault && (e.at = "left top"), p = _.width, g = _.height, m = _.offset, v = t.extend({}, m), t.each(["my", "at"], function () {
      var t,
          i,
          s = (e[this] || "").split(" ");1 === s.length && (s = h.test(s[0]) ? s.concat(["center"]) : c.test(s[0]) ? ["center"].concat(s) : ["center", "center"]), s[0] = h.test(s[0]) ? s[0] : "center", s[1] = c.test(s[1]) ? s[1] : "center", t = u.exec(s[0]), i = u.exec(s[1]), D[this] = [t ? t[0] : 0, i ? i[0] : 0], e[this] = [d.exec(s[0])[0], d.exec(s[1])[0]];
    }), 1 === w.length && (w[1] = w[0]), "right" === e.at[0] ? v.left += p : "center" === e.at[0] && (v.left += p / 2), "bottom" === e.at[1] ? v.top += g : "center" === e.at[1] && (v.top += g / 2), a = i(D.at, p, g), v.left += a[0], v.top += a[1], this.each(function () {
      var n,
          h,
          c = t(this),
          u = c.outerWidth(),
          d = c.outerHeight(),
          f = s(this, "marginLeft"),
          _ = s(this, "marginTop"),
          x = u + f + s(this, "marginRight") + k.width,
          C = d + _ + s(this, "marginBottom") + k.height,
          M = t.extend({}, v),
          T = i(D.my, c.outerWidth(), c.outerHeight());"right" === e.my[0] ? M.left -= u : "center" === e.my[0] && (M.left -= u / 2), "bottom" === e.my[1] ? M.top -= d : "center" === e.my[1] && (M.top -= d / 2), M.left += T[0], M.top += T[1], t.support.offsetFractions || (M.left = l(M.left), M.top = l(M.top)), n = { marginLeft: f, marginTop: _ }, t.each(["left", "top"], function (i, s) {
        t.ui.position[w[i]] && t.ui.position[w[i]][s](M, { targetWidth: p, targetHeight: g, elemWidth: u, elemHeight: d, collisionPosition: n, collisionWidth: x, collisionHeight: C, offset: [a[0] + T[0], a[1] + T[1]], my: e.my, at: e.at, within: y, elem: c });
      }), e.using && (h = function (t) {
        var i = m.left - M.left,
            s = i + p - u,
            n = m.top - M.top,
            a = n + g - d,
            l = { target: { element: b, left: m.left, top: m.top, width: p, height: g }, element: { element: c, left: M.left, top: M.top, width: u, height: d }, horizontal: 0 > s ? "left" : i > 0 ? "right" : "center", vertical: 0 > a ? "top" : n > 0 ? "bottom" : "middle" };u > p && p > r(i + s) && (l.horizontal = "center"), d > g && g > r(n + a) && (l.vertical = "middle"), l.important = o(r(i), r(s)) > o(r(n), r(a)) ? "horizontal" : "vertical", e.using.call(this, t, l);
      }), c.offset(t.extend(M, { using: h }));
    }));
  }, t.ui.position = { fit: { left: function left(t, e) {
        var i,
            s = e.within,
            n = s.isWindow ? s.scrollLeft : s.offset.left,
            a = s.width,
            r = t.left - e.collisionPosition.marginLeft,
            l = n - r,
            h = r + e.collisionWidth - a - n;e.collisionWidth > a ? l > 0 && 0 >= h ? (i = t.left + l + e.collisionWidth - a - n, t.left += l - i) : t.left = h > 0 && 0 >= l ? n : l > h ? n + a - e.collisionWidth : n : l > 0 ? t.left += l : h > 0 ? t.left -= h : t.left = o(t.left - r, t.left);
      }, top: function top(t, e) {
        var i,
            s = e.within,
            n = s.isWindow ? s.scrollTop : s.offset.top,
            a = e.within.height,
            r = t.top - e.collisionPosition.marginTop,
            l = n - r,
            h = r + e.collisionHeight - a - n;e.collisionHeight > a ? l > 0 && 0 >= h ? (i = t.top + l + e.collisionHeight - a - n, t.top += l - i) : t.top = h > 0 && 0 >= l ? n : l > h ? n + a - e.collisionHeight : n : l > 0 ? t.top += l : h > 0 ? t.top -= h : t.top = o(t.top - r, t.top);
      } }, flip: { left: function left(t, e) {
        var i,
            s,
            n = e.within,
            a = n.offset.left + n.scrollLeft,
            o = n.width,
            l = n.isWindow ? n.scrollLeft : n.offset.left,
            h = t.left - e.collisionPosition.marginLeft,
            c = h - l,
            u = h + e.collisionWidth - o - l,
            d = "left" === e.my[0] ? -e.elemWidth : "right" === e.my[0] ? e.elemWidth : 0,
            p = "left" === e.at[0] ? e.targetWidth : "right" === e.at[0] ? -e.targetWidth : 0,
            f = -2 * e.offset[0];0 > c ? (i = t.left + d + p + f + e.collisionWidth - o - a, (0 > i || r(c) > i) && (t.left += d + p + f)) : u > 0 && (s = t.left - e.collisionPosition.marginLeft + d + p + f - l, (s > 0 || u > r(s)) && (t.left += d + p + f));
      }, top: function top(t, e) {
        var i,
            s,
            n = e.within,
            a = n.offset.top + n.scrollTop,
            o = n.height,
            l = n.isWindow ? n.scrollTop : n.offset.top,
            h = t.top - e.collisionPosition.marginTop,
            c = h - l,
            u = h + e.collisionHeight - o - l,
            d = "top" === e.my[1],
            p = d ? -e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0,
            f = "top" === e.at[1] ? e.targetHeight : "bottom" === e.at[1] ? -e.targetHeight : 0,
            g = -2 * e.offset[1];0 > c ? (s = t.top + p + f + g + e.collisionHeight - o - a, t.top + p + f + g > c && (0 > s || r(c) > s) && (t.top += p + f + g)) : u > 0 && (i = t.top - e.collisionPosition.marginTop + p + f + g - l, t.top + p + f + g > u && (i > 0 || u > r(i)) && (t.top += p + f + g));
      } }, flipfit: { left: function left() {
        t.ui.position.flip.left.apply(this, arguments), t.ui.position.fit.left.apply(this, arguments);
      }, top: function top() {
        t.ui.position.flip.top.apply(this, arguments), t.ui.position.fit.top.apply(this, arguments);
      } } }, (function () {
    var e,
        i,
        s,
        n,
        a,
        o = document.getElementsByTagName("body")[0],
        r = document.createElement("div");e = document.createElement(o ? "div" : "body"), s = { visibility: "hidden", width: 0, height: 0, border: 0, margin: 0, background: "none" }, o && t.extend(s, { position: "absolute", left: "-1000px", top: "-1000px" });for (a in s) e.style[a] = s[a];e.appendChild(r), i = o || document.documentElement, i.insertBefore(e, i.firstChild), r.style.cssText = "position: absolute; left: 10.7432222px;", n = t(r).offset().left, t.support.offsetFractions = n > 10 && 11 > n, e.innerHTML = "", i.removeChild(e);
  })();
})(jQuery);(function (t, e) {
  var i = "ui-effects-";t.effects = { effect: {} }, (function (t, e) {
    function i(t, e, i) {
      var s = u[e.type] || {};return null == t ? i || !e.def ? null : e.def : (t = s.floor ? ~ ~t : parseFloat(t), isNaN(t) ? e.def : s.mod ? (t + s.mod) % s.mod : 0 > t ? 0 : t > s.max ? s.max : t);
    }function s(i) {
      var s = h(),
          n = s._rgba = [];return (i = i.toLowerCase(), f(l, function (t, a) {
        var o,
            r = a.re.exec(i),
            l = r && a.parse(r),
            h = a.space || "rgba";return l ? (o = s[h](l), s[c[h].cache] = o[c[h].cache], n = s._rgba = o._rgba, !1) : e;
      }), n.length ? ("0,0,0,0" === n.join() && t.extend(n, a.transparent), s) : a[i]);
    }function n(t, e, i) {
      return (i = (i + 1) % 1, 1 > 6 * i ? t + 6 * (e - t) * i : 1 > 2 * i ? e : 2 > 3 * i ? t + 6 * (e - t) * (2 / 3 - i) : t);
    }var a,
        o = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
        r = /^([\-+])=\s*(\d+\.?\d*)/,
        l = [{ re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/, parse: function parse(t) {
        return [t[1], t[2], t[3], t[4]];
      } }, { re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/, parse: function parse(t) {
        return [2.55 * t[1], 2.55 * t[2], 2.55 * t[3], t[4]];
      } }, { re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, parse: function parse(t) {
        return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)];
      } }, { re: /#([a-f0-9])([a-f0-9])([a-f0-9])/, parse: function parse(t) {
        return [parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16)];
      } }, { re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/, space: "hsla", parse: function parse(t) {
        return [t[1], t[2] / 100, t[3] / 100, t[4]];
      } }],
        h = t.Color = function (e, i, s, n) {
      return new t.Color.fn.parse(e, i, s, n);
    },
        c = { rgba: { props: { red: { idx: 0, type: "byte" }, green: { idx: 1, type: "byte" }, blue: { idx: 2, type: "byte" } } }, hsla: { props: { hue: { idx: 0, type: "degrees" }, saturation: { idx: 1, type: "percent" }, lightness: { idx: 2, type: "percent" } } } },
        u = { byte: { floor: !0, max: 255 }, percent: { max: 1 }, degrees: { mod: 360, floor: !0 } },
        d = h.support = {},
        p = t("<p>")[0],
        f = t.each;p.style.cssText = "background-color:rgba(1,1,1,.5)", d.rgba = p.style.backgroundColor.indexOf("rgba") > -1, f(c, function (t, e) {
      e.cache = "_" + t, e.props.alpha = { idx: 3, type: "percent", def: 1 };
    }), h.fn = t.extend(h.prototype, { parse: function parse(n, o, r, l) {
        if (n === e) {
          return (this._rgba = [null, null, null, null], this);
        }(n.jquery || n.nodeType) && (n = t(n).css(o), o = e);var u = this,
            d = t.type(n),
            p = this._rgba = [];return (o !== e && (n = [n, o, r, l], d = "array"), "string" === d ? this.parse(s(n) || a._default) : "array" === d ? (f(c.rgba.props, function (t, e) {
          p[e.idx] = i(n[e.idx], e);
        }), this) : "object" === d ? (n instanceof h ? f(c, function (t, e) {
          n[e.cache] && (u[e.cache] = n[e.cache].slice());
        }) : f(c, function (e, s) {
          var a = s.cache;f(s.props, function (t, e) {
            if (!u[a] && s.to) {
              if ("alpha" === t || null == n[t]) return;u[a] = s.to(u._rgba);
            }u[a][e.idx] = i(n[t], e, !0);
          }), u[a] && 0 > t.inArray(null, u[a].slice(0, 3)) && (u[a][3] = 1, s.from && (u._rgba = s.from(u[a])));
        }), this) : e);
      }, is: function is(t) {
        var i = h(t),
            s = !0,
            n = this;return (f(c, function (t, a) {
          var o,
              r = i[a.cache];return (r && (o = n[a.cache] || a.to && a.to(n._rgba) || [], f(a.props, function (t, i) {
            return null != r[i.idx] ? s = r[i.idx] === o[i.idx] : e;
          })), s);
        }), s);
      }, _space: function _space() {
        var t = [],
            e = this;return (f(c, function (i, s) {
          e[s.cache] && t.push(i);
        }), t.pop());
      }, transition: function transition(t, e) {
        var s = h(t),
            n = s._space(),
            a = c[n],
            o = 0 === this.alpha() ? h("transparent") : this,
            r = o[a.cache] || a.to(o._rgba),
            l = r.slice();return (s = s[a.cache], f(a.props, function (t, n) {
          var a = n.idx,
              o = r[a],
              h = s[a],
              c = u[n.type] || {};null !== h && (null === o ? l[a] = h : (c.mod && (h - o > c.mod / 2 ? o += c.mod : o - h > c.mod / 2 && (o -= c.mod)), l[a] = i((h - o) * e + o, n)));
        }), this[n](l));
      }, blend: function blend(e) {
        if (1 === this._rgba[3]) {
          return this;
        }var i = this._rgba.slice(),
            s = i.pop(),
            n = h(e)._rgba;return h(t.map(i, function (t, e) {
          return (1 - s) * n[e] + s * t;
        }));
      }, toRgbaString: function toRgbaString() {
        var e = "rgba(",
            i = t.map(this._rgba, function (t, e) {
          return null == t ? e > 2 ? 1 : 0 : t;
        });return (1 === i[3] && (i.pop(), e = "rgb("), e + i.join() + ")");
      }, toHslaString: function toHslaString() {
        var e = "hsla(",
            i = t.map(this.hsla(), function (t, e) {
          return (null == t && (t = e > 2 ? 1 : 0), e && 3 > e && (t = Math.round(100 * t) + "%"), t);
        });return (1 === i[3] && (i.pop(), e = "hsl("), e + i.join() + ")");
      }, toHexString: function toHexString(e) {
        var i = this._rgba.slice(),
            s = i.pop();return (e && i.push(~ ~(255 * s)), "#" + t.map(i, function (t) {
          return (t = (t || 0).toString(16), 1 === t.length ? "0" + t : t);
        }).join(""));
      }, toString: function toString() {
        return 0 === this._rgba[3] ? "transparent" : this.toRgbaString();
      } }), h.fn.parse.prototype = h.fn, c.hsla.to = function (t) {
      if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];var e,
          i,
          s = t[0] / 255,
          n = t[1] / 255,
          a = t[2] / 255,
          o = t[3],
          r = Math.max(s, n, a),
          l = Math.min(s, n, a),
          h = r - l,
          c = r + l,
          u = 0.5 * c;return (e = l === r ? 0 : s === r ? 60 * (n - a) / h + 360 : n === r ? 60 * (a - s) / h + 120 : 60 * (s - n) / h + 240, i = 0 === h ? 0 : 0.5 >= u ? h / c : h / (2 - c), [Math.round(e) % 360, i, u, null == o ? 1 : o]);
    }, c.hsla.from = function (t) {
      if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];var e = t[0] / 360,
          i = t[1],
          s = t[2],
          a = t[3],
          o = 0.5 >= s ? s * (1 + i) : s + i - s * i,
          r = 2 * s - o;return [Math.round(255 * n(r, o, e + 1 / 3)), Math.round(255 * n(r, o, e)), Math.round(255 * n(r, o, e - 1 / 3)), a];
    }, f(c, function (s, n) {
      var a = n.props,
          o = n.cache,
          l = n.to,
          c = n.from;h.fn[s] = function (s) {
        if ((l && !this[o] && (this[o] = l(this._rgba)), s === e)) return this[o].slice();var n,
            r = t.type(s),
            u = "array" === r || "object" === r ? s : arguments,
            d = this[o].slice();return (f(a, function (t, e) {
          var s = u["object" === r ? t : e.idx];null == s && (s = d[e.idx]), d[e.idx] = i(s, e);
        }), c ? (n = h(c(d)), n[o] = d, n) : h(d));
      }, f(a, function (e, i) {
        h.fn[e] || (h.fn[e] = function (n) {
          var a,
              o = t.type(n),
              l = "alpha" === e ? this._hsla ? "hsla" : "rgba" : s,
              h = this[l](),
              c = h[i.idx];return "undefined" === o ? c : ("function" === o && (n = n.call(this, c), o = t.type(n)), null == n && i.empty ? this : ("string" === o && (a = r.exec(n), a && (n = c + parseFloat(a[2]) * ("+" === a[1] ? 1 : -1))), h[i.idx] = n, this[l](h)));
        });
      });
    }), h.hook = function (e) {
      var i = e.split(" ");f(i, function (e, i) {
        t.cssHooks[i] = { set: function set(e, n) {
            var a,
                o,
                r = "";if ("transparent" !== n && ("string" !== t.type(n) || (a = s(n)))) {
              if ((n = h(a || n), !d.rgba && 1 !== n._rgba[3])) {
                for (o = "backgroundColor" === i ? e.parentNode : e; ("" === r || "transparent" === r) && o && o.style;) try {
                  r = t.css(o, "backgroundColor"), o = o.parentNode;
                } catch (l) {}n = n.blend(r && "transparent" !== r ? r : "_default");
              }n = n.toRgbaString();
            }try {
              e.style[i] = n;
            } catch (l) {}
          } }, t.fx.step[i] = function (e) {
          e.colorInit || (e.start = h(e.elem, i), e.end = h(e.end), e.colorInit = !0), t.cssHooks[i].set(e.elem, e.start.transition(e.end, e.pos));
        };
      });
    }, h.hook(o), t.cssHooks.borderColor = { expand: function expand(t) {
        var e = {};return (f(["Top", "Right", "Bottom", "Left"], function (i, s) {
          e["border" + s + "Color"] = t;
        }), e);
      } }, a = t.Color.names = { aqua: "#00ffff", black: "#000000", blue: "#0000ff", fuchsia: "#ff00ff", gray: "#808080", green: "#008000", lime: "#00ff00", maroon: "#800000", navy: "#000080", olive: "#808000", purple: "#800080", red: "#ff0000", silver: "#c0c0c0", teal: "#008080", white: "#ffffff", yellow: "#ffff00", transparent: [null, null, null, 0], _default: "#ffffff" };
  })(jQuery), (function () {
    function i(e) {
      var i,
          s,
          n = e.ownerDocument.defaultView ? e.ownerDocument.defaultView.getComputedStyle(e, null) : e.currentStyle,
          a = {};if (n && n.length && n[0] && n[n[0]]) for (s = n.length; s--;) i = n[s], "string" == typeof n[i] && (a[t.camelCase(i)] = n[i]);else for (i in n) "string" == typeof n[i] && (a[i] = n[i]);return a;
    }function s(e, i) {
      var s,
          n,
          o = {};for (s in i) n = i[s], e[s] !== n && (a[s] || (t.fx.step[s] || !isNaN(parseFloat(n))) && (o[s] = n));return o;
    }var n = ["add", "remove", "toggle"],
        a = { border: 1, borderBottom: 1, borderColor: 1, borderLeft: 1, borderRight: 1, borderTop: 1, borderWidth: 1, margin: 1, padding: 1 };t.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (e, i) {
      t.fx.step[i] = function (t) {
        ("none" !== t.end && !t.setAttr || 1 === t.pos && !t.setAttr) && (jQuery.style(t.elem, i, t.end), t.setAttr = !0);
      };
    }), t.fn.addBack || (t.fn.addBack = function (t) {
      return this.add(null == t ? this.prevObject : this.prevObject.filter(t));
    }), t.effects.animateClass = function (e, a, o, r) {
      var l = t.speed(a, o, r);return this.queue(function () {
        var a,
            o = t(this),
            r = o.attr("class") || "",
            h = l.children ? o.find("*").addBack() : o;h = h.map(function () {
          var e = t(this);return { el: e, start: i(this) };
        }), a = function () {
          t.each(n, function (t, i) {
            e[i] && o[i + "Class"](e[i]);
          });
        }, a(), h = h.map(function () {
          return (this.end = i(this.el[0]), this.diff = s(this.start, this.end), this);
        }), o.attr("class", r), h = h.map(function () {
          var e = this,
              i = t.Deferred(),
              s = t.extend({}, l, { queue: !1, complete: function complete() {
              i.resolve(e);
            } });return (this.el.animate(this.diff, s), i.promise());
        }), t.when.apply(t, h.get()).done(function () {
          a(), t.each(arguments, function () {
            var e = this.el;t.each(this.diff, function (t) {
              e.css(t, "");
            });
          }), l.complete.call(o[0]);
        });
      });
    }, t.fn.extend({ addClass: (function (e) {
        return function (i, s, n, a) {
          return s ? t.effects.animateClass.call(this, { add: i }, s, n, a) : e.apply(this, arguments);
        };
      })(t.fn.addClass), removeClass: (function (e) {
        return function (i, s, n, a) {
          return arguments.length > 1 ? t.effects.animateClass.call(this, { remove: i }, s, n, a) : e.apply(this, arguments);
        };
      })(t.fn.removeClass), toggleClass: (function (i) {
        return function (s, n, a, o, r) {
          return "boolean" == typeof n || n === e ? a ? t.effects.animateClass.call(this, n ? { add: s } : { remove: s }, a, o, r) : i.apply(this, arguments) : t.effects.animateClass.call(this, { toggle: s }, n, a, o);
        };
      })(t.fn.toggleClass), switchClass: function switchClass(e, i, s, n, a) {
        return t.effects.animateClass.call(this, { add: i, remove: e }, s, n, a);
      } });
  })(), (function () {
    function s(e, i, s, n) {
      return (t.isPlainObject(e) && (i = e, e = e.effect), e = { effect: e }, null == i && (i = {}), t.isFunction(i) && (n = i, s = null, i = {}), ("number" == typeof i || t.fx.speeds[i]) && (n = s, s = i, i = {}), t.isFunction(s) && (n = s, s = null), i && t.extend(e, i), s = s || i.duration, e.duration = t.fx.off ? 0 : "number" == typeof s ? s : s in t.fx.speeds ? t.fx.speeds[s] : t.fx.speeds._default, e.complete = n || i.complete, e);
    }function n(e) {
      return !e || "number" == typeof e || t.fx.speeds[e] ? !0 : "string" != typeof e || t.effects.effect[e] ? t.isFunction(e) ? !0 : "object" != typeof e || e.effect ? !1 : !0 : !0;
    }t.extend(t.effects, { version: "1.10.3", save: function save(t, e) {
        for (var s = 0; e.length > s; s++) null !== e[s] && t.data(i + e[s], t[0].style[e[s]]);
      }, restore: function restore(t, s) {
        var n, a;for (a = 0; s.length > a; a++) null !== s[a] && (n = t.data(i + s[a]), n === e && (n = ""), t.css(s[a], n));
      }, setMode: function setMode(t, e) {
        return ("toggle" === e && (e = t.is(":hidden") ? "show" : "hide"), e);
      }, getBaseline: function getBaseline(t, e) {
        var i, s;switch (t[0]) {case "top":
            i = 0;break;case "middle":
            i = 0.5;break;case "bottom":
            i = 1;break;default:
            i = t[0] / e.height;}switch (t[1]) {case "left":
            s = 0;break;case "center":
            s = 0.5;break;case "right":
            s = 1;break;default:
            s = t[1] / e.width;}return { x: s, y: i };
      }, createWrapper: function createWrapper(e) {
        if (e.parent().is(".ui-effects-wrapper")) {
          return e.parent();
        }var i = { width: e.outerWidth(!0), height: e.outerHeight(!0), float: e.css("float") },
            s = t("<div></div>").addClass("ui-effects-wrapper").css({ fontSize: "100%", background: "transparent", border: "none", margin: 0, padding: 0 }),
            n = { width: e.width(), height: e.height() },
            a = document.activeElement;try {
          a.id;
        } catch (o) {
          a = document.body;
        }return (e.wrap(s), (e[0] === a || t.contains(e[0], a)) && t(a).focus(), s = e.parent(), "static" === e.css("position") ? (s.css({ position: "relative" }), e.css({ position: "relative" })) : (t.extend(i, { position: e.css("position"), zIndex: e.css("z-index") }), t.each(["top", "left", "bottom", "right"], function (t, s) {
          i[s] = e.css(s), isNaN(parseInt(i[s], 10)) && (i[s] = "auto");
        }), e.css({ position: "relative", top: 0, left: 0, right: "auto", bottom: "auto" })), e.css(n), s.css(i).show());
      }, removeWrapper: function removeWrapper(e) {
        var i = document.activeElement;return (e.parent().is(".ui-effects-wrapper") && (e.parent().replaceWith(e), (e[0] === i || t.contains(e[0], i)) && t(i).focus()), e);
      }, setTransition: function setTransition(e, i, s, n) {
        return (n = n || {}, t.each(i, function (t, i) {
          var a = e.cssUnit(i);a[0] > 0 && (n[i] = a[0] * s + a[1]);
        }), n);
      } }), t.fn.extend({ effect: function effect() {
        function e(e) {
          function s() {
            t.isFunction(a) && a.call(n[0]), t.isFunction(e) && e();
          }var n = t(this),
              a = i.complete,
              r = i.mode;(n.is(":hidden") ? "hide" === r : "show" === r) ? (n[r](), s()) : o.call(n[0], i, s);
        }var i = s.apply(this, arguments),
            n = i.mode,
            a = i.queue,
            o = t.effects.effect[i.effect];return t.fx.off || !o ? n ? this[n](i.duration, i.complete) : this.each(function () {
          i.complete && i.complete.call(this);
        }) : a === !1 ? this.each(e) : this.queue(a || "fx", e);
      }, show: (function (t) {
        return function (e) {
          if (n(e)) return t.apply(this, arguments);var i = s.apply(this, arguments);return (i.mode = "show", this.effect.call(this, i));
        };
      })(t.fn.show), hide: (function (t) {
        return function (e) {
          if (n(e)) return t.apply(this, arguments);var i = s.apply(this, arguments);return (i.mode = "hide", this.effect.call(this, i));
        };
      })(t.fn.hide), toggle: (function (t) {
        return function (e) {
          if (n(e) || "boolean" == typeof e) return t.apply(this, arguments);var i = s.apply(this, arguments);return (i.mode = "toggle", this.effect.call(this, i));
        };
      })(t.fn.toggle), cssUnit: function cssUnit(e) {
        var i = this.css(e),
            s = [];return (t.each(["em", "px", "%", "pt"], function (t, e) {
          i.indexOf(e) > 0 && (s = [parseFloat(i), e]);
        }), s);
      } });
  })(), (function () {
    var e = {};t.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (t, i) {
      e[i] = function (e) {
        return Math.pow(e, t + 2);
      };
    }), t.extend(e, { Sine: function Sine(t) {
        return 1 - Math.cos(t * Math.PI / 2);
      }, Circ: function Circ(t) {
        return 1 - Math.sqrt(1 - t * t);
      }, Elastic: function Elastic(t) {
        return 0 === t || 1 === t ? t : -Math.pow(2, 8 * (t - 1)) * Math.sin((80 * (t - 1) - 7.5) * Math.PI / 15);
      }, Back: function Back(t) {
        return t * t * (3 * t - 2);
      }, Bounce: function Bounce(t) {
        for (var e, i = 4; ((e = Math.pow(2, --i)) - 1) / 11 > t;);return 1 / Math.pow(4, 3 - i) - 7.5625 * Math.pow((3 * e - 2) / 22 - t, 2);
      } }), t.each(e, function (e, i) {
      t.easing["easeIn" + e] = i, t.easing["easeOut" + e] = function (t) {
        return 1 - i(1 - t);
      }, t.easing["easeInOut" + e] = function (t) {
        return 0.5 > t ? i(2 * t) / 2 : 1 - i(-2 * t + 2) / 2;
      };
    });
  })();
})(jQuery);(function (t) {
  var e = /up|down|vertical/,
      i = /up|left|vertical|horizontal/;t.effects.effect.blind = function (s, n) {
    var a,
        o,
        r,
        l = t(this),
        h = ["position", "top", "bottom", "left", "right", "height", "width"],
        c = t.effects.setMode(l, s.mode || "hide"),
        u = s.direction || "up",
        d = e.test(u),
        p = d ? "height" : "width",
        f = d ? "top" : "left",
        g = i.test(u),
        m = {},
        v = "show" === c;l.parent().is(".ui-effects-wrapper") ? t.effects.save(l.parent(), h) : t.effects.save(l, h), l.show(), a = t.effects.createWrapper(l).css({ overflow: "hidden" }), o = a[p](), r = parseFloat(a.css(f)) || 0, m[p] = v ? o : 0, g || (l.css(d ? "bottom" : "right", 0).css(d ? "top" : "left", "auto").css({ position: "absolute" }), m[f] = v ? r : o + r), v && (a.css(p, 0), g || a.css(f, r + o)), a.animate(m, { duration: s.duration, easing: s.easing, queue: !1, complete: function complete() {
        "hide" === c && l.hide(), t.effects.restore(l, h), t.effects.removeWrapper(l), n();
      } });
  };
})(jQuery);(function (t) {
  t.effects.effect.bounce = function (e, i) {
    var s,
        n,
        a,
        o = t(this),
        r = ["position", "top", "bottom", "left", "right", "height", "width"],
        l = t.effects.setMode(o, e.mode || "effect"),
        h = "hide" === l,
        c = "show" === l,
        u = e.direction || "up",
        d = e.distance,
        p = e.times || 5,
        f = 2 * p + (c || h ? 1 : 0),
        g = e.duration / f,
        m = e.easing,
        v = "up" === u || "down" === u ? "top" : "left",
        _ = "up" === u || "left" === u,
        b = o.queue(),
        y = b.length;for ((c || h) && r.push("opacity"), t.effects.save(o, r), o.show(), t.effects.createWrapper(o), d || (d = o["top" === v ? "outerHeight" : "outerWidth"]() / 3), c && (a = { opacity: 1 }, a[v] = 0, o.css("opacity", 0).css(v, _ ? 2 * -d : 2 * d).animate(a, g, m)), h && (d /= Math.pow(2, p - 1)), a = {}, a[v] = 0, s = 0; p > s; s++) n = {}, n[v] = (_ ? "-=" : "+=") + d, o.animate(n, g, m).animate(a, g, m), d = h ? 2 * d : d / 2;h && (n = { opacity: 0 }, n[v] = (_ ? "-=" : "+=") + d, o.animate(n, g, m)), o.queue(function () {
      h && o.hide(), t.effects.restore(o, r), t.effects.removeWrapper(o), i();
    }), y > 1 && b.splice.apply(b, [1, 0].concat(b.splice(y, f + 1))), o.dequeue();
  };
})(jQuery);(function (t) {
  t.effects.effect.clip = function (e, i) {
    var s,
        n,
        a,
        o = t(this),
        r = ["position", "top", "bottom", "left", "right", "height", "width"],
        l = t.effects.setMode(o, e.mode || "hide"),
        h = "show" === l,
        c = e.direction || "vertical",
        u = "vertical" === c,
        d = u ? "height" : "width",
        p = u ? "top" : "left",
        f = {};t.effects.save(o, r), o.show(), s = t.effects.createWrapper(o).css({ overflow: "hidden" }), n = "IMG" === o[0].tagName ? s : o, a = n[d](), h && (n.css(d, 0), n.css(p, a / 2)), f[d] = h ? a : 0, f[p] = h ? 0 : a / 2, n.animate(f, { queue: !1, duration: e.duration, easing: e.easing, complete: function complete() {
        h || o.hide(), t.effects.restore(o, r), t.effects.removeWrapper(o), i();
      } });
  };
})(jQuery);(function (t) {
  t.effects.effect.drop = function (e, i) {
    var s,
        n = t(this),
        a = ["position", "top", "bottom", "left", "right", "opacity", "height", "width"],
        o = t.effects.setMode(n, e.mode || "hide"),
        r = "show" === o,
        l = e.direction || "left",
        h = "up" === l || "down" === l ? "top" : "left",
        c = "up" === l || "left" === l ? "pos" : "neg",
        u = { opacity: r ? 1 : 0 };t.effects.save(n, a), n.show(), t.effects.createWrapper(n), s = e.distance || n["top" === h ? "outerHeight" : "outerWidth"](!0) / 2, r && n.css("opacity", 0).css(h, "pos" === c ? -s : s), u[h] = (r ? "pos" === c ? "+=" : "-=" : "pos" === c ? "-=" : "+=") + s, n.animate(u, { queue: !1, duration: e.duration, easing: e.easing, complete: function complete() {
        "hide" === o && n.hide(), t.effects.restore(n, a), t.effects.removeWrapper(n), i();
      } });
  };
})(jQuery);(function (t) {
  t.effects.effect.explode = function (e, i) {
    function s() {
      b.push(this), b.length === u * d && n();
    }function n() {
      p.css({ visibility: "visible" }), t(b).remove(), g || p.hide(), i();
    }var a,
        o,
        r,
        l,
        h,
        c,
        u = e.pieces ? Math.round(Math.sqrt(e.pieces)) : 3,
        d = u,
        p = t(this),
        f = t.effects.setMode(p, e.mode || "hide"),
        g = "show" === f,
        m = p.show().css("visibility", "hidden").offset(),
        v = Math.ceil(p.outerWidth() / d),
        _ = Math.ceil(p.outerHeight() / u),
        b = [];for (a = 0; u > a; a++) for (l = m.top + a * _, c = a - (u - 1) / 2, o = 0; d > o; o++) r = m.left + o * v, h = o - (d - 1) / 2, p.clone().appendTo("body").wrap("<div></div>").css({ position: "absolute", visibility: "visible", left: -o * v, top: -a * _ }).parent().addClass("ui-effects-explode").css({ position: "absolute", overflow: "hidden", width: v, height: _, left: r + (g ? h * v : 0), top: l + (g ? c * _ : 0), opacity: g ? 0 : 1 }).animate({ left: r + (g ? 0 : h * v), top: l + (g ? 0 : c * _), opacity: g ? 1 : 0 }, e.duration || 500, e.easing, s);
  };
})(jQuery);(function (t) {
  t.effects.effect.fade = function (e, i) {
    var s = t(this),
        n = t.effects.setMode(s, e.mode || "toggle");s.animate({ opacity: n }, { queue: !1, duration: e.duration, easing: e.easing, complete: i });
  };
})(jQuery);(function (t) {
  t.effects.effect.fold = function (e, i) {
    var s,
        n,
        a = t(this),
        o = ["position", "top", "bottom", "left", "right", "height", "width"],
        r = t.effects.setMode(a, e.mode || "hide"),
        l = "show" === r,
        h = "hide" === r,
        c = e.size || 15,
        u = /([0-9]+)%/.exec(c),
        d = !!e.horizFirst,
        p = l !== d,
        f = p ? ["width", "height"] : ["height", "width"],
        g = e.duration / 2,
        m = {},
        v = {};t.effects.save(a, o), a.show(), s = t.effects.createWrapper(a).css({ overflow: "hidden" }), n = p ? [s.width(), s.height()] : [s.height(), s.width()], u && (c = parseInt(u[1], 10) / 100 * n[h ? 0 : 1]), l && s.css(d ? { height: 0, width: c } : { height: c, width: 0 }), m[f[0]] = l ? n[0] : c, v[f[1]] = l ? n[1] : 0, s.animate(m, g, e.easing).animate(v, g, e.easing, function () {
      h && a.hide(), t.effects.restore(a, o), t.effects.removeWrapper(a), i();
    });
  };
})(jQuery);(function (t) {
  t.effects.effect.highlight = function (e, i) {
    var s = t(this),
        n = ["backgroundImage", "backgroundColor", "opacity"],
        a = t.effects.setMode(s, e.mode || "show"),
        o = { backgroundColor: s.css("backgroundColor") };"hide" === a && (o.opacity = 0), t.effects.save(s, n), s.show().css({ backgroundImage: "none", backgroundColor: e.color || "#ffff99" }).animate(o, { queue: !1, duration: e.duration, easing: e.easing, complete: function complete() {
        "hide" === a && s.hide(), t.effects.restore(s, n), i();
      } });
  };
})(jQuery);(function (t) {
  t.effects.effect.pulsate = function (e, i) {
    var s,
        n = t(this),
        a = t.effects.setMode(n, e.mode || "show"),
        o = "show" === a,
        r = "hide" === a,
        l = o || "hide" === a,
        h = 2 * (e.times || 5) + (l ? 1 : 0),
        c = e.duration / h,
        u = 0,
        d = n.queue(),
        p = d.length;for ((o || !n.is(":visible")) && (n.css("opacity", 0).show(), u = 1), s = 1; h > s; s++) n.animate({ opacity: u }, c, e.easing), u = 1 - u;n.animate({ opacity: u }, c, e.easing), n.queue(function () {
      r && n.hide(), i();
    }), p > 1 && d.splice.apply(d, [1, 0].concat(d.splice(p, h + 1))), n.dequeue();
  };
})(jQuery);(function (t) {
  t.effects.effect.puff = function (e, i) {
    var s = t(this),
        n = t.effects.setMode(s, e.mode || "hide"),
        a = "hide" === n,
        o = parseInt(e.percent, 10) || 150,
        r = o / 100,
        l = { height: s.height(), width: s.width(), outerHeight: s.outerHeight(), outerWidth: s.outerWidth() };t.extend(e, { effect: "scale", queue: !1, fade: !0, mode: n, complete: i, percent: a ? o : 100, from: a ? l : { height: l.height * r, width: l.width * r, outerHeight: l.outerHeight * r, outerWidth: l.outerWidth * r } }), s.effect(e);
  }, t.effects.effect.scale = function (e, i) {
    var s = t(this),
        n = t.extend(!0, {}, e),
        a = t.effects.setMode(s, e.mode || "effect"),
        o = parseInt(e.percent, 10) || (0 === parseInt(e.percent, 10) ? 0 : "hide" === a ? 0 : 100),
        r = e.direction || "both",
        l = e.origin,
        h = { height: s.height(), width: s.width(), outerHeight: s.outerHeight(), outerWidth: s.outerWidth() },
        c = { y: "horizontal" !== r ? o / 100 : 1, x: "vertical" !== r ? o / 100 : 1 };n.effect = "size", n.queue = !1, n.complete = i, "effect" !== a && (n.origin = l || ["middle", "center"], n.restore = !0), n.from = e.from || ("show" === a ? { height: 0, width: 0, outerHeight: 0, outerWidth: 0 } : h), n.to = { height: h.height * c.y, width: h.width * c.x, outerHeight: h.outerHeight * c.y, outerWidth: h.outerWidth * c.x }, n.fade && ("show" === a && (n.from.opacity = 0, n.to.opacity = 1), "hide" === a && (n.from.opacity = 1, n.to.opacity = 0)), s.effect(n);
  }, t.effects.effect.size = function (e, i) {
    var s,
        n,
        a,
        o = t(this),
        r = ["position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity"],
        l = ["position", "top", "bottom", "left", "right", "overflow", "opacity"],
        h = ["width", "height", "overflow"],
        c = ["fontSize"],
        u = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
        d = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],
        p = t.effects.setMode(o, e.mode || "effect"),
        f = e.restore || "effect" !== p,
        g = e.scale || "both",
        m = e.origin || ["middle", "center"],
        v = o.css("position"),
        _ = f ? r : l,
        b = { height: 0, width: 0, outerHeight: 0, outerWidth: 0 };"show" === p && o.show(), s = { height: o.height(), width: o.width(), outerHeight: o.outerHeight(), outerWidth: o.outerWidth() }, "toggle" === e.mode && "show" === p ? (o.from = e.to || b, o.to = e.from || s) : (o.from = e.from || ("show" === p ? b : s), o.to = e.to || ("hide" === p ? b : s)), a = { from: { y: o.from.height / s.height, x: o.from.width / s.width }, to: { y: o.to.height / s.height, x: o.to.width / s.width } }, ("box" === g || "both" === g) && (a.from.y !== a.to.y && (_ = _.concat(u), o.from = t.effects.setTransition(o, u, a.from.y, o.from), o.to = t.effects.setTransition(o, u, a.to.y, o.to)), a.from.x !== a.to.x && (_ = _.concat(d), o.from = t.effects.setTransition(o, d, a.from.x, o.from), o.to = t.effects.setTransition(o, d, a.to.x, o.to))), ("content" === g || "both" === g) && a.from.y !== a.to.y && (_ = _.concat(c).concat(h), o.from = t.effects.setTransition(o, c, a.from.y, o.from), o.to = t.effects.setTransition(o, c, a.to.y, o.to)), t.effects.save(o, _), o.show(), t.effects.createWrapper(o), o.css("overflow", "hidden").css(o.from), m && (n = t.effects.getBaseline(m, s), o.from.top = (s.outerHeight - o.outerHeight()) * n.y, o.from.left = (s.outerWidth - o.outerWidth()) * n.x, o.to.top = (s.outerHeight - o.to.outerHeight) * n.y, o.to.left = (s.outerWidth - o.to.outerWidth) * n.x), o.css(o.from), ("content" === g || "both" === g) && (u = u.concat(["marginTop", "marginBottom"]).concat(c), d = d.concat(["marginLeft", "marginRight"]), h = r.concat(u).concat(d), o.find("*[width]").each(function () {
      var i = t(this),
          s = { height: i.height(), width: i.width(), outerHeight: i.outerHeight(), outerWidth: i.outerWidth() };f && t.effects.save(i, h), i.from = { height: s.height * a.from.y, width: s.width * a.from.x, outerHeight: s.outerHeight * a.from.y, outerWidth: s.outerWidth * a.from.x }, i.to = { height: s.height * a.to.y, width: s.width * a.to.x, outerHeight: s.height * a.to.y, outerWidth: s.width * a.to.x }, a.from.y !== a.to.y && (i.from = t.effects.setTransition(i, u, a.from.y, i.from), i.to = t.effects.setTransition(i, u, a.to.y, i.to)), a.from.x !== a.to.x && (i.from = t.effects.setTransition(i, d, a.from.x, i.from), i.to = t.effects.setTransition(i, d, a.to.x, i.to)), i.css(i.from), i.animate(i.to, e.duration, e.easing, function () {
        f && t.effects.restore(i, h);
      });
    })), o.animate(o.to, { queue: !1, duration: e.duration, easing: e.easing, complete: function complete() {
        0 === o.to.opacity && o.css("opacity", o.from.opacity), "hide" === p && o.hide(), t.effects.restore(o, _), f || ("static" === v ? o.css({ position: "relative", top: o.to.top, left: o.to.left }) : t.each(["top", "left"], function (t, e) {
          o.css(e, function (e, i) {
            var s = parseInt(i, 10),
                n = t ? o.to.left : o.to.top;return "auto" === i ? n + "px" : s + n + "px";
          });
        })), t.effects.removeWrapper(o), i();
      } });
  };
})(jQuery);(function (t) {
  t.effects.effect.shake = function (e, i) {
    var s,
        n = t(this),
        a = ["position", "top", "bottom", "left", "right", "height", "width"],
        o = t.effects.setMode(n, e.mode || "effect"),
        r = e.direction || "left",
        l = e.distance || 20,
        h = e.times || 3,
        c = 2 * h + 1,
        u = Math.round(e.duration / c),
        d = "up" === r || "down" === r ? "top" : "left",
        p = "up" === r || "left" === r,
        f = {},
        g = {},
        m = {},
        v = n.queue(),
        _ = v.length;for (t.effects.save(n, a), n.show(), t.effects.createWrapper(n), f[d] = (p ? "-=" : "+=") + l, g[d] = (p ? "+=" : "-=") + 2 * l, m[d] = (p ? "-=" : "+=") + 2 * l, n.animate(f, u, e.easing), s = 1; h > s; s++) n.animate(g, u, e.easing).animate(m, u, e.easing);n.animate(g, u, e.easing).animate(f, u / 2, e.easing).queue(function () {
      "hide" === o && n.hide(), t.effects.restore(n, a), t.effects.removeWrapper(n), i();
    }), _ > 1 && v.splice.apply(v, [1, 0].concat(v.splice(_, c + 1))), n.dequeue();
  };
})(jQuery);(function (t) {
  t.effects.effect.slide = function (e, i) {
    var s,
        n = t(this),
        a = ["position", "top", "bottom", "left", "right", "width", "height"],
        o = t.effects.setMode(n, e.mode || "show"),
        r = "show" === o,
        l = e.direction || "left",
        h = "up" === l || "down" === l ? "top" : "left",
        c = "up" === l || "left" === l,
        u = {};t.effects.save(n, a), n.show(), s = e.distance || n["top" === h ? "outerHeight" : "outerWidth"](!0), t.effects.createWrapper(n).css({ overflow: "hidden" }), r && n.css(h, c ? isNaN(s) ? "-" + s : -s : s), u[h] = (r ? c ? "+=" : "-=" : c ? "-=" : "+=") + s, n.animate(u, { queue: !1, duration: e.duration, easing: e.easing, complete: function complete() {
        "hide" === o && n.hide(), t.effects.restore(n, a), t.effects.removeWrapper(n), i();
      } });
  };
})(jQuery);(function (t) {
  t.effects.effect.transfer = function (e, i) {
    var s = t(this),
        n = t(e.to),
        a = "fixed" === n.css("position"),
        o = t("body"),
        r = a ? o.scrollTop() : 0,
        l = a ? o.scrollLeft() : 0,
        h = n.offset(),
        c = { top: h.top - r, left: h.left - l, height: n.innerHeight(), width: n.innerWidth() },
        d = s.offset(),
        u = t("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(e.className).css({ top: d.top - r, left: d.left - l, height: s.innerHeight(), width: s.innerWidth(), position: a ? "fixed" : "absolute" }).animate(c, e.duration, e.easing, function () {
      u.remove(), i();
    });
  };
})(jQuery);

/*! jquery.slimscroll */
/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.1
 *
 */
(function (f) {
  jQuery.fn.extend({ slimScroll: function slimScroll(h) {
      var a = f.extend({ width: "auto", height: "250px", size: "7px", color: "#000", position: "right", distance: "1px", start: "top", opacity: 0.4, alwaysVisible: !1, disableFadeOut: !1, railVisible: !1, railColor: "#333", railOpacity: 0.2, railDraggable: !0, railClass: "slimScrollRail", barClass: "slimScrollBar", wrapperClass: "slimScrollDiv", allowPageScroll: !1, wheelStep: 20, touchScrollStep: 200, borderRadius: "7px", railBorderRadius: "7px" }, h);this.each(function () {
        function r(d) {
          if (s) {
            d = d || window.event;var c = 0;d.wheelDelta && (c = -d.wheelDelta / 120);d.detail && (c = d.detail / 3);f(d.target || d.srcTarget || d.srcElement).closest("." + a.wrapperClass).is(b.parent()) && m(c, !0);d.preventDefault && !k && d.preventDefault();k || (d.returnValue = !1);
          }
        }function m(d, f, h) {
          k = !1;var e = d,
              g = b.outerHeight() - c.outerHeight();f && (e = parseInt(c.css("top")) + d * parseInt(a.wheelStep) / 100 * c.outerHeight(), e = Math.min(Math.max(e, 0), g), e = 0 < d ? Math.ceil(e) : Math.floor(e), c.css({ top: e + "px" }));l = parseInt(c.css("top")) / (b.outerHeight() - c.outerHeight());
          e = l * (b[0].scrollHeight - b.outerHeight());h && (e = d, d = e / b[0].scrollHeight * b.outerHeight(), d = Math.min(Math.max(d, 0), g), c.css({ top: d + "px" }));b.scrollTop(e);b.trigger("slimscrolling", ~ ~e);v();p();
        }function C() {
          window.addEventListener ? (this.addEventListener("DOMMouseScroll", r, !1), this.addEventListener("mousewheel", r, !1), this.addEventListener("MozMousePixelScroll", r, !1)) : document.attachEvent("onmousewheel", r);
        }function w() {
          u = Math.max(b.outerHeight() / b[0].scrollHeight * b.outerHeight(), D);c.css({ height: u + "px" });
          var a = u == b.outerHeight() ? "none" : "block";c.css({ display: a });
        }function v() {
          w();clearTimeout(A);l == ~ ~l ? (k = a.allowPageScroll, B != l && b.trigger("slimscroll", 0 == ~ ~l ? "top" : "bottom")) : k = !1;B = l;u >= b.outerHeight() ? k = !0 : (c.stop(!0, !0).fadeIn("fast"), a.railVisible && g.stop(!0, !0).fadeIn("fast"));
        }function p() {
          a.alwaysVisible || (A = setTimeout(function () {
            a.disableFadeOut && s || (x || y) || (c.fadeOut("slow"), g.fadeOut("slow"));
          }, 1000));
        }var s,
            x,
            y,
            A,
            z,
            u,
            l,
            B,
            D = 30,
            k = !1,
            b = f(this);if (b.parent().hasClass(a.wrapperClass)) {
          var n = b.scrollTop(),
              c = b.parent().find("." + a.barClass),
              g = b.parent().find("." + a.railClass);w();if (f.isPlainObject(h)) {
            if ("height" in h && "auto" == h.height) {
              b.parent().css("height", "auto");b.css("height", "auto");var q = b.parent().parent().height();b.parent().css("height", q);b.css("height", q);
            }if ("scrollTo" in h) n = parseInt(a.scrollTo);else if ("scrollBy" in h) n += parseInt(a.scrollBy);else if ("destroy" in h) {
              c.remove();g.remove();b.unwrap();return;
            }m(n, !1, !0);
          }
        } else {
          a.height = "auto" == a.height ? b.parent().height() : a.height;n = f("<div></div>").addClass(a.wrapperClass).css({ position: "relative",
            overflow: "hidden", width: a.width, height: a.height });b.css({ overflow: "hidden", width: a.width, height: a.height });var g = f("<div></div>").addClass(a.railClass).css({ width: a.size, height: "100%", position: "absolute", top: 0, display: a.alwaysVisible && a.railVisible ? "block" : "none", "border-radius": a.railBorderRadius, background: a.railColor, opacity: a.railOpacity, zIndex: 90 }),
              c = f("<div></div>").addClass(a.barClass).css({ background: a.color, width: a.size, position: "absolute", top: 0, opacity: a.opacity, display: a.alwaysVisible ? "block" : "none", "border-radius": a.borderRadius, BorderRadius: a.borderRadius, MozBorderRadius: a.borderRadius, WebkitBorderRadius: a.borderRadius, zIndex: 99 }),
              q = "right" == a.position ? { right: a.distance } : { left: a.distance };g.css(q);c.css(q);b.wrap(n);b.parent().append(c);b.parent().append(g);a.railDraggable && c.bind("mousedown", function (a) {
            var b = f(document);y = !0;t = parseFloat(c.css("top"));pageY = a.pageY;b.bind("mousemove.slimscroll", function (a) {
              currTop = t + a.pageY - pageY;c.css("top", currTop);m(0, c.position().top, !1);
            });
            b.bind("mouseup.slimscroll", function (a) {
              y = !1;p();b.unbind(".slimscroll");
            });return !1;
          }).bind("selectstart.slimscroll", function (a) {
            a.stopPropagation();a.preventDefault();return !1;
          });g.hover(function () {
            v();
          }, function () {
            p();
          });c.hover(function () {
            x = !0;
          }, function () {
            x = !1;
          });b.hover(function () {
            s = !0;v();p();
          }, function () {
            s = !1;p();
          });b.bind("touchstart", function (a, b) {
            a.originalEvent.touches.length && (z = a.originalEvent.touches[0].pageY);
          });b.bind("touchmove", function (b) {
            k || b.originalEvent.preventDefault();b.originalEvent.touches.length && (m((z - b.originalEvent.touches[0].pageY) / a.touchScrollStep, !0), z = b.originalEvent.touches[0].pageY);
          });w();"bottom" === a.start ? (c.css({ top: b.outerHeight() - c.outerHeight() }), m(0, !0)) : "top" !== a.start && (m(f(a.start).position().top, null, !0), a.alwaysVisible || c.hide());C();
        }
      });return this;
    } });jQuery.fn.extend({ slimscroll: jQuery.fn.slimScroll });
})(jQuery);

/*! sprintf.js | Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro> | 3 clause BSD license */
(function (e) {
  function r(e) {
    return Object.prototype.toString.call(e).slice(8, -1).toLowerCase();
  }function i(e, t) {
    for (var n = []; t > 0; n[--t] = e);return n.join("");
  }var t = (function (_t) {
    var _tWrapper = function t() {
      return _t.apply(this, arguments);
    };

    _tWrapper.toString = function () {
      return _t.toString();
    };

    return _tWrapper;
  })(function () {
    return (t.cache.hasOwnProperty(arguments[0]) || (t.cache[arguments[0]] = t.parse(arguments[0])), t.format.call(null, t.cache[arguments[0]], arguments));
  });t.format = function (e, n) {
    var s = 1,
        o = e.length,
        u = "",
        a,
        f = [],
        l,
        c,
        h,
        p,
        d,
        v;for (l = 0; l < o; l++) {
      u = r(e[l]);if (u === "string") f.push(e[l]);else if (u === "array") {
        h = e[l];if (h[2]) {
          a = n[s];for (c = 0; c < h[2].length; c++) {
            if (!a.hasOwnProperty(h[2][c])) throw t("[sprintf] property \"%s\" does not exist", h[2][c]);a = a[h[2][c]];
          }
        } else h[1] ? a = n[h[1]] : a = n[s++];if (/[^s]/.test(h[8]) && r(a) != "number") throw t("[sprintf] expecting number but found %s", r(a));switch (h[8]) {case "b":
            a = a.toString(2);break;case "c":
            a = String.fromCharCode(a);break;case "d":
            a = parseInt(a, 10);break;case "e":
            a = h[7] ? a.toExponential(h[7]) : a.toExponential();break;case "f":
            a = h[7] ? parseFloat(a).toFixed(h[7]) : parseFloat(a);break;case "o":
            a = a.toString(8);break;case "s":
            a = (a = String(a)) && h[7] ? a.substring(0, h[7]) : a;break;case "u":
            a >>>= 0;break;case "x":
            a = a.toString(16);break;case "X":
            a = a.toString(16).toUpperCase();}a = /[def]/.test(h[8]) && h[3] && a >= 0 ? "+" + a : a, d = h[4] ? h[4] == "0" ? "0" : h[4].charAt(1) : " ", v = h[6] - String(a).length, p = h[6] ? i(d, v) : "", f.push(h[5] ? a + p : p + a);
      }
    }return f.join("");
  }, t.cache = {}, t.parse = function (e) {
    var t = e,
        n = [],
        r = [],
        i = 0;while (t) {
      if ((n = /^[^\x25]+/.exec(t)) !== null) r.push(n[0]);else if ((n = /^\x25{2}/.exec(t)) !== null) r.push("%");else {
        if ((n = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(t)) === null) throw "[sprintf] huh?";if (n[2]) {
          i |= 1;var s = [],
              o = n[2],
              u = [];if ((u = /^([a-z_][a-z_\d]*)/i.exec(o)) === null) throw "[sprintf] huh?";s.push(u[1]);while ((o = o.substring(u[0].length)) !== "") if ((u = /^\.([a-z_][a-z_\d]*)/i.exec(o)) !== null) s.push(u[1]);else {
            if ((u = /^\[(\d+)\]/.exec(o)) === null) throw "[sprintf] huh?";s.push(u[1]);
          }n[2] = s;
        } else i |= 2;if (i === 3) throw "[sprintf] mixing positional and named placeholders is not (yet) supported";r.push(n);
      }t = t.substring(n[0].length);
    }return r;
  };var n = (function (_n) {
    var _nWrapper = function n(_x, _x2, _x3) {
      return _n.apply(this, arguments);
    };

    _nWrapper.toString = function () {
      return _n.toString();
    };

    return _nWrapper;
  })(function (e, n, r) {
    return (r = n.slice(0), r.splice(0, 0, e), t.apply(null, r));
  });e.sprintf = t, e.vsprintf = n;
})(typeof exports != "undefined" ? exports : window);});


//# sourceMappingURL=app.js.map