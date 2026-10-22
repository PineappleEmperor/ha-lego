var Ae=Object.defineProperty;var Se=Object.getOwnPropertyDescriptor;var g=(i,e,t,s)=>{for(var r=s>1?void 0:s?Se(e,t):e,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(e,t,r):n(r))||r);return s&&r&&Ae(e,t,r),r};var D=globalThis,q=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),oe=new WeakMap,k=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(q&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=oe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&oe.set(t,e))}return e}toString(){return this.cssText}},ne=i=>new k(typeof i=="string"?i:i+"",void 0,V),F=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new k(t,i,V)},ae=(i,e)=>{if(q)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),r=D.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},K=q?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ne(t)})(i):i;var{is:Ee,defineProperty:Ce,getOwnPropertyDescriptor:ke,getOwnPropertyNames:Re,getOwnPropertySymbols:Te,getPrototypeOf:ze}=Object,L=globalThis,le=L.trustedTypes,Oe=le?le.emptyScript:"",Ue=L.reactiveElementPolyfillSupport,R=(i,e)=>i,T={toAttribute(i,e){switch(e){case Boolean:i=i?Oe:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},j=(i,e)=>!Ee(i,e),ce={attribute:!0,type:String,converter:T,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ce){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&Ce(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){let{get:r,set:o}=ke(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:r,set(n){let l=r?.call(this);o?.call(this,n),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ce}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let e=ze(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let t=this.properties,s=[...Re(t),...Te(t)];for(let r of s)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let r of s)t.unshift(K(r))}else e!==void 0&&t.push(K(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ae(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:T).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){let s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:T;this._$Em=r;let l=n.fromAttribute(t,o.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(e,t,s,r=!1,o){if(e!==void 0){let n=this.constructor;if(r===!1&&(o=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??j)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[R("elementProperties")]=new Map,_[R("finalized")]=new Map,Ue?.({ReactiveElement:_}),(L.reactiveElementVersions??=[]).push("2.1.2");var ee=globalThis,he=i=>i,B=ee.trustedTypes,de=B?B.createPolicy("lit-html",{createHTML:i=>i}):void 0,ve="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,_e="?"+b,Pe=`<${_e}>`,A=document,O=()=>A.createComment(""),U=i=>i===null||typeof i!="object"&&typeof i!="function",te=Array.isArray,Ne=i=>te(i)||typeof i?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pe=/-->/g,ue=/>/g,x=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ge=/'/g,me=/"/g,$e=/^(?:script|style|textarea|title)$/i,se=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),c=se(1),Ze=se(2),Xe=se(3),S=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),fe=new WeakMap,w=A.createTreeWalker(A,129);function be(i,e){if(!te(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return de!==void 0?de.createHTML(e):e}var Me=(i,e)=>{let t=i.length-1,s=[],r,o=e===2?"<svg>":e===3?"<math>":"",n=z;for(let l=0;l<t;l++){let a=i[l],u,m,h=-1,v=0;for(;v<a.length&&(n.lastIndex=v,m=n.exec(a),m!==null);)v=n.lastIndex,n===z?m[1]==="!--"?n=pe:m[1]!==void 0?n=ue:m[2]!==void 0?($e.test(m[2])&&(r=RegExp("</"+m[2],"g")),n=x):m[3]!==void 0&&(n=x):n===x?m[0]===">"?(n=r??z,h=-1):m[1]===void 0?h=-2:(h=n.lastIndex-m[2].length,u=m[1],n=m[3]===void 0?x:m[3]==='"'?me:ge):n===me||n===ge?n=x:n===pe||n===ue?n=z:(n=x,r=void 0);let $=n===x&&i[l+1].startsWith("/>")?" ":"";o+=n===z?a+Pe:h>=0?(s.push(u),a.slice(0,h)+ve+a.slice(h)+b+$):a+b+(h===-2?l:$)}return[be(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},P=class i{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let o=0,n=0,l=e.length-1,a=this.parts,[u,m]=Me(e,t);if(this.el=i.createElement(u,s),w.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=w.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let h of r.getAttributeNames())if(h.endsWith(ve)){let v=m[n++],$=r.getAttribute(h).split(b),H=/([.?@])?(.*)/.exec(v);a.push({type:1,index:o,name:H[2],strings:$,ctor:H[1]==="."?Y:H[1]==="?"?G:H[1]==="@"?Z:C}),r.removeAttribute(h)}else h.startsWith(b)&&(a.push({type:6,index:o}),r.removeAttribute(h));if($e.test(r.tagName)){let h=r.textContent.split(b),v=h.length-1;if(v>0){r.textContent=B?B.emptyScript:"";for(let $=0;$<v;$++)r.append(h[$],O()),w.nextNode(),a.push({type:2,index:++o});r.append(h[v],O())}}}else if(r.nodeType===8)if(r.data===_e)a.push({type:2,index:o});else{let h=-1;for(;(h=r.data.indexOf(b,h+1))!==-1;)a.push({type:7,index:o}),h+=b.length-1}o++}}static createElement(e,t){let s=A.createElement("template");return s.innerHTML=e,s}};function E(i,e,t=i,s){if(e===S)return e;let r=s!==void 0?t._$Co?.[s]:t._$Cl,o=U(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,t,s)),s!==void 0?(t._$Co??=[])[s]=r:t._$Cl=r),r!==void 0&&(e=E(i,r._$AS(i,e.values),r,s)),e}var Q=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,r=(e?.creationScope??A).importNode(t,!0);w.currentNode=r;let o=w.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new N(o,o.nextSibling,this,e):a.type===1?u=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(u=new X(o,this,e)),this._$AV.push(u),a=s[++l]}n!==a?.index&&(o=w.nextNode(),n++)}return w.currentNode=A,r}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},N=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),U(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==S&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ne(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&U(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=P.createElement(be(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(t);else{let o=new Q(r,this),n=o.u(this.options);o.p(t),this.T(n),this._$AH=o}}_$AC(e){let t=fe.get(e.strings);return t===void 0&&fe.set(e.strings,t=new P(e)),t}k(e){te(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,r=0;for(let o of e)r===t.length?t.push(s=new i(this.O(O()),this.O(O()),this,this.options)):s=t[r],s._$AI(o),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=he(e).nextSibling;he(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(e,t=this,s,r){let o=this.strings,n=!1;if(o===void 0)e=E(this,e,t,0),n=!U(e)||e!==this._$AH&&e!==S,n&&(this._$AH=e);else{let l=e,a,u;for(e=o[0],a=0;a<o.length-1;a++)u=E(this,l[s+a],t,a),u===S&&(u=this._$AH[a]),n||=!U(u)||u!==this._$AH[a],u===d?e=d:e!==d&&(e+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!r&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Y=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},G=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},Z=class extends C{constructor(e,t,s,r,o){super(e,t,s,r,o),this.type=5}_$AI(e,t=this){if((e=E(this,e,t,0)??d)===S)return;let s=this._$AH,r=e===d&&s!==d||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==d&&(s===d||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},X=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var He=ee.litHtmlPolyfillSupport;He?.(P,N),(ee.litHtmlVersions??=[]).push("3.3.3");var ye=(i,e,t)=>{let s=t?.renderBefore??e,r=s._$litPart$;if(r===void 0){let o=t?.renderBefore??null;s._$litPart$=r=new N(e.insertBefore(O(),o),o,void 0,t??{})}return r._$AI(i),r};var re=globalThis,y=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ye(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};y._$litElement$=!0,y.finalized=!0,re.litElementHydrateSupport?.({LitElement:y});var De=re.litElementPolyfillSupport;De?.({LitElement:y});(re.litElementVersions??=[]).push("4.2.2");var xe=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};var qe={attribute:!0,type:String,converter:T,reflect:!1,hasChanged:j},Le=(i=qe,e,t)=>{let{kind:s,metadata:r}=t,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(t.name,i),s==="accessor"){let{name:n}=t;return{set(l){let a=e.get.call(this);e.set.call(this,l),this.requestUpdate(n,a,i,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){let{name:n}=t;return function(l){let a=this[n];e.call(this,l),this.requestUpdate(n,a,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function M(i){return(e,t)=>typeof t=="object"?Le(i,e,t):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,e,t)}function f(i){return M({...i,state:!0,attribute:!1})}var je="{?}";function Be(i,e){return{device_id:i,set_number:e.set_number,owned:!e.owned}}function We(i){return{device_id:i}}function ie(i,e){return e?{type:i,config_entry_id:e}:{type:i}}function Ie(i,e){if(!i)return"Not synced yet";let t=Math.floor((e.getTime()-new Date(i).getTime())/6e4);if(t<1)return"Updated just now";let s=new Intl.RelativeTimeFormat("en",{numeric:"always"});if(t<60)return`Updated ${s.format(-t,"minute")}`;let r=Math.floor(t/60);return r<48?`Updated ${s.format(-r,"hour")}`:`Updated ${s.format(-Math.floor(r/24),"day")}`}function I(i){let e=(i.name??"").trim();return e!==""&&e!==je}function Ve(i){return I(i)?i.name:"Name tbd"}var Fe="/lego_panel/icon.png",we={themes:"New in my themes",wishlist:"Your wishlist",collection:"Your collection"},p=class extends y{constructor(){super(...arguments);this.narrow=!1;this._tab="home";this._refreshing=!1;this._refreshError="";this._writeError="";this._theme="";this._error="";this._collection=[];this._query="";this._results=[];this._dragging="";this._accounts=[];this._account=""}connectedCallback(){super.connectedCallback(),this._load()}async _refreshCollection(){this._refreshing=!0,this._refreshError="";try{await this.hass.callService("lego","refresh_collection",We(this._dash?.device_id??"")),await this._load()}catch(t){this._refreshError=t instanceof Error?t.message:String(t)}finally{this._refreshing=!1}}async _selectAccount(t){if(t!==this._account){this._account=t,this._collection=[],this._results=[],this._query="",this._theme="",await this._load(),this._tab==="collection"&&await this._loadCollection();try{await this.hass.callWS({type:"lego/account/set",config_entry_id:t})}catch{}}}async _load(){try{if(!this._accounts.length){let s=await this.hass.callWS({type:"lego/accounts"});this._accounts=s.accounts,this._account=s.selected??""}let t=await this.hass.callWS(ie("lego/dashboard",this._account));this._dash=t,this._error="",(!this._theme||!(this._theme in t.themes))&&(this._theme=Object.keys(t.themes)[0]??"")}catch(t){this._error=t instanceof Error?t.message:String(t)}}async _loadCollection(){if(!this._collection.length)try{let t=await this.hass.callWS({...ie("lego/collection",this._account),filter:"owned"});this._collection=t.sets}catch(t){this._error=t instanceof Error?t.message:String(t)}}async _search(t){if(this._query=t,t.trim().length<2){this._results=[];return}try{let s=await this.hass.callWS({...ie("lego/search",this._account),query:t,limit:24});this._results=s.sets}catch{this._results=[]}}async _toggleOwned(t){this._writeError="";try{await this.hass.callService("lego","set_collection",Be(this._dash?.device_id??"",t))}catch(s){this._writeError=s instanceof Error?s.message:String(s);return}this._collection=[],await this._load(),this._tab==="collection"&&await this._loadCollection()}async _saveRows(t){if(this._dash){this._dash={...this._dash,rows:t};try{await this.hass.callWS({type:"lego/panel_config/set",rows:t})}catch{}}}_onDrop(t){let s=[...this._dash?.rows??[]],r=s.indexOf(this._dragging),o=s.indexOf(t);this._dragging="",!(r<0||o<0||r===o)&&(s.splice(o,0,...s.splice(r,1)),this._saveRows(s))}render(){return c`
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
        ${this._writeError?c`<p class="error" role="alert">
              Brickset would not save that change: ${this._writeError}
            </p>`:d}
        ${this._error?c`<p class="error" role="alert">${this._error}</p>`:this._tab==="home"?this._renderHome():this._renderCollection()}
      </div>
    `}_renderAccounts(){return this._accounts.length<2?d:c`
      <select
        class="account"
        aria-label="Brickset account"
        @change=${t=>{this._selectAccount(t.target.value)}}
      >
        ${this._accounts.map(t=>c`
            <option
              value=${t.entry_id}
              ?selected=${t.entry_id===this._account}
            >
              ${t.name}
            </option>
          `)}
      </select>
    `}_renderHome(){return this._dash?c`
      <div class="rows">
        ${this._dash.rows.map(t=>this._renderRow(t))}
      </div>
    `:c`<p class="muted">Loading your collection…</p>`}_renderRow(t){let s=t==="themes"?this._renderThemes():t==="wishlist"?this._renderWishlist():this._renderStats();return c`
      <section
        class=${this._dragging===t?"row dragging":"row"}
        @dragover=${r=>r.preventDefault()}
        @drop=${()=>this._onDrop(t)}
      >
        <div class="rowhead">
          <button
            class="drag"
            draggable="true"
            title="Drag to reorder"
            aria-label=${`Reorder ${we[t]}`}
            @dragstart=${()=>this._dragging=t}
            @dragend=${()=>this._dragging=""}
          >
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
          <h2>${we[t]}</h2>
        </div>
        ${s}
      </section>
    `}_renderThemes(){let t=Object.keys(this._dash?.themes??{});if(!t.length)return c`<p class="muted">
        No themes followed yet. Add one in the integration options to see new
        releases here.
      </p>`;let s=this._dash?.themes[this._theme]??[];return c`
      <div class="chips">
        ${t.map(r=>c`
            <button
              class=${r===this._theme?"chip on":"chip"}
              @click=${()=>this._theme=r}
            >
              ${r}
            </button>
          `)}
      </div>
      ${this._carousel(s,"No new sets in this theme.")}
    `}_renderWishlist(){return this._carousel(this._dash?.wishlist??[],"Nothing on your wishlist. Mark a set as wanted to see it here.")}_renderRefresh(){let t=this._dash?.quota;if(!t)return c``;let s=t.refresh_cost,r=t.remaining<s,o=!r&&t.remaining<=s*3;return c`
      <div class="refresh">
        <button
          class="refreshbtn"
          ?disabled=${this._refreshing||r}
          @click=${()=>{this._refreshCollection()}}
        >
          <ha-icon
            icon=${this._refreshing?"mdi:sync":"mdi:cloud-sync"}
          ></ha-icon>
          ${this._refreshing?"Updating\u2026":"Update now"}
        </button>
        <span
          class="quota ${r?"bad":o?"warn":""}"
          title=${this._dash?.last_synced?new Date(this._dash.last_synced).toLocaleString():d}
        >
          ${Ie(this._dash?.last_synced??null,new Date)}.
          ${r?c`Daily budget spent, ${t.calls_today} of ${t.budget}
              used, so this is the last sync's data. Updates resume at
              ${new Date(t.resets_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}.`:c`Costs ${s} of ${t.remaining} calls left today.`}
        </span>
      </div>
      ${this._refreshError?c`<p class="caveat bad">${this._refreshError}</p>`:d}
    `}_renderStats(){let t=this._dash?.stats;if(!t)return c``;let s=[[this._num(t.sets_owned),"Sets owned"],[this._num(t.sets_distinct),"Distinct sets"],[this._num(t.pieces_owned),"Pieces"],[this._num(t.minifigs_owned),"Minifigures"],[this._num(Math.round(t.value)),"Value at RRP"]];return c`
      <div class="stats">
        ${s.map(([r,o])=>c`
            <div class="stat">
              <span class="n">${r}</span><span class="l">${o}</span>
            </div>
          `)}
      </div>
      ${this._renderRefresh()}
      ${t.sets_missing_price?c`<p class="caveat">
            ${this._num(t.sets_missing_price)} sets have no published price
            and are not counted in the value.
          </p>`:d}
      <button
        class="link"
        @click=${()=>{this._tab="collection",this._loadCollection()}}
      >
        Browse all sets ›
      </button>
    `}_renderCollection(){let t=this._query.trim().length>=2?this._results:this._collection;return c`
      <div class="rows">
        <section class="row">
          <input
            class="search"
            type="search"
            .value=${this._query}
            placeholder="Search your sets and the full catalogue…"
            aria-label="Search sets"
            @input=${s=>{this._search(s.target.value)}}
          />
          ${this._query.trim().length>=2?c`<p class="muted">${t.length} matching sets</p>`:c`<p class="muted">${t.length} sets owned</p>`}
          <div class="grid">${t.map(s=>this._card(s))}</div>
        </section>
      </div>
    `}_carousel(t,s){return t.length?c`<div class="carousel">
      ${t.map(r=>this._card(r))}
    </div>`:c`<p class="muted">${s}</p>`}_card(t){return c`
      <article class="card">
        ${t.image?c`<img src=${t.image} alt="" loading="lazy" />`:c`<img
              class="noart"
              src=${Fe}
              alt=""
              loading="lazy"
            />`}
        <div class="meta">
          <span
            class=${I(t)?"name":"name unnamed"}
            title=${I(t)?t.name:"Brickset has not published a name yet"}
            >${Ve(t)}</span
          >
          <span class="num">${t.set_number}</span>
          <span class="when">${this._when(t)}</span>
          <div class="foot">
            <span
              class=${t.owned?"state own":t.wanted?"state want":"state"}
            >
              ${t.owned?t.qty_owned>1?`Owned \xD7${t.qty_owned}`:"Owned":t.wanted?"Wanted":t.year||""}
            </span>
            <button
              class=${t.owned?"act on":"act"}
              title=${t.owned?"Remove from your collection":"Add to your collection"}
              aria-label=${t.owned?"Remove from your collection":"Add to your collection"}
              @click=${()=>{this._toggleOwned(t)}}
            >
              <ha-icon icon=${t.owned?"mdi:check":"mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `}_when(t){return t.available_until?`Retires ${this._date(t.available_until)}`:t.available_from?`Out ${this._date(t.available_from)}`:I(t)?"Date unknown":"Details tbd"}_date(t){let s=new Date(t);return Number.isNaN(s.getTime())?t:s.toLocaleDateString(this.hass?.locale?.language??void 0,{day:"numeric",month:"short",year:"numeric"})}_num(t){return t.toLocaleString(this.hass?.locale?.language??void 0)}};p.styles=F`
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
