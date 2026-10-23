var Ue=Object.defineProperty;var Le=Object.getOwnPropertyDescriptor;var u=(i,t,e,s)=>{for(var r=s>1?void 0:s?Le(t,e):t,a=i.length-1,n;a>=0;a--)(n=i[a])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Ue(t,e,r),r};var B=globalThis,W=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),me=new WeakMap,P=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(W&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=me.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&me.set(e,t))}return t}toString(){return this.cssText}},ve=i=>new P(typeof i=="string"?i:i+"",void 0,X),Z=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,r,a)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[a+1],i[0]);return new P(e,i,X)},fe=(i,t)=>{if(W)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=B.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},ee=W?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return ve(e)})(i):i;var{is:qe,defineProperty:je,getOwnPropertyDescriptor:Be,getOwnPropertyNames:We,getOwnPropertySymbols:Ie,getPrototypeOf:Ve}=Object,I=globalThis,_e=I.trustedTypes,Fe=_e?_e.emptyScript:"",Ke=I.reactiveElementPolyfillSupport,O=(i,t)=>i,D={toAttribute(i,t){switch(t){case Boolean:i=i?Fe:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},V=(i,t)=>!qe(i,t),be={attribute:!0,type:String,converter:D,reflect:!1,useDefault:!1,hasChanged:V};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=be){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&je(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:a}=Be(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let l=r?.call(this);a?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??be}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=Ve(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,s=[...We(e),...Ie(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(ee(r))}else t!==void 0&&e.push(ee(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fe(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:D).toAttribute(e,s.type);this._$Em=t,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let a=s.getPropertyOptions(r),n=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:D;this._$Em=r;let l=n.fromAttribute(e,a.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s,r=!1,a){if(t!==void 0){let n=this.constructor;if(r===!1&&(a=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??V)(a,e)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:a},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),a!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,a]of s){let{wrapped:n}=a,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,a,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[O("elementProperties")]=new Map,x[O("finalized")]=new Map,Ke?.({ReactiveElement:x}),(I.reactiveElementVersions??=[]).push("2.1.2");var oe=globalThis,ye=i=>i,F=oe.trustedTypes,xe=F?F.createPolicy("lit-html",{createHTML:i=>i}):void 0,ke="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Re="?"+$,Ye=`<${Re}>`,k=document,H=()=>k.createComment(""),N=i=>i===null||typeof i!="object"&&typeof i!="function",le=Array.isArray,Ge=i=>le(i)||typeof i?.[Symbol.iterator]=="function",te=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$e=/-->/g,we=/>/g,S=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ae=/'/g,Se=/"/g,Ce=/^(?:script|style|textarea|title)$/i,he=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),o=he(1),Te=he(2),ft=he(3),R=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Ee=new WeakMap,E=k.createTreeWalker(k,129);function ze(i,t){if(!le(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return xe!==void 0?xe.createHTML(t):t}var Je=(i,t)=>{let e=i.length-1,s=[],r,a=t===2?"<svg>":t===3?"<math>":"",n=M;for(let l=0;l<e;l++){let h=i[l],g,v,d=-1,_=0;for(;_<h.length&&(n.lastIndex=_,v=n.exec(h),v!==null);)_=n.lastIndex,n===M?v[1]==="!--"?n=$e:v[1]!==void 0?n=we:v[2]!==void 0?(Ce.test(v[2])&&(r=RegExp("</"+v[2],"g")),n=S):v[3]!==void 0&&(n=S):n===S?v[0]===">"?(n=r??M,d=-1):v[1]===void 0?d=-2:(d=n.lastIndex-v[2].length,g=v[1],n=v[3]===void 0?S:v[3]==='"'?Se:Ae):n===Se||n===Ae?n=S:n===$e||n===we?n=M:(n=S,r=void 0);let b=n===S&&i[l+1].startsWith("/>")?" ":"";a+=n===M?h+Ye:d>=0?(s.push(g),h.slice(0,d)+ke+h.slice(d)+$+b):h+$+(d===-2?l:b)}return[ze(i,a+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},U=class i{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let a=0,n=0,l=t.length-1,h=this.parts,[g,v]=Je(t,e);if(this.el=i.createElement(g,s),E.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=E.nextNode())!==null&&h.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let d of r.getAttributeNames())if(d.endsWith(ke)){let _=v[n++],b=r.getAttribute(d).split($),C=/([.?@])?(.*)/.exec(_);h.push({type:1,index:a,name:C[2],strings:b,ctor:C[1]==="."?re:C[1]==="?"?ie:C[1]==="@"?ae:z}),r.removeAttribute(d)}else d.startsWith($)&&(h.push({type:6,index:a}),r.removeAttribute(d));if(Ce.test(r.tagName)){let d=r.textContent.split($),_=d.length-1;if(_>0){r.textContent=F?F.emptyScript:"";for(let b=0;b<_;b++)r.append(d[b],H()),E.nextNode(),h.push({type:2,index:++a});r.append(d[_],H())}}}else if(r.nodeType===8)if(r.data===Re)h.push({type:2,index:a});else{let d=-1;for(;(d=r.data.indexOf($,d+1))!==-1;)h.push({type:7,index:a}),d+=$.length-1}a++}}static createElement(t,e){let s=k.createElement("template");return s.innerHTML=t,s}};function T(i,t,e=i,s){if(t===R)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,a=N(t)?void 0:t._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),a===void 0?r=void 0:(r=new a(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=T(i,r._$AS(i,t.values),r,s)),t}var se=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??k).importNode(e,!0);E.currentNode=r;let a=E.nextNode(),n=0,l=0,h=s[0];for(;h!==void 0;){if(n===h.index){let g;h.type===2?g=new L(a,a.nextSibling,this,t):h.type===1?g=new h.ctor(a,h.name,h.strings,this,t):h.type===6&&(g=new ne(a,this,t)),this._$AV.push(g),h=s[++l]}n!==h?.index&&(a=E.nextNode(),n++)}return E.currentNode=k,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},L=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=T(this,t,e),N(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==R&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ge(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=U.createElement(ze(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let a=new se(r,this),n=a.u(this.options);a.p(e),this.T(n),this._$AH=a}}_$AC(t){let e=Ee.get(t.strings);return e===void 0&&Ee.set(t.strings,e=new U(t)),e}k(t){le(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let a of t)r===e.length?e.push(s=new i(this.O(H()),this.O(H()),this,this.options)):s=e[r],s._$AI(a),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ye(t).nextSibling;ye(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,a){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(t,e=this,s,r){let a=this.strings,n=!1;if(a===void 0)t=T(this,t,e,0),n=!N(t)||t!==this._$AH&&t!==R,n&&(this._$AH=t);else{let l=t,h,g;for(t=a[0],h=0;h<a.length-1;h++)g=T(this,l[s+h],e,h),g===R&&(g=this._$AH[h]),n||=!N(g)||g!==this._$AH[h],g===c?t=c:t!==c&&(t+=(g??"")+a[h+1]),this._$AH[h]=g}n&&!r&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},re=class extends z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},ie=class extends z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},ae=class extends z{constructor(t,e,s,r,a){super(t,e,s,r,a),this.type=5}_$AI(t,e=this){if((t=T(this,t,e,0)??c)===R)return;let s=this._$AH,r=t===c&&s!==c||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==c&&(s===c||r);r&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ne=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){T(this,t)}};var Qe=oe.litHtmlPolyfillSupport;Qe?.(U,L),(oe.litHtmlVersions??=[]).push("3.3.3");var Pe=(i,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let a=e?.renderBefore??null;s._$litPart$=r=new L(t.insertBefore(H(),a),a,void 0,e??{})}return r._$AI(i),r};var ce=globalThis,w=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Pe(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return R}};w._$litElement$=!0,w.finalized=!0,ce.litElementHydrateSupport?.({LitElement:w});var Xe=ce.litElementPolyfillSupport;Xe?.({LitElement:w});(ce.litElementVersions??=[]).push("4.2.2");var Oe=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var Ze={attribute:!0,type:String,converter:D,reflect:!1,hasChanged:V},et=(i=Ze,t,e)=>{let{kind:s,metadata:r}=e,a=globalThis.litPropertyMetadata.get(r);if(a===void 0&&globalThis.litPropertyMetadata.set(r,a=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),a.set(e.name,i),s==="accessor"){let{name:n}=e;return{set(l){let h=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,h,i,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){let{name:n}=e;return function(l){let h=this[n];t.call(this,l),this.requestUpdate(n,h,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function q(i){return(t,e)=>typeof e=="object"?et(i,t,e):((s,r,a)=>{let n=r.hasOwnProperty(a);return r.constructor.createProperty(a,s),n?Object.getOwnPropertyDescriptor(r,a):void 0})(i,t,e)}function m(i){return q({...i,state:!0,attribute:!1})}var tt="{?}";function st(i,t){return{device_id:i,set_number:t.set_number,owned:!t.owned}}function rt(i){return{device_id:i}}function de(i,t){return t?{type:i,config_entry_id:t}:{type:i}}function it(i,t){if(!i)return"Not synced yet";let e=Math.floor((t.getTime()-new Date(i).getTime())/6e4);if(e<1)return"Updated just now";let s=new Intl.RelativeTimeFormat("en",{numeric:"always"});if(e<60)return`Updated ${s.format(-e,"minute")}`;let r=Math.floor(e/60);return r<48?`Updated ${s.format(-r,"hour")}`:`Updated ${s.format(-Math.floor(r/24),"day")}`}function De(i,t,e,s=!1){return i==null||!t?"":new Intl.NumberFormat(e,{style:"currency",currency:t,...s?{maximumFractionDigits:0}:{}}).format(i)}function Y(i){return i instanceof Error?i.message:i&&typeof i=="object"&&"message"in i?String(i.message):String(i)}function at(i){let t=[];for(let e of i){let s=e.state??e.mean;s!=null&&t.push({t:new Date(e.start).getTime(),v:s})}return t}function Me(i,t,e=8){let s=[...i].filter(n=>n[t]>0).sort((n,l)=>l[t]-n[t]),r=s.slice(0,e).map(n=>({theme:n.theme,amount:n[t],sets:n.sets})),a=s.slice(e);return a.length&&r.push({theme:`Other (${G(a.length,"theme","themes")})`,amount:a.reduce((n,l)=>n+l[t],0),sets:a.reduce((n,l)=>n+l.sets,0)}),r}function G(i,t,e){return`${i.toLocaleString()} ${i===1?t:e}`}var nt=60;function ot(i,t){if(i.available_until){let e=new Date(i.available_until).getTime();return e<t.getTime()?"retired":(e-t.getTime())/864e5<=nt?"retiring":""}return i.available_from&&new Date(i.available_from)>t?"due":""}function lt(i,t,e){return i.available_until?`${new Date(i.available_until)<t?"Retired":"Retires"} ${e(i.available_until)}`:i.available_from?`${new Date(i.available_from)>t?"Due":"Out"} ${e(i.available_from)}`:J(i)?"Date unknown":"Details tbd"}function J(i){let t=(i.name??"").trim();return t!==""&&t!==tt}function ht(i){return J(i)?i.name:"Name tbd"}var ct="/lego_panel/icon.png",pe={recent:"Out recently",upcoming:"Coming soon",themes:"New in my themes",wishlist:"Your wishlist",collection:"Your collection",value:"Collection value",pieces:"Pieces"},dt=365,p=class extends w{constructor(){super(...arguments);this.narrow=!1;this._tab="home";this._refreshing=!1;this._refreshError="";this._writeError="";this._theme="";this._error="";this._collection=[];this._query="";this._results=[];this._dragging="";this._over="";this._pending=new Set;this._collectionError="";this._switching="";this._customising=!1;this._history={};this._hoverPoint=null;this._accounts=[];this._account=""}connectedCallback(){super.connectedCallback(),this._load()}updated(){if(this._tab!=="home"||!this._dash)return;let e=this._visibleRows();for(let s of["value","pieces"])e.includes(s)&&this._history[s]===void 0&&this._loadHistory(s)}async _refreshCollection(){this._refreshing=!0,this._refreshError="";try{await this.hass.callService("lego","refresh_collection",rt(this._dash?.device_id??"")),await this._load()}catch(e){this._refreshError=Y(e)}finally{this._refreshing=!1}}async _selectAccount(e){if(e!==this._account){this._account=e,this._switching=this._accounts.find(s=>s.entry_id===e)?.name??"account",this._collection=[],this._results=[],this._query="",this._theme="";try{await this._load(),this._tab==="collection"&&await this._loadCollection()}finally{this._switching=""}try{await this.hass.callWS({type:"lego/account/set",config_entry_id:e})}catch{}}}async _load(){try{if(!this._accounts.length){let s=await this.hass.callWS({type:"lego/accounts"});this._accounts=s.accounts,this._account=s.selected??""}let e=await this.hass.callWS(de("lego/dashboard",this._account));e.entry_id!==this._dash?.entry_id&&(this._history={}),this._dash=e,this._error="",(!this._theme||!(this._theme in e.themes))&&(this._theme=Object.keys(e.themes)[0]??"")}catch(e){this._error=Y(e)}}async _loadCollection(){if(!this._collection.length)try{let e=await this.hass.callWS({...de("lego/collection",this._account),filter:"owned"});this._collection=e.sets,this._collectionError=""}catch(e){this._collectionError=Y(e)}}async _search(e){if(this._query=e,e.trim().length<2){this._results=[];return}try{let s=await this.hass.callWS({...de("lego/search",this._account),query:e,limit:24});this._results=s.sets}catch{this._results=[]}}_setPending(e,s){let r=new Set(this._pending);s?r.add(e):r.delete(e),this._pending=r}async _toggleOwned(e){if(!this._pending.has(e.set_number)){this._writeError="",this._setPending(e.set_number,!0);try{await this.hass.callService("lego","set_collection",st(this._dash?.device_id??"",e))}catch(s){this._writeError=Y(s);return}finally{this._setPending(e.set_number,!1)}this._collection=[],await this._load(),this._tab==="collection"&&await this._loadCollection()}}async _saveRows(e){if(this._dash){this._dash={...this._dash,rows:e};try{await this.hass.callWS({type:"lego/panel_config/set",rows:e})}catch{}}}_onDrop(e){let s=[...this._dash?.rows??[]],r=s.indexOf(this._dragging),a=s.indexOf(e);this._dragging="",this._over="",!(r<0||a<0||r===a)&&(s.splice(a,0,...s.splice(r,1)),this._saveRows(s))}_onHandleKey(e,s){let r=e.key==="ArrowUp"?-1:e.key==="ArrowDown"?1:0;if(!r)return;e.preventDefault();let a=[...this._dash?.rows??[]],n=this._visibleRows(),l=n[n.indexOf(s)+r];if(!l)return;let h=a.indexOf(s);a.splice(h,1),a.splice(a.indexOf(l)+(r>0?1:0),0,s),this._saveRows(a),this.updateComplete.then(()=>this.renderRoot.querySelector(`.drag[data-row="${s}"]`)?.focus())}render(){return o`
      <div class="app">
        <header class=${this.narrow?"narrow":""}>
          <div class="title">
            ${this.narrow?o`<ha-menu-button
                  .hass=${this.hass}
                  .narrow=${this.narrow}
                ></ha-menu-button>`:c}
            <h1>LEGO</h1>
          </div>
          ${this._renderAccounts()}
          <div class="tabs" role="tablist">
            <button
              class=${this._tab==="home"?"tab on":"tab"}
              role="tab"
              aria-selected=${this._tab==="home"}
              @click=${()=>this._tab="home"}
            >
              Home
            </button>
            <button
              class=${this._tab==="collection"?"tab on":"tab"}
              role="tab"
              aria-selected=${this._tab==="collection"}
              @click=${()=>{this._tab="collection",this._loadCollection()}}
            >
              Collection
            </button>
          </div>
        </header>
        ${this._switching?o`<p class="muted switching" role="status">
              Loading ${this._switching}…
            </p>`:c}
        <div
          class=${this._switching?"busy":""}
          aria-busy=${!!this._switching}
        >
          ${this._error?this._renderError(this._error,()=>{this._load()}):this._tab==="home"?this._renderHome():this._renderCollection()}
        </div>
        ${this._writeError?o`<div class="toast" role="alert">
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
            </div>`:c}
      </div>
    `}_renderError(e,s){return o`<div class="error" role="alert">
      <p>${e}</p>
      <button class="link" @click=${s}>Try again</button>
    </div>`}_renderAccounts(){return this._accounts.length<2?c:o`
      <select
        class="account"
        aria-label="Brickset account"
        @change=${e=>{this._selectAccount(e.target.value)}}
      >
        ${this._accounts.map(e=>o`
            <option
              value=${e.entry_id}
              ?selected=${e.entry_id===this._account}
            >
              ${e.name}
            </option>
          `)}
      </select>
    `}_availableRows(){let e=!!this._dash?.releases;return(this._dash?.rows??[]).filter(s=>e||s!=="recent"&&s!=="upcoming")}_visibleRows(){let e=this._dash?.hidden??[];return this._availableRows().filter(s=>!e.includes(s))}async _setHidden(e,s){if(!this._dash)return;let r=s?[...this._dash.hidden.filter(a=>a!==e),e]:this._dash.hidden.filter(a=>a!==e);this._dash={...this._dash,hidden:r};try{await this.hass.callWS({type:"lego/panel_config/set",hidden:r})}catch{}}_renderHome(){if(!this._dash)return o`<p class="muted">Loading your collection…</p>`;let e=this._visibleRows();return o`
      <div class="rows">
        <div class="homebar">
          <button
            class="link"
            aria-expanded=${this._customising}
            @click=${()=>this._customising=!this._customising}
          >
            ${this._customising?"Done":"Customise"}
          </button>
        </div>
        ${this._customising?this._renderCustomise():c}
        ${e.length?e.map(s=>this._renderRow(s)):o`<p class="muted">
              Every row is hidden. Choose Customise to bring some back.
            </p>`}
      </div>
    `}_renderCustomise(){let e=this._dash?.hidden??[],s=this._availableRows();return o`
      <section class="row customise" aria-label="Rows on this page">
        <h2>Rows on this page</h2>
        <p class="muted">
          Choose which rows show, and move them with their handles or the arrow
          keys. Saved for you on every device.
        </p>
        <ul>
          ${s.map(r=>o`
              <li>
                <label>
                  <input
                    type="checkbox"
                    .checked=${!e.includes(r)}
                    @change=${a=>{this._setHidden(r,!a.target.checked)}}
                  />
                  ${pe[r]}
                </label>
              </li>
            `)}
        </ul>
        ${this._dash?.releases?c:o`<p class="muted">
              For Out recently and Coming soon, turn on Follow releases across
              all themes in the integration's options.
            </p>`}
      </section>
    `}_renderReleases(e,s){let r=this._dash?.releases;return r?.status==="fetching"?o`<p class="muted">Fetching this year's releases…</p>`:r?.status==="failed"?o`<p class="muted">
        Couldn't fetch this year's releases. They're tried again every few hours
        until they arrive.
      </p>`:this._carousel(r?.[e]??[],s)}_renderRow(e){let s=e==="themes"?this._renderThemes():e==="wishlist"?this._renderWishlist():e==="recent"?this._renderReleases("recent","Nothing out in the last four weeks."):e==="upcoming"?this._renderReleases("upcoming","Nothing due in the next four weeks."):e==="value"?this._renderValue():e==="pieces"?this._renderPieces():this._renderStats();return o`
      <section
        class=${this._dragging===e?"row dragging":this._dragging&&this._over===e?"row over":"row"}
        @dragover=${r=>r.preventDefault()}
        @dragenter=${()=>this._over=e}
        @drop=${()=>this._onDrop(e)}
      >
        <div class="rowhead">
          <h2>${pe[e]}</h2>
          <button
            class="drag"
            data-row=${e}
            draggable="true"
            title="Drag, or use the arrow keys, to reorder"
            aria-label=${`Move ${pe[e]} up or down`}
            @dragstart=${()=>this._dragging=e}
            @dragend=${()=>{this._dragging="",this._over=""}}
            @keydown=${r=>this._onHandleKey(r,e)}
          >
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
        </div>
        ${s}
      </section>
    `}_renderThemes(){let e=Object.keys(this._dash?.themes??{});if(!e.length)return o`<p class="muted">
        No themes followed yet. Add one in the integration options to see new
        releases here.
      </p>`;let s=this._dash?.themes[this._theme]??[];return o`
      <div class="chips">
        ${e.map(r=>o`
            <button
              class=${r===this._theme?"chip on":"chip"}
              @click=${()=>this._theme=r}
            >
              ${r}
            </button>
          `)}
      </div>
      ${this._carousel(s,"No new sets in this theme.")}
    `}_renderWishlist(){return this._carousel(this._dash?.wishlist??[],"Nothing on your wishlist. Mark a set as wanted to see it here.")}_renderRefresh(){let e=this._dash?.quota;if(!e)return o``;let s=e.refresh_cost,r=e.remaining<s,a=!r&&e.remaining<=s*3;return o`
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
          class="quota ${r||a?"warn":""}"
          title=${this._dash?.last_synced?new Date(this._dash.last_synced).toLocaleString():c}
        >
          ${it(this._dash?.last_synced??null,new Date)}.
          ${r?o`Daily budget spent, ${e.calls_today} of ${e.budget}
              used, so this is the last sync's data. Updates resume
              ${this._resumes(e.resets_at)}.`:o`Costs ${s} of ${e.remaining} calls left today.`}
        </span>
      </div>
      ${this._refreshError?o`<p class="caveat bad">${this._refreshError}</p>`:c}
    `}_resumes(e){let s=new Date(e),r=s.toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"});return s.toDateString()===new Date().toDateString()?`at ${r}`:`tomorrow at ${r}`}_renderStats(){let e=this._dash?.stats;if(!e)return o``;let s=[[this._num(e.sets_owned),"Sets owned"],[this._num(e.sets_distinct),"Distinct sets"],[this._num(e.pieces_owned),"Pieces"],[this._num(e.minifigs_owned),"Minifigures"]];return o`
      <div class="stats">
        ${s.map(([r,a])=>o`
            <div class="stat">
              <span class="n">${r}</span><span class="l">${a}</span>
            </div>
          `)}
      </div>
      ${this._renderRefresh()}
      <button
        class="link"
        @click=${()=>{this._tab="collection",this._loadCollection()}}
      >
        Browse all sets ›
      </button>
    `}_money(e){return De(e,this._dash?.currency??null,this.hass?.locale?.language,!0)||this._num(Math.round(e))}_renderValue(){let e=this._dash?.stats;return e?o`
      <p class="headline">
        <span class="n">${this._money(e.value)}</span>
        <span class="l">at LEGO.com RRP, today</span>
      </p>
      ${this._renderHistory("value",s=>this._money(s))}
      <h3>By theme</h3>
      ${this._renderBars(Me(this._dash?.by_theme??[],"value"),s=>this._money(s))}
      ${e.sets_missing_price?o`<p class="caveat">
            ${e.sets_missing_price===1?"1 set has no published price and is not counted in the value.":`${this._num(e.sets_missing_price)} sets have no published
                price and are not counted in the value.`}
          </p>`:c}
    `:o``}_renderPieces(){let e=this._dash?.stats;return e?o`
      <p class="headline">
        <span class="n">${this._num(e.pieces_owned)}</span>
        <span class="l">pieces owned, today</span>
      </p>
      ${this._renderHistory("pieces",s=>this._num(Math.round(s)))}
      <h3>By theme</h3>
      ${this._renderBars(Me(this._dash?.by_theme??[],"pieces"),s=>this._num(s))}
    `:o``}async _loadHistory(e){let s=this._dash?.history?.[e],r=this._dash?.entry_id;if(!s||this._history[e])return;this._history={...this._history,[e]:"loading"};let a=()=>this._dash?.entry_id===r;try{let n=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(Date.now()-dt*864e5).toISOString(),statistic_ids:[s],period:"week",types:e==="value"?["state"]:["mean"]});if(!a())return;let l=at(n[s]??[]);this._history={...this._history,[e]:l.length>=2?l:"none"}}catch{a()&&(this._history={...this._history,[e]:"none"})}}_renderHistory(e,s){let r=this._history[e];if(r===void 0||r==="loading")return o`<p class="muted">Loading history…</p>`;if(r==="none")return o`<p class="muted">
        No history yet. Home Assistant records it weekly from the sensor, so a
        line appears after a couple of weeks.
      </p>`;let a=r,n=Math.min(...a.map(f=>f.v)),h=Math.max(...a.map(f=>f.v))-n||1,g=a[0].t,v=a[a.length-1].t-g||1,d=f=>(f.t-g)/v*100,_=f=>90-(f.v-n)/h*80,b=a.map(f=>`${d(f)},${_(f)}`).join(" "),C=`0,100 ${b} 100,100`,A=a[a.length-1],y=this._hoverPoint?.key===e?a[this._hoverPoint.index]:void 0,j=f=>new Date(f).toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short"});return o`
      <figure class="history">
        <div
          class="plot"
          @pointermove=${f=>{let ue=f.currentTarget.getBoundingClientRect(),ge=g+(f.clientX-ue.left)/ue.width*v,Q=0;a.forEach((He,Ne)=>{Math.abs(He.t-ge)<Math.abs(a[Q].t-ge)&&(Q=Ne)}),this._hoverPoint={key:e,index:Q}}}
          @pointerleave=${()=>this._hoverPoint=null}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line class="base" x1="0" y1="100" x2="100" y2="100"></line>
            <polygon class="wash" points=${C}></polygon>
            <polyline class="trace" points=${b}></polyline>
            ${y?Te`<line class="cross" x1=${d(y)} y1="0" x2=${d(y)} y2="100"></line>`:c}
          </svg>
          <span
            class="dot"
            style="left:${d(y??A)}%;top:${_(y??A)}%"
          ></span>
          <span
            class=${y?"readout on":"readout"}
            style="left:${Math.min(Math.max(d(y??A),12),88)}%"
            >${s((y??A).v)} · ${j((y??A).t)}</span
          >
        </div>
        <figcaption>
          <span>${j(a[0].t)}</span>
          <span>${s(a[0].v)} → ${s(A.v)}</span>
          <span>${j(A.t)}</span>
        </figcaption>
        <details>
          <summary>Show as a table</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">Week of</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              ${a.map(f=>o`<tr>
                    <td>${j(f.t)}</td>
                    <td>${s(f.v)}</td>
                  </tr>`)}
            </tbody>
          </table>
        </details>
      </figure>
    `}_renderBars(e,s){if(!e.length)return o`<p class="muted">
        Nothing owned with a published figure yet.
      </p>`;let r=e[0].amount||1;return o`
      <ul class="bars">
        ${e.map(a=>o`
            <li title=${G(a.sets,"set","sets")}>
              <span class="label">${a.theme}</span>
              <span class="track">
                <span
                  class="bar"
                  style="width:${Math.max(a.amount/r*100,1)}%"
                ></span>
                <span class="amount">${s(a.amount)}</span>
              </span>
            </li>
          `)}
      </ul>
    `}_renderCollection(){let e=this._query.trim().length>=2?this._results:this._collection;return o`
      <div class="rows">
        <section class="row">
          <div class="searchbox">
            <input
              class="search"
              type="search"
              .value=${this._query}
              placeholder="Search your sets and the full catalogue…"
              aria-label="Search sets"
              @input=${s=>{this._search(s.target.value)}}
            />
            ${this._query?o`<button
                  class="clear"
                  aria-label="Clear search"
                  @click=${()=>{this._search("")}}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>`:c}
          </div>
          ${this._collectionError&&this._query.trim().length<2?this._renderError(this._collectionError,()=>{this._collectionError="",this._loadCollection()}):o`<p class="muted count">
                  ${this._query.trim().length>=2?G(e.length,"matching set","matching sets"):G(e.length,"set owned","sets owned")}
                </p>
                <div class="grid">
                  ${e.map(s=>this._card(s))}
                </div>`}
        </section>
      </div>
    `}_carousel(e,s){return e.length?o`<div class="carousel">
      ${e.map(r=>this._card(r))}
    </div>`:o`<p class="muted">${s}</p>`}_linked(e,s,r=!1){return e.url?o`<a
      class="open"
      href=${e.url}
      target="_blank"
      rel="noopener noreferrer"
      tabindex=${r?"-1":c}
      aria-hidden=${r?"true":c}
      >${s}</a
    >`:s}_card(e){return o`
      <article class="card">
        ${this._linked(e,e.image?o`<img src=${e.image} alt="" loading="lazy" />`:o`<img
                class="noart"
                src=${ct}
                alt=""
                loading="lazy"
              />`,!0)}
        <div class="meta">
          ${this._linked(e,o`<span
              class=${J(e)?"name":"name unnamed"}
              title=${J(e)?e.name:"Brickset has not published a name yet"}
              >${ht(e)}</span
            >`)}
          <span class="num"
            >${[e.set_number,De(e.retail_price,this._dash?.currency??null,this.hass?.locale?.language)].filter(Boolean).join(" \xB7 ")}</span
          >
          <span class="when ${ot(e,new Date)}"
            >${lt(e,new Date,s=>this._date(s))}</span
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
    `}_date(e){let s=new Date(e);return Number.isNaN(s.getTime())?e:s.toLocaleDateString(this.hass?.locale?.language??void 0,{day:"numeric",month:"short",year:"numeric"})}_num(e){return e.toLocaleString(this.hass?.locale?.language??void 0)}};p.styles=Z`
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
    /* One toolbar row at Home Assistant's own header height; on a phone the tabs
       take a row of their own below it. */
    header {
      align-items: center;
      background: var(--lego-surface);
      border-bottom: var(--lego-line) solid var(--lego-outline);
      column-gap: var(--ha-space-4, 16px);
      display: flex;
      flex-wrap: wrap;
      min-height: var(--header-height, 56px);
      padding: 0 var(--ha-space-4, 16px);
      position: sticky;
      top: 0;
      z-index: 2;
    }
    header .account {
      margin-left: auto;
      order: 3;
    }
    header.narrow .tabs {
      flex-basis: 100%;
      order: 4;
    }
    .title {
      align-items: center;
      display: flex;
      gap: var(--ha-space-1, 4px);
      min-width: 0;
    }
    /* The page title reads like Home Assistant's own toolbar titles: regular
       weight, so the bold section headings below it are the ones that stand out. */
    h1 {
      font-size: var(--ha-font-size-xl, 20px);
      line-height: var(--ha-line-height-condensed, 1.2);
      font-weight: var(--ha-font-weight-normal, 400);
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
      align-self: stretch;
      display: flex;
      gap: var(--ha-space-1, 4px);
      order: 2;
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
      min-height: var(--header-height, 56px);
      padding: 0 var(--ha-space-4, 16px);
      cursor: pointer;
    }
    header.narrow .tab {
      min-height: 48px;
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
    /* Set photos come on white; inset and rounded they read as photos rather
       than as gaps in a dark card. */
    .card img {
      background: var(--lego-ground);
      border-radius: var(--ha-border-radius-md, 8px);
      box-sizing: border-box;
      height: 104px;
      margin: var(--ha-space-2, 8px) var(--ha-space-2, 8px) 0;
      object-fit: contain;
      width: calc(100% - 2 * var(--ha-space-2, 8px));
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
    .searchbox {
      position: relative;
    }
    .search::-webkit-search-cancel-button {
      appearance: none;
    }
    .clear {
      appearance: none;
      background: none;
      border: 0;
      color: var(--lego-text-2);
      cursor: pointer;
      display: grid;
      height: 48px;
      place-items: center;
      position: absolute;
      right: 0;
      top: 0;
      width: 48px;
    }
    .homebar {
      display: flex;
      justify-content: flex-end;
      margin: calc(-1 * var(--ha-space-3, 12px)) 0;
    }
    .customise ul {
      display: grid;
      gap: 0;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      list-style: none;
      margin: var(--ha-space-2, 8px) 0 0;
      padding: 0;
    }
    .customise label {
      align-items: center;
      cursor: pointer;
      display: flex;
      gap: var(--ha-space-3, 12px);
      font-size: var(--ha-font-size-m, 14px);
      min-height: 48px;
    }
    .customise input {
      accent-color: var(--lego-primary);
      height: 20px;
      margin: 0;
      width: 20px;
    }
    h3 {
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-bold, 700);
      line-height: var(--ha-line-height-condensed, 1.2);
      margin: var(--ha-space-5, 20px) 0 var(--ha-space-2, 8px);
    }
    .headline {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: var(--ha-space-2, 8px);
      margin: 0 0 var(--ha-space-3, 12px);
    }
    .headline .n {
      font-size: var(--ha-font-size-3xl, 28px);
      font-weight: var(--ha-font-weight-bold, 700);
      line-height: var(--ha-line-height-condensed, 1.2);
    }
    .headline .l {
      color: var(--lego-text-2);
      font-size: var(--ha-font-size-s, 12px);
    }
    .history {
      margin: 0;
    }
    .plot {
      height: 140px;
      position: relative;
      touch-action: pan-y;
    }
    .plot svg {
      display: block;
      height: 100%;
      overflow: visible;
      width: 100%;
    }
    .plot .base {
      stroke: var(--lego-outline);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .plot .wash {
      fill: var(--lego-primary);
      fill-opacity: 0.1;
    }
    .plot .trace {
      fill: none;
      stroke: var(--lego-primary);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2;
      vector-effect: non-scaling-stroke;
    }
    .plot .cross {
      stroke: var(--lego-text-2);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .plot .dot {
      background: var(--lego-primary);
      border-radius: var(--ha-border-radius-circle, 50%);
      box-shadow: 0 0 0 2px var(--lego-surface);
      height: 8px;
      position: absolute;
      transform: translate(-50%, -50%);
      width: 8px;
    }
    .plot .readout {
      background: var(--lego-surface);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--ha-border-radius-sm, 4px);
      font-size: var(--ha-font-size-s, 12px);
      font-variant-numeric: tabular-nums;
      padding: 2px var(--ha-space-2, 8px);
      position: absolute;
      top: calc(-1 * var(--ha-space-2, 8px));
      transform: translate(-50%, -100%);
      white-space: nowrap;
    }
    .history figcaption {
      color: var(--lego-text-2);
      display: flex;
      font-size: var(--ha-font-size-s, 12px);
      justify-content: space-between;
      margin-top: var(--ha-space-1, 4px);
    }
    .history details {
      font-size: var(--ha-font-size-s, 12px);
      margin-top: var(--ha-space-2, 8px);
    }
    .history summary {
      color: var(--lego-primary);
      cursor: pointer;
      min-height: 32px;
    }
    .history table {
      border-collapse: collapse;
      font-variant-numeric: tabular-nums;
    }
    .history td,
    .history th {
      border-bottom: var(--lego-line) solid var(--lego-outline);
      padding: var(--ha-space-1, 4px) var(--ha-space-4, 16px)
        var(--ha-space-1, 4px) 0;
      text-align: left;
    }
    .bars {
      display: grid;
      gap: var(--ha-space-2, 8px);
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .bars li {
      align-items: center;
      display: grid;
      gap: var(--ha-space-3, 12px);
      grid-template-columns: minmax(80px, 30%) 1fr;
    }
    .bars .label {
      font-size: var(--ha-font-size-s, 12px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .bars .track {
      align-items: center;
      display: flex;
      gap: var(--ha-space-2, 8px);
      min-width: 0;
    }
    .bars .bar {
      background: var(--lego-primary);
      border-radius: 0 var(--ha-border-radius-sm, 4px)
        var(--ha-border-radius-sm, 4px) 0;
      flex: none;
      height: 16px;
      max-width: calc(100% - 72px);
    }
    .bars .amount {
      font-size: var(--ha-font-size-s, 12px);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .busy {
      opacity: 0.5;
      pointer-events: none;
      transition: opacity 150ms;
    }
    .switching {
      padding: 0 var(--ha-space-4, 16px);
    }
    .search {
      background: var(--lego-ground);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--ha-border-radius-md, 8px);
      color: inherit;
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      min-height: 48px;
      /* Room on the right for the clear button. */
      padding: 0 48px 0 var(--ha-space-3, 12px);
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
  `,u([q({attribute:!1})],p.prototype,"hass",2),u([q({type:Boolean})],p.prototype,"narrow",2),u([m()],p.prototype,"_tab",2),u([m()],p.prototype,"_dash",2),u([m()],p.prototype,"_refreshing",2),u([m()],p.prototype,"_refreshError",2),u([m()],p.prototype,"_writeError",2),u([m()],p.prototype,"_theme",2),u([m()],p.prototype,"_error",2),u([m()],p.prototype,"_collection",2),u([m()],p.prototype,"_query",2),u([m()],p.prototype,"_results",2),u([m()],p.prototype,"_dragging",2),u([m()],p.prototype,"_over",2),u([m()],p.prototype,"_pending",2),u([m()],p.prototype,"_collectionError",2),u([m()],p.prototype,"_switching",2),u([m()],p.prototype,"_customising",2),u([m()],p.prototype,"_history",2),u([m()],p.prototype,"_hoverPoint",2),u([m()],p.prototype,"_accounts",2),u([m()],p.prototype,"_account",2),p=u([Oe("lego-panel")],p);export{p as LegoPanel,de as accountCall,G as count,ht as displayName,Y as errorText,De as formatPrice,J as isNamed,st as ownershipCall,rt as refreshCall,at as statisticPoints,it as syncedAgo,Me as topThemes,lt as whenLabel,ot as whenTone};
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
