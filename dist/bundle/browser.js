var Cache=function(t){"use strict"
;function e(t,e,n,r){
return new(n||(n=Promise))((function(i,s){
function o(t){try{c(r.next(t))}catch(t){s(t)}}
function l(t){try{c(r.throw(t))}catch(t){s(t)}}
function c(t){var e
;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){
t(e)}))).then(o,l)}c((r=r.apply(t,e||[])).next())
}))}function n(t,e){var n,r,i,s,o={label:0,
sent:function(){if(1&i[0])throw i[1];return i[1]},
trys:[],ops:[]};return s={next:l(0),throw:l(1),
return:l(2)
},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){
return this}),s;function l(l){return function(c){
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
l=e.call(t,o)}catch(t){l=[6,t],r=0}finally{n=i=0}
if(5&l[0])throw l[1];return{
value:l[0]?l[1]:void 0,done:!0}}([l,c])}}}
function r(t,e){
var n="function"==typeof Symbol&&t[Symbol.iterator]
;if(!n)return t;var r,i,s=n.call(t),o=[];try{
for(;(void 0===e||e-- >0)&&!(r=s.next()).done;)o.push(r.value)
}catch(t){i={error:t}}finally{try{
r&&!r.done&&(n=s.return)&&n.call(s)}finally{
if(i)throw i.error}}return o}function i(t,e,n){
if(n||2===arguments.length)for(var r,i=0,s=e.length;i<s;i++)!r&&i in e||(r||(r=Array.prototype.slice.call(e,0,i)),
r[i]=e[i])
;return t.concat(r||Array.prototype.slice.call(e))
}const s=setTimeout,o=clearTimeout,l={
now:function(){return Date.now()},
setTimeout:"undefined"==typeof window?setTimeout:function(){
return s.apply(window,arguments)},
clearTimeout:"undefined"==typeof window?clearTimeout:function(){
return o.apply(window,arguments)}}
;function c(t,e){return t<e}class u{
constructor({objectPool:t,lessThanFunc:e}={}){
this._size=0,this._root=null,this.merge=a,
this.collapse=h,this._objectPool=t,this._lessThanFunc=e||c
}clear(){this._root=null,this._size=0}get size(){
return this._size}add(t){
let e=null!=this._objectPool?this._objectPool.get():null
;return null==e?e={child:null,next:null,prev:null,
item:t
}:e.item=t,this._size++,this._root=a(this._root,e,this._lessThanFunc),e
}getMin(){const{_root:t}=this
;return null==t?void 0:t.item}getMinNode(){
return this._root}deleteMin(){const{_root:t}=this
;if(null==t)return;const e=t.item
;return this.delete(t),e}delete(t){var e
;if(t===this._root)this._root=h(t.child,this._lessThanFunc);else{
if(null==t.prev){
if(this._objectPool)throw new Error("The node is already deleted. Don't use the objectPool to prevent this error.")
;return}
t.prev.child===t?t.prev.child=t.next:t.prev.next=t.next,null!=t.next&&(t.next.prev=t.prev),
this._root=a(this._root,h(t.child,this._lessThanFunc),this._lessThanFunc)
}
t.child=null,t.prev=null,t.next=null,t.item=void 0,null===(e=this._objectPool)||void 0===e||e.release(t),
this._size--}decreaseKey(t){
t!==this._root&&(t.prev.child===t?t.prev.child=t.next:t.prev.next=t.next,
null!=t.next&&(t.next.prev=t.prev),
this._root=a(this._root,t,this._lessThanFunc))}
get isEmpty(){return null==this._root}
[Symbol.iterator](){return this._iterate(!1)}
nodes(){return{
[Symbol.iterator]:()=>this._iterate(!0)}}
_iterate(t){const e=this._lessThanFunc
;return function*n(r){
r&&(t?yield r:yield r.item,r.child&&(null!=r.child.next&&(r.child=h(r.child,e),
r.child.prev=r),yield*n(r.child)))}(this._root)}}
function a(t,e,n){let r,i
;return null==t?e:null==e||t===e?t:(n(e.item,t.item)?(r=e,
i=t):(r=t,i=e),i.next=r.child,
null!=r.child&&(r.child.prev=i),i.prev=r,r.child=i,
r.next=null,r.prev=null,r)}function h(t,e){
let n,r,i,s,o;if(null==t)return null
;for(s=t,n=null;null!=s;){
if(r=s,i=r.next,null==i){r.prev=n,n=r;break}
s=i.next,o=a(r,i,e),o.prev=n,n=o}
for(o=null;null!=n;)s=n.prev,o=a(o,n,e),n=s
;return o}function f(t,e){t(function(t){return{
then(e,n){n(t)}}}(e))}function d(t,e,n){
return new Promise((function(r){
if(e&&e.aborted)return void f(r,e.reason);let i
;const s=n||l,o=s.setTimeout((function(){
i&&i(),r()}),t);e&&(i=e.subscribe((function(t){
s.clearTimeout(o),f(r,t)})))}))}function v(t){
return null!=t&&"object"==typeof t&&"function"==typeof t.then
}let _,p=[];function y(t){
p.push(t),_||(_=function(){
return e(this,void 0,void 0,(function*(){
for(;p.length>0;){yield 0;const t=p
;p=[],t.forEach((t=>{try{t()}catch(t){
console.error("Unhandled promise rejection",t)}}))
}_=null}))}())}function b(t,e,n){y((()=>{try{
const r=e?e(t):t;n._resolve(r)}catch(t){
n._reject(t)}}))}function m(t,e,n){y((()=>{
if(e)try{const r=e(t);n._resolve(r)}catch(t){
n._reject(t)}else n._reject(t)}))}
const w=function(){};class g{constructor(t){
this.status="pending",this.value=void 0,
this.reason=void 0,this._handlers=null
;const e=this._resolve,n=this._reject,r=this._resolveAsync,i=this._rejectAsync,s=this
;this._resolve=function(t){e.call(s,t)
},this._reject=function(t){n.call(s,t)
},this._resolveAsync=function(t){r.call(s,t)
},this._rejectAsync=function(t){i.call(s,t)
},t(this._resolve,this._reject)}_resolve(t){
"pending"===this.status&&(this.status="fulfilled",
this._resolveAsync(t))}_resolveAsync(t){
v(t)?t.then(this._resolveAsync,this._rejectAsync):this._resolveSync(t)
}_resolveSync(t){const e=this._handlers
;if(this.value=t,null!=e){this._handlers=null
;for(let n=0,r=e.length;n<r;n++){const[r,,i]=e[n]
;b(t,r,i)}}}_reject(t){
"pending"===this.status&&this._rejectAsync(t)}
_rejectAsync(t){
this.status="rejected",v(t)?t.then(this._rejectAsync,this._rejectAsync):this._rejectSync(t)
}_rejectSync(t){const e=this._handlers
;if(this.reason=t,null!=e){this._handlers=null
;for(let n=0,r=e.length;n<r;n++){const[,r,i]=e[n]
;m(t,r,i)}}}then(t,e){const n=new g(w)
;return"pending"===this.status?(null==this._handlers&&(this._handlers=[]),
this._handlers.push([t,e,n])):"fulfilled"===this.status?b(this.value,t,n):m(this.reason,e,n),
n}catch(t){return this.then(void 0,t)}finally(t){
const e=t&&function(e){const n=t()
;return v(n)?n.then((()=>e)):g.resolve(e)
},n=t&&function(e){const n=t()
;return v(n)?n.then((()=>g.reject(e))):g.reject(e)
};return this.then(e,n)}static resolve(t){
const e=new g(w);return e._resolve(t),e}
static reject(t){const e=new g(w)
;return e._reject(t),e}get[Symbol.toStringTag](){
return"Promise"}static get[Symbol.species](){
return g}static all(t){return function(t,e){
let n,r;e||(e=Promise);const i=new e(((t,e)=>{
n=t,r=e}));let s=t.length;const o=[]
;return t.forEach(((t,e)=>{v(t)?t.then((t=>{
o[e]=t,0==--s&&n(o)}),r):(o[e]=t,0==--s&&n(o))
})),i}(t,g)}static allSettled(t){
return function(t,e){let n;e||(e=Promise)
;const r=new e(((t,e)=>{n=t}));let i=t.length
;const s=[];return t.forEach(((t,e)=>{
v(t)?t.then((t=>{s[e]={status:"fulfilled",value:t
},0==--i&&n(s)}),(t=>{s[e]={status:"rejected",
reason:t},0==--i&&n(s)})):(s[e]={
status:"fulfilled",value:t},0==--i&&n(s))})),r
}(t,g)}static any(t){return function(t,e){let n,r
;e||(e=Promise);const i=new e(((t,e)=>{n=t,r=e}))
;let s=t.length;const o=[]
;return t.forEach(((t,e)=>{v(t)?t.then(n,(t=>{
o[e]=t,0==--s&&r(new AggregateError(o))})):n(t)
})),i}(t,g)}static race(t){return function(t,e){
let n,r;e||(e=Promise);const i=new e(((t,e)=>{
n=t,r=e}));return t.forEach((t=>{
v(t)?t.then(n,r):n(t)})),i}(t,g)}}
const j=function(){};class x{constructor(t){
if(this._status="pending",t&&t.aborted)this.promise=g.reject(t.reason),
this.resolve=j,this.reject=j;else{let e,n
;if(this.promise=new Promise((function(t){
e=t,n=function(e){f(t,e)}})),t){
const r=t.subscribe((function(t){n(t)}))
;this.resolve=function(t){r(),e(t)
},this.reject=function(t){r(),n(t)}
}else this.resolve=e,this.reject=n}
this.promise.then((()=>{this._status="resolved"
}),(()=>{this._status="rejected"}))}get state(){
return this._status}}class S{constructor(t={}){
this.value=t.value,this.loading=t.loading||!1,
this.hasValue=t.hasValue||!1,this.error=t.error,
this.hasError=t.hasError||!1}}class z{
constructor(t,e){
this._branch=null,this.order=t,this.parent=e}
get branch(){if(!this._branch){
const t=[this.order];let e=this.parent
;for(;null!=e;)t.push(e.order),e=e.parent
;this._branch=t}return this._branch}}
function P(t,e){return function(t,e){
const n=t&&t.branch,r=e&&e.branch,i=n?n.length:0,s=r?r.length:0,o=i>s?i:s
;for(let t=0;t<o;t++){
const e=t>=i?0:n[i-1-t],o=t>=s?0:r[s-1-t]
;if(e!==o)return e>o?1:-1}return 0
}(t.priority,e.priority)<0}let T=1;class E{
constructor(){this._queue=new u({lessThanFunc:P})}
run(t,e,n){return this._run(!1,t,e,n)}
runTask(t,e,n){return this._run(!0,t,e,n)}
_run(t,e,n,r){const i=new x(r),s={
priority:(o=T++,l=n,null==o?null==l?null:l:new z(o,l)),
func:e,abortSignal:r,resolve:i.resolve,
reject:i.reject,readyToRun:!t};var o,l
;if(this._queue.add(s),t){const t=this;return{
result:i.promise,setReadyToRun(e){
s.readyToRun=e,e&&!t._inProcess&&(t._inProcess=!0,
t._process())}}}
return this._inProcess||(this._inProcess=!0,this._process()),i.promise
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
}catch(t){e.reject(t)}}}))}}const k=function(){
const t=new E;return function(e,n){
return t.run(void 0,e,n)}}();class A{
constructor(t){
if(this._maxSize=0,this._size=0,this._tickPromise=new x,!t)throw new Error("maxSize should be > 0")
;this._maxSize=t,
this._size=t,this._priorityQueue=new E}
get maxSize(){return this._maxSize}get size(){
return this._size}get holdAvailable(){
return this._size}hold(t){const e=this._size
;return!(t>e)&&(this._size=e-t,!0)}
get releaseAvailable(){
return this.maxSize-this._size}release(t,e){
const n=this._size,r=this.maxSize-n;if(t>r){
if(!e)throw new Error(`count (${t} > maxReleaseCount (${r}))`)
;t=r}if(t>0&&(this._size=n+t,this._tickPromise)){
const t=this._tickPromise
;this._tickPromise=null,t.resolve()}return t}
tick(t){
if(!(this._size>=this._maxSize))return this._tickPromise||(this._tickPromise=new x),
function(t,e){return t?new Promise((function(n){
if(t&&t.aborted)return void f(n,t.reason);let r,i
;function s(t){i||(i=!0,r&&r(),f(n,t))}
e.then((function(t){r&&r(),n(t)
})).catch(s),t&&(r=t.subscribe(s))})):e
}(t,this._tickPromise.promise)}holdWait(t,n,r,i){
if(t>this.maxSize)throw new Error(`holdCount (${t} > maxSize (${this.maxSize}))`)
;return i||(i=k),
this._priorityQueue.run((r=>e(this,void 0,void 0,(function*(){
for(;t>this._size;)yield this.tick(r),yield i(n,r)
;if(!this.hold(t))throw new Error("Unexpected behavior")
}))),n,r)}}
function R({pool:t,count:n,func:r,priority:i,abortSignal:s,awaitPriority:o}){
return e(this,void 0,void 0,(function*(){
return function(t,e){return e?function(){try{
const n=t.apply(this,arguments)
;return v(n)?function(t,e){
return e?t.then((t=>(e(),t)),(t=>{throw e(),t})):t
}(n,e):(e(),n)}catch(t){throw e(),t}}:t
}((function(){
return e(this,void 0,void 0,(function*(){
yield t.holdWait(n,i,s,o);const e=new A(n)
;return r(e,s)}))}),(()=>{t.release(n)}))()}))}
var F=Symbol("DELETE"),M=Object.freeze([])
;function q(t,e){void 0===e&&(e={});var n=C(t,e)
;if(n!==F)return n}function C(t,e,n){
void 0===e&&(e={});var s=e.custom
;if(s&&(t=s(n||M,t)),t===F)return t
;if(null==t||"object"!=typeof t)return t
;if(Array.isArray(t)){
for(var o=[],l=0,c=t.length;l<c;l++){
(h=C(h=t[l],e,s?n?i(i([],r(n),!1),[l+""],!1):[l+""]:n))!==F&&o.push(h)
}return o}if(t.constructor===Object){
var u=e.dontDeleteNullKeys,a=(o={},Object.keys(t))
;a.sort();for(l=0,c=a.length;l<c;l++){var h,f=a[l]
;h=C(h=t[f],e,s?n?i(i([],r(n),!1),[f],!1):[f]:n),
(u||null!=h)&&(h!==F&&(o[f]=h))}return o}
throw new Error("Unknown object type\npath: [".concat((n||M).join("]["),"]\nconstructor: ").concat(t.constructor.name,"\nuse the 'custom' option to convert or filter it"))
}
return t.DELETE=F,t.createMemCacheStrategy=function(t){
var r=void 0===t?{}:t,i=r.lifeTime,s=r.updateInterval,o=r.timeController
;o||(o=l);var c=new Map;return function(t,r,l){
return e(this,void 0,void 0,(function(){var l,u,a
;return n(this,(function(h){switch(h.label){
case 0:return(l=c.get(r))||(l={value:t(),options:{
dateCreated:o.now(),dateRequest:o.now()}
},c.set(r,l),function(){
e(this,void 0,void 0,(function(){var e,u
;return n(this,(function(n){switch(n.label){
case 0:return v(l.value)?[4,l.value]:[3,2];case 1:
return u=n.sent(),[3,3];case 2:u=l.value,n.label=3
;case 3:
e=u,l.options.dateRequest=o.now(),n.label=4
;case 4:
return e.hasValue?s?[4,d(s,null,o)]:[3,7]:(c.delete(r),[3,11])
;case 5:
return n.sent(),null!=i&&o.now()-l.options.dateRequest>i?(c.delete(r),[3,11]):[4,t(e)]
;case 6:return n.sent(),[3,10];case 7:
return null==i?[3,9]:[4,d(i,null,o)];case 8:
n.sent(),n.label=9;case 9:
return c.delete(r),[3,11];case 10:return[3,4]
;case 11:return[2]}}))}))
}()),v(l.value)?[4,l.value]:[3,2];case 1:
return a=h.sent(),[3,3];case 2:a=l.value,h.label=3
;case 3:
if(u=a,l.options.dateRequest=o.now(),!u.hasValue)throw u.error||new Error("state.error = ".concat(u.error))
;return[2,u.value]}}))}))}
},t.getJsonKeyFunc=function(t){
return void 0===t&&(t={}),function(e){
return e=q(e,t),JSON.stringify(null!=e?e:null)}
},t.normalizeObject=q,t.toCached=function(t,r){
var i=r.getKey,s=r.strategy,o=new Map
;return function(){
for(var r=[],l=0;l<arguments.length;l++)r[l]=arguments[l]
;return e(this,void 0,void 0,(function(){
var l,c,u,a,h,f=this;return n(this,(function(d){
switch(d.label){case 0:
return v(l=i.apply(this,r))?[4,l]:[3,2];case 1:
l=d.sent(),d.label=2;case 2:
(c=o.get(l))?c.count++:(u=new A(1),a=function(t){
return R({pool:u,count:1,func:t})},c={lock:a,
count:1},o.set(l,c)),h=function(i){
return e(f,void 0,void 0,(function(){var e,s
;return n(this,(function(n){switch(n.label){
case 0:i||(i=function(t={}){return new S(t)
}()),n.label=1;case 1:
return n.trys.push([1,4,5,6]),i.loading=!0,v(e=t.apply(this,r))?[4,e]:[3,3]
;case 2:e=n.sent(),n.label=3;case 3:
return i.value=e,i.hasValue=!0,i.hasError=!1,[3,6]
;case 4:
return s=n.sent(),i.error=s,i.hasError=!0,[3,6]
;case 5:return i.loading=!1,[7];case 6:return[2,i]
}}))}))},d.label=3;case 3:
return d.trys.push([3,,5,6]),[4,s(h,l,c.lock,this,r)]
;case 4:return[2,d.sent()];case 5:
return c.count--,0===c.count&&o.delete(l),[7]
;case 6:return[2]}}))}))}
},Object.defineProperty(t,"__esModule",{value:!0
}),t}({});
