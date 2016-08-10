webpackJsonp([1,2],{

/***/ 298:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  var root_1 = __webpack_require__(121);
  var toSubscriber_1 = __webpack_require__(308);
  var symbol_observable_1 = __webpack_require__(302);
  /**
   * A representation of any set of values over any amount of time. This the most basic building block
   * of RxJS.
   *
   * @class Observable<T>
   */
  var Observable = (function () {
      /**
       * @constructor
       * @param {Function} subscribe the function that is  called when the Observable is
       * initially subscribed to. This function is given a Subscriber, to which new values
       * can be `next`ed, or an `error` method can be called to raise an error, or
       * `complete` can be called to notify of a successful completion.
       */
      function Observable(subscribe) {
          this._isScalar = false;
          if (subscribe) {
              this._subscribe = subscribe;
          }
      }
      /**
       * Creates a new Observable, with this Observable as the source, and the passed
       * operator defined as the new observable's operator.
       * @method lift
       * @param {Operator} operator the operator defining the operation to take on the observable
       * @return {Observable} a new observable with the Operator applied
       */
      Observable.prototype.lift = function (operator) {
          var observable = new Observable();
          observable.source = this;
          observable.operator = operator;
          return observable;
      };
      /**
       * Registers handlers for handling emitted values, error and completions from the observable, and
       *  executes the observable's subscriber function, which will take action to set up the underlying data stream
       * @method subscribe
       * @param {PartialObserver|Function} observerOrNext (optional) either an observer defining all functions to be called,
       *  or the first of three possible handlers, which is the handler for each value emitted from the observable.
       * @param {Function} error (optional) a handler for a terminal event resulting from an error. If no error handler is provided,
       *  the error will be thrown as unhandled
       * @param {Function} complete (optional) a handler for a terminal event resulting from successful completion.
       * @return {ISubscription} a subscription reference to the registered handlers
       */
      Observable.prototype.subscribe = function (observerOrNext, error, complete) {
          var operator = this.operator;
          var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
          if (operator) {
              operator.call(sink, this);
          }
          else {
              sink.add(this._subscribe(sink));
          }
          if (sink.syncErrorThrowable) {
              sink.syncErrorThrowable = false;
              if (sink.syncErrorThrown) {
                  throw sink.syncErrorValue;
              }
          }
          return sink;
      };
      /**
       * @method forEach
       * @param {Function} next a handler for each value emitted by the observable
       * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
       * @return {Promise} a promise that either resolves on observable completion or
       *  rejects with the handled error
       */
      Observable.prototype.forEach = function (next, PromiseCtor) {
          var _this = this;
          if (!PromiseCtor) {
              if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                  PromiseCtor = root_1.root.Rx.config.Promise;
              }
              else if (root_1.root.Promise) {
                  PromiseCtor = root_1.root.Promise;
              }
          }
          if (!PromiseCtor) {
              throw new Error('no Promise impl found');
          }
          return new PromiseCtor(function (resolve, reject) {
              var subscription = _this.subscribe(function (value) {
                  if (subscription) {
                      // if there is a subscription, then we can surmise
                      // the next handling is asynchronous. Any errors thrown
                      // need to be rejected explicitly and unsubscribe must be
                      // called manually
                      try {
                          next(value);
                      }
                      catch (err) {
                          reject(err);
                          subscription.unsubscribe();
                      }
                  }
                  else {
                      // if there is NO subscription, then we're getting a nexted
                      // value synchronously during subscription. We can just call it.
                      // If it errors, Observable's `subscribe` imple will ensure the
                      // unsubscription logic is called, then synchronously rethrow the error.
                      // After that, Promise will trap the error and send it
                      // down the rejection path.
                      next(value);
                  }
              }, reject, resolve);
          });
      };
      Observable.prototype._subscribe = function (subscriber) {
          return this.source.subscribe(subscriber);
      };
      /**
       * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
       * @method Symbol.observable
       * @return {Observable} this instance of the observable
       */
      Observable.prototype[symbol_observable_1.default] = function () {
          return this;
      };
      // HACK: Since TypeScript inherits static properties too, we have to
      // fight against TypeScript here so Subject can have a different static create signature
      /**
       * Creates a new cold Observable by calling the Observable constructor
       * @static true
       * @owner Observable
       * @method create
       * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
       * @return {Observable} a new cold observable
       */
      Observable.create = function (subscribe) {
          return new Observable(subscribe);
      };
      return Observable;
  }());
  exports.Observable = Observable;


/***/ },

/***/ 299:
/***/ function(module, exports) {

  "use strict";
  exports.empty = {
      isUnsubscribed: true,
      next: function (value) { },
      error: function (err) { throw err; },
      complete: function () { }
  };


/***/ },

/***/ 300:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  var __extends = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var isFunction_1 = __webpack_require__(120);
  var Subscription_1 = __webpack_require__(301);
  var Observer_1 = __webpack_require__(299);
  var rxSubscriber_1 = __webpack_require__(118);
  /**
   * Implements the {@link Observer} interface and extends the
   * {@link Subscription} class. While the {@link Observer} is the public API for
   * consuming the values of an {@link Observable}, all Observers get converted to
   * a Subscriber, in order to provide Subscription-like capabilities such as
   * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
   * implementing operators, but it is rarely used as a public API.
   *
   * @class Subscriber<T>
   */
  var Subscriber = (function (_super) {
      __extends(Subscriber, _super);
      /**
       * @param {Observer|function(value: T): void} [destinationOrNext] A partially
       * defined Observer or a `next` callback function.
       * @param {function(e: ?any): void} [error] The `error` callback of an
       * Observer.
       * @param {function(): void} [complete] The `complete` callback of an
       * Observer.
       */
      function Subscriber(destinationOrNext, error, complete) {
          _super.call(this);
          this.syncErrorValue = null;
          this.syncErrorThrown = false;
          this.syncErrorThrowable = false;
          this.isStopped = false;
          switch (arguments.length) {
              case 0:
                  this.destination = Observer_1.empty;
                  break;
              case 1:
                  if (!destinationOrNext) {
                      this.destination = Observer_1.empty;
                      break;
                  }
                  if (typeof destinationOrNext === 'object') {
                      if (destinationOrNext instanceof Subscriber) {
                          this.destination = destinationOrNext;
                          this.destination.add(this);
                      }
                      else {
                          this.syncErrorThrowable = true;
                          this.destination = new SafeSubscriber(this, destinationOrNext);
                      }
                      break;
                  }
              default:
                  this.syncErrorThrowable = true;
                  this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                  break;
          }
      }
      Subscriber.prototype[rxSubscriber_1.$$rxSubscriber] = function () { return this; };
      /**
       * A static factory for a Subscriber, given a (potentially partial) definition
       * of an Observer.
       * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
       * @param {function(e: ?any): void} [error] The `error` callback of an
       * Observer.
       * @param {function(): void} [complete] The `complete` callback of an
       * Observer.
       * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
       * Observer represented by the given arguments.
       */
      Subscriber.create = function (next, error, complete) {
          var subscriber = new Subscriber(next, error, complete);
          subscriber.syncErrorThrowable = false;
          return subscriber;
      };
      /**
       * The {@link Observer} callback to receive notifications of type `next` from
       * the Observable, with a value. The Observable may call this method 0 or more
       * times.
       * @param {T} [value] The `next` value.
       * @return {void}
       */
      Subscriber.prototype.next = function (value) {
          if (!this.isStopped) {
              this._next(value);
          }
      };
      /**
       * The {@link Observer} callback to receive notifications of type `error` from
       * the Observable, with an attached {@link Error}. Notifies the Observer that
       * the Observable has experienced an error condition.
       * @param {any} [err] The `error` exception.
       * @return {void}
       */
      Subscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              this.isStopped = true;
              this._error(err);
          }
      };
      /**
       * The {@link Observer} callback to receive a valueless notification of type
       * `complete` from the Observable. Notifies the Observer that the Observable
       * has finished sending push-based notifications.
       * @return {void}
       */
      Subscriber.prototype.complete = function () {
          if (!this.isStopped) {
              this.isStopped = true;
              this._complete();
          }
      };
      Subscriber.prototype.unsubscribe = function () {
          if (this.isUnsubscribed) {
              return;
          }
          this.isStopped = true;
          _super.prototype.unsubscribe.call(this);
      };
      Subscriber.prototype._next = function (value) {
          this.destination.next(value);
      };
      Subscriber.prototype._error = function (err) {
          this.destination.error(err);
          this.unsubscribe();
      };
      Subscriber.prototype._complete = function () {
          this.destination.complete();
          this.unsubscribe();
      };
      return Subscriber;
  }(Subscription_1.Subscription));
  exports.Subscriber = Subscriber;
  /**
   * We need this JSDoc comment for affecting ESDoc.
   * @ignore
   * @extends {Ignored}
   */
  var SafeSubscriber = (function (_super) {
      __extends(SafeSubscriber, _super);
      function SafeSubscriber(_parent, observerOrNext, error, complete) {
          _super.call(this);
          this._parent = _parent;
          var next;
          var context = this;
          if (isFunction_1.isFunction(observerOrNext)) {
              next = observerOrNext;
          }
          else if (observerOrNext) {
              context = observerOrNext;
              next = observerOrNext.next;
              error = observerOrNext.error;
              complete = observerOrNext.complete;
              if (isFunction_1.isFunction(context.unsubscribe)) {
                  this.add(context.unsubscribe.bind(context));
              }
              context.unsubscribe = this.unsubscribe.bind(this);
          }
          this._context = context;
          this._next = next;
          this._error = error;
          this._complete = complete;
      }
      SafeSubscriber.prototype.next = function (value) {
          if (!this.isStopped && this._next) {
              var _parent = this._parent;
              if (!_parent.syncErrorThrowable) {
                  this.__tryOrUnsub(this._next, value);
              }
              else if (this.__tryOrSetError(_parent, this._next, value)) {
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              var _parent = this._parent;
              if (this._error) {
                  if (!_parent.syncErrorThrowable) {
                      this.__tryOrUnsub(this._error, err);
                      this.unsubscribe();
                  }
                  else {
                      this.__tryOrSetError(_parent, this._error, err);
                      this.unsubscribe();
                  }
              }
              else if (!_parent.syncErrorThrowable) {
                  this.unsubscribe();
                  throw err;
              }
              else {
                  _parent.syncErrorValue = err;
                  _parent.syncErrorThrown = true;
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.complete = function () {
          if (!this.isStopped) {
              var _parent = this._parent;
              if (this._complete) {
                  if (!_parent.syncErrorThrowable) {
                      this.__tryOrUnsub(this._complete);
                      this.unsubscribe();
                  }
                  else {
                      this.__tryOrSetError(_parent, this._complete);
                      this.unsubscribe();
                  }
              }
              else {
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
          try {
              fn.call(this._context, value);
          }
          catch (err) {
              this.unsubscribe();
              throw err;
          }
      };
      SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
          try {
              fn.call(this._context, value);
          }
          catch (err) {
              parent.syncErrorValue = err;
              parent.syncErrorThrown = true;
              return true;
          }
          return false;
      };
      SafeSubscriber.prototype._unsubscribe = function () {
          var _parent = this._parent;
          this._context = null;
          this._parent = null;
          _parent.unsubscribe();
      };
      return SafeSubscriber;
  }(Subscriber));


/***/ },

/***/ 301:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  var isArray_1 = __webpack_require__(306);
  var isObject_1 = __webpack_require__(307);
  var isFunction_1 = __webpack_require__(120);
  var tryCatch_1 = __webpack_require__(309);
  var errorObject_1 = __webpack_require__(119);
  var UnsubscriptionError_1 = __webpack_require__(305);
  /**
   * Represents a disposable resource, such as the execution of an Observable. A
   * Subscription has one important method, `unsubscribe`, that takes no argument
   * and just disposes the resource held by the subscription.
   *
   * Additionally, subscriptions may be grouped together through the `add()`
   * method, which will attach a child Subscription to the current Subscription.
   * When a Subscription is unsubscribed, all its children (and its grandchildren)
   * will be unsubscribed as well.
   *
   * @class Subscription
   */
  var Subscription = (function () {
      /**
       * @param {function(): void} [unsubscribe] A function describing how to
       * perform the disposal of resources when the `unsubscribe` method is called.
       */
      function Subscription(unsubscribe) {
          /**
           * A flag to indicate whether this Subscription has already been unsubscribed.
           * @type {boolean}
           */
          this.isUnsubscribed = false;
          if (unsubscribe) {
              this._unsubscribe = unsubscribe;
          }
      }
      /**
       * Disposes the resources held by the subscription. May, for instance, cancel
       * an ongoing Observable execution or cancel any other type of work that
       * started when the Subscription was created.
       * @return {void}
       */
      Subscription.prototype.unsubscribe = function () {
          var hasErrors = false;
          var errors;
          if (this.isUnsubscribed) {
              return;
          }
          this.isUnsubscribed = true;
          var _a = this, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
          this._subscriptions = null;
          if (isFunction_1.isFunction(_unsubscribe)) {
              var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
              if (trial === errorObject_1.errorObject) {
                  hasErrors = true;
                  (errors = errors || []).push(errorObject_1.errorObject.e);
              }
          }
          if (isArray_1.isArray(_subscriptions)) {
              var index = -1;
              var len = _subscriptions.length;
              while (++index < len) {
                  var sub = _subscriptions[index];
                  if (isObject_1.isObject(sub)) {
                      var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                      if (trial === errorObject_1.errorObject) {
                          hasErrors = true;
                          errors = errors || [];
                          var err = errorObject_1.errorObject.e;
                          if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                              errors = errors.concat(err.errors);
                          }
                          else {
                              errors.push(err);
                          }
                      }
                  }
              }
          }
          if (hasErrors) {
              throw new UnsubscriptionError_1.UnsubscriptionError(errors);
          }
      };
      /**
       * Adds a tear down to be called during the unsubscribe() of this
       * Subscription.
       *
       * If the tear down being added is a subscription that is already
       * unsubscribed, is the same reference `add` is being called on, or is
       * `Subscription.EMPTY`, it will not be added.
       *
       * If this subscription is already in an `isUnsubscribed` state, the passed
       * tear down logic will be executed immediately.
       *
       * @param {TeardownLogic} teardown The additional logic to execute on
       * teardown.
       * @return {Subscription} Returns the Subscription used or created to be
       * added to the inner subscriptions list. This Subscription can be used with
       * `remove()` to remove the passed teardown logic from the inner subscriptions
       * list.
       */
      Subscription.prototype.add = function (teardown) {
          if (!teardown || (teardown === this) || (teardown === Subscription.EMPTY)) {
              return;
          }
          var sub = teardown;
          switch (typeof teardown) {
              case 'function':
                  sub = new Subscription(teardown);
              case 'object':
                  if (sub.isUnsubscribed || typeof sub.unsubscribe !== 'function') {
                      break;
                  }
                  else if (this.isUnsubscribed) {
                      sub.unsubscribe();
                  }
                  else {
                      (this._subscriptions || (this._subscriptions = [])).push(sub);
                  }
                  break;
              default:
                  throw new Error('Unrecognized teardown ' + teardown + ' added to Subscription.');
          }
          return sub;
      };
      /**
       * Removes a Subscription from the internal list of subscriptions that will
       * unsubscribe during the unsubscribe process of this Subscription.
       * @param {Subscription} subscription The subscription to remove.
       * @return {void}
       */
      Subscription.prototype.remove = function (subscription) {
          // HACK: This might be redundant because of the logic in `add()`
          if (subscription == null || (subscription === this) || (subscription === Subscription.EMPTY)) {
              return;
          }
          var subscriptions = this._subscriptions;
          if (subscriptions) {
              var subscriptionIndex = subscriptions.indexOf(subscription);
              if (subscriptionIndex !== -1) {
                  subscriptions.splice(subscriptionIndex, 1);
              }
          }
      };
      Subscription.EMPTY = (function (empty) {
          empty.isUnsubscribed = true;
          return empty;
      }(new Subscription()));
      return Subscription;
  }());
  exports.Subscription = Subscription;


/***/ },

/***/ 302:
/***/ function(module, exports, __webpack_require__) {

  module.exports = __webpack_require__(303);


/***/ },

/***/ 303:
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global) {'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _ponyfill = __webpack_require__(304);
  
  var _ponyfill2 = _interopRequireDefault(_ponyfill);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  var root = undefined; /* global window */
  
  if (typeof global !== 'undefined') {
    root = global;
  } else if (typeof window !== 'undefined') {
    root = window;
  }
  
  var result = (0, _ponyfill2.default)(root);
  exports.default = result;
  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 304:
/***/ function(module, exports) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = symbolObservablePonyfill;
  function symbolObservablePonyfill(root) {
    var result;
    var _Symbol = root.Symbol;
  
    if (typeof _Symbol === 'function') {
      if (_Symbol.observable) {
        result = _Symbol.observable;
      } else {
        result = _Symbol('observable');
        _Symbol.observable = result;
      }
    } else {
      result = '@@observable';
    }
  
    return result;
  };

/***/ },

/***/ 118:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  var root_1 = __webpack_require__(121);
  var Symbol = root_1.root.Symbol;
  exports.$$rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
      Symbol.for('rxSubscriber') : '@@rxSubscriber';


/***/ },

/***/ 305:
/***/ function(module, exports) {

  "use strict";
  var __extends = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  /**
   * An error thrown when one or more errors have occurred during the
   * `unsubscribe` of a {@link Subscription}.
   */
  var UnsubscriptionError = (function (_super) {
      __extends(UnsubscriptionError, _super);
      function UnsubscriptionError(errors) {
          _super.call(this);
          this.errors = errors;
          var err = Error.call(this, errors ?
              errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n  ') : '');
          this.name = err.name = 'UnsubscriptionError';
          this.stack = err.stack;
          this.message = err.message;
      }
      return UnsubscriptionError;
  }(Error));
  exports.UnsubscriptionError = UnsubscriptionError;


/***/ },

/***/ 119:
/***/ function(module, exports) {

  "use strict";
  // typeof any so that it we don't have to cast when comparing a result to the error object
  exports.errorObject = { e: {} };


/***/ },

/***/ 306:
/***/ function(module, exports) {

  "use strict";
  exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });


/***/ },

/***/ 120:
/***/ function(module, exports) {

  "use strict";
  function isFunction(x) {
      return typeof x === 'function';
  }
  exports.isFunction = isFunction;


/***/ },

/***/ 307:
/***/ function(module, exports) {

  "use strict";
  function isObject(x) {
      return x != null && typeof x === 'object';
  }
  exports.isObject = isObject;


/***/ },

/***/ 121:
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(module, global) {"use strict";
  var objectTypes = {
      'boolean': false,
      'function': true,
      'object': true,
      'number': false,
      'string': false,
      'undefined': false
  };
  exports.root = (objectTypes[typeof self] && self) || (objectTypes[typeof window] && window);
  /* tslint:disable:no-unused-variable */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
      exports.root = freeGlobal;
  }
  
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(311)(module), (function() { return this; }())))

/***/ },

/***/ 308:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  var Subscriber_1 = __webpack_require__(300);
  var rxSubscriber_1 = __webpack_require__(118);
  function toSubscriber(nextOrObserver, error, complete) {
      if (nextOrObserver) {
          if (nextOrObserver instanceof Subscriber_1.Subscriber) {
              return nextOrObserver;
          }
          if (nextOrObserver[rxSubscriber_1.$$rxSubscriber]) {
              return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
          }
      }
      if (!nextOrObserver && !error && !complete) {
          return new Subscriber_1.Subscriber();
      }
      return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
  }
  exports.toSubscriber = toSubscriber;


/***/ },

/***/ 309:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  var errorObject_1 = __webpack_require__(119);
  var tryCatchTarget;
  function tryCatcher() {
      try {
          return tryCatchTarget.apply(this, arguments);
      }
      catch (e) {
          errorObject_1.errorObject.e = e;
          return errorObject_1.errorObject;
      }
  }
  function tryCatch(fn) {
      tryCatchTarget = fn;
      return tryCatcher;
  }
  exports.tryCatch = tryCatch;
  ;


/***/ },

/***/ 311:
/***/ function(module, exports) {

  module.exports = function(module) {
    if(!module.webpackPolyfill) {
      module.deprecate = function() {};
      module.paths = [];
      // module.parent = undefined by default
      module.children = [];
      module.webpackPolyfill = 1;
    }
    return module;
  }


/***/ },

/***/ 81:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const KiiQuery_1 = __webpack_require__(88);
  class ChartAggregationNode extends KiiQuery_1.AggregationNode {
      constructor(obj) {
          super(obj);
          _.extend(this, obj);
          let _that = this;
          _.each(this.children, (child, i) => {
              _that.children[i] = new ChartAggregationNode(child);
          });
      }
  }
  exports.ChartAggregationNode = ChartAggregationNode;


/***/ },

/***/ 122:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const ChartAggregationNode_1 = __webpack_require__(81);
  const components_1 = __webpack_require__(136);
  const KiiChartUtils_1 = __webpack_require__(47);
  const DOM_WATCH_INTERVAL = 300;
  class KiiChart {
      constructor(aggTree, $selector, options, theme = 'default') {
          this._parent = null;
          this._domWidth = null;
          this._domHeight = null;
          this._$selector = $selector;
          this._options = options;
          this._aggTree = new ChartAggregationNode_1.ChartAggregationNode(KiiChartUtils_1.KiiChartUtils.clone(aggTree));
          if (!this._$selector || !this._$selector.get(0)) {
              throw new Error('No given container!');
          }
          this._init();
      }
      _init() {
          this._legend = new components_1.Legend(this);
          this._seriesGroups = [];
          this._yAxises = [];
          this._xAxis = null;
          this._generateToolTip();
          let _options = {
              _backButton: {
                  style: {
                      position: 'absolute',
                      top: '10px',
                      left: '10px'
                  },
                  text: '返回'
              }
          };
          _.extend(this._options, _options);
          this._parent = this._options._parent;
          this._canvas = $('<div></div>').appendTo(this._$selector);
          this._canvas
              .css({
              'height': '100%',
              'width': '100%'
          });
          this._echartInstance = ECharts.init(this._canvas.get(0), 'default', this._options);
          if (this._parent) {
              let _that = this;
              let $button = $('<button>' + this._options._backButton.text + '</button>').appendTo(this._canvas);
              $button.css(this._options._backButton.style);
              $button.click(($event) => {
                  _that.goBack();
              });
          }
          this._echartInstance.on('click', (event) => {
              this._drilldown(event);
          });
          this._watchDom();
      }
      _hide() {
          this._canvas.hide();
      }
      _show() {
          this._canvas.show();
      }
      updateAggTree(aggNode) {
          this._aggTree = new ChartAggregationNode_1.ChartAggregationNode(KiiChartUtils_1.KiiChartUtils.clone(aggNode));
      }
      refresh() {
          let _that = this;
          this._options.series = [];
          if (this._dataChanged) {
              this._xAxis = null;
              this._yAxises = [];
              this._factorySeriesGroups();
              this._generateXAxis();
              _.each(this._seriesGroups, (s) => {
                  s.useXAxis(this._xAxis);
                  _that._generateYAxis(s);
              });
          }
          let seriesGroups = this._seriesGroups;
          let series = [];
          let xAxis = this._xAxis ? this._xAxis.getProperties() : {};
          let yAxises = [];
          let dataZooms = [];
          let tooltip = this._toolTip.getProperties();
          let legend = this._legend;
          legend.refresh();
          _.each(this._selectedAggNode.metrics, (metric) => {
              if (!metric.selected)
                  return;
              let seriesGroup = _.find(seriesGroups, g => g.getMetric() == metric);
              if (!seriesGroup)
                  return;
              let seriesSet = seriesGroup.getSeriesSet();
              series = series.concat(seriesSet);
              let yAxis = _.find(_that._yAxises, (yx) => {
                  return yx.getGroupID() == (metric.group || 0);
              });
              if (!yAxis)
                  return;
              if (_.findIndex(yAxises, { groupID: yAxis.getGroupID() }) < 0) {
                  yAxises.push(yAxis.getProperties());
              }
              _.each(seriesSet, (s) => {
                  s.yAxisIndex = _.findIndex(yAxises, { groupID: yAxis.getGroupID() });
                  return s;
              });
          });
          if (this._seriesGroups.length > 0) {
              if (this._seriesGroups[0].xAxis) {
                  dataZooms.push(this._seriesGroups[0].xAxis.dataZoom);
              }
              _.each(this._yAxises, (yx, i) => {
                  yx.dataZoom.yAxisIndex = i;
                  dataZooms.push(yx.dataZoom);
              });
              _.extend(this._options, {
                  xAxis: this._seriesGroups[0] instanceof components_1.PieSeriesGroup ? null : xAxis,
                  yAxis: yAxises,
                  series: series,
                  dataZoom: dataZooms,
                  tooltip: tooltip,
                  legend: legend.getProperties()
              });
          }
          this._echartInstance.setOption(this._getEchartOptions());
      }
      _getEchartOptions() {
          let _options = {};
          _.each(this._options, (option, key) => {
              if (key.indexOf('_') == 0)
                  return;
              _options[key] = option;
          });
          return _options;
      }
      _retrievalAggTree(func) {
          let _currentNode = this._aggTree;
          let _targetNode = this.getSelectedAggNode();
          let _fullTrace = _targetNode.trace.concat([]).splice(_currentNode.trace.length);
          if (!_currentNode)
              return;
          func(_currentNode);
          _.each(_fullTrace, (_trace) => {
              _currentNode = _currentNode.children[_trace];
              func(_currentNode);
          });
      }
      _watchDom() {
          let $dom = this._$selector;
          let _that = this;
          this._domWatcher = setInterval(() => {
              if (_that._domWidth != $dom.width() || _that._domHeight != $dom.height()) {
                  _that._domWidth = $dom.width();
                  _that._domHeight = $dom.height();
                  _that._resize();
              }
          }, DOM_WATCH_INTERVAL);
      }
      _resize() {
          this._echartInstance.resize();
      }
      goBack() {
          this._parent._show();
          this._destroy();
      }
      _drilldown(event) {
          if (this._seriesGroups[0] instanceof components_1.PieSeriesGroup) {
              this.drilldownByCategory(event);
              return;
          }
          switch (this._aggTree.type) {
              case "category":
                  this.drilldownByCategory(event);
                  break;
              default:
                  this.dirlldownByValue(event);
                  break;
          }
      }
      dirlldownByValue(event) {
          let data = this.getData();
          let chart = KiiChart.createChart(this._aggTree.children[this.aggTrace[0]], this.getSelectedAggNode(), this._$selector, { _parent: this });
          chart.selectAggNode(this.getSelectedAggNode());
          chart.setData(data[this._aggTree.fieldName][this._aggTree.keySet[event.dataIndex]]);
          chart.refresh();
          this._hide();
      }
      drilldownByCategory(event) {
          let dimensions = event.data.dimensions;
          let keys = Object.keys(dimensions);
          if (keys.length > this.aggTrace.length)
              return;
          let data = this.getData();
          let aggNode = this._aggTree;
          let _that = this;
          let i = 0;
          _.each(dimensions, (dimension) => {
              data = _.find(data[aggNode.fieldName], (doc, key) => {
                  return key == dimension;
              });
              aggNode = aggNode.children[_that.aggTrace[i++]];
          });
          let chart = KiiChart.createChart(aggNode, this.getSelectedAggNode(), this._$selector, { _parent: this });
          chart.selectAggNode(this.getSelectedAggNode());
          chart.setData(data);
          chart.refresh();
          this._hide();
      }
      setData(data) {
          this._originData = KiiChartUtils_1.KiiChartUtils.clone(data);
          this._data = KiiChartUtils_1.KiiChartUtils.clone(this._originData);
          this._dataChanged = true;
      }
      getData() {
          return this._originData;
      }
      destroy() {
          this._destroy();
      }
      _destroy() {
          this._echartInstance.dispose();
          this._canvas.remove();
          clearInterval(this._domWatcher);
      }
      getSelectedAggNode() {
          return this._selectedAggNode;
      }
      selectAggNode(node) {
          this._selectedAggNode = this._aggTree;
          let _trace = node.trace.concat([]);
          _trace.splice(0, this._aggTree.trace.length);
          for (let i = _trace.length; i > 0; i--) {
              this._selectedAggNode = this._selectedAggNode.children[_trace.shift()];
          }
          if (!_.find(this._selectedAggNode.metrics, (metric => { return metric.selected; }))) {
              this._selectedAggNode.metrics[0].selected = true;
          }
          this.aggTrace = node.trace.concat([]).splice(this._aggTree.trace.length);
      }
      _factorySeriesGroups() {
          this._dataChanged = false;
          let seriesGroups = [];
          let _chart = this;
          this._seriesGroups = seriesGroups;
          let selectedNode = this._selectedAggNode;
          let metrics = selectedNode.getSelectedMetrics();
          let chartType = this._aggTree.chart || selectedNode.metrics[0].chart;
          _.each(metrics, (metric) => {
              let seriesGroup;
              switch (chartType) {
                  case 'pie':
                      seriesGroup = new components_1.PieSeriesGroup(_chart, metric);
                      break;
                  case 'line':
                      seriesGroup = new components_1.LineSeriesGroup(_chart, metric);
                      break;
                  case 'bar':
                      seriesGroup = new components_1.BarSeriesGroup(_chart, metric);
                      break;
                  default:
                      seriesGroup = new components_1.LineSeriesGroup(_chart, metric);
                      break;
              }
              seriesGroups.push(seriesGroup);
          });
          this._seriesGroups = seriesGroups;
      }
      getSeriesGroups() {
          return this._seriesGroups;
      }
      getAggTree() {
          return this._aggTree;
      }
      static createChart(aggregations, level, $selector, options) {
          let chart = new KiiChart(aggregations, $selector, options);
          chart.selectAggNode(level);
          return chart;
      }
      generateSeriesData(type, metric) {
          switch (type) {
              case 'category':
                  return this._getSeriesDatasetByCategory(metric);
              default:
                  return this._getSeriesDatasetByValue(metric);
          }
      }
      getContainer() {
          return this._$selector;
      }
      _generateXAxis() {
          let aggRoot = this.getAggTree();
          let _options = {};
          if (aggRoot.type == 'category') {
              let options = {
                  name: aggRoot.displayName,
                  type: 'category',
                  splitLine: {
                      show: false
                  },
                  data: []
              };
              this._xAxis = new components_1.XAxis(options);
          }
          else {
              let _data = aggRoot.keySet;
              let options = {
                  name: aggRoot.displayName,
                  type: 'category',
                  splitLine: {
                      show: false
                  },
                  data: _data
              };
              this._xAxis = new components_1.XAxis(options);
          }
          this._xAxis.setDataType(aggRoot.type);
      }
      _generateYAxis(seriesGroup) {
          if (seriesGroup instanceof components_1.PieSeriesGroup)
              return;
          let metric = seriesGroup.getMetric();
          let yAxis = _.find(this._yAxises, (yAxis) => { return yAxis.getGroupID() == (metric.group || 0); });
          if (yAxis) {
              seriesGroup.useYAxis(yAxis);
              return;
          }
          let _that = this;
          let options = {
              name: metric.displayName
          };
          yAxis = new components_1.YAxis(options);
          yAxis.setGroupID(metric.group || 0);
          seriesGroup.useYAxis(yAxis);
          this._yAxises.push(yAxis);
      }
      _generateToolTip() {
          switch (this._aggTree.type) {
              case 'value':
              case 'time':
                  this._toolTip = new components_1.ToolTip({ trigger: 'axis' });
                  break;
              default:
                  this._toolTip = new components_1.ToolTip({ trigger: 'item' });
                  break;
          }
          if(this._aggTree.chart == 'pie'){
            this._toolTip.formatter = "{b}<br/> {c} ({d}%)";
          }
      }
      _getSeriesDatasetByValue(myMetric) {
          let _aggs = [];
          let _data = this._data;
          let _rootNode = this._aggTree;
          let _aggNode = this.getSelectedAggNode();
          let _xData = this._aggTree.keySet;
          let _yData = [];
          let currentNode = this.getSelectedAggNode();
          if (this._aggTree.trace.length == currentNode.trace.length) {
              _yData = [retrieval(currentNode, currentNode, _data[currentNode.fieldName], null, {})];
          }
          else {
              let _childNode = this._aggTree.children[currentNode.trace[this._aggTree.trace.length]];
              _.each(this._aggTree.keySet, (key) => {
                  let _dimension = {};
                  _dimension[this._aggTree.trace.join('-')] = key;
                  let _result = retrieval(_childNode, currentNode, _data[this._aggTree.fieldName][key][_childNode.fieldName], null, _dimension);
                  _yData = _yData.concat(_result);
              });
              _yData = _.groupBy(_yData, 'name');
          }
          function retrieval(rootNode, targetNode, data, name, dimensions) {
              let trace = targetNode.trace.concat([]).splice(rootNode.trace.length);
              if (trace.length) {
                  let results = [];
                  _.each(rootNode.keySet, (key) => {
                      _.each(rootNode.children, (child) => {
                          let _name = (name ? (name + ' ') : '') + key;
                          let _dimension = {};
                          _dimension[rootNode.trace.join('-')] = key;
                          _.extend(_dimension, dimensions);
                          let _result = retrieval(child, targetNode, data[key][child.fieldName], _name, _dimension);
                          results = results.concat(_result);
                      });
                  });
                  return results;
              }
              else {
                  let result = [];
                  _.each(targetNode.keySet, (key) => {
                      let _dimension = {};
                      _dimension[targetNode.trace.join('-')] = key;
                      _.extend(_dimension, dimensions);
                      let _data = {
                          name: (name ? (name + ' ') : '') + key,
                          dimensions: _dimension
                      };
                      _data[myMetric.fieldName] = { "name": key, value: data[key][myMetric.fieldName] };
                      result.push(_data);
                  });
                  return result;
              }
          }
          return { x: _xData, y: _yData };
      }
      _getSeriesDatasetByCategory(myMetric) {
          let _aggs = [];
          let _data = this._data;
          let _rootNode = this._aggTree;
          let _aggNode = this.getSelectedAggNode();
          let _categoryData = [];
          this._retrievalAggTree((aggNode) => {
              _categoryData.push(retrieval(_rootNode, aggNode, _data[_rootNode.fieldName], {}));
          });
          function retrieval(rootNode, targetNode, data, dimensions) {
              let trace = targetNode.trace.concat([]).splice(rootNode.trace.length);
              if (trace.length) {
                  let results = [];
                  _.each(rootNode.keySet, (key) => {
                      _.each(rootNode.children, (child) => {
                          let _dimension = {};
                          _dimension[rootNode.trace.join('-')] = key;
                          _.extend(_dimension, dimensions);
                          let _result = retrieval(child, targetNode, data[key][child.fieldName], _dimension);
                          results = results.concat(_result);
                      });
                  });
                  return results;
              }
              else {
                  let result = [];
                  _.each(targetNode.keySet, (key) => {
                      let _dimension = {};
                      _dimension[targetNode.trace.join('-')] = key;
                      _.extend(_dimension, dimensions);
                      let _data = {
                          name: key,
                          dimensions: _dimension,
                          value: data[key][myMetric.fieldName]
                      };
                      result.push(_data);
                  });
                  return result;
              }
          }
          return { x: [], y: _categoryData };
      }
  }
  exports.KiiChart = KiiChart;


/***/ },

/***/ 47:
/***/ function(module, exports) {

  "use strict";
  exports.KiiChartUtils = {
      extractSeries(options) {
          return options.series;
      },
      clone(obj) {
          return JSON.parse(JSON.stringify(obj));
      },
      dateParse(date) {
          function pad(num) {
              let str = num + '';
              return str.length < 2 ? '0' + str : str;
          }
          return date.getFullYear() + '/' +
              pad(date.getMonth() + 1) + '/' +
              pad(date.getDate()) + ' ' +
              pad(date.getHours()) + ':' +
              pad(date.getMinutes());
      },
      guid() {
          function s4() {
              return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
      }
  };


/***/ },

/***/ 82:
/***/ function(module, exports) {

  "use strict";
  class DataZoom {
      constructor(options) {
          this.show = true;
          _.extend(this, options);
      }
      update(options) {
          _.extend(this, options);
      }
  }
  exports.DataZoom = DataZoom;


/***/ },

/***/ 123:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const _axis_1 = __webpack_require__(58);
  const KiiChartUtils_1 = __webpack_require__(47);
  class XAxis extends _axis_1._axis {
      constructor(options) {
          let _options = {
              type: 'category',
              splitLine: {
                  show: false
              },
              silent: true
          };
          _.extend(_options, options);
          super(options);
          this.dataZoom.xAxisIndex = 0;
      }
      setDataType(type) {
          this._dataType = type;
      }
      refresh() {
      }
      _getProperties() {
          let properties = {
              data: this.data
          };
          let formatter = function (d) {
              return KiiChartUtils_1.KiiChartUtils.dateParse(new Date(d));
          };
          properties.data = _.map(properties.data, formatter);
          if (this._dataType == 'time') {
              _.extend(properties, {
                  axisLabel: {}
              });
          }
          return properties;
      }
  }
  exports.XAxis = XAxis;


/***/ },

/***/ 124:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const _axis_1 = __webpack_require__(58);
  const SeriesGroup_1 = __webpack_require__(83);
  ;
  class YAxis extends _axis_1._axis {
      constructor(options) {
          let _options = {
              minInterval: 1,
              type: 'value',
              splitLine: {
                  show: false
              },
              axisLabel: {
                  formatter: (value, index) => {
                      return value / this._scaleTimes;
                  }
              },
              boundaryGap: ['10%', '10%'],
              silent: true,
              scale: true
          };
          _.extend(_options, options);
          super(_options);
          this.dataZoom.show = false;
          this._dataset = this._dataset || [];
          this._seriesGroups = [];
      }
      setGroupID(groupID) {
          this._groupID = groupID;
      }
      getGroupID() {
          return this._groupID;
      }
      refresh() {
          this._scale();
      }
      addSeriesGroup(s) {
          if (this._seriesGroups.indexOf(s) < 0)
              this._seriesGroups.push(s);
      }
      _getProperties() {
          let _that = this;
          let formatter = function (value) {
              return value / _that._scaleTimes | 0;
          };
          let scale = this.scale;
          if (this._seriesGroups.length > 0 && this._seriesGroups[0] instanceof SeriesGroup_1.BarSeriesGroup) {
              scale = false;
          }
          return {
              name: this.name + '(单位：' + this._scaleTimes + ')',
              groupID: this.getGroupID(),
              axisLabel: {
                  formatter: formatter
              },
              scale: scale
          };
      }
      _scale() {
          let _that = this;
          let _max = 0;
          let _indexes = [];
          this._scaleTimes = 1;
          let _dataset = [];
          _.each(this._seriesGroups, (s, i) => {
              if (!s.isShown())
                  return;
              let tmp = _.pluck(s.getSeriesSet(), 'data');
              _.each(tmp, da => {
                  if (da.length < 1)
                      return;
                  if (_.isNumber(da[0])) {
                      _dataset = _dataset.concat(da);
                  }
                  else {
                      _dataset = _dataset.concat(_.pluck(da, 'value'));
                  }
              });
          });
          _dataset = _.map(_dataset, da => Math.abs(da));
          _max = _dataset.length > 0 ? _.max(_dataset) : 0;
          while (_max >= 1000) {
              _max /= 10;
              this._scaleTimes *= 10;
          }
          while (_max < 10 && _max != 0) {
              _max *= 10;
              this._scaleTimes /= 10;
          }
      }
  }
  exports.YAxis = YAxis;


/***/ },

/***/ 58:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const DataZoom_1 = __webpack_require__(82);
  const AxisPropertyNames = ['name', 'axisLabel', 'type', 'scale',
      'boundrayGap', 'silent', 'splitLine', 'data'];
  class _axis {
      constructor(options) {
          _.extend(this, options);
          let dataZoomOptions = {
              show: true,
              realtime: true,
              start: 0,
              end: 100,
          };
          this.dataZoom = new DataZoom_1.DataZoom(dataZoomOptions);
      }
      update(options) {
          _.extend(this, options);
      }
      getProperties() {
          let options = {};
          _.each(AxisPropertyNames, (key) => {
              if (this.hasOwnProperty(key)) {
                  options[key] = this[key];
              }
          });
          _.extend(options, this._getProperties());
          return options;
      }
  }
  exports._axis = _axis;


/***/ },

/***/ 125:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(123));
  __export(__webpack_require__(124));
  __export(__webpack_require__(82));
  var _axis_1 = __webpack_require__(58);
  exports.IAxisProperties = _axis_1.IAxisProperties;


/***/ },

/***/ 126:
/***/ function(module, exports) {

  "use strict";
  const LegendOptionsFields = ['data'];
  class Legend {
      constructor(chart, options) {
          this._chart = chart;
          _.extend(this, options);
      }
      refresh() {
          this.data = [];
          _.each(this._chart.getSeriesGroups(), (s) => {
              if (s.isShown()) {
                  this.data = this.data.concat(s.names);
              }
          });
      }
      getProperties() {
          let _that = this;
          let properties = {};
          _.each(LegendOptionsFields, (key) => {
              if (_that.hasOwnProperty(key)) {
                  properties[key] = _that[key];
              }
          });
          return properties;
      }
  }
  exports.Legend = Legend;


/***/ },

/***/ 127:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(126));


/***/ },

/***/ 128:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const _seriesGroup_1 = __webpack_require__(48);
  class BarSeriesGroup extends _seriesGroup_1._seriesGroup {
      constructor(_chart, metric) {
          super(_chart, metric);
      }
      _init() {
          let _data = null;
          let _that = this;
          let aggNode = this._chart.getSelectedAggNode();
          let aggRoot = this._chart.getAggTree();
          _data = this._chart.generateSeriesData(aggRoot.type, this._metric);
          this._data = _data;
          if (aggRoot.type == 'category') {
              this._seriesSet = _.map(_data.y[0], (series, index) => {
                  return {
                      name: series.name,
                      type: 'bar',
                      showSymbol: true,
                      hoverAnimation: true,
                      data: [series.value],
                      groupID: this._uuid
                  };
              });
          }
          else {
              this._seriesSet = _.map(_data.y, (group, key) => {
                  let _dimensions = {};
                  if (group.length) {
                      _.each(group[0].dimensions, (dimension, aggIndex) => {
                          if (aggIndex == aggRoot.trace.join('-')) {
                              return;
                          }
                          _dimensions[aggIndex] = dimension;
                      });
                  }
                  return {
                      name: key,
                      type: 'bar',
                      showSymbol: true,
                      hoverAnimation: true,
                      data: _.pluck(group, this._metric.fieldName),
                      dimensions: _dimensions,
                      groupID: this._uuid
                  };
              });
          }
          this.names = _.pluck(this._seriesSet, 'name');
      }
      useXAxis(xAxis) {
          this.xAxis = xAxis;
          if (this._chart.getAggTree().type == 'category') {
              xAxis.dataZoom.show = false;
          }
      }
  }
  exports.BarSeriesGroup = BarSeriesGroup;


/***/ },

/***/ 129:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(128));


/***/ },

/***/ 130:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const _seriesGroup_1 = __webpack_require__(48);
  class LineSeriesGroup extends _seriesGroup_1._seriesGroup {
      constructor(_chart, metric) {
          super(_chart, metric);
      }
      _init() {
          let _data = null;
          let _that = this;
          let aggNode = this._chart.getSelectedAggNode();
          let aggRoot = this._chart.getAggTree();
          _data = this._chart.generateSeriesData(aggRoot.type, this._metric);
          this._data = _data;
          this._seriesSet = _.map(_data.y, (group, key) => {
              let _dimensions = {};
              if (group.length) {
                  _.each(group[0].dimensions, (dimension, aggIndex) => {
                      if (aggIndex == aggRoot.trace.join('-')) {
                          return;
                      }
                      _dimensions[aggIndex] = dimension;
                  });
              }
              return {
                  name: key,
                  type: 'line',
                  showSymbol: true,
                  hoverAnimation: true,
                  data: _.pluck(group, this._metric.fieldName),
                  dimensions: _dimensions,
                  groupID: this._uuid
              };
          });
          this.names = _.pluck(this._seriesSet, 'name');
      }
  }
  exports.LineSeriesGroup = LineSeriesGroup;


/***/ },

/***/ 131:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(130));


/***/ },

/***/ 132:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const _seriesGroup_1 = __webpack_require__(48);
  const KiiChartUtils_1 = __webpack_require__(47);
  class PieSeriesGroup extends _seriesGroup_1._seriesGroup {
      constructor(_chart, metric) {
          super(_chart, metric);
      }
      _init() {
          let _that = this;
          let aggRoot = this._chart.getAggTree();
          let _data = this._chart.generateSeriesData('category', this._metric);
          this._data = _data;
          this.names = [];
          this._seriesSet = _.map(_data.y, (series, index) => {
              let _t = index;
              let _aggNode = aggRoot;
              while (_t--) {
                  _aggNode = _aggNode.children[this._chart.aggTrace[_t]];
              }
              if (_aggNode.type == 'time') {
                  _.each(series, (s) => {
                      s.name = KiiChartUtils_1.KiiChartUtils.dateParse(new Date(s.name));
                  });
              }
              this.names = this.names.concat(_.pluck(series, 'name'));
              return {
                  type: 'pie',
                  showSymbol: true,
                  hoverAnimation: true,
                  data: series,
                  groupID: this._uuid,
                  radius: this._generateRadius(index, _data.y.length)
              };
          });
      }
      _generateRadius(index, length) {
          let radiusSet = [];
          switch (length) {
              case 1:
                  return [
                      [0, '60%']
                  ][index];
              case 2:
                  return [
                      [0, '30%'],
                      ['40%', '55%']
                  ][index];
              case 3:
                  return [
                      [0, '20%'],
                      ['30%', '45%'],
                      ['55%', '65%']
                  ][index];
          }
      }
      useXAxis(xAxis) {
          this.xAxis = null;
      }
      useYAxis(yAxis) {
          this.yAxis = null;
      }
  }
  exports.PieSeriesGroup = PieSeriesGroup;


/***/ },

/***/ 133:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(132));


/***/ },

/***/ 48:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const KiiChartUtils_1 = __webpack_require__(47);
  class _seriesGroup {
      constructor(_chart, metric) {
          this._show = false;
          this._chart = _chart;
          this._uuid = KiiChartUtils_1.KiiChartUtils.guid();
          this._metric = metric;
          if (this._metric.selected) {
              this._show = true;
          }
          this._init();
      }
      getID() {
          return this._uuid;
      }
      show() {
          if (this._show)
              return;
          this._show = true;
          this._chart.refresh();
      }
      hide() {
          if (!this._show)
              return;
          this._show = false;
          this._chart.refresh();
      }
      isShown() {
          return this._show;
      }
      getSeriesSet() {
          return this._seriesSet;
      }
      getMetric() {
          return this._metric;
      }
      useXAxis(xAxis) {
          this.xAxis = xAxis;
      }
      useYAxis(yAxis) {
          this.yAxis = yAxis;
          yAxis.addSeriesGroup(this);
          yAxis.refresh();
      }
  }
  exports._seriesGroup = _seriesGroup;


/***/ },

/***/ 83:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(48));
  __export(__webpack_require__(129));
  __export(__webpack_require__(131));
  __export(__webpack_require__(133));


/***/ },

/***/ 134:
/***/ function(module, exports) {

  "use strict";
  class ToolTip {
      constructor(options) {
          let _options = {
              axisPointer: {
                  type: 'shadow'
              }
          };
          _.extend(_options, options);
          _.extend(this, _options);
      }
      getProperties() {
          return {
              formatter: this.formatter,
              axisPointer: this.axisPointer,
              trigger: this.trigger
          };
      }
  }
  exports.ToolTip = ToolTip;


/***/ },

/***/ 135:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(134));


/***/ },

/***/ 136:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(125));
  __export(__webpack_require__(127));
  __export(__webpack_require__(83));
  __export(__webpack_require__(135));


/***/ },

/***/ 137:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(122));
  __export(__webpack_require__(81));


/***/ },

/***/ 84:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const KiiQueryCompiler_1 = __webpack_require__(139);
  const KiiQueryDataParser_1 = __webpack_require__(86);
  const KiiQueryUtils_1 = __webpack_require__(59);
  class AggregationNode {
      constructor(obj) {
      }
      getSelectedMetrics() {
          let metrics = [];
          _.each(this.metrics, (metric) => {
              if (metric.selected) {
                  metrics.push(metric);
              }
          });
          return metrics;
      }
      compile(queryJSON) {
          return deepCompile(queryJSON, this);
          function deepCompile(queryJSON, aggNode) {
              _.each(aggNode.children, (_a) => {
                  deepCompile(queryJSON[aggNode.fieldName].aggs, _a);
              });
              _.each(aggNode.metrics, (_m) => {
                  let metricCompiler = KiiQueryCompiler_1.KiiMetricCompilers[_m.type || 'default']
                      || KiiQueryCompiler_1.KiiMetricCompilers['default'];
                  metricCompiler(KiiQueryUtils_1.KiiQueryUtils.getAggregations(queryJSON[aggNode.fieldName]), _m);
              });
              let _compiler = KiiQueryCompiler_1.KiiAggregationCompilers[aggNode.aggMethod || 'default']
                  || KiiQueryCompiler_1.KiiAggregationCompilers['default'];
              _compiler(queryJSON, aggNode);
          }
      }
      parse(doc) {
          let _that = this;
          let _parser = KiiQueryDataParser_1.KiiAggDataParsers[this.aggMethod || 'default']
              || KiiQueryDataParser_1.KiiAggDataParsers['default'];
          _parser(doc, this);
          _.each(doc[this.fieldName].buckets, (bucket, index) => {
              _.each(_that.children, (child) => {
                  child.parse(bucket);
              });
              _.each(_that.metrics, (metric) => {
                  bucket[metric.fieldName] = bucket[metric.fieldName] || { value: 0 };
              });
          });
      }
      parseMetrics(parentContext) {
          let _that = this;
          let index = 0;
          _.each(this.keySet, (key) => {
              let _context = new KiiQueryDataParser_1.KiiMetricParserContext({
                  doc: parentContext.doc[this.fieldName][key],
                  index: index,
                  //docs: _.map(parentContext.doc[this.fieldName], (obj) => { return obj; }),
                  parent: parentContext,
                  children: [],
                  level: parentContext.level + 1
              });
              index++;
              _.each(_that.metrics, (metric) => {
                  let metricParser = KiiQueryDataParser_1.KiiMetricParsers[metric.type || 'default']
                      || KiiQueryDataParser_1.KiiMetricParsers['default'];
                  metricParser(metric, _context);
              });
              parentContext.children.push(_context);
              _.each(_that.children, (child) => {
                  child.parseMetrics(_context);
              });
          });
      }
      retrieval(func) {
          let _that = this;
          retrievalNode(this, func);
          function retrievalNode(node, func, after = false) {
              if (!_that.fieldName && !after) {
                  func.apply(_that, [_that]);
              }
              node.children.forEach(child => {
                  retrievalNode(child, func);
              });
              if (!_that.fieldName && after) {
                  func.apply(_that, [_that]);
              }
          }
      }
  }
  exports.AggregationNode = AggregationNode;


/***/ },

/***/ 138:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const KiiQueryUtils_1 = __webpack_require__(59);
  const AggregationNode_1 = __webpack_require__(84);
  const KiiQueryServiceProvider_1 = __webpack_require__(141);
  const KiiQueryDataParser_1 = __webpack_require__(86);
  const constants_1 = __webpack_require__(87);
  const Observable_1 = __webpack_require__(298);
  class KiiQuery {
      constructor(queryStr) {
          this._kiiQueryService = KiiQueryServiceProvider_1.KiiQueryServiceProvider.factoryKiiQueryService();
          this._queryResult = function (_that) {
              return new Observable_1.Observable(observer => {
                  _that._queryObserver = observer;
              });
          }(this);
          if (queryStr)
              this.setQueryStr(queryStr);
      }
      getQueryPath() {
          return this._queryPath;
      }
      getAggTree() {
          return this._aggTree;
      }
      setTimeAgg(timeAgg) {
          this._timeAgg = timeAgg;
      }
      setTimePeriod(timePeriod) {
          this._timePeriod = timePeriod;
      }
      setQueryStr(queryStr) {
          let queryJSON = null;
          try {
              queryJSON = KiiQueryUtils_1.KiiQueryUtils.parseQueryStr(queryStr);
          }
          catch (e) {
              throw e;
          }
          this._originStr = queryStr;
          this._originQueryJSON = queryJSON;
          this._queryJSON = KiiQueryUtils_1.KiiQueryUtils.clone(this._originQueryJSON);
          this._initializeQuery();
      }
      _initializeQuery() {
          let queryJSON = this._queryJSON;
          if (!queryJSON)
              throw new Error('query is not provided!');
          queryJSON.query = queryJSON.query || {};
          queryJSON.query.filtered = queryJSON.query.filtered || {};
          queryJSON.query.filtered.query = queryJSON.query.filtered.query || {};
          queryJSON.query.filtered.filter = queryJSON.query.filtered.filter || {};
          queryJSON.query.filtered.filter.bool = queryJSON.query.filtered.filter.bool || {};
          queryJSON.query.filtered.filter.bool.must = queryJSON.query.filtered.filter.bool.must || [];
          this._aggs = this._queryJSON.aggs;
          this._query = this._queryJSON.query;
          this._aggTree = this._buildAggTree();
          this._summaryAggNode = this._aggTree;
          this._aggTree = this._aggTree.children[0];
          let dateFilter = { range: {} };
          dateFilter.range[KiiQueryUtils_1.DATE_FIELD] = {
              gte: 0,
              lte: 0,
              format: 'epoch_millis'
          };
          this._timeFilter = KiiQueryUtils_1.KiiQueryUtils.findDateFilter(this._query.filtered.filter.bool.must);
          if (!this._timeFilter) {
              this._query.filtered.filter.bool.must.push(dateFilter);
              this._timeFilter = dateFilter.range[KiiQueryUtils_1.DATE_FIELD];
          }
          this._timeFilter.gte = 0;
          this._timeFilter.lte = 0;
          this._timeFilter.format = 'epoch_millis';
          this._queryName = KiiQueryUtils_1.KiiQueryUtils.getQueryName(this._queryJSON);
          this._queryPath = KiiQueryUtils_1.KiiQueryUtils.getQueryPath(this._queryJSON);
      }
      getQueryName() {
          return this._queryName;
      }
      restore() {
          this.setQueryStr(this._originStr);
      }
      build() {
          this._timeFilter.gte = this._timePeriod.fromTime;
          this._timeFilter.lte = this._timePeriod.toTime;
          if (this._timeAgg) {
              this._timeAgg.interval = this._timePeriod.interval + this._timePeriod.unit;
          }
          let _query = KiiQueryUtils_1.KiiQueryUtils.clone(this._queryJSON);
          if (this._aggTree) {
              this._aggTree.compile(KiiQueryUtils_1.KiiQueryUtils.getAggregations(_query));
          }
          KiiQueryUtils_1.KiiQueryUtils.removeKiiFields(_query);
          return _query;
      }
      query() {
          let _that = this;
          let $defer = this._kiiQueryService.query(this.getQueryPath(), JSON.stringify(this.build()));
          $defer.done((response) => {
              let data = response;
              let _data = null;
              let _summary = null;
              if (_that._aggTree) {
                  _that._aggTree.parse(data.aggregations);
                  _that._getFullKeySets(data.aggregations);
                  _data = _that._dataParser(data.aggregations);
                  _that._fillGap(_data);
                  let _context = new KiiQueryDataParser_1.KiiMetricParserContext({
                      doc: _data,
                      index: null,
                      docs: [],
                      parent: {},
                      children: [],
                      level: 0
                  });
                  _that._aggTree.parseMetrics(_context);
              }
              _summary = _that._parseSummary(data.aggregations);
              _that._queryObserver.next({ data: _data, summary: _summary });
          }).fail((error) => {
              Observable_1.Observable.throw(new Error('query failed.'));
          });
      }
      subscribe(func) {
          this._queryResult.subscribe(func);
      }
      _parseSummary(data) {
          let summary = {};
          _.each(this._summaryAggNode.metrics, (metric) => {
              summary[metric.fieldName] = data[metric.fieldName].value;
          });
          return summary;
      }
      _buildAggTree() {
          let aggTree = extractAggFields(this._queryJSON, null, this, []);
          let agg = KiiQueryUtils_1.KiiQueryUtils.getAggregations(this._queryJSON);
          _.each(agg, (value, fieldName) => {
              if (!KiiQueryUtils_1.KiiQueryUtils.isAgg(value)) {
                  let metric = {
                      type: KiiQueryUtils_1.KiiQueryUtils._extractMetricType(agg[fieldName]),
                      fieldName: fieldName,
                      displayName: agg[fieldName][constants_1.constants.KiiFields.AGG_FIELD_DISPLAY_NAME],
                      gapStrategy: 'zero',
                      script: agg[fieldName].script,
                      group: null,
                      chart: null,
                      selected: false
                  };
                  aggTree.metrics.push(metric);
              }
          });
          return aggTree;
          function extractAggFields(obj, name, _query, trace) {
              let aggNode;
              trace = trace || [];
              if (KiiQueryUtils_1.KiiQueryUtils.isAgg(obj)) {
                  aggNode = new AggregationNode_1.AggregationNode;
                  _.extend(aggNode, {
                      fieldName: name,
                      displayName: obj[constants_1.constants.KiiFields.AGG_FIELD_DISPLAY_NAME],
                      children: [],
                      metrics: [],
                      chart: obj[constants_1.constants.KiiFields.AGG_CHART],
                      trace: trace
                  });
                  if (KiiQueryUtils_1.KiiQueryUtils._isTimeAgg(obj)) {
                      if(!_query._timeAgg){
                        _query.setTimeAgg(obj[constants_1.constants.ESAggregationMethods.TIME]);
                      }
                      aggNode.displayName = constants_1.constants.DATE_DISPLAY_NAME;
                      aggNode.type = 'time';
                      aggNode.aggMethod = 'time';
                  }
                  else if (KiiQueryUtils_1.KiiQueryUtils._isEnumAgg(obj)) {
                      aggNode.type = 'category';
                      aggNode.keys = obj[constants_1.constants.ESAggregationMethods.ENUM].keys;
                      aggNode.aggMethod = 'enum';
                  }
                  else if (KiiQueryUtils_1.KiiQueryUtils._isValueAgg(obj)) {
                      aggNode.type = 'value';
                      aggNode.aggMethod = 'default';
                  }
                  else {
                      aggNode.type = 'category';
                      aggNode.aggMethod = 'default';
                  }
                  let aggs = KiiQueryUtils_1.KiiQueryUtils.getAggregations(obj);
                  if (aggs) {
                      for (let fieldName in aggs) {
                          let _trace = aggNode.trace.concat([aggNode.children.length]);
                          let child = extractAggFields(aggs[fieldName], fieldName, _query, _trace);
                          if (child) {
                              aggNode.children.push(child);
                          }
                          else if (KiiQueryUtils_1.KiiQueryUtils.isBucketAggMeasure(aggs[fieldName]) || KiiQueryUtils_1.KiiQueryUtils.isAggMeasure(aggs[fieldName])) {
                              aggNode.metrics.push({
                                  selected: aggs[fieldName][constants_1.constants.KiiFields.METRIC_SELECT] || false,
                                  type: KiiQueryUtils_1.KiiQueryUtils._extractMetricType(aggs[fieldName]),
                                  displayName: aggs[fieldName][constants_1.constants.KiiFields.AGG_FIELD_DISPLAY_NAME],
                                  fieldName: fieldName,
                                  group: aggs[fieldName][constants_1.constants.KiiFields.AGG_GROUP],
                                  chart: aggs[fieldName][constants_1.constants.KiiFields.AGG_CHART],
                                  script: aggs[fieldName].script,
                                  gapStrategy: aggs[constants_1.constants.KiiFields.METRIC_GAP_STRAT] || 'zero'
                              });
                          }
                      }
                  }
              }
              else {
                  let aggs = KiiQueryUtils_1.KiiQueryUtils.getAggregations(obj);
                  if (aggs) {
                      aggNode = new AggregationNode_1.AggregationNode;
                      _.extend(aggNode, {
                          fieldName: name,
                          chart: obj[constants_1.constants.KiiFields.AGG_CHART],
                          displayName: obj[constants_1.constants.KiiFields.AGG_FIELD_DISPLAY_NAME],
                          children: [],
                          metrics: [],
                          trace: []
                      });
                      for (let fieldName in aggs) {
                          let child = extractAggFields(aggs[fieldName], fieldName, _query, [aggNode.trace.length]);
                          if (child) {
                              aggNode.children.push(child);
                          }
                      }
                  }
              }
              return aggNode;
          }
      }
      _getFullKeySets(data) {
          retrieval(this._aggTree, this._aggTree, data[this._aggTree.fieldName]);
          function retrieval(rootNode, currentNode, data) {
              currentNode.keySet = query(rootNode, currentNode, data);
              _.each(currentNode.children, (child) => {
                  retrieval(rootNode, child, data);
              });
          }
          function query(rootNode, targetNode, data) {
              let trace = targetNode.trace.concat([]).splice(rootNode.trace.length);
              if (trace.length) {
                  let keySets = [];
                  _.each(data.buckets, (bucket) => {
                      let _trace = trace.concat([]);
                      let i = _trace.shift();
                      let child = rootNode.children[i];
                      let keys = query(child, targetNode, bucket[child.fieldName]);
                      keySets = _.union(keySets, keys);
                  });
                  return keySets;
              }
              else {
                  return _.pluck(data.buckets, 'key');
              }
          }
      }
      _dataParser(data) {
          function retrieval(aggNode, data) {
              let _data = {};
              _data[aggNode.fieldName] = {};
              _.each(data.buckets, (bucket) => {
                  let _child = {};
                  _child[bucket.key] = {};
                  _.each(aggNode.children, (childNode) => {
                      _.extend(_child[bucket.key], retrieval(childNode, bucket[childNode.fieldName]));
                  });
                  _.each(aggNode.metrics, (agg) => {
                      _child[bucket.key][agg.fieldName] = bucket[agg.fieldName].value;
                  });
                  _.extend(_data[aggNode.fieldName], _child);
              });
              return _data;
          }
          return retrieval(this._aggTree, data[this._aggTree.fieldName]);
      }
      _fillGap(data) {
          let _that = this;
          retrieval(this._aggTree, data[this._aggTree.fieldName]);
          function retrieval(currentNode, data) {
              _.each(currentNode.keySet, (key) => {
                  data[key] = data[key] || {};
                  let _data = data[key];
                  _.each(currentNode.children, (childNode) => {
                      if (!_data[childNode.fieldName]) {
                          _data[childNode.fieldName] = {};
                      }
                      retrieval(childNode, _data[childNode.fieldName]);
                  });
                  _.each(currentNode.metrics, (metric) => {
                      _data[metric.fieldName] = _data[metric.fieldName] || 0;
                  });
              });
          }
      }
  }
  exports.KiiQuery = KiiQuery;


/***/ },

/***/ 85:
/***/ function(module, exports) {

  "use strict";
  class KiiQueryConfig {
      constructor(config) {
          if (config) {
              this._site = config.site;
              this._port = config.port;
              this._token = config.token;
          }
      }
      getSite() {
          return this._site;
      }
      getPort() {
          return this._port;
      }
      getBaseUrl() {
          return this._site + ':' + this._port;
      }
      getToken() {
          return this._token;
      }
      static setConfig(config) {
          this.instance._site = config.site || this.instance._site;
          this.instance._port = config.port || this.instance._port;
          this.instance._token = config.token || this.instance._token;
      }
      static getConfig() {
          return this.instance;
      }
  }
  KiiQueryConfig.instance = new KiiQueryConfig();
  exports.KiiQueryConfig = KiiQueryConfig;


/***/ },

/***/ 139:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const KiiQueryUtils_1 = __webpack_require__(59);
  const scriptMetricCompiler = function (parentJSON, metric) {
      delete parentJSON[metric.fieldName];
  };
  const defaultMetricCompiler = function (parentJSON, metric) {
      KiiQueryUtils_1.KiiQueryUtils.removeKiiFields(parentJSON[metric.fieldName]);
  };
  exports.KiiMetricCompilers = {
      'script': scriptMetricCompiler,
      'default': defaultMetricCompiler
  };
  const enumAggCompiler = function (queryJSON, kiiAgg) {
      let _target = queryJSON[kiiAgg.fieldName];
      let _parent = queryJSON;
      let _keys = _target['enum'].keys;
      let _values = _target['enum'].values;
      let _field = _target['enum'].field;
      delete _parent[kiiAgg.fieldName];
      delete _target['enum'];
      KiiQueryUtils_1.KiiQueryUtils.removeKiiFields(_target);
      _.each(_keys, (key, i) => {
          let _result = KiiQueryUtils_1.KiiQueryUtils.clone(_target);
          let _terms = {};
          _terms[_field] = _values[i];
          _result.filter = {
              'terms': _terms
          };
          _parent[key] = _result;
      });
  };
  const defaultAggCompiler = function (queryJSON, kiiAgg) {
      let _result = queryJSON[kiiAgg.fieldName];
      KiiQueryUtils_1.KiiQueryUtils.removeKiiFields(_result);
      delete queryJSON[kiiAgg.fieldName];
      queryJSON[kiiAgg.fieldName] = _result;
  };
  const timeAggCompiler = function (queryJSON, kiiAgg) {
      exports.KiiAggregationCompilers['default'](queryJSON, kiiAgg);
  };
  exports.KiiAggregationCompilers = {
      'time': timeAggCompiler,
      'enum': enumAggCompiler,
      'default': defaultAggCompiler,
  };


/***/ },

/***/ 86:
/***/ function(module, exports) {

  "use strict";
  class KiiMetricParserContext {
      constructor(_context) {
          _.extend(this, _context);
      }
      offset(level, offset) {
          let dLevel = this.level - level;
          let context = this;
          let trace = [];
          while (dLevel > 0) {
              trace.push(context.index);
              context = this.parent;
              dLevel--;
          }
          context = context.parent.children[context.index + offset];
          if (!context) {
              throw new Error('context out of bound.');
          }
          while (trace.length) {
              context = context.children[trace.pop()];
          }
          return context;
      }
  }
  exports.KiiMetricParserContext = KiiMetricParserContext;
  exports.scriptMetricParser = function (metric, context) {
      context.doc[metric.fieldName] = 0;
      (function (context) {
          let doc = context.doc;
          let index = context.index;
          let docs = context.docs;
          let parent = context.parent;
          let offset = context.offset;
          try {
              context.doc[metric.fieldName] = eval(metric.script);
          }
          catch (e) {
              console.log(e);
          }
      })(context);
      exports.defaultMetricParser(metric, context);
  };
  exports.defaultMetricParser = function (metric, context) {
      context.doc[metric.fieldName] = parseFloat(Number.prototype.toFixed.call(context.doc[metric.fieldName], 3));
  };
  exports.KiiMetricParsers = {
      'script': exports.scriptMetricParser,
      'default': exports.defaultMetricParser
  };
  const enumAggParser = function (resJSON, kiiAgg) {
      let _buckets = [];
      _.each(kiiAgg.keys, (key) => {
          let _bucket = resJSON[key];
          _bucket['key'] = key;
          _buckets.push(_bucket);
          delete resJSON[key];
      });
      resJSON[kiiAgg.fieldName] = {
          buckets: _buckets
      };
  };
  const defaultAggParser = function (resJSON, kiiAgg) {
  };
  exports.KiiAggDataParsers = {
      'enum': enumAggParser,
      'default': defaultAggParser
  };


/***/ },

/***/ 140:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const KiiQueryConfig_1 = __webpack_require__(85);
  class KiiQueryService {
      constructor() {
      }
      query(path, queryString) {
          let headers = {};
          let config = KiiQueryConfig_1.KiiQueryConfig.getConfig();
          if (config.getToken()) {
              headers['Authorization'] = config.getToken();
          }
          let settings = {
              method: 'POST',
              url: config.getBaseUrl() + path,
              data: queryString,
              headers: headers,
              contentType: "application/json",
              dataType: 'json'
          };
          return $.ajax(settings);
      }
  }
  exports.KiiQueryService = KiiQueryService;


/***/ },

/***/ 141:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const KiiQueryService_1 = __webpack_require__(140);
  class KiiQueryServiceProvider {
      constructor() {
      }
      _factoryKiiQueryService() {
          this._kiiQueryService = new KiiQueryService_1.KiiQueryService();
          return this._kiiQueryService;
      }
      static factoryKiiQueryService() {
          return this.kiiQueryServiceProvider._kiiQueryService ?
              this.kiiQueryServiceProvider._kiiQueryService :
              this.kiiQueryServiceProvider._factoryKiiQueryService();
      }
  }
  KiiQueryServiceProvider.kiiQueryServiceProvider = new KiiQueryServiceProvider;
  exports.KiiQueryServiceProvider = KiiQueryServiceProvider;


/***/ },

/***/ 59:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const constants_1 = __webpack_require__(87);
  exports.DATE_FIELD = 'date';
  exports.KiiQueryUtils = {
      removeKiiFields(obj) {
          if (!obj || typeof obj != 'object')
              return;
          for (let kiiFieldName in constants_1.constants.KiiFields) {
              if (exports.KiiQueryUtils._isNotNull(obj[constants_1.constants.KiiFields[kiiFieldName]])) {
                  delete obj[constants_1.constants.KiiFields[kiiFieldName]];
              }
          }
      },
      getQueryName(obj) {
          return obj[constants_1.constants.KiiFields.AGG_NAME];
      },
      getQueryPath(obj) {
          return obj[constants_1.constants.KiiFields.QUERY_PATH];
      },
      parseQueryStr(queryStr) {
          let queryJSON;
          try {
              queryJSON = JSON.parse(queryStr);
          }
          catch (e) {
              throw new Error('failed convert query string to JSON');
          }
          return queryJSON;
      },
      findDateFilter(must) {
          for (let condition of must) {
              if (condition.range && condition.range[exports.DATE_FIELD]) {
                  return condition.range[exports.DATE_FIELD];
              }
          }
      },
      getAggregations(obj) {
          return obj.aggs || obj.aggregations;
      },
      _isEnumAgg(obj) {
          if (!obj)
              return false;
          let _enumMethod = constants_1.constants.ESAggregationMethods.ENUM;
          return !!obj[_enumMethod];
      },
      _isTimeAgg(obj) {
          if (!obj)
              return false;
          let _timeMethod = constants_1.constants.ESAggregationMethods.TIME;
          return !!obj[_timeMethod];
      },
      _isValueAgg(obj) {
          if (!obj)
              return false;
          let _valueMethods = constants_1.constants.ESAggregationMethods.VALUE;
          for (let i in _valueMethods) {
              if (!!obj[_valueMethods[i]]) {
                  return true;
              }
          }
          return false;
      },
      _isCategoryAgg(obj) {
          if (!obj)
              return false;
          let _categoryMethods = constants_1.constants.ESAggregationMethods.CATEGORY;
          for (let i in _categoryMethods) {
              if (!!obj[_categoryMethods[i]]) {
                  return true;
              }
          }
          return false;
      },
      isAgg(obj) {
          let flag = false;
          for (let k of constants_1.constants.AggMethods) {
              flag = flag || obj[k];
          }
          return flag;
      },
      isAggMeasure(obj) {
          let flag = false;
          for (let k of constants_1.constants.AggMeasures) {
              flag = flag || obj[k];
          }
          return flag;
      },
      isBucketAggMeasure(obj) {
          let flag = false;
          for (let k of constants_1.constants.BucketAggMeasures) {
              flag = flag || obj[k];
          }
          return flag;
      },
      _extractMetricType(obj) {
          for (let k of constants_1.constants.AggMeasures) {
              if (obj[k])
                  return k;
          }
          for (let k of constants_1.constants.BucketAggMeasures) {
              if (obj[k])
                  return k;
          }
          return null;
      },
      _isNotNull(val) {
          if (val || val === 0 || val === false || val === null) {
              return true;
          }
          return false;
      },
      clone(obj) {
          return JSON.parse(JSON.stringify(obj));
      }
  };


/***/ },

/***/ 87:
/***/ function(module, exports) {

  "use strict";
  exports.constants = {
      DATE_DISPLAY_NAME: '时间',
      KiiFields: {
          AGG_FIELD_DISPLAY_NAME: '_kii_agg_field_name',
          QUERY_PATH: '_kii_query_path',
          AGG_NAME: '_kii_agg_name',
          AGG_GROUP: '_kii_agg_group',
          AGG_CHART: '_kii_agg_chart',
          METRIC_GAP_STRAT: '_kii_gap_strat',
          METRIC_SELECT: '_kii_selected'
      },
      ESAggregationMethods: {
          TIME: 'date_histogram',
          ENUM: 'enum',
          CATEGORY: ['terms', 'term'],
          VALUE: ['range']
      },
      AggMethods: [
          'histogram', 'date_histogram',
          'date_range', 'range',
          'terms', 'enum'
      ],
      AggMeasures: [
          'avg', 'sum', 'min', 'max', 'value_count',
          'script'
      ],
      BucketAggMeasures: [
          'avg_bucket', 'sum_bucket', 'count_bucket', 'min_bucket', 'max_bucket'
      ]
  };


/***/ },

/***/ 88:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(138));
  __export(__webpack_require__(84));
  __export(__webpack_require__(85));


/***/ },

/***/ 142:
/***/ function(module, exports) {

  "use strict";
  class KiiTimePeriod {
      constructor(argument) {
      }
      setUnit(unit) {
          this.unit = unit;
      }
      setInterval(interval) {
          this.interval = interval;
      }
      setFromTime(fromTime) {
          if (!fromTime) {
              throw new Error('from time cannot be null.');
          }
          if (!(fromTime instanceof Date)) {
              throw new Error('from time is not instance of date.');
          }
          this.fromTime = fromTime.getTime();
      }
      setToTime(toTime) {
          if (!toTime) {
              this.toTime = null;
              return;
          }
          this.toTime = toTime.getTime();
      }
  }
  exports.KiiTimePeriod = KiiTimePeriod;


/***/ },

/***/ 143:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(142));


/***/ },

/***/ 144:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  function __export(m) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export(__webpack_require__(137));
  __export(__webpack_require__(88));
  __export(__webpack_require__(143));


/***/ },

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  const KiiReporting_1 = __webpack_require__(144);
  (function (window) {
      const KiiReporting = {
          KiiChart: KiiReporting_1.KiiChart,
          KiiQuery: KiiReporting_1.KiiQuery,
          KiiTimePeriod: KiiReporting_1.KiiTimePeriod,
          KiiQueryConfig: KiiReporting_1.KiiQueryConfig
      };
      window.KiiReporting = KiiReporting;
  })(window);


/***/ }

});
//# sourceMappingURL=KiiReporting.bundle.map