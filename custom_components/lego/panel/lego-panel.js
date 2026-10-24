var je=Object.defineProperty;var Be=Object.getOwnPropertyDescriptor;var g=(i,e,t,s)=>{for(var r=s>1?void 0:s?Be(e,t):e,a=i.length-1,o;a>=0;a--)(o=i[a])&&(r=(s?o(e,t,r):o(r))||r);return s&&r&&je(e,t,r),r};var at=globalThis,ot=at.ShadowRoot&&(at.ShadyCSS===void 0||at.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,kt=Symbol(),Kt=new WeakMap,V=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==kt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(ot&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Kt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Kt.set(t,e))}return e}toString(){return this.cssText}},Yt=i=>new V(typeof i=="string"?i:i+"",void 0,kt),x=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((s,r,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[a+1],i[0]);return new V(t,i,kt)},Jt=(i,e)=>{if(ot)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),r=at.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},_t=ot?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Yt(t)})(i):i;var{is:Ne,defineProperty:Le,getOwnPropertyDescriptor:Ue,getOwnPropertyNames:He,getOwnPropertySymbols:Ie,getPrototypeOf:qe}=Object,nt=globalThis,Xt=nt.trustedTypes,We=Xt?Xt.emptyScript:"",Ge=nt.reactiveElementPolyfillSupport,K=(i,e)=>i,Y={toAttribute(i,e){switch(e){case Boolean:i=i?We:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},lt=(i,e)=>!Ne(i,e),Qt={attribute:!0,type:String,converter:Y,reflect:!1,useDefault:!1,hasChanged:lt};Symbol.metadata??=Symbol("metadata"),nt.litPropertyMetadata??=new WeakMap;var T=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Qt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&Le(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){let{get:r,set:a}=Ue(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:r,set(o){let l=r?.call(this);a?.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Qt}static _$Ei(){if(this.hasOwnProperty(K("elementProperties")))return;let e=qe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(K("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(K("properties"))){let t=this.properties,s=[...He(t),...Ie(t)];for(let r of s)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let r of s)t.unshift(_t(r))}else e!==void 0&&t.push(_t(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Jt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:Y).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(e,t){let s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let a=s.getPropertyOptions(r),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Y;this._$Em=r;let l=o.fromAttribute(t,a.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(e,t,s,r=!1,a){if(e!==void 0){let o=this.constructor;if(r===!1&&(a=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??lt)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:a},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),a!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,a]of s){let{wrapped:o}=a,l=this[r];o!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,a,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};T.elementStyles=[],T.shadowRootOptions={mode:"open"},T[K("elementProperties")]=new Map,T[K("finalized")]=new Map,Ge?.({ReactiveElement:T}),(nt.reactiveElementVersions??=[]).push("2.1.2");var Tt=globalThis,Zt=i=>i,ct=Tt.trustedTypes,te=ct?ct.createPolicy("lit-html",{createHTML:i=>i}):void 0,oe="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,ne="?"+D,Ve=`<${ne}>`,B=document,X=()=>B.createComment(""),Q=i=>i===null||typeof i!="object"&&typeof i!="function",zt=Array.isArray,Ke=i=>zt(i)||typeof i?.[Symbol.iterator]=="function",St=`[ 	
\f\r]`,J=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ee=/-->/g,se=/>/g,P=RegExp(`>|${St}(?:([^\\s"'>=/]+)(${St}*=${St}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),re=/'/g,ie=/"/g,le=/^(?:script|style|textarea|title)$/i,Dt=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),n=Dt(1),R=Dt(2),xs=Dt(3),N=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),ae=new WeakMap,j=B.createTreeWalker(B,129);function ce(i,e){if(!zt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return te!==void 0?te.createHTML(e):e}var Ye=(i,e)=>{let t=i.length-1,s=[],r,a=e===2?"<svg>":e===3?"<math>":"",o=J;for(let l=0;l<t;l++){let c=i[l],h,u,p=-1,f=0;for(;f<c.length&&(o.lastIndex=f,u=o.exec(c),u!==null);)f=o.lastIndex,o===J?u[1]==="!--"?o=ee:u[1]!==void 0?o=se:u[2]!==void 0?(le.test(u[2])&&(r=RegExp("</"+u[2],"g")),o=P):u[3]!==void 0&&(o=P):o===P?u[0]===">"?(o=r??J,p=-1):u[1]===void 0?p=-2:(p=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?P:u[3]==='"'?ie:re):o===ie||o===re?o=P:o===ee||o===se?o=J:(o=P,r=void 0);let b=o===P&&i[l+1].startsWith("/>")?" ":"";a+=o===J?c+Ve:p>=0?(s.push(h),c.slice(0,p)+oe+c.slice(p)+D+b):c+D+(p===-2?l:b)}return[ce(i,a+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},Z=class i{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let a=0,o=0,l=e.length-1,c=this.parts,[h,u]=Ye(e,t);if(this.el=i.createElement(h,s),j.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=j.nextNode())!==null&&c.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let p of r.getAttributeNames())if(p.endsWith(oe)){let f=u[o++],b=r.getAttribute(p).split(D),_=/([.?@])?(.*)/.exec(f);c.push({type:1,index:a,name:_[2],strings:b,ctor:_[1]==="."?Et:_[1]==="?"?Ct:_[1]==="@"?Mt:H}),r.removeAttribute(p)}else p.startsWith(D)&&(c.push({type:6,index:a}),r.removeAttribute(p));if(le.test(r.tagName)){let p=r.textContent.split(D),f=p.length-1;if(f>0){r.textContent=ct?ct.emptyScript:"";for(let b=0;b<f;b++)r.append(p[b],X()),j.nextNode(),c.push({type:2,index:++a});r.append(p[f],X())}}}else if(r.nodeType===8)if(r.data===ne)c.push({type:2,index:a});else{let p=-1;for(;(p=r.data.indexOf(D,p+1))!==-1;)c.push({type:7,index:a}),p+=D.length-1}a++}}static createElement(e,t){let s=B.createElement("template");return s.innerHTML=e,s}};function U(i,e,t=i,s){if(e===N)return e;let r=s!==void 0?t._$Co?.[s]:t._$Cl,a=Q(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),a===void 0?r=void 0:(r=new a(i),r._$AT(i,t,s)),s!==void 0?(t._$Co??=[])[s]=r:t._$Cl=r),r!==void 0&&(e=U(i,r._$AS(i,e.values),r,s)),e}var At=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,r=(e?.creationScope??B).importNode(t,!0);j.currentNode=r;let a=j.nextNode(),o=0,l=0,c=s[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new tt(a,a.nextSibling,this,e):c.type===1?h=new c.ctor(a,c.name,c.strings,this,e):c.type===6&&(h=new Rt(a,this,e)),this._$AV.push(h),c=s[++l]}o!==c?.index&&(a=j.nextNode(),o++)}return j.currentNode=B,r}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},tt=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=U(this,e,t),Q(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==N&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ke(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&Q(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Z.createElement(ce(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(t);else{let a=new At(r,this),o=a.u(this.options);a.p(t),this.T(o),this._$AH=a}}_$AC(e){let t=ae.get(e.strings);return t===void 0&&ae.set(e.strings,t=new Z(e)),t}k(e){zt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,r=0;for(let a of e)r===t.length?t.push(s=new i(this.O(X()),this.O(X()),this,this.options)):s=t[r],s._$AI(a),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=Zt(e).nextSibling;Zt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,a){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(e,t=this,s,r){let a=this.strings,o=!1;if(a===void 0)e=U(this,e,t,0),o=!Q(e)||e!==this._$AH&&e!==N,o&&(this._$AH=e);else{let l=e,c,h;for(e=a[0],c=0;c<a.length-1;c++)h=U(this,l[s+c],t,c),h===N&&(h=this._$AH[c]),o||=!Q(h)||h!==this._$AH[c],h===d?e=d:e!==d&&(e+=(h??"")+a[c+1]),this._$AH[c]=h}o&&!r&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Et=class extends H{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},Ct=class extends H{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},Mt=class extends H{constructor(e,t,s,r,a){super(e,t,s,r,a),this.type=5}_$AI(e,t=this){if((e=U(this,e,t,0)??d)===N)return;let s=this._$AH,r=e===d&&s!==d||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==d&&(s===d||r);r&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Rt=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){U(this,e)}};var Je=Tt.litHtmlPolyfillSupport;Je?.(Z,tt),(Tt.litHtmlVersions??=[]).push("3.3.3");var de=(i,e,t)=>{let s=t?.renderBefore??e,r=s._$litPart$;if(r===void 0){let a=t?.renderBefore??null;s._$litPart$=r=new tt(e.insertBefore(X(),a),a,void 0,t??{})}return r._$AI(i),r};var Ft=globalThis,S=class extends T{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=de(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return N}};S._$litElement$=!0,S.finalized=!0,Ft.litElementHydrateSupport?.({LitElement:S});var Xe=Ft.litElementPolyfillSupport;Xe?.({LitElement:S});(Ft.litElementVersions??=[]).push("4.2.2");var Qe={attribute:!0,type:String,converter:Y,reflect:!1,hasChanged:lt},Ze=(i=Qe,e,t)=>{let{kind:s,metadata:r}=t,a=globalThis.litPropertyMetadata.get(r);if(a===void 0&&globalThis.litPropertyMetadata.set(r,a=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),a.set(t.name,i),s==="accessor"){let{name:o}=t;return{set(l){let c=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,c,i,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){let{name:o}=t;return function(l){let c=this[o];e.call(this,l),this.requestUpdate(o,c,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function y(i){return(e,t)=>typeof t=="object"?Ze(i,e,t):((s,r,a)=>{let o=r.hasOwnProperty(a);return r.constructor.createProperty(a,s),o?Object.getOwnPropertyDescriptor(r,a):void 0})(i,e,t)}function m(i){return y({...i,state:!0,attribute:!1})}function he(i,e){return{device_id:i,set_number:e.set_number,owned:!e.owned}}function pe(i){return{device_id:i}}function F(i,e){return e?{type:i,config_entry_id:e}:{type:i}}function ge(i,e){if(!i)return"Not synced yet";let t=Math.floor((e.getTime()-new Date(i).getTime())/6e4);if(t<1)return"Updated just now";let s=new Intl.RelativeTimeFormat("en",{numeric:"always"});if(t<60)return`Updated ${s.format(-t,"minute")}`;let r=Math.floor(t/60);return r<48?`Updated ${s.format(-r,"hour")}`:`Updated ${s.format(-Math.floor(r/24),"day")}`}function Ot(i,e,t,s=!1){return i==null||!e?"":new Intl.NumberFormat(t,{style:"currency",currency:e,...s?{maximumFractionDigits:0}:{}}).format(i)}function E(i){return i instanceof Error?i.message:i&&typeof i=="object"&&"message"in i?String(i.message):String(i)}function ue(i){let e=[];for(let t of i){let s=t.state??t.mean;s!=null&&e.push({t:new Date(t.start).getTime(),v:s})}return e}function me(i,e,t=6){let s=[...i].filter(o=>o[e]>0).sort((o,l)=>l[e]-o[e]),r=s.slice(0,t).map(o=>({theme:o.theme,amount:o[e],sets:o.sets,setNumbers:o.set_numbers??[],other:!1})),a=s.slice(t);return a.length&&r.push({theme:`Other (${k(a.length,"theme","themes")})`,amount:a.reduce((o,l)=>o+l[e],0),sets:a.reduce((o,l)=>o+l.sets,0),setNumbers:a.flatMap(o=>o.set_numbers??[]).sort(),other:!0}),r}function k(i,e,t){return`${i.toLocaleString()} ${i===1?e:t}`}var ts=60;function fe(i,e,t="retirement"){if(t==="release"&&i.available_from)return new Date(i.available_from)>e?"due":"";if(i.available_until){let s=new Date(i.available_until).getTime();return s<e.getTime()?"retired":(s-e.getTime())/864e5<=ts?"retiring":""}return i.available_from&&new Date(i.available_from)>e?"due":""}function ve(i,e,t,s="retirement"){return s==="release"&&i.available_from?`${new Date(i.available_from)>e?"Due":"Out"} ${t(i.available_from)}`:i.available_until?`${new Date(i.available_until)<e?"Retired":"Retires"} ${t(i.available_until)}`:i.available_from?`${new Date(i.available_from)>e?"Due":"Out"} ${t(i.available_from)}`:et(i)?"Date unknown":"Details tbd"}function et(i){let e=(i.name??"").trim();return e!==""&&e!=="{?}"}function ht(i){return et(i)?i.name:"Name tbd"}var pt={year:"This year",past3:"Past 3 months",past1:"Past month",next1:"Next month",next3:"Next 3 months",coming:"All coming"},st={releases:["year","past3","past1","next3","coming"],themes:["year","past3","past1","next3","coming"],recent:["past1","past3","year"],upcoming:["next1","next3","coming"]},es={recent:"all",upcoming:"all",themes:"mine"};function I(i,e){let t=e.release_filters?.[i]??{},s=e.release_status.all!==null,a=es[i]??t.scope??(s?"all":"mine");a==="all"&&!s&&(a="mine");let o=new Set(e.followed.map(u=>u.toLowerCase())),l=a==="mine"?(t.themes??[]).filter(u=>o.has(u.toLowerCase())):[],c=st[i],h=t.span&&c.includes(t.span)?t.span:i==="upcoming"?"next1":i==="recent"?"past1":"past3";return{scope:a,themes:l,span:h}}function gt(i,e,t){let s=i.includes(e)?i.filter(r=>r!==e):[...i,e];return s.length===t.length?[]:s}var q=15;function W(i,e){let t=typeof e=="string"?new Date(`${e.slice(0,10)}T00:00:00`):e,s=(t.getFullYear()-i.getFullYear())*12+t.getMonth()-i.getMonth(),r=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();return s+(t.getDate()-1)/r}function ye(i,e,t=.15,s=4){let r=[];for(let a of[...i].sort((o,l)=>o.date.localeCompare(l.date))){let o=W(e,a.date);if(o<0||o>q)continue;let l=r[r.length-1];l&&o-l.at<=t?l.themes.push(a.theme):r.push({at:o,themes:[a.theme]})}return r.map(a=>({at:a.at,themes:a.themes.slice(0,s),extra:Math.max(a.themes.length-s,0)}))}function xe(i,e=5){return Array.from({length:i},(t,s)=>(s-(i-1)/2)*e)}var ss=["recent","upcoming","themes"];function Pt(i,e){let t=e==="combined"?ss:["releases"];return i.filter(s=>!t.includes(s))}function be(i,e,t,s){let r=e[e.indexOf(t)+s];if(!r)return i;let a=i.filter(o=>o!==t);return a.splice(a.indexOf(r)+(s>0?1:0),0,t),a}var ut=new Map,mt="lego-invalidated";function we(i,e){let t=ut.get(e);return t||(t=i.callWS(F("lego/dashboard",e)),ut.set(e,t),t.catch(()=>ut.delete(e))),t}function ft(){ut.clear(),window.dispatchEvent(new Event(mt))}function $e(i,e,t){return i.callWS({...F("lego/releases",e),scope:t.scope,themes:t.themes,span:t.span})}var ke={tag:"svg",attrs:{viewBox:"0.50 1.19 99.00 99.00"},children:[{tag:"polygon",attrs:{points:"4.000,34.558 50.000,61.116 50.000,93.389 4.000,66.831",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 88%, black)"}},{tag:"polygon",attrs:{points:"50.000,61.116 96.000,34.558 96.000,66.831 50.000,93.389",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 59%, black)"}},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 50.000,61.116 4.000,34.558",style:"fill:var(--primary-color, #009ac7)"}},{tag:"g",attrs:{"stroke-width":"0.5",fill:"none","stroke-linecap":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M4.000,34.558 L50.000,61.116 L96.000,34.558"}},{tag:"path",attrs:{d:"M50.000,61.116 L50.000,93.389"}}]},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 96.000,66.831 50.000,93.389 4.000,66.831 4.000,34.558",fill:"none","stroke-width":"2.0","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"}},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,16.236 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"16.236",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M18.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"27.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M64.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"73.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,42.794 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"42.794",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{transform:"translate(11.596,34.314) scale(0.12837)"},children:[{tag:"g",attrs:{stroke:"#FFFFFF","stroke-width":"17.0","stroke-linecap":"round",fill:"none"},children:[{tag:"line",attrs:{x1:"120.00",y1:"153.05",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"60.00",y1:"214.40",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"180.00",y1:"249.69",x2:"120.00",y2:"275.05"}}]},{tag:"g",attrs:{fill:"#FFFFFF"},children:[{tag:"circle",attrs:{cx:"120.00",cy:"153.05",r:"19.38"}},{tag:"circle",attrs:{cx:"60.00",cy:"214.40",r:"19.38"}},{tag:"circle",attrs:{cx:"180.00",cy:"249.69",r:"19.38"}}]}]}]},_e=[{part:"3005",size:"1x1",colour:"Red",width:38.44,svg:{tag:"svg",attrs:{viewBox:"0 0 38.44 55.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 19.220,29.723 19.220,54.027 1.900,44.027",fill:"#B01708"}},{tag:"polygon",attrs:{points:"19.220,29.723 36.540,19.723 36.540,44.027 19.220,54.027",fill:"#770F05"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 19.220,29.723 1.900,19.723",fill:"#C91A09"}},{tag:"path",attrs:{d:"M1.90,19.72 L19.22,29.72 L36.54,19.72 M19.22,29.72 L19.22,54.03",stroke:"#550B04","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 36.540,44.027 19.220,54.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#550B04","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#550B04","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#A11507",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F01F0B",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3004",size:"1x2",colour:"Orange",width:55.76,svg:{tag:"svg",attrs:{viewBox:"0 0 55.76 65.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 36.540,39.723 36.540,64.027 1.900,44.027",fill:"#F27901"}},{tag:"polygon",attrs:{points:"36.540,39.723 53.860,29.723 53.860,54.027 36.540,64.027",fill:"#A45201"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 36.540,39.723 1.900,19.723",fill:"#FE8A18"}},{tag:"path",attrs:{d:"M1.90,19.72 L36.54,39.72 L53.86,29.72 M36.54,39.72 L36.54,64.03",stroke:"#763B01","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 53.860,54.027 36.540,64.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#763B01","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3010",size:"1x4",colour:"Yellow",width:90.4,svg:{tag:"svg",attrs:{viewBox:"0 0 90.40 85.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 71.180,59.723 71.180,84.027 1.900,44.027",fill:"#F0C414"}},{tag:"polygon",attrs:{points:"71.180,59.723 88.500,49.723 88.500,74.027 71.180,84.027",fill:"#A6870B"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 71.180,59.723 1.900,19.723",fill:"#F2CD37"}},{tag:"path",attrs:{d:"M1.90,19.72 L71.18,59.72 L88.50,49.72 M71.18,59.72 L71.18,84.03",stroke:"#766108","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 88.500,74.027 71.180,84.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#766108","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3001",size:"2x4",colour:"Green",width:107.72,svg:{tag:"svg",attrs:{viewBox:"0 0 107.72 95.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 71.180,69.723 71.180,94.027 1.900,54.027",fill:"#1F6939"}},{tag:"polygon",attrs:{points:"71.180,69.723 105.820,49.723 105.820,74.027 71.180,94.027",fill:"#154727"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 71.180,69.723 1.900,29.723",fill:"#237841"}},{tag:"path",attrs:{d:"M1.90,29.72 L71.18,69.72 L105.82,49.72 M71.18,69.72 L71.18,94.03",stroke:"#0F331C","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 105.820,74.027 71.180,94.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#0F331C","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3009",size:"1x6",colour:"Dark Azure",width:125.04,svg:{tag:"svg",attrs:{viewBox:"0 0 125.04 105.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 105.820,79.723 105.820,104.027 1.900,44.027",fill:"#067AB0"}},{tag:"polygon",attrs:{points:"105.820,79.723 123.140,69.723 123.140,94.027 105.820,104.027",fill:"#045377"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 105.820,79.723 1.900,19.723",fill:"#078BC9"}},{tag:"path",attrs:{d:"M1.90,19.72 L105.82,79.72 L123.14,69.72 M105.82,79.72 L105.82,104.03",stroke:"#033B55","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 123.140,94.027 105.820,104.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#033B55","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"2456",size:"2x6",colour:"Blue",width:142.36,svg:{tag:"svg",attrs:{viewBox:"0 0 142.36 115.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 105.820,89.723 105.820,114.027 1.900,54.027",fill:"#004AA7"}},{tag:"polygon",attrs:{points:"105.820,89.723 140.460,69.723 140.460,94.027 105.820,114.027",fill:"#003271"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 105.820,89.723 1.900,29.723",fill:"#0055BF"}},{tag:"path",attrs:{d:"M1.90,29.72 L105.82,89.72 L140.46,69.72 M105.82,89.72 L105.82,114.03",stroke:"#002451","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 140.460,94.027 105.820,114.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#002451","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3008",size:"1x8",colour:"Dark Purple",width:159.68,svg:{tag:"svg",attrs:{viewBox:"0 0 159.68 125.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 140.460,99.723 140.460,124.027 1.900,44.027",fill:"#372F7F"}},{tag:"polygon",attrs:{points:"140.460,99.723 157.780,89.723 157.780,114.027 140.460,124.027",fill:"#252056"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 140.460,99.723 1.900,19.723",fill:"#3F3691"}},{tag:"path",attrs:{d:"M1.90,19.72 L140.46,99.72 L157.78,89.72 M140.46,99.72 L140.46,124.03",stroke:"#1B173E","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 157.780,114.027 140.460,124.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#1B173E","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M116.43,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"123.14",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M133.75,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"140.46",cy:"85.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3007",size:"2x8",colour:"Medium Lavender",width:177,svg:{tag:"svg",attrs:{viewBox:"0 0 177.00 135.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 140.460,109.723 140.460,134.027 1.900,54.027",fill:"#9D5FAD"}},{tag:"polygon",attrs:{points:"140.460,109.723 175.100,89.723 175.100,114.027 140.460,134.027",fill:"#6C3D78"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 140.460,109.723 1.900,29.723",fill:"#AC78BA"}},{tag:"path",attrs:{d:"M1.90,29.72 L140.46,109.72 L175.10,89.72 M140.46,109.72 L140.46,134.03",stroke:"#4D2C56","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 175.100,114.027 140.460,134.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#4D2C56","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M151.07,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"157.78",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,95.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"95.93",rx:"6.71",ry:"3.87"}}]}]}}];var vt=x`
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
`,Se=1,rs=2,Ae=3,jt=4,is=5,Bt=6,Ee=7,Ce=8,as={"star wars":Se,botanicals:Bt,"botanical collection":Bt,icons:jt,"creator expert":jt,technic:Ee,"harry potter":Ce,city:Ae},os=[rs,is,Se,Ae,jt,Bt,Ee,Ce];function rt(i){let e=new Map,t=new Set;for(let s of i){let r=as[s.toLowerCase()];r&&!t.has(r)&&(e.set(s,r),t.add(r))}for(let s of i){if(e.has(s))continue;let r=os.find(a=>!t.has(a));r===void 0?e.set(s,"other"):(e.set(s,r),t.add(r))}return e}function it(i){return i===void 0||i==="other"?"var(--lego-series-other)":`var(--lego-series-${i})`}function yt(i){return n`<svg
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
        style=${e("style")}></line>`;default:return d}}var G=x`
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
`,xt=x`
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
`,bt=x`
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
`,Re=x`
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
`;var ns="/lego_panel/icon.png";function A(i,e){customElements.get(i)||customElements.define(i,e)}var Nt="lego-changed",ls="lego-toggle",cs="lego-move",wt={collection:{title:"My collection",icon:"mdi:toy-brick-outline"},releases:{title:"New releases",icon:"mdi:new-box"},recent:{title:"Out recently",icon:"mdi:new-box"},upcoming:{title:"Coming soon",icon:"mdi:calendar-clock"},themes:{title:"New in my themes",icon:"mdi:tag-heart-outline"},wishlist:{title:"My wishlist",icon:"mdi:heart-outline"},value:{title:"Collection value",icon:"mdi:chart-donut"},pieces:{title:"Pieces",icon:"mdi:shape-outline"}},v=class extends S{constructor(){super(...arguments);this.entryId="";this.collapsed=!1;this.handle=!1;this.bare=!1;this.dark=!1;this.pending=new Set;this.writeError="";this.toggle=()=>{this.collapsed=!this.collapsed,this.dispatchEvent(new CustomEvent(ls,{detail:{row:this.row,collapsed:this.collapsed},bubbles:!0,composed:!0}))};this.onHandleKey=t=>{let s=t.key==="ArrowUp"?-1:t.key==="ArrowDown"?1:0;s&&(t.preventDefault(),this.dispatchEvent(new CustomEvent(cs,{detail:{row:this.row,step:s},bubbles:!0,composed:!0})))}}actions(){return d}willUpdate(t){t.has("hass")&&(this.dark=!!this.hass?.themes?.darkMode)}render(){let t=wt[this.row];return n`
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
    `}focusHandle(){this.renderRoot.querySelector(".drag")?.focus()}date(t){let s=new Date(t);return Number.isNaN(s.getTime())?t:s.toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short",year:"numeric"})}num(t){return t.toLocaleString(this.hass?.locale?.language)}money(t,s=!0){return Ot(t,this.dash?.currency??null,this.hass?.locale?.language,s)||this.num(Math.round(t))}async toggleOwned(t){if(!this.pending.has(t.set_number)){this.writeError="",this.setPending(t.set_number,!0);try{await this.hass.callService("lego","set_collection",he(this.dash?.device_id??"",t))}catch(s){this.writeError=E(s);return}finally{this.setPending(t.set_number,!1)}this.dispatchEvent(new CustomEvent(Nt,{bubbles:!0,composed:!0}))}}setPending(t,s){let r=new Set(this.pending);s?r.add(t):r.delete(t),this.pending=r}linked(t,s,r=!1){return t.url?n`<a
      class="open"
      href=${t.url}
      target="_blank"
      rel="noopener noreferrer"
      tabindex=${r?"-1":d}
      aria-hidden=${r?"true":d}
      >${s}</a
    >`:s}card(t,s="retirement",r){let a=new Date,o=Ot(t.retail_price,this.dash?.currency??null,this.hass?.locale?.language);return n`
      <article class="card">
        ${this.linked(t,t.image?n`<img src=${t.image} alt="" loading="lazy" />`:n`<img
                class="noart"
                src=${ns}
                alt=""
                loading="lazy"
              />`,!0)}
        <div class="meta">
          ${this.linked(t,n`<span
              class=${et(t)?"name":"name unnamed"}
              title=${et(t)?t.name:"Brickset has not published a name yet"}
              >${ht(t)}</span
            >`)}
          <span class="num"
            >${r?n`<span
                    class="key"
                    style="background:${r}"
                    title=${t.theme}
                  ></span>`:d}${[t.set_number,o].filter(Boolean).join(" \xB7 ")}</span
          >
          <span class="when ${fe(t,a,s)}"
            >${ve(t,a,l=>this.date(l),s)}</span
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
              aria-label=${t.owned?`Remove ${ht(t)} from your collection`:`Add ${ht(t)} to your collection`}
              @click=${()=>{this.toggleOwned(t)}}
            >
              <ha-icon icon=${t.owned?"mdi:check":"mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `}filler(t,s=!1,r=.9){return n`<div class=${s?"filler stacked":"filler"}>
      <div class="bricks" aria-hidden="true">
        ${_e.map(a=>n`<div style="width:${Math.round(a.width*.6*r)}px">
              ${yt(a.svg)}
            </div>`)}
      </div>
      <span class="hint">${t}</span>
    </div>`}};v.styles=[G,vt,xt,bt,Re],g([y({attribute:!1})],v.prototype,"hass",2),g([y({attribute:!1})],v.prototype,"dash",2),g([y({attribute:!1})],v.prototype,"entryId",2),g([y({type:Boolean,reflect:!0})],v.prototype,"collapsed",2),g([y({type:Boolean})],v.prototype,"handle",2),g([y({type:Boolean,reflect:!0})],v.prototype,"bare",2),g([y({type:Boolean,reflect:!0})],v.prototype,"dark",2),g([m()],v.prototype,"pending",2),g([m()],v.prototype,"writeError",2);var C=class extends v{constructor(){super(...arguments);this.row="collection";this.refreshing=!1;this.refreshError="";this.setsOpen=!1;this.ownedError="";this.query="";this.results=[]}willUpdate(t){super.willUpdate(t),t.has("dash")&&this.dash!==this.ownedFor&&(this.owned=void 0)}updated(){this.setsOpen&&!this.collapsed&&this.owned===void 0&&this.loadOwned()}async loadOwned(){let t=this.dash;if(!(!t||this.ownedFor===t)){this.ownedFor=t;try{let s=await this.hass.callWS({...F("lego/collection",t.entry_id),filter:"owned"});this.ownedFor===t&&(this.owned=s.sets,this.ownedError="")}catch(s){this.ownedFor===t&&(this.ownedError=E(s))}}}async search(t){if(this.query=t,t.trim().length<2){this.results=[];return}try{let s=await this.hass.callWS({...F("lego/search",this.dash?.entry_id??""),query:t,limit:24});this.query===t&&(this.results=s.sets)}catch{this.results=[]}}async refresh(){this.refreshing=!0,this.refreshError="";try{await this.hass.callService("lego","refresh_collection",pe(this.dash?.device_id??"")),this.dispatchEvent(new CustomEvent(Nt,{bubbles:!0,composed:!0}))}catch(t){this.refreshError=E(t)}finally{this.refreshing=!1}}subtitle(){return ge(this.dash?.last_synced??null,new Date)}short(){let t=this.dash?.quota;return!!t&&t.remaining<t.refresh_cost}actions(){let t=this.dash?.quota;if(!t)return d;let s=k(t.refresh_cost,"call","calls");return n`<button
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
    `}};C.styles=[v.styles,x`
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
    `],g([m()],C.prototype,"refreshing",2),g([m()],C.prototype,"refreshError",2),g([m()],C.prototype,"setsOpen",2),g([m()],C.prototype,"owned",2),g([m()],C.prototype,"ownedError",2),g([m()],C.prototype,"query",2),g([m()],C.prototype,"results",2);A("lego-collection-row",C);var Te=["releases","themes"],O=class extends v{constructor(){super(...arguments);this.kind="releases";this.error="";this.filterFor="";this.requested=""}get row(){return this.kind}willUpdate(t){super.willUpdate(t);let s=`${this.dash?.entry_id}:${this.kind}`;this.dash&&s!==this.filterFor&&(this.filterFor=s,this.filter=I(this.kind,this.dash),this.data=void 0)}updated(){!this.collapsed&&this.filter&&this.dash&&this.hass&&this.fetch()}async fetch(){let t=this.filter,s=this.dash;if(!t||!s||s.release_status[t.scope]===null)return;let r=JSON.stringify([s.entry_id,t]);if(!(r===this.requested&&this.requestedWith===s)){this.requested=r,this.requestedWith=s;try{let a=await $e(this.hass,s.entry_id,t);this.requested===r&&(this.data=a,this.error="")}catch(a){this.requested===r&&(this.error=E(a))}}}pick(t){this.filter&&(this.filter={...this.filter,...t})}status(){return this.filter?this.dash?.release_status[this.filter.scope]:void 0}subtitle(){let t=this.status();return t==null?"":t==="fetching"?"Fetching releases\u2026":t==="failed"?"Couldn't fetch releases":this.data?k(this.data.sets.length,"set","sets"):"Loading\u2026"}actions(){return!this.filter||this.status()===null?d:n`<div class="pills" role="group" aria-label="Time span">
      ${st[this.kind].map(t=>n`<button
            class=${t===this.filter?.span?"pill on":"pill"}
            aria-pressed=${t===this.filter?.span}
            @click=${()=>this.pick({span:t})}
          >
            ${pt[t]}
          </button>`)}
    </div>`}body(){let t=this.filter,s=this.dash;if(!t||!s)return n`<p class="muted">Loading…</p>`;let r=this.status();return r===null?n`<p class="muted">${this.unavailable()}</p>`:r==="fetching"?n`<p class="muted">Fetching this year's releases…</p>`:r==="failed"?n`<p class="muted">
        Couldn't fetch this year's releases. They're tried again every few hours
        until they arrive.
      </p>`:n`
      ${Te.includes(this.kind)?this.chips(t):d}
      ${Te.includes(this.kind)&&this.data?this.timeline(this.data):d}
      ${this.error?n`<p class="caveat bad">${this.error}</p>`:d}
      ${this.cards()}
    `}unavailable(){return this.kind==="recent"||this.kind==="upcoming"?"Turn on Follow releases across all themes in the integration's options for this row.":this.kind==="themes"?"No themes followed yet. Add one in the integration's options to see new sets here.":"Follow themes, or turn on Follow releases across all themes, in the integration's options to see new sets here."}chips(t){let s=this.dash,r=rt(s.followed),a=(o,l)=>{let c=t.scope===o&&(o==="all"||!t.themes.length);return n`<button
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
          @click=${()=>this.pick({scope:"mine",themes:gt(t.scope==="mine"?t.themes:[],o,s.followed)})}
        >
          <span
            class="key"
            style="background:${it(r.get(o))}"
          ></span>
          ${o}
        </button>`})}
    </div>`}colourOf(t){let s=this.dash,r=rt(s.followed),a=s.followed.find(o=>o.toLowerCase()===t.toLowerCase());return it(a?r.get(a):"other")}timeline(t){let s=new Date,r=new Date(s.getFullYear(),0,1),a=p=>`${p/q*100}%`,o=Math.max(W(r,t.span.from),0),l=t.span.to?Math.min(W(r,t.span.to),q):q,c=ye(t.timeline,r),h=this.hass?.locale?.language,u=t.timeline.filter(p=>{let f=W(r,p.date);return f>=o&&f<=l}).length;return n`<div
      class="timeline"
      role="img"
      aria-label=${`${k(t.timeline.length,"set","sets")} from January to next March, ${u} in the chosen span`}
    >
      <div class="line"></div>
      <div
        class="window"
        style="left:${a(o)};width:${a(Math.max(l-o,0))}"
      ></div>
      ${c.map(p=>{let f=p.at>=o-.01&&p.at<=l+.01,b=xe(p.themes.length);return n`${p.themes.map((_,L)=>n`<span
              class=${f?"disc":"disc out"}
              style="left:${a(p.at)};top:${21+b[L]}px;background:${this.colourOf(_)};z-index:${10-L}"
            ></span>`)}${p.extra?n`<span class="extra" style="left:calc(${a(p.at)} + 9px)"
                >+${p.extra}</span
              >`:d}`})}
      <ha-icon
        class="today"
        icon="mdi:chevron-down"
        style="left:${a(W(r,s))}"
      ></ha-icon>
      ${Array.from({length:q},(p,f)=>{let b=new Date(r.getFullYear(),f,1).toLocaleDateString(h,{month:"short"});return n`<span
          class=${f%3===0?"month quarter":"month"}
          style="left:${a(f)};width:${a(1)}"
          aria-hidden="true"
          >${b}</span
        >`})}
    </div>`}cards(){let t=this.data?.sets;if(!t)return n`<p class="muted">Loading…</p>`;if(!t.length){let s=this.filter&&["next1","next3","coming"].includes(this.filter.span);return this.filler(s?"Nothing due in this span yet.":"Nothing new in this span. Try a longer one.")}return n`<div class="carousel">
      ${t.map(s=>this.card(s,"release",this.colourOf(s.theme)))}
    </div>`}};O.styles=[v.styles,x`
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
      .timeline .disc {
        border-radius: 50%;
        box-shadow: 0 0 0 2px var(--lego-surface);
        height: 10px;
        position: absolute;
        transform: translate(-50%, -50%);
        width: 10px;
      }
      .timeline .disc.out {
        opacity: 0.35;
      }
      .timeline .extra {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-pill, 9999px);
        font-size: 10px;
        font-weight: var(--ha-font-weight-bold, 700);
        line-height: 14px;
        padding: 0 4px;
        position: absolute;
        top: 14px;
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
    `],g([y()],O.prototype,"kind",2),g([m()],O.prototype,"filter",2),g([m()],O.prototype,"data",2),g([m()],O.prototype,"error",2);A("lego-releases-row",O);var ds=365,hs=12,ze=70,Lt=2*Math.PI*ze,ps=1.5,z=class extends v{constructor(){super(...arguments);this.kind="value";this.hover="";this.trendOpen=!1;this.hoverPoint=null;this.historyFor=""}get row(){return this.kind}willUpdate(t){super.willUpdate(t);let s=`${this.dash?.entry_id}:${this.kind}`;this.dash&&s!==this.historyFor&&(this.historyFor=s,this.history=void 0)}updated(){this.trendOpen&&!this.collapsed&&this.history===void 0&&this.loadHistory()}format(t){return this.kind==="value"?this.money(t):this.num(Math.round(t))}subtitle(){let t=this.dash?.stats;return t?this.kind==="value"?`${this.money(t.value)} at LEGO.com RRP`:k(t.pieces_owned,"piece","pieces"):""}body(){let t=this.dash?.stats;if(!t)return n`<p class="muted">Loading…</p>`;let s=me(this.dash?.by_theme??[],this.kind),r=this.kind==="value"?t.value:t.pieces_owned;if(!s.length)return n`<p class="muted">
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
    `}donut(t,s,r){let a=t.reduce((h,u)=>h+u.amount,0)||1,o=0,l=t.map(h=>{let u=Math.max(h.amount/a*Lt-ps,.5),p=R`<circle
        cx="100"
        cy="100"
        r=${ze}
        fill="none"
        stroke=${r(h)}
        stroke-width=${this.hover===h.theme?34:28}
        stroke-dasharray=${`${u} ${Lt-u}`}
        stroke-dashoffset=${-o}
        class=${this.hover&&this.hover!==h.theme?"faded":""}
        @mouseenter=${()=>this.hover=h.theme}
        @mouseleave=${()=>this.hover=""}
      ></circle>`;return o+=h.amount/a*Lt,p}),c=t.find(h=>h.theme===this.hover);return n`<div class="donut">
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
      ${t.map((o,l)=>{let c=this.hover===o.theme,h=this.hover&&!c,u=o.setNumbers.slice(0,hs),p=o.setNumbers.length-u.length;return n`<li>
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
                    ${u.length?n`<span class="numbers"
                            >${u.join(", ")}${p?`, and ${p} more`:""}</span
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
    </div>`}async loadHistory(){let t=this.dash?.history?.[this.kind],s=this.historyFor;if(!t){this.history="none";return}this.history="loading";try{let r=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(Date.now()-ds*864e5).toISOString(),statistic_ids:[t],period:"week",types:this.kind==="value"?["state"]:["mean"]});if(s!==this.historyFor)return;let a=ue(r[t]??[]);this.history=a.length>=2?a:"none"}catch{s===this.historyFor&&(this.history="none")}}trendChart(){let t=this.history;if(t===void 0||t==="loading")return n`<p class="muted">Loading the trend…</p>`;if(t==="none")return n`<p class="muted">
        No history yet. Home Assistant records it weekly from the sensor, so a
        line appears after a couple of weeks.
      </p>`;let s=t,r=Math.min(...s.map($=>$.v)),o=Math.max(...s.map($=>$.v))-r||1,l=s[0].t,c=s[s.length-1].t-l||1,h=$=>($.t-l)/c*100,u=$=>90-($.v-r)/o*80,p=s.map($=>`${h($)},${u($)}`).join(" "),f=s[s.length-1],b=this.hoverPoint===null?void 0:s[this.hoverPoint],_=b??f,L=$=>new Date($).toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short"});return n`
      <div
        class="plot"
        @pointermove=${$=>{let Gt=$.currentTarget.getBoundingClientRect(),Vt=l+($.clientX-Gt.left)/Gt.width*c,$t=0;s.forEach((Oe,Pe)=>{Math.abs(Oe.t-Vt)<Math.abs(s[$t].t-Vt)&&($t=Pe)}),this.hoverPoint=$t}}
        @pointerleave=${()=>this.hoverPoint=null}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line class="base" x1="0" y1="100" x2="100" y2="100"></line>
          <polygon class="wash" points=${`0,100 ${p} 100,100`}></polygon>
          <polyline class="trace" points=${p}></polyline>
          ${b?R`<line class="cross" x1=${h(b)} y1="0" x2=${h(b)} y2="100"></line>`:d}
        </svg>
        <span class="dot" style="left:${h(_)}%;top:${u(_)}%"></span>
        <span
          class="readout"
          style="left:${Math.min(Math.max(h(_),12),88)}%"
          >${this.format(_.v)} · ${L(_.t)}</span
        >
      </div>
      <div class="axis">
        <span>${L(s[0].t)}</span><span>${L(f.t)}</span>
      </div>
    `}};z.styles=[v.styles,x`
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
    `],g([y()],z.prototype,"kind",2),g([m()],z.prototype,"hover",2),g([m()],z.prototype,"trendOpen",2),g([m()],z.prototype,"history",2),g([m()],z.prototype,"hoverPoint",2);A("lego-value-row",z);var De="Mark sets as wanted on Brickset and they land here.",Ut=class extends v{constructor(){super(...arguments);this.row="wishlist"}subtitle(){return k(this.dash?.wishlist.length??0,"set","sets")}body(){let t=this.dash?.wishlist??[];return t.length?n`<div class="carousel">
      ${t.map(s=>this.card(s))} ${this.filler(De,!0)}
    </div>`:this.filler(`Nothing on your wishlist yet. ${De}`)}};A("lego-wishlist-row",Ut);var M=class extends S{constructor(){super(...arguments);this.error="";this.loadedFor=null;this.reload=()=>{this.loadedFor=null,this.requestUpdate()}}setConfig(t){if(!t)throw new Error("Invalid configuration");this.config=t,this.loadedFor=null}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),window.addEventListener(mt,this.reload)}disconnectedCallback(){window.removeEventListener(mt,this.reload),super.disconnectedCallback()}updated(){let t=this.config?.account??"";this.hass&&this.config&&this.loadedFor!==t&&(this.loadedFor=t,we(this.hass,t).then(s=>{this.dash=s,this.error=""}).catch(s=>this.error=E(s)))}render(){return n`<ha-card
      @lego-changed=${()=>ft()}
      @lego-toggle=${t=>t.stopPropagation()}
    >
      ${this.error?n`<div class="error">${this.error}</div>`:this.dash&&this.hass?this.row(this.dash):d}
    </ha-card>`}};M.styles=[G,x`
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
    `],g([y({attribute:!1})],M.prototype,"hass",2),g([m()],M.prototype,"config",2),g([m()],M.prototype,"dash",2),g([m()],M.prototype,"error",2);var Ht=class extends M{row(e){return n`<lego-collection-row
      bare
      .hass=${this.hass}
      .dash=${e}
      .entryId=${e.entry_id}
    ></lego-collection-row>`}},It=class extends M{row(e){return n`<lego-wishlist-row
      bare
      .hass=${this.hass}
      .dash=${e}
      .entryId=${e.entry_id}
    ></lego-wishlist-row>`}},qt=class extends M{row(e){return n`<lego-value-row
      bare
      .kind=${this.config?.measure==="pieces"?"pieces":"value"}
      .hass=${this.hass}
      .dash=${e}
      .entryId=${e.entry_id}
    ></lego-value-row>`}},Wt=class extends M{row(e){let t=this.config?.row??"releases",s={};this.config?.scope&&(s.scope=this.config.scope),this.config?.themes&&(s.themes=this.config.themes),this.config?.span&&(s.span=this.config.span);let r={...e,release_filters:{...e.release_filters,[t]:{...I(t,e),...s}}};return n`<lego-releases-row
      bare
      .kind=${t}
      .hass=${this.hass}
      .dash=${r}
      .entryId=${e.entry_id}
    ></lego-releases-row>`}},gs=[["lego-collection-card",Ht,"LEGO collection","Your Brickset collection's totals, with every set and a search."],["lego-releases-card",Wt,"LEGO releases","New and upcoming sets, across every theme or the ones you follow."],["lego-wishlist-card",It,"LEGO wishlist","The sets you want, soonest to retire first."],["lego-value-card",qt,"LEGO collection value","What your collection is worth at LEGO.com RRP, by theme."]];for(let[i,e,t,s]of gs)A(i,e),window.customCards=window.customCards??[],window.customCards.some(r=>r.type===i)||window.customCards.push({type:i,name:t,description:s});var Fe=["releases","recent","upcoming","themes"],w=class extends S{constructor(){super(...arguments);this.narrow=!1;this.dark=!1;this.error="";this.accounts=[];this.account="";this.switching="";this.customising=!1;this.folded={};this.dragging="";this.over="";this.foldedFor="";this.onToggle=t=>{let{row:s,collapsed:r}=t.detail;this.folded={...this.folded,[s]:r}};this.onMove=t=>{let{row:s,step:r}=t.detail;this.move(s,r,this.visible())};this.onChanged=()=>{ft(),this.load()}}connectedCallback(){super.connectedCallback(),this.load()}willUpdate(){this.dark=!!this.hass?.themes?.darkMode}async load(){try{if(!this.accounts.length){let s=await this.hass.callWS({type:"lego/accounts"});this.accounts=s.accounts,this.account=s.selected??""}let t=await this.hass.callWS(F("lego/dashboard",this.account));t.entry_id!==this.foldedFor&&(this.foldedFor=t.entry_id,this.folded=Object.fromEntries(t.collapsed.map(s=>[s,!0]))),this.dash=t,this.error=""}catch(t){this.error=E(t)}}async selectAccount(t){if(t!==this.account){this.account=t,this.switching=this.accounts.find(s=>s.entry_id===t)?.name??"account";try{await this.load()}finally{this.switching=""}try{await this.hass.callWS({type:"lego/account/set",config_entry_id:t})}catch{}}}async save(t){if(this.dash){this.dash={...this.dash,...t};try{let s=await this.hass.callWS({type:"lego/panel_config/set",...t});this.dash&&(this.dash={...this.dash,...s})}catch{}}}visible(){let t=this.dash;return t?Pt(t.rows,t.release_mode).filter(s=>!t.hidden.includes(s)):[]}move(t,s,r){if(!this.dash)return;let a=be(this.dash.rows,r,t,s);a!==this.dash.rows&&(this.save({rows:a}),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-row="${t}"] > *`)?.focusHandle?.()))}onDrop(t,s){let r=this.dragging;if(this.dragging="",this.over="",!this.dash||!r||r===t)return;let a=this.dash.rows.filter(c=>c!==r),o=a.indexOf(t),l=s.indexOf(r)<s.indexOf(t);a.splice(o+(l?1:0),0,r),this.save({rows:a})}render(){return n`
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
        <span class="logo">${yt(ke)}</span>
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
      ${this.accounts.length>1?n`<select
              class="account"
              aria-label="Brickset account"
              @change=${a=>{this.selectAccount(a.target.value)}}
            >
              ${this.accounts.map(a=>n`<option
                    value=${a.entry_id}
                    ?selected=${a.entry_id===this.account}
                  >
                    ${a.name}
                  </option>`)}
            </select>`:d}
    </header>`}renderHome(){let t=this.dash;if(!t)return n`<p class="muted pad">Loading your collection…</p>`;let s=this.visible(),r=s.some(a=>!this.folded[a]);return n`<div
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
    </div>`}renderRow(t,s){let r={hass:this.hass,dash:this.dash,entryId:this.dash?.entry_id??"",collapsed:!!this.folded[t]},a;return Fe.includes(t)?a=n`<lego-releases-row
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
    </div>`}renderCustomise(t){let s=Pt(t.rows,t.release_mode),r=t.release_status.all!==null;return n`<section class="row customise" aria-label="Customise this page">
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
    </section>`}renderCustomiseRow(t,s,r){let a=wt[s].title,o=!t.hidden.includes(s),l=t.collapsed.includes(s)?"collapsed":"open",c=h=>{let u=t.collapsed.filter(p=>p!==s);h&&u.push(s),this.folded={...this.folded,[s]:h},this.save({collapsed:u})};return n`<li>
      <div class="crow">
        <button
          class="drag"
          data-custom=${s}
          aria-label=${`Move ${a} up or down`}
          title="Use the arrow keys to reorder"
          @keydown=${h=>{let u=h.key==="ArrowUp"?-1:h.key==="ArrowDown"?1:0;u&&(h.preventDefault(),this.move(s,u,r),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-custom="${s}"]`)?.focus()))}}
        >
          <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
        </button>
        <input
          type="checkbox"
          .checked=${o}
          aria-label=${`Show ${a}`}
          @change=${h=>{let u=h.target.checked,p=t.hidden.filter(f=>f!==s);u||p.push(s),this.save({hidden:p})}}
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
      ${Fe.includes(s)?this.renderStartsOn(t,s):d}
    </li>`}renderStartsOn(t,s){let r=I(s,t),a=c=>{let h=t.release_filters[s]??{};this.save({release_filters:{...t.release_filters,[s]:{...h,...c}}})},o=(c,h,u)=>n`<button
        class=${h?"chip small on":"chip small"}
        aria-pressed=${h}
        @click=${u}
      >
        ${c}
      </button>`,l=s==="releases"||s==="themes";return n`<div class="startson">
      <span class="muted-label">Starts on</span>
      ${l&&s==="releases"&&t.release_status.all!==null?o("Everything",r.scope==="all",()=>a({scope:"all",themes:[]})):d}
      ${l&&t.followed.length?o(s==="themes"?"All my themes":"My themes",r.scope==="mine"&&!r.themes.length,()=>a({scope:"mine",themes:[]})):d}
      ${l?t.followed.map(c=>o(c,r.scope==="mine"&&r.themes.includes(c),()=>a({scope:"mine",themes:gt(r.scope==="mine"?r.themes:[],c,t.followed)}))):d}
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
    </div>`}};w.styles=[G,vt,xt,bt,x`
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
    `],g([y({attribute:!1})],w.prototype,"hass",2),g([y({type:Boolean})],w.prototype,"narrow",2),g([y({type:Boolean,reflect:!0})],w.prototype,"dark",2),g([m()],w.prototype,"dash",2),g([m()],w.prototype,"error",2),g([m()],w.prototype,"accounts",2),g([m()],w.prototype,"account",2),g([m()],w.prototype,"switching",2),g([m()],w.prototype,"customising",2),g([m()],w.prototype,"folded",2),g([m()],w.prototype,"dragging",2),g([m()],w.prototype,"over",2);A("lego-panel",w);export{w as LegoPanel};
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
