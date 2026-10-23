var Ae=Object.defineProperty;var Se=Object.getOwnPropertyDescriptor;var g=(i,t,e,r)=>{for(var s=r>1?void 0:r?Se(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&Ae(t,e,s),s};var D=globalThis,q=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),oe=new WeakMap,k=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(q&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=oe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&oe.set(e,t))}return t}toString(){return this.cssText}},ne=i=>new k(typeof i=="string"?i:i+"",void 0,V),F=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new k(e,i,V)},ae=(i,t)=>{if(q)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),s=D.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},K=q?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return ne(e)})(i):i;var{is:Ee,defineProperty:Ce,getOwnPropertyDescriptor:ke,getOwnPropertyNames:Re,getOwnPropertySymbols:Te,getPrototypeOf:ze}=Object,L=globalThis,le=L.trustedTypes,Oe=le?le.emptyScript:"",Ue=L.reactiveElementPolyfillSupport,R=(i,t)=>i,T={toAttribute(i,t){switch(t){case Boolean:i=i?Oe:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},j=(i,t)=>!Ee(i,t),ce={attribute:!0,type:String,converter:T,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ce){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Ce(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){let{get:s,set:o}=ke(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){let c=s?.call(this);o?.call(this,n),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ce}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let t=ze(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let e=this.properties,r=[...Re(e),...Te(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(K(s))}else t!==void 0&&e.push(K(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ae(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:T).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let o=r.getPropertyOptions(s),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:T;this._$Em=s;let c=n.fromAttribute(e,o.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(t,e,r,s=!1,o){if(t!==void 0){let n=this.constructor;if(s===!1&&(o=this[t]),r??=n.getPropertyOptions(t),!((r.hasChanged??j)(o,e)||r.useDefault&&r.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:o},n){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,o]of r){let{wrapped:n}=o,c=this[s];n!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,o,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[R("elementProperties")]=new Map,_[R("finalized")]=new Map,Ue?.({ReactiveElement:_}),(L.reactiveElementVersions??=[]).push("2.1.2");var ee=globalThis,he=i=>i,B=ee.trustedTypes,de=B?B.createPolicy("lit-html",{createHTML:i=>i}):void 0,ve="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,_e="?"+b,Pe=`<${_e}>`,A=document,O=()=>A.createComment(""),U=i=>i===null||typeof i!="object"&&typeof i!="function",te=Array.isArray,Ne=i=>te(i)||typeof i?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pe=/-->/g,ue=/>/g,x=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ge=/'/g,me=/"/g,$e=/^(?:script|style|textarea|title)$/i,re=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),l=re(1),Ze=re(2),Xe=re(3),S=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),fe=new WeakMap,w=A.createTreeWalker(A,129);function be(i,t){if(!te(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return de!==void 0?de.createHTML(t):t}var Me=(i,t)=>{let e=i.length-1,r=[],s,o=t===2?"<svg>":t===3?"<math>":"",n=z;for(let c=0;c<e;c++){let a=i[c],u,m,d=-1,v=0;for(;v<a.length&&(n.lastIndex=v,m=n.exec(a),m!==null);)v=n.lastIndex,n===z?m[1]==="!--"?n=pe:m[1]!==void 0?n=ue:m[2]!==void 0?($e.test(m[2])&&(s=RegExp("</"+m[2],"g")),n=x):m[3]!==void 0&&(n=x):n===x?m[0]===">"?(n=s??z,d=-1):m[1]===void 0?d=-2:(d=n.lastIndex-m[2].length,u=m[1],n=m[3]===void 0?x:m[3]==='"'?me:ge):n===me||n===ge?n=x:n===pe||n===ue?n=z:(n=x,s=void 0);let $=n===x&&i[c+1].startsWith("/>")?" ":"";o+=n===z?a+Pe:d>=0?(r.push(u),a.slice(0,d)+ve+a.slice(d)+b+$):a+b+(d===-2?c:$)}return[be(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},P=class i{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,n=0,c=t.length-1,a=this.parts,[u,m]=Me(t,e);if(this.el=i.createElement(u,r),w.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=w.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(ve)){let v=m[n++],$=s.getAttribute(d).split(b),H=/([.?@])?(.*)/.exec(v);a.push({type:1,index:o,name:H[2],strings:$,ctor:H[1]==="."?Y:H[1]==="?"?G:H[1]==="@"?Z:C}),s.removeAttribute(d)}else d.startsWith(b)&&(a.push({type:6,index:o}),s.removeAttribute(d));if($e.test(s.tagName)){let d=s.textContent.split(b),v=d.length-1;if(v>0){s.textContent=B?B.emptyScript:"";for(let $=0;$<v;$++)s.append(d[$],O()),w.nextNode(),a.push({type:2,index:++o});s.append(d[v],O())}}}else if(s.nodeType===8)if(s.data===_e)a.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf(b,d+1))!==-1;)a.push({type:7,index:o}),d+=b.length-1}o++}}static createElement(t,e){let r=A.createElement("template");return r.innerHTML=t,r}};function E(i,t,e=i,r){if(t===S)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl,o=U(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=E(i,s._$AS(i,t.values),s,r)),t}var Q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??A).importNode(e,!0);w.currentNode=s;let o=w.nextNode(),n=0,c=0,a=r[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new N(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new X(o,this,t)),this._$AV.push(u),a=r[++c]}n!==a?.index&&(o=w.nextNode(),n++)}return w.currentNode=A,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},N=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),U(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ne(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=P.createElement(be(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{let o=new Q(s,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=fe.get(t.strings);return e===void 0&&fe.set(t.strings,e=new P(t)),e}k(t){te(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let o of t)s===e.length?e.push(r=new i(this.O(O()),this.O(O()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=he(t).nextSibling;he(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=h}_$AI(t,e=this,r,s){let o=this.strings,n=!1;if(o===void 0)t=E(this,t,e,0),n=!U(t)||t!==this._$AH&&t!==S,n&&(this._$AH=t);else{let c=t,a,u;for(t=o[0],a=0;a<o.length-1;a++)u=E(this,c[r+a],e,a),u===S&&(u=this._$AH[a]),n||=!U(u)||u!==this._$AH[a],u===h?t=h:t!==h&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!s&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Y=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},G=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},Z=class extends C{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??h)===S)return;let r=this._$AH,s=t===h&&r!==h||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==h&&(r===h||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},X=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var He=ee.litHtmlPolyfillSupport;He?.(P,N),(ee.litHtmlVersions??=[]).push("3.3.3");var ye=(i,t,e)=>{let r=e?.renderBefore??t,s=r._$litPart$;if(s===void 0){let o=e?.renderBefore??null;r._$litPart$=s=new N(t.insertBefore(O(),o),o,void 0,e??{})}return s._$AI(i),s};var se=globalThis,y=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ye(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};y._$litElement$=!0,y.finalized=!0,se.litElementHydrateSupport?.({LitElement:y});var De=se.litElementPolyfillSupport;De?.({LitElement:y});(se.litElementVersions??=[]).push("4.2.2");var xe=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var qe={attribute:!0,type:String,converter:T,reflect:!1,hasChanged:j},Le=(i=qe,t,e)=>{let{kind:r,metadata:s}=e,o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),r==="accessor"){let{name:n}=e;return{set(c){let a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,i,!0,c)},init(c){return c!==void 0&&this.C(n,void 0,i,c),c}}}if(r==="setter"){let{name:n}=e;return function(c){let a=this[n];t.call(this,c),this.requestUpdate(n,a,i,!0,c)}}throw Error("Unsupported decorator location: "+r)};function M(i){return(t,e)=>typeof e=="object"?Le(i,t,e):((r,s,o)=>{let n=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}function f(i){return M({...i,state:!0,attribute:!1})}var je="{?}";function Be(i,t){return{device_id:i,set_number:t.set_number,owned:!t.owned}}function We(i){return{device_id:i}}function ie(i,t){return t?{type:i,config_entry_id:t}:{type:i}}function Ie(i,t){if(!i)return"Not synced yet";let e=Math.floor((t.getTime()-new Date(i).getTime())/6e4);if(e<1)return"Updated just now";let r=new Intl.RelativeTimeFormat("en",{numeric:"always"});if(e<60)return`Updated ${r.format(-e,"minute")}`;let s=Math.floor(e/60);return s<48?`Updated ${r.format(-s,"hour")}`:`Updated ${r.format(-Math.floor(s/24),"day")}`}function I(i){let t=(i.name??"").trim();return t!==""&&t!==je}function Ve(i){return I(i)?i.name:"Name tbd"}var Fe="/lego_panel/icon.png",we={themes:"New in my themes",wishlist:"Your wishlist",collection:"Your collection"},p=class extends y{constructor(){super(...arguments);this.narrow=!1;this._tab="home";this._refreshing=!1;this._refreshError="";this._writeError="";this._theme="";this._error="";this._collection=[];this._query="";this._results=[];this._dragging="";this._accounts=[];this._account=""}connectedCallback(){super.connectedCallback(),this._load()}async _refreshCollection(){this._refreshing=!0,this._refreshError="";try{await this.hass.callService("lego","refresh_collection",We(this._dash?.device_id??"")),await this._load()}catch(e){this._refreshError=e instanceof Error?e.message:String(e)}finally{this._refreshing=!1}}async _selectAccount(e){if(e!==this._account){this._account=e,this._collection=[],this._results=[],this._query="",this._theme="",await this._load(),this._tab==="collection"&&await this._loadCollection();try{await this.hass.callWS({type:"lego/account/set",config_entry_id:e})}catch{}}}async _load(){try{if(!this._accounts.length){let r=await this.hass.callWS({type:"lego/accounts"});this._accounts=r.accounts,this._account=r.selected??""}let e=await this.hass.callWS(ie("lego/dashboard",this._account));this._dash=e,this._error="",(!this._theme||!(this._theme in e.themes))&&(this._theme=Object.keys(e.themes)[0]??"")}catch(e){this._error=e instanceof Error?e.message:String(e)}}async _loadCollection(){if(!this._collection.length)try{let e=await this.hass.callWS({...ie("lego/collection",this._account),filter:"owned"});this._collection=e.sets}catch(e){this._error=e instanceof Error?e.message:String(e)}}async _search(e){if(this._query=e,e.trim().length<2){this._results=[];return}try{let r=await this.hass.callWS({...ie("lego/search",this._account),query:e,limit:24});this._results=r.sets}catch{this._results=[]}}async _toggleOwned(e){this._writeError="";try{await this.hass.callService("lego","set_collection",Be(this._dash?.device_id??"",e))}catch(r){this._writeError=r instanceof Error?r.message:String(r);return}this._collection=[],await this._load(),this._tab==="collection"&&await this._loadCollection()}async _saveRows(e){if(this._dash){this._dash={...this._dash,rows:e};try{await this.hass.callWS({type:"lego/panel_config/set",rows:e})}catch{}}}_onDrop(e){let r=[...this._dash?.rows??[]],s=r.indexOf(this._dragging),o=r.indexOf(e);this._dragging="",!(s<0||o<0||s===o)&&(r.splice(o,0,...r.splice(s,1)),this._saveRows(r))}render(){return l`
      <div class="app">
        <header>
          <div class="bar">
            <h1>LEGO</h1>
            ${this._renderAccounts()}
          </div>
          <div class="tabs">
            <button
              class=${this._tab==="home"?"tab on":"tab"}
              @click=${()=>this._tab="home"}
            >
              Home
            </button>
            <button
              class=${this._tab==="collection"?"tab on":"tab"}
              @click=${()=>{this._tab="collection",this._loadCollection()}}
            >
              Collection
            </button>
          </div>
        </header>
        ${this._writeError?l`<p class="error" role="alert">
              Brickset would not save that change: ${this._writeError}
            </p>`:h}
        ${this._error?l`<p class="error" role="alert">${this._error}</p>`:this._tab==="home"?this._renderHome():this._renderCollection()}
      </div>
    `}_renderAccounts(){return this._accounts.length<2?h:l`
      <select
        class="account"
        aria-label="Brickset account"
        @change=${e=>{this._selectAccount(e.target.value)}}
      >
        ${this._accounts.map(e=>l`
            <option
              value=${e.entry_id}
              ?selected=${e.entry_id===this._account}
            >
              ${e.name}
            </option>
          `)}
      </select>
    `}_renderHome(){return this._dash?l`
      <div class="rows">
        ${this._dash.rows.map(e=>this._renderRow(e))}
      </div>
    `:l`<p class="muted">Loading your collection…</p>`}_renderRow(e){let r=e==="themes"?this._renderThemes():e==="wishlist"?this._renderWishlist():this._renderStats();return l`
      <section
        class=${this._dragging===e?"row dragging":"row"}
        @dragover=${s=>s.preventDefault()}
        @drop=${()=>this._onDrop(e)}
      >
        <div class="rowhead">
          <button
            class="drag"
            draggable="true"
            title="Drag to reorder"
            aria-label=${`Reorder ${we[e]}`}
            @dragstart=${()=>this._dragging=e}
            @dragend=${()=>this._dragging=""}
          >
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
          <h2>${we[e]}</h2>
        </div>
        ${r}
      </section>
    `}_renderThemes(){let e=Object.keys(this._dash?.themes??{});if(!e.length)return l`<p class="muted">
        No themes followed yet. Add one in the integration options to see new
        releases here.
      </p>`;let r=this._dash?.themes[this._theme]??[];return l`
      <div class="chips">
        ${e.map(s=>l`
            <button
              class=${s===this._theme?"chip on":"chip"}
              @click=${()=>this._theme=s}
            >
              ${s}
            </button>
          `)}
      </div>
      ${this._carousel(r,"No new sets in this theme.")}
    `}_renderWishlist(){return this._carousel(this._dash?.wishlist??[],"Nothing on your wishlist. Mark a set as wanted to see it here.")}_renderRefresh(){let e=this._dash?.quota;if(!e)return l``;let r=e.refresh_cost,s=e.remaining<r,o=!s&&e.remaining<=r*3;return l`
      <div class="refresh">
        <button
          class="refreshbtn"
          ?disabled=${this._refreshing||s}
          @click=${()=>{this._refreshCollection()}}
        >
          <ha-icon
            icon=${this._refreshing?"mdi:sync":"mdi:cloud-sync"}
          ></ha-icon>
          ${this._refreshing?"Updating\u2026":"Update now"}
        </button>
        <span
          class="quota ${s?"bad":o?"warn":""}"
          title=${this._dash?.last_synced?new Date(this._dash.last_synced).toLocaleString():h}
        >
          ${Ie(this._dash?.last_synced??null,new Date)}.
          ${s?l`Daily budget spent, ${e.calls_today} of ${e.budget}
              used, so this is the last sync's data. Updates resume at
              ${new Date(e.resets_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}.`:l`Costs ${r} of ${e.remaining} calls left today.`}
        </span>
      </div>
      ${this._refreshError?l`<p class="caveat bad">${this._refreshError}</p>`:h}
    `}_renderStats(){let e=this._dash?.stats;if(!e)return l``;let r=[[this._num(e.sets_owned),"Sets owned"],[this._num(e.sets_distinct),"Distinct sets"],[this._num(e.pieces_owned),"Pieces"],[this._num(e.minifigs_owned),"Minifigures"],[this._num(Math.round(e.value)),"Value at RRP"]];return l`
      <div class="stats">
        ${r.map(([s,o])=>l`
            <div class="stat">
              <span class="n">${s}</span><span class="l">${o}</span>
            </div>
          `)}
      </div>
      ${this._renderRefresh()}
      ${e.sets_missing_price?l`<p class="caveat">
            ${this._num(e.sets_missing_price)} sets have no published price
            and are not counted in the value.
          </p>`:h}
      <button
        class="link"
        @click=${()=>{this._tab="collection",this._loadCollection()}}
      >
        Browse all sets ›
      </button>
    `}_renderCollection(){let e=this._query.trim().length>=2?this._results:this._collection;return l`
      <div class="rows">
        <section class="row">
          <input
            class="search"
            type="search"
            .value=${this._query}
            placeholder="Search your sets and the full catalogue…"
            aria-label="Search sets"
            @input=${r=>{this._search(r.target.value)}}
          />
          ${this._query.trim().length>=2?l`<p class="muted">${e.length} matching sets</p>`:l`<p class="muted">${e.length} sets owned</p>`}
          <div class="grid">${e.map(r=>this._card(r))}</div>
        </section>
      </div>
    `}_carousel(e,r){return e.length?l`<div class="carousel">
      ${e.map(s=>this._card(s))}
    </div>`:l`<p class="muted">${r}</p>`}_linked(e,r,s=!1){return e.url?l`<a
      class="open"
      href=${e.url}
      target="_blank"
      rel="noopener noreferrer"
      tabindex=${s?"-1":h}
      aria-hidden=${s?"true":h}
      >${r}</a
    >`:r}_card(e){return l`
      <article class="card">
        ${this._linked(e,e.image?l`<img src=${e.image} alt="" loading="lazy" />`:l`<img
                class="noart"
                src=${Fe}
                alt=""
                loading="lazy"
              />`,!0)}
        <div class="meta">
          ${this._linked(e,l`<span
              class=${I(e)?"name":"name unnamed"}
              title=${I(e)?e.name:"Brickset has not published a name yet"}
              >${Ve(e)}</span
            >`)}
          <span class="num">${e.set_number}</span>
          <span class="when">${this._when(e)}</span>
          <div class="foot">
            <span
              class=${e.owned?"state own":e.wanted?"state want":"state"}
            >
              ${e.owned?e.qty_owned>1?`Owned \xD7${e.qty_owned}`:"Owned":e.wanted?"Wanted":e.year||""}
            </span>
            <button
              class=${e.owned?"act on":"act"}
              title=${e.owned?"Remove from your collection":"Add to your collection"}
              aria-label=${e.owned?"Remove from your collection":"Add to your collection"}
              @click=${()=>{this._toggleOwned(e)}}
            >
              <ha-icon icon=${e.owned?"mdi:check":"mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `}_when(e){return e.available_until?`Retires ${this._date(e.available_until)}`:e.available_from?`Out ${this._date(e.available_from)}`:I(e)?"Date unknown":"Details tbd"}_date(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:r.toLocaleDateString(this.hass?.locale?.language??void 0,{day:"numeric",month:"short",year:"numeric"})}_num(e){return e.toLocaleString(this.hass?.locale?.language??void 0)}};p.styles=F`
    /*
     * Every colour, size, space and radius below comes from a Home Assistant
     * theme variable or an --ha- token; each --ha- token carries the value the
     * frontend lists for it, for an older frontend that lacks the token.
     */
    :host {
      --lego-text: var(--primary-text-color, #141414);
      --lego-text-2: var(--secondary-text-color, #5e5e5e);
      --lego-surface: var(--card-background-color, #fff);
      --lego-ground: var(--primary-background-color);
      --lego-outline: var(--divider-color);
      --lego-primary: var(--primary-color);
      --lego-on-primary: var(--text-primary-color, #fff);
      --lego-focus: var(--ha-color-focus, #989898);
      /* Status text sits on the card surface, so it takes the on-* tokens. */
      --lego-own: var(--ha-color-on-success-normal, #036730);
      --lego-want: var(--ha-color-on-warning-normal, #9d3800);
      --lego-bad: var(--ha-color-on-danger-normal, #b30532);
      --lego-own-fill: var(--ha-color-fill-success-loud-resting, #00883c);
      --lego-on-own-fill: var(--ha-color-on-success-loud, #fff);
      --lego-radius: var(
        --ha-card-border-radius,
        var(--ha-border-radius-lg, 12px)
      );
      --lego-line: var(--ha-border-width-sm, 1px);
      display: block;
      background: var(--lego-ground);
      color: var(--lego-text);
      min-height: 100vh;
    }
    .app {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 0 var(--ha-space-8, 32px);
    }
    header {
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--lego-surface);
      border-bottom: var(--lego-line) solid var(--lego-outline);
      padding: 0 var(--ha-space-4, 16px);
    }
    .bar {
      align-items: center;
      display: flex;
      gap: var(--ha-space-3, 12px);
      justify-content: space-between;
      min-height: var(--ha-space-16, 64px);
    }
    h1 {
      font-size: var(--ha-font-size-xl, 20px);
      line-height: var(--ha-line-height-condensed, 1.2);
      font-weight: var(--ha-font-weight-bold, 700);
      margin: 0;
    }
    .account {
      background: var(--lego-ground);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--ha-border-radius-md, 8px);
      color: inherit;
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      max-width: 50%;
      min-height: 48px;
      padding: 0 var(--ha-space-3, 12px);
    }
    .tabs {
      display: flex;
      gap: var(--ha-space-1, 4px);
    }
    .tab {
      appearance: none;
      background: none;
      border: 0;
      border-bottom: var(--ha-border-width-md, 2px) solid transparent;
      color: var(--lego-text-2);
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-medium, 500);
      min-height: 48px;
      padding: 0 var(--ha-space-4, 16px);
      cursor: pointer;
    }
    .tab.on {
      color: var(--lego-primary);
      border-bottom-color: var(--lego-primary);
    }
    .rows {
      display: flex;
      flex-direction: column;
      gap: var(--ha-space-6, 24px);
      padding: var(--ha-space-5, 20px) var(--ha-space-4, 16px) 0;
    }
    .row {
      background: var(--lego-surface);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--lego-radius);
      padding: var(--ha-space-4, 16px);
    }
    .row.dragging {
      opacity: 0.5;
    }
    .rowhead {
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      margin-bottom: var(--ha-space-3, 12px);
    }
    /* Section headers outrank body text: xl at the heading weight. */
    h2 {
      font-size: var(--ha-font-size-xl, 20px);
      line-height: var(--ha-line-height-condensed, 1.2);
      font-weight: var(--ha-font-weight-bold, 700);
      margin: 0;
    }
    .drag {
      appearance: none;
      background: none;
      border: 0;
      color: var(--lego-text-2);
      cursor: grab;
      display: grid;
      place-items: center;
      min-width: 48px;
      min-height: 48px;
      margin-left: calc(-1 * var(--ha-space-3, 12px));
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ha-space-2, 8px);
      margin-bottom: var(--ha-space-3, 12px);
    }
    .chip {
      appearance: none;
      background: none;
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--ha-border-radius-pill, 9999px);
      color: var(--lego-text-2);
      cursor: pointer;
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-medium, 500);
      min-height: 40px;
      padding: 0 var(--ha-space-4, 16px);
    }
    .chip.on {
      background: var(--lego-primary);
      border-color: var(--lego-primary);
      color: var(--lego-on-primary);
    }
    .carousel {
      display: flex;
      gap: var(--ha-space-3, 12px);
      overflow-x: auto;
      padding-bottom: var(--ha-space-1, 4px);
      scroll-snap-type: x proximity;
    }
    .carousel .card {
      flex: 0 0 156px;
      scroll-snap-align: start;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
      gap: var(--ha-space-3, 12px);
    }
    .card {
      background: var(--lego-surface);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--lego-radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card img {
      width: 100%;
      height: 104px;
      object-fit: contain;
      background: var(--lego-ground);
    }
    /* Stand-in art, so it must read as absent rather than as the set. */
    .card img.noart {
      padding: var(--ha-space-6, 24px);
      opacity: 0.35;
      box-sizing: border-box;
    }
    .meta {
      display: flex;
      flex-direction: column;
      gap: var(--ha-space-1, 4px);
      padding: var(--ha-space-3, 12px);
    }
    .name {
      font-size: var(--ha-font-size-m, 14px);
      line-height: var(--ha-line-height-condensed, 1.2);
      font-weight: var(--ha-font-weight-bold, 700);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* An unannounced set has no name worth reading, so the number leads. */
    .name.unnamed {
      color: var(--lego-text-2);
      font-style: italic;
      font-weight: var(--ha-font-weight-normal, 400);
    }
    .num {
      font-size: var(--ha-font-size-s, 12px);
      color: var(--lego-text-2);
      font-variant-numeric: tabular-nums;
    }
    .name.unnamed + .num {
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-bold, 700);
      color: var(--lego-text);
    }
    .when {
      font-size: var(--ha-font-size-s, 12px);
      color: var(--lego-text-2);
    }
    .foot {
      align-items: center;
      display: flex;
      gap: var(--ha-space-2, 8px);
      margin-top: var(--ha-space-2, 8px);
    }
    .state {
      font-size: var(--ha-font-size-s, 12px);
      font-weight: var(--ha-font-weight-medium, 500);
      flex: 1;
      color: var(--lego-text-2);
    }
    .state.own {
      color: var(--lego-own);
    }
    .state.want {
      color: var(--lego-want);
    }
    .act {
      appearance: none;
      background: none;
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--ha-border-radius-circle, 50%);
      color: var(--lego-text-2);
      cursor: pointer;
      display: grid;
      place-items: center;
      /* 32px of ink, 48px of target: the padding does the work. */
      width: 32px;
      height: 32px;
      padding: var(--ha-space-2, 8px);
      box-sizing: content-box;
      margin: calc(-1 * var(--ha-space-2, 8px));
      --mdc-icon-size: 18px;
    }
    .act.on {
      background: var(--lego-own-fill);
      border-color: var(--lego-own-fill);
      color: var(--lego-on-own-fill);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: var(--lego-line);
      background: var(--lego-outline);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--lego-radius);
      overflow: hidden;
    }
    .stat {
      background: var(--lego-surface);
      display: flex;
      flex-direction: column;
      gap: var(--ha-space-1, 4px);
      padding: var(--ha-space-4, 16px);
    }
    .stat .n {
      font-size: var(--ha-font-size-2xl, 24px);
      font-weight: var(--ha-font-weight-bold, 700);
      line-height: var(--ha-line-height-condensed, 1.2);
      font-variant-numeric: tabular-nums;
    }
    .stat .l {
      font-size: var(--ha-font-size-s, 12px);
      color: var(--lego-text-2);
    }
    .caveat {
      font-size: var(--ha-font-size-s, 12px);
      line-height: var(--ha-line-height-normal, 1.6);
      color: var(--lego-text-2);
      margin: var(--ha-space-2, 8px) 0 0;
    }
    .caveat.bad {
      color: var(--lego-bad);
    }
    .refresh {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      margin: var(--ha-space-3, 12px) 0 0;
    }
    .refreshbtn {
      appearance: none;
      display: inline-flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      min-height: 48px;
      padding: 0 var(--ha-space-5, 20px);
      border: 0;
      border-radius: var(--ha-border-radius-pill, 9999px);
      background: var(--lego-primary);
      color: var(--lego-on-primary);
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      line-height: var(--ha-line-height-condensed, 1.2);
      font-weight: var(--ha-font-weight-medium, 500);
      cursor: pointer;
    }
    .refreshbtn ha-icon {
      --mdc-icon-size: 20px;
    }
    .refreshbtn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .quota {
      font-size: var(--ha-font-size-s, 12px);
      line-height: var(--ha-line-height-normal, 1.6);
      color: var(--lego-text-2);
    }
    .quota.warn {
      color: var(--lego-want);
    }
    .quota.bad {
      color: var(--lego-bad);
    }
    .link {
      appearance: none;
      background: none;
      border: 0;
      color: var(--lego-primary);
      cursor: pointer;
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-medium, 500);
      margin-top: var(--ha-space-2, 8px);
      min-height: 48px;
      padding: 0;
    }
    .search {
      background: var(--lego-ground);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--ha-border-radius-md, 8px);
      color: inherit;
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      min-height: 48px;
      padding: 0 var(--ha-space-3, 12px);
      width: 100%;
      box-sizing: border-box;
    }
    .muted {
      color: var(--lego-text-2);
      font-size: var(--ha-font-size-m, 14px);
      margin: var(--ha-space-3, 12px) 0 0;
    }
    .error {
      color: var(--lego-bad);
      padding: var(--ha-space-5, 20px) var(--ha-space-4, 16px);
    }
    a.open {
      display: block;
      min-width: 0;
      color: inherit;
      text-decoration: none;
    }
    a.open:hover .name {
      text-decoration: underline;
    }
    a:focus-visible,
    button:focus-visible,
    input:focus-visible,
    select:focus-visible {
      outline: var(--ha-border-width-md, 2px) solid var(--lego-focus);
      outline-offset: var(--ha-border-width-md, 2px);
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  `,g([M({attribute:!1})],p.prototype,"hass",2),g([M({type:Boolean})],p.prototype,"narrow",2),g([f()],p.prototype,"_tab",2),g([f()],p.prototype,"_dash",2),g([f()],p.prototype,"_refreshing",2),g([f()],p.prototype,"_refreshError",2),g([f()],p.prototype,"_writeError",2),g([f()],p.prototype,"_theme",2),g([f()],p.prototype,"_error",2),g([f()],p.prototype,"_collection",2),g([f()],p.prototype,"_query",2),g([f()],p.prototype,"_results",2),g([f()],p.prototype,"_dragging",2),g([f()],p.prototype,"_accounts",2),g([f()],p.prototype,"_account",2),p=g([xe("lego-panel")],p);export{p as LegoPanel,ie as accountCall,Ve as displayName,I as isNamed,Be as ownershipCall,We as refreshCall,Ie as syncedAgo};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
