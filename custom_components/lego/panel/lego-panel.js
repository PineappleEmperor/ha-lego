var Ae=Object.defineProperty;var Se=Object.getOwnPropertyDescriptor;var g=(i,e,t,r)=>{for(var s=r>1?void 0:r?Se(e,t):e,o=i.length-1,a;o>=0;o--)(a=i[o])&&(s=(r?a(e,t,s):a(s))||s);return r&&s&&Ae(e,t,s),s};var D=globalThis,q=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),oe=new WeakMap,k=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(q&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=oe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&oe.set(t,e))}return e}toString(){return this.cssText}},ae=i=>new k(typeof i=="string"?i:i+"",void 0,V),K=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((r,s,o)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new k(t,i,V)},ne=(i,e)=>{if(q)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),s=D.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=t.cssText,i.appendChild(r)}},F=q?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return ae(t)})(i):i;var{is:Ee,defineProperty:Ce,getOwnPropertyDescriptor:ke,getOwnPropertyNames:Re,getOwnPropertySymbols:Te,getPrototypeOf:ze}=Object,L=globalThis,le=L.trustedTypes,Oe=le?le.emptyScript:"",Pe=L.reactiveElementPolyfillSupport,R=(i,e)=>i,T={toAttribute(i,e){switch(e){case Boolean:i=i?Oe:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},j=(i,e)=>!Ee(i,e),ce={attribute:!0,type:String,converter:T,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ce){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(e,r,t);s!==void 0&&Ce(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){let{get:s,set:o}=ke(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:s,set(a){let l=s?.call(this);o?.call(this,a),this.requestUpdate(e,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ce}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let e=ze(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let t=this.properties,r=[...Re(t),...Te(t)];for(let s of r)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,s]of t)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let s=this._$Eu(t,r);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let s of r)t.unshift(F(s))}else e!==void 0&&t.push(F(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ne(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(s!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:T).toAttribute(t,r.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){let r=this.constructor,s=r._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let o=r.getPropertyOptions(s),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:T;this._$Em=s;let l=a.fromAttribute(t,o.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(e,t,r,s=!1,o){if(e!==void 0){let a=this.constructor;if(s===!1&&(o=this[e]),r??=a.getPropertyOptions(e),!((r.hasChanged??j)(o,t)||r.useDefault&&r.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:o},a){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),o!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,o]of r){let{wrapped:a}=o,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,o,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[R("elementProperties")]=new Map,_[R("finalized")]=new Map,Pe?.({ReactiveElement:_}),(L.reactiveElementVersions??=[]).push("2.1.2");var ee=globalThis,he=i=>i,B=ee.trustedTypes,de=B?B.createPolicy("lit-html",{createHTML:i=>i}):void 0,ve="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,_e="?"+$,Ue=`<${_e}>`,A=document,O=()=>A.createComment(""),P=i=>i===null||typeof i!="object"&&typeof i!="function",te=Array.isArray,Ne=i=>te(i)||typeof i?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pe=/-->/g,ue=/>/g,x=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ge=/'/g,me=/"/g,be=/^(?:script|style|textarea|title)$/i,re=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),c=re(1),Ye=re(2),Ge=re(3),S=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),fe=new WeakMap,w=A.createTreeWalker(A,129);function $e(i,e){if(!te(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return de!==void 0?de.createHTML(e):e}var Me=(i,e)=>{let t=i.length-1,r=[],s,o=e===2?"<svg>":e===3?"<math>":"",a=z;for(let l=0;l<t;l++){let n=i[l],u,m,h=-1,v=0;for(;v<n.length&&(a.lastIndex=v,m=a.exec(n),m!==null);)v=a.lastIndex,a===z?m[1]==="!--"?a=pe:m[1]!==void 0?a=ue:m[2]!==void 0?(be.test(m[2])&&(s=RegExp("</"+m[2],"g")),a=x):m[3]!==void 0&&(a=x):a===x?m[0]===">"?(a=s??z,h=-1):m[1]===void 0?h=-2:(h=a.lastIndex-m[2].length,u=m[1],a=m[3]===void 0?x:m[3]==='"'?me:ge):a===me||a===ge?a=x:a===pe||a===ue?a=z:(a=x,s=void 0);let b=a===x&&i[l+1].startsWith("/>")?" ":"";o+=a===z?n+Ue:h>=0?(r.push(u),n.slice(0,h)+ve+n.slice(h)+$+b):n+$+(h===-2?l:b)}return[$e(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},U=class i{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let o=0,a=0,l=e.length-1,n=this.parts,[u,m]=Me(e,t);if(this.el=i.createElement(u,r),w.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=w.nextNode())!==null&&n.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let h of s.getAttributeNames())if(h.endsWith(ve)){let v=m[a++],b=s.getAttribute(h).split($),H=/([.?@])?(.*)/.exec(v);n.push({type:1,index:o,name:H[2],strings:b,ctor:H[1]==="."?Y:H[1]==="?"?G:H[1]==="@"?Z:C}),s.removeAttribute(h)}else h.startsWith($)&&(n.push({type:6,index:o}),s.removeAttribute(h));if(be.test(s.tagName)){let h=s.textContent.split($),v=h.length-1;if(v>0){s.textContent=B?B.emptyScript:"";for(let b=0;b<v;b++)s.append(h[b],O()),w.nextNode(),n.push({type:2,index:++o});s.append(h[v],O())}}}else if(s.nodeType===8)if(s.data===_e)n.push({type:2,index:o});else{let h=-1;for(;(h=s.data.indexOf($,h+1))!==-1;)n.push({type:7,index:o}),h+=$.length-1}o++}}static createElement(e,t){let r=A.createElement("template");return r.innerHTML=e,r}};function E(i,e,t=i,r){if(e===S)return e;let s=r!==void 0?t._$Co?.[r]:t._$Cl,o=P(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,t,r)),r!==void 0?(t._$Co??=[])[r]=s:t._$Cl=s),s!==void 0&&(e=E(i,s._$AS(i,e.values),s,r)),e}var Q=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??A).importNode(t,!0);w.currentNode=s;let o=w.nextNode(),a=0,l=0,n=r[0];for(;n!==void 0;){if(a===n.index){let u;n.type===2?u=new N(o,o.nextSibling,this,e):n.type===1?u=new n.ctor(o,n.name,n.strings,this,e):n.type===6&&(u=new X(o,this,e)),this._$AV.push(u),n=r[++l]}a!==n?.index&&(o=w.nextNode(),a++)}return w.currentNode=A,s}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},N=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),P(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==S&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ne(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,s=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=U.createElement($e(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{let o=new Q(s,this),a=o.u(this.options);o.p(t),this.T(a),this._$AH=o}}_$AC(e){let t=fe.get(e.strings);return t===void 0&&fe.set(e.strings,t=new U(e)),t}k(e){te(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,s=0;for(let o of e)s===t.length?t.push(r=new i(this.O(O()),this.O(O()),this,this.options)):r=t[s],r._$AI(o),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=he(e).nextSibling;he(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=d}_$AI(e,t=this,r,s){let o=this.strings,a=!1;if(o===void 0)e=E(this,e,t,0),a=!P(e)||e!==this._$AH&&e!==S,a&&(this._$AH=e);else{let l=e,n,u;for(e=o[0],n=0;n<o.length-1;n++)u=E(this,l[r+n],t,n),u===S&&(u=this._$AH[n]),a||=!P(u)||u!==this._$AH[n],u===d?e=d:e!==d&&(e+=(u??"")+o[n+1]),this._$AH[n]=u}a&&!s&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Y=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},G=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},Z=class extends C{constructor(e,t,r,s,o){super(e,t,r,s,o),this.type=5}_$AI(e,t=this){if((e=E(this,e,t,0)??d)===S)return;let r=this._$AH,s=e===d&&r!==d||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==d&&(r===d||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},X=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var He=ee.litHtmlPolyfillSupport;He?.(U,N),(ee.litHtmlVersions??=[]).push("3.3.3");var ye=(i,e,t)=>{let r=t?.renderBefore??e,s=r._$litPart$;if(s===void 0){let o=t?.renderBefore??null;r._$litPart$=s=new N(e.insertBefore(O(),o),o,void 0,t??{})}return s._$AI(i),s};var se=globalThis,y=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ye(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};y._$litElement$=!0,y.finalized=!0,se.litElementHydrateSupport?.({LitElement:y});var De=se.litElementPolyfillSupport;De?.({LitElement:y});(se.litElementVersions??=[]).push("4.2.2");var xe=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};var qe={attribute:!0,type:String,converter:T,reflect:!1,hasChanged:j},Le=(i=qe,e,t)=>{let{kind:r,metadata:s}=t,o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(t.name,i),r==="accessor"){let{name:a}=t;return{set(l){let n=e.get.call(this);e.set.call(this,l),this.requestUpdate(a,n,i,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,i,l),l}}}if(r==="setter"){let{name:a}=t;return function(l){let n=this[a];e.call(this,l),this.requestUpdate(a,n,i,!0,l)}}throw Error("Unsupported decorator location: "+r)};function M(i){return(e,t)=>typeof t=="object"?Le(i,e,t):((r,s,o)=>{let a=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),a?Object.getOwnPropertyDescriptor(s,o):void 0})(i,e,t)}function f(i){return M({...i,state:!0,attribute:!1})}var je="{?}";function Be(i,e){return{config_entry_id:i,set_number:e.set_number,owned:!e.owned}}function ie(i,e){return e?{type:i,config_entry_id:e}:{type:i}}function I(i){let e=(i.name??"").trim();return e!==""&&e!==je}function We(i){return I(i)?i.name:"Name tbd"}var Ie="/lego_panel/icon.png",we={themes:"New in my themes",wishlist:"Your wishlist",collection:"Your collection"},p=class extends y{constructor(){super(...arguments);this.narrow=!1;this._tab="home";this._refreshing=!1;this._refreshError="";this._writeError="";this._theme="";this._error="";this._collection=[];this._query="";this._results=[];this._dragging="";this._accounts=[];this._account=""}connectedCallback(){super.connectedCallback(),this._load()}async _refreshCollection(){this._refreshing=!0,this._refreshError="";try{await this.hass.callService("lego","refresh_collection",{config_entry_id:this._dash?.entry_id??""}),await this._load()}catch(t){this._refreshError=t instanceof Error?t.message:String(t)}finally{this._refreshing=!1}}async _selectAccount(t){if(t!==this._account){this._account=t,this._collection=[],this._results=[],this._query="",this._theme="",await this._load(),this._tab==="collection"&&await this._loadCollection();try{await this.hass.callWS({type:"lego/account/set",config_entry_id:t})}catch{}}}async _load(){try{if(!this._accounts.length){let r=await this.hass.callWS({type:"lego/accounts"});this._accounts=r.accounts,this._account=r.selected??""}let t=await this.hass.callWS(ie("lego/dashboard",this._account));this._dash=t,this._error="",(!this._theme||!(this._theme in t.themes))&&(this._theme=Object.keys(t.themes)[0]??"")}catch(t){this._error=t instanceof Error?t.message:String(t)}}async _loadCollection(){if(!this._collection.length)try{let t=await this.hass.callWS({...ie("lego/collection",this._account),filter:"owned"});this._collection=t.sets}catch(t){this._error=t instanceof Error?t.message:String(t)}}async _search(t){if(this._query=t,t.trim().length<2){this._results=[];return}try{let r=await this.hass.callWS({...ie("lego/search",this._account),query:t,limit:24});this._results=r.sets}catch{this._results=[]}}async _toggleOwned(t){this._writeError="";try{await this.hass.callService("lego","set_collection",Be(this._dash?.entry_id??"",t))}catch(r){this._writeError=r instanceof Error?r.message:String(r);return}this._collection=[],await this._load(),this._tab==="collection"&&await this._loadCollection()}async _saveRows(t){if(this._dash){this._dash={...this._dash,rows:t};try{await this.hass.callWS({type:"lego/panel_config/set",rows:t})}catch{}}}_onDrop(t){let r=[...this._dash?.rows??[]],s=r.indexOf(this._dragging),o=r.indexOf(t);this._dragging="",!(s<0||o<0||s===o)&&(r.splice(o,0,...r.splice(s,1)),this._saveRows(r))}render(){return c`
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
    `:c`<p class="muted">Loading your collection…</p>`}_renderRow(t){let r=t==="themes"?this._renderThemes():t==="wishlist"?this._renderWishlist():this._renderStats();return c`
      <section
        class=${this._dragging===t?"row dragging":"row"}
        @dragover=${s=>s.preventDefault()}
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
        ${r}
      </section>
    `}_renderThemes(){let t=Object.keys(this._dash?.themes??{});if(!t.length)return c`<p class="muted">
        No themes followed yet. Add one in the integration options to see new
        releases here.
      </p>`;let r=this._dash?.themes[this._theme]??[];return c`
      <div class="chips">
        ${t.map(s=>c`
            <button
              class=${s===this._theme?"chip on":"chip"}
              @click=${()=>this._theme=s}
            >
              ${s}
            </button>
          `)}
      </div>
      ${this._carousel(r,"No new sets in this theme.")}
    `}_renderWishlist(){return this._carousel(this._dash?.wishlist??[],"Nothing on your wishlist. Mark a set as wanted to see it here.")}_renderRefresh(){let t=this._dash?.quota;if(!t)return c``;let r=t.refresh_cost,s=t.remaining<r,o=!s&&t.remaining<=r*3;return c`
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
        <span class="quota ${s?"bad":o?"warn":""}">
          ${s?c`Daily budget spent, ${t.calls_today} of ${t.budget}
              used. Resets at midnight UTC.`:c`Costs ${r} of ${t.remaining} calls left today.`}
        </span>
      </div>
      ${this._refreshError?c`<p class="caveat bad">${this._refreshError}</p>`:d}
    `}_renderStats(){let t=this._dash?.stats;if(!t)return c``;let r=[[this._num(t.sets_owned),"Sets owned"],[this._num(t.sets_distinct),"Distinct sets"],[this._num(t.pieces_owned),"Pieces"],[this._num(t.minifigs_owned),"Minifigures"],[this._num(Math.round(t.value)),"Value at RRP"]];return c`
      <div class="stats">
        ${r.map(([s,o])=>c`
            <div class="stat">
              <span class="n">${s}</span><span class="l">${o}</span>
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
            @input=${r=>{this._search(r.target.value)}}
          />
          ${this._query.trim().length>=2?c`<p class="muted">${t.length} matching sets</p>`:c`<p class="muted">${t.length} sets owned</p>`}
          <div class="grid">${t.map(r=>this._card(r))}</div>
        </section>
      </div>
    `}_carousel(t,r){return t.length?c`<div class="carousel">
      ${t.map(s=>this._card(s))}
    </div>`:c`<p class="muted">${r}</p>`}_card(t){return c`
      <article class="card">
        ${t.image?c`<img src=${t.image} alt="" loading="lazy" />`:c`<img
              class="noart"
              src=${Ie}
              alt=""
              loading="lazy"
            />`}
        <div class="meta">
          <span
            class=${I(t)?"name":"name unnamed"}
            title=${I(t)?t.name:"Brickset has not published a name yet"}
            >${We(t)}</span
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
    `}_when(t){return t.available_until?`Retires ${this._date(t.available_until)}`:t.available_from?`Out ${this._date(t.available_from)}`:I(t)?"Date unknown":"Details tbd"}_date(t){let r=new Date(t);return Number.isNaN(r.getTime())?t:r.toLocaleDateString(this.hass?.locale?.language??void 0,{day:"numeric",month:"short",year:"numeric"})}_num(t){return t.toLocaleString(this.hass?.locale?.language??void 0)}};p.styles=K`
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
  `,g([M({attribute:!1})],p.prototype,"hass",2),g([M({type:Boolean})],p.prototype,"narrow",2),g([f()],p.prototype,"_tab",2),g([f()],p.prototype,"_dash",2),g([f()],p.prototype,"_refreshing",2),g([f()],p.prototype,"_refreshError",2),g([f()],p.prototype,"_writeError",2),g([f()],p.prototype,"_theme",2),g([f()],p.prototype,"_error",2),g([f()],p.prototype,"_collection",2),g([f()],p.prototype,"_query",2),g([f()],p.prototype,"_results",2),g([f()],p.prototype,"_dragging",2),g([f()],p.prototype,"_accounts",2),g([f()],p.prototype,"_account",2),p=g([xe("lego-panel")],p);export{p as LegoPanel,ie as accountCall,We as displayName,I as isNamed,Be as ownershipCall};
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
