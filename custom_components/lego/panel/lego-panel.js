var wt=Object.defineProperty;var At=Object.getOwnPropertyDescriptor;var m=(i,t,e,s)=>{for(var r=s>1?void 0:s?At(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&wt(t,e,r),r};var D=globalThis,q=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),it=new WeakMap,R=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(q&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=it.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&it.set(e,t))}return t}toString(){return this.cssText}},ot=i=>new R(typeof i=="string"?i:i+"",void 0,V),K=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new R(e,i,V)},nt=(i,t)=>{if(q)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=D.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},F=q?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return ot(e)})(i):i;var{is:St,defineProperty:Et,getOwnPropertyDescriptor:Ct,getOwnPropertyNames:Rt,getOwnPropertySymbols:kt,getPrototypeOf:Tt}=Object,L=globalThis,at=L.trustedTypes,Ot=at?at.emptyScript:"",Pt=L.reactiveElementPolyfillSupport,k=(i,t)=>i,T={toAttribute(i,t){switch(t){case Boolean:i=i?Ot:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},j=(i,t)=>!St(i,t),lt={attribute:!0,type:String,converter:T,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;var v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=lt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Et(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:o}=Ct(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let l=r?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??lt}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;let t=Tt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){let e=this.properties,s=[...Rt(e),...kt(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(F(r))}else t!==void 0&&e.push(F(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:T).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:T;this._$Em=r;let l=n.fromAttribute(e,o.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s,r=!1,o){if(t!==void 0){let n=this.constructor;if(r===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??j)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[k("elementProperties")]=new Map,v[k("finalized")]=new Map,Pt?.({ReactiveElement:v}),(L.reactiveElementVersions??=[]).push("2.1.2");var tt=globalThis,ct=i=>i,B=tt.trustedTypes,ht=B?B.createPolicy("lit-html",{createHTML:i=>i}):void 0,ft="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,_t="?"+b,Ut=`<${_t}>`,A=document,P=()=>A.createComment(""),U=i=>i===null||typeof i!="object"&&typeof i!="function",et=Array.isArray,Nt=i=>et(i)||typeof i?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,dt=/-->/g,pt=/>/g,x=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ut=/'/g,gt=/"/g,vt=/^(?:script|style|textarea|title)$/i,st=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),c=st(1),Qt=st(2),Yt=st(3),S=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),mt=new WeakMap,w=A.createTreeWalker(A,129);function $t(i,t){if(!et(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ht!==void 0?ht.createHTML(t):t}var Mt=(i,t)=>{let e=i.length-1,s=[],r,o=t===2?"<svg>":t===3?"<math>":"",n=O;for(let l=0;l<e;l++){let a=i[l],p,g,h=-1,_=0;for(;_<a.length&&(n.lastIndex=_,g=n.exec(a),g!==null);)_=n.lastIndex,n===O?g[1]==="!--"?n=dt:g[1]!==void 0?n=pt:g[2]!==void 0?(vt.test(g[2])&&(r=RegExp("</"+g[2],"g")),n=x):g[3]!==void 0&&(n=x):n===x?g[0]===">"?(n=r??O,h=-1):g[1]===void 0?h=-2:(h=n.lastIndex-g[2].length,p=g[1],n=g[3]===void 0?x:g[3]==='"'?gt:ut):n===gt||n===ut?n=x:n===dt||n===pt?n=O:(n=x,r=void 0);let $=n===x&&i[l+1].startsWith("/>")?" ":"";o+=n===O?a+Ut:h>=0?(s.push(p),a.slice(0,h)+ft+a.slice(h)+b+$):a+b+(h===-2?l:$)}return[$t(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},N=class i{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0,l=t.length-1,a=this.parts,[p,g]=Mt(t,e);if(this.el=i.createElement(p,s),w.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=w.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let h of r.getAttributeNames())if(h.endsWith(ft)){let _=g[n++],$=r.getAttribute(h).split(b),z=/([.?@])?(.*)/.exec(_);a.push({type:1,index:o,name:z[2],strings:$,ctor:z[1]==="."?Y:z[1]==="?"?G:z[1]==="@"?Z:C}),r.removeAttribute(h)}else h.startsWith(b)&&(a.push({type:6,index:o}),r.removeAttribute(h));if(vt.test(r.tagName)){let h=r.textContent.split(b),_=h.length-1;if(_>0){r.textContent=B?B.emptyScript:"";for(let $=0;$<_;$++)r.append(h[$],P()),w.nextNode(),a.push({type:2,index:++o});r.append(h[_],P())}}}else if(r.nodeType===8)if(r.data===_t)a.push({type:2,index:o});else{let h=-1;for(;(h=r.data.indexOf(b,h+1))!==-1;)a.push({type:7,index:o}),h+=b.length-1}o++}}static createElement(t,e){let s=A.createElement("template");return s.innerHTML=t,s}};function E(i,t,e=i,s){if(t===S)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,o=U(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=E(i,r._$AS(i,t.values),r,s)),t}var Q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??A).importNode(e,!0);w.currentNode=r;let o=w.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new M(o,o.nextSibling,this,t):a.type===1?p=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(p=new X(o,this,t)),this._$AV.push(p),a=s[++l]}n!==a?.index&&(o=w.nextNode(),n++)}return w.currentNode=A,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},M=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),U(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Nt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=N.createElement($t(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new Q(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=mt.get(t.strings);return e===void 0&&mt.set(t.strings,e=new N(t)),e}k(t){et(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let o of t)r===e.length?e.push(s=new i(this.O(P()),this.O(P()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ct(t).nextSibling;ct(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,r){let o=this.strings,n=!1;if(o===void 0)t=E(this,t,e,0),n=!U(t)||t!==this._$AH&&t!==S,n&&(this._$AH=t);else{let l=t,a,p;for(t=o[0],a=0;a<o.length-1;a++)p=E(this,l[s+a],e,a),p===S&&(p=this._$AH[a]),n||=!U(p)||p!==this._$AH[a],p===d?t=d:t!==d&&(t+=(p??"")+o[a+1]),this._$AH[a]=p}n&&!r&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Y=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},G=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},Z=class extends C{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??d)===S)return;let s=this._$AH,r=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==d&&(s===d||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},X=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var Ht=tt.litHtmlPolyfillSupport;Ht?.(N,M),(tt.litHtmlVersions??=[]).push("3.3.3");var bt=(i,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let o=e?.renderBefore??null;s._$litPart$=r=new M(t.insertBefore(P(),o),o,void 0,e??{})}return r._$AI(i),r};var rt=globalThis,y=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=bt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};y._$litElement$=!0,y.finalized=!0,rt.litElementHydrateSupport?.({LitElement:y});var zt=rt.litElementPolyfillSupport;zt?.({LitElement:y});(rt.litElementVersions??=[]).push("4.2.2");var yt=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var Dt={attribute:!0,type:String,converter:T,reflect:!1,hasChanged:j},qt=(i=Dt,t,e)=>{let{kind:s,metadata:r}=e,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){let{name:n}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){let{name:n}=e;return function(l){let a=this[n];t.call(this,l),this.requestUpdate(n,a,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function H(i){return(t,e)=>typeof e=="object"?qt(i,t,e):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}function f(i){return H({...i,state:!0,attribute:!1})}var Lt="{?}";function jt(i,t){return{config_entry_id:i,set_number:t.set_number,owned:!t.owned}}function I(i){let t=(i.name??"").trim();return t!==""&&t!==Lt}function Bt(i){return I(i)?i.name:"Name tbd"}var Wt="/lego_panel/icon.png",xt={themes:"New in my themes",wishlist:"Your wishlist",collection:"Your collection"},u=class extends y{constructor(){super(...arguments);this.narrow=!1;this._tab="home";this._refreshing=!1;this._refreshError="";this._writeError="";this._theme="";this._error="";this._collection=[];this._query="";this._results=[];this._dragging=""}connectedCallback(){super.connectedCallback(),this._load()}async _refreshCollection(){this._refreshing=!0,this._refreshError="";try{await this.hass.callService("lego","refresh_collection",{config_entry_id:this._dash?.entry_id??""}),await this._load()}catch(e){this._refreshError=e instanceof Error?e.message:String(e)}finally{this._refreshing=!1}}async _load(){try{let e=await this.hass.callWS({type:"lego/dashboard"});this._dash=e,this._error="",(!this._theme||!(this._theme in e.themes))&&(this._theme=Object.keys(e.themes)[0]??"")}catch(e){this._error=e instanceof Error?e.message:String(e)}}async _loadCollection(){if(!this._collection.length)try{let e=await this.hass.callWS({type:"lego/collection",filter:"owned"});this._collection=e.sets}catch(e){this._error=e instanceof Error?e.message:String(e)}}async _search(e){if(this._query=e,e.trim().length<2){this._results=[];return}try{let s=await this.hass.callWS({type:"lego/search",query:e,limit:24});this._results=s.sets}catch{this._results=[]}}async _toggleOwned(e){this._writeError="";try{await this.hass.callService("lego","set_collection",jt(this._dash?.entry_id??"",e))}catch(s){this._writeError=s instanceof Error?s.message:String(s);return}this._collection=[],await this._load(),this._tab==="collection"&&await this._loadCollection()}async _saveRows(e){if(this._dash){this._dash={...this._dash,rows:e};try{await this.hass.callWS({type:"lego/panel_config/set",rows:e})}catch{}}}_onDrop(e){let s=[...this._dash?.rows??[]],r=s.indexOf(this._dragging),o=s.indexOf(e);this._dragging="",!(r<0||o<0||r===o)&&(s.splice(o,0,...s.splice(r,1)),this._saveRows(s))}render(){return c`
      <div class="app">
        <header>
          <h1>LEGO</h1>
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
    `}_renderHome(){return this._dash?c`
      <div class="rows">
        ${this._dash.rows.map(e=>this._renderRow(e))}
      </div>
    `:c`<p class="muted">Loading your collection…</p>`}_renderRow(e){let s=e==="themes"?this._renderThemes():e==="wishlist"?this._renderWishlist():this._renderStats();return c`
      <section
        class=${this._dragging===e?"row dragging":"row"}
        @dragover=${r=>r.preventDefault()}
        @drop=${()=>this._onDrop(e)}
      >
        <div class="rowhead">
          <button
            class="drag"
            draggable="true"
            title="Drag to reorder"
            aria-label=${`Reorder ${xt[e]}`}
            @dragstart=${()=>this._dragging=e}
            @dragend=${()=>this._dragging=""}
          >
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
          <h2>${xt[e]}</h2>
        </div>
        ${s}
      </section>
    `}_renderThemes(){let e=Object.keys(this._dash?.themes??{});if(!e.length)return c`<p class="muted">
        No themes followed yet. Add one in the integration options to see new releases here.
      </p>`;let s=this._dash?.themes[this._theme]??[];return c`
      <div class="chips">
        ${e.map(r=>c`
            <button
              class=${r===this._theme?"chip on":"chip"}
              @click=${()=>this._theme=r}
            >
              ${r}
            </button>
          `)}
      </div>
      ${this._carousel(s,"No new sets in this theme.")}
    `}_renderWishlist(){return this._carousel(this._dash?.wishlist??[],"Nothing on your wishlist. Mark a set as wanted to see it here.")}_renderRefresh(){let e=this._dash?.quota;if(!e)return c``;let s=e.refresh_cost,r=e.remaining<s,o=!r&&e.remaining<=s*3;return c`
      <div class="refresh">
        <button
          class="refreshbtn"
          ?disabled=${this._refreshing||r}
          @click=${()=>void this._refreshCollection()}
        >
          <ha-icon icon=${this._refreshing?"mdi:sync":"mdi:cloud-sync"}></ha-icon>
          ${this._refreshing?"Updating\u2026":"Update now"}
        </button>
        <span class="quota ${r?"bad":o?"warn":""}">
          ${r?c`Daily budget spent, ${e.calls_today} of ${e.budget} used.
              Resets at midnight UTC.`:c`Costs ${s} of ${e.remaining} calls left today.`}
        </span>
      </div>
      ${this._refreshError?c`<p class="caveat bad">${this._refreshError}</p>`:d}
    `}_renderStats(){let e=this._dash?.stats;if(!e)return c``;let s=[[this._num(e.sets_owned),"Sets owned"],[this._num(e.sets_distinct),"Distinct sets"],[this._num(e.pieces_owned),"Pieces"],[this._num(e.minifigs_owned),"Minifigures"],[this._num(Math.round(e.value)),"Value at RRP"]];return c`
      <div class="stats">
        ${s.map(([r,o])=>c`
            <div class="stat"><span class="n">${r}</span><span class="l">${o}</span></div>
          `)}
      </div>
      ${this._renderRefresh()}
      ${e.sets_missing_price?c`<p class="caveat">
            ${this._num(e.sets_missing_price)} sets have no published price and are not
            counted in the value.
          </p>`:d}
      <button class="link" @click=${()=>{this._tab="collection",this._loadCollection()}}>
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
            @input=${s=>void this._search(s.target.value)}
          />
          ${this._query.trim().length>=2?c`<p class="muted">${e.length} matching sets</p>`:c`<p class="muted">${e.length} sets owned</p>`}
          <div class="grid">${e.map(s=>this._card(s))}</div>
        </section>
      </div>
    `}_carousel(e,s){return e.length?c`<div class="carousel">${e.map(r=>this._card(r))}</div>`:c`<p class="muted">${s}</p>`}_card(e){return c`
      <article class="card">
        ${e.image?c`<img src=${e.image} alt="" loading="lazy" />`:c`<img class="noart" src=${Wt} alt="" loading="lazy" />`}
        <div class="meta">
          <span
            class=${I(e)?"name":"name unnamed"}
            title=${I(e)?e.name:"Brickset has not published a name yet"}
            >${Bt(e)}</span
          >
          <span class="num">${e.set_number}</span>
          <span class="when">${this._when(e)}</span>
          <div class="foot">
            <span class=${e.owned?"state own":e.wanted?"state want":"state"}>
              ${e.owned?e.qty_owned>1?`Owned \xD7${e.qty_owned}`:"Owned":e.wanted?"Wanted":e.year||""}
            </span>
            <button
              class=${e.owned?"act on":"act"}
              title=${e.owned?"Remove from your collection":"Add to your collection"}
              aria-label=${e.owned?"Remove from your collection":"Add to your collection"}
              @click=${()=>void this._toggleOwned(e)}
            >
              <ha-icon icon=${e.owned?"mdi:check":"mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `}_when(e){return e.available_until?`Retires ${this._date(e.available_until)}`:e.available_from?`Out ${this._date(e.available_from)}`:I(e)?"Date unknown":"Details tbd"}_date(e){let s=new Date(e);return Number.isNaN(s.getTime())?e:s.toLocaleDateString(this.hass?.locale?.language??void 0,{day:"numeric",month:"short",year:"numeric"})}_num(e){return e.toLocaleString(this.hass?.locale?.language??void 0)}};u.styles=K`
    :host {
      --pu-text: var(--primary-text-color, #15181b);
      --pu-text-2: var(--secondary-text-color, #5b636c);
      --pu-surface: var(--card-background-color, #fff);
      --pu-ground: var(--primary-background-color, #f4f6f8);
      --pu-line: var(--divider-color, #d8dee4);
      --pu-accent: var(--primary-color, #0288d1);
      --pu-own: var(--success-color, #2e7d32);
      --pu-want: var(--warning-color, #b26a00);
      --pu-bad: var(--error-color, #b3261e);
      --pu-radius: var(--ha-card-border-radius, 12px);
      display: block;
      background: var(--pu-ground);
      color: var(--pu-text);
      min-height: 100vh;
    }
    .app {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 0 32px;
    }
    header {
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--pu-surface);
      border-bottom: 1px solid var(--pu-line);
      padding: 0 16px;
    }
    h1 {
      font-size: 20px;
      line-height: 64px;
      font-weight: 500;
      margin: 0;
    }
    .tabs {
      display: flex;
      gap: 2px;
    }
    .tab {
      appearance: none;
      background: none;
      border: 0;
      border-bottom: 2px solid transparent;
      color: var(--pu-text-2);
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      min-height: 48px;
      padding: 0 18px;
      cursor: pointer;
    }
    .tab.on {
      color: var(--pu-accent);
      border-bottom-color: var(--pu-accent);
    }
    .rows {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 20px 16px 0;
    }
    .row {
      background: var(--pu-surface);
      border: 1px solid var(--pu-line);
      border-radius: var(--pu-radius);
      padding: 16px;
    }
    .row.dragging {
      opacity: 0.5;
    }
    .rowhead {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    /* Material 3 title-large: section headers must outrank body text. */
    h2 {
      font-size: 22px;
      line-height: 28px;
      font-weight: 400;
      margin: 0;
    }
    .drag {
      appearance: none;
      background: none;
      border: 0;
      color: var(--pu-text-2);
      cursor: grab;
      display: grid;
      place-items: center;
      min-width: 48px;
      min-height: 48px;
      margin-left: -12px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }
    .chip {
      appearance: none;
      background: none;
      border: 1px solid var(--pu-line);
      border-radius: 8px;
      color: var(--pu-text-2);
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      min-height: 40px;
      padding: 0 14px;
    }
    .chip.on {
      background: var(--pu-accent);
      border-color: var(--pu-accent);
      color: var(--text-primary-color, #fff);
    }
    .carousel {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 4px;
      scroll-snap-type: x proximity;
    }
    .carousel .card {
      flex: 0 0 156px;
      scroll-snap-align: start;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
      gap: 12px;
    }
    .card {
      background: var(--pu-surface);
      border: 1px solid var(--pu-line);
      border-radius: var(--pu-radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card img {
      width: 100%;
      height: 104px;
      object-fit: contain;
      background: var(--pu-ground);
    }
    /* Stand-in art, so it must read as absent rather than as the set. */
    .card img.noart {
      padding: 26px;
      opacity: 0.35;
      box-sizing: border-box;
    }
    .meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 10px;
    }
    .name {
      font-size: 14px;
      line-height: 19px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* An unannounced set has no name worth reading, so the number leads. */
    .name.unnamed {
      color: var(--pu-text-2);
      font-style: italic;
      font-weight: 400;
    }
    .num {
      font-size: 11px;
      color: var(--pu-text-2);
      font-variant-numeric: tabular-nums;
    }
    .name.unnamed + .num {
      font-size: 14px;
      font-weight: 500;
      color: var(--pu-text);
    }
    .when {
      font-size: 11px;
      color: var(--pu-text-2);
    }
    .foot {
      align-items: center;
      display: flex;
      gap: 6px;
      margin-top: 6px;
    }
    .state {
      font-size: 11px;
      font-weight: 600;
      flex: 1;
      color: var(--pu-text-2);
    }
    .state.own {
      color: var(--pu-own);
    }
    .state.want {
      color: var(--pu-want);
    }
    .act {
      appearance: none;
      background: none;
      border: 1px solid var(--pu-line);
      border-radius: 50%;
      color: var(--pu-text-2);
      cursor: pointer;
      display: grid;
      place-items: center;
      /* 32px of ink, 48px of target — the padding does the work. */
      width: 32px;
      height: 32px;
      padding: 8px;
      box-sizing: content-box;
      margin: -8px;
      --mdc-icon-size: 18px;
    }
    .act.on {
      background: var(--pu-own);
      border-color: var(--pu-own);
      color: var(--text-primary-color, #fff);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1px;
      background: var(--pu-line);
      border: 1px solid var(--pu-line);
      border-radius: var(--pu-radius);
      overflow: hidden;
    }
    .stat {
      background: var(--pu-surface);
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 14px;
    }
    .stat .n {
      font-size: 26px;
      font-weight: 600;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }
    .stat .l {
      font-size: 12px;
      color: var(--pu-text-2);
    }
    .caveat {
      font-size: 12px;
      color: var(--pu-text-2);
      margin: 8px 0 0;
    }
    .caveat.bad {
      color: var(--pu-bad);
    }
    .refresh {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 12px;
      margin: 12px 0 0;
    }
    .refreshbtn {
      appearance: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding: 0 20px;
      border: 0;
      border-radius: var(--pu-radius);
      background: var(--pu-accent);
      color: var(--text-primary-color, #fff);
      /* Material 3 label large */
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      cursor: pointer;
    }
    .refreshbtn ha-icon {
      --mdc-icon-size: 20px;
    }
    .refreshbtn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .refreshbtn:focus-visible {
      outline: 2px solid var(--pu-accent);
      outline-offset: 2px;
    }
    .quota {
      /* Material 3 label medium */
      font-size: 12px;
      line-height: 16px;
      color: var(--pu-text-2);
    }
    .quota.warn {
      color: var(--pu-want);
    }
    .quota.bad {
      color: var(--pu-bad);
    }
    .link {
      appearance: none;
      background: none;
      border: 0;
      color: var(--pu-accent);
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      margin-top: 8px;
      min-height: 48px;
      padding: 0;
    }
    .search {
      background: var(--pu-ground);
      border: 1px solid var(--pu-line);
      border-radius: 10px;
      color: inherit;
      font: inherit;
      font-size: 14px;
      min-height: 48px;
      padding: 0 14px;
      width: 100%;
      box-sizing: border-box;
    }
    .muted {
      color: var(--pu-text-2);
      font-size: 14px;
      margin: 12px 0 0;
    }
    .error {
      color: var(--error-color, #c62828);
      padding: 20px 16px;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--pu-accent);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  `,m([H({attribute:!1})],u.prototype,"hass",2),m([H({type:Boolean})],u.prototype,"narrow",2),m([f()],u.prototype,"_tab",2),m([f()],u.prototype,"_dash",2),m([f()],u.prototype,"_refreshing",2),m([f()],u.prototype,"_refreshError",2),m([f()],u.prototype,"_writeError",2),m([f()],u.prototype,"_theme",2),m([f()],u.prototype,"_error",2),m([f()],u.prototype,"_collection",2),m([f()],u.prototype,"_query",2),m([f()],u.prototype,"_results",2),m([f()],u.prototype,"_dragging",2),u=m([yt("lego-panel")],u);export{u as LegoPanel,Bt as displayName,I as isNamed,jt as ownershipCall};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
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

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
