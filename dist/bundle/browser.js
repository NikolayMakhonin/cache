var Cache=function(e){"use strict"
;function t(e,t,n,r){
return new(n||(n=Promise))((function(i,s){
function o(e){try{u(r.next(e))}catch(e){s(e)}}
function l(e){try{u(r.throw(e))}catch(e){s(e)}}
function u(e){var t
;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){
e(t)}))).then(o,l)}u((r=r.apply(e,t||[])).next())
}))}function n(e,t){var n,r,i,s,o={label:0,
sent:function(){if(1&i[0])throw i[1];return i[1]},
trys:[],ops:[]};return s={next:l(0),throw:l(1),
return:l(2)
},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){
return this}),s;function l(l){return function(u){
return function(l){
if(n)throw new TypeError("Generator is already executing.")
;for(;s&&(s=0,l[0]&&(o=0)),o;)try{
if(n=1,r&&(i=2&l[0]?r.return:l[0]?r.throw||((i=r.return)&&i.call(r),
0):r.next)&&!(i=i.call(r,l[1])).done)return i
;switch(r=0,i&&(l=[2&l[0],i.value]),l[0]){case 0:
case 1:i=l;break;case 4:return o.label++,{
value:l[1],done:!1};case 5:o.label++,r=l[1],l=[0]
;continue;case 7:l=o.ops.pop(),o.trys.pop()
;continue;default:
if(!(i=o.trys,(i=i.length>0&&i[i.length-1])||6!==l[0]&&2!==l[0])){
o=0;continue}
if(3===l[0]&&(!i||l[1]>i[0]&&l[1]<i[3])){
o.label=l[1];break}if(6===l[0]&&o.label<i[1]){
o.label=i[1],i=l;break}if(i&&o.label<i[2]){
o.label=i[2],o.ops.push(l);break}
i[2]&&o.ops.pop(),o.trys.pop();continue}
l=t.call(e,o)}catch(e){l=[6,e],r=0}finally{n=i=0}
if(5&l[0])throw l[1];return{
value:l[0]?l[1]:void 0,done:!0}}([l,u])}}}
const r=setTimeout,i=clearTimeout,s={
now:function(){return Date.now()},
setTimeout:"undefined"==typeof window?setTimeout:function(){
return r.apply(window,arguments)},
clearTimeout:"undefined"==typeof window?clearTimeout:function(){
return i.apply(window,arguments)}}
;function o(e,t){return e<t}class l{
constructor({objectPool:e,lessThanFunc:t}={}){
this._size=0,this._root=null,this.merge=u,
this.collapse=c,this._objectPool=e,this._lessThanFunc=t||o
}clear(){this._root=null,this._size=0}get size(){
return this._size}add(e){
let t=null!=this._objectPool?this._objectPool.get():null
;return null==t?t={child:null,next:null,prev:null,
item:e
}:t.item=e,this._size++,this._root=u(this._root,t,this._lessThanFunc),t
}getMin(){const{_root:e}=this
;return null==e?void 0:e.item}getMinNode(){
return this._root}deleteMin(){const{_root:e}=this
;if(null==e)return;const t=e.item
;return this.delete(e),t}delete(e){var t
;if(e===this._root)this._root=c(e.child,this._lessThanFunc);else{
if(null==e.prev){
if(this._objectPool)throw new Error("The node is already deleted. Don't use the objectPool to prevent this error.")
;return}
e.prev.child===e?e.prev.child=e.next:e.prev.next=e.next,null!=e.next&&(e.next.prev=e.prev),
this._root=u(this._root,c(e.child,this._lessThanFunc),this._lessThanFunc)
}
e.child=null,e.prev=null,e.next=null,e.item=void 0,null===(t=this._objectPool)||void 0===t||t.release(e),
this._size--}decreaseKey(e){
e!==this._root&&(e.prev.child===e?e.prev.child=e.next:e.prev.next=e.next,
null!=e.next&&(e.next.prev=e.prev),
this._root=u(this._root,e,this._lessThanFunc))}
get isEmpty(){return null==this._root}
[Symbol.iterator](){return this._iterate(!1)}
nodes(){return{
[Symbol.iterator]:()=>this._iterate(!0)}}
_iterate(e){const t=this._lessThanFunc
;return function*n(r){
r&&(e?yield r:yield r.item,r.child&&(null!=r.child.next&&(r.child=c(r.child,t),
r.child.prev=r),yield*n(r.child)))}(this._root)}}
function u(e,t,n){let r,i
;return null==e?t:null==t||e===t?e:(n(t.item,e.item)?(r=t,
i=e):(r=e,i=t),i.next=r.child,
null!=r.child&&(r.child.prev=i),i.prev=r,r.child=i,
r.next=null,r.prev=null,r)}function c(e,t){
let n,r,i,s,o;if(null==e)return null
;for(s=e,n=null;null!=s;){
if(r=s,i=r.next,null==i){r.prev=n,n=r;break}
s=i.next,o=u(r,i,t),o.prev=n,n=o}
for(o=null;null!=n;)s=n.prev,o=u(o,n,t),n=s
;return o}function a(e,t){e(function(e){return{
then(t,n){n(e)}}}(t))}function h(e,t,n){
return new Promise((function(r){
if(t&&t.aborted)return void a(r,t.reason);let i
;const o=n||s,l=o.setTimeout((function(){
i&&i(),r()}),e);t&&(i=t.subscribe((function(e){
o.clearTimeout(l),a(r,e)})))}))}function f(e){
return null!=e&&"object"==typeof e&&"function"==typeof e.then
}let d,_=[];function v(e){
_.push(e),d||(d=function(){
return t(this,void 0,void 0,(function*(){
for(;_.length>0;){yield 0;const e=_
;_=[],e.forEach((e=>{try{e()}catch(e){
console.error("Unhandled promise rejection",e)}}))
}d=null}))}())}function p(e,t,n){v((()=>{try{
const r=t?t(e):e;n._resolve(r)}catch(e){
n._reject(e)}}))}function y(e,t,n){v((()=>{
if(t)try{const r=t(e);n._resolve(r)}catch(e){
n._reject(e)}else n._reject(e)}))}
const b=function(){};class w{constructor(e){
this.status="pending",this.value=void 0,
this.reason=void 0,this._handlers=null
;const t=this._resolve,n=this._reject,r=this._resolveAsync,i=this._rejectAsync,s=this
;this._resolve=function(e){t.call(s,e)
},this._reject=function(e){n.call(s,e)
},this._resolveAsync=function(e){r.call(s,e)
},this._rejectAsync=function(e){i.call(s,e)
},e(this._resolve,this._reject)}_resolve(e){
"pending"===this.status&&(this.status="fulfilled",
this._resolveAsync(e))}_resolveAsync(e){
f(e)?e.then(this._resolveAsync,this._rejectAsync):this._resolveSync(e)
}_resolveSync(e){const t=this._handlers
;if(this.value=e,null!=t){this._handlers=null
;for(let n=0,r=t.length;n<r;n++){const[r,,i]=t[n]
;p(e,r,i)}}}_reject(e){
"pending"===this.status&&this._rejectAsync(e)}
_rejectAsync(e){
this.status="rejected",f(e)?e.then(this._rejectAsync,this._rejectAsync):this._rejectSync(e)
}_rejectSync(e){const t=this._handlers
;if(this.reason=e,null!=t){this._handlers=null
;for(let n=0,r=t.length;n<r;n++){const[,r,i]=t[n]
;y(e,r,i)}}}then(e,t){const n=new w(b)
;return"pending"===this.status?(null==this._handlers&&(this._handlers=[]),
this._handlers.push([e,t,n])):"fulfilled"===this.status?p(this.value,e,n):y(this.reason,t,n),
n}catch(e){return this.then(void 0,e)}finally(e){
const t=e&&function(t){const n=e()
;return f(n)?n.then((()=>t)):w.resolve(t)
},n=e&&function(t){const n=e()
;return f(n)?n.then((()=>w.reject(t))):w.reject(t)
};return this.then(t,n)}static resolve(e){
const t=new w(b);return t._resolve(e),t}
static reject(e){const t=new w(b)
;return t._reject(e),t}get[Symbol.toStringTag](){
return"Promise"}static get[Symbol.species](){
return w}static all(e){return function(e,t){
let n,r;t||(t=Promise);const i=new t(((e,t)=>{
n=e,r=t}));let s=e.length;const o=[]
;return e.forEach(((e,t)=>{f(e)?e.then((e=>{
o[t]=e,0==--s&&n(o)}),r):(o[t]=e,0==--s&&n(o))
})),i}(e,w)}static allSettled(e){
return function(e,t){let n;t||(t=Promise)
;const r=new t(((e,t)=>{n=e}));let i=e.length
;const s=[];return e.forEach(((e,t)=>{
f(e)?e.then((e=>{s[t]={status:"fulfilled",value:e
},0==--i&&n(s)}),(e=>{s[t]={status:"rejected",
reason:e},0==--i&&n(s)})):(s[t]={
status:"fulfilled",value:e},0==--i&&n(s))})),r
}(e,w)}static any(e){return function(e,t){let n,r
;t||(t=Promise);const i=new t(((e,t)=>{n=e,r=t}))
;let s=e.length;const o=[]
;return e.forEach(((e,t)=>{f(e)?e.then(n,(e=>{
o[t]=e,0==--s&&r(new AggregateError(o))})):n(e)
})),i}(e,w)}static race(e){return function(e,t){
let n,r;t||(t=Promise);const i=new t(((e,t)=>{
n=e,r=t}));return e.forEach((e=>{
f(e)?e.then(n,r):n(e)})),i}(e,w)}}
const m=function(){};class g{constructor(e){
if(this._status="pending",e&&e.aborted)this.promise=w.reject(e.reason),
this.resolve=m,this.reject=m;else{let t,n
;if(this.promise=new Promise((function(e){
t=e,n=function(t){a(e,t)}})),e){
const r=e.subscribe((function(e){n(e)}))
;this.resolve=function(e){r(),t(e)
},this.reject=function(e){r(),n(e)}
}else this.resolve=t,this.reject=n}
this.promise.then((()=>{this._status="resolved"
}),(()=>{this._status="rejected"}))}get state(){
return this._status}}class j{constructor(e={}){
this.value=e.value,this.loading=e.loading||!1,
this.hasValue=e.hasValue||!1,this.error=e.error,
this.hasError=e.hasError||!1}}class x{
constructor(e,t){
this._branch=null,this.order=e,this.parent=t}
get branch(){if(!this._branch){
const e=[this.order];let t=this.parent
;for(;null!=t;)e.push(t.order),t=t.parent
;this._branch=e}return this._branch}}
function P(e,t){return function(e,t){
const n=e&&e.branch,r=t&&t.branch,i=n?n.length:0,s=r?r.length:0,o=i>s?i:s
;for(let e=0;e<o;e++){
const t=e>=i?0:n[i-1-e],o=e>=s?0:r[s-1-e]
;if(t!==o)return t>o?1:-1}return 0
}(e.priority,t.priority)<0}let S=1;class z{
constructor(){this._queue=new l({lessThanFunc:P})}
run(e,t,n){return this._run(!1,e,t,n)}
runTask(e,t,n){return this._run(!0,e,t,n)}
_run(e,t,n,r){const i=new g(r),s={
priority:(o=S++,l=n,null==o?null==l?null:l:new x(o,l)),
func:t,abortSignal:r,resolve:i.resolve,
reject:i.reject,readyToRun:!e};var o,l
;if(this._queue.add(s),e){const e=this;return{
result:i.promise,setReadyToRun(t){
s.readyToRun=t,t&&!e._inProcess&&(e._inProcess=!0,
e._process())}}}
return this._inProcess||(this._inProcess=!0,this._process()),i.promise
}_process(){
return t(this,void 0,void 0,(function*(){
const e=this._queue;for(;;){if(yield 0,e.isEmpty){
this._inProcess=!1;break}let t=e.getMin()
;if(t.readyToRun)e.deleteMin();else{let n
;for(const t of e.nodes())if(t.item.readyToRun){
n=t;break}if(!n){this._inProcess=!1;break}
t=n.item,e.delete(n)}
if(t.abortSignal&&t.abortSignal.aborted)t.reject(t.abortSignal.reason);else try{
let e=t.func&&t.func(t.abortSignal)
;e&&"function"==typeof e.then&&(e=yield e),t.resolve(e)
}catch(e){t.reject(e)}}}))}}const T=function(){
const e=new z;return function(t,n){
return e.run(void 0,t,n)}}();class k{
constructor(e){
if(this._maxSize=0,this._size=0,this._tickPromise=new g,!e)throw new Error("maxSize should be > 0")
;this._maxSize=e,
this._size=e,this._priorityQueue=new z}
get maxSize(){return this._maxSize}get size(){
return this._size}get holdAvailable(){
return this._size}hold(e){const t=this._size
;return!(e>t)&&(this._size=t-e,!0)}
get releaseAvailable(){
return this.maxSize-this._size}release(e,t){
const n=this._size,r=this.maxSize-n;if(e>r){
if(!t)throw new Error(`count (${e} > maxReleaseCount (${r}))`)
;e=r}if(e>0&&(this._size=n+e,this._tickPromise)){
const e=this._tickPromise
;this._tickPromise=null,e.resolve()}return e}
tick(e){
if(!(this._size>=this._maxSize))return this._tickPromise||(this._tickPromise=new g),
function(e,t){return e?new Promise((function(n){
if(e&&e.aborted)return void a(n,e.reason);let r,i
;function s(e){i||(i=!0,r&&r(),a(n,e))}
t.then((function(e){r&&r(),n(e)
})).catch(s),e&&(r=e.subscribe(s))})):t
}(e,this._tickPromise.promise)}holdWait(e,n,r,i){
if(e>this.maxSize)throw new Error(`holdCount (${e} > maxSize (${this.maxSize}))`)
;return i||(i=T),
this._priorityQueue.run((r=>t(this,void 0,void 0,(function*(){
for(;e>this._size;)yield this.tick(r),yield i(n,r)
;if(!this.hold(e))throw new Error("Unexpected behavior")
}))),n,r)}}
function E({pool:e,count:n,func:r,priority:i,abortSignal:s,awaitPriority:o}){
return t(this,void 0,void 0,(function*(){
return function(e,t){return t?function(){try{
const n=e.apply(this,arguments)
;return f(n)?function(e,t){
return t?e.then((e=>(t(),e)),(e=>{throw t(),e})):e
}(n,t):(t(),n)}catch(e){throw t(),e}}:e
}((function(){
return t(this,void 0,void 0,(function*(){
yield e.holdWait(n,i,s,o);const t=new k(n)
;return r(t,s)}))}),(()=>{e.release(n)}))()}))}
return e.createMemCacheStrategy=function(e){
var r=e.lifeTime,i=e.updateInterval,o=e.timeController
;o||(o=s);var l=new Map;return function(e,s,u){
return t(this,void 0,void 0,(function(){var u,c,a
;return n(this,(function(d){switch(d.label){
case 0:return(u=l.get(s))||(u={value:e(),options:{
dateCreated:o.now(),dateRequest:o.now()}
},l.set(s,u),function(){
t(this,void 0,void 0,(function(){var t,c
;return n(this,(function(n){switch(n.label){
case 0:return f(u.value)?[4,u.value]:[3,2];case 1:
return c=n.sent(),[3,3];case 2:c=u.value,n.label=3
;case 3:
t=c,u.options.dateRequest=o.now(),n.label=4
;case 4:
return t.hasValue?i?[4,h(i,null,o)]:[3,7]:(l.delete(s),[3,11])
;case 5:
return n.sent(),null!=r&&o.now()-u.options.dateRequest>r?(l.delete(s),[3,11]):[4,e(t)]
;case 6:return n.sent(),[3,10];case 7:
return null==r?[3,9]:[4,h(r,null,o)];case 8:
n.sent(),n.label=9;case 9:
return l.delete(s),[3,11];case 10:return[3,4]
;case 11:return[2]}}))}))
}()),f(u.value)?[4,u.value]:[3,2];case 1:
return a=d.sent(),[3,3];case 2:a=u.value,d.label=3
;case 3:
if(c=a,u.options.dateRequest=o.now(),!c.hasValue)throw c.error||new Error("state.error = ".concat(c.error))
;return[2,c.value]}}))}))}
},e.getJsonKeyFunc=function(e){return function(e){
return e=function(e,t){
var n=void 0===t?{}:t,r=n.sortKeys,i=void 0===r||r
;if(n.deep,!e||"object"!=typeof e)return e
;var s=Object.keys(e)
;return i&&s.sort(),s.reduce((function(t,n){
var r=e[n];return null!=r&&""!==r&&(t[n]=r),t
}),{})}(e),JSON.stringify(null!=e?e:null)}
},e.toCached=function(e,r){
var i=r.getKey,s=r.strategy,o=new Map
;return function(){
for(var r=[],l=0;l<arguments.length;l++)r[l]=arguments[l]
;return t(this,void 0,void 0,(function(){
var l,u,c,a,h=this;return n(this,(function(d){
switch(d.label){case 0:
return f(l=i.apply(this,r))?[4,l]:[3,2];case 1:
l=d.sent(),d.label=2;case 2:
(u=o.get(l))?u.count++:(c=function(e){return E({
pool:new k(1),count:1,func:e})},u={lock:c,count:1
},o.set(l,u)),a=function(i){
return t(h,void 0,void 0,(function(){var t,s
;return n(this,(function(n){switch(n.label){
case 0:i||(i=function(e={}){return new j(e)
}()),n.label=1;case 1:
return n.trys.push([1,4,5,6]),i.loading=!0,f(t=e.apply(this,r))?[4,t]:[3,3]
;case 2:t=n.sent(),n.label=3;case 3:
return i.value=t,i.hasValue=!0,i.hasError=!1,[3,6]
;case 4:
return s=n.sent(),i.error=s,i.hasError=!0,[3,6]
;case 5:return i.loading=!1,[7];case 6:return[2,i]
}}))}))},d.label=3;case 3:
return d.trys.push([3,,5,6]),[4,s(a,l,u.lock,this,r)]
;case 4:return[2,d.sent()];case 5:
return u.count--,0===u.count&&o.delete(l),[7]
;case 6:return[2]}}))}))}
},Object.defineProperty(e,"__esModule",{value:!0
}),e}({});
