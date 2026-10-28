var ls=Object.defineProperty;var cs=Object.getOwnPropertyDescriptor;var g=(i,s,e,t)=>{for(var r=t>1?void 0:t?cs(s,e):s,o=i.length-1,a;o>=0;o--)(a=i[o])&&(r=(t?a(s,e,r):a(r))||r);return t&&r&&ls(s,e,r),r};var de=globalThis,he=de.ShadowRoot&&(de.ShadyCSS===void 0||de.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Me=Symbol(),it=new WeakMap,Z=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==Me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(he&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=it.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&it.set(e,s))}return s}toString(){return this.cssText}},ot=i=>new Z(typeof i=="string"?i:i+"",void 0,Me),$=(i,...s)=>{let e=i.length===1?i[0]:s.reduce((t,r,o)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new Z(e,i,Me)},at=(i,s)=>{if(he)i.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),r=de.litNonce;r!==void 0&&t.setAttribute("nonce",r),t.textContent=e.cssText,i.appendChild(t)}},Re=he?i=>i:i=>i instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return ot(e)})(i):i;var{is:ds,defineProperty:hs,getOwnPropertyDescriptor:ps,getOwnPropertyNames:us,getOwnPropertySymbols:gs,getPrototypeOf:ms}=Object,pe=globalThis,nt=pe.trustedTypes,fs=nt?nt.emptyScript:"",vs=pe.reactiveElementPolyfillSupport,ee=(i,s)=>i,te={toAttribute(i,s){switch(s){case Boolean:i=i?fs:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,s){let e=i;switch(s){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ue=(i,s)=>!ds(i,s),lt={attribute:!0,type:String,converter:te,reflect:!1,useDefault:!1,hasChanged:ue};Symbol.metadata??=Symbol("metadata"),pe.litPropertyMetadata??=new WeakMap;var O=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=lt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),r=this.getPropertyDescriptor(s,t,e);r!==void 0&&hs(this.prototype,s,r)}}static getPropertyDescriptor(s,e,t){let{get:r,set:o}=ps(this.prototype,s)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let l=r?.call(this);o?.call(this,a),this.requestUpdate(s,l,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??lt}static _$Ei(){if(this.hasOwnProperty(ee("elementProperties")))return;let s=ms(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(ee("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ee("properties"))){let e=this.properties,t=[...us(e),...gs(e)];for(let r of t)this.createProperty(r,e[r])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let r=this._$Eu(e,t);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let r of t)e.unshift(Re(r))}else s!==void 0&&e.push(Re(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return at(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),r=this.constructor._$Eu(s,t);if(r!==void 0&&t.reflect===!0){let o=(t.converter?.toAttribute!==void 0?t.converter:te).toAttribute(e,t.type);this._$Em=s,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(s,e){let t=this.constructor,r=t._$Eh.get(s);if(r!==void 0&&this._$Em!==r){let o=t.getPropertyOptions(r),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:te;this._$Em=r;let l=a.fromAttribute(e,o.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(s,e,t,r=!1,o){if(s!==void 0){let a=this.constructor;if(r===!1&&(o=this[s]),t??=a.getPropertyOptions(s),!((t.hasChanged??ue)(o,e)||t.useDefault&&t.reflect&&o===this._$Ej?.get(s)&&!this.hasAttribute(a._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:r,wrapped:o},a){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,a??e??this[s]),o!==!0||a!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),r===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[r,o]of t){let{wrapped:a}=o,l=this[r];a!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};O.elementStyles=[],O.shadowRootOptions={mode:"open"},O[ee("elementProperties")]=new Map,O[ee("finalized")]=new Map,vs?.({ReactiveElement:O}),(pe.reactiveElementVersions??=[]).push("2.1.2");var Be=globalThis,ct=i=>i,ge=Be.trustedTypes,dt=ge?ge.createPolicy("lit-html",{createHTML:i=>i}):void 0,ft="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,vt="?"+N,ys=`<${vt}>`,I=document,re=()=>I.createComment(""),ie=i=>i===null||typeof i!="object"&&typeof i!="function",je=Array.isArray,bs=i=>je(i)||typeof i?.[Symbol.iterator]=="function",ze=`[ 	
\f\r]`,se=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ht=/-->/g,pt=/>/g,H=RegExp(`>|${ze}(?:([^\\s"'>=/]+)(${ze}*=${ze}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ut=/'/g,gt=/"/g,yt=/^(?:script|style|textarea|title)$/i,Le=i=>(s,...e)=>({_$litType$:i,strings:s,values:e}),n=Le(1),D=Le(2),Zs=Le(3),q=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),mt=new WeakMap,U=I.createTreeWalker(I,129);function bt(i,s){if(!je(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(s):s}var xs=(i,s)=>{let e=i.length-1,t=[],r,o=s===2?"<svg>":s===3?"<math>":"",a=se;for(let l=0;l<e;l++){let c=i[l],h,p,u=-1,f=0;for(;f<c.length&&(a.lastIndex=f,p=a.exec(c),p!==null);)f=a.lastIndex,a===se?p[1]==="!--"?a=ht:p[1]!==void 0?a=pt:p[2]!==void 0?(yt.test(p[2])&&(r=RegExp("</"+p[2],"g")),a=H):p[3]!==void 0&&(a=H):a===H?p[0]===">"?(a=r??se,u=-1):p[1]===void 0?u=-2:(u=a.lastIndex-p[2].length,h=p[1],a=p[3]===void 0?H:p[3]==='"'?gt:ut):a===gt||a===ut?a=H:a===ht||a===pt?a=se:(a=H,r=void 0);let b=a===H&&i[l+1].startsWith("/>")?" ":"";o+=a===se?c+ys:u>=0?(t.push(h),c.slice(0,u)+ft+c.slice(u)+N+b):c+N+(u===-2?l:b)}return[bt(i,o+(i[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},oe=class i{constructor({strings:s,_$litType$:e},t){let r;this.parts=[];let o=0,a=0,l=s.length-1,c=this.parts,[h,p]=xs(s,e);if(this.el=i.createElement(h,t),U.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=U.nextNode())!==null&&c.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let u of r.getAttributeNames())if(u.endsWith(ft)){let f=p[a++],b=r.getAttribute(u).split(N),v=/([.?@])?(.*)/.exec(f);c.push({type:1,index:o,name:v[2],strings:b,ctor:v[1]==="."?De:v[1]==="?"?Oe:v[1]==="@"?Pe:G}),r.removeAttribute(u)}else u.startsWith(N)&&(c.push({type:6,index:o}),r.removeAttribute(u));if(yt.test(r.tagName)){let u=r.textContent.split(N),f=u.length-1;if(f>0){r.textContent=ge?ge.emptyScript:"";for(let b=0;b<f;b++)r.append(u[b],re()),U.nextNode(),c.push({type:2,index:++o});r.append(u[f],re())}}}else if(r.nodeType===8)if(r.data===vt)c.push({type:2,index:o});else{let u=-1;for(;(u=r.data.indexOf(N,u+1))!==-1;)c.push({type:7,index:o}),u+=N.length-1}o++}}static createElement(s,e){let t=I.createElement("template");return t.innerHTML=s,t}};function W(i,s,e=i,t){if(s===q)return s;let r=t!==void 0?e._$Co?.[t]:e._$Cl,o=ie(s)?void 0:s._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,t)),t!==void 0?(e._$Co??=[])[t]=r:e._$Cl=r),r!==void 0&&(s=W(i,r._$AS(i,s.values),r,t)),s}var Fe=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,r=(s?.creationScope??I).importNode(e,!0);U.currentNode=r;let o=U.nextNode(),a=0,l=0,c=t[0];for(;c!==void 0;){if(a===c.index){let h;c.type===2?h=new ae(o,o.nextSibling,this,s):c.type===1?h=new c.ctor(o,c.name,c.strings,this,s):c.type===6&&(h=new Ne(o,this,s)),this._$AV.push(h),c=t[++l]}a!==c?.index&&(o=U.nextNode(),a++)}return U.currentNode=I,r}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},ae=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=W(this,s,e),ie(s)?s===d||s==null||s===""?(this._$AH!==d&&this._$AR(),this._$AH=d):s!==this._$AH&&s!==q&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):bs(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==d&&ie(this._$AH)?this._$AA.nextSibling.data=s:this.T(I.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,r=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=oe.createElement(bt(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new Fe(r,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(s){let e=mt.get(s.strings);return e===void 0&&mt.set(s.strings,e=new oe(s)),e}k(s){je(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,r=0;for(let o of s)r===e.length?e.push(t=new i(this.O(re()),this.O(re()),this,this.options)):t=e[r],t._$AI(o),r++;r<e.length&&(this._$AR(t&&t._$AB.nextSibling,r),e.length=r)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=ct(s).nextSibling;ct(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},G=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,r,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=s,this.name=e,this._$AM=r,this.options=o,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=d}_$AI(s,e=this,t,r){let o=this.strings,a=!1;if(o===void 0)s=W(this,s,e,0),a=!ie(s)||s!==this._$AH&&s!==q,a&&(this._$AH=s);else{let l=s,c,h;for(s=o[0],c=0;c<o.length-1;c++)h=W(this,l[t+c],e,c),h===q&&(h=this._$AH[c]),a||=!ie(h)||h!==this._$AH[c],h===d?s=d:s!==d&&(s+=(h??"")+o[c+1]),this._$AH[c]=h}a&&!r&&this.j(s)}j(s){s===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},De=class extends G{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===d?void 0:s}},Oe=class extends G{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==d)}},Pe=class extends G{constructor(s,e,t,r,o){super(s,e,t,r,o),this.type=5}_$AI(s,e=this){if((s=W(this,s,e,0)??d)===q)return;let t=this._$AH,r=s===d&&t!==d||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,o=s!==d&&(t===d||r);r&&this.element.removeEventListener(this.name,this,t),o&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},Ne=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){W(this,s)}};var ws=Be.litHtmlPolyfillSupport;ws?.(oe,ae),(Be.litHtmlVersions??=[]).push("3.3.3");var xt=(i,s,e)=>{let t=e?.renderBefore??s,r=t._$litPart$;if(r===void 0){let o=e?.renderBefore??null;t._$litPart$=r=new ae(s.insertBefore(re(),o),o,void 0,e??{})}return r._$AI(i),r};var He=globalThis,A=class extends O{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=xt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};A._$litElement$=!0,A.finalized=!0,He.litElementHydrateSupport?.({LitElement:A});var $s=He.litElementPolyfillSupport;$s?.({LitElement:A});(He.litElementVersions??=[]).push("4.2.2");var ks={attribute:!0,type:String,converter:te,reflect:!1,hasChanged:ue},_s=(i=ks,s,e)=>{let{kind:t,metadata:r}=e,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),t==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),t==="accessor"){let{name:a}=e;return{set(l){let c=s.get.call(this);s.set.call(this,l),this.requestUpdate(a,c,i,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,i,l),l}}}if(t==="setter"){let{name:a}=e;return function(l){let c=this[a];s.call(this,l),this.requestUpdate(a,c,i,!0,l)}}throw Error("Unsupported decorator location: "+t)};function k(i){return(s,e)=>typeof e=="object"?_s(i,s,e):((t,r,o)=>{let a=r.hasOwnProperty(o);return r.constructor.createProperty(o,t),a?Object.getOwnPropertyDescriptor(r,o):void 0})(i,s,e)}function m(i){return k({...i,state:!0,attribute:!1})}function kt(i,s){let e=i.reduce((h,p)=>h+p,0)/(i.length||1),t=h=>12*(i[h]+i[h+1])/2/e,r=0,o=0;for(let[h,p]of i.entries()){let u=o+(h?t(h-1):0)+p;if(u>s)break;o=u,r=h+1}let a=Array.from({length:Math.max(r-1,0)},(h,p)=>t(p)),l=s-o,c=a.map((h,p)=>p);for(;l>.5&&c.length;){let h=c.reduce((u,f)=>u+t(f),0),p=l;l=0,c=c.filter(u=>{let f=t(u)*10,b=a[u]+p*t(u)/h;return a[u]=Math.min(b,f),l+=b-a[u],a[u]<f})}return{count:r,gaps:a.map(h=>Math.round(h*10)/10)}}var Ss="{?}";function _t(i,s){return{device_id:i,set_number:s.set_number,owned:!s.owned}}function St(i){return{device_id:i}}function z(i,s){return s?{type:i,config_entry_id:s}:{type:i}}function Et(i,s){if(!i)return"Not synced yet";let e=Math.floor((s.getTime()-new Date(i).getTime())/6e4);if(e<1)return"Updated just now";let t=new Intl.RelativeTimeFormat("en",{numeric:"always"});if(e<60)return`Updated ${t.format(-e,"minute")}`;let r=Math.floor(e/60);return r<48?`Updated ${t.format(-r,"hour")}`:`Updated ${t.format(-Math.floor(r/24),"day")}`}function qe(i,s,e,t=!1){return i==null||!s?"":new Intl.NumberFormat(e,{style:"currency",currency:s,...t?{maximumFractionDigits:0}:{}}).format(i)}function C(i){return i instanceof Error?i.message:i&&typeof i=="object"&&"message"in i?String(i.message):String(i)}function At(i){let s=[];for(let e of i){let t=e.state??e.mean;t!=null&&s.push({t:new Date(e.start).getTime(),v:t})}return s}function Ct(i,s,e=6){let t=[...i].filter(a=>a[s]>0).sort((a,l)=>l[s]-a[s]),r=t.slice(0,e).map(a=>({theme:a.theme,amount:a[s],sets:a.sets,setNumbers:a.set_numbers??[],other:!1})),o=t.slice(e);return o.length&&r.push({theme:`Other (${E(o.length,"theme","themes")})`,amount:o.reduce((a,l)=>a+l[s],0),sets:o.reduce((a,l)=>a+l.sets,0),setNumbers:o.flatMap(a=>a.set_numbers??[]).sort(),other:!0}),r}function E(i,s,e){return`${i.toLocaleString()} ${i===1?s:e}`}var Ue=100;function Tt(i,s,e){let t=Ue-s;return[`${i} of today's ${s} calls used.`,t>0?`The other ${t} of the ${Ue} Brickset allows each API key a day are left unused, for anything else on your key.`:`Your budget is all ${Ue} calls Brickset allows each API key a day.`,`The count starts again at ${e}.`].join(" ")}var Es=60;function Mt(i,s,e="retirement"){if(e==="release"&&i.available_from)return new Date(i.available_from)>s?"due":"";if(i.available_until){let t=new Date(i.available_until).getTime();return t<s.getTime()?"retired":(t-s.getTime())/864e5<=Es?"retiring":""}return i.available_from&&new Date(i.available_from)>s?"due":""}function Rt(i,s,e,t="retirement"){return t==="release"&&i.available_from?`${new Date(i.available_from)>s?"Due":"Out"} ${e(i.available_from)}`:i.available_until?`${new Date(i.available_until)<s?"Retired":"Retires"} ${e(i.available_until)}`:i.available_from?`${new Date(i.available_from)>s?"Due":"Out"} ${e(i.available_from)}`:ne(i)?"Date unknown":"Details tbd"}function fe(i){if(!i)return null;try{let s=new URL(i);return s.protocol==="https:"||s.protocol==="http:"?s.href:null}catch{return null}}var As="/api/lego/image/";function wt(i){return i?.startsWith(As)?i:fe(i)}function zt(i){let s=wt(i.image),e=wt(i.image_large),t=fe(i.image_remote);return{src:s,srcset:s&&e?`${s} 1x, ${e} 2x`:null,fallback:t&&t!==s?t:null}}function ne(i){let s=(i.name??"").trim();return s!==""&&s!==Ss}function L(i){return ne(i)?i.name:"Name tbd"}var Cs={around:"Now",year:"This year",past3:"Past 3 months",past1:"Past month",next1:"Next month",next3:"Next 3 months",coming:"Unreleased"},Ft={around:"Three months either side of today",year:"January to December",coming:"Every set announced and not yet out, with a date or without"};function j(i,s=new Date){return i==="year"?String(s.getFullYear()):Cs[i]}function Dt(i,s){return!s||R[i].includes(s)?"":`This row offers ${R[i].map(t=>j(t)).join(", ")}, not ${j(s)}.`}var R={releases:["past3","around","year","coming"],themes:["past3","around","year","coming"],recent:["past3"],upcoming:["coming"]},Ts={recent:"all",upcoming:"all",themes:"mine"};function K(i,s){let e=s.release_filters?.[i]??{},t=s.release_status.all!==null,r=Ts[i],o=s.followed.length||!t?"mine":"all",a=r??e.scope??o;a==="all"&&!t&&(a="mine");let l=new Set(s.followed.map(u=>u.toLowerCase())),c=a==="mine"?(e.themes??[]).filter(u=>l.has(u.toLowerCase())):[],h=R[i],p=e.span&&h.includes(e.span)?e.span:i==="upcoming"?"coming":i==="recent"?"past3":"around";return{scope:a,themes:c,span:p}}function ve(i,s,e){let t=i.includes(s)?i.filter(r=>r!==s):[...i,s];return t.length===e.length?[]:t}var B=15,Ms=3,Ie=2,$t=.25;function Ot(i,s,e){if(!e)return{from:0,to:B,width:1};let t=Math.max(i-$t,0),r=Math.min(s+$t,B),o=Ie-(r-t);return o>0&&(t=Math.max(t-o/2,0),r=Math.min(t+Ie,B),t=Math.max(r-Ie,0)),{from:t,to:r,width:Math.max((r-t)/Ms,1)}}function V(i,s){let e=typeof s=="string"?new Date(`${s.slice(0,10)}T00:00:00`):s,t=(e.getFullYear()-i.getFullYear())*12+e.getMonth()-i.getMonth(),r=new Date(e.getFullYear(),e.getMonth()+1,0).getDate();return t+(e.getDate()-1)/r}function Pt(i,s,e=.15,t=4){let r=[];for(let o of[...i].sort((a,l)=>a.date.localeCompare(l.date))){let a=V(s,o.date);if(a<0||a>B)continue;let l=r[r.length-1];l&&a-l.at<=e?l.points.push(o):r.push({at:a,points:[o]})}return r.map(o=>({at:o.at,themes:o.points.slice(0,t).map(a=>a.theme),extra:Math.max(o.points.length-t,0),points:o.points}))}function We(i,s=5){return Array.from({length:i},(e,t)=>(t-(i-1)/2)*s)}var Rs=["recent","upcoming","themes"];function Ge(i,s){let e=s==="combined"?Rs:["releases"];return i.filter(t=>!e.includes(t))}function Nt(i,s,e,t){let r=s[s.indexOf(e)+t];if(!r)return i;let o=i.filter(a=>a!==e);return o.splice(o.indexOf(r)+(t>0?1:0),0,e),o}var ye=new Map,be="lego-invalidated";function Bt(i,s){let e=ye.get(s);return e||(e=i.callWS(z("lego/dashboard",s)),ye.set(s,e),e.catch(()=>ye.delete(s))),e}function xe(){ye.clear(),window.dispatchEvent(new Event(be))}function jt(i,s,e){return i.callWS({...z("lego/releases",s),scope:e.scope,themes:e.themes,span:e.span})}var Lt={tag:"svg",attrs:{viewBox:"0.50 1.19 99.00 99.00"},children:[{tag:"polygon",attrs:{points:"4.000,34.558 50.000,61.116 50.000,93.389 4.000,66.831",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 88%, black)"}},{tag:"polygon",attrs:{points:"50.000,61.116 96.000,34.558 96.000,66.831 50.000,93.389",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 59%, black)"}},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 50.000,61.116 4.000,34.558",style:"fill:var(--primary-color, #009ac7)"}},{tag:"g",attrs:{"stroke-width":"0.5",fill:"none","stroke-linecap":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M4.000,34.558 L50.000,61.116 L96.000,34.558"}},{tag:"path",attrs:{d:"M50.000,61.116 L50.000,93.389"}}]},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 96.000,66.831 50.000,93.389 4.000,66.831 4.000,34.558",fill:"none","stroke-width":"2.0","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"}},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,16.236 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"16.236",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M18.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"27.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M64.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"73.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,42.794 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"42.794",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{transform:"translate(11.596,34.314) scale(0.12837)"},children:[{tag:"g",attrs:{stroke:"#FFFFFF","stroke-width":"17.0","stroke-linecap":"round",fill:"none"},children:[{tag:"line",attrs:{x1:"120.00",y1:"153.05",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"60.00",y1:"214.40",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"180.00",y1:"249.69",x2:"120.00",y2:"275.05"}}]},{tag:"g",attrs:{fill:"#FFFFFF"},children:[{tag:"circle",attrs:{cx:"120.00",cy:"153.05",r:"19.38"}},{tag:"circle",attrs:{cx:"60.00",cy:"214.40",r:"19.38"}},{tag:"circle",attrs:{cx:"180.00",cy:"249.69",r:"19.38"}}]}]}]},Ke=[{part:"3005",size:"1x1",colour:"Red",width:38.44,svg:{tag:"svg",attrs:{viewBox:"0 0 38.44 55.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 19.220,29.723 19.220,54.027 1.900,44.027",fill:"#B01708"}},{tag:"polygon",attrs:{points:"19.220,29.723 36.540,19.723 36.540,44.027 19.220,54.027",fill:"#770F05"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 19.220,29.723 1.900,19.723",fill:"#C91A09"}},{tag:"path",attrs:{d:"M1.90,19.72 L19.22,29.72 L36.54,19.72 M19.22,29.72 L19.22,54.03",stroke:"#550B04","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 36.540,44.027 19.220,54.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#550B04","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#550B04","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#A11507",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F01F0B",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3004",size:"1x2",colour:"Orange",width:55.76,svg:{tag:"svg",attrs:{viewBox:"0 0 55.76 65.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 36.540,39.723 36.540,64.027 1.900,44.027",fill:"#F27901"}},{tag:"polygon",attrs:{points:"36.540,39.723 53.860,29.723 53.860,54.027 36.540,64.027",fill:"#A45201"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 36.540,39.723 1.900,19.723",fill:"#FE8A18"}},{tag:"path",attrs:{d:"M1.90,19.72 L36.54,39.72 L53.86,29.72 M36.54,39.72 L36.54,64.03",stroke:"#763B01","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 53.860,54.027 36.540,64.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#763B01","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3010",size:"1x4",colour:"Yellow",width:90.4,svg:{tag:"svg",attrs:{viewBox:"0 0 90.40 85.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 71.180,59.723 71.180,84.027 1.900,44.027",fill:"#F0C414"}},{tag:"polygon",attrs:{points:"71.180,59.723 88.500,49.723 88.500,74.027 71.180,84.027",fill:"#A6870B"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 71.180,59.723 1.900,19.723",fill:"#F2CD37"}},{tag:"path",attrs:{d:"M1.90,19.72 L71.18,59.72 L88.50,49.72 M71.18,59.72 L71.18,84.03",stroke:"#766108","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 88.500,74.027 71.180,84.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#766108","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3001",size:"2x4",colour:"Green",width:107.72,svg:{tag:"svg",attrs:{viewBox:"0 0 107.72 95.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 71.180,69.723 71.180,94.027 1.900,54.027",fill:"#1F6939"}},{tag:"polygon",attrs:{points:"71.180,69.723 105.820,49.723 105.820,74.027 71.180,94.027",fill:"#154727"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 71.180,69.723 1.900,29.723",fill:"#237841"}},{tag:"path",attrs:{d:"M1.90,29.72 L71.18,69.72 L105.82,49.72 M71.18,69.72 L71.18,94.03",stroke:"#0F331C","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 105.820,74.027 71.180,94.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#0F331C","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3009",size:"1x6",colour:"Dark Azure",width:125.04,svg:{tag:"svg",attrs:{viewBox:"0 0 125.04 105.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 105.820,79.723 105.820,104.027 1.900,44.027",fill:"#067AB0"}},{tag:"polygon",attrs:{points:"105.820,79.723 123.140,69.723 123.140,94.027 105.820,104.027",fill:"#045377"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 105.820,79.723 1.900,19.723",fill:"#078BC9"}},{tag:"path",attrs:{d:"M1.90,19.72 L105.82,79.72 L123.14,69.72 M105.82,79.72 L105.82,104.03",stroke:"#033B55","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 123.140,94.027 105.820,104.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#033B55","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"2456",size:"2x6",colour:"Blue",width:142.36,svg:{tag:"svg",attrs:{viewBox:"0 0 142.36 115.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 105.820,89.723 105.820,114.027 1.900,54.027",fill:"#004AA7"}},{tag:"polygon",attrs:{points:"105.820,89.723 140.460,69.723 140.460,94.027 105.820,114.027",fill:"#003271"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 105.820,89.723 1.900,29.723",fill:"#0055BF"}},{tag:"path",attrs:{d:"M1.90,29.72 L105.82,89.72 L140.46,69.72 M105.82,89.72 L105.82,114.03",stroke:"#002451","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 140.460,94.027 105.820,114.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#002451","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3008",size:"1x8",colour:"Dark Purple",width:159.68,svg:{tag:"svg",attrs:{viewBox:"0 0 159.68 125.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 140.460,99.723 140.460,124.027 1.900,44.027",fill:"#372F7F"}},{tag:"polygon",attrs:{points:"140.460,99.723 157.780,89.723 157.780,114.027 140.460,124.027",fill:"#252056"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 140.460,99.723 1.900,19.723",fill:"#3F3691"}},{tag:"path",attrs:{d:"M1.90,19.72 L140.46,99.72 L157.78,89.72 M140.46,99.72 L140.46,124.03",stroke:"#1B173E","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 157.780,114.027 140.460,124.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#1B173E","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M116.43,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"123.14",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M133.75,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"140.46",cy:"85.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3007",size:"2x8",colour:"Medium Lavender",width:177,svg:{tag:"svg",attrs:{viewBox:"0 0 177.00 135.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 140.460,109.723 140.460,134.027 1.900,54.027",fill:"#9D5FAD"}},{tag:"polygon",attrs:{points:"140.460,109.723 175.100,89.723 175.100,114.027 140.460,134.027",fill:"#6C3D78"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 140.460,109.723 1.900,29.723",fill:"#AC78BA"}},{tag:"path",attrs:{d:"M1.90,29.72 L140.46,109.72 L175.10,89.72 M140.46,109.72 L140.46,134.03",stroke:"#4D2C56","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 175.100,114.027 140.460,134.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#4D2C56","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M151.07,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"157.78",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,95.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"95.93",rx:"6.71",ry:"3.87"}}]}]}}];function we(i){return n`<svg
    viewBox=${i.attrs.viewBox??d}
    aria-hidden="true"
    focusable="false"
  >
    ${(i.children??[]).map(Ht)}
  </svg>`}function Ht(i){let s=t=>i.attrs[t]??d,e=()=>(i.children??[]).map(Ht);switch(i.tag){case"g":return D`<g transform=${s("transform")} fill=${s("fill")} stroke=${s("stroke")}
        stroke-width=${s("stroke-width")} stroke-linecap=${s("stroke-linecap")}
        stroke-linejoin=${s("stroke-linejoin")} style=${s("style")}>${e()}</g>`;case"polygon":return D`<polygon points=${s("points")} fill=${s("fill")} stroke=${s("stroke")}
        stroke-width=${s("stroke-width")} stroke-linejoin=${s("stroke-linejoin")}
        style=${s("style")}></polygon>`;case"path":return D`<path d=${s("d")} fill=${s("fill")} stroke=${s("stroke")}
        stroke-width=${s("stroke-width")} stroke-linecap=${s("stroke-linecap")}
        stroke-linejoin=${s("stroke-linejoin")} style=${s("style")}></path>`;case"ellipse":return D`<ellipse cx=${s("cx")} cy=${s("cy")} rx=${s("rx")} ry=${s("ry")}
        fill=${s("fill")} style=${s("style")}></ellipse>`;case"circle":return D`<circle cx=${s("cx")} cy=${s("cy")} r=${s("r")} fill=${s("fill")}
        style=${s("style")}></circle>`;case"line":return D`<line x1=${s("x1")} y1=${s("y1")} x2=${s("x2")} y2=${s("y2")}
        stroke=${s("stroke")} stroke-width=${s("stroke-width")}
        style=${s("style")}></line>`;default:return d}}var zs=.54,Ut=Ke.map(i=>Math.round(i.width*zs)),le=class extends A{constructor(){super(...arguments);this.width=0}connectedCallback(){super.connectedCallback(),this.observer=new ResizeObserver(([e])=>{this.width=Math.floor(e.contentRect.width)}),this.observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.observer?.disconnect()}render(){let{count:e,gaps:t}=kt(Ut,this.width);return n`<div class="bricks" aria-hidden="true">
      ${Ke.slice(0,e).map((r,o)=>n`<div style="width:${Ut[o]}px;margin-right:${t[o]??0}px">
            ${we(r.svg)}
          </div>`)}
    </div>`}};le.styles=$`
    :host {
      display: block;
      min-width: 0;
      overflow: hidden;
    }
    .bricks {
      align-items: flex-end;
      display: flex;
    }
    .bricks div {
      flex: none;
    }
    svg {
      display: block;
      height: auto;
      width: 100%;
    }
  `,g([m()],le.prototype,"width",2);customElements.get("lego-bricks")||customElements.define("lego-bricks",le);var $e=$`
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
`,It=1,Fs=2,qt=3,Ve=4,Ds=5,Ye=6,Wt=7,Gt=8,Os={"star wars":It,botanicals:Ye,"botanical collection":Ye,icons:Ve,"creator expert":Ve,technic:Wt,"harry potter":Gt,city:qt},Ps=[Fs,Ds,It,qt,Ve,Ye,Wt,Gt];function Y(i){let s=new Map,e=new Set;for(let t of i){let r=Os[t.toLowerCase()];r&&!e.has(r)&&(s.set(t,r),e.add(r))}for(let t of i){if(s.has(t))continue;let r=Ps.find(o=>!e.has(o));r===void 0?s.set(t,"other"):(s.set(t,r),e.add(r))}return s}function J(i){return i===void 0||i==="other"?"var(--lego-series-other)":`var(--lego-series-${i})`}function Kt(i){let s=!i.owned;return{owned:s,qty_owned:s?Math.max(i.qty_owned,1):0}}function ke(i){return i.trim().length>=2}function Vt(i,s){let e=i.some(t=>!s[t]);return{anyOpen:e,next:Object.fromEntries(i.map(t=>[t,e]))}}function Yt(i){return{share:Math.min(i.calls_today/(i.budget||1),1),tight:i.remaining<i.refresh_cost*3}}function Jt(i){let s=i.mine&&i.open,e=i.wiggling?"done":s||!i.followed?"edit":"none";return{themes:s,trailing:e}}function Qt(i,s){return i?{open:!s,pick:!1}:{open:!1,pick:!0}}function Xt(i,s){return i?"spent":s?"ignored":"pick"}var Q=$`
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
`,_e=$`
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
    /* The title and its line beneath fill the header's height, so give them
       room above rather than letting them sit against the row's edge. */
    .rowhead {
      padding-top: var(--ha-space-2, 8px);
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
    /* A finger on the handle drags the row rather than scrolling the page. */
    touch-action: none;
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
`,Se=$`
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
  /* Present to be found, but not yet switched on in the options. */
  .chip.off {
    color: var(--lego-text-2);
    opacity: 0.6;
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
`,Zt=$`
  .carousel {
    align-items: center;
    display: flex;
    gap: var(--ha-space-3, 12px);
    overflow-x: auto;
    padding-bottom: var(--ha-space-1, 4px);
    scroll-snap-type: x proximity;
  }
  /* Snapping helps a finger land on a card, but fights a wheel or a trackpad. */
  @media (pointer: fine) {
    .carousel {
      scroll-snap-type: none;
    }
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
  /* The rainbow of real bricks standing in for cards that are not there: the
     bricks take the whole width, which lego-bricks fills, and the hint sits below. */
  .filler {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-4, 16px);
    justify-content: center;
    min-height: 236px;
    padding: 0 var(--ha-space-2, 8px);
  }
  /* After a short row of cards, the room the cards leave; none once they fill it. */
  .carousel .tail {
    container-type: inline-size;
    flex: 1 1 0;
    min-height: auto;
    min-width: 0;
    padding: 0 var(--ha-space-3, 12px);
  }
  @container (max-width: 240px) {
    .tail .hint {
      display: none;
    }
  }
  .filler .hint {
    color: var(--lego-text-2);
    font-size: var(--ha-font-size-m, 14px);
    line-height: var(--ha-line-height-normal, 1.6);
    max-width: 420px;
  }
`;var es="/lego_panel/icon.png";function T(i,s){customElements.get(i)||customElements.define(i,s)}var ce="lego-changed",Ns="lego-toggle",Bs="lego-move",ts="lego-filter",X={collection:{title:"My collection",icon:"mdi:toy-brick-outline"},releases:{title:"New releases",icon:"mdi:new-box"},recent:{title:"Out recently",icon:"mdi:new-box"},upcoming:{title:"Coming soon",icon:"mdi:calendar-clock"},themes:{title:"New in my themes",icon:"mdi:tag-heart-outline"},wishlist:{title:"My wishlist",icon:"mdi:heart-outline"},value:{title:"Collection value",icon:"mdi:chart-donut"},pieces:{title:"Pieces",icon:"mdi:shape-outline"}},x=class extends A{constructor(){super(...arguments);this.entryId="";this.collapsed=!1;this.handle=!1;this.bare=!1;this.dark=!1;this.pending=new Set;this.writeError="";this.toggle=()=>{this.collapsed=!this.collapsed,this.dispatchEvent(new CustomEvent(Ns,{detail:{row:this.row,collapsed:this.collapsed},bubbles:!0,composed:!0}))};this.onHandleKey=e=>{let t=e.key==="ArrowUp"?-1:e.key==="ArrowDown"?1:0;t&&(e.preventDefault(),this.dispatchEvent(new CustomEvent(Bs,{detail:{row:this.row,step:t},bubbles:!0,composed:!0})))};this.noArt=e=>{let t=e.target;if(t.classList.contains("noart"))return;let r=t.dataset.fallback;if(r&&t.src!==r){t.removeAttribute("srcset"),t.src=r;return}t.classList.add("noart"),t.removeAttribute("srcset"),t.src=es}}actions(){return d}willUpdate(e){e.has("hass")&&(this.dark=!!this.hass?.themes?.darkMode)}render(){let e=X[this.row];return n`
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
            <ha-icon class="rowicon" icon=${e.icon}></ha-icon>
            <span class="titles">
              <h2>${e.title}</h2>
              <span class="sub">${this.subtitle()}</span>
            </span>
          </button>
          <div class="actions">${this.actions()}</div>
          ${this.handle?n`<button
                  class="drag"
                  draggable="true"
                  title="Drag, or use the arrow keys, to reorder"
                  aria-label=${`Move ${e.title} up or down`}
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
    `}focusHandle(){this.renderRoot.querySelector(".drag")?.focus()}date(e){let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short",year:"numeric"})}num(e){return e.toLocaleString(this.hass?.locale?.language)}money(e,t=!0){return qe(e,this.dash?.currency??null,this.hass?.locale?.language,t)||this.num(Math.round(e))}async toggleOwned(e){if(!this.pending.has(e.set_number)){this.writeError="",this.setPending(e.set_number,!0);try{await this.hass.callService("lego","set_collection",_t(this.dash?.device_id??"",e))}catch(t){this.writeError=C(t);return}finally{this.setPending(e.set_number,!1)}Object.assign(e,Kt(e)),this.requestUpdate(),this.dispatchEvent(new CustomEvent(ce,{bubbles:!0,composed:!0}))}}setPending(e,t){let r=new Set(this.pending);t?r.add(e):r.delete(e),this.pending=r}linked(e,t,r=!1){let o=fe(e.url);return o?n`<a
      class="open"
      href=${o}
      target="_blank"
      rel="noopener noreferrer"
      tabindex=${r?"-1":d}
      aria-hidden=${r?"true":d}
      >${t}</a
    >`:t}themeColour(e){let t=this.dash?.followed??[],r=t.find(o=>o.toLowerCase()===e.toLowerCase());return J(r?Y(t).get(r):"other")}card(e,t="retirement",r,o=!0){let a=new Date,l=zt(e),c=l.src??l.fallback,h=o?qe(e.retail_price,this.dash?.currency??null,this.hass?.locale?.language):"";return n`
      <article class="card">
        ${this.linked(e,c?n`<img
                src=${c}
                srcset=${l.srcset??d}
                data-fallback=${l.fallback??d}
                alt=""
                loading="lazy"
                @error=${this.noArt}
              />`:n`<img
                class="noart"
                src=${es}
                alt=""
                loading="lazy"
              />`,!0)}
        <div class="meta">
          ${this.linked(e,n`<span
              class=${ne(e)?"name":"name unnamed"}
              title=${ne(e)?e.name:"Brickset has not published a name yet"}
              >${L(e)}</span
            >`)}
          <span class="num"
            >${r?n`<span
                    class="key"
                    style="background:${r}"
                    title=${e.theme}
                  ></span>`:d}${[e.set_number,h].filter(Boolean).join(" \xB7 ")}</span
          >
          <span class="when ${Mt(e,a,t)}"
            >${Rt(e,a,p=>this.date(p),t)}</span
          >
          <div class="foot">
            <span
              class=${e.owned?"state own":e.wanted?"state want":"state"}
              >${e.owned?e.qty_owned>1?`Owned \xD7${e.qty_owned}`:"Owned":e.wanted?"Wanted":""}</span
            >
            <button
              class=${["act",e.owned?"on":"",this.pending.has(e.set_number)?"pending":""].join(" ")}
              ?disabled=${this.pending.has(e.set_number)}
              title=${e.owned?"Remove from your collection":"Add to your collection"}
              aria-label=${e.owned?`Remove ${L(e)} from your collection`:`Add ${L(e)} to your collection`}
              @click=${()=>{this.toggleOwned(e)}}
            >
              <ha-icon icon=${e.owned?"mdi:check":"mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `}filler(e){return n`<div class="filler">
      <lego-bricks></lego-bricks>
      <span class="hint">${e}</span>
    </div>`}tail(e=""){return n`<div class="filler tail">
      <lego-bricks></lego-bricks>
      ${e?n`<span class="hint">${e}</span>`:d}
    </div>`}};x.styles=[Q,$e,_e,Se,Zt],g([k({attribute:!1})],x.prototype,"hass",2),g([k({attribute:!1})],x.prototype,"dash",2),g([k({attribute:!1})],x.prototype,"entryId",2),g([k({type:Boolean,reflect:!0})],x.prototype,"collapsed",2),g([k({type:Boolean})],x.prototype,"handle",2),g([k({type:Boolean,reflect:!0})],x.prototype,"bare",2),g([k({type:Boolean,reflect:!0})],x.prototype,"dark",2),g([m()],x.prototype,"pending",2),g([m()],x.prototype,"writeError",2);var M=class extends x{constructor(){super(...arguments);this.row="collection";this.refreshing=!1;this.refreshError="";this.setsOpen=!1;this.ownedError="";this.query="";this.results=[]}willUpdate(e){super.willUpdate(e),e.has("dash")&&(this.pricesPick=void 0),e.has("dash")&&this.dash!==this.ownedFor&&(this.owned=void 0,ke(this.query)&&this.search(this.query))}updated(){this.setsOpen&&!this.collapsed&&this.owned===void 0&&this.loadOwned()}async loadOwned(){let e=this.dash;if(!(!e||this.ownedFor===e)){this.ownedFor=e;try{let t=await this.hass.callWS({...z("lego/collection",e.entry_id),filter:"owned"});this.ownedFor===e&&(this.owned=t.sets,this.ownedError="")}catch(t){this.ownedFor===e&&(this.ownedError=C(t))}}}async search(e){if(this.query=e,!ke(e)){this.results=[];return}try{let t=await this.hass.callWS({...z("lego/search",this.dash?.entry_id??""),query:e,limit:24});this.query===e&&(this.results=t.sets)}catch{this.results=[]}}showPrices(){return this.pricesPick??this.dash?.collection_prices??!0}setPrices(e){this.pricesPick=e,this.hass.callWS({type:"lego/panel_config/set",collection_prices:e}).catch(()=>{})}async refresh(){this.refreshing=!0,this.refreshError="";try{await this.hass.callService("lego","refresh_collection",St(this.dash?.device_id??"")),this.dispatchEvent(new CustomEvent(ce,{bubbles:!0,composed:!0}))}catch(e){this.refreshError=C(e)}finally{this.refreshing=!1}}subtitle(){return Et(this.dash?.last_synced??null,new Date)}short(){let e=this.dash?.quota;return!!e&&e.remaining<e.refresh_cost}actions(){let e=this.dash?.quota;if(!e)return d;let t=E(e.refresh_cost,"call","calls");return n`<button
      class="update"
      ?disabled=${this.refreshing||this.short()}
      title=${this.short()?"Today's Brickset budget is spent":`Fetch your collection from Brickset now, using ${t} of the ${e.remaining} left today`}
      @click=${()=>{this.refresh()}}
    >
      <ha-icon
        icon=${this.refreshing?"mdi:sync":"mdi:cloud-sync"}
      ></ha-icon>
      ${this.refreshing?"Updating\u2026":"Update"}
      <span class="sep" aria-hidden="true"></span>
      <span class="cost">${t}</span>
    </button>`}resumes(e){let t=new Date(e),r=t.toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"});return t.toDateString()===new Date().toDateString()?`at ${r}`:`tomorrow at ${r}`}body(){let e=this.dash?.stats,t=this.dash?.quota;if(!e)return n`<p class="muted">Loading your collection…</p>`;let r=[[e.sets_owned,"Sets owned"],[e.sets_distinct,"Distinct sets"],[e.pieces_owned,"Pieces"],[e.minifigs_owned,"Minifigures"]];return n`
      <div class="stats">
        ${r.map(([o,a])=>n`<div class="stat">
              <span class="n">${this.num(o)}</span
              ><span class="l">${a}</span>
            </div>`)}
      </div>
      ${this.short()&&t?n`<p class="caveat">
              Daily budget spent, ${t.calls_today} of ${t.budget} used,
              so this is the last sync's data. Updates resume
              ${this.resumes(t.resets_at)}.
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
          <span class="sub">${this.num(e.sets_distinct)}</span>
        </button>
        ${this.setsOpen?this.sets():d}
      </div>
    `}sets(){let e=ke(this.query),t=e?this.results:this.owned??[];return n`
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
      ${this.ownedError&&!e?n`<p class="caveat bad">${this.ownedError}</p>`:this.owned===void 0&&!e?n`<p class="muted">Loading your sets…</p>`:n`<div class="count">
                  <p class="muted">
                    ${e?E(t.length,"matching set","matching sets"):`${E(t.length,"set owned","sets owned")}, by theme then name`}
                  </p>
                  <label class="prices">
                    <input
                      type="checkbox"
                      .checked=${this.showPrices()}
                      @change=${r=>this.setPrices(r.target.checked)}
                    />
                    Show prices
                  </label>
                </div>
                <div class="grid">
                  ${t.map(r=>this.card(r,"retirement",this.themeColour(r.theme),this.showPrices()))}
                </div>`}
    `}};M.styles=[x.styles,$`
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
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: var(--ha-space-2, 8px) var(--ha-space-4, 16px);
        justify-content: space-between;
        margin-bottom: var(--ha-space-3, 12px);
      }
      .count p {
        margin: 0;
      }
      .prices {
        align-items: center;
        cursor: pointer;
        display: flex;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-2, 8px);
        min-height: 48px;
      }
      .prices input {
        accent-color: var(--primary-color);
        height: 18px;
        margin: 0;
        width: 18px;
      }
    `],g([m()],M.prototype,"refreshing",2),g([m()],M.prototype,"refreshError",2),g([m()],M.prototype,"setsOpen",2),g([m()],M.prototype,"owned",2),g([m()],M.prototype,"ownedError",2),g([m()],M.prototype,"query",2),g([m()],M.prototype,"results",2),g([m()],M.prototype,"pricesPick",2);T("lego-collection-row",M);var ss=["releases","themes"],js=6,Ls=500,S=class extends x{constructor(){super(...arguments);this.kind="releases";this.error="";this.adding=!1;this.draft="";this.following=!1;this.followNote="";this.themesOpen=!1;this.wiggling=!1;this.held=!1;this.holdStart=()=>{!this.dash?.can_change||this.wiggling||(window.clearTimeout(this.holdTimer),this.holdTimer=window.setTimeout(()=>{this.held=!0,this.wiggling=!0},Ls))};this.holdEnd=()=>{window.clearTimeout(this.holdTimer)};this.onKey=e=>{e.key==="Escape"&&this.wiggling&&(this.wiggling=!1)};this.compact=!1;this.scrolledFor="";this.filterFor="";this.requested=""}connectedCallback(){super.connectedCallback(),this.sizer=new ResizeObserver(([e])=>{this.compact=e.contentRect.width<720}),this.sizer.observe(this),this.addEventListener("keydown",this.onKey)}disconnectedCallback(){super.disconnectedCallback(),this.sizer?.disconnect(),this.removeEventListener("keydown",this.onKey),window.clearTimeout(this.holdTimer)}get row(){return this.kind}willUpdate(e){super.willUpdate(e);let t=`${this.dash?.entry_id}:${this.kind}`;this.dash&&t!==this.filterFor&&(this.filterFor=t,this.filter=K(this.kind,this.dash),this.data=void 0)}updated(){!this.collapsed&&this.filter&&this.dash&&this.hass&&this.fetch(),this.scrollToToday()}scrollToToday(){let e=this.renderRoot.querySelector(".timescroll.compact"),t=e?.querySelector(".today"),r=`${this.filter?.span}:${this.data?.span.from}`;!e||!t||r===this.scrolledFor||(this.scrolledFor=r,e.scrollLeft=t.offsetLeft-e.clientWidth/2)}async fetch(){let e=this.filter,t=this.dash;if(!e||!t||t.release_status[e.scope]===null)return;let r=JSON.stringify([t.entry_id,e]);if(!(r===this.requested&&this.requestedWith===t)){this.requested=r,this.requestedWith=t;try{let o=await jt(this.hass,t.entry_id,e);this.requested===r&&(this.data=o,this.error="")}catch(o){this.requested===r&&(this.error=C(o))}}}pick(e){if(!this.filter)return;this.filter={...this.filter,...e},this.openStack=void 0;let{scope:t,themes:r,span:o}=this.filter,a={scope:t,themes:r,span:o};this.hass.callWS({type:"lego/panel_config/set",release_filters:{[this.kind]:a}}).catch(()=>{}),this.dispatchEvent(new CustomEvent(ts,{detail:{row:this.kind,filter:a},bubbles:!0,composed:!0}))}status(){return this.filter?this.dash?.release_status[this.filter.scope]:void 0}subtitle(){let e=this.status();return e==null?"":e==="fetching"?"Fetching releases\u2026":e==="failed"?"Couldn't fetch releases":this.data?E(this.data.sets.length,"set","sets"):"Loading\u2026"}actions(){return!this.filter||this.status()===null||R[this.kind].length<2?d:n`<div class="pills" role="group" aria-label="Time span">
      ${R[this.kind].map(e=>n`<button
            class=${e===this.filter?.span?"pill on":"pill"}
            aria-pressed=${e===this.filter?.span}
            title=${Ft[e]??d}
            @click=${()=>this.pick({span:e})}
          >
            ${j(e)}
          </button>`)}
    </div>`}body(){let e=this.filter,t=this.dash;if(!e||!t)return n`<p class="muted">Loading…</p>`;let r=this.status();return r===null?n`<p class="muted">${this.unavailable()}</p>
        ${this.kind==="recent"||this.kind==="upcoming"?d:this.followControls()}`:r==="fetching"?n`<p class="muted">Fetching this year's releases…</p>`:r==="failed"?n`<p class="muted">
        Couldn't fetch this year's releases. They're tried again every few hours
        until they arrive.
      </p>`:n`
      ${ss.includes(this.kind)?this.chips(e):d}
      ${ss.includes(this.kind)&&this.data?this.timeline(this.data):d}
      ${this.error?n`<p class="caveat bad">${this.error}</p>`:d}
      ${this.cards()}
    `}unavailable(){return this.kind==="recent"||this.kind==="upcoming"?"Turn on Follow releases across all themes in the integration's options for this row.":this.kind==="themes"?this.dash?.can_change?"No themes followed yet. Follow one to see its new sets here.":"No themes followed yet.":this.dash?.can_change?"Follow a theme, or turn on Follow releases across all themes in the integration's options, to see new sets here.":"No themes followed yet."}chips(e){let t=this.dash,r=Y(t.followed),o=e.scope==="mine",a=t.release_status.all!==null,l=n`<button
      class=${e.scope==="all"?"chip on":a?"chip":"chip off"}
      aria-pressed=${e.scope==="all"}
      aria-disabled=${!a}
      @click=${()=>{if(!a){this.followNote="Everything needs Follow releases across all themes, in the integration's options. It reads every set of the year once a day, about 3 Brickset calls, where your own themes alone take fewer.";return}this.pick({scope:"all",themes:[]})}}
    >
      Everything
    </button>`,c=o?e.themes.length:0,h=n`<button
      class=${o?"chip on":"chip"}
      aria-pressed=${o}
      aria-expanded=${o&&this.themesOpen}
      @click=${()=>{this.wiggling=!1;let f=Qt(o,this.themesOpen);this.themesOpen=f.open,f.pick&&this.pick({scope:"mine",themes:[]})}}
    >
      ${this.kind==="themes"?"All my themes":"My themes"}
      ${c&&!this.themesOpen?n`<span>· ${c}</span>`:d}
      <ha-icon
        class="drop"
        icon=${o&&this.themesOpen?"mdi:chevron-up":"mdi:chevron-down"}
      ></ha-icon>
    </button>`,p=Jt({mine:o,open:this.themesOpen,wiggling:this.wiggling,followed:t.followed.length}),u=p.themes;return n`<div class="chips">
        ${this.kind==="releases"?l:d}
        ${t.followed.length?h:d}
        ${u&&this.kind==="releases"?n`<span class="divider" aria-hidden="true"></span>`:d}
        ${(u?t.followed:[]).map(f=>{let b=e.scope==="mine"&&e.themes.includes(f);return n`<span
            class=${this.wiggling?"chipwrap wiggle":"chipwrap"}
          >
            <button
              class=${b?"chip on":"chip"}
              aria-pressed=${b}
              @pointerdown=${this.holdStart}
              @pointerup=${this.holdEnd}
              @pointerleave=${this.holdEnd}
              @pointercancel=${this.holdEnd}
              @contextmenu=${v=>v.preventDefault()}
              @click=${()=>{let v=Xt(this.held,this.wiggling);this.held=!1,v==="pick"&&this.pick({scope:"mine",themes:ve(e.scope==="mine"?e.themes:[],f,t.followed)})}}
            >
              <span
                class="key"
                style="background:${J(r.get(f))}"
              ></span>
              ${f}
            </button>
            ${this.wiggling?n`<button
                    class="remove"
                    aria-label=${`Stop following ${f}`}
                    ?disabled=${this.following}
                    @click=${()=>{this.follow(f,!1)}}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>`:d}
          </span>`})}
        ${p.trailing==="done"?n`<button
                class="chip on"
                @click=${()=>this.wiggling=!1}
              >
                Done
              </button>`:p.trailing==="edit"?this.followChip():d}
      </div>
      ${this.adding?this.editor():d}
      ${this.followNote&&!this.adding?n`<p class="caveat" role="status">${this.followNote}</p>`:d}`}followControls(){return this.dash?.can_change?n`<div class="chips">${this.followChip()}</div>
      ${this.adding?this.editor():d}`:d}followChip(){if(!this.dash?.can_change||this.adding)return d;let e=this.dash.followed.length>0;return n`<button class="chip" @click=${()=>{this.openEditor()}}>
      <ha-icon icon=${e?"mdi:pencil":"mdi:plus"}></ha-icon>
      ${e?"Edit themes":"Follow a theme"}
    </button>`}async openEditor(){this.adding=!0,this.followNote="",await this.loadThemes()}async loadThemes(){try{this.themeList=await this.hass.callWS(z("lego/themes",this.entryId||this.dash?.entry_id||""))}catch(e){this.followNote=C(e)}}editor(){let e=this.themeList,t=e?.followed??this.dash?.followed??[],r=new Set(t.map(l=>l.toLowerCase())),o=e?e.follow_cost?E(e.follow_cost,"call","calls"):"free":"\u2026",a=`lego-themes-${this.kind}`;return n`<div class="follow">
        <input
          list=${a}
          .value=${this.draft}
          placeholder="Theme name, such as Technic"
          aria-label="Theme to follow"
          @input=${l=>{this.draft=l.target.value}}
          @keydown=${l=>{l.key==="Enter"&&this.follow(this.draft,!0)}}
        />
        <datalist id=${a}>
          ${(e?.themes??[]).filter(l=>!r.has(l.toLowerCase())).map(l=>n`<option value=${l}></option>`)}
        </datalist>
        <button
          class="update"
          ?disabled=${!this.draft.trim()||this.following}
          title=${`Follow this theme, using ${o} of today's Brickset budget`}
          @click=${()=>{this.follow(this.draft,!0)}}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          ${this.following?"Following\u2026":"Follow"}
          <span class="sep" aria-hidden="true"></span>
          <span class="cost">${o}</span>
        </button>
        <button class="link" @click=${()=>this.adding=!1}>Done</button>
      </div>
      ${t.length?n`<div class="chips" role="group" aria-label="Themes you follow">
              ${t.map(l=>n`<button
                    class="chip"
                    aria-label=${`Stop following ${l}`}
                    ?disabled=${this.following}
                    @click=${()=>{this.follow(l,!1)}}
                  >
                    ${l}
                    <ha-icon class="drop" icon="mdi:close"></ha-icon>
                  </button>`)}
            </div>`:d}
      ${this.followNote?n`<p class="caveat" role="status">${this.followNote}</p>`:d}`}async follow(e,t){let r=e.trim();if(!(!r||this.following)){this.following=!0,this.followNote="";try{let o=await this.hass.callWS({...z("lego/themes/follow",this.entryId||this.dash?.entry_id||""),theme:r,follow:t});t&&(this.draft=""),o.complete||(this.followNote=`Following ${r}. Its sets arrive with the next check, as today's budget is spent.`),await this.loadThemes()}catch(o){this.followNote=C(o);return}finally{this.following=!1}this.dispatchEvent(new CustomEvent(ce,{bubbles:!0,composed:!0}))}}stack(e,t,r,o){let a=v=>`${t(v)*100}%`,l=e.at>=r-.01&&e.at<=o+.01,c=We(e.themes.length),h=We(e.themes.length,14),p=this.hass?.locale?.language,u=v=>new Date(v).toLocaleDateString(p,{day:"numeric",month:"short"}),f=e.points.slice(0,js),b=t(e.at)<.25?"tip start":t(e.at)>.75?"tip end":"tip";return n`<button
      class=${l?"stack":"stack out"}
      style="left:${a(e.at)}"
      aria-label=${e.points.map(v=>`${L(v)}, ${u(v.date)}`).join("; ")}
      aria-pressed=${this.compact?this.openStack?.at===e.at:d}
      @click=${()=>{this.compact&&(this.openStack=this.openStack?.at===e.at?void 0:e)}}
    >
      ${e.themes.map((v,y)=>n`<span
            class="disc"
            style="--rest:${c[y]}px;--fan:${h[y]}px;background:${this.themeColour(v)};z-index:${10-y}"
          ></span>`)}
      ${e.extra?n`<span class="extra">+${e.extra}</span>`:d}
      <span class=${b} aria-hidden="true">
        ${f.map(v=>n`<span class="tipline">
              <span
                class="key"
                style="background:${this.themeColour(v.theme)}"
              ></span>
              <span class="tipname">${L(v)}</span>
              <span class="tipdate">${u(v.date)}</span>
            </span>`)}
        ${e.points.length>f.length?n`<span class="tipmore"
                >+${e.points.length-f.length} more</span
              >`:d}
      </span>
    </button>`}timeline(e){let t=new Date,r=new Date(t.getFullYear(),0,1),o=Math.max(V(r,e.span.from),0),a=e.span.to?Math.min(V(r,e.span.to),B):B,l=Ot(o,a,this.compact),c=y=>(y-l.from)/(l.to-l.from),h=y=>`${c(y)*100}%`,p=y=>y>=l.from-.05&&y<=l.to+.05,u=Pt(e.timeline,r).filter(y=>p(y.at)),f=this.hass?.locale?.language,b=e.timeline.filter(y=>{let w=V(r,y.date);return w>=o&&w<=a}).length,v=V(r,t);return n`<div
        class=${this.compact?"timescroll compact":"timescroll"}
      >
        <div
          class="timeline"
          role="group"
          style="width:${l.width*100}%"
          aria-label=${`${E(e.timeline.length,"set","sets")} from January to next March, ${b} in the chosen span`}
        >
          <div class="line"></div>
          <div
            class="window"
            style="left:${h(o)};width:${h(l.from+Math.max(a-o,0))}"
          ></div>
          ${u.map(y=>this.stack(y,c,o,a))}
          ${p(v)?n`<ha-icon
                  class="today"
                  icon="mdi:chevron-down"
                  style="left:${h(v)}"
                ></ha-icon>`:d}
          ${Array.from({length:B},(y,w)=>w).filter(y=>y+1>l.from&&y<l.to).map(y=>{let w=new Date(r.getFullYear(),y,1).toLocaleDateString(f,{month:"short"});return n`<span
                class=${y%3===0?"month quarter":"month"}
                style="left:${h(y)};width:${h(l.from+1)}"
                aria-hidden="true"
                >${w}</span
              >`})}
        </div>
      </div>
      ${this.compact&&this.openStack?this.picked(this.openStack):d}`}picked(e){let t=this.hass?.locale?.language;return n`<div class="picked" role="status">
      ${e.points.map(r=>n`<span class="tipline">
            <span
              class="key"
              style="background:${this.themeColour(r.theme)}"
            ></span>
            <span class="tipname">${L(r)}</span>
            <span class="tipdate"
              >${new Date(r.date).toLocaleDateString(t,{day:"numeric",month:"short"})}</span
            >
          </span>`)}
    </div>`}cards(){let e=this.data?.sets;if(!e)return n`<p class="muted">Loading…</p>`;if(!e.length){let t=this.filter&&this.filter.span==="coming";return this.filler(t?"Nothing due in this span yet.":"Nothing new in this span. Try a longer one.")}return n`<div class="carousel">
      ${e.map(t=>this.card(t,"release",this.themeColour(t.theme)))}
      ${this.tail()}
    </div>`}};S.styles=[x.styles,$`
      /* A theme chip and, while the chips wiggle, its × in the corner. */
      .chipwrap {
        display: inline-flex;
        position: relative;
        -webkit-touch-callout: none;
        user-select: none;
      }
      .chipwrap .remove {
        align-items: center;
        appearance: none;
        background: var(--lego-text);
        border: 2px solid var(--lego-surface);
        border-radius: 50%;
        color: var(--lego-surface);
        cursor: pointer;
        display: flex;
        height: 24px;
        justify-content: center;
        padding: 0;
        position: absolute;
        right: -8px;
        top: -8px;
        width: 24px;
        --mdc-icon-size: 14px;
      }
      @media (prefers-reduced-motion: no-preference) {
        .chipwrap.wiggle .chip {
          animation: wiggle 0.3s ease-in-out infinite alternate;
        }
        .chipwrap.wiggle:nth-child(odd) .chip {
          animation-delay: -0.15s;
        }
      }
      @keyframes wiggle {
        from {
          transform: rotate(-1.5deg);
        }
        to {
          transform: rotate(1.5deg);
        }
      }
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
      /* On a phone the timeline is drawn wider than the row and scrolls, so the
         hover card, which would be clipped, gives way to the list below it. */
      .timescroll.compact {
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scrollbar-width: thin;
      }
      .timescroll.compact .tip {
        display: none;
      }
      .picked {
        background: var(--lego-ground);
        border-radius: var(--ha-border-radius-md, 8px);
        display: grid;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-1, 4px);
        margin: 0 0 var(--ha-space-3, 12px);
        padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      }
      .picked .tipline {
        align-items: center;
        display: grid;
        gap: var(--ha-space-2, 8px);
        grid-template-columns: 10px minmax(0, 1fr) auto;
      }
      .picked .tipname {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .picked .tipdate {
        color: var(--lego-text-2);
        font-variant-numeric: tabular-nums;
      }
    `],g([k()],S.prototype,"kind",2),g([m()],S.prototype,"filter",2),g([m()],S.prototype,"data",2),g([m()],S.prototype,"error",2),g([m()],S.prototype,"adding",2),g([m()],S.prototype,"themeList",2),g([m()],S.prototype,"draft",2),g([m()],S.prototype,"following",2),g([m()],S.prototype,"followNote",2),g([m()],S.prototype,"themesOpen",2),g([m()],S.prototype,"wiggling",2),g([m()],S.prototype,"compact",2),g([m()],S.prototype,"openStack",2);T("lego-releases-row",S);var Hs=365,Us=12,rs=70,Je=2*Math.PI*rs,Is=1.5,P=class extends x{constructor(){super(...arguments);this.kind="value";this.hover="";this.trendOpen=!1;this.hoverPoint=null;this.historyFor=""}get row(){return this.kind}willUpdate(e){super.willUpdate(e);let t=`${this.dash?.entry_id}:${this.kind}`;this.dash&&t!==this.historyFor&&(this.historyFor=t,this.history=void 0)}updated(){this.trendOpen&&!this.collapsed&&this.history===void 0&&this.loadHistory()}format(e){return this.kind==="value"?this.money(e):this.num(Math.round(e))}subtitle(){let e=this.dash?.stats;return e?this.kind==="value"?`${this.money(e.value)} at LEGO.com RRP`:E(e.pieces_owned,"piece","pieces"):""}body(){let e=this.dash?.stats;if(!e)return n`<p class="muted">Loading…</p>`;let t=Ct(this.dash?.by_theme??[],this.kind),r=this.kind==="value"?e.value:e.pieces_owned;if(!t.length)return n`<p class="muted">
        Nothing owned with a published figure yet.
      </p>`;let o=Y(t.filter(l=>!l.other).map(l=>l.theme)),a=l=>J(l.other?"other":o.get(l.theme));return n`
      <div class="chart">
        ${this.donut(t,r,a)} ${this.bars(t,r,a)}
      </div>
      <p class="footnote">
        <span
          >${this.kind==="value"&&e.sets_missing_price?`${E(e.sets_missing_price,"set has","sets have")} no published price and ${e.sets_missing_price===1?"is":"are"} not counted.`:""}</span
        >
        ${this.kind==="value"?n`<span>At LEGO.com RRP</span>`:d}
      </p>
      ${this.trend()}
    `}donut(e,t,r){let o=e.reduce((h,p)=>h+p.amount,0)||1,a=0,l=e.map(h=>{let p=Math.max(h.amount/o*Je-Is,.5),u=D`<circle
        cx="100"
        cy="100"
        r=${rs}
        fill="none"
        stroke=${r(h)}
        stroke-width=${this.hover===h.theme?34:28}
        stroke-dasharray=${`${p} ${Je-p}`}
        stroke-dashoffset=${-a}
        class=${this.hover&&this.hover!==h.theme?"faded":""}
        @mouseenter=${()=>this.hover=h.theme}
        @mouseleave=${()=>this.hover=""}
      ></circle>`;return a+=h.amount/o*Je,u}),c=e.find(h=>h.theme===this.hover);return n`<div class="donut">
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
        <span class="n">${this.format(c?c.amount:t)}</span>
        <span class="l">${c?c.theme:"in total"}</span>
      </div>
    </div>`}bars(e,t,r){let o=e.reduce((a,l)=>Math.max(a,l.amount),0)||1;return n`<ul class="bars">
      ${e.map((a,l)=>{let c=this.hover===a.theme,h=this.hover&&!c,p=a.setNumbers.slice(0,Us),u=a.setNumbers.length-p.length;return n`<li>
          <button
            class=${c?"bar-row on":"bar-row"}
            aria-describedby=${`tip-${l}`}
            @mouseenter=${()=>this.hover=a.theme}
            @mouseleave=${()=>this.hover=""}
            @focus=${()=>this.hover=a.theme}
            @blur=${()=>this.hover=""}
          >
            <span class="label"
              ><span class="key" style="background:${r(a)}"></span
              >${a.theme}</span
            >
            <span class="track">
              <span
                class=${h?"bar faded":"bar"}
                style="width:${Math.max(a.amount/o*100,1)}%;background:${r(a)}"
              ></span>
              <span class="amount">${this.format(a.amount)}</span>
            </span>
            ${c?n`<span class="tip" role="tooltip" id=${`tip-${l}`}>
                    <b>${a.theme} · ${this.format(a.amount)}</b>
                    ${Math.round(a.amount/(t||1)*100)}% of the
                    collection, ${E(a.sets,"set","sets")}
                    ${p.length?n`<span class="numbers"
                            >${p.join(", ")}${u?`, and ${u} more`:""}</span
                          >`:d}
                  </span>`:d}
          </button>
        </li>`})}
    </ul>`}trend(){let e=Array.isArray(this.history)?this.history:null;return n`<div class="subsection">
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
        ${e?n`<span class="sub"
                >${this.format(e[0].v)} →
                ${this.format(e[e.length-1].v)}</span
              >`:d}
      </button>
      ${this.trendOpen?this.trendChart():d}
    </div>`}async loadHistory(){let e=this.dash?.history?.[this.kind],t=this.historyFor;if(!e){this.history="none";return}this.history="loading";try{let r=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(Date.now()-Hs*864e5).toISOString(),statistic_ids:[e],period:"week",types:this.kind==="value"?["state"]:["mean"]});if(t!==this.historyFor)return;let o=At(r[e]??[]);this.history=o.length>=2?o:"none"}catch{t===this.historyFor&&(this.history="none")}}trendChart(){let e=this.history;if(e===void 0||e==="loading")return n`<p class="muted">Loading the trend…</p>`;if(e==="none")return n`<p class="muted">
        No history yet. Home Assistant records it weekly from the sensor, so a
        line appears after a couple of weeks.
      </p>`;let t=e,r=Math.min(...t.map(w=>w.v)),a=Math.max(...t.map(w=>w.v))-r||1,l=t[0].t,c=t[t.length-1].t-l||1,h=w=>(w.t-l)/c*100,p=w=>90-(w.v-r)/a*80,u=t.map(w=>`${h(w)},${p(w)}`).join(" "),f=t[t.length-1],b=this.hoverPoint===null?void 0:t[this.hoverPoint],v=b??f,y=w=>new Date(w).toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short"});return n`
      <div
        class="plot"
        @pointermove=${w=>{let st=w.currentTarget.getBoundingClientRect(),rt=l+(w.clientX-st.left)/st.width*c,Te=0;t.forEach((as,ns)=>{Math.abs(as.t-rt)<Math.abs(t[Te].t-rt)&&(Te=ns)}),this.hoverPoint=Te}}
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
          ${b?D`<line class="cross" x1=${h(b)} y1="0" x2=${h(b)} y2="100"></line>`:d}
        </svg>
        <span class="dot" style="left:${h(v)}%;top:${p(v)}%"></span>
        <span
          class="readout"
          style="left:${Math.min(Math.max(h(v),12),88)}%"
          >${this.format(v.v)} · ${y(v.t)}</span
        >
      </div>
      <div class="axis">
        <span>${y(t[0].t)}</span><span>${y(f.t)}</span>
      </div>
    `}};P.styles=[x.styles,$`
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
      /* A narrow row gives each theme's name a line of its own above its bar, so
         the name is not cut short to make room for the bar. */
      @container (max-width: 480px) {
        .bar-row {
          gap: var(--ha-space-1, 4px);
          grid-template-columns: minmax(0, 1fr);
          padding-block: var(--ha-space-1, 4px);
        }
        .tip {
          left: 0;
          max-width: none;
          right: 0;
        }
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
    `],g([k()],P.prototype,"kind",2),g([m()],P.prototype,"hover",2),g([m()],P.prototype,"trendOpen",2),g([m()],P.prototype,"history",2),g([m()],P.prototype,"hoverPoint",2);T("lego-value-row",P);var is="Mark sets as wanted on Brickset and they land here.",Qe=class extends x{constructor(){super(...arguments);this.row="wishlist"}subtitle(){return E(this.dash?.wishlist.length??0,"set","sets")}body(){let e=this.dash?.wishlist??[];return e.length?n`<div class="carousel">
      ${e.map(t=>this.card(t,"retirement",this.themeColour(t.theme)))}
      ${this.tail(is)}
    </div>`:this.filler(`Nothing on your wishlist yet. ${is}`)}};T("lego-wishlist-row",Qe);var qs={account:"Brickset account",collapsed:"Start folded",measure:"Show",row:"Row",scope:"Themes",themes:"Only these themes",span:"Span"},Ws={account:"Leave empty to show the account you opened last in the LEGO panel.",collapsed:"Show only the card's header until it is opened.",scope:"Everything needs Follow releases across all themes in the options.",themes:"Narrows My themes to some of the themes you follow.",span:"Leave empty for the row's own default."},Ee={name:"account",selector:{config_entry:{integration:"lego"}}},Ae={name:"collapsed",selector:{boolean:{}}};function Ce(i,s=()=>{}){return{schema:i,computeLabel:e=>qs[e.name],computeHelper:e=>Ws[e.name],assertConfig:s}}var F=class extends A{constructor(){super(...arguments);this.error="";this.loadedFor=null;this.reload=()=>{this.loadedFor=null,this.requestUpdate()}}setConfig(e){if(!e)throw new Error("Invalid configuration");this.config=e,this.loadedFor=null}getCardSize(){return this.config?.collapsed?1:6}getGridOptions(){return{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),window.addEventListener(be,this.reload)}disconnectedCallback(){window.removeEventListener(be,this.reload),super.disconnectedCallback()}updated(){let e=this.config?.account??"";this.hass&&this.config&&this.loadedFor!==e&&(this.loadedFor=e,Bt(this.hass,e).then(t=>{this.dash=t,this.error=""}).catch(t=>this.error=C(t)))}render(){return n`<ha-card
      @lego-changed=${()=>xe()}
      @lego-toggle=${e=>e.stopPropagation()}
    >
      ${this.error?n`<div class="error">${this.error}</div>`:this.dash&&this.hass?this.row(this.dash):d}
    </ha-card>`}};F.styles=[Q,$`
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
    `],g([k({attribute:!1})],F.prototype,"hass",2),g([m()],F.prototype,"config",2),g([m()],F.prototype,"dash",2),g([m()],F.prototype,"error",2);var Xe=class extends F{static getStubConfig(){return{}}static getConfigForm(){return Ce([Ee,Ae])}row(s){return n`<lego-collection-row
      bare
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${s}
      .entryId=${s.entry_id}
    ></lego-collection-row>`}},Ze=class extends F{static getStubConfig(){return{}}static getConfigForm(){return Ce([Ee,Ae])}row(s){return n`<lego-wishlist-row
      bare
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${s}
      .entryId=${s.entry_id}
    ></lego-wishlist-row>`}},et=class extends F{static getStubConfig(){return{measure:"value"}}static getConfigForm(){return Ce([Ee,{name:"measure",selector:{select:{mode:"dropdown",options:[{value:"value",label:"Collection value"},{value:"pieces",label:"Pieces"}]}}},Ae])}row(s){return n`<lego-value-row
      bare
      .kind=${this.config?.measure==="pieces"?"pieces":"value"}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${s}
      .entryId=${s.entry_id}
    ></lego-value-row>`}},tt=class extends F{static getStubConfig(){return{row:"releases"}}static getConfigForm(){let s=[...new Set(Object.values(R).flat())];return Ce([Ee,{name:"row",selector:{select:{mode:"dropdown",options:Object.keys(R).map(e=>({value:e,label:X[e].title}))}}},{name:"scope",selector:{select:{mode:"dropdown",options:[{value:"mine",label:"My themes"},{value:"all",label:"Everything"}]}}},{name:"themes",selector:{select:{multiple:!0,custom_value:!0,options:[]}}},{name:"span",selector:{select:{mode:"dropdown",options:s.map(e=>({value:e,label:j(e)}))}}},Ae],e=>{let t=Dt(e.row??"releases",e.span);if(t)throw new Error(t)})}row(s){let e=this.config?.row??"releases",t={};this.config?.scope&&(t.scope=this.config.scope),this.config?.themes&&(t.themes=this.config.themes),this.config?.span&&(t.span=this.config.span);let r={...s,release_filters:{...s.release_filters,[e]:{...K(e,s),...t}}};return n`<lego-releases-row
      bare
      .kind=${e}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${r}
      .entryId=${s.entry_id}
    ></lego-releases-row>`}},Gs=[["lego-collection-card",Xe,"LEGO collection","Your Brickset collection's totals, with every set and a search."],["lego-releases-card",tt,"LEGO releases","New and upcoming sets, across every theme or the ones you follow."],["lego-wishlist-card",Ze,"LEGO wishlist","The sets you want, soonest to retire first."],["lego-value-card",et,"LEGO collection value","What your collection is worth at LEGO.com RRP, by theme."]],Ks="https://github.com/PineappleEmperor/ha-lego#dashboard-cards";for(let[i,s,e,t]of Gs)T(i,s),window.customCards=window.customCards??[],window.customCards.some(r=>r.type===i)||window.customCards.push({type:i,name:e,description:t,preview:!0,documentationURL:Ks});var os=["releases","recent","upcoming","themes"],_=class extends A{constructor(){super(...arguments);this.narrow=!1;this.dark=!1;this.error="";this.accounts=[];this.account="";this.defaultAccount="";this.switching="";this.picking=!1;this.customising=!1;this.folded={};this.dragging="";this.over="";this.foldedFor="";this.onToggle=e=>{let{row:t,collapsed:r}=e.detail;this.folded={...this.folded,[t]:r}};this.onFilter=e=>{let{row:t,filter:r}=e.detail;this.dash&&(this.dash={...this.dash,release_filters:{...this.dash.release_filters,[t]:r}})};this.onMove=e=>{let{row:t,step:r}=e.detail;this.move(t,r,this.visible())};this.onChanged=()=>{xe(),this.load()};this.onTouchMove=e=>{if(!this.dragging||e.pointerType==="mouse")return;let t=this.renderRoot.elementsFromPoint(e.clientX,e.clientY).map(r=>r.closest(".slot")).find(r=>r&&r.dataset.row);t?.dataset.row&&(this.over=t.dataset.row)};this.onPickerKey=e=>{e.key==="Escape"&&this.picking&&(this.picking=!1,this.renderRoot.querySelector(".account")?.focus())};this.onOutside=e=>{let t=this.renderRoot.querySelector(".accountpick");this.picking&&t&&!e.composedPath().includes(t)&&(this.picking=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this.onOutside),this.load()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this.onOutside)}willUpdate(){this.dark=!!this.hass?.themes?.darkMode}async load(){try{if(!this.accounts.length){let t=await this.hass.callWS({type:"lego/accounts"});this.accounts=t.accounts,this.account=t.selected??"",this.defaultAccount=this.account}let e=await this.hass.callWS(z("lego/dashboard",this.account));e.entry_id!==this.foldedFor&&(this.foldedFor=e.entry_id,this.folded=Object.fromEntries(e.collapsed.map(t=>[t,!0]))),this.dash=e,this.error=""}catch(e){this.error=C(e)}}async selectAccount(e){if(e!==this.account){this.account=e,this.switching=this.accounts.find(t=>t.entry_id===e)?.name??"account";try{await this.load()}finally{this.switching=""}}}async makeDefault(e){try{await this.hass.callWS({type:"lego/account/set",config_entry_id:e}),this.defaultAccount=e}catch(t){this.error=C(t)}}async save(e){if(this.dash){this.dash={...this.dash,...e};try{let t=await this.hass.callWS({type:"lego/panel_config/set",...e});this.dash&&(this.dash={...this.dash,...t})}catch{}}}visible(){let e=this.dash;return e?Ge(e.rows,e.release_mode).filter(t=>!e.hidden.includes(t)):[]}move(e,t,r){if(!this.dash)return;let o=Nt(this.dash.rows,r,e,t);o!==this.dash.rows&&(this.save({rows:o}),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-row="${e}"] > *`)?.focusHandle?.()))}onTouchStart(e,t){e.pointerType==="mouse"||!e.composedPath().some(o=>o instanceof Element&&o.classList.contains("drag"))||(e.currentTarget.setPointerCapture(e.pointerId),this.dragging=t,this.over=t)}onTouchEnd(e){this.dragging&&this.onDrop(this.over,e)}onDrop(e,t){let r=this.dragging;if(this.dragging="",this.over="",!this.dash||!r||r===e)return;let o=this.dash.rows.filter(c=>c!==r),a=o.indexOf(e),l=t.indexOf(r)<t.indexOf(e);o.splice(a+(l?1:0),0,r),this.save({rows:o})}render(){return n`
      <div class="app">
        ${this.renderHeader()}
        <div class="page">
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
      </div>
    `}renderHeader(){return n`<header class=${this.narrow?"narrow":""}>
      <div class="title">
        ${this.narrow?n`<ha-menu-button
                .hass=${this.hass}
                .narrow=${this.narrow}
              ></ha-menu-button>`:d}
        <span class="logo">${we(Lt)}</span>
        <h1>LEGO</h1>
      </div>
      ${this.accounts.length>1?this.accountPicker():d}
    </header>`}renderMeter(e){let{share:t,tight:r}=Yt(e);return n`<div
      class=${r?"meter tight":"meter"}
      title=${Tt(e.calls_today,e.budget,new Date(e.resets_at).toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"}))}
    >
      <span class="meter-label">Brickset calls</span>
      <span
        class="meter-bar"
        role="meter"
        aria-label="Brickset calls used today"
        aria-valuemin="0"
        aria-valuemax=${e.budget}
        aria-valuenow=${e.calls_today}
        ><span style="width:${t*100}%"></span
      ></span>
      <span class="meter-count"
        >${e.calls_today} of ${e.budget}<span class="when"> today</span
        ><span class="unit"> calls</span></span
      >
    </div>`}accountPicker(){let e=this.accounts.find(t=>t.entry_id===this.account);return n`<div class="accountpick" @keydown=${this.onPickerKey}>
      <div class="accountbar">
        <button
          class="account"
          aria-haspopup="true"
          aria-expanded=${this.picking}
          aria-label=${`Brickset account: ${e?.name??""}`}
          @click=${()=>this.picking=!this.picking}
        >
          <span class="names" aria-hidden="true">
            ${this.accounts.map(t=>n`<span
                  class=${t.entry_id===e?.entry_id?"name":"name ghost"}
                  >${t.name}</span
                >`)}
          </span>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
        ${e?this.brickButton(e):d}
      </div>
      ${this.picking?n`<ul class="menu">
              ${this.accounts.map(t=>n`<li>
                    <button
                      class="pick"
                      aria-current=${t.entry_id===this.account}
                      @click=${()=>{this.picking=!1,this.selectAccount(t.entry_id)}}
                    >
                      ${t.name}
                    </button>
                    ${this.brickButton(t)}
                  </li>`)}
            </ul>`:d}
    </div>`}brickButton(e){let t=e.entry_id===this.defaultAccount,r=t?`${e.name} opens by default`:`Open ${e.name} by default`;return n`<button
      class="brick"
      title=${r}
      aria-label=${r}
      aria-pressed=${t}
      @click=${()=>{t?void 0:this.makeDefault(e.entry_id)}}
    >
      <ha-icon
        icon=${t?"mdi:toy-brick":"mdi:toy-brick-outline"}
      ></ha-icon>
    </button>`}renderHome(){let e=this.dash;if(!e)return n`<p class="muted pad">Loading your collection…</p>`;let t=this.visible(),{anyOpen:r,next:o}=Vt(t,this.folded);return n`<div
      class="rows"
      @lego-toggle=${this.onToggle}
      @lego-move=${this.onMove}
      @lego-filter=${this.onFilter}
      @lego-changed=${this.onChanged}
    >
      <div class="homebar">
        ${this.renderMeter(e.quota)}
        <button class="link" @click=${()=>this.folded=o}>
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
      ${this.customising?this.renderCustomise(e):d}
      ${t.length?t.map(a=>this.renderRow(a,t)):n`<p class="muted">
              Every row is hidden. Choose Customise to bring some back.
            </p>`}
    </div>`}renderRow(e,t){let r={hass:this.hass,dash:this.dash,entryId:this.dash?.entry_id??"",collapsed:!!this.folded[e]},o;return os.includes(e)?o=n`<lego-releases-row
        .kind=${e}
        .hass=${r.hass}
        .dash=${r.dash}
        .entryId=${r.entryId}
        .collapsed=${r.collapsed}
        handle
      ></lego-releases-row>`:e==="value"||e==="pieces"?o=n`<lego-value-row
        .kind=${e}
        .hass=${r.hass}
        .dash=${r.dash}
        .entryId=${r.entryId}
        .collapsed=${r.collapsed}
        handle
      ></lego-value-row>`:e==="wishlist"?o=n`<lego-wishlist-row
        .hass=${r.hass}
        .dash=${r.dash}
        .entryId=${r.entryId}
        .collapsed=${r.collapsed}
        handle
      ></lego-wishlist-row>`:o=n`<lego-collection-row
        .hass=${r.hass}
        .dash=${r.dash}
        .entryId=${r.entryId}
        .collapsed=${r.collapsed}
        handle
      ></lego-collection-row>`,n`<div
      class=${["slot",this.dragging===e?"dragging":"",this.dragging&&this.over===e?"over":""].join(" ")}
      data-row=${e}
      @dragstart=${()=>this.dragging=e}
      @dragend=${()=>{this.dragging="",this.over=""}}
      @dragover=${a=>a.preventDefault()}
      @dragenter=${()=>this.over=e}
      @drop=${()=>this.onDrop(e,t)}
      @pointerdown=${a=>this.onTouchStart(a,e)}
      @pointermove=${this.onTouchMove}
      @pointerup=${()=>this.onTouchEnd(t)}
      @pointercancel=${()=>{this.dragging="",this.over=""}}
    >
      ${o}
    </div>`}renderCustomise(e){let t=Ge(e.rows,e.release_mode),r=e.release_status.all!==null;return n`<section class="row customise" aria-label="Customise this page">
      <h2>Customise this page</h2>
      <p class="muted">
        Saved to your Home Assistant user, so it follows you to every device.
      </p>
      <div class="setting">
        <span>Release rows</span>
        <div class="pills" role="group" aria-label="Release rows">
          ${["combined","separate"].map(o=>n`<button
                class=${e.release_mode===o?"pill on":"pill"}
                aria-pressed=${e.release_mode===o}
                @click=${()=>{this.save({release_mode:o})}}
              >
                ${o==="combined"?"Combined":"Separate"}
              </button>`)}
        </div>
      </div>
      <div class="crow heading" aria-hidden="true">
        <span></span><span>Show</span><span>Row</span><span>Starts</span>
      </div>
      <ul>
        ${t.map(o=>this.renderCustomiseRow(e,o,t))}
      </ul>
      ${r?d:n`<p class="muted">
              For Everything, Out recently and Coming soon, turn on Follow
              releases across all themes in the integration's options.
            </p>`}
    </section>`}renderCustomiseRow(e,t,r){let o=X[t].title,a=!e.hidden.includes(t),l=e.collapsed.includes(t)?"collapsed":"open",c=h=>{let p=e.collapsed.filter(u=>u!==t);h&&p.push(t),this.folded={...this.folded,[t]:h},this.save({collapsed:p})};return n`<li>
      <div class="crow">
        <button
          class="drag"
          data-custom=${t}
          aria-label=${`Move ${o} up or down`}
          title="Use the arrow keys to reorder"
          @keydown=${h=>{let p=h.key==="ArrowUp"?-1:h.key==="ArrowDown"?1:0;p&&(h.preventDefault(),this.move(t,p,r),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-custom="${t}"]`)?.focus()))}}
        >
          <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
        </button>
        <input
          type="checkbox"
          .checked=${a}
          aria-label=${`Show ${o}`}
          @change=${h=>{let p=h.target.checked,u=e.hidden.filter(f=>f!==t);p||u.push(t),this.save({hidden:u})}}
        />
        <span class="rowname"
          ><ha-icon icon=${X[t].icon}></ha-icon>${o}</span
        >
        <div class="pills" role="group" aria-label=${`${o} starts`}>
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
      ${os.includes(t)?this.renderStartsOn(e,t):d}
    </li>`}renderStartsOn(e,t){let r=K(t,e),o=c=>{let h=e.release_filters[t]??{};this.save({release_filters:{...e.release_filters,[t]:{...h,...c}}})},a=(c,h,p)=>n`<button
        class=${h?"chip small on":"chip small"}
        aria-pressed=${h}
        @click=${p}
      >
        ${c}
      </button>`,l=t==="releases"||t==="themes";return n`<div class="startson">
      <span class="muted-label">Starts on</span>
      ${l&&t==="releases"&&e.release_status.all!==null?a("Everything",r.scope==="all",()=>o({scope:"all",themes:[]})):d}
      ${l&&e.followed.length?a(t==="themes"?"All my themes":"My themes",r.scope==="mine"&&!r.themes.length,()=>o({scope:"mine",themes:[]})):d}
      ${l?e.followed.map(c=>a(c,r.scope==="mine"&&r.themes.includes(c),()=>o({scope:"mine",themes:ve(r.scope==="mine"?r.themes:[],c,e.followed)}))):d}
      <label class="spanpick"
        >Span
        <select
          @change=${c=>o({span:c.target.value})}
        >
          ${R[t].map(c=>n`<option value=${c} ?selected=${c===r.span}>
                ${j(c)}
              </option>`)}
        </select></label
      >
    </div>`}};_.styles=[Q,$e,_e,Se,$`
      :host {
        background: var(--lego-ground);
        display: block;
        min-height: 100vh;
      }
      .app {
        padding: 0 0 var(--ha-space-8, 32px);
      }
      /* The toolbar spans the window like Home Assistant's own; only the rows
         below it are capped, so a wide screen does not stretch the cards. */
      .page {
        margin: 0 auto;
        max-width: 1400px;
      }
      /* One toolbar row at Home Assistant's own header height. */
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
        flex: 1 1 auto;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-2, 8px);
        min-height: 48px;
        min-width: 0;
        white-space: nowrap;
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
        flex: 0 1 120px;
        height: 8px;
        min-width: 48px;
        overflow: hidden;
      }
      .meter .unit {
        display: none;
      }
      .meter.tight .meter-count {
        color: var(--lego-want);
      }
      .meter-bar span {
        background: var(--lego-primary);
        display: block;
        height: 100%;
      }
      .meter.tight .meter-bar span {
        background: var(--lego-want);
      }
      /* A phone keeps the header to one line, the account on the right. */
      header.narrow {
        column-gap: var(--ha-space-2, 8px);
        flex-wrap: nowrap;
        padding-right: var(--ha-space-2, 8px);
      }
      .accountpick {
        margin-left: auto;
        max-width: 50%;
        position: relative;
      }
      header.narrow .accountpick {
        margin-left: auto;
        max-width: min(45%, 200px);
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
        max-width: calc(100vw - var(--ha-space-8, 32px));
        min-width: 240px;
        padding: var(--ha-space-1, 4px) 0;
        position: absolute;
        right: 0;
        top: 100%;
        z-index: 4;
      }
      .menu .pick {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
      /* The calls meter on the left, the page's own controls on the right. On a
         phone the label goes and the count names its unit instead. */
      .homebar {
        align-items: center;
        column-gap: var(--ha-space-2, 8px);
        container-type: inline-size;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: calc(-1 * var(--ha-space-2, 8px));
      }
      @container (max-width: 520px) {
        .meter-label,
        .meter .when {
          display: none;
        }
        .meter .unit {
          display: inline;
        }
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
    `],g([k({attribute:!1})],_.prototype,"hass",2),g([k({type:Boolean})],_.prototype,"narrow",2),g([k({type:Boolean,reflect:!0})],_.prototype,"dark",2),g([m()],_.prototype,"dash",2),g([m()],_.prototype,"error",2),g([m()],_.prototype,"accounts",2),g([m()],_.prototype,"account",2),g([m()],_.prototype,"defaultAccount",2),g([m()],_.prototype,"switching",2),g([m()],_.prototype,"picking",2),g([m()],_.prototype,"customising",2),g([m()],_.prototype,"folded",2),g([m()],_.prototype,"dragging",2),g([m()],_.prototype,"over",2);T("lego-panel",_);export{_ as LegoPanel};
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
