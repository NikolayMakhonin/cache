var Cache=function(t,e){"use strict"
;function n(t){
return t&&"object"==typeof t&&"default"in t?t:{
default:t}}var r=n(e);function s(t,e,n,r){
return new(n||(n=Promise))((function(s,i){
function o(t){try{c(r.next(t))}catch(t){i(t)}}
function l(t){try{c(r.throw(t))}catch(t){i(t)}}
function c(t){var e
;t.done?s(t.value):(e=t.value,e instanceof n?e:new n((function(t){
t(e)}))).then(o,l)}c((r=r.apply(t,e||[])).next())
}))}function i(t,e){var n,r,s,i,o={label:0,
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
const o=setTimeout,l=clearTimeout,c={
now:function(){return Date.now()},
setTimeout:"undefined"==typeof window?setTimeout:function(){
return o.apply(window,arguments)},
clearTimeout:"undefined"==typeof window?clearTimeout:function(){
return l.apply(window,arguments)}}
;function u(t,e){t(function(t){return{then(e,n){
n(t)}}}(e))}function a(t){
return null!=t&&"object"==typeof t&&"function"==typeof t.then
}function h(t,e,n){try{const r=e?e(t):t
;n._resolve(r)}catch(t){n._reject(t)}}
function f(t,e,n){e||n._reject(t);try{const r=e(t)
;n._resolve(r)}catch(t){n._reject(t)}}
const d=function(){};class _{constructor(t){
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
a(t)?t.then(this._resolveAsync,this._rejectAsync):this._resolveSync(t)
}_resolveSync(t){const e=this._handlers
;if(this.value=t,null!=e){this._handlers=null
;for(let n=0,r=e.length;n<r;n++){const[r,,s]=e[n]
;h(t,r,s)}}}_reject(t){
"pending"===this.status&&this._rejectAsync(t)}
_rejectAsync(t){
this.status="rejected",a(t)?t.then(this._rejectAsync,this._rejectAsync):this._rejectSync(t)
}_rejectSync(t){const e=this._handlers
;if(this.reason=t,null!=e){this._handlers=null
;for(let n=0,r=e.length;n<r;n++){const[,r,s]=e[n]
;f(t,r,s)}}}then(t,e){const n=new _(d)
;return"pending"===this.status?(null==this._handlers&&(this._handlers=[]),
this._handlers.push([t,e,n])):"fulfilled"===this.status?h(this.value,t,n):f(this.reason,e,n),
n}catch(t){return this.then(void 0,t)}finally(t){
const e=t&&function(e){return t(),e
},n=t&&function(e){throw t(),e}
;return this.then(e,n)}static resolve(t){
const e=new _(d);return e._resolve(t),e}
static reject(t){const e=new _(d)
;return e._reject(t),e}get[Symbol.toStringTag](){
return"Promise"}}const v=function(){};class b{
constructor(t){
if(this._status="pending",t&&t.aborted)this.promise=_.reject(t.reason),
this.resolve=v,this.reject=v;else{let e,n
;if(this.promise=new Promise((function(t){
e=t,n=function(e){u(t,e)}})),t){
const r=t.subscribe((function(t){n(t)}))
;this.resolve=function(t){r(),e(t)
},this.reject=function(t){r(),n(t)}
}else this.resolve=e,this.reject=n}
this.promise.then((()=>{this._status="resolved"
}),(()=>{this._status="rejected"}))}get state(){
return this._status}}var y={},p={},w={}
;Object.defineProperty(w,"__esModule",{value:!0})
;class g extends Error{constructor(t,e){
super(t),Object.setPrototypeOf(this,g.prototype),
this.reason=e,this.name="AbortError",
this._internal=!1}}
w.AbortError=g,Object.defineProperty(p,"__esModule",{
value:!0});var j=w
;p.toAbortController=function(t,e){
return t.signal.subscribe((t=>{
t instanceof j.AbortError&&t._internal&&(t=t.reason),
e.abort(t)})),e
},p.toAbortControllerFast=function(t,e){
return t.signal.addEventListener("abort",(function(){
e.abort(this.reason)})),e
},p.toAbortSignal=function(t,e){
return t.subscribe((t=>{e.abort(t)})),e.signal
},p.toAbortSignalFast=function(t,e){
return t.addEventListener("abort",(function(t){
e.abort(t)})),e.signal};var m={},A={}
;Object.defineProperty(A,"__esModule",{value:!0})
;const S=()=>{};A.AbortSignalFast=class{
constructor(){
this.aborted=!1,this.reason=void 0,this._callbacks=void 0
}subscribe(t){var e
;if(null===(e=this._callbacks)||void 0===e?void 0:e.has(t))throw new Error("Already subscribed: "+t)
;return this.aborted?(t.call(this,this.reason),
S):(this._callbacks||(this._callbacks=new Set),
this._callbacks.add(t),()=>{var e
;null===(e=this._callbacks)||void 0===e||e.delete(t)
})}abort(t){var e
;this.aborted=!0,this.reason=t,null===(e=this._callbacks)||void 0===e||e.forEach((t=>{
t.call(this,this.reason)})),this._callbacks=void 0
}throwIfAborted(){
if(this.aborted)throw this.reason}
},Object.defineProperty(m,"__esModule",{value:!0})
;var P=A,x=w;m.AbortControllerFast=class{
constructor(){this.signal=new P.AbortSignalFast}
abort(t){
this.signal.aborted||(void 0===t&&((t=new x.AbortError("Aborted with no reason",t))._internal=!0),
this.signal.abort(t))}
},Object.defineProperty(y,"__esModule",{value:!0})
;var k=p,z=m,T=w
;y.toAbortController=k.toAbortController,y.toAbortControllerFast=k.toAbortControllerFast,
y.toAbortSignal=k.toAbortSignal,
y.toAbortSignalFast=k.toAbortSignalFast,y.AbortControllerFast=z.AbortControllerFast,
y.AbortError=T.AbortError;class E{
constructor(t,e){
this._branch=null,this.order=t,this.parent=e}
get branch(){if(!this._branch){
const t=[this.order];let e=this.parent
;for(;null!=e;)t.push(e.order),e=e.parent
;this._branch=t}return this._branch}}
function F(t,e){return t<e}class C{
constructor({objectPool:t,lessThanFunc:e}={}){
this._size=0,this._root=null,this.merge=M,
this.collapse=O,this._objectPool=t,this._lessThanFunc=e||F
}clear(){this._root=null,this._size=0}get size(){
return this._size}add(t){
let e=null!=this._objectPool?this._objectPool.get():null
;return null==e?e={child:null,next:null,prev:null,
item:t
}:e.item=t,this._size++,this._root=M(this._root,e,this._lessThanFunc),e
}getMin(){const{_root:t}=this
;return null==t?void 0:t.item}getMinNode(){
return this._root}deleteMin(){const{_root:t}=this
;if(null==t)return;const e=t.item
;return this.delete(t),e}delete(t){var e
;if(t===this._root)this._root=O(t.child,this._lessThanFunc);else{
if(null==t.prev){
if(this._objectPool)throw new Error("The node is already deleted. Don't use the objectPool to prevent this error.")
;return}
t.prev.child===t?t.prev.child=t.next:t.prev.next=t.next,null!=t.next&&(t.next.prev=t.prev),
this._root=M(this._root,O(t.child,this._lessThanFunc),this._lessThanFunc)
}
t.child=null,t.prev=null,t.next=null,t.item=void 0,null===(e=this._objectPool)||void 0===e||e.release(t),
this._size--}decreaseKey(t){
t!==this._root&&(t.prev.child===t?t.prev.child=t.next:t.prev.next=t.next,
null!=t.next&&(t.next.prev=t.prev),
this._root=M(this._root,t,this._lessThanFunc))}
get isEmpty(){return null==this._root}
[Symbol.iterator](){return this._iterate(!1)}
nodes(){return{
[Symbol.iterator]:()=>this._iterate(!0)}}
_iterate(t){const e=this._lessThanFunc
;return function*n(r){
r&&(t?yield r:yield r.item,r.child&&(null!=r.child.next&&(r.child=O(r.child,e),
r.child.prev=r),yield*n(r.child)))}(this._root)}}
function M(t,e,n){let r,s
;return null==t?e:null==e||t===e?t:(n(e.item,t.item)?(r=e,
s=t):(r=t,s=e),s.next=r.child,
null!=r.child&&(r.child.prev=s),s.prev=r,r.child=s,
r.next=null,r.prev=null,r)}function O(t,e){
let n,r,s,i,o;if(null==t)return null
;for(i=t,n=null;null!=i;){
if(r=i,s=r.next,null==s){r.prev=n,n=r;break}
i=s.next,o=M(r,s,e),o.prev=n,n=o}
for(o=null;null!=n;)i=n.prev,o=M(o,n,e),n=i
;return o}function R(t){
return null!=t&&"object"==typeof t&&"function"==typeof t.then
}function q(t,e,n){try{const r=e?e(t):t
;n._resolve(r)}catch(t){n._reject(t)}}
function K(t,e,n){e||n._reject(t);try{const r=e(t)
;n._resolve(r)}catch(t){n._reject(t)}}
const V=function(){};class D{constructor(t){
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
R(t)?t.then(this._resolveAsync,this._rejectAsync):this._resolveSync(t)
}_resolveSync(t){const e=this._handlers
;if(this.value=t,null!=e){this._handlers=null
;for(let n=0,r=e.length;n<r;n++){const[r,,s]=e[n]
;q(t,r,s)}}}_reject(t){
"pending"===this.status&&this._rejectAsync(t)}
_rejectAsync(t){
this.status="rejected",R(t)?t.then(this._rejectAsync,this._rejectAsync):this._rejectSync(t)
}_rejectSync(t){const e=this._handlers
;if(this.reason=t,null!=e){this._handlers=null
;for(let n=0,r=e.length;n<r;n++){const[,r,s]=e[n]
;K(t,r,s)}}}then(t,e){const n=new D(V)
;return"pending"===this.status?(null==this._handlers&&(this._handlers=[]),
this._handlers.push([t,e,n])):"fulfilled"===this.status?q(this.value,t,n):K(this.reason,e,n),
n}catch(t){return this.then(void 0,t)}finally(t){
const e=t&&function(e){return t(),e
},n=t&&function(e){throw t(),e}
;return this.then(e,n)}static resolve(t){
const e=new D(V);return e._resolve(t),e}
static reject(t){const e=new D(V)
;return e._reject(t),e}get[Symbol.toStringTag](){
return"Promise"}}const H=function(){};class I{
constructor(t){
if(t&&t.aborted)this.promise=D.reject(t.reason),this.resolve=H,this.reject=H;else{
let e,n;if(this.promise=new Promise((function(t){
e=t,n=function(e){!function(t,e){t(function(t){
return{then(e,n){n(t)}}}(e))}(t,e)}})),t){
const r=t.subscribe((function(t){n(t)}))
;this.resolve=function(t){r(),e(t)
},this.reject=function(t){r(),n(t)}
}else this.resolve=e,this.reject=n}}}
function J(t,e){return function(t,e){
const n=t&&t.branch,r=e&&e.branch,s=n?n.length:0,i=r?r.length:0,o=s>i?s:i
;for(let t=0;t<o;t++){
const e=t>=s?0:n[s-1-t],o=t>=i?0:r[i-1-t]
;if(e!==o)return e>o?1:-1}return 0
}(t.priority,e.priority)<0}let L=1;class N{
constructor(){this._queue=new C({lessThanFunc:J})}
run(t,e,n){return this._run(!1,t,e,n)}
runTask(t,e,n){return this._run(!0,t,e,n)}
_run(t,e,n,r){const s=new I(r),i={
priority:(o=L++,l=n,null==o?null==l?null:l:new E(o,l)),
func:e,abortSignal:r,resolve:s.resolve,
reject:s.reject,readyToRun:!t};var o,l
;if(this._queue.add(i),t){const t=this;return{
result:s.promise,setReadyToRun(e){
i.readyToRun=e,e&&!t._inProcess&&(t._inProcess=!0,
t._process())}}}
return this._inProcess||(this._inProcess=!0,this._process()),s.promise
}_process(){
return s(this,void 0,void 0,(function*(){
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
if(this._maxSize=0,this._size=0,this._tickPromise=new b,!t)throw new Error("maxSize should be > 0")
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
if(!(this._size>0))return this._tickPromise||(this._tickPromise=new b),function(t,e){
return new Promise((function(n){
if(t&&t.aborted)return void u(n,t.reason);let r,s
;function i(t){s||(s=!0,r&&r(),u(n,t))}
e.then((function(t){r&&r(),n(t)
})).catch(i),t&&(r=t.subscribe(i))}))
}(t,this._tickPromise.promise)}holdWait(t,e,n,r){
return s(this,void 0,void 0,(function*(){
if(t>this.maxSize)throw new Error(`holdCount (${t} > maxSize (${this.maxSize}))`)
;r||(r=Q),
yield this._priorityQueue.run((n=>s(this,void 0,void 0,(function*(){
for(;t>this._size;)yield this.tick(n),yield r(e,n)
;if(!this.hold(t))throw new Error("Unexpected behavior")
}))),e,n)}))}}
function $({pool:t,count:e,func:n,priority:r,abortSignal:i,awaitPriority:o}){
return s(this,void 0,void 0,(function*(){
return function(t,e){return e?function(){try{
const n=t.apply(this,arguments)
;return a(n)?function(t,e){
return e?t.then((t=>(e(),t)),(t=>{throw e(),t})):t
}(n,e):n}finally{e()}}:t}((function(){
return s(this,void 0,void 0,(function*(){
yield t.holdWait(e,r,i,o);const s=new W(e)
;return n(s,i)}))}),(()=>{t.release(e)}))()}))}
function G(t,e){t(function(t){return{then(e,n){
n(t)}}}(e))}function U(t,e,n){
return new Promise((function(r){
if(e&&e.aborted)return void G(r,e.reason);let s
;const i=n||c,o=i.setTimeout((function(){
s&&s(),r()}),t);e&&(s=e.subscribe((function(t){
i.clearTimeout(o),G(r,t)})))}))}function B(t){
return null!=t&&"object"==typeof t&&"function"==typeof t.then
}class X{constructor(t={}){
this.value=t.value,this.loading=t.loading||!1,this.hasValue=t.hasValue||!1,
this.error=t.error,this.hasError=t.hasError||!1}}
function Y(t){return function(t){
return t=function(t,e){
var n=void 0===e?{}:e,r=n.sortKeys,s=void 0===r||r
;if(n.deep,!t||"object"!=typeof t)return t
;var i=Object.keys(t)
;return s&&i.sort(),i.reduce((function(e,n){
var r=t[n];return null!=r&&""!==r&&(e[n]=r),e
}),{})}(t),JSON.stringify(null!=t?t:null)}}
return t.createMemCacheStrategy=function(t){
var e=t.lifeTime,n=t.updateInterval,r=t.timeController
;r||(r=c);var o=new Map;return function(t,l,c){
return s(this,void 0,void 0,(function(){var c,u,a
;return i(this,(function(h){switch(h.label){
case 0:return(c=o.get(l))||(c={value:t(),options:{
dateCreated:r.now(),dateRequest:r.now()}
},o.set(l,c),function(){
s(this,void 0,void 0,(function(){var s,u
;return i(this,(function(i){switch(i.label){
case 0:return B(c.value)?[4,c.value]:[3,2];case 1:
return u=i.sent(),[3,3];case 2:u=c.value,i.label=3
;case 3:
s=u,c.options.dateRequest=r.now(),i.label=4
;case 4:
return s.hasValue?n?[4,U(n,null,r)]:[3,7]:(o.delete(l),[3,10])
;case 5:
return i.sent(),r.now()-c.options.dateRequest>e?(o.delete(l),[3,10]):[4,t(s)]
;case 6:return i.sent(),[3,9];case 7:
return[4,U(e,null,r)];case 8:
return i.sent(),o.delete(l),[3,10];case 9:
return[3,4];case 10:return[2]}}))}))
}()),B(c.value)?[4,c.value]:[3,2];case 1:
return a=h.sent(),[3,3];case 2:a=c.value,h.label=3
;case 3:
if(u=a,c.options.dateRequest=r.now(),!u.hasValue)throw u.error||new Error("state.error = ".concat(u.error))
;return[2,u.value]}}))}))}
},t.getHashKeyFunc=function(t){
void 0===t&&(t="sha256");var e=Y()
;return function(n){var s=e(n)
;return r.default.createHash(t).update(s).digest("base64url")
}},t.getJsonKeyFunc=Y,t.toCached=function(t,e){
var n=e.getKey,r=e.strategy,o=new Map
;return function(){
for(var e=[],l=0;l<arguments.length;l++)e[l]=arguments[l]
;return s(this,void 0,void 0,(function(){
var l,c,u,a,h=this;return i(this,(function(f){
switch(f.label){case 0:
return B(l=n.apply(this,e))?[4,l]:[3,2];case 1:
l=f.sent(),f.label=2;case 2:
(c=o.get(l))?c.count++:(u=function(t){return $({
pool:new W(1),count:1,func:t})},c={lock:u,count:1
},o.set(l,c)),a=function(n){
return s(h,void 0,void 0,(function(){var r,s
;return i(this,(function(i){switch(i.label){
case 0:n||(n=function(t={}){return new X(t)
}()),i.label=1;case 1:
return i.trys.push([1,4,5,6]),n.loading=!0,B(r=t.apply(this,e))?[4,r]:[3,3]
;case 2:r=i.sent(),i.label=3;case 3:
return n.value=r,n.hasValue=!0,n.hasError=!1,[3,6]
;case 4:
return s=i.sent(),n.error=s,n.hasError=!0,[3,6]
;case 5:return n.loading=!1,[7];case 6:return[2,n]
}}))}))},f.label=3;case 3:
return f.trys.push([3,,5,6]),[4,r(a,l,c.lock,this,e)]
;case 4:return[2,f.sent()];case 5:
return c.count--,0===c.count&&o.delete(l),[7]
;case 6:return[2]}}))}))}
},Object.defineProperty(t,"__esModule",{value:!0
}),t}({},crypto);
