var Cache=function(t){"use strict"
;function e(t,e,n,r){
return new(n||(n=Promise))((function(s,i){
function o(t){try{c(r.next(t))}catch(t){i(t)}}
function l(t){try{c(r.throw(t))}catch(t){i(t)}}
function c(t){var e
;t.done?s(t.value):(e=t.value,e instanceof n?e:new n((function(t){
t(e)}))).then(o,l)}c((r=r.apply(t,e||[])).next())
}))}function n(t,e){var n,r,s,i,o={label:0,
sent:function(){if(1&s[0])throw s[1];return s[1]},
trys:[],ops:[]};return i={next:l(0),throw:l(1),
return:l(2)
},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){
return this}),i;function l(l){return function(c){
return function(l){
if(n)throw new TypeError("Generator is already executing.")
;for(;i&&(i=0,l[0]&&(o=0)),o;)try{
if(n=1,r&&(s=2&l[0]?r.return:l[0]?r.throw||((s=r.return)&&s.call(r),
0):r.next)&&!(s=s.call(r,l[1])).done)return s
;switch(r=0,s&&(l=[2&l[0],s.value]),l[0]){case 0:
case 1:s=l;break;case 4:return o.label++,{
value:l[1],done:!1};case 5:o.label++,r=l[1],l=[0]
;continue;case 7:l=o.ops.pop(),o.trys.pop()
;continue;default:
if(!(s=o.trys,(s=s.length>0&&s[s.length-1])||6!==l[0]&&2!==l[0])){
o=0;continue}
if(3===l[0]&&(!s||l[1]>s[0]&&l[1]<s[3])){
o.label=l[1];break}if(6===l[0]&&o.label<s[1]){
o.label=s[1],s=l;break}if(s&&o.label<s[2]){
o.label=s[2],o.ops.push(l);break}
s[2]&&o.ops.pop(),o.trys.pop();continue}
l=e.call(t,o)}catch(t){l=[6,t],r=0}finally{n=s=0}
if(5&l[0])throw l[1];return{
value:l[0]?l[1]:void 0,done:!0}}([l,c])}}}
const r=setTimeout,s=clearTimeout,i={
now:function(){return Date.now()},
setTimeout:"undefined"==typeof window?setTimeout:function(){
return r.apply(window,arguments)},
clearTimeout:"undefined"==typeof window?clearTimeout:function(){
return s.apply(window,arguments)}}
;function o(t,e){t(function(t){return{then(e,n){
n(t)}}}(e))}function l(t,e,n){
return new Promise((function(r){
if(e&&e.aborted)return void o(r,e.reason);let s
;const l=n||i,c=l.setTimeout((function(){
s&&s(),r()}),t);e&&(s=e.subscribe((function(t){
l.clearTimeout(c),o(r,t)})))}))}function c(t){
return null!=t&&"object"==typeof t&&"function"==typeof t.then
}function u(t,e,n){try{const r=e?e(t):t
;n._resolve(r)}catch(t){n._reject(t)}}
function a(t,e,n){e||n._reject(t);try{const r=e(t)
;n._resolve(r)}catch(t){n._reject(t)}}
const h=function(){};class f{constructor(t){
this.status="pending",this.value=void 0,
this.reason=void 0,this._handlers=null
;const e=this._resolve,n=this._reject,r=this._resolveAsync,s=this._rejectAsync,i=this
;this._resolve=function(t){e.call(i,t)
},this._reject=function(t){n.call(i,t)
},this._resolveAsync=function(t){r.call(i,t)
},this._rejectAsync=function(t){s.call(i,t)
},t(this._resolve,this._reject)}_resolve(t){
"pending"===this.status&&(this.status="fulfilled",
this._resolveAsync(t))}_resolveAsync(t){
c(t)?t.then(this._resolveAsync,this._rejectAsync):this._resolveSync(t)
}_resolveSync(t){const e=this._handlers
;if(this.value=t,null!=e){this._handlers=null
;for(let n=0,r=e.length;n<r;n++){const[r,,s]=e[n]
;u(t,r,s)}}}_reject(t){
"pending"===this.status&&this._rejectAsync(t)}
_rejectAsync(t){
this.status="rejected",c(t)?t.then(this._rejectAsync,this._rejectAsync):this._rejectSync(t)
}_rejectSync(t){const e=this._handlers
;if(this.reason=t,null!=e){this._handlers=null
;for(let n=0,r=e.length;n<r;n++){const[,r,s]=e[n]
;a(t,r,s)}}}then(t,e){const n=new f(h)
;return"pending"===this.status?(null==this._handlers&&(this._handlers=[]),
this._handlers.push([t,e,n])):"fulfilled"===this.status?u(this.value,t,n):a(this.reason,e,n),
n}catch(t){return this.then(void 0,t)}finally(t){
const e=t&&function(e){return t(),e
},n=t&&function(e){throw t(),e}
;return this.then(e,n)}static resolve(t){
const e=new f(h);return e._resolve(t),e}
static reject(t){const e=new f(h)
;return e._reject(t),e}get[Symbol.toStringTag](){
return"Promise"}}const d=function(){};class _{
constructor(t){
if(this._status="pending",t&&t.aborted)this.promise=f.reject(t.reason),
this.resolve=d,this.reject=d;else{let e,n
;if(this.promise=new Promise((function(t){
e=t,n=function(e){o(t,e)}})),t){
const r=t.subscribe((function(t){n(t)}))
;this.resolve=function(t){r(),e(t)
},this.reject=function(t){r(),n(t)}
}else this.resolve=e,this.reject=n}
this.promise.then((()=>{this._status="resolved"
}),(()=>{this._status="rejected"}))}get state(){
return this._status}}class v{constructor(t={}){
this.value=t.value,this.loading=t.loading||!1,
this.hasValue=t.hasValue||!1,this.error=t.error,
this.hasError=t.hasError||!1}}class b{
constructor(t,e){
this._branch=null,this.order=t,this.parent=e}
get branch(){if(!this._branch){
const t=[this.order];let e=this.parent
;for(;null!=e;)t.push(e.order),e=e.parent
;this._branch=t}return this._branch}}
function p(t,e){return t<e}class y{
constructor({objectPool:t,lessThanFunc:e}={}){
this._size=0,this._root=null,this.merge=w,
this.collapse=g,this._objectPool=t,this._lessThanFunc=e||p
}clear(){this._root=null,this._size=0}get size(){
return this._size}add(t){
let e=null!=this._objectPool?this._objectPool.get():null
;return null==e?e={child:null,next:null,prev:null,
item:t
}:e.item=t,this._size++,this._root=w(this._root,e,this._lessThanFunc),e
}getMin(){const{_root:t}=this
;return null==t?void 0:t.item}getMinNode(){
return this._root}deleteMin(){const{_root:t}=this
;if(null==t)return;const e=t.item
;return this.delete(t),e}delete(t){var e
;if(t===this._root)this._root=g(t.child,this._lessThanFunc);else{
if(null==t.prev){
if(this._objectPool)throw new Error("The node is already deleted. Don't use the objectPool to prevent this error.")
;return}
t.prev.child===t?t.prev.child=t.next:t.prev.next=t.next,null!=t.next&&(t.next.prev=t.prev),
this._root=w(this._root,g(t.child,this._lessThanFunc),this._lessThanFunc)
}
t.child=null,t.prev=null,t.next=null,t.item=void 0,null===(e=this._objectPool)||void 0===e||e.release(t),
this._size--}decreaseKey(t){
t!==this._root&&(t.prev.child===t?t.prev.child=t.next:t.prev.next=t.next,
null!=t.next&&(t.next.prev=t.prev),
this._root=w(this._root,t,this._lessThanFunc))}
get isEmpty(){return null==this._root}
[Symbol.iterator](){return this._iterate(!1)}
nodes(){return{
[Symbol.iterator]:()=>this._iterate(!0)}}
_iterate(t){const e=this._lessThanFunc
;return function*n(r){
r&&(t?yield r:yield r.item,r.child&&(null!=r.child.next&&(r.child=g(r.child,e),
r.child.prev=r),yield*n(r.child)))}(this._root)}}
function w(t,e,n){let r,s
;return null==t?e:null==e||t===e?t:(n(e.item,t.item)?(r=e,
s=t):(r=t,s=e),s.next=r.child,
null!=r.child&&(r.child.prev=s),s.prev=r,r.child=s,
r.next=null,r.prev=null,r)}function g(t,e){
let n,r,s,i,o;if(null==t)return null
;for(i=t,n=null;null!=i;){
if(r=i,s=r.next,null==s){r.prev=n,n=r;break}
i=s.next,o=w(r,s,e),o.prev=n,n=o}
for(o=null;null!=n;)i=n.prev,o=w(o,n,e),n=i
;return o}function j(t){
return null!=t&&"object"==typeof t&&"function"==typeof t.then
}function m(t,e,n){try{const r=e?e(t):t
;n._resolve(r)}catch(t){n._reject(t)}}
function A(t,e,n){e||n._reject(t);try{const r=e(t)
;n._resolve(r)}catch(t){n._reject(t)}}
const S=function(){};class P{constructor(t){
this.status="pending",this.value=void 0,
this.reason=void 0,this._handlers=null
;const e=this._resolve,n=this._reject,r=this._resolveAsync,s=this._rejectAsync,i=this
;this._resolve=function(t){e.call(i,t)
},this._reject=function(t){n.call(i,t)
},this._resolveAsync=function(t){r.call(i,t)
},this._rejectAsync=function(t){s.call(i,t)
},t(this._resolve,this._reject)}_resolve(t){
"pending"===this.status&&(this.status="fulfilled",
this._resolveAsync(t))}_resolveAsync(t){
j(t)?t.then(this._resolveAsync,this._rejectAsync):this._resolveSync(t)
}_resolveSync(t){const e=this._handlers
;if(this.value=t,null!=e){this._handlers=null
;for(let n=0,r=e.length;n<r;n++){const[r,,s]=e[n]
;m(t,r,s)}}}_reject(t){
"pending"===this.status&&this._rejectAsync(t)}
_rejectAsync(t){
this.status="rejected",j(t)?t.then(this._rejectAsync,this._rejectAsync):this._rejectSync(t)
}_rejectSync(t){const e=this._handlers
;if(this.reason=t,null!=e){this._handlers=null
;for(let n=0,r=e.length;n<r;n++){const[,r,s]=e[n]
;A(t,r,s)}}}then(t,e){const n=new P(S)
;return"pending"===this.status?(null==this._handlers&&(this._handlers=[]),
this._handlers.push([t,e,n])):"fulfilled"===this.status?m(this.value,t,n):A(this.reason,e,n),
n}catch(t){return this.then(void 0,t)}finally(t){
const e=t&&function(e){return t(),e
},n=t&&function(e){throw t(),e}
;return this.then(e,n)}static resolve(t){
const e=new P(S);return e._resolve(t),e}
static reject(t){const e=new P(S)
;return e._reject(t),e}get[Symbol.toStringTag](){
return"Promise"}}const x=function(){};class k{
constructor(t){
if(t&&t.aborted)this.promise=P.reject(t.reason),this.resolve=x,this.reject=x;else{
let e,n;if(this.promise=new Promise((function(t){
e=t,n=function(e){!function(t,e){t(function(t){
return{then(e,n){n(t)}}}(e))}(t,e)}})),t){
const r=t.subscribe((function(t){n(t)}))
;this.resolve=function(t){r(),e(t)
},this.reject=function(t){r(),n(t)}
}else this.resolve=e,this.reject=n}}}
var z={},T={},E={}
;Object.defineProperty(E,"__esModule",{value:!0})
;class F extends Error{constructor(t,e){
super(t),Object.setPrototypeOf(this,F.prototype),
this.reason=e,this.name="AbortError",
this._internal=!1}}
E.AbortError=F,Object.defineProperty(T,"__esModule",{
value:!0});var C=E
;T.toAbortController=function(t,e){
return t.signal.subscribe((t=>{
t instanceof C.AbortError&&t._internal&&(t=t.reason),
e.abort(t)})),e
},T.toAbortControllerFast=function(t,e){
return t.signal.addEventListener("abort",(function(){
e.abort(this.reason)})),e
},T.toAbortSignal=function(t,e){
return t.subscribe((t=>{e.abort(t)})),e.signal
},T.toAbortSignalFast=function(t,e){
return t.addEventListener("abort",(function(t){
e.abort(t)})),e.signal};var M={},O={}
;Object.defineProperty(O,"__esModule",{value:!0})
;const R=()=>{};O.AbortSignalFast=class{
constructor(){
this.aborted=!1,this.reason=void 0,this._callbacks=void 0
}subscribe(t){var e
;if(null===(e=this._callbacks)||void 0===e?void 0:e.has(t))throw new Error("Already subscribed: "+t)
;return this.aborted?(t.call(this,this.reason),
R):(this._callbacks||(this._callbacks=new Set),
this._callbacks.add(t),()=>{var e
;null===(e=this._callbacks)||void 0===e||e.delete(t)
})}abort(t){var e
;this.aborted=!0,this.reason=t,null===(e=this._callbacks)||void 0===e||e.forEach((t=>{
t.call(this,this.reason)})),this._callbacks=void 0
}throwIfAborted(){
if(this.aborted)throw this.reason}
},Object.defineProperty(M,"__esModule",{value:!0})
;var q=O,V=E;M.AbortControllerFast=class{
constructor(){this.signal=new q.AbortSignalFast}
abort(t){
this.signal.aborted||(void 0===t&&((t=new V.AbortError("Aborted with no reason",t))._internal=!0),
this.signal.abort(t))}
},Object.defineProperty(z,"__esModule",{value:!0})
;var K=T,D=M,I=E;function J(t,e){
return function(t,e){
const n=t&&t.branch,r=e&&e.branch,s=n?n.length:0,i=r?r.length:0,o=s>i?s:i
;for(let t=0;t<o;t++){
const e=t>=s?0:n[s-1-t],o=t>=i?0:r[i-1-t]
;if(e!==o)return e>o?1:-1}return 0
}(t.priority,e.priority)<0}
z.toAbortController=K.toAbortController,z.toAbortControllerFast=K.toAbortControllerFast,
z.toAbortSignal=K.toAbortSignal,
z.toAbortSignalFast=K.toAbortSignalFast,z.AbortControllerFast=D.AbortControllerFast,
z.AbortError=I.AbortError;let L=1;class N{
constructor(){this._queue=new y({lessThanFunc:J})}
run(t,e,n){return this._run(!1,t,e,n)}
runTask(t,e,n){return this._run(!0,t,e,n)}
_run(t,e,n,r){const s=new k(r),i={
priority:(o=L++,l=n,null==o?null==l?null:l:new b(o,l)),
func:e,abortSignal:r,resolve:s.resolve,
reject:s.reject,readyToRun:!t};var o,l
;if(this._queue.add(i),t){const t=this;return{
result:s.promise,setReadyToRun(e){
i.readyToRun=e,e&&!t._inProcess&&(t._inProcess=!0,
t._process())}}}
return this._inProcess||(this._inProcess=!0,this._process()),s.promise
}_process(){
return e(this,void 0,void 0,(function*(){
const t=this._queue;for(;;){if(yield 0,t.isEmpty){
this._inProcess=!1;break}let e=t.getMin()
;if(e.readyToRun)t.deleteMin();else{let n
;for(const e of t.nodes())if(e.item.readyToRun){
n=e;break}if(!n){this._inProcess=!1;break}
e=n.item,t.delete(n)}
if(e.abortSignal&&e.abortSignal.aborted)e.reject(e.abortSignal.reason);else try{
let t=e.func&&e.func(e.abortSignal)
;t&&"function"==typeof t.then&&(t=yield t),e.resolve(t)
}catch(t){e.reject(t)}}}))}}const Q=function(){
const t=new N;return function(e,n){
return t.run(void 0,e,n)}}();class W{
constructor(t){
if(this._maxSize=0,this._size=0,this._tickPromise=new _,!t)throw new Error("maxSize should be > 0")
;this._maxSize=t,
this._size=t,this._priorityQueue=new N}
get maxSize(){return this._maxSize}get size(){
return this._size}get holdAvailable(){
return this._size}hold(t){const e=this._size
;return!(t>e)&&(this._size=e-t,!0)}
get releaseAvailable(){
return this.maxSize-this._size}release(t){
const e=this._size,n=this.maxSize-e
;if(t>n&&(t=n),t>0&&(this._size=e+t,this._tickPromise)){
const t=this._tickPromise
;this._tickPromise=null,t.resolve()}return t}
tick(t){
if(!(this._size>0))return this._tickPromise||(this._tickPromise=new _),function(t,e){
return new Promise((function(n){
if(t&&t.aborted)return void o(n,t.reason);let r,s
;function i(t){s||(s=!0,r&&r(),o(n,t))}
e.then((function(t){r&&r(),n(t)
})).catch(i),t&&(r=t.subscribe(i))}))
}(t,this._tickPromise.promise)}holdWait(t,n,r,s){
return e(this,void 0,void 0,(function*(){
if(t>this.maxSize)throw new Error(`holdCount (${t} > maxSize (${this.maxSize}))`)
;s||(s=Q),
yield this._priorityQueue.run((r=>e(this,void 0,void 0,(function*(){
for(;t>this._size;)yield this.tick(r),yield s(n,r)
;if(!this.hold(t))throw new Error("Unexpected behavior")
}))),n,r)}))}}
function $({pool:t,count:n,func:r,priority:s,abortSignal:i,awaitPriority:o}){
return e(this,void 0,void 0,(function*(){
return function(t,e){return e?function(){try{
const n=t.apply(this,arguments)
;return c(n)?function(t,e){
return e?t.then((t=>(e(),t)),(t=>{throw e(),t})):t
}(n,e):(e(),n)}catch(t){throw e(),t}}:t
}((function(){
return e(this,void 0,void 0,(function*(){
yield t.holdWait(n,s,i,o);const e=new W(n)
;return r(e,i)}))}),(()=>{t.release(n)}))()}))}
return t.createMemCacheStrategy=function(t){
var r=t.lifeTime,s=t.updateInterval,o=t.timeController
;o||(o=i);var u=new Map;return function(t,i,a){
return e(this,void 0,void 0,(function(){var a,h,f
;return n(this,(function(d){switch(d.label){
case 0:return(a=u.get(i))||(a={value:t(),options:{
dateCreated:o.now(),dateRequest:o.now()}
},u.set(i,a),function(){
e(this,void 0,void 0,(function(){var e,h
;return n(this,(function(n){switch(n.label){
case 0:return c(a.value)?[4,a.value]:[3,2];case 1:
return h=n.sent(),[3,3];case 2:h=a.value,n.label=3
;case 3:
e=h,a.options.dateRequest=o.now(),n.label=4
;case 4:
return e.hasValue?s?[4,l(s,null,o)]:[3,7]:(u.delete(i),[3,10])
;case 5:
return n.sent(),o.now()-a.options.dateRequest>r?(u.delete(i),[3,10]):[4,t(e)]
;case 6:return n.sent(),[3,9];case 7:
return[4,l(r,null,o)];case 8:
return n.sent(),u.delete(i),[3,10];case 9:
return[3,4];case 10:return[2]}}))}))
}()),c(a.value)?[4,a.value]:[3,2];case 1:
return f=d.sent(),[3,3];case 2:f=a.value,d.label=3
;case 3:
if(h=f,a.options.dateRequest=o.now(),!h.hasValue)throw h.error||new Error("state.error = ".concat(h.error))
;return[2,h.value]}}))}))}
},t.getJsonKeyFunc=function(t){return function(t){
return t=function(t,e){
var n=void 0===e?{}:e,r=n.sortKeys,s=void 0===r||r
;if(n.deep,!t||"object"!=typeof t)return t
;var i=Object.keys(t)
;return s&&i.sort(),i.reduce((function(e,n){
var r=t[n];return null!=r&&""!==r&&(e[n]=r),e
}),{})}(t),JSON.stringify(null!=t?t:null)}
},t.toCached=function(t,r){
var s=r.getKey,i=r.strategy,o=new Map
;return function(){
for(var r=[],l=0;l<arguments.length;l++)r[l]=arguments[l]
;return e(this,void 0,void 0,(function(){
var l,u,a,h,f=this;return n(this,(function(d){
switch(d.label){case 0:
return c(l=s.apply(this,r))?[4,l]:[3,2];case 1:
l=d.sent(),d.label=2;case 2:
(u=o.get(l))?u.count++:(a=function(t){return $({
pool:new W(1),count:1,func:t})},u={lock:a,count:1
},o.set(l,u)),h=function(s){
return e(f,void 0,void 0,(function(){var e,i
;return n(this,(function(n){switch(n.label){
case 0:s||(s=function(t={}){return new v(t)
}()),n.label=1;case 1:
return n.trys.push([1,4,5,6]),s.loading=!0,c(e=t.apply(this,r))?[4,e]:[3,3]
;case 2:e=n.sent(),n.label=3;case 3:
return s.value=e,s.hasValue=!0,s.hasError=!1,[3,6]
;case 4:
return i=n.sent(),s.error=i,s.hasError=!0,[3,6]
;case 5:return s.loading=!1,[7];case 6:return[2,s]
}}))}))},d.label=3;case 3:
return d.trys.push([3,,5,6]),[4,i(h,l,u.lock,this,r)]
;case 4:return[2,d.sent()];case 5:
return u.count--,0===u.count&&o.delete(l),[7]
;case 6:return[2]}}))}))}
},Object.defineProperty(t,"__esModule",{value:!0
}),t}({});
