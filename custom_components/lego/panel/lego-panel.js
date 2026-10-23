var ke=Object.defineProperty;var Ce=Object.getOwnPropertyDescriptor;var u=(i,t,e,r)=>{for(var s=r>1?void 0:r?Ce(t,e):t,o=i.length-1,a;o>=0;o--)(a=i[o])&&(s=(r?a(t,e,s):a(s))||s);return r&&s&&ke(t,e,s),s};var H=globalThis,q=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol(),ae=new WeakMap,C=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==K)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(q&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=ae.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ae.set(e,t))}return t}toString(){return this.cssText}},ne=i=>new C(typeof i=="string"?i:i+"",void 0,K),F=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new C(e,i,K)},le=(i,t)=>{if(q)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),s=H.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Y=q?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return ne(e)})(i):i;var{is:Re,defineProperty:Te,getOwnPropertyDescriptor:ze,getOwnPropertyNames:Oe,getOwnPropertySymbols:De,getPrototypeOf:Pe}=Object,L=globalThis,ce=L.trustedTypes,Ue=ce?ce.emptyScript:"",Ne=L.reactiveElementPolyfillSupport,R=(i,t)=>i,T={toAttribute(i,t){switch(t){case Boolean:i=i?Ue:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},j=(i,t)=>!Re(i,t),he={attribute:!0,type:String,converter:T,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=he){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Te(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){let{get:s,set:o}=ze(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:s,set(a){let l=s?.call(this);o?.call(this,a),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??he}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let t=Pe(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let e=this.properties,r=[...Oe(e),...De(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(Y(s))}else t!==void 0&&e.push(Y(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return le(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:T).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let o=r.getPropertyOptions(s),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:T;this._$Em=s;let l=a.fromAttribute(e,o.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,r,s=!1,o){if(t!==void 0){let a=this.constructor;if(s===!1&&(o=this[t]),r??=a.getPropertyOptions(t),!((r.hasChanged??j)(o,e)||r.useDefault&&r.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:o},a){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,o]of r){let{wrapped:a}=o,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[R("elementProperties")]=new Map,_[R("finalized")]=new Map,Ne?.({ReactiveElement:_}),(L.reactiveElementVersions??=[]).push("2.1.2");var te=globalThis,de=i=>i,B=te.trustedTypes,pe=B?B.createPolicy("lit-html",{createHTML:i=>i}):void 0,_e="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,be="?"+$,Me=`<${be}>`,A=document,O=()=>A.createComment(""),D=i=>i===null||typeof i!="object"&&typeof i!="function",re=Array.isArray,He=i=>re(i)||typeof i?.[Symbol.iterator]=="function",G=`[ 	
\f\r]`,z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ue=/-->/g,ge=/>/g,w=RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),me=/'/g,fe=/"/g,$e=/^(?:script|style|textarea|title)$/i,se=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),c=se(1),it=se(2),ot=se(3),S=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ve=new WeakMap,x=A.createTreeWalker(A,129);function ye(i,t){if(!re(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return pe!==void 0?pe.createHTML(t):t}var qe=(i,t)=>{let e=i.length-1,r=[],s,o=t===2?"<svg>":t===3?"<math>":"",a=z;for(let l=0;l<e;l++){let n=i[l],g,f,d=-1,v=0;for(;v<n.length&&(a.lastIndex=v,f=a.exec(n),f!==null);)v=a.lastIndex,a===z?f[1]==="!--"?a=ue:f[1]!==void 0?a=ge:f[2]!==void 0?($e.test(f[2])&&(s=RegExp("</"+f[2],"g")),a=w):f[3]!==void 0&&(a=w):a===w?f[0]===">"?(a=s??z,d=-1):f[1]===void 0?d=-2:(d=a.lastIndex-f[2].length,g=f[1],a=f[3]===void 0?w:f[3]==='"'?fe:me):a===fe||a===me?a=w:a===ue||a===ge?a=z:(a=w,s=void 0);let b=a===w&&i[l+1].startsWith("/>")?" ":"";o+=a===z?n+Me:d>=0?(r.push(g),n.slice(0,d)+_e+n.slice(d)+$+b):n+$+(d===-2?l:b)}return[ye(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},P=class i{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,a=0,l=t.length-1,n=this.parts,[g,f]=qe(t,e);if(this.el=i.createElement(g,r),x.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=x.nextNode())!==null&&n.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(_e)){let v=f[a++],b=s.getAttribute(d).split($),M=/([.?@])?(.*)/.exec(v);n.push({type:1,index:o,name:M[2],strings:b,ctor:M[1]==="."?Q:M[1]==="?"?X:M[1]==="@"?Z:k}),s.removeAttribute(d)}else d.startsWith($)&&(n.push({type:6,index:o}),s.removeAttribute(d));if($e.test(s.tagName)){let d=s.textContent.split($),v=d.length-1;if(v>0){s.textContent=B?B.emptyScript:"";for(let b=0;b<v;b++)s.append(d[b],O()),x.nextNode(),n.push({type:2,index:++o});s.append(d[v],O())}}}else if(s.nodeType===8)if(s.data===be)n.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf($,d+1))!==-1;)n.push({type:7,index:o}),d+=$.length-1}o++}}static createElement(t,e){let r=A.createElement("template");return r.innerHTML=t,r}};function E(i,t,e=i,r){if(t===S)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl,o=D(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=E(i,s._$AS(i,t.values),s,r)),t}var J=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??A).importNode(e,!0);x.currentNode=s;let o=x.nextNode(),a=0,l=0,n=r[0];for(;n!==void 0;){if(a===n.index){let g;n.type===2?g=new U(o,o.nextSibling,this,t):n.type===1?g=new n.ctor(o,n.name,n.strings,this,t):n.type===6&&(g=new ee(o,this,t)),this._$AV.push(g),n=r[++l]}a!==n?.index&&(o=x.nextNode(),a++)}return x.currentNode=A,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},U=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),D(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):He(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&D(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=P.createElement(ye(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{let o=new J(s,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=ve.get(t.strings);return e===void 0&&ve.set(t.strings,e=new P(t)),e}k(t){re(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let o of t)s===e.length?e.push(r=new i(this.O(O()),this.O(O()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=de(t).nextSibling;de(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},k=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=h}_$AI(t,e=this,r,s){let o=this.strings,a=!1;if(o===void 0)t=E(this,t,e,0),a=!D(t)||t!==this._$AH&&t!==S,a&&(this._$AH=t);else{let l=t,n,g;for(t=o[0],n=0;n<o.length-1;n++)g=E(this,l[r+n],e,n),g===S&&(g=this._$AH[n]),a||=!D(g)||g!==this._$AH[n],g===h?t=h:t!==h&&(t+=(g??"")+o[n+1]),this._$AH[n]=g}a&&!s&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Q=class extends k{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},X=class extends k{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},Z=class extends k{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??h)===S)return;let r=this._$AH,s=t===h&&r!==h||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==h&&(r===h||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ee=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var Le=te.litHtmlPolyfillSupport;Le?.(P,U),(te.litHtmlVersions??=[]).push("3.3.3");var we=(i,t,e)=>{let r=e?.renderBefore??t,s=r._$litPart$;if(s===void 0){let o=e?.renderBefore??null;r._$litPart$=s=new U(t.insertBefore(O(),o),o,void 0,e??{})}return s._$AI(i),s};var ie=globalThis,y=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=we(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};y._$litElement$=!0,y.finalized=!0,ie.litElementHydrateSupport?.({LitElement:y});var je=ie.litElementPolyfillSupport;je?.({LitElement:y});(ie.litElementVersions??=[]).push("4.2.2");var xe=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var Be={attribute:!0,type:String,converter:T,reflect:!1,hasChanged:j},We=(i=Be,t,e)=>{let{kind:r,metadata:s}=e,o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),r==="accessor"){let{name:a}=e;return{set(l){let n=t.get.call(this);t.set.call(this,l),this.requestUpdate(a,n,i,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,i,l),l}}}if(r==="setter"){let{name:a}=e;return function(l){let n=this[a];t.call(this,l),this.requestUpdate(a,n,i,!0,l)}}throw Error("Unsupported decorator location: "+r)};function N(i){return(t,e)=>typeof e=="object"?We(i,t,e):((r,s,o)=>{let a=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),a?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}function m(i){return N({...i,state:!0,attribute:!1})}var Ie="{?}";function Ve(i,t){return{device_id:i,set_number:t.set_number,owned:!t.owned}}function Ke(i){return{device_id:i}}function oe(i,t){return t?{type:i,config_entry_id:t}:{type:i}}function Fe(i,t){if(!i)return"Not synced yet";let e=Math.floor((t.getTime()-new Date(i).getTime())/6e4);if(e<1)return"Updated just now";let r=new Intl.RelativeTimeFormat("en",{numeric:"always"});if(e<60)return`Updated ${r.format(-e,"minute")}`;let s=Math.floor(e/60);return s<48?`Updated ${r.format(-s,"hour")}`:`Updated ${r.format(-Math.floor(s/24),"day")}`}function Ae(i,t,e,r=!1){return i==null||!t?"":new Intl.NumberFormat(e,{style:"currency",currency:t,...r?{maximumFractionDigits:0}:{}}).format(i)}function I(i){return i instanceof Error?i.message:i&&typeof i=="object"&&"message"in i?String(i.message):String(i)}function Se(i,t,e){return`${i.toLocaleString()} ${i===1?t:e}`}var Ye=60;function Ge(i,t){if(i.available_until){let e=new Date(i.available_until).getTime();return e<t.getTime()?"retired":(e-t.getTime())/864e5<=Ye?"retiring":""}return i.available_from&&new Date(i.available_from)>t?"due":""}function Je(i,t,e){return i.available_until?`${new Date(i.available_until)<t?"Retired":"Retires"} ${e(i.available_until)}`:i.available_from?`${new Date(i.available_from)>t?"Due":"Out"} ${e(i.available_from)}`:V(i)?"Date unknown":"Details tbd"}function V(i){let t=(i.name??"").trim();return t!==""&&t!==Ie}function Qe(i){return V(i)?i.name:"Name tbd"}var Xe="/lego_panel/icon.png",Ee={themes:"New in my themes",wishlist:"Your wishlist",collection:"Your collection"},p=class extends y{constructor(){super(...arguments);this.narrow=!1;this._tab="home";this._refreshing=!1;this._refreshError="";this._writeError="";this._theme="";this._error="";this._collection=[];this._query="";this._results=[];this._dragging="";this._over="";this._pending=new Set;this._collectionError="";this._accounts=[];this._account=""}connectedCallback(){super.connectedCallback(),this._load()}async _refreshCollection(){this._refreshing=!0,this._refreshError="";try{await this.hass.callService("lego","refresh_collection",Ke(this._dash?.device_id??"")),await this._load()}catch(e){this._refreshError=I(e)}finally{this._refreshing=!1}}async _selectAccount(e){if(e!==this._account){this._account=e,this._collection=[],this._results=[],this._query="",this._theme="",await this._load(),this._tab==="collection"&&await this._loadCollection();try{await this.hass.callWS({type:"lego/account/set",config_entry_id:e})}catch{}}}async _load(){try{if(!this._accounts.length){let r=await this.hass.callWS({type:"lego/accounts"});this._accounts=r.accounts,this._account=r.selected??""}let e=await this.hass.callWS(oe("lego/dashboard",this._account));this._dash=e,this._error="",(!this._theme||!(this._theme in e.themes))&&(this._theme=Object.keys(e.themes)[0]??"")}catch(e){this._error=I(e)}}async _loadCollection(){if(!this._collection.length)try{let e=await this.hass.callWS({...oe("lego/collection",this._account),filter:"owned"});this._collection=e.sets,this._collectionError=""}catch(e){this._collectionError=I(e)}}async _search(e){if(this._query=e,e.trim().length<2){this._results=[];return}try{let r=await this.hass.callWS({...oe("lego/search",this._account),query:e,limit:24});this._results=r.sets}catch{this._results=[]}}_setPending(e,r){let s=new Set(this._pending);r?s.add(e):s.delete(e),this._pending=s}async _toggleOwned(e){if(!this._pending.has(e.set_number)){this._writeError="",this._setPending(e.set_number,!0);try{await this.hass.callService("lego","set_collection",Ve(this._dash?.device_id??"",e))}catch(r){this._writeError=I(r);return}finally{this._setPending(e.set_number,!1)}this._collection=[],await this._load(),this._tab==="collection"&&await this._loadCollection()}}async _saveRows(e){if(this._dash){this._dash={...this._dash,rows:e};try{await this.hass.callWS({type:"lego/panel_config/set",rows:e})}catch{}}}_onDrop(e){let r=[...this._dash?.rows??[]],s=r.indexOf(this._dragging),o=r.indexOf(e);this._dragging="",this._over="",!(s<0||o<0||s===o)&&(r.splice(o,0,...r.splice(s,1)),this._saveRows(r))}_onHandleKey(e,r){let s=e.key==="ArrowUp"?-1:e.key==="ArrowDown"?1:0;if(!s)return;e.preventDefault();let o=[...this._dash?.rows??[]],a=o.indexOf(r),l=a+s;a<0||l<0||l>=o.length||(o.splice(l,0,...o.splice(a,1)),this._saveRows(o),this.updateComplete.then(()=>this.renderRoot.querySelector(`.drag[data-row="${r}"]`)?.focus()))}render(){return c`
      <div class="app">
        <header>
          <div class="bar">
            <div class="title">
              ${this.narrow?c`<ha-menu-button
                    .hass=${this.hass}
                    .narrow=${this.narrow}
                  ></ha-menu-button>`:h}
              <h1>LEGO</h1>
            </div>
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
        ${this._error?this._renderError(this._error,()=>{this._load()}):this._tab==="home"?this._renderHome():this._renderCollection()}
        ${this._writeError?c`<div class="toast" role="alert">
              <span
                >Brickset would not save that change: ${this._writeError}</span
              >
              <button
                class="dismiss"
                aria-label="Dismiss"
                @click=${()=>this._writeError=""}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>`:h}
      </div>
    `}_renderError(e,r){return c`<div class="error" role="alert">
      <p>${e}</p>
      <button class="link" @click=${r}>Try again</button>
    </div>`}_renderAccounts(){return this._accounts.length<2?h:c`
      <select
        class="account"
        aria-label="Brickset account"
        @change=${e=>{this._selectAccount(e.target.value)}}
      >
        ${this._accounts.map(e=>c`
            <option
              value=${e.entry_id}
              ?selected=${e.entry_id===this._account}
            >
              ${e.name}
            </option>
          `)}
      </select>
    `}_renderHome(){return this._dash?c`
      <div class="rows">
        ${this._dash.rows.map(e=>this._renderRow(e))}
      </div>
    `:c`<p class="muted">Loading your collection…</p>`}_renderRow(e){let r=e==="themes"?this._renderThemes():e==="wishlist"?this._renderWishlist():this._renderStats();return c`
      <section
        class=${this._dragging===e?"row dragging":this._dragging&&this._over===e?"row over":"row"}
        @dragover=${s=>s.preventDefault()}
        @dragenter=${()=>this._over=e}
        @drop=${()=>this._onDrop(e)}
      >
        <div class="rowhead">
          <h2>${Ee[e]}</h2>
          <button
            class="drag"
            data-row=${e}
            draggable="true"
            title="Drag, or use the arrow keys, to reorder"
            aria-label=${`Move ${Ee[e]} up or down`}
            @dragstart=${()=>this._dragging=e}
            @dragend=${()=>{this._dragging="",this._over=""}}
            @keydown=${s=>this._onHandleKey(s,e)}
          >
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
        </div>
        ${r}
      </section>
    `}_renderThemes(){let e=Object.keys(this._dash?.themes??{});if(!e.length)return c`<p class="muted">
        No themes followed yet. Add one in the integration options to see new
        releases here.
      </p>`;let r=this._dash?.themes[this._theme]??[];return c`
      <div class="chips">
        ${e.map(s=>c`
            <button
              class=${s===this._theme?"chip on":"chip"}
              @click=${()=>this._theme=s}
            >
              ${s}
            </button>
          `)}
      </div>
      ${this._carousel(r,"No new sets in this theme.")}
    `}_renderWishlist(){return this._carousel(this._dash?.wishlist??[],"Nothing on your wishlist. Mark a set as wanted to see it here.")}_renderRefresh(){let e=this._dash?.quota;if(!e)return c``;let r=e.refresh_cost,s=e.remaining<r,o=!s&&e.remaining<=r*3;return c`
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
          class="quota ${s||o?"warn":""}"
          title=${this._dash?.last_synced?new Date(this._dash.last_synced).toLocaleString():h}
        >
          ${Fe(this._dash?.last_synced??null,new Date)}.
          ${s?c`Daily budget spent, ${e.calls_today} of ${e.budget}
              used, so this is the last sync's data. Updates resume
              ${this._resumes(e.resets_at)}.`:c`Costs ${r} of ${e.remaining} calls left today.`}
        </span>
      </div>
      ${this._refreshError?c`<p class="caveat bad">${this._refreshError}</p>`:h}
    `}_resumes(e){let r=new Date(e),s=r.toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"});return r.toDateString()===new Date().toDateString()?`at ${s}`:`tomorrow at ${s}`}_renderStats(){let e=this._dash?.stats;if(!e)return c``;let r=[[this._num(e.sets_owned),"Sets owned"],[this._num(e.sets_distinct),"Distinct sets"],[this._num(e.pieces_owned),"Pieces"],[this._num(e.minifigs_owned),"Minifigures"],[Ae(e.value,this._dash?.currency??null,this.hass?.locale?.language,!0)||this._num(Math.round(e.value)),"Value at RRP"]];return c`
      <div class="stats">
        ${r.map(([s,o])=>c`
            <div class="stat">
              <span class="n">${s}</span><span class="l">${o}</span>
            </div>
          `)}
      </div>
      ${this._renderRefresh()}
      ${e.sets_missing_price?c`<p class="caveat">
            ${e.sets_missing_price===1?"1 set has no published price and is not counted in the value.":`${this._num(e.sets_missing_price)} sets have no published
                price and are not counted in the value.`}
          </p>`:h}
      <button
        class="link"
        @click=${()=>{this._tab="collection",this._loadCollection()}}
      >
        Browse all sets ›
      </button>
    `}_renderCollection(){let e=this._query.trim().length>=2?this._results:this._collection;return c`
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
          ${this._collectionError&&this._query.trim().length<2?this._renderError(this._collectionError,()=>{this._collectionError="",this._loadCollection()}):c`<p class="muted count">
                  ${this._query.trim().length>=2?Se(e.length,"matching set","matching sets"):Se(e.length,"set owned","sets owned")}
                </p>
                <div class="grid">
                  ${e.map(r=>this._card(r))}
                </div>`}
        </section>
      </div>
    `}_carousel(e,r){return e.length?c`<div class="carousel">
      ${e.map(s=>this._card(s))}
    </div>`:c`<p class="muted">${r}</p>`}_linked(e,r,s=!1){return e.url?c`<a
      class="open"
      href=${e.url}
      target="_blank"
      rel="noopener noreferrer"
      tabindex=${s?"-1":h}
      aria-hidden=${s?"true":h}
      >${r}</a
    >`:r}_card(e){return c`
      <article class="card">
        ${this._linked(e,e.image?c`<img src=${e.image} alt="" loading="lazy" />`:c`<img
                class="noart"
                src=${Xe}
                alt=""
                loading="lazy"
              />`,!0)}
        <div class="meta">
          ${this._linked(e,c`<span
              class=${V(e)?"name":"name unnamed"}
              title=${V(e)?e.name:"Brickset has not published a name yet"}
              >${Qe(e)}</span
            >`)}
          <span class="num"
            >${[e.set_number,Ae(e.retail_price,this._dash?.currency??null,this.hass?.locale?.language)].filter(Boolean).join(" \xB7 ")}</span
          >
          <span class="when ${Ge(e,new Date)}"
            >${Je(e,new Date,r=>this._date(r))}</span
          >
          <div class="foot">
            <span
              class=${e.owned?"state own":e.wanted?"state want":"state"}
            >
              ${e.owned?e.qty_owned>1?`Owned \xD7${e.qty_owned}`:"Owned":e.wanted?"Wanted":""}
            </span>
            <button
              class=${["act",e.owned?"on":"",this._pending.has(e.set_number)?"pending":""].join(" ")}
              ?disabled=${this._pending.has(e.set_number)}
              title=${e.owned?"Remove from your collection":"Add to your collection"}
              aria-label=${e.owned?"Remove from your collection":"Add to your collection"}
              @click=${()=>{this._toggleOwned(e)}}
            >
              <ha-icon icon=${e.owned?"mdi:check":"mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `}_date(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:r.toLocaleDateString(this.hass?.locale?.language??void 0,{day:"numeric",month:"short",year:"numeric"})}_num(e){return e.toLocaleString(this.hass?.locale?.language??void 0)}};p.styles=F`
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
      --lego-focus: var(--ha-color-focus, var(--primary-color));
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
    .title {
      align-items: center;
      display: flex;
      gap: var(--ha-space-1, 4px);
      min-width: 0;
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
    /* Where a dragged row will land. */
    .row.over {
      box-shadow: inset 0 var(--ha-border-width-md, 2px) 0 var(--lego-primary);
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
      /* Trailing, so the title lines up with the cards below it. */
      margin: calc(-1 * var(--ha-space-3, 12px))
        calc(-1 * var(--ha-space-3, 12px)) calc(-1 * var(--ha-space-3, 12px))
        auto;
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
      display: block;
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
    /* Not out yet: a dot in the primary colour, so the text keeps its contrast. */
    .when.due::before {
      background: var(--lego-primary);
      border-radius: var(--ha-border-radius-circle, 50%);
      content: "";
      display: inline-block;
      height: 8px;
      margin-right: var(--ha-space-1, 4px);
      vertical-align: middle;
      width: 8px;
    }
    .when.retiring {
      color: var(--lego-want);
      font-weight: var(--ha-font-weight-medium, 500);
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
    /* A 48px target drawing a 32px circle, so the card does not look crowded. */
    .act {
      appearance: none;
      background: none;
      border: 0;
      color: var(--lego-text-2);
      cursor: pointer;
      display: grid;
      place-items: center;
      position: relative;
      width: 48px;
      height: 48px;
      padding: 0;
      margin: calc(-1 * var(--ha-space-2, 8px));
      --mdc-icon-size: 18px;
    }
    .act::before {
      content: "";
      position: absolute;
      inset: var(--ha-space-2, 8px);
      border: var(--lego-line) solid var(--lego-text-2);
      border-radius: var(--ha-border-radius-circle, 50%);
    }
    .act ha-icon {
      position: relative;
    }
    .act.on {
      color: var(--lego-on-own-fill);
    }
    .act.on::before {
      background: var(--lego-own-fill);
      border-color: var(--lego-own-fill);
    }
    .act.pending {
      cursor: progress;
      opacity: 0.5;
    }
    .act:focus-visible {
      outline-offset: calc(-1 * var(--ha-space-1, 4px));
    }
    /* Lines drawn per cell, so an odd last cell leaves no grey gap. */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0;
      background: var(--lego-surface);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--lego-radius);
      overflow: hidden;
    }
    .stat {
      background: var(--lego-surface);
      box-shadow: 0 0 0 var(--lego-line) var(--lego-outline);
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
    .error p {
      margin: 0;
    }
    .count {
      margin-bottom: var(--ha-space-3, 12px);
    }
    /* A failed write is shown where it cannot be scrolled out of view. */
    .toast {
      align-items: center;
      background: var(--lego-surface);
      border: var(--lego-line) solid var(--lego-bad);
      border-radius: var(--ha-border-radius-md, 8px);
      bottom: var(--ha-space-4, 16px);
      box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);
      color: var(--lego-bad);
      display: flex;
      gap: var(--ha-space-2, 8px);
      left: 50%;
      max-width: min(560px, calc(100% - 2 * var(--ha-space-4, 16px)));
      padding: var(--ha-space-2, 8px) var(--ha-space-2, 8px)
        var(--ha-space-2, 8px) var(--ha-space-4, 16px);
      position: fixed;
      transform: translateX(-50%);
      width: max-content;
      z-index: 3;
    }
    .dismiss {
      appearance: none;
      background: none;
      border: 0;
      color: inherit;
      cursor: pointer;
      display: grid;
      flex: none;
      min-height: 48px;
      min-width: 48px;
      place-items: center;
    }
    a.open {
      display: block;
      min-width: 0;
      overflow: hidden;
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
  `,u([N({attribute:!1})],p.prototype,"hass",2),u([N({type:Boolean})],p.prototype,"narrow",2),u([m()],p.prototype,"_tab",2),u([m()],p.prototype,"_dash",2),u([m()],p.prototype,"_refreshing",2),u([m()],p.prototype,"_refreshError",2),u([m()],p.prototype,"_writeError",2),u([m()],p.prototype,"_theme",2),u([m()],p.prototype,"_error",2),u([m()],p.prototype,"_collection",2),u([m()],p.prototype,"_query",2),u([m()],p.prototype,"_results",2),u([m()],p.prototype,"_dragging",2),u([m()],p.prototype,"_over",2),u([m()],p.prototype,"_pending",2),u([m()],p.prototype,"_collectionError",2),u([m()],p.prototype,"_accounts",2),u([m()],p.prototype,"_account",2),p=u([xe("lego-panel")],p);export{p as LegoPanel,oe as accountCall,Se as count,Qe as displayName,I as errorText,Ae as formatPrice,V as isNamed,Ve as ownershipCall,Ke as refreshCall,Fe as syncedAgo,Je as whenLabel,Ge as whenTone};
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
