var je=Object.defineProperty;var Ne=Object.getOwnPropertyDescriptor;var p=(i,e,t,s)=>{for(var r=s>1?void 0:s?Ne(e,t):e,a=i.length-1,o;a>=0;a--)(o=i[a])&&(r=(s?o(e,t,r):o(r))||r);return s&&r&&je(e,t,r),r};var ot=globalThis,nt=ot.ShadowRoot&&(ot.ShadyCSS===void 0||ot.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_t=Symbol(),Jt=new WeakMap,K=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==_t)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(nt&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Jt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Jt.set(t,e))}return e}toString(){return this.cssText}},Xt=i=>new K(typeof i=="string"?i:i+"",void 0,_t),b=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((s,r,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[a+1],i[0]);return new K(t,i,_t)},Qt=(i,e)=>{if(nt)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),r=ot.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},St=nt?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Xt(t)})(i):i;var{is:Le,defineProperty:Ue,getOwnPropertyDescriptor:He,getOwnPropertyNames:Ie,getOwnPropertySymbols:qe,getPrototypeOf:We}=Object,lt=globalThis,Zt=lt.trustedTypes,Ge=Zt?Zt.emptyScript:"",Ke=lt.reactiveElementPolyfillSupport,V=(i,e)=>i,Y={toAttribute(i,e){switch(e){case Boolean:i=i?Ge:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},ct=(i,e)=>!Le(i,e),te={attribute:!0,type:String,converter:Y,reflect:!1,useDefault:!1,hasChanged:ct};Symbol.metadata??=Symbol("metadata"),lt.litPropertyMetadata??=new WeakMap;var D=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=te){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&Ue(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){let{get:r,set:a}=He(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:r,set(o){let l=r?.call(this);a?.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??te}static _$Ei(){if(this.hasOwnProperty(V("elementProperties")))return;let e=We(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(V("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(V("properties"))){let t=this.properties,s=[...Ie(t),...qe(t)];for(let r of s)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let r of s)t.unshift(St(r))}else e!==void 0&&t.push(St(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Qt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:Y).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(e,t){let s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let a=s.getPropertyOptions(r),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Y;this._$Em=r;let l=o.fromAttribute(t,a.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(e,t,s,r=!1,a){if(e!==void 0){let o=this.constructor;if(r===!1&&(a=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??ct)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:a},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),a!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,a]of s){let{wrapped:o}=a,l=this[r];o!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,a,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};D.elementStyles=[],D.shadowRootOptions={mode:"open"},D[V("elementProperties")]=new Map,D[V("finalized")]=new Map,Ke?.({ReactiveElement:D}),(lt.reactiveElementVersions??=[]).push("2.1.2");var Rt=globalThis,ee=i=>i,dt=Rt.trustedTypes,se=dt?dt.createPolicy("lit-html",{createHTML:i=>i}):void 0,le="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,ce="?"+O,Ve=`<${ce}>`,N=document,X=()=>N.createComment(""),Q=i=>i===null||typeof i!="object"&&typeof i!="function",Dt=Array.isArray,Ye=i=>Dt(i)||typeof i?.[Symbol.iterator]=="function",At=`[ 	
\f\r]`,J=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,re=/-->/g,ie=/>/g,B=RegExp(`>|${At}(?:([^\\s"'>=/]+)(${At}*=${At}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ae=/'/g,oe=/"/g,de=/^(?:script|style|textarea|title)$/i,Ft=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),n=Ft(1),R=Ft(2),ws=Ft(3),L=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),ne=new WeakMap,j=N.createTreeWalker(N,129);function he(i,e){if(!Dt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return se!==void 0?se.createHTML(e):e}var Je=(i,e)=>{let t=i.length-1,s=[],r,a=e===2?"<svg>":e===3?"<math>":"",o=J;for(let l=0;l<t;l++){let c=i[l],h,g,u=-1,v=0;for(;v<c.length&&(o.lastIndex=v,g=o.exec(c),g!==null);)v=o.lastIndex,o===J?g[1]==="!--"?o=re:g[1]!==void 0?o=ie:g[2]!==void 0?(de.test(g[2])&&(r=RegExp("</"+g[2],"g")),o=B):g[3]!==void 0&&(o=B):o===B?g[0]===">"?(o=r??J,u=-1):g[1]===void 0?u=-2:(u=o.lastIndex-g[2].length,h=g[1],o=g[3]===void 0?B:g[3]==='"'?oe:ae):o===oe||o===ae?o=B:o===re||o===ie?o=J:(o=B,r=void 0);let f=o===B&&i[l+1].startsWith("/>")?" ":"";a+=o===J?c+Ve:u>=0?(s.push(h),c.slice(0,u)+le+c.slice(u)+O+f):c+O+(u===-2?l:f)}return[he(i,a+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},Z=class i{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let a=0,o=0,l=e.length-1,c=this.parts,[h,g]=Je(e,t);if(this.el=i.createElement(h,s),j.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=j.nextNode())!==null&&c.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let u of r.getAttributeNames())if(u.endsWith(le)){let v=g[o++],f=r.getAttribute(u).split(O),_=/([.?@])?(.*)/.exec(v);c.push({type:1,index:a,name:_[2],strings:f,ctor:_[1]==="."?Ct:_[1]==="?"?Tt:_[1]==="@"?Mt:I}),r.removeAttribute(u)}else u.startsWith(O)&&(c.push({type:6,index:a}),r.removeAttribute(u));if(de.test(r.tagName)){let u=r.textContent.split(O),v=u.length-1;if(v>0){r.textContent=dt?dt.emptyScript:"";for(let f=0;f<v;f++)r.append(u[f],X()),j.nextNode(),c.push({type:2,index:++a});r.append(u[v],X())}}}else if(r.nodeType===8)if(r.data===ce)c.push({type:2,index:a});else{let u=-1;for(;(u=r.data.indexOf(O,u+1))!==-1;)c.push({type:7,index:a}),u+=O.length-1}a++}}static createElement(e,t){let s=N.createElement("template");return s.innerHTML=e,s}};function H(i,e,t=i,s){if(e===L)return e;let r=s!==void 0?t._$Co?.[s]:t._$Cl,a=Q(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),a===void 0?r=void 0:(r=new a(i),r._$AT(i,t,s)),s!==void 0?(t._$Co??=[])[s]=r:t._$Cl=r),r!==void 0&&(e=H(i,r._$AS(i,e.values),r,s)),e}var Et=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,r=(e?.creationScope??N).importNode(t,!0);j.currentNode=r;let a=j.nextNode(),o=0,l=0,c=s[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new tt(a,a.nextSibling,this,e):c.type===1?h=new c.ctor(a,c.name,c.strings,this,e):c.type===6&&(h=new zt(a,this,e)),this._$AV.push(h),c=s[++l]}o!==c?.index&&(a=j.nextNode(),o++)}return j.currentNode=N,r}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},tt=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=H(this,e,t),Q(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==L&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ye(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&Q(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Z.createElement(he(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(t);else{let a=new Et(r,this),o=a.u(this.options);a.p(t),this.T(o),this._$AH=a}}_$AC(e){let t=ne.get(e.strings);return t===void 0&&ne.set(e.strings,t=new Z(e)),t}k(e){Dt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,r=0;for(let a of e)r===t.length?t.push(s=new i(this.O(X()),this.O(X()),this,this.options)):s=t[r],s._$AI(a),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=ee(e).nextSibling;ee(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},I=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,a){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(e,t=this,s,r){let a=this.strings,o=!1;if(a===void 0)e=H(this,e,t,0),o=!Q(e)||e!==this._$AH&&e!==L,o&&(this._$AH=e);else{let l=e,c,h;for(e=a[0],c=0;c<a.length-1;c++)h=H(this,l[s+c],t,c),h===L&&(h=this._$AH[c]),o||=!Q(h)||h!==this._$AH[c],h===d?e=d:e!==d&&(e+=(h??"")+a[c+1]),this._$AH[c]=h}o&&!r&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Ct=class extends I{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},Tt=class extends I{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},Mt=class extends I{constructor(e,t,s,r,a){super(e,t,s,r,a),this.type=5}_$AI(e,t=this){if((e=H(this,e,t,0)??d)===L)return;let s=this._$AH,r=e===d&&s!==d||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==d&&(s===d||r);r&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},zt=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){H(this,e)}};var Xe=Rt.litHtmlPolyfillSupport;Xe?.(Z,tt),(Rt.litHtmlVersions??=[]).push("3.3.3");var pe=(i,e,t)=>{let s=t?.renderBefore??e,r=s._$litPart$;if(r===void 0){let a=t?.renderBefore??null;s._$litPart$=r=new tt(e.insertBefore(X(),a),a,void 0,t??{})}return r._$AI(i),r};var Ot=globalThis,E=class extends D{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=pe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};E._$litElement$=!0,E.finalized=!0,Ot.litElementHydrateSupport?.({LitElement:E});var Qe=Ot.litElementPolyfillSupport;Qe?.({LitElement:E});(Ot.litElementVersions??=[]).push("4.2.2");var Ze={attribute:!0,type:String,converter:Y,reflect:!1,hasChanged:ct},ts=(i=Ze,e,t)=>{let{kind:s,metadata:r}=t,a=globalThis.litPropertyMetadata.get(r);if(a===void 0&&globalThis.litPropertyMetadata.set(r,a=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),a.set(t.name,i),s==="accessor"){let{name:o}=t;return{set(l){let c=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,c,i,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){let{name:o}=t;return function(l){let c=this[o];e.call(this,l),this.requestUpdate(o,c,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function x(i){return(e,t)=>typeof t=="object"?ts(i,e,t):((s,r,a)=>{let o=r.hasOwnProperty(a);return r.constructor.createProperty(a,s),o?Object.getOwnPropertyDescriptor(r,a):void 0})(i,e,t)}function m(i){return x({...i,state:!0,attribute:!1})}function ue(i,e){return{device_id:i,set_number:e.set_number,owned:!e.owned}}function ge(i){return{device_id:i}}function T(i,e){return e?{type:i,config_entry_id:e}:{type:i}}function me(i,e){if(!i)return"Not synced yet";let t=Math.floor((e.getTime()-new Date(i).getTime())/6e4);if(t<1)return"Updated just now";let s=new Intl.RelativeTimeFormat("en",{numeric:"always"});if(t<60)return`Updated ${s.format(-t,"minute")}`;let r=Math.floor(t/60);return r<48?`Updated ${s.format(-r,"hour")}`:`Updated ${s.format(-Math.floor(r/24),"day")}`}function Pt(i,e,t,s=!1){return i==null||!e?"":new Intl.NumberFormat(t,{style:"currency",currency:e,...s?{maximumFractionDigits:0}:{}}).format(i)}function S(i){return i instanceof Error?i.message:i&&typeof i=="object"&&"message"in i?String(i.message):String(i)}function fe(i){let e=[];for(let t of i){let s=t.state??t.mean;s!=null&&e.push({t:new Date(t.start).getTime(),v:s})}return e}function ve(i,e,t=6){let s=[...i].filter(o=>o[e]>0).sort((o,l)=>l[e]-o[e]),r=s.slice(0,t).map(o=>({theme:o.theme,amount:o[e],sets:o.sets,setNumbers:o.set_numbers??[],other:!1})),a=s.slice(t);return a.length&&r.push({theme:`Other (${k(a.length,"theme","themes")})`,amount:a.reduce((o,l)=>o+l[e],0),sets:a.reduce((o,l)=>o+l.sets,0),setNumbers:a.flatMap(o=>o.set_numbers??[]).sort(),other:!0}),r}function k(i,e,t){return`${i.toLocaleString()} ${i===1?e:t}`}var es=60;function ye(i,e,t="retirement"){if(t==="release"&&i.available_from)return new Date(i.available_from)>e?"due":"";if(i.available_until){let s=new Date(i.available_until).getTime();return s<e.getTime()?"retired":(s-e.getTime())/864e5<=es?"retiring":""}return i.available_from&&new Date(i.available_from)>e?"due":""}function xe(i,e,t,s="retirement"){return s==="release"&&i.available_from?`${new Date(i.available_from)>e?"Due":"Out"} ${t(i.available_from)}`:i.available_until?`${new Date(i.available_until)<e?"Retired":"Retires"} ${t(i.available_until)}`:i.available_from?`${new Date(i.available_from)>e?"Due":"Out"} ${t(i.available_from)}`:et(i)?"Date unknown":"Details tbd"}function Bt(i){if(!i)return null;try{let e=new URL(i);return e.protocol==="https:"||e.protocol==="http:"?e.href:null}catch{return null}}function et(i){let e=(i.name??"").trim();return e!==""&&e!=="{?}"}function U(i){return et(i)?i.name:"Name tbd"}var pt={year:"This year",past3:"Past 3 months",past1:"Past month",next1:"Next month",next3:"Next 3 months",coming:"All coming"},st={releases:["year","past3","past1","next3","coming"],themes:["year","past3","past1","next3","coming"],recent:["past1","past3","year"],upcoming:["next1","next3","coming"]},ss={recent:"all",upcoming:"all",themes:"mine"};function q(i,e){let t=e.release_filters?.[i]??{},s=e.release_status.all!==null,a=ss[i]??t.scope??(s?"all":"mine");a==="all"&&!s&&(a="mine");let o=new Set(e.followed.map(g=>g.toLowerCase())),l=a==="mine"?(t.themes??[]).filter(g=>o.has(g.toLowerCase())):[],c=st[i],h=t.span&&c.includes(t.span)?t.span:i==="upcoming"?"next1":i==="recent"?"past1":"past3";return{scope:a,themes:l,span:h}}function ut(i,e,t){let s=i.includes(e)?i.filter(r=>r!==e):[...i,e];return s.length===t.length?[]:s}var P=15;function W(i,e){let t=typeof e=="string"?new Date(`${e.slice(0,10)}T00:00:00`):e,s=(t.getFullYear()-i.getFullYear())*12+t.getMonth()-i.getMonth(),r=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();return s+(t.getDate()-1)/r}function be(i,e,t=.15,s=4){let r=[];for(let a of[...i].sort((o,l)=>o.date.localeCompare(l.date))){let o=W(e,a.date);if(o<0||o>P)continue;let l=r[r.length-1];l&&o-l.at<=t?l.points.push(a):r.push({at:o,points:[a]})}return r.map(a=>({at:a.at,themes:a.points.slice(0,s).map(o=>o.theme),extra:Math.max(a.points.length-s,0),points:a.points}))}function jt(i,e=5){return Array.from({length:i},(t,s)=>(s-(i-1)/2)*e)}var rs=["recent","upcoming","themes"];function Nt(i,e){let t=e==="combined"?rs:["releases"];return i.filter(s=>!t.includes(s))}function we(i,e,t,s){let r=e[e.indexOf(t)+s];if(!r)return i;let a=i.filter(o=>o!==t);return a.splice(a.indexOf(r)+(s>0?1:0),0,t),a}var gt=new Map,mt="lego-invalidated";function $e(i,e){let t=gt.get(e);return t||(t=i.callWS(T("lego/dashboard",e)),gt.set(e,t),t.catch(()=>gt.delete(e))),t}function ft(){gt.clear(),window.dispatchEvent(new Event(mt))}function ke(i,e,t){return i.callWS({...T("lego/releases",e),scope:t.scope,themes:t.themes,span:t.span})}var _e={tag:"svg",attrs:{viewBox:"0.50 1.19 99.00 99.00"},children:[{tag:"polygon",attrs:{points:"4.000,34.558 50.000,61.116 50.000,93.389 4.000,66.831",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 88%, black)"}},{tag:"polygon",attrs:{points:"50.000,61.116 96.000,34.558 96.000,66.831 50.000,93.389",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 59%, black)"}},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 50.000,61.116 4.000,34.558",style:"fill:var(--primary-color, #009ac7)"}},{tag:"g",attrs:{"stroke-width":"0.5",fill:"none","stroke-linecap":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M4.000,34.558 L50.000,61.116 L96.000,34.558"}},{tag:"path",attrs:{d:"M50.000,61.116 L50.000,93.389"}}]},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 96.000,66.831 50.000,93.389 4.000,66.831 4.000,34.558",fill:"none","stroke-width":"2.0","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"}},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,16.236 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"16.236",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M18.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"27.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M64.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"73.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,42.794 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"42.794",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{transform:"translate(11.596,34.314) scale(0.12837)"},children:[{tag:"g",attrs:{stroke:"#FFFFFF","stroke-width":"17.0","stroke-linecap":"round",fill:"none"},children:[{tag:"line",attrs:{x1:"120.00",y1:"153.05",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"60.00",y1:"214.40",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"180.00",y1:"249.69",x2:"120.00",y2:"275.05"}}]},{tag:"g",attrs:{fill:"#FFFFFF"},children:[{tag:"circle",attrs:{cx:"120.00",cy:"153.05",r:"19.38"}},{tag:"circle",attrs:{cx:"60.00",cy:"214.40",r:"19.38"}},{tag:"circle",attrs:{cx:"180.00",cy:"249.69",r:"19.38"}}]}]}]},Se=[{part:"3005",size:"1x1",colour:"Red",width:38.44,svg:{tag:"svg",attrs:{viewBox:"0 0 38.44 55.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 19.220,29.723 19.220,54.027 1.900,44.027",fill:"#B01708"}},{tag:"polygon",attrs:{points:"19.220,29.723 36.540,19.723 36.540,44.027 19.220,54.027",fill:"#770F05"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 19.220,29.723 1.900,19.723",fill:"#C91A09"}},{tag:"path",attrs:{d:"M1.90,19.72 L19.22,29.72 L36.54,19.72 M19.22,29.72 L19.22,54.03",stroke:"#550B04","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 36.540,44.027 19.220,54.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#550B04","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#550B04","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#A11507",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F01F0B",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3004",size:"1x2",colour:"Orange",width:55.76,svg:{tag:"svg",attrs:{viewBox:"0 0 55.76 65.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 36.540,39.723 36.540,64.027 1.900,44.027",fill:"#F27901"}},{tag:"polygon",attrs:{points:"36.540,39.723 53.860,29.723 53.860,54.027 36.540,64.027",fill:"#A45201"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 36.540,39.723 1.900,19.723",fill:"#FE8A18"}},{tag:"path",attrs:{d:"M1.90,19.72 L36.54,39.72 L53.86,29.72 M36.54,39.72 L36.54,64.03",stroke:"#763B01","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 53.860,54.027 36.540,64.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#763B01","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3010",size:"1x4",colour:"Yellow",width:90.4,svg:{tag:"svg",attrs:{viewBox:"0 0 90.40 85.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 71.180,59.723 71.180,84.027 1.900,44.027",fill:"#F0C414"}},{tag:"polygon",attrs:{points:"71.180,59.723 88.500,49.723 88.500,74.027 71.180,84.027",fill:"#A6870B"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 71.180,59.723 1.900,19.723",fill:"#F2CD37"}},{tag:"path",attrs:{d:"M1.90,19.72 L71.18,59.72 L88.50,49.72 M71.18,59.72 L71.18,84.03",stroke:"#766108","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 88.500,74.027 71.180,84.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#766108","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3001",size:"2x4",colour:"Green",width:107.72,svg:{tag:"svg",attrs:{viewBox:"0 0 107.72 95.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 71.180,69.723 71.180,94.027 1.900,54.027",fill:"#1F6939"}},{tag:"polygon",attrs:{points:"71.180,69.723 105.820,49.723 105.820,74.027 71.180,94.027",fill:"#154727"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 71.180,69.723 1.900,29.723",fill:"#237841"}},{tag:"path",attrs:{d:"M1.90,29.72 L71.18,69.72 L105.82,49.72 M71.18,69.72 L71.18,94.03",stroke:"#0F331C","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 105.820,74.027 71.180,94.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#0F331C","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3009",size:"1x6",colour:"Dark Azure",width:125.04,svg:{tag:"svg",attrs:{viewBox:"0 0 125.04 105.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 105.820,79.723 105.820,104.027 1.900,44.027",fill:"#067AB0"}},{tag:"polygon",attrs:{points:"105.820,79.723 123.140,69.723 123.140,94.027 105.820,104.027",fill:"#045377"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 105.820,79.723 1.900,19.723",fill:"#078BC9"}},{tag:"path",attrs:{d:"M1.90,19.72 L105.82,79.72 L123.14,69.72 M105.82,79.72 L105.82,104.03",stroke:"#033B55","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 123.140,94.027 105.820,104.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#033B55","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"2456",size:"2x6",colour:"Blue",width:142.36,svg:{tag:"svg",attrs:{viewBox:"0 0 142.36 115.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 105.820,89.723 105.820,114.027 1.900,54.027",fill:"#004AA7"}},{tag:"polygon",attrs:{points:"105.820,89.723 140.460,69.723 140.460,94.027 105.820,114.027",fill:"#003271"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 105.820,89.723 1.900,29.723",fill:"#0055BF"}},{tag:"path",attrs:{d:"M1.90,29.72 L105.82,89.72 L140.46,69.72 M105.82,89.72 L105.82,114.03",stroke:"#002451","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 140.460,94.027 105.820,114.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#002451","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3008",size:"1x8",colour:"Dark Purple",width:159.68,svg:{tag:"svg",attrs:{viewBox:"0 0 159.68 125.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 140.460,99.723 140.460,124.027 1.900,44.027",fill:"#372F7F"}},{tag:"polygon",attrs:{points:"140.460,99.723 157.780,89.723 157.780,114.027 140.460,124.027",fill:"#252056"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 140.460,99.723 1.900,19.723",fill:"#3F3691"}},{tag:"path",attrs:{d:"M1.90,19.72 L140.46,99.72 L157.78,89.72 M140.46,99.72 L140.46,124.03",stroke:"#1B173E","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 157.780,114.027 140.460,124.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#1B173E","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M116.43,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"123.14",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M133.75,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"140.46",cy:"85.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3007",size:"2x8",colour:"Medium Lavender",width:177,svg:{tag:"svg",attrs:{viewBox:"0 0 177.00 135.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 140.460,109.723 140.460,134.027 1.900,54.027",fill:"#9D5FAD"}},{tag:"polygon",attrs:{points:"140.460,109.723 175.100,89.723 175.100,114.027 140.460,134.027",fill:"#6C3D78"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 140.460,109.723 1.900,29.723",fill:"#AC78BA"}},{tag:"path",attrs:{d:"M1.90,29.72 L140.46,109.72 L175.10,89.72 M140.46,109.72 L140.46,134.03",stroke:"#4D2C56","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 175.100,114.027 140.460,134.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#4D2C56","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M151.07,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"157.78",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,95.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"95.93",rx:"6.71",ry:"3.87"}}]}]}}];var vt=b`
  :host {
    --lego-series-1: #2a78d6;
    --lego-series-2: #eb6834;
    --lego-series-3: #1baf7a;
    --lego-series-4: #eda100;
    --lego-series-5: #e87ba4;
    --lego-series-6: #008300;
    --lego-series-7: #6250d6;
    --lego-series-8: #e34948;
    --lego-series-other: #9e9e9e;
  }
  :host([dark]) {
    --lego-series-1: #3987e5;
    --lego-series-2: #d95926;
    --lego-series-3: #199e70;
    --lego-series-4: #c98500;
    --lego-series-5: #d55181;
    --lego-series-6: #008300;
    --lego-series-7: #9085e9;
    --lego-series-8: #e66767;
  }
`,Ae=1,is=2,Ee=3,Lt=4,as=5,Ut=6,Ce=7,Te=8,os={"star wars":Ae,botanicals:Ut,"botanical collection":Ut,icons:Lt,"creator expert":Lt,technic:Ce,"harry potter":Te,city:Ee},ns=[is,as,Ae,Ee,Lt,Ut,Ce,Te];function rt(i){let e=new Map,t=new Set;for(let s of i){let r=os[s.toLowerCase()];r&&!t.has(r)&&(e.set(s,r),t.add(r))}for(let s of i){if(e.has(s))continue;let r=ns.find(a=>!t.has(a));r===void 0?e.set(s,"other"):(e.set(s,r),t.add(r))}return e}function it(i){return i===void 0||i==="other"?"var(--lego-series-other)":`var(--lego-series-${i})`}function yt(i){return n`<svg
    viewBox=${i.attrs.viewBox??d}
    aria-hidden="true"
    focusable="false"
  >
    ${(i.children??[]).map(Me)}
  </svg>`}function Me(i){let e=s=>i.attrs[s]??d,t=()=>(i.children??[]).map(Me);switch(i.tag){case"g":return R`<g transform=${e("transform")} fill=${e("fill")} stroke=${e("stroke")}
        stroke-width=${e("stroke-width")} stroke-linecap=${e("stroke-linecap")}
        stroke-linejoin=${e("stroke-linejoin")} style=${e("style")}>${t()}</g>`;case"polygon":return R`<polygon points=${e("points")} fill=${e("fill")} stroke=${e("stroke")}
        stroke-width=${e("stroke-width")} stroke-linejoin=${e("stroke-linejoin")}
        style=${e("style")}></polygon>`;case"path":return R`<path d=${e("d")} fill=${e("fill")} stroke=${e("stroke")}
        stroke-width=${e("stroke-width")} stroke-linecap=${e("stroke-linecap")}
        stroke-linejoin=${e("stroke-linejoin")} style=${e("style")}></path>`;case"ellipse":return R`<ellipse cx=${e("cx")} cy=${e("cy")} rx=${e("rx")} ry=${e("ry")}
        fill=${e("fill")} style=${e("style")}></ellipse>`;case"circle":return R`<circle cx=${e("cx")} cy=${e("cy")} r=${e("r")} fill=${e("fill")}
        style=${e("style")}></circle>`;case"line":return R`<line x1=${e("x1")} y1=${e("y1")} x2=${e("x2")} y2=${e("y2")}
        stroke=${e("stroke")} stroke-width=${e("stroke-width")}
        style=${e("style")}></line>`;default:return d}}var G=b`
  :host {
    --lego-text: var(--primary-text-color, #141414);
    --lego-text-2: var(--secondary-text-color, #5e5e5e);
    --lego-surface: var(--card-background-color, #fff);
    --lego-ground: var(--primary-background-color, #fafafa);
    --lego-outline: var(--divider-color, rgba(0, 0, 0, 0.12));
    --lego-primary: var(--primary-color, #009ac7);
    --lego-on-primary: var(--text-primary-color, #fff);
    --lego-focus: var(--ha-color-focus, var(--primary-color));
    /* Selected pills: the primary at a tint, text in the primary's dark step. */
    --lego-pick: color-mix(
      in srgb,
      var(--primary-color, #009ac7) 14%,
      transparent
    );
    --lego-on-pick: var(--ha-color-on-primary-normal, var(--primary-color));
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
    color: var(--lego-text);
  }
`,xt=b`
  /* A block, or the container queries below have no box to measure. */
  :host {
    container-type: inline-size;
    display: block;
  }
  .row {
    background: var(--lego-surface);
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--lego-radius);
    padding: var(--ha-space-1, 4px) var(--ha-space-4, 16px)
      var(--ha-space-4, 16px);
  }
  :host([bare]) .row {
    background: none;
    border: 0;
  }
  .row.folded {
    padding-bottom: var(--ha-space-1, 4px);
  }
  .row.dragging {
    opacity: 0.5;
  }
  .row.over {
    box-shadow: inset 0 var(--ha-border-width-md, 2px) 0 var(--lego-primary);
  }
  .rowhead {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ha-space-2, 8px);
    min-height: 56px;
  }
  .fold {
    flex: 1 1 200px;
    align-items: center;
    appearance: none;
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: flex;
    font: inherit;
    gap: var(--ha-space-2, 8px);
    min-height: 48px;
    min-width: 0;
    padding: 0;
    text-align: left;
  }
  .chev {
    --mdc-icon-size: 24px;
    color: var(--lego-text-2);
    flex: none;
    transition: transform var(--ha-animation-duration-fast, 150ms);
  }
  .chev.open {
    transform: rotate(90deg);
  }
  .rowicon {
    --mdc-icon-size: 24px;
    color: var(--lego-primary);
    flex: none;
  }
  .titles {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  h2 {
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: var(--ha-font-weight-bold, 700);
    line-height: var(--ha-line-height-condensed, 1.2);
    margin: 0;
  }
  .sub {
    color: var(--lego-text-2);
    font-size: var(--ha-font-size-s, 12px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .actions {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ha-space-2, 8px);
    justify-content: flex-end;
    max-width: 100%;
  }
  /* A narrow row, on a phone or in a dashboard column: the title keeps its line
     with the handle, and the controls drop to a line of their own. */
  @container (max-width: 720px) {
    .fold {
      flex-basis: 0;
    }
    .drag {
      order: 2;
    }
    .actions {
      flex-basis: 100%;
      justify-content: flex-start;
      order: 3;
      padding-bottom: var(--ha-space-2, 8px);
    }
    .actions .pills {
      max-width: 100%;
      overflow-x: auto;
    }
  }
  .drag {
    appearance: none;
    background: none;
    border: 0;
    color: var(--lego-text-2);
    cursor: grab;
    display: grid;
    flex: none;
    min-height: 48px;
    min-width: 48px;
    place-items: center;
  }
  .muted {
    color: var(--lego-text-2);
    font-size: var(--ha-font-size-m, 14px);
    margin: var(--ha-space-3, 12px) 0 0;
  }
  .caveat {
    color: var(--lego-text-2);
    font-size: var(--ha-font-size-s, 12px);
    line-height: var(--ha-line-height-normal, 1.6);
    margin: var(--ha-space-2, 8px) 0 0;
  }
  .caveat.bad {
    color: var(--lego-bad);
  }
  .subsection {
    border-top: var(--lego-line) solid var(--lego-outline);
    margin-top: var(--ha-space-3, 12px);
  }
  .subsection > .fold h3 {
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-bold, 700);
    margin: 0;
  }
  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: var(--ha-border-width-md, 2px) solid var(--lego-focus);
    outline-offset: var(--ha-border-width-md, 2px);
  }
`,bt=b`
  .pills {
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--ha-border-radius-pill, 9999px);
    display: inline-flex;
    overflow: hidden;
  }
  .pill {
    appearance: none;
    background: var(--lego-surface);
    border: 0;
    color: var(--lego-text-2);
    cursor: pointer;
    font: inherit;
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    min-height: 40px;
    padding: 0 var(--ha-space-3, 12px);
    white-space: nowrap;
  }
  .pill.on {
    background: var(--lego-pick);
    color: var(--lego-on-pick);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ha-space-2, 8px);
    margin: var(--ha-space-1, 4px) 0 var(--ha-space-2, 8px);
  }
  .chip {
    align-items: center;
    appearance: none;
    background: none;
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--ha-border-radius-pill, 9999px);
    color: var(--lego-text-2);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    gap: var(--ha-space-2, 8px);
    min-height: 40px;
    padding: 0 var(--ha-space-4, 16px);
  }
  .chip.on {
    background: var(--lego-primary);
    border-color: var(--lego-primary);
    color: var(--lego-on-primary);
  }
  .divider {
    align-self: stretch;
    background: var(--lego-outline);
    margin: var(--ha-space-1, 4px);
    width: var(--lego-line);
  }
  .key {
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--lego-surface);
    display: inline-block;
    flex: none;
    height: 10px;
    width: 10px;
  }
  .update {
    align-items: center;
    appearance: none;
    background: var(--lego-primary);
    border: 0;
    border-radius: var(--ha-border-radius-pill, 9999px);
    color: var(--lego-on-primary);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    gap: var(--ha-space-2, 8px);
    min-height: 40px;
    padding: 0 var(--ha-space-4, 16px);
    --mdc-icon-size: 18px;
  }
  .update:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
  .update .sep {
    background: currentColor;
    border-radius: 50%;
    height: 4px;
    width: 4px;
  }
  .update .cost {
    font-weight: var(--ha-font-weight-normal, 400);
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
    min-height: 48px;
    padding: 0 var(--ha-space-2, 8px);
  }
`,ze=b`
  .carousel {
    align-items: center;
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
    gap: var(--ha-space-3, 12px);
    grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
  }
  .card {
    background: var(--lego-surface);
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--lego-radius);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 236px;
    overflow: hidden;
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
    opacity: 0.35;
    padding: var(--ha-space-6, 24px);
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
    font-weight: var(--ha-font-weight-bold, 700);
    line-height: var(--ha-line-height-condensed, 1.2);
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
    align-items: center;
    color: var(--lego-text-2);
    display: flex;
    font-size: var(--ha-font-size-s, 12px);
    font-variant-numeric: tabular-nums;
    gap: 6px;
  }
  .num .key {
    box-shadow: none;
    height: 8px;
    width: 8px;
  }
  .when {
    color: var(--lego-text-2);
    font-size: var(--ha-font-size-s, 12px);
  }
  /* Not out yet: a dot in the primary colour, so the text keeps its contrast. */
  .when.due::before {
    background: var(--lego-primary);
    border-radius: 50%;
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
    margin-top: auto;
    padding-top: var(--ha-space-2, 8px);
  }
  .state {
    color: var(--lego-text-2);
    flex: 1;
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
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
    height: 48px;
    margin: calc(-1 * var(--ha-space-2, 8px));
    padding: 0;
    place-items: center;
    position: relative;
    width: 48px;
    --mdc-icon-size: 18px;
  }
  .act::before {
    border: var(--lego-line) solid var(--lego-text-2);
    border-radius: 50%;
    content: "";
    inset: var(--ha-space-2, 8px);
    position: absolute;
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
  a.open {
    color: inherit;
    display: block;
    min-width: 0;
    overflow: hidden;
    text-decoration: none;
  }
  a.open:hover .name {
    text-decoration: underline;
  }
  /* The rainbow of real bricks standing in for cards that are not there. */
  .filler {
    align-items: center;
    display: flex;
    flex: none;
    gap: var(--ha-space-6, 24px);
    min-height: 236px;
    padding: 0 var(--ha-space-4, 16px) 0 var(--ha-space-6, 24px);
  }
  .filler.stacked {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--ha-space-4, 16px);
    justify-content: center;
  }
  .bricks {
    align-items: flex-end;
    display: flex;
    flex: none;
    gap: var(--ha-space-3, 12px);
  }
  .bricks div {
    flex: none;
  }
  .bricks svg {
    display: block;
    height: auto;
    width: 100%;
  }
  .filler .hint {
    color: var(--lego-text-2);
    font-size: var(--ha-font-size-m, 14px);
    line-height: var(--ha-line-height-normal, 1.6);
    max-width: 420px;
  }
`;var ls="/lego_panel/icon.png";function C(i,e){customElements.get(i)||customElements.define(i,e)}var at="lego-changed",cs="lego-toggle",ds="lego-move",wt={collection:{title:"My collection",icon:"mdi:toy-brick-outline"},releases:{title:"New releases",icon:"mdi:new-box"},recent:{title:"Out recently",icon:"mdi:new-box"},upcoming:{title:"Coming soon",icon:"mdi:calendar-clock"},themes:{title:"New in my themes",icon:"mdi:tag-heart-outline"},wishlist:{title:"My wishlist",icon:"mdi:heart-outline"},value:{title:"Collection value",icon:"mdi:chart-donut"},pieces:{title:"Pieces",icon:"mdi:shape-outline"}},y=class extends E{constructor(){super(...arguments);this.entryId="";this.collapsed=!1;this.handle=!1;this.bare=!1;this.dark=!1;this.pending=new Set;this.writeError="";this.toggle=()=>{this.collapsed=!this.collapsed,this.dispatchEvent(new CustomEvent(cs,{detail:{row:this.row,collapsed:this.collapsed},bubbles:!0,composed:!0}))};this.onHandleKey=t=>{let s=t.key==="ArrowUp"?-1:t.key==="ArrowDown"?1:0;s&&(t.preventDefault(),this.dispatchEvent(new CustomEvent(ds,{detail:{row:this.row,step:s},bubbles:!0,composed:!0})))}}actions(){return d}willUpdate(t){t.has("hass")&&(this.dark=!!this.hass?.themes?.darkMode)}render(){let t=wt[this.row];return n`
      <section class=${this.collapsed?"row folded":"row"}>
        <div class="rowhead">
          <button
            class="fold"
            aria-expanded=${!this.collapsed}
            @click=${this.toggle}
          >
            <ha-icon
              class=${this.collapsed?"chev":"chev open"}
              icon="mdi:chevron-right"
            ></ha-icon>
            <ha-icon class="rowicon" icon=${t.icon}></ha-icon>
            <span class="titles">
              <h2>${t.title}</h2>
              <span class="sub">${this.subtitle()}</span>
            </span>
          </button>
          <div class="actions">${this.actions()}</div>
          ${this.handle?n`<button
                  class="drag"
                  draggable="true"
                  title="Drag, or use the arrow keys, to reorder"
                  aria-label=${`Move ${t.title} up or down`}
                  @keydown=${this.onHandleKey}
                >
                  <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
                </button>`:d}
        </div>
        ${this.collapsed?d:this.body()}
        ${this.writeError?n`<p class="caveat bad" role="alert">
                Brickset would not save that change: ${this.writeError}
              </p>`:d}
      </section>
    `}focusHandle(){this.renderRoot.querySelector(".drag")?.focus()}date(t){let s=new Date(t);return Number.isNaN(s.getTime())?t:s.toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short",year:"numeric"})}num(t){return t.toLocaleString(this.hass?.locale?.language)}money(t,s=!0){return Pt(t,this.dash?.currency??null,this.hass?.locale?.language,s)||this.num(Math.round(t))}async toggleOwned(t){if(!this.pending.has(t.set_number)){this.writeError="",this.setPending(t.set_number,!0);try{await this.hass.callService("lego","set_collection",ue(this.dash?.device_id??"",t))}catch(s){this.writeError=S(s);return}finally{this.setPending(t.set_number,!1)}this.dispatchEvent(new CustomEvent(at,{bubbles:!0,composed:!0}))}}setPending(t,s){let r=new Set(this.pending);s?r.add(t):r.delete(t),this.pending=r}linked(t,s,r=!1){let a=Bt(t.url);return a?n`<a
      class="open"
      href=${a}
      target="_blank"
      rel="noopener noreferrer"
      tabindex=${r?"-1":d}
      aria-hidden=${r?"true":d}
      >${s}</a
    >`:s}card(t,s="retirement",r){let a=new Date,o=Bt(t.image),l=Pt(t.retail_price,this.dash?.currency??null,this.hass?.locale?.language);return n`
      <article class="card">
        ${this.linked(t,o?n`<img src=${o} alt="" loading="lazy" />`:n`<img
                class="noart"
                src=${ls}
                alt=""
                loading="lazy"
              />`,!0)}
        <div class="meta">
          ${this.linked(t,n`<span
              class=${et(t)?"name":"name unnamed"}
              title=${et(t)?t.name:"Brickset has not published a name yet"}
              >${U(t)}</span
            >`)}
          <span class="num"
            >${r?n`<span
                    class="key"
                    style="background:${r}"
                    title=${t.theme}
                  ></span>`:d}${[t.set_number,l].filter(Boolean).join(" \xB7 ")}</span
          >
          <span class="when ${ye(t,a,s)}"
            >${xe(t,a,c=>this.date(c),s)}</span
          >
          <div class="foot">
            <span
              class=${t.owned?"state own":t.wanted?"state want":"state"}
              >${t.owned?t.qty_owned>1?`Owned \xD7${t.qty_owned}`:"Owned":t.wanted?"Wanted":""}</span
            >
            <button
              class=${["act",t.owned?"on":"",this.pending.has(t.set_number)?"pending":""].join(" ")}
              ?disabled=${this.pending.has(t.set_number)}
              title=${t.owned?"Remove from your collection":"Add to your collection"}
              aria-label=${t.owned?`Remove ${U(t)} from your collection`:`Add ${U(t)} to your collection`}
              @click=${()=>{this.toggleOwned(t)}}
            >
              <ha-icon icon=${t.owned?"mdi:check":"mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `}filler(t,s=!1,r=.9){return n`<div class=${s?"filler stacked":"filler"}>
      <div class="bricks" aria-hidden="true">
        ${Se.map(a=>n`<div style="width:${Math.round(a.width*.6*r)}px">
              ${yt(a.svg)}
            </div>`)}
      </div>
      <span class="hint">${t}</span>
    </div>`}};y.styles=[G,vt,xt,bt,ze],p([x({attribute:!1})],y.prototype,"hass",2),p([x({attribute:!1})],y.prototype,"dash",2),p([x({attribute:!1})],y.prototype,"entryId",2),p([x({type:Boolean,reflect:!0})],y.prototype,"collapsed",2),p([x({type:Boolean})],y.prototype,"handle",2),p([x({type:Boolean,reflect:!0})],y.prototype,"bare",2),p([x({type:Boolean,reflect:!0})],y.prototype,"dark",2),p([m()],y.prototype,"pending",2),p([m()],y.prototype,"writeError",2);var M=class extends y{constructor(){super(...arguments);this.row="collection";this.refreshing=!1;this.refreshError="";this.setsOpen=!1;this.ownedError="";this.query="";this.results=[]}willUpdate(t){super.willUpdate(t),t.has("dash")&&this.dash!==this.ownedFor&&(this.owned=void 0)}updated(){this.setsOpen&&!this.collapsed&&this.owned===void 0&&this.loadOwned()}async loadOwned(){let t=this.dash;if(!(!t||this.ownedFor===t)){this.ownedFor=t;try{let s=await this.hass.callWS({...T("lego/collection",t.entry_id),filter:"owned"});this.ownedFor===t&&(this.owned=s.sets,this.ownedError="")}catch(s){this.ownedFor===t&&(this.ownedError=S(s))}}}async search(t){if(this.query=t,t.trim().length<2){this.results=[];return}try{let s=await this.hass.callWS({...T("lego/search",this.dash?.entry_id??""),query:t,limit:24});this.query===t&&(this.results=s.sets)}catch{this.results=[]}}async refresh(){this.refreshing=!0,this.refreshError="";try{await this.hass.callService("lego","refresh_collection",ge(this.dash?.device_id??"")),this.dispatchEvent(new CustomEvent(at,{bubbles:!0,composed:!0}))}catch(t){this.refreshError=S(t)}finally{this.refreshing=!1}}subtitle(){return me(this.dash?.last_synced??null,new Date)}short(){let t=this.dash?.quota;return!!t&&t.remaining<t.refresh_cost}actions(){let t=this.dash?.quota;if(!t)return d;let s=k(t.refresh_cost,"call","calls");return n`<button
      class="update"
      ?disabled=${this.refreshing||this.short()}
      title=${this.short()?"Today's Brickset budget is spent":`Fetch your collection from Brickset now, using ${s} of the ${t.remaining} left today`}
      @click=${()=>{this.refresh()}}
    >
      <ha-icon
        icon=${this.refreshing?"mdi:sync":"mdi:cloud-sync"}
      ></ha-icon>
      ${this.refreshing?"Updating\u2026":"Update"}
      <span class="sep" aria-hidden="true"></span>
      <span class="cost">${s}</span>
    </button>`}resumes(t){let s=new Date(t),r=s.toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"});return s.toDateString()===new Date().toDateString()?`at ${r}`:`tomorrow at ${r}`}body(){let t=this.dash?.stats,s=this.dash?.quota;if(!t)return n`<p class="muted">Loading your collection…</p>`;let r=[[t.sets_owned,"Sets owned"],[t.sets_distinct,"Distinct sets"],[t.pieces_owned,"Pieces"],[t.minifigs_owned,"Minifigures"]];return n`
      <div class="stats">
        ${r.map(([a,o])=>n`<div class="stat">
              <span class="n">${this.num(a)}</span
              ><span class="l">${o}</span>
            </div>`)}
      </div>
      ${this.short()&&s?n`<p class="caveat">
              Daily budget spent, ${s.calls_today} of ${s.budget} used,
              so this is the last sync's data. Updates resume
              ${this.resumes(s.resets_at)}.
            </p>`:d}
      ${this.refreshError?n`<p class="caveat bad">${this.refreshError}</p>`:d}
      <div class="subsection">
        <button
          class="fold"
          aria-expanded=${this.setsOpen}
          @click=${()=>this.setsOpen=!this.setsOpen}
        >
          <ha-icon
            class=${this.setsOpen?"chev open":"chev"}
            icon="mdi:chevron-right"
          ></ha-icon>
          <h3>Sets</h3>
          <span class="sub">${this.num(t.sets_distinct)}</span>
        </button>
        ${this.setsOpen?this.sets():d}
      </div>
    `}sets(){let t=this.query.trim().length>=2,s=t?this.results:this.owned??[];return n`
      <div class="searchbox">
        <input
          class="search"
          type="search"
          .value=${this.query}
          placeholder="Search your sets and the full catalogue…"
          aria-label="Search sets"
          @input=${r=>{this.search(r.target.value)}}
        />
        ${this.query?n`<button
                class="clear"
                aria-label="Clear search"
                @click=${()=>{this.search("")}}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`:d}
      </div>
      ${this.ownedError&&!t?n`<p class="caveat bad">${this.ownedError}</p>`:this.owned===void 0&&!t?n`<p class="muted">Loading your sets…</p>`:n`<p class="muted count">
                  ${t?k(s.length,"matching set","matching sets"):`${k(s.length,"set owned","sets owned")}, by theme then name`}
                </p>
                <div class="grid">
                  ${s.map(r=>this.card(r))}
                </div>`}
    `}};M.styles=[y.styles,b`
      /* Lines drawn per cell, so an odd last cell leaves no grey gap. */
      .stats {
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--lego-radius);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        overflow: hidden;
      }
      .stat {
        box-shadow: 0 0 0 var(--lego-line) var(--lego-outline);
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-1, 4px);
        padding: var(--ha-space-4, 16px);
      }
      .stat .n {
        font-size: var(--ha-font-size-2xl, 24px);
        font-variant-numeric: tabular-nums;
        font-weight: var(--ha-font-weight-bold, 700);
        line-height: var(--ha-line-height-condensed, 1.2);
      }
      .stat .l {
        color: var(--lego-text-2);
        font-size: var(--ha-font-size-s, 12px);
      }
      .searchbox {
        position: relative;
      }
      .search {
        background: var(--lego-ground);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        box-sizing: border-box;
        color: inherit;
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
        min-height: 48px;
        padding: 0 48px 0 var(--ha-space-3, 12px);
        width: 100%;
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
      .count {
        margin-bottom: var(--ha-space-3, 12px);
      }
    `],p([m()],M.prototype,"refreshing",2),p([m()],M.prototype,"refreshError",2),p([m()],M.prototype,"setsOpen",2),p([m()],M.prototype,"owned",2),p([m()],M.prototype,"ownedError",2),p([m()],M.prototype,"query",2),p([m()],M.prototype,"results",2);C("lego-collection-row",M);var Re=["releases","themes"],hs=6,A=class extends y{constructor(){super(...arguments);this.kind="releases";this.error="";this.adding=!1;this.draft="";this.following=!1;this.followNote="";this.filterFor="";this.requested=""}get row(){return this.kind}willUpdate(t){super.willUpdate(t);let s=`${this.dash?.entry_id}:${this.kind}`;this.dash&&s!==this.filterFor&&(this.filterFor=s,this.filter=q(this.kind,this.dash),this.data=void 0)}updated(){!this.collapsed&&this.filter&&this.dash&&this.hass&&this.fetch()}async fetch(){let t=this.filter,s=this.dash;if(!t||!s||s.release_status[t.scope]===null)return;let r=JSON.stringify([s.entry_id,t]);if(!(r===this.requested&&this.requestedWith===s)){this.requested=r,this.requestedWith=s;try{let a=await ke(this.hass,s.entry_id,t);this.requested===r&&(this.data=a,this.error="")}catch(a){this.requested===r&&(this.error=S(a))}}}pick(t){this.filter&&(this.filter={...this.filter,...t})}status(){return this.filter?this.dash?.release_status[this.filter.scope]:void 0}subtitle(){let t=this.status();return t==null?"":t==="fetching"?"Fetching releases\u2026":t==="failed"?"Couldn't fetch releases":this.data?k(this.data.sets.length,"set","sets"):"Loading\u2026"}actions(){return!this.filter||this.status()===null?d:n`<div class="pills" role="group" aria-label="Time span">
      ${st[this.kind].map(t=>n`<button
            class=${t===this.filter?.span?"pill on":"pill"}
            aria-pressed=${t===this.filter?.span}
            @click=${()=>this.pick({span:t})}
          >
            ${pt[t]}
          </button>`)}
    </div>`}body(){let t=this.filter,s=this.dash;if(!t||!s)return n`<p class="muted">Loading…</p>`;let r=this.status();return r===null?n`<p class="muted">${this.unavailable()}</p>
        ${this.kind==="recent"||this.kind==="upcoming"?d:this.followControls()}`:r==="fetching"?n`<p class="muted">Fetching this year's releases…</p>`:r==="failed"?n`<p class="muted">
        Couldn't fetch this year's releases. They're tried again every few hours
        until they arrive.
      </p>`:n`
      ${Re.includes(this.kind)?this.chips(t):d}
      ${Re.includes(this.kind)&&this.data?this.timeline(this.data):d}
      ${this.error?n`<p class="caveat bad">${this.error}</p>`:d}
      ${this.cards()}
    `}unavailable(){return this.kind==="recent"||this.kind==="upcoming"?"Turn on Follow releases across all themes in the integration's options for this row.":this.kind==="themes"?this.dash?.can_change?"No themes followed yet. Follow one to see its new sets here.":"No themes followed yet.":this.dash?.can_change?"Follow a theme, or turn on Follow releases across all themes in the integration's options, to see new sets here.":"No themes followed yet."}chips(t){let s=this.dash,r=rt(s.followed),a=(o,l)=>{let c=t.scope===o&&(o==="all"||!t.themes.length);return n`<button
        class=${c?"chip on":"chip"}
        aria-pressed=${c}
        @click=${()=>this.pick({scope:o,themes:[]})}
      >
        ${l}
      </button>`};return n`<div class="chips">
        ${this.kind==="releases"&&s.release_status.all!==null?a("all","Everything"):d}
        ${s.followed.length?a("mine",this.kind==="themes"?"All my themes":"My themes"):d}
        ${s.followed.length&&this.kind==="releases"?n`<span class="divider" aria-hidden="true"></span>`:d}
        ${s.followed.map(o=>{let l=t.scope==="mine"&&t.themes.includes(o);return n`<button
            class=${l?"chip on":"chip"}
            aria-pressed=${l}
            @click=${()=>this.pick({scope:"mine",themes:ut(t.scope==="mine"?t.themes:[],o,s.followed)})}
          >
            <span
              class="key"
              style="background:${it(r.get(o))}"
            ></span>
            ${o}
          </button>`})}
        ${this.followChip()}
      </div>
      ${this.adding?this.editor():d}`}followControls(){return this.dash?.can_change?n`<div class="chips">${this.followChip()}</div>
      ${this.adding?this.editor():d}`:d}followChip(){return!this.dash?.can_change||this.adding?d:n`<button class="chip" @click=${()=>{this.openEditor()}}>
      <ha-icon icon="mdi:plus"></ha-icon>
      Follow a theme
    </button>`}async openEditor(){this.adding=!0,this.followNote="",await this.loadThemes()}async loadThemes(){try{this.themeList=await this.hass.callWS(T("lego/themes",this.entryId||this.dash?.entry_id||""))}catch(t){this.followNote=S(t)}}editor(){let t=this.themeList,s=t?.followed??this.dash?.followed??[],r=new Set(s.map(l=>l.toLowerCase())),a=t?t.follow_cost?k(t.follow_cost,"call","calls"):"free":"\u2026",o=`lego-themes-${this.kind}`;return n`<div class="follow">
        <input
          list=${o}
          .value=${this.draft}
          placeholder="Theme name, such as Technic"
          aria-label="Theme to follow"
          @input=${l=>{this.draft=l.target.value}}
          @keydown=${l=>{l.key==="Enter"&&this.follow(this.draft,!0)}}
        />
        <datalist id=${o}>
          ${(t?.themes??[]).filter(l=>!r.has(l.toLowerCase())).map(l=>n`<option value=${l}></option>`)}
        </datalist>
        <button
          class="update"
          ?disabled=${!this.draft.trim()||this.following}
          title=${`Follow this theme, using ${a} of today's Brickset budget`}
          @click=${()=>{this.follow(this.draft,!0)}}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          ${this.following?"Following\u2026":"Follow"}
          <span class="sep" aria-hidden="true"></span>
          <span class="cost">${a}</span>
        </button>
        <button class="link" @click=${()=>this.adding=!1}>Done</button>
      </div>
      ${s.length?n`<div class="chips" role="group" aria-label="Themes you follow">
              ${s.map(l=>n`<button
                    class="chip"
                    aria-label=${`Stop following ${l}`}
                    ?disabled=${this.following}
                    @click=${()=>{this.follow(l,!1)}}
                  >
                    ${l}
                    <ha-icon class="drop" icon="mdi:close"></ha-icon>
                  </button>`)}
            </div>`:d}
      ${this.followNote?n`<p class="caveat" role="status">${this.followNote}</p>`:d}`}async follow(t,s){let r=t.trim();if(!(!r||this.following)){this.following=!0,this.followNote="";try{let a=await this.hass.callWS({...T("lego/themes/follow",this.entryId||this.dash?.entry_id||""),theme:r,follow:s});s&&(this.draft=""),a.complete||(this.followNote=`Following ${r}. Its sets arrive with the next check, as today's budget is spent.`),await this.loadThemes()}catch(a){this.followNote=S(a);return}finally{this.following=!1}this.dispatchEvent(new CustomEvent(at,{bubbles:!0,composed:!0}))}}colourOf(t){let s=this.dash,r=rt(s.followed),a=s.followed.find(o=>o.toLowerCase()===t.toLowerCase());return it(a?r.get(a):"other")}stack(t,s,r,a){let o=t.at>=r-.01&&t.at<=a+.01,l=jt(t.themes.length),c=jt(t.themes.length,14),h=this.hass?.locale?.language,g=f=>new Date(f).toLocaleDateString(h,{day:"numeric",month:"short"}),u=t.points.slice(0,hs),v=t.at<P*.25?"tip start":t.at>P*.75?"tip end":"tip";return n`<button
      class=${o?"stack":"stack out"}
      style="left:${s(t.at)}"
      aria-label=${t.points.map(f=>`${U(f)}, ${g(f.date)}`).join("; ")}
    >
      ${t.themes.map((f,_)=>n`<span
            class="disc"
            style="--rest:${l[_]}px;--fan:${c[_]}px;background:${this.colourOf(f)};z-index:${10-_}"
          ></span>`)}
      ${t.extra?n`<span class="extra">+${t.extra}</span>`:d}
      <span class=${v} aria-hidden="true">
        ${u.map(f=>n`<span class="tipline">
              <span
                class="key"
                style="background:${this.colourOf(f.theme)}"
              ></span>
              <span class="tipname">${U(f)}</span>
              <span class="tipdate">${g(f.date)}</span>
            </span>`)}
        ${t.points.length>u.length?n`<span class="tipmore"
                >+${t.points.length-u.length} more</span
              >`:d}
      </span>
    </button>`}timeline(t){let s=new Date,r=new Date(s.getFullYear(),0,1),a=u=>`${u/P*100}%`,o=Math.max(W(r,t.span.from),0),l=t.span.to?Math.min(W(r,t.span.to),P):P,c=be(t.timeline,r),h=this.hass?.locale?.language,g=t.timeline.filter(u=>{let v=W(r,u.date);return v>=o&&v<=l}).length;return n`<div
      class="timeline"
      role="group"
      aria-label=${`${k(t.timeline.length,"set","sets")} from January to next March, ${g} in the chosen span`}
    >
      <div class="line"></div>
      <div
        class="window"
        style="left:${a(o)};width:${a(Math.max(l-o,0))}"
      ></div>
      ${c.map(u=>this.stack(u,a,o,l))}
      <ha-icon
        class="today"
        icon="mdi:chevron-down"
        style="left:${a(W(r,s))}"
      ></ha-icon>
      ${Array.from({length:P},(u,v)=>{let f=new Date(r.getFullYear(),v,1).toLocaleDateString(h,{month:"short"});return n`<span
          class=${v%3===0?"month quarter":"month"}
          style="left:${a(v)};width:${a(1)}"
          aria-hidden="true"
          >${f}</span
        >`})}
    </div>`}cards(){let t=this.data?.sets;if(!t)return n`<p class="muted">Loading…</p>`;if(!t.length){let s=this.filter&&["next1","next3","coming"].includes(this.filter.span);return this.filler(s?"Nothing due in this span yet.":"Nothing new in this span. Try a longer one.")}return n`<div class="carousel">
      ${t.map(s=>this.card(s,"release",this.colourOf(s.theme)))}
    </div>`}};A.styles=[y.styles,b`
      .follow {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: var(--ha-space-2, 8px);
        margin: 0 0 var(--ha-space-3, 12px);
      }
      .follow input {
        background: var(--lego-ground);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        box-sizing: border-box;
        color: inherit;
        flex: 1 1 220px;
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
        min-height: 40px;
        padding: 0 var(--ha-space-3, 12px);
      }
      .chip .drop {
        --mdc-icon-size: 18px;
        margin-inline-end: calc(-1 * var(--ha-space-2, 8px));
      }
      .timeline {
        height: 64px;
        margin: var(--ha-space-2, 8px) 0 var(--ha-space-3, 12px);
        position: relative;
      }
      .timeline .line {
        background: var(--lego-outline);
        height: 2px;
        left: 0;
        position: absolute;
        right: 0;
        top: 20px;
      }
      .timeline .window {
        background: var(--lego-pick);
        border-radius: var(--ha-border-radius-sm, 4px);
        height: 34px;
        position: absolute;
        top: 4px;
      }
      .timeline .stack {
        appearance: none;
        background: none;
        border: 0;
        border-radius: 50%;
        cursor: default;
        height: 24px;
        padding: 0;
        position: absolute;
        top: 21px;
        transform: translate(-50%, -50%);
        width: 24px;
      }
      .timeline .stack:hover,
      .timeline .stack:focus-visible {
        z-index: 30;
      }
      .timeline .stack.out {
        opacity: 0.35;
      }
      .timeline .disc {
        border-radius: 50%;
        box-shadow: 0 0 0 2px var(--lego-surface);
        height: 10px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, calc(-50% + var(--rest, 0px)));
        transition: transform var(--ha-animation-duration-normal, 250ms)
          ease-out;
        width: 10px;
      }
      /* The overlapping discs spread apart, so each can be told from the next. */
      .timeline .stack:hover .disc,
      .timeline .stack:focus-visible .disc {
        transform: translate(-50%, calc(-50% + var(--fan, 0px)));
      }
      .timeline .extra {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-pill, 9999px);
        color: var(--lego-text);
        font-size: 10px;
        font-weight: var(--ha-font-weight-bold, 700);
        left: calc(50% + 9px);
        line-height: 14px;
        padding: 0 4px;
        position: absolute;
        top: 5px;
      }
      .timeline .tip {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        color: var(--lego-text);
        display: grid;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-1, 4px);
        left: 50%;
        max-width: 280px;
        min-width: 200px;
        opacity: 0;
        padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
        pointer-events: none;
        position: absolute;
        text-align: start;
        top: calc(100% + 32px);
        transform: translateX(-50%);
        transition: opacity var(--ha-animation-duration-fast, 150ms);
        visibility: hidden;
        width: max-content;
      }
      .timeline .tip.start {
        left: 0;
        transform: none;
      }
      .timeline .tip.end {
        left: auto;
        right: 0;
        transform: none;
      }
      .timeline .stack:hover .tip,
      .timeline .stack:focus-visible .tip {
        opacity: 1;
        visibility: visible;
      }
      .timeline .tipline {
        align-items: center;
        display: grid;
        gap: var(--ha-space-2, 8px);
        grid-template-columns: 10px minmax(0, 1fr) auto;
      }
      .timeline .tipname {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .timeline .tipdate,
      .timeline .tipmore {
        color: var(--lego-text-2);
        font-variant-numeric: tabular-nums;
      }
      .timeline .today {
        --mdc-icon-size: 20px;
        color: var(--lego-primary);
        position: absolute;
        top: 6px;
        transform: translateX(-50%);
      }
      .timeline .month {
        color: var(--lego-text-2);
        font-size: 11px;
        position: absolute;
        text-align: center;
        top: 46px;
      }
      /* Too narrow for every month: the quarters alone. */
      @container (max-width: 720px) {
        .timeline .month:not(.quarter) {
          visibility: hidden;
        }
      }
    `],p([x()],A.prototype,"kind",2),p([m()],A.prototype,"filter",2),p([m()],A.prototype,"data",2),p([m()],A.prototype,"error",2),p([m()],A.prototype,"adding",2),p([m()],A.prototype,"themeList",2),p([m()],A.prototype,"draft",2),p([m()],A.prototype,"following",2),p([m()],A.prototype,"followNote",2);C("lego-releases-row",A);var ps=365,us=12,De=70,Ht=2*Math.PI*De,gs=1.5,F=class extends y{constructor(){super(...arguments);this.kind="value";this.hover="";this.trendOpen=!1;this.hoverPoint=null;this.historyFor=""}get row(){return this.kind}willUpdate(t){super.willUpdate(t);let s=`${this.dash?.entry_id}:${this.kind}`;this.dash&&s!==this.historyFor&&(this.historyFor=s,this.history=void 0)}updated(){this.trendOpen&&!this.collapsed&&this.history===void 0&&this.loadHistory()}format(t){return this.kind==="value"?this.money(t):this.num(Math.round(t))}subtitle(){let t=this.dash?.stats;return t?this.kind==="value"?`${this.money(t.value)} at LEGO.com RRP`:k(t.pieces_owned,"piece","pieces"):""}body(){let t=this.dash?.stats;if(!t)return n`<p class="muted">Loading…</p>`;let s=ve(this.dash?.by_theme??[],this.kind),r=this.kind==="value"?t.value:t.pieces_owned;if(!s.length)return n`<p class="muted">
        Nothing owned with a published figure yet.
      </p>`;let a=rt(s.filter(l=>!l.other).map(l=>l.theme)),o=l=>it(l.other?"other":a.get(l.theme));return n`
      <div class="chart">
        ${this.donut(s,r,o)} ${this.bars(s,r,o)}
      </div>
      <p class="footnote">
        <span
          >${this.kind==="value"&&t.sets_missing_price?`${k(t.sets_missing_price,"set has","sets have")} no published price and ${t.sets_missing_price===1?"is":"are"} not counted.`:""}</span
        >
        ${this.kind==="value"?n`<span>At LEGO.com RRP</span>`:d}
      </p>
      ${this.trend()}
    `}donut(t,s,r){let a=t.reduce((h,g)=>h+g.amount,0)||1,o=0,l=t.map(h=>{let g=Math.max(h.amount/a*Ht-gs,.5),u=R`<circle
        cx="100"
        cy="100"
        r=${De}
        fill="none"
        stroke=${r(h)}
        stroke-width=${this.hover===h.theme?34:28}
        stroke-dasharray=${`${g} ${Ht-g}`}
        stroke-dashoffset=${-o}
        class=${this.hover&&this.hover!==h.theme?"faded":""}
        @mouseenter=${()=>this.hover=h.theme}
        @mouseleave=${()=>this.hover=""}
      ></circle>`;return o+=h.amount/a*Ht,u}),c=t.find(h=>h.theme===this.hover);return n`<div class="donut">
      <svg
        viewBox="0 0 200 200"
        width="240"
        height="240"
        role="img"
        aria-label=${`${this.subtitle()}, by theme`}
      >
        ${l}
      </svg>
      <div class="centre">
        <span class="n">${this.format(c?c.amount:s)}</span>
        <span class="l">${c?c.theme:"in total"}</span>
      </div>
    </div>`}bars(t,s,r){let a=t.reduce((o,l)=>Math.max(o,l.amount),0)||1;return n`<ul class="bars">
      ${t.map((o,l)=>{let c=this.hover===o.theme,h=this.hover&&!c,g=o.setNumbers.slice(0,us),u=o.setNumbers.length-g.length;return n`<li>
          <button
            class=${c?"bar-row on":"bar-row"}
            aria-describedby=${`tip-${l}`}
            @mouseenter=${()=>this.hover=o.theme}
            @mouseleave=${()=>this.hover=""}
            @focus=${()=>this.hover=o.theme}
            @blur=${()=>this.hover=""}
          >
            <span class="label"
              ><span class="key" style="background:${r(o)}"></span
              >${o.theme}</span
            >
            <span class="track">
              <span
                class=${h?"bar faded":"bar"}
                style="width:${Math.max(o.amount/a*100,1)}%;background:${r(o)}"
              ></span>
              <span class="amount">${this.format(o.amount)}</span>
            </span>
            ${c?n`<span class="tip" role="tooltip" id=${`tip-${l}`}>
                    <b>${o.theme} · ${this.format(o.amount)}</b>
                    ${Math.round(o.amount/(s||1)*100)}% of the
                    collection, ${k(o.sets,"set","sets")}
                    ${g.length?n`<span class="numbers"
                            >${g.join(", ")}${u?`, and ${u} more`:""}</span
                          >`:d}
                  </span>`:d}
          </button>
        </li>`})}
    </ul>`}trend(){let t=Array.isArray(this.history)?this.history:null;return n`<div class="subsection">
      <button
        class="fold"
        aria-expanded=${this.trendOpen}
        @click=${()=>this.trendOpen=!this.trendOpen}
      >
        <ha-icon
          class=${this.trendOpen?"chev open":"chev"}
          icon="mdi:chevron-right"
        ></ha-icon>
        <h3>Trend over a year</h3>
        ${t?n`<span class="sub"
                >${this.format(t[0].v)} →
                ${this.format(t[t.length-1].v)}</span
              >`:d}
      </button>
      ${this.trendOpen?this.trendChart():d}
    </div>`}async loadHistory(){let t=this.dash?.history?.[this.kind],s=this.historyFor;if(!t){this.history="none";return}this.history="loading";try{let r=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(Date.now()-ps*864e5).toISOString(),statistic_ids:[t],period:"week",types:this.kind==="value"?["state"]:["mean"]});if(s!==this.historyFor)return;let a=fe(r[t]??[]);this.history=a.length>=2?a:"none"}catch{s===this.historyFor&&(this.history="none")}}trendChart(){let t=this.history;if(t===void 0||t==="loading")return n`<p class="muted">Loading the trend…</p>`;if(t==="none")return n`<p class="muted">
        No history yet. Home Assistant records it weekly from the sensor, so a
        line appears after a couple of weeks.
      </p>`;let s=t,r=Math.min(...s.map($=>$.v)),o=Math.max(...s.map($=>$.v))-r||1,l=s[0].t,c=s[s.length-1].t-l||1,h=$=>($.t-l)/c*100,g=$=>90-($.v-r)/o*80,u=s.map($=>`${h($)},${g($)}`).join(" "),v=s[s.length-1],f=this.hoverPoint===null?void 0:s[this.hoverPoint],_=f??v,$t=$=>new Date($).toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short"});return n`
      <div
        class="plot"
        @pointermove=${$=>{let Vt=$.currentTarget.getBoundingClientRect(),Yt=l+($.clientX-Vt.left)/Vt.width*c,kt=0;s.forEach((Pe,Be)=>{Math.abs(Pe.t-Yt)<Math.abs(s[kt].t-Yt)&&(kt=Be)}),this.hoverPoint=kt}}
        @pointerleave=${()=>this.hoverPoint=null}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line class="base" x1="0" y1="100" x2="100" y2="100"></line>
          <polygon class="wash" points=${`0,100 ${u} 100,100`}></polygon>
          <polyline class="trace" points=${u}></polyline>
          ${f?R`<line class="cross" x1=${h(f)} y1="0" x2=${h(f)} y2="100"></line>`:d}
        </svg>
        <span class="dot" style="left:${h(_)}%;top:${g(_)}%"></span>
        <span
          class="readout"
          style="left:${Math.min(Math.max(h(_),12),88)}%"
          >${this.format(_.v)} · ${$t(_.t)}</span
        >
      </div>
      <div class="axis">
        <span>${$t(s[0].t)}</span><span>${$t(v.t)}</span>
      </div>
    `}};F.styles=[y.styles,b`
      .chart {
        align-items: center;
        display: grid;
        gap: var(--ha-space-8, 32px);
        grid-template-columns: 240px minmax(0, 1fr);
        padding: var(--ha-space-2, 8px) 0 var(--ha-space-1, 4px);
      }
      @media (max-width: 640px) {
        .chart {
          grid-template-columns: minmax(0, 1fr);
          justify-items: center;
        }
      }
      .donut {
        height: 240px;
        position: relative;
        width: 240px;
      }
      .donut svg {
        display: block;
        transform: rotate(-90deg);
      }
      .donut circle {
        transition:
          opacity var(--ha-animation-duration-fast, 150ms),
          stroke-width var(--ha-animation-duration-fast, 150ms);
      }
      .centre {
        align-items: center;
        display: flex;
        flex-direction: column;
        inset: 0;
        justify-content: center;
        pointer-events: none;
        position: absolute;
        text-align: center;
      }
      .centre .n {
        font-size: var(--ha-font-size-3xl, 28px);
        font-variant-numeric: tabular-nums;
        font-weight: var(--ha-font-weight-bold, 700);
        line-height: var(--ha-line-height-condensed, 1.2);
      }
      .centre .l {
        color: var(--lego-text-2);
        font-size: var(--ha-font-size-s, 12px);
        margin-top: var(--ha-space-1, 4px);
        max-width: 120px;
      }
      .bars {
        display: grid;
        gap: var(--ha-space-1, 4px);
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;
      }
      .bar-row {
        align-items: center;
        appearance: none;
        background: none;
        border: 0;
        border-radius: var(--ha-border-radius-sm, 4px);
        color: inherit;
        display: grid;
        font: inherit;
        gap: var(--ha-space-3, 12px);
        grid-template-columns: minmax(80px, 30%) 1fr;
        min-height: 32px;
        padding: 0 var(--ha-space-1, 4px);
        position: relative;
        text-align: left;
        width: 100%;
      }
      .bar-row.on {
        background: var(--lego-ground);
      }
      .label {
        align-items: center;
        display: flex;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-2, 8px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .label .key {
        border-radius: 2px;
        box-shadow: none;
      }
      .track {
        align-items: center;
        display: flex;
        gap: var(--ha-space-2, 8px);
        min-width: 0;
      }
      .bar {
        border-radius: 0 var(--ha-border-radius-sm, 4px)
          var(--ha-border-radius-sm, 4px) 0;
        flex: none;
        height: 16px;
        max-width: calc(100% - 72px);
        transition: opacity var(--ha-animation-duration-fast, 150ms);
      }
      .faded {
        opacity: 0.35;
      }
      .amount {
        font-size: var(--ha-font-size-s, 12px);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .tip {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        box-shadow: 0 4px 16px rgb(0 0 0 / 0.14);
        font-size: var(--ha-font-size-s, 12px);
        left: 30%;
        line-height: var(--ha-line-height-normal, 1.6);
        max-width: 320px;
        padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
        position: absolute;
        top: calc(100% + 2px);
        z-index: 3;
      }
      .tip b {
        display: block;
        font-size: var(--ha-font-size-m, 14px);
      }
      .tip .numbers {
        display: block;
        font-variant-numeric: tabular-nums;
        margin-top: var(--ha-space-1, 4px);
      }
      .footnote {
        color: var(--lego-text-2);
        display: flex;
        flex-wrap: wrap;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-2, 8px);
        justify-content: space-between;
        margin: var(--ha-space-3, 12px) 0 0;
      }
      .plot {
        height: 140px;
        margin-bottom: var(--ha-space-2, 8px);
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
        border-radius: 50%;
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
      .axis {
        color: var(--lego-text-2);
        display: flex;
        font-size: var(--ha-font-size-s, 12px);
        justify-content: space-between;
        margin-bottom: var(--ha-space-2, 8px);
      }
    `],p([x()],F.prototype,"kind",2),p([m()],F.prototype,"hover",2),p([m()],F.prototype,"trendOpen",2),p([m()],F.prototype,"history",2),p([m()],F.prototype,"hoverPoint",2);C("lego-value-row",F);var Fe="Mark sets as wanted on Brickset and they land here.",It=class extends y{constructor(){super(...arguments);this.row="wishlist"}subtitle(){return k(this.dash?.wishlist.length??0,"set","sets")}body(){let t=this.dash?.wishlist??[];return t.length?n`<div class="carousel">
      ${t.map(s=>this.card(s))} ${this.filler(Fe,!0)}
    </div>`:this.filler(`Nothing on your wishlist yet. ${Fe}`)}};C("lego-wishlist-row",It);var z=class extends E{constructor(){super(...arguments);this.error="";this.loadedFor=null;this.reload=()=>{this.loadedFor=null,this.requestUpdate()}}setConfig(t){if(!t)throw new Error("Invalid configuration");this.config=t,this.loadedFor=null}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),window.addEventListener(mt,this.reload)}disconnectedCallback(){window.removeEventListener(mt,this.reload),super.disconnectedCallback()}updated(){let t=this.config?.account??"";this.hass&&this.config&&this.loadedFor!==t&&(this.loadedFor=t,$e(this.hass,t).then(s=>{this.dash=s,this.error=""}).catch(s=>this.error=S(s)))}render(){return n`<ha-card
      @lego-changed=${()=>ft()}
      @lego-toggle=${t=>t.stopPropagation()}
    >
      ${this.error?n`<div class="error">${this.error}</div>`:this.dash&&this.hass?this.row(this.dash):d}
    </ha-card>`}};z.styles=[G,b`
      :host {
        display: block;
        min-width: 0;
      }
      ha-card {
        overflow: hidden;
      }
      .error {
        color: var(--ha-color-on-danger-normal, #b30532);
        padding: var(--ha-space-4, 16px);
      }
    `],p([x({attribute:!1})],z.prototype,"hass",2),p([m()],z.prototype,"config",2),p([m()],z.prototype,"dash",2),p([m()],z.prototype,"error",2);var qt=class extends z{row(e){return n`<lego-collection-row
      bare
      .hass=${this.hass}
      .dash=${e}
      .entryId=${e.entry_id}
    ></lego-collection-row>`}},Wt=class extends z{row(e){return n`<lego-wishlist-row
      bare
      .hass=${this.hass}
      .dash=${e}
      .entryId=${e.entry_id}
    ></lego-wishlist-row>`}},Gt=class extends z{row(e){return n`<lego-value-row
      bare
      .kind=${this.config?.measure==="pieces"?"pieces":"value"}
      .hass=${this.hass}
      .dash=${e}
      .entryId=${e.entry_id}
    ></lego-value-row>`}},Kt=class extends z{row(e){let t=this.config?.row??"releases",s={};this.config?.scope&&(s.scope=this.config.scope),this.config?.themes&&(s.themes=this.config.themes),this.config?.span&&(s.span=this.config.span);let r={...e,release_filters:{...e.release_filters,[t]:{...q(t,e),...s}}};return n`<lego-releases-row
      bare
      .kind=${t}
      .hass=${this.hass}
      .dash=${r}
      .entryId=${e.entry_id}
    ></lego-releases-row>`}},ms=[["lego-collection-card",qt,"LEGO collection","Your Brickset collection's totals, with every set and a search."],["lego-releases-card",Kt,"LEGO releases","New and upcoming sets, across every theme or the ones you follow."],["lego-wishlist-card",Wt,"LEGO wishlist","The sets you want, soonest to retire first."],["lego-value-card",Gt,"LEGO collection value","What your collection is worth at LEGO.com RRP, by theme."]];for(let[i,e,t,s]of ms)C(i,e),window.customCards=window.customCards??[],window.customCards.some(r=>r.type===i)||window.customCards.push({type:i,name:t,description:s});var Oe=["releases","recent","upcoming","themes"],w=class extends E{constructor(){super(...arguments);this.narrow=!1;this.dark=!1;this.error="";this.accounts=[];this.account="";this.defaultAccount="";this.switching="";this.picking=!1;this.customising=!1;this.folded={};this.dragging="";this.over="";this.foldedFor="";this.onToggle=t=>{let{row:s,collapsed:r}=t.detail;this.folded={...this.folded,[s]:r}};this.onMove=t=>{let{row:s,step:r}=t.detail;this.move(s,r,this.visible())};this.onChanged=()=>{ft(),this.load()};this.onPickerKey=t=>{t.key==="Escape"&&this.picking&&(this.picking=!1,this.renderRoot.querySelector(".account")?.focus())};this.onOutside=t=>{let s=this.renderRoot.querySelector(".accountpick");this.picking&&s&&!t.composedPath().includes(s)&&(this.picking=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this.onOutside),this.load()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this.onOutside)}willUpdate(){this.dark=!!this.hass?.themes?.darkMode}async load(){try{if(!this.accounts.length){let s=await this.hass.callWS({type:"lego/accounts"});this.accounts=s.accounts,this.account=s.selected??"",this.defaultAccount=this.account}let t=await this.hass.callWS(T("lego/dashboard",this.account));t.entry_id!==this.foldedFor&&(this.foldedFor=t.entry_id,this.folded=Object.fromEntries(t.collapsed.map(s=>[s,!0]))),this.dash=t,this.error=""}catch(t){this.error=S(t)}}async selectAccount(t){if(t!==this.account){this.account=t,this.switching=this.accounts.find(s=>s.entry_id===t)?.name??"account";try{await this.load()}finally{this.switching=""}}}async makeDefault(t){try{await this.hass.callWS({type:"lego/account/set",config_entry_id:t}),this.defaultAccount=t}catch(s){this.error=S(s)}}async save(t){if(this.dash){this.dash={...this.dash,...t};try{let s=await this.hass.callWS({type:"lego/panel_config/set",...t});this.dash&&(this.dash={...this.dash,...s})}catch{}}}visible(){let t=this.dash;return t?Nt(t.rows,t.release_mode).filter(s=>!t.hidden.includes(s)):[]}move(t,s,r){if(!this.dash)return;let a=we(this.dash.rows,r,t,s);a!==this.dash.rows&&(this.save({rows:a}),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-row="${t}"] > *`)?.focusHandle?.()))}onDrop(t,s){let r=this.dragging;if(this.dragging="",this.over="",!this.dash||!r||r===t)return;let a=this.dash.rows.filter(c=>c!==r),o=a.indexOf(t),l=s.indexOf(r)<s.indexOf(t);a.splice(o+(l?1:0),0,r),this.save({rows:a})}render(){return n`
      <div class="app">
        ${this.renderHeader()}
        ${this.switching?n`<p class="muted switching" role="status">
                Loading ${this.switching}…
              </p>`:d}
        <div
          class=${this.switching?"busy":""}
          aria-busy=${!!this.switching}
        >
          ${this.error?n`<div class="error" role="alert">
                  <p>${this.error}</p>
                  <button class="link" @click=${()=>{this.load()}}>
                    Try again
                  </button>
                </div>`:this.renderHome()}
        </div>
      </div>
    `}renderHeader(){let t=this.dash?.quota,s=t?Math.min(t.calls_today/(t.budget||1),1):0,r=!!t&&t.remaining<t.refresh_cost*3;return n`<header class=${this.narrow?"narrow":""}>
      <div class="title">
        ${this.narrow?n`<ha-menu-button
                .hass=${this.hass}
                .narrow=${this.narrow}
              ></ha-menu-button>`:d}
        <span class="logo">${yt(_e)}</span>
        <h1>LEGO</h1>
      </div>
      ${t?n`<div
              class=${r?"meter tight":"meter"}
              title=${`Your budget is ${t.budget} Brickset calls a day, of the 100 Brickset allows. It resets at ${new Date(t.resets_at).toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"})}.`}
            >
              <span class="meter-label">Brickset calls</span>
              <span
                class="meter-bar"
                role="meter"
                aria-label="Brickset calls used today"
                aria-valuemin="0"
                aria-valuemax=${t.budget}
                aria-valuenow=${t.calls_today}
                ><span style="width:${s*100}%"></span
              ></span>
              <span>${t.calls_today} of ${t.budget} today</span>
            </div>`:d}
      ${this.accounts.length>1?this.accountPicker():d}
    </header>`}accountPicker(){let t=this.accounts.find(s=>s.entry_id===this.account);return n`<div class="accountpick" @keydown=${this.onPickerKey}>
      <div class="accountbar">
        <button
          class="account"
          aria-haspopup="true"
          aria-expanded=${this.picking}
          aria-label=${`Brickset account: ${t?.name??""}`}
          @click=${()=>this.picking=!this.picking}
        >
          <span class="names" aria-hidden="true">
            ${this.accounts.map(s=>n`<span
                  class=${s.entry_id===t?.entry_id?"name":"name ghost"}
                  >${s.name}</span
                >`)}
          </span>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
        ${t?this.brickButton(t):d}
      </div>
      ${this.picking?n`<ul class="menu">
              ${this.accounts.map(s=>n`<li>
                    <button
                      class="pick"
                      aria-current=${s.entry_id===this.account}
                      @click=${()=>{this.picking=!1,this.selectAccount(s.entry_id)}}
                    >
                      ${s.name}
                    </button>
                    ${this.brickButton(s)}
                  </li>`)}
            </ul>`:d}
    </div>`}brickButton(t){let s=t.entry_id===this.defaultAccount,r=s?`${t.name} opens by default`:`Open ${t.name} by default`;return n`<button
      class="brick"
      title=${r}
      aria-label=${r}
      aria-pressed=${s}
      @click=${()=>{s?void 0:this.makeDefault(t.entry_id)}}
    >
      <ha-icon
        icon=${s?"mdi:toy-brick":"mdi:toy-brick-outline"}
      ></ha-icon>
    </button>`}renderHome(){let t=this.dash;if(!t)return n`<p class="muted pad">Loading your collection…</p>`;let s=this.visible(),r=s.some(a=>!this.folded[a]);return n`<div
      class="rows"
      @lego-toggle=${this.onToggle}
      @lego-move=${this.onMove}
      @lego-changed=${this.onChanged}
    >
      <div class="homebar">
        <button
          class="link"
          @click=${()=>this.folded=Object.fromEntries(s.map(a=>[a,r]))}
        >
          ${r?"Collapse all":"Expand all"}
        </button>
        <button
          class="link"
          aria-expanded=${this.customising}
          @click=${()=>this.customising=!this.customising}
        >
          ${this.customising?"Done":"Customise"}
        </button>
      </div>
      ${this.customising?this.renderCustomise(t):d}
      ${s.length?s.map(a=>this.renderRow(a,s)):n`<p class="muted">
              Every row is hidden. Choose Customise to bring some back.
            </p>`}
    </div>`}renderRow(t,s){let r={hass:this.hass,dash:this.dash,entryId:this.dash?.entry_id??"",collapsed:!!this.folded[t]},a;return Oe.includes(t)?a=n`<lego-releases-row
        .kind=${t}
        .hass=${r.hass}
        .dash=${r.dash}
        .entryId=${r.entryId}
        .collapsed=${r.collapsed}
        handle
      ></lego-releases-row>`:t==="value"||t==="pieces"?a=n`<lego-value-row
        .kind=${t}
        .hass=${r.hass}
        .dash=${r.dash}
        .entryId=${r.entryId}
        .collapsed=${r.collapsed}
        handle
      ></lego-value-row>`:t==="wishlist"?a=n`<lego-wishlist-row
        .hass=${r.hass}
        .dash=${r.dash}
        .entryId=${r.entryId}
        .collapsed=${r.collapsed}
        handle
      ></lego-wishlist-row>`:a=n`<lego-collection-row
        .hass=${r.hass}
        .dash=${r.dash}
        .entryId=${r.entryId}
        .collapsed=${r.collapsed}
        handle
      ></lego-collection-row>`,n`<div
      class=${["slot",this.dragging===t?"dragging":"",this.dragging&&this.over===t?"over":""].join(" ")}
      data-row=${t}
      @dragstart=${()=>this.dragging=t}
      @dragend=${()=>{this.dragging="",this.over=""}}
      @dragover=${o=>o.preventDefault()}
      @dragenter=${()=>this.over=t}
      @drop=${()=>this.onDrop(t,s)}
    >
      ${a}
    </div>`}renderCustomise(t){let s=Nt(t.rows,t.release_mode),r=t.release_status.all!==null;return n`<section class="row customise" aria-label="Customise this page">
      <h2>Customise this page</h2>
      <p class="muted">
        Saved to your Home Assistant user, so it follows you to every device.
      </p>
      <div class="setting">
        <span>Release rows</span>
        <div class="pills" role="group" aria-label="Release rows">
          ${["combined","separate"].map(a=>n`<button
                class=${t.release_mode===a?"pill on":"pill"}
                aria-pressed=${t.release_mode===a}
                @click=${()=>{this.save({release_mode:a})}}
              >
                ${a==="combined"?"Combined":"Separate"}
              </button>`)}
        </div>
      </div>
      <div class="crow heading" aria-hidden="true">
        <span></span><span>Show</span><span>Row</span><span>Starts</span>
      </div>
      <ul>
        ${s.map(a=>this.renderCustomiseRow(t,a,s))}
      </ul>
      ${r?d:n`<p class="muted">
              For Everything, Out recently and Coming soon, turn on Follow
              releases across all themes in the integration's options.
            </p>`}
    </section>`}renderCustomiseRow(t,s,r){let a=wt[s].title,o=!t.hidden.includes(s),l=t.collapsed.includes(s)?"collapsed":"open",c=h=>{let g=t.collapsed.filter(u=>u!==s);h&&g.push(s),this.folded={...this.folded,[s]:h},this.save({collapsed:g})};return n`<li>
      <div class="crow">
        <button
          class="drag"
          data-custom=${s}
          aria-label=${`Move ${a} up or down`}
          title="Use the arrow keys to reorder"
          @keydown=${h=>{let g=h.key==="ArrowUp"?-1:h.key==="ArrowDown"?1:0;g&&(h.preventDefault(),this.move(s,g,r),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-custom="${s}"]`)?.focus()))}}
        >
          <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
        </button>
        <input
          type="checkbox"
          .checked=${o}
          aria-label=${`Show ${a}`}
          @change=${h=>{let g=h.target.checked,u=t.hidden.filter(v=>v!==s);g||u.push(s),this.save({hidden:u})}}
        />
        <span class="rowname"
          ><ha-icon icon=${wt[s].icon}></ha-icon>${a}</span
        >
        <div class="pills" role="group" aria-label=${`${a} starts`}>
          <button
            class=${l==="open"?"pill on":"pill"}
            aria-pressed=${l==="open"}
            @click=${()=>c(!1)}
          >
            Open
          </button>
          <button
            class=${l==="collapsed"?"pill on":"pill"}
            aria-pressed=${l==="collapsed"}
            @click=${()=>c(!0)}
          >
            Collapsed
          </button>
        </div>
      </div>
      ${Oe.includes(s)?this.renderStartsOn(t,s):d}
    </li>`}renderStartsOn(t,s){let r=q(s,t),a=c=>{let h=t.release_filters[s]??{};this.save({release_filters:{...t.release_filters,[s]:{...h,...c}}})},o=(c,h,g)=>n`<button
        class=${h?"chip small on":"chip small"}
        aria-pressed=${h}
        @click=${g}
      >
        ${c}
      </button>`,l=s==="releases"||s==="themes";return n`<div class="startson">
      <span class="muted-label">Starts on</span>
      ${l&&s==="releases"&&t.release_status.all!==null?o("Everything",r.scope==="all",()=>a({scope:"all",themes:[]})):d}
      ${l&&t.followed.length?o(s==="themes"?"All my themes":"My themes",r.scope==="mine"&&!r.themes.length,()=>a({scope:"mine",themes:[]})):d}
      ${l?t.followed.map(c=>o(c,r.scope==="mine"&&r.themes.includes(c),()=>a({scope:"mine",themes:ut(r.scope==="mine"?r.themes:[],c,t.followed)}))):d}
      <label class="spanpick"
        >Span
        <select
          @change=${c=>a({span:c.target.value})}
        >
          ${st[s].map(c=>n`<option value=${c} ?selected=${c===r.span}>
                ${pt[c]}
              </option>`)}
        </select></label
      >
    </div>`}};w.styles=[G,vt,xt,bt,b`
      :host {
        background: var(--lego-ground);
        display: block;
        min-height: 100vh;
      }
      .app {
        margin: 0 auto;
        max-width: 1400px;
        padding: 0 0 var(--ha-space-8, 32px);
      }
      /* One toolbar row at Home Assistant's own header height; on a phone the
         meter takes a row of its own below it. */
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
      .title {
        align-items: center;
        display: flex;
        gap: var(--ha-space-2, 8px);
        min-width: 0;
      }
      /* The integration's own brick, in the theme's primary colour. */
      .logo {
        display: block;
        flex: none;
        height: 48px;
        width: 48px;
      }
      .logo svg {
        display: block;
        height: 100%;
        width: 100%;
      }
      /* The page title reads like Home Assistant's own toolbar titles: regular
         weight, so the bold section headings below it are the ones that stand out. */
      h1 {
        font-size: var(--ha-font-size-xl, 20px);
        font-weight: var(--ha-font-weight-normal, 400);
        line-height: var(--ha-line-height-condensed, 1.2);
        margin: 0;
      }
      .meter {
        align-items: center;
        color: var(--lego-text-2);
        display: flex;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-2, 8px);
        margin-left: auto;
        min-height: 48px;
      }
      .meter-label {
        color: var(--lego-text);
        font-weight: var(--ha-font-weight-medium, 500);
      }
      .meter-bar {
        background: var(--lego-ground);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-pill, 9999px);
        display: block;
        height: 8px;
        overflow: hidden;
        width: 120px;
      }
      .meter-bar span {
        background: var(--lego-primary);
        display: block;
        height: 100%;
      }
      .meter.tight .meter-bar span {
        background: var(--lego-want);
      }
      header.narrow .meter-label {
        display: none;
      }
      header.narrow .meter-bar {
        width: 64px;
      }
      .accountpick {
        max-width: 50%;
        position: relative;
      }
      /* The menu button and the brick read as one control, split by a hairline. */
      .accountbar {
        align-items: stretch;
        background: var(--lego-ground);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        display: flex;
        max-width: 100%;
      }
      .accountbar .brick {
        border-inline-start: var(--lego-line) solid var(--lego-outline);
        border-radius: 0;
        height: auto;
      }
      .account {
        align-items: center;
        appearance: none;
        background: none;
        border: 0;
        border-radius: var(--ha-border-radius-md, 8px);
        color: inherit;
        min-width: 0;
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
        gap: var(--ha-space-2, 8px);
        max-width: 100%;
        min-height: 48px;
        padding: 0 var(--ha-space-2, 8px) 0 var(--ha-space-3, 12px);
        --mdc-icon-size: 20px;
      }
      /* Every name shares one cell, so the picker is as wide as the longest and
         keeps its width whichever account shows. */
      .account .names {
        display: inline-grid;
        justify-items: start;
        min-width: 0;
      }
      .account .name {
        grid-area: 1 / 1;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .account .name.ghost {
        visibility: hidden;
      }
      .menu {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        list-style: none;
        margin: var(--ha-space-1, 4px) 0 0;
        min-width: 240px;
        padding: var(--ha-space-1, 4px) 0;
        position: absolute;
        right: 0;
        top: 100%;
        z-index: 4;
      }
      .menu li {
        align-items: center;
        display: flex;
      }
      .pick {
        appearance: none;
        background: none;
        border: 0;
        color: var(--lego-text);
        cursor: pointer;
        flex: 1;
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
        min-height: 48px;
        padding: 0 var(--ha-space-4, 16px);
        text-align: start;
      }
      .pick[aria-current="true"] {
        color: var(--lego-primary);
        font-weight: var(--ha-font-weight-medium, 500);
      }
      .brick {
        align-items: center;
        appearance: none;
        background: none;
        border: 0;
        border-radius: 50%;
        color: var(--lego-text-2);
        cursor: pointer;
        display: inline-flex;
        height: 48px;
        justify-content: center;
        width: 48px;
      }
      .brick[aria-pressed="true"] {
        color: var(--lego-primary);
        cursor: default;
      }
      .rows {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-4, 16px);
        padding: var(--ha-space-2, 8px) var(--ha-space-4, 16px) 0;
      }
      .homebar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: calc(-1 * var(--ha-space-2, 8px));
      }
      .slot.dragging {
        opacity: 0.5;
      }
      /* Where a dragged row will land. */
      .slot.over {
        box-shadow: 0 -10px 0 -8px var(--lego-primary);
      }
      .customise {
        padding: var(--ha-space-4, 16px);
      }
      .customise > .muted:first-of-type {
        margin: var(--ha-space-1, 4px) 0 var(--ha-space-3, 12px);
      }
      .setting {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        font-size: var(--ha-font-size-m, 14px);
        font-weight: var(--ha-font-weight-medium, 500);
        gap: var(--ha-space-3, 12px);
        margin-bottom: var(--ha-space-2, 8px);
      }
      .customise ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .customise li {
        border-top: var(--lego-line) solid var(--lego-outline);
      }
      .crow {
        align-items: center;
        display: grid;
        gap: var(--ha-space-3, 12px);
        grid-template-columns: 48px 28px minmax(0, 1fr) auto;
        min-height: 48px;
      }
      .crow.heading {
        color: var(--lego-text-2);
        font-size: var(--ha-font-size-s, 12px);
        font-weight: var(--ha-font-weight-medium, 500);
        min-height: 32px;
      }
      .crow input {
        accent-color: var(--lego-primary);
        height: 20px;
        margin: 0;
        width: 20px;
      }
      .rowname {
        align-items: center;
        display: flex;
        font-size: var(--ha-font-size-m, 14px);
        gap: var(--ha-space-2, 8px);
        --mdc-icon-size: 20px;
      }
      .rowname ha-icon {
        color: var(--lego-primary);
      }
      .startson {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: var(--ha-space-2, 8px);
        padding: 0 0 var(--ha-space-3, 12px) 88px;
      }
      .muted-label {
        color: var(--lego-text-2);
        font-size: var(--ha-font-size-s, 12px);
        min-width: 64px;
      }
      .chip.small {
        font-size: var(--ha-font-size-s, 12px);
        min-height: 32px;
        padding: 0 var(--ha-space-3, 12px);
      }
      .spanpick {
        align-items: center;
        color: var(--lego-text-2);
        display: inline-flex;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-2, 8px);
        margin-left: var(--ha-space-2, 8px);
      }
      .spanpick select {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        color: var(--lego-text);
        font: inherit;
        min-height: 32px;
        padding: 0 var(--ha-space-2, 8px);
      }
      .busy {
        opacity: 0.5;
        pointer-events: none;
        transition: opacity var(--ha-animation-duration-fast, 150ms);
      }
      .switching,
      .pad {
        padding: 0 var(--ha-space-4, 16px);
      }
      .error {
        color: var(--lego-bad);
        padding: var(--ha-space-5, 20px) var(--ha-space-4, 16px);
      }
      .error p {
        margin: 0;
      }
      @media (max-width: 640px) {
        .startson {
          padding-left: 0;
        }
      }
    `],p([x({attribute:!1})],w.prototype,"hass",2),p([x({type:Boolean})],w.prototype,"narrow",2),p([x({type:Boolean,reflect:!0})],w.prototype,"dark",2),p([m()],w.prototype,"dash",2),p([m()],w.prototype,"error",2),p([m()],w.prototype,"accounts",2),p([m()],w.prototype,"account",2),p([m()],w.prototype,"defaultAccount",2),p([m()],w.prototype,"switching",2),p([m()],w.prototype,"picking",2),p([m()],w.prototype,"customising",2),p([m()],w.prototype,"folded",2),p([m()],w.prototype,"dragging",2),p([m()],w.prototype,"over",2);C("lego-panel",w);export{w as LegoPanel};
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
