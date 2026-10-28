var Ze=Object.defineProperty;var ts=Object.getOwnPropertyDescriptor;var u=(i,s,t,e)=>{for(var r=e>1?void 0:e?ts(s,t):s,a=i.length-1,o;a>=0;a--)(o=i[a])&&(r=(e?o(s,t,r):o(r))||r);return e&&r&&Ze(s,t,r),r};var dt=globalThis,ht=dt.ShadowRoot&&(dt.ShadyCSS===void 0||dt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,At=Symbol(),re=new WeakMap,Z=class{constructor(s,t,e){if(this._$cssResult$=!0,e!==At)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=t}get styleSheet(){let s=this.o,t=this.t;if(ht&&s===void 0){let e=t!==void 0&&t.length===1;e&&(s=re.get(t)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),e&&re.set(t,s))}return s}toString(){return this.cssText}},ie=i=>new Z(typeof i=="string"?i:i+"",void 0,At),$=(i,...s)=>{let t=i.length===1?i[0]:s.reduce((e,r,a)=>e+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[a+1],i[0]);return new Z(t,i,At)},ae=(i,s)=>{if(ht)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of s){let e=document.createElement("style"),r=dt.litNonce;r!==void 0&&e.setAttribute("nonce",r),e.textContent=t.cssText,i.appendChild(e)}},Tt=ht?i=>i:i=>i instanceof CSSStyleSheet?(s=>{let t="";for(let e of s.cssRules)t+=e.cssText;return ie(t)})(i):i;var{is:es,defineProperty:ss,getOwnPropertyDescriptor:rs,getOwnPropertyNames:is,getOwnPropertySymbols:as,getPrototypeOf:os}=Object,pt=globalThis,oe=pt.trustedTypes,ns=oe?oe.emptyScript:"",ls=pt.reactiveElementPolyfillSupport,tt=(i,s)=>i,et={toAttribute(i,s){switch(s){case Boolean:i=i?ns:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,s){let t=i;switch(s){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},ut=(i,s)=>!es(i,s),ne={attribute:!0,type:String,converter:et,reflect:!1,useDefault:!1,hasChanged:ut};Symbol.metadata??=Symbol("metadata"),pt.litPropertyMetadata??=new WeakMap;var O=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,t=ne){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(s,t),!t.noAccessor){let e=Symbol(),r=this.getPropertyDescriptor(s,e,t);r!==void 0&&ss(this.prototype,s,r)}}static getPropertyDescriptor(s,t,e){let{get:r,set:a}=rs(this.prototype,s)??{get(){return this[t]},set(o){this[t]=o}};return{get:r,set(o){let l=r?.call(this);a?.call(this,o),this.requestUpdate(s,l,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??ne}static _$Ei(){if(this.hasOwnProperty(tt("elementProperties")))return;let s=os(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(tt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(tt("properties"))){let t=this.properties,e=[...is(t),...as(t)];for(let r of e)this.createProperty(r,t[r])}let s=this[Symbol.metadata];if(s!==null){let t=litPropertyMetadata.get(s);if(t!==void 0)for(let[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let r=this._$Eu(t,e);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let t=[];if(Array.isArray(s)){let e=new Set(s.flat(1/0).reverse());for(let r of e)t.unshift(Tt(r))}else s!==void 0&&t.push(Tt(s));return t}static _$Eu(s,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(s.set(e,this[e]),delete this[e]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ae(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,t,e){this._$AK(s,e)}_$ET(s,t){let e=this.constructor.elementProperties.get(s),r=this.constructor._$Eu(s,e);if(r!==void 0&&e.reflect===!0){let a=(e.converter?.toAttribute!==void 0?e.converter:et).toAttribute(t,e.type);this._$Em=s,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(s,t){let e=this.constructor,r=e._$Eh.get(s);if(r!==void 0&&this._$Em!==r){let a=e.getPropertyOptions(r),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:et;this._$Em=r;let l=o.fromAttribute(t,a.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(s,t,e,r=!1,a){if(s!==void 0){let o=this.constructor;if(r===!1&&(a=this[s]),e??=o.getPropertyOptions(s),!((e.hasChanged??ut)(a,t)||e.useDefault&&e.reflect&&a===this._$Ej?.get(s)&&!this.hasAttribute(o._$Eu(s,e))))return;this.C(s,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,t,{useDefault:e,reflect:r,wrapped:a},o){e&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,o??t??this[s]),a!==!0||o!==void 0)||(this._$AL.has(s)||(this.hasUpdated||e||(t=void 0),this._$AL.set(s,t)),r===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[r,a]of e){let{wrapped:o}=a,l=this[r];o!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,a,l)}}let s=!1,t=this._$AL;try{s=this.shouldUpdate(t),s?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw s=!1,this._$EM(),e}s&&this._$AE(t)}willUpdate(s){}_$AE(s){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(s){}firstUpdated(s){}};O.elementStyles=[],O.shadowRootOptions={mode:"open"},O[tt("elementProperties")]=new Map,O[tt("finalized")]=new Map,ls?.({ReactiveElement:O}),(pt.reactiveElementVersions??=[]).push("2.1.2");var Pt=globalThis,le=i=>i,gt=Pt.trustedTypes,ce=gt?gt.createPolicy("lit-html",{createHTML:i=>i}):void 0,me="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,fe="?"+N,cs=`<${fe}>`,I=document,rt=()=>I.createComment(""),it=i=>i===null||typeof i!="object"&&typeof i!="function",Nt=Array.isArray,ds=i=>Nt(i)||typeof i?.[Symbol.iterator]=="function",Mt=`[ 	
\f\r]`,st=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,de=/-->/g,he=/>/g,H=RegExp(`>|${Mt}(?:([^\\s"'>=/]+)(${Mt}*=${Mt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),pe=/'/g,ue=/"/g,ve=/^(?:script|style|textarea|title)$/i,Bt=i=>(s,...t)=>({_$litType$:i,strings:s,values:t}),n=Bt(1),D=Bt(2),Is=Bt(3),q=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),ge=new WeakMap,U=I.createTreeWalker(I,129);function ye(i,s){if(!Nt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ce!==void 0?ce.createHTML(s):s}var hs=(i,s)=>{let t=i.length-1,e=[],r,a=s===2?"<svg>":s===3?"<math>":"",o=st;for(let l=0;l<t;l++){let c=i[l],h,g,p=-1,f=0;for(;f<c.length&&(o.lastIndex=f,g=o.exec(c),g!==null);)f=o.lastIndex,o===st?g[1]==="!--"?o=de:g[1]!==void 0?o=he:g[2]!==void 0?(ve.test(g[2])&&(r=RegExp("</"+g[2],"g")),o=H):g[3]!==void 0&&(o=H):o===H?g[0]===">"?(o=r??st,p=-1):g[1]===void 0?p=-2:(p=o.lastIndex-g[2].length,h=g[1],o=g[3]===void 0?H:g[3]==='"'?ue:pe):o===ue||o===pe?o=H:o===de||o===he?o=st:(o=H,r=void 0);let x=o===H&&i[l+1].startsWith("/>")?" ":"";a+=o===st?c+cs:p>=0?(e.push(h),c.slice(0,p)+me+c.slice(p)+N+x):c+N+(p===-2?l:x)}return[ye(i,a+(i[t]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),e]},at=class i{constructor({strings:s,_$litType$:t},e){let r;this.parts=[];let a=0,o=0,l=s.length-1,c=this.parts,[h,g]=hs(s,t);if(this.el=i.createElement(h,e),U.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=U.nextNode())!==null&&c.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let p of r.getAttributeNames())if(p.endsWith(me)){let f=g[o++],x=r.getAttribute(p).split(N),y=/([.?@])?(.*)/.exec(f);c.push({type:1,index:a,name:y[2],strings:x,ctor:y[1]==="."?zt:y[1]==="?"?Ft:y[1]==="@"?Dt:G}),r.removeAttribute(p)}else p.startsWith(N)&&(c.push({type:6,index:a}),r.removeAttribute(p));if(ve.test(r.tagName)){let p=r.textContent.split(N),f=p.length-1;if(f>0){r.textContent=gt?gt.emptyScript:"";for(let x=0;x<f;x++)r.append(p[x],rt()),U.nextNode(),c.push({type:2,index:++a});r.append(p[f],rt())}}}else if(r.nodeType===8)if(r.data===fe)c.push({type:2,index:a});else{let p=-1;for(;(p=r.data.indexOf(N,p+1))!==-1;)c.push({type:7,index:a}),p+=N.length-1}a++}}static createElement(s,t){let e=I.createElement("template");return e.innerHTML=s,e}};function W(i,s,t=i,e){if(s===q)return s;let r=e!==void 0?t._$Co?.[e]:t._$Cl,a=it(s)?void 0:s._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),a===void 0?r=void 0:(r=new a(i),r._$AT(i,t,e)),e!==void 0?(t._$Co??=[])[e]=r:t._$Cl=r),r!==void 0&&(s=W(i,r._$AS(i,s.values),r,e)),s}var Rt=class{constructor(s,t){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:t},parts:e}=this._$AD,r=(s?.creationScope??I).importNode(t,!0);U.currentNode=r;let a=U.nextNode(),o=0,l=0,c=e[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new ot(a,a.nextSibling,this,s):c.type===1?h=new c.ctor(a,c.name,c.strings,this,s):c.type===6&&(h=new Ot(a,this,s)),this._$AV.push(h),c=e[++l]}o!==c?.index&&(a=U.nextNode(),o++)}return U.currentNode=I,r}p(s){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(s,e,t),t+=e.strings.length-2):e._$AI(s[t])),t++}},ot=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,t,e,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=s,this._$AB=t,this._$AM=e,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,t=this._$AM;return t!==void 0&&s?.nodeType===11&&(s=t.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,t=this){s=W(this,s,t),it(s)?s===d||s==null||s===""?(this._$AH!==d&&this._$AR(),this._$AH=d):s!==this._$AH&&s!==q&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):ds(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==d&&it(this._$AH)?this._$AA.nextSibling.data=s:this.T(I.createTextNode(s)),this._$AH=s}$(s){let{values:t,_$litType$:e}=s,r=typeof e=="number"?this._$AC(s):(e.el===void 0&&(e.el=at.createElement(ye(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===r)this._$AH.p(t);else{let a=new Rt(r,this),o=a.u(this.options);a.p(t),this.T(o),this._$AH=a}}_$AC(s){let t=ge.get(s.strings);return t===void 0&&ge.set(s.strings,t=new at(s)),t}k(s){Nt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,r=0;for(let a of s)r===t.length?t.push(e=new i(this.O(rt()),this.O(rt()),this,this.options)):e=t[r],e._$AI(a),r++;r<t.length&&(this._$AR(e&&e._$AB.nextSibling,r),t.length=r)}_$AR(s=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);s!==this._$AB;){let e=le(s).nextSibling;le(s).remove(),s=e}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},G=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,t,e,r,a){this.type=1,this._$AH=d,this._$AN=void 0,this.element=s,this.name=t,this._$AM=r,this.options=a,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=d}_$AI(s,t=this,e,r){let a=this.strings,o=!1;if(a===void 0)s=W(this,s,t,0),o=!it(s)||s!==this._$AH&&s!==q,o&&(this._$AH=s);else{let l=s,c,h;for(s=a[0],c=0;c<a.length-1;c++)h=W(this,l[e+c],t,c),h===q&&(h=this._$AH[c]),o||=!it(h)||h!==this._$AH[c],h===d?s=d:s!==d&&(s+=(h??"")+a[c+1]),this._$AH[c]=h}o&&!r&&this.j(s)}j(s){s===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},zt=class extends G{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===d?void 0:s}},Ft=class extends G{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==d)}},Dt=class extends G{constructor(s,t,e,r,a){super(s,t,e,r,a),this.type=5}_$AI(s,t=this){if((s=W(this,s,t,0)??d)===q)return;let e=this._$AH,r=s===d&&e!==d||s.capture!==e.capture||s.once!==e.once||s.passive!==e.passive,a=s!==d&&(e===d||r);r&&this.element.removeEventListener(this.name,this,e),a&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},Ot=class{constructor(s,t,e){this.element=s,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(s){W(this,s)}};var ps=Pt.litHtmlPolyfillSupport;ps?.(at,ot),(Pt.litHtmlVersions??=[]).push("3.3.3");var be=(i,s,t)=>{let e=t?.renderBefore??s,r=e._$litPart$;if(r===void 0){let a=t?.renderBefore??null;e._$litPart$=r=new ot(s.insertBefore(rt(),a),a,void 0,t??{})}return r._$AI(i),r};var jt=globalThis,C=class extends O{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=be(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};C._$litElement$=!0,C.finalized=!0,jt.litElementHydrateSupport?.({LitElement:C});var us=jt.litElementPolyfillSupport;us?.({LitElement:C});(jt.litElementVersions??=[]).push("4.2.2");var gs={attribute:!0,type:String,converter:et,reflect:!1,hasChanged:ut},ms=(i=gs,s,t)=>{let{kind:e,metadata:r}=t,a=globalThis.litPropertyMetadata.get(r);if(a===void 0&&globalThis.litPropertyMetadata.set(r,a=new Map),e==="setter"&&((i=Object.create(i)).wrapped=!0),a.set(t.name,i),e==="accessor"){let{name:o}=t;return{set(l){let c=s.get.call(this);s.set.call(this,l),this.requestUpdate(o,c,i,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(e==="setter"){let{name:o}=t;return function(l){let c=this[o];s.call(this,l),this.requestUpdate(o,c,i,!0,l)}}throw Error("Unsupported decorator location: "+e)};function k(i){return(s,t)=>typeof t=="object"?ms(i,s,t):((e,r,a)=>{let o=r.hasOwnProperty(a);return r.constructor.createProperty(a,e),o?Object.getOwnPropertyDescriptor(r,a):void 0})(i,s,t)}function m(i){return k({...i,state:!0,attribute:!1})}function we(i,s){let t=i.reduce((h,g)=>h+g,0)/(i.length||1),e=h=>12*(i[h]+i[h+1])/2/t,r=0,a=0;for(let[h,g]of i.entries()){let p=a+(h?e(h-1):0)+g;if(p>s)break;a=p,r=h+1}let o=Array.from({length:Math.max(r-1,0)},(h,g)=>e(g)),l=s-a,c=o.map((h,g)=>g);for(;l>.5&&c.length;){let h=c.reduce((p,f)=>p+e(f),0),g=l;l=0,c=c.filter(p=>{let f=e(p)*10,x=o[p]+g*e(p)/h;return o[p]=Math.min(x,f),l+=x-o[p],o[p]<f})}return{count:r,gaps:o.map(h=>Math.round(h*10)/10)}}var fs="{?}";function $e(i,s){return{device_id:i,set_number:s.set_number,owned:!s.owned}}function ke(i){return{device_id:i}}function z(i,s){return s?{type:i,config_entry_id:s}:{type:i}}function _e(i,s){if(!i)return"Not synced yet";let t=Math.floor((s.getTime()-new Date(i).getTime())/6e4);if(t<1)return"Updated just now";let e=new Intl.RelativeTimeFormat("en",{numeric:"always"});if(t<60)return`Updated ${e.format(-t,"minute")}`;let r=Math.floor(t/60);return r<48?`Updated ${e.format(-r,"hour")}`:`Updated ${e.format(-Math.floor(r/24),"day")}`}function Ut(i,s,t,e=!1){return i==null||!s?"":new Intl.NumberFormat(t,{style:"currency",currency:s,...e?{maximumFractionDigits:0}:{}}).format(i)}function A(i){return i instanceof Error?i.message:i&&typeof i=="object"&&"message"in i?String(i.message):String(i)}function Se(i){let s=[];for(let t of i){let e=t.state??t.mean;e!=null&&s.push({t:new Date(t.start).getTime(),v:e})}return s}function Ee(i,s,t=6){let e=[...i].filter(o=>o[s]>0).sort((o,l)=>l[s]-o[s]),r=e.slice(0,t).map(o=>({theme:o.theme,amount:o[s],sets:o.sets,setNumbers:o.set_numbers??[],other:!1})),a=e.slice(t);return a.length&&r.push({theme:`Other (${E(a.length,"theme","themes")})`,amount:a.reduce((o,l)=>o+l[s],0),sets:a.reduce((o,l)=>o+l.sets,0),setNumbers:a.flatMap(o=>o.set_numbers??[]).sort(),other:!0}),r}function E(i,s,t){return`${i.toLocaleString()} ${i===1?s:t}`}var Lt=100;function Ce(i,s,t){let e=Lt-s;return[`${i} of today's ${s} calls used.`,e>0?`The other ${e} of the ${Lt} Brickset allows each API key a day are left unused, for anything else on your key.`:`Your budget is all ${Lt} calls Brickset allows each API key a day.`,`The count starts again at ${t}.`].join(" ")}var vs=60;function Ae(i,s,t="retirement"){if(t==="release"&&i.available_from)return new Date(i.available_from)>s?"due":"";if(i.available_until){let e=new Date(i.available_until).getTime();return e<s.getTime()?"retired":(e-s.getTime())/864e5<=vs?"retiring":""}return i.available_from&&new Date(i.available_from)>s?"due":""}function Te(i,s,t,e="retirement"){return e==="release"&&i.available_from?`${new Date(i.available_from)>s?"Due":"Out"} ${t(i.available_from)}`:i.available_until?`${new Date(i.available_until)<s?"Retired":"Retires"} ${t(i.available_until)}`:i.available_from?`${new Date(i.available_from)>s?"Due":"Out"} ${t(i.available_from)}`:nt(i)?"Date unknown":"Details tbd"}function It(i){if(!i)return null;try{let s=new URL(i);return s.protocol==="https:"||s.protocol==="http:"?s.href:null}catch{return null}}function nt(i){let s=(i.name??"").trim();return s!==""&&s!==fs}function L(i){return nt(i)?i.name:"Name tbd"}var ys={around:"Now",year:"This year",past3:"Past 3 months",past1:"Past month",next1:"Next month",next3:"Next 3 months",coming:"Unreleased"},Me={around:"Three months either side of today",year:"January to December",coming:"Every set announced and not yet out, with a date or without"};function j(i,s=new Date){return i==="year"?String(s.getFullYear()):ys[i]}function Re(i,s){return!s||R[i].includes(s)?"":`This row offers ${R[i].map(e=>j(e)).join(", ")}, not ${j(s)}.`}var R={releases:["past3","around","year","coming"],themes:["past3","around","year","coming"],recent:["past3"],upcoming:["coming"]},bs={recent:"all",upcoming:"all",themes:"mine"};function K(i,s){let t=s.release_filters?.[i]??{},e=s.release_status.all!==null,r=bs[i],a=s.followed.length||!e?"mine":"all",o=r??t.scope??a;o==="all"&&!e&&(o="mine");let l=new Set(s.followed.map(p=>p.toLowerCase())),c=o==="mine"?(t.themes??[]).filter(p=>l.has(p.toLowerCase())):[],h=R[i],g=t.span&&h.includes(t.span)?t.span:i==="upcoming"?"coming":i==="recent"?"past3":"around";return{scope:o,themes:c,span:g}}function ft(i,s,t){let e=i.includes(s)?i.filter(r=>r!==s):[...i,s];return e.length===t.length?[]:e}var B=15,xs=3,Ht=2,xe=.25;function ze(i,s,t){if(!t)return{from:0,to:B,width:1};let e=Math.max(i-xe,0),r=Math.min(s+xe,B),a=Ht-(r-e);return a>0&&(e=Math.max(e-a/2,0),r=Math.min(e+Ht,B),e=Math.max(r-Ht,0)),{from:e,to:r,width:Math.max((r-e)/xs,1)}}function V(i,s){let t=typeof s=="string"?new Date(`${s.slice(0,10)}T00:00:00`):s,e=(t.getFullYear()-i.getFullYear())*12+t.getMonth()-i.getMonth(),r=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();return e+(t.getDate()-1)/r}function Fe(i,s,t=.15,e=4){let r=[];for(let a of[...i].sort((o,l)=>o.date.localeCompare(l.date))){let o=V(s,a.date);if(o<0||o>B)continue;let l=r[r.length-1];l&&o-l.at<=t?l.points.push(a):r.push({at:o,points:[a]})}return r.map(a=>({at:a.at,themes:a.points.slice(0,e).map(o=>o.theme),extra:Math.max(a.points.length-e,0),points:a.points}))}function qt(i,s=5){return Array.from({length:i},(t,e)=>(e-(i-1)/2)*s)}var ws=["recent","upcoming","themes"];function Wt(i,s){let t=s==="combined"?ws:["releases"];return i.filter(e=>!t.includes(e))}function De(i,s,t,e){let r=s[s.indexOf(t)+e];if(!r)return i;let a=i.filter(o=>o!==t);return a.splice(a.indexOf(r)+(e>0?1:0),0,t),a}var vt=new Map,yt="lego-invalidated";function Oe(i,s){let t=vt.get(s);return t||(t=i.callWS(z("lego/dashboard",s)),vt.set(s,t),t.catch(()=>vt.delete(s))),t}function bt(){vt.clear(),window.dispatchEvent(new Event(yt))}function Pe(i,s,t){return i.callWS({...z("lego/releases",s),scope:t.scope,themes:t.themes,span:t.span})}var Ne={tag:"svg",attrs:{viewBox:"0.50 1.19 99.00 99.00"},children:[{tag:"polygon",attrs:{points:"4.000,34.558 50.000,61.116 50.000,93.389 4.000,66.831",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 88%, black)"}},{tag:"polygon",attrs:{points:"50.000,61.116 96.000,34.558 96.000,66.831 50.000,93.389",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 59%, black)"}},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 50.000,61.116 4.000,34.558",style:"fill:var(--primary-color, #009ac7)"}},{tag:"g",attrs:{"stroke-width":"0.5",fill:"none","stroke-linecap":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M4.000,34.558 L50.000,61.116 L96.000,34.558"}},{tag:"path",attrs:{d:"M50.000,61.116 L50.000,93.389"}}]},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 96.000,66.831 50.000,93.389 4.000,66.831 4.000,34.558",fill:"none","stroke-width":"2.0","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"}},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,16.236 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"16.236",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M18.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"27.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M64.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"73.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,42.794 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"42.794",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{transform:"translate(11.596,34.314) scale(0.12837)"},children:[{tag:"g",attrs:{stroke:"#FFFFFF","stroke-width":"17.0","stroke-linecap":"round",fill:"none"},children:[{tag:"line",attrs:{x1:"120.00",y1:"153.05",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"60.00",y1:"214.40",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"180.00",y1:"249.69",x2:"120.00",y2:"275.05"}}]},{tag:"g",attrs:{fill:"#FFFFFF"},children:[{tag:"circle",attrs:{cx:"120.00",cy:"153.05",r:"19.38"}},{tag:"circle",attrs:{cx:"60.00",cy:"214.40",r:"19.38"}},{tag:"circle",attrs:{cx:"180.00",cy:"249.69",r:"19.38"}}]}]}]},Gt=[{part:"3005",size:"1x1",colour:"Red",width:38.44,svg:{tag:"svg",attrs:{viewBox:"0 0 38.44 55.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 19.220,29.723 19.220,54.027 1.900,44.027",fill:"#B01708"}},{tag:"polygon",attrs:{points:"19.220,29.723 36.540,19.723 36.540,44.027 19.220,54.027",fill:"#770F05"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 19.220,29.723 1.900,19.723",fill:"#C91A09"}},{tag:"path",attrs:{d:"M1.90,19.72 L19.22,29.72 L36.54,19.72 M19.22,29.72 L19.22,54.03",stroke:"#550B04","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 36.540,44.027 19.220,54.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#550B04","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#550B04","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#A11507",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F01F0B",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3004",size:"1x2",colour:"Orange",width:55.76,svg:{tag:"svg",attrs:{viewBox:"0 0 55.76 65.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 36.540,39.723 36.540,64.027 1.900,44.027",fill:"#F27901"}},{tag:"polygon",attrs:{points:"36.540,39.723 53.860,29.723 53.860,54.027 36.540,64.027",fill:"#A45201"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 36.540,39.723 1.900,19.723",fill:"#FE8A18"}},{tag:"path",attrs:{d:"M1.90,19.72 L36.54,39.72 L53.86,29.72 M36.54,39.72 L36.54,64.03",stroke:"#763B01","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 53.860,54.027 36.540,64.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#763B01","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3010",size:"1x4",colour:"Yellow",width:90.4,svg:{tag:"svg",attrs:{viewBox:"0 0 90.40 85.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 71.180,59.723 71.180,84.027 1.900,44.027",fill:"#F0C414"}},{tag:"polygon",attrs:{points:"71.180,59.723 88.500,49.723 88.500,74.027 71.180,84.027",fill:"#A6870B"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 71.180,59.723 1.900,19.723",fill:"#F2CD37"}},{tag:"path",attrs:{d:"M1.90,19.72 L71.18,59.72 L88.50,49.72 M71.18,59.72 L71.18,84.03",stroke:"#766108","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 88.500,74.027 71.180,84.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#766108","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3001",size:"2x4",colour:"Green",width:107.72,svg:{tag:"svg",attrs:{viewBox:"0 0 107.72 95.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 71.180,69.723 71.180,94.027 1.900,54.027",fill:"#1F6939"}},{tag:"polygon",attrs:{points:"71.180,69.723 105.820,49.723 105.820,74.027 71.180,94.027",fill:"#154727"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 71.180,69.723 1.900,29.723",fill:"#237841"}},{tag:"path",attrs:{d:"M1.90,29.72 L71.18,69.72 L105.82,49.72 M71.18,69.72 L71.18,94.03",stroke:"#0F331C","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 105.820,74.027 71.180,94.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#0F331C","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3009",size:"1x6",colour:"Dark Azure",width:125.04,svg:{tag:"svg",attrs:{viewBox:"0 0 125.04 105.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 105.820,79.723 105.820,104.027 1.900,44.027",fill:"#067AB0"}},{tag:"polygon",attrs:{points:"105.820,79.723 123.140,69.723 123.140,94.027 105.820,104.027",fill:"#045377"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 105.820,79.723 1.900,19.723",fill:"#078BC9"}},{tag:"path",attrs:{d:"M1.90,19.72 L105.82,79.72 L123.14,69.72 M105.82,79.72 L105.82,104.03",stroke:"#033B55","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 123.140,94.027 105.820,104.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#033B55","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"2456",size:"2x6",colour:"Blue",width:142.36,svg:{tag:"svg",attrs:{viewBox:"0 0 142.36 115.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 105.820,89.723 105.820,114.027 1.900,54.027",fill:"#004AA7"}},{tag:"polygon",attrs:{points:"105.820,89.723 140.460,69.723 140.460,94.027 105.820,114.027",fill:"#003271"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 105.820,89.723 1.900,29.723",fill:"#0055BF"}},{tag:"path",attrs:{d:"M1.90,29.72 L105.82,89.72 L140.46,69.72 M105.82,89.72 L105.82,114.03",stroke:"#002451","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 140.460,94.027 105.820,114.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#002451","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3008",size:"1x8",colour:"Dark Purple",width:159.68,svg:{tag:"svg",attrs:{viewBox:"0 0 159.68 125.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 140.460,99.723 140.460,124.027 1.900,44.027",fill:"#372F7F"}},{tag:"polygon",attrs:{points:"140.460,99.723 157.780,89.723 157.780,114.027 140.460,124.027",fill:"#252056"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 140.460,99.723 1.900,19.723",fill:"#3F3691"}},{tag:"path",attrs:{d:"M1.90,19.72 L140.46,99.72 L157.78,89.72 M140.46,99.72 L140.46,124.03",stroke:"#1B173E","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 157.780,114.027 140.460,124.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#1B173E","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M116.43,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"123.14",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M133.75,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"140.46",cy:"85.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3007",size:"2x8",colour:"Medium Lavender",width:177,svg:{tag:"svg",attrs:{viewBox:"0 0 177.00 135.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 140.460,109.723 140.460,134.027 1.900,54.027",fill:"#9D5FAD"}},{tag:"polygon",attrs:{points:"140.460,109.723 175.100,89.723 175.100,114.027 140.460,134.027",fill:"#6C3D78"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 140.460,109.723 1.900,29.723",fill:"#AC78BA"}},{tag:"path",attrs:{d:"M1.90,29.72 L140.46,109.72 L175.10,89.72 M140.46,109.72 L140.46,134.03",stroke:"#4D2C56","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 175.100,114.027 140.460,134.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#4D2C56","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M151.07,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"157.78",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,95.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"95.93",rx:"6.71",ry:"3.87"}}]}]}}];function xt(i){return n`<svg
    viewBox=${i.attrs.viewBox??d}
    aria-hidden="true"
    focusable="false"
  >
    ${(i.children??[]).map(Be)}
  </svg>`}function Be(i){let s=e=>i.attrs[e]??d,t=()=>(i.children??[]).map(Be);switch(i.tag){case"g":return D`<g transform=${s("transform")} fill=${s("fill")} stroke=${s("stroke")}
        stroke-width=${s("stroke-width")} stroke-linecap=${s("stroke-linecap")}
        stroke-linejoin=${s("stroke-linejoin")} style=${s("style")}>${t()}</g>`;case"polygon":return D`<polygon points=${s("points")} fill=${s("fill")} stroke=${s("stroke")}
        stroke-width=${s("stroke-width")} stroke-linejoin=${s("stroke-linejoin")}
        style=${s("style")}></polygon>`;case"path":return D`<path d=${s("d")} fill=${s("fill")} stroke=${s("stroke")}
        stroke-width=${s("stroke-width")} stroke-linecap=${s("stroke-linecap")}
        stroke-linejoin=${s("stroke-linejoin")} style=${s("style")}></path>`;case"ellipse":return D`<ellipse cx=${s("cx")} cy=${s("cy")} rx=${s("rx")} ry=${s("ry")}
        fill=${s("fill")} style=${s("style")}></ellipse>`;case"circle":return D`<circle cx=${s("cx")} cy=${s("cy")} r=${s("r")} fill=${s("fill")}
        style=${s("style")}></circle>`;case"line":return D`<line x1=${s("x1")} y1=${s("y1")} x2=${s("x2")} y2=${s("y2")}
        stroke=${s("stroke")} stroke-width=${s("stroke-width")}
        style=${s("style")}></line>`;default:return d}}var $s=.54,je=Gt.map(i=>Math.round(i.width*$s)),lt=class extends C{constructor(){super(...arguments);this.width=0}connectedCallback(){super.connectedCallback(),this.observer=new ResizeObserver(([t])=>{this.width=Math.floor(t.contentRect.width)}),this.observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.observer?.disconnect()}render(){let{count:t,gaps:e}=we(je,this.width);return n`<div class="bricks" aria-hidden="true">
      ${Gt.slice(0,t).map((r,a)=>n`<div style="width:${je[a]}px;margin-right:${e[a]??0}px">
            ${xt(r.svg)}
          </div>`)}
    </div>`}};lt.styles=$`
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
  `,u([m()],lt.prototype,"width",2);customElements.get("lego-bricks")||customElements.define("lego-bricks",lt);var wt=$`
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
`,Le=1,ks=2,He=3,Kt=4,_s=5,Vt=6,Ue=7,Ie=8,Ss={"star wars":Le,botanicals:Vt,"botanical collection":Vt,icons:Kt,"creator expert":Kt,technic:Ue,"harry potter":Ie,city:He},Es=[ks,_s,Le,He,Kt,Vt,Ue,Ie];function Y(i){let s=new Map,t=new Set;for(let e of i){let r=Ss[e.toLowerCase()];r&&!t.has(r)&&(s.set(e,r),t.add(r))}for(let e of i){if(s.has(e))continue;let r=Es.find(a=>!t.has(a));r===void 0?s.set(e,"other"):(s.set(e,r),t.add(r))}return s}function J(i){return i===void 0||i==="other"?"var(--lego-series-other)":`var(--lego-series-${i})`}var X=$`
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
`,$t=$`
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
`,kt=$`
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
`,qe=$`
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
`;var We="/lego_panel/icon.png";function T(i,s){customElements.get(i)||customElements.define(i,s)}var ct="lego-changed",Cs="lego-toggle",As="lego-move",Ge="lego-filter",Q={collection:{title:"My collection",icon:"mdi:toy-brick-outline"},releases:{title:"New releases",icon:"mdi:new-box"},recent:{title:"Out recently",icon:"mdi:new-box"},upcoming:{title:"Coming soon",icon:"mdi:calendar-clock"},themes:{title:"New in my themes",icon:"mdi:tag-heart-outline"},wishlist:{title:"My wishlist",icon:"mdi:heart-outline"},value:{title:"Collection value",icon:"mdi:chart-donut"},pieces:{title:"Pieces",icon:"mdi:shape-outline"}},b=class extends C{constructor(){super(...arguments);this.entryId="";this.collapsed=!1;this.handle=!1;this.bare=!1;this.dark=!1;this.pending=new Set;this.writeError="";this.toggle=()=>{this.collapsed=!this.collapsed,this.dispatchEvent(new CustomEvent(Cs,{detail:{row:this.row,collapsed:this.collapsed},bubbles:!0,composed:!0}))};this.onHandleKey=t=>{let e=t.key==="ArrowUp"?-1:t.key==="ArrowDown"?1:0;e&&(t.preventDefault(),this.dispatchEvent(new CustomEvent(As,{detail:{row:this.row,step:e},bubbles:!0,composed:!0})))};this.noArt=t=>{let e=t.target;e.classList.contains("noart")||(e.classList.add("noart"),e.src=We)}}actions(){return d}willUpdate(t){t.has("hass")&&(this.dark=!!this.hass?.themes?.darkMode)}render(){let t=Q[this.row];return n`
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
    `}focusHandle(){this.renderRoot.querySelector(".drag")?.focus()}date(t){let e=new Date(t);return Number.isNaN(e.getTime())?t:e.toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short",year:"numeric"})}num(t){return t.toLocaleString(this.hass?.locale?.language)}money(t,e=!0){return Ut(t,this.dash?.currency??null,this.hass?.locale?.language,e)||this.num(Math.round(t))}async toggleOwned(t){if(!this.pending.has(t.set_number)){this.writeError="",this.setPending(t.set_number,!0);try{await this.hass.callService("lego","set_collection",$e(this.dash?.device_id??"",t))}catch(e){this.writeError=A(e);return}finally{this.setPending(t.set_number,!1)}t.owned=!t.owned,t.qty_owned=t.owned?Math.max(t.qty_owned,1):0,this.requestUpdate(),this.dispatchEvent(new CustomEvent(ct,{bubbles:!0,composed:!0}))}}setPending(t,e){let r=new Set(this.pending);e?r.add(t):r.delete(t),this.pending=r}linked(t,e,r=!1){let a=It(t.url);return a?n`<a
      class="open"
      href=${a}
      target="_blank"
      rel="noopener noreferrer"
      tabindex=${r?"-1":d}
      aria-hidden=${r?"true":d}
      >${e}</a
    >`:e}themeColour(t){let e=this.dash?.followed??[],r=e.find(a=>a.toLowerCase()===t.toLowerCase());return J(r?Y(e).get(r):"other")}card(t,e="retirement",r,a=!0){let o=new Date,l=It(t.image),c=a?Ut(t.retail_price,this.dash?.currency??null,this.hass?.locale?.language):"";return n`
      <article class="card">
        ${this.linked(t,l?n`<img
                src=${l}
                alt=""
                loading="lazy"
                @error=${this.noArt}
              />`:n`<img
                class="noart"
                src=${We}
                alt=""
                loading="lazy"
              />`,!0)}
        <div class="meta">
          ${this.linked(t,n`<span
              class=${nt(t)?"name":"name unnamed"}
              title=${nt(t)?t.name:"Brickset has not published a name yet"}
              >${L(t)}</span
            >`)}
          <span class="num"
            >${r?n`<span
                    class="key"
                    style="background:${r}"
                    title=${t.theme}
                  ></span>`:d}${[t.set_number,c].filter(Boolean).join(" \xB7 ")}</span
          >
          <span class="when ${Ae(t,o,e)}"
            >${Te(t,o,h=>this.date(h),e)}</span
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
              aria-label=${t.owned?`Remove ${L(t)} from your collection`:`Add ${L(t)} to your collection`}
              @click=${()=>{this.toggleOwned(t)}}
            >
              <ha-icon icon=${t.owned?"mdi:check":"mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `}filler(t){return n`<div class="filler">
      <lego-bricks></lego-bricks>
      <span class="hint">${t}</span>
    </div>`}tail(t=""){return n`<div class="filler tail">
      <lego-bricks></lego-bricks>
      ${t?n`<span class="hint">${t}</span>`:d}
    </div>`}};b.styles=[X,wt,$t,kt,qe],u([k({attribute:!1})],b.prototype,"hass",2),u([k({attribute:!1})],b.prototype,"dash",2),u([k({attribute:!1})],b.prototype,"entryId",2),u([k({type:Boolean,reflect:!0})],b.prototype,"collapsed",2),u([k({type:Boolean})],b.prototype,"handle",2),u([k({type:Boolean,reflect:!0})],b.prototype,"bare",2),u([k({type:Boolean,reflect:!0})],b.prototype,"dark",2),u([m()],b.prototype,"pending",2),u([m()],b.prototype,"writeError",2);var M=class extends b{constructor(){super(...arguments);this.row="collection";this.refreshing=!1;this.refreshError="";this.setsOpen=!1;this.ownedError="";this.query="";this.results=[]}willUpdate(t){super.willUpdate(t),t.has("dash")&&(this.pricesPick=void 0),t.has("dash")&&this.dash!==this.ownedFor&&(this.owned=void 0,this.query.trim().length>=2&&this.search(this.query))}updated(){this.setsOpen&&!this.collapsed&&this.owned===void 0&&this.loadOwned()}async loadOwned(){let t=this.dash;if(!(!t||this.ownedFor===t)){this.ownedFor=t;try{let e=await this.hass.callWS({...z("lego/collection",t.entry_id),filter:"owned"});this.ownedFor===t&&(this.owned=e.sets,this.ownedError="")}catch(e){this.ownedFor===t&&(this.ownedError=A(e))}}}async search(t){if(this.query=t,t.trim().length<2){this.results=[];return}try{let e=await this.hass.callWS({...z("lego/search",this.dash?.entry_id??""),query:t,limit:24});this.query===t&&(this.results=e.sets)}catch{this.results=[]}}showPrices(){return this.pricesPick??this.dash?.collection_prices??!0}setPrices(t){this.pricesPick=t,this.hass.callWS({type:"lego/panel_config/set",collection_prices:t}).catch(()=>{})}async refresh(){this.refreshing=!0,this.refreshError="";try{await this.hass.callService("lego","refresh_collection",ke(this.dash?.device_id??"")),this.dispatchEvent(new CustomEvent(ct,{bubbles:!0,composed:!0}))}catch(t){this.refreshError=A(t)}finally{this.refreshing=!1}}subtitle(){return _e(this.dash?.last_synced??null,new Date)}short(){let t=this.dash?.quota;return!!t&&t.remaining<t.refresh_cost}actions(){let t=this.dash?.quota;if(!t)return d;let e=E(t.refresh_cost,"call","calls");return n`<button
      class="update"
      ?disabled=${this.refreshing||this.short()}
      title=${this.short()?"Today's Brickset budget is spent":`Fetch your collection from Brickset now, using ${e} of the ${t.remaining} left today`}
      @click=${()=>{this.refresh()}}
    >
      <ha-icon
        icon=${this.refreshing?"mdi:sync":"mdi:cloud-sync"}
      ></ha-icon>
      ${this.refreshing?"Updating\u2026":"Update"}
      <span class="sep" aria-hidden="true"></span>
      <span class="cost">${e}</span>
    </button>`}resumes(t){let e=new Date(t),r=e.toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"});return e.toDateString()===new Date().toDateString()?`at ${r}`:`tomorrow at ${r}`}body(){let t=this.dash?.stats,e=this.dash?.quota;if(!t)return n`<p class="muted">Loading your collection…</p>`;let r=[[t.sets_owned,"Sets owned"],[t.sets_distinct,"Distinct sets"],[t.pieces_owned,"Pieces"],[t.minifigs_owned,"Minifigures"]];return n`
      <div class="stats">
        ${r.map(([a,o])=>n`<div class="stat">
              <span class="n">${this.num(a)}</span
              ><span class="l">${o}</span>
            </div>`)}
      </div>
      ${this.short()&&e?n`<p class="caveat">
              Daily budget spent, ${e.calls_today} of ${e.budget} used,
              so this is the last sync's data. Updates resume
              ${this.resumes(e.resets_at)}.
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
    `}sets(){let t=this.query.trim().length>=2,e=t?this.results:this.owned??[];return n`
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
      ${this.ownedError&&!t?n`<p class="caveat bad">${this.ownedError}</p>`:this.owned===void 0&&!t?n`<p class="muted">Loading your sets…</p>`:n`<div class="count">
                  <p class="muted">
                    ${t?E(e.length,"matching set","matching sets"):`${E(e.length,"set owned","sets owned")}, by theme then name`}
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
                  ${e.map(r=>this.card(r,"retirement",this.themeColour(r.theme),this.showPrices()))}
                </div>`}
    `}};M.styles=[b.styles,$`
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
    `],u([m()],M.prototype,"refreshing",2),u([m()],M.prototype,"refreshError",2),u([m()],M.prototype,"setsOpen",2),u([m()],M.prototype,"owned",2),u([m()],M.prototype,"ownedError",2),u([m()],M.prototype,"query",2),u([m()],M.prototype,"results",2),u([m()],M.prototype,"pricesPick",2);T("lego-collection-row",M);var Ke=["releases","themes"],Ts=6,Ms=500,S=class extends b{constructor(){super(...arguments);this.kind="releases";this.error="";this.adding=!1;this.draft="";this.following=!1;this.followNote="";this.themesOpen=!1;this.wiggling=!1;this.held=!1;this.holdStart=()=>{!this.dash?.can_change||this.wiggling||(window.clearTimeout(this.holdTimer),this.holdTimer=window.setTimeout(()=>{this.held=!0,this.wiggling=!0},Ms))};this.holdEnd=()=>{window.clearTimeout(this.holdTimer)};this.onKey=t=>{t.key==="Escape"&&this.wiggling&&(this.wiggling=!1)};this.compact=!1;this.scrolledFor="";this.filterFor="";this.requested=""}connectedCallback(){super.connectedCallback(),this.sizer=new ResizeObserver(([t])=>{this.compact=t.contentRect.width<720}),this.sizer.observe(this),this.addEventListener("keydown",this.onKey)}disconnectedCallback(){super.disconnectedCallback(),this.sizer?.disconnect(),this.removeEventListener("keydown",this.onKey),window.clearTimeout(this.holdTimer)}get row(){return this.kind}willUpdate(t){super.willUpdate(t);let e=`${this.dash?.entry_id}:${this.kind}`;this.dash&&e!==this.filterFor&&(this.filterFor=e,this.filter=K(this.kind,this.dash),this.data=void 0)}updated(){!this.collapsed&&this.filter&&this.dash&&this.hass&&this.fetch(),this.scrollToToday()}scrollToToday(){let t=this.renderRoot.querySelector(".timescroll.compact"),e=t?.querySelector(".today"),r=`${this.filter?.span}:${this.data?.span.from}`;!t||!e||r===this.scrolledFor||(this.scrolledFor=r,t.scrollLeft=e.offsetLeft-t.clientWidth/2)}async fetch(){let t=this.filter,e=this.dash;if(!t||!e||e.release_status[t.scope]===null)return;let r=JSON.stringify([e.entry_id,t]);if(!(r===this.requested&&this.requestedWith===e)){this.requested=r,this.requestedWith=e;try{let a=await Pe(this.hass,e.entry_id,t);this.requested===r&&(this.data=a,this.error="")}catch(a){this.requested===r&&(this.error=A(a))}}}pick(t){if(!this.filter)return;this.filter={...this.filter,...t},this.openStack=void 0;let{scope:e,themes:r,span:a}=this.filter,o={scope:e,themes:r,span:a};this.hass.callWS({type:"lego/panel_config/set",release_filters:{[this.kind]:o}}).catch(()=>{}),this.dispatchEvent(new CustomEvent(Ge,{detail:{row:this.kind,filter:o},bubbles:!0,composed:!0}))}status(){return this.filter?this.dash?.release_status[this.filter.scope]:void 0}subtitle(){let t=this.status();return t==null?"":t==="fetching"?"Fetching releases\u2026":t==="failed"?"Couldn't fetch releases":this.data?E(this.data.sets.length,"set","sets"):"Loading\u2026"}actions(){return!this.filter||this.status()===null||R[this.kind].length<2?d:n`<div class="pills" role="group" aria-label="Time span">
      ${R[this.kind].map(t=>n`<button
            class=${t===this.filter?.span?"pill on":"pill"}
            aria-pressed=${t===this.filter?.span}
            title=${Me[t]??d}
            @click=${()=>this.pick({span:t})}
          >
            ${j(t)}
          </button>`)}
    </div>`}body(){let t=this.filter,e=this.dash;if(!t||!e)return n`<p class="muted">Loading…</p>`;let r=this.status();return r===null?n`<p class="muted">${this.unavailable()}</p>
        ${this.kind==="recent"||this.kind==="upcoming"?d:this.followControls()}`:r==="fetching"?n`<p class="muted">Fetching this year's releases…</p>`:r==="failed"?n`<p class="muted">
        Couldn't fetch this year's releases. They're tried again every few hours
        until they arrive.
      </p>`:n`
      ${Ke.includes(this.kind)?this.chips(t):d}
      ${Ke.includes(this.kind)&&this.data?this.timeline(this.data):d}
      ${this.error?n`<p class="caveat bad">${this.error}</p>`:d}
      ${this.cards()}
    `}unavailable(){return this.kind==="recent"||this.kind==="upcoming"?"Turn on Follow releases across all themes in the integration's options for this row.":this.kind==="themes"?this.dash?.can_change?"No themes followed yet. Follow one to see its new sets here.":"No themes followed yet.":this.dash?.can_change?"Follow a theme, or turn on Follow releases across all themes in the integration's options, to see new sets here.":"No themes followed yet."}chips(t){let e=this.dash,r=Y(e.followed),a=t.scope==="mine",o=e.release_status.all!==null,l=n`<button
      class=${t.scope==="all"?"chip on":o?"chip":"chip off"}
      aria-pressed=${t.scope==="all"}
      aria-disabled=${!o}
      @click=${()=>{if(!o){this.followNote="Everything needs Follow releases across all themes, in the integration's options. It reads every set of the year once a day, about 3 Brickset calls, where your own themes alone take fewer.";return}this.pick({scope:"all",themes:[]})}}
    >
      Everything
    </button>`,c=a?t.themes.length:0,h=n`<button
      class=${a?"chip on":"chip"}
      aria-pressed=${a}
      aria-expanded=${a&&this.themesOpen}
      @click=${()=>{this.wiggling=!1,a?this.themesOpen=!this.themesOpen:(this.themesOpen=!1,this.pick({scope:"mine",themes:[]}))}}
    >
      ${this.kind==="themes"?"All my themes":"My themes"}
      ${c&&!this.themesOpen?n`<span>· ${c}</span>`:d}
      <ha-icon
        class="drop"
        icon=${a&&this.themesOpen?"mdi:chevron-up":"mdi:chevron-down"}
      ></ha-icon>
    </button>`,g=a&&this.themesOpen;return n`<div class="chips">
        ${this.kind==="releases"?l:d}
        ${e.followed.length?h:d}
        ${g&&this.kind==="releases"?n`<span class="divider" aria-hidden="true"></span>`:d}
        ${(g?e.followed:[]).map(p=>{let f=t.scope==="mine"&&t.themes.includes(p);return n`<span
            class=${this.wiggling?"chipwrap wiggle":"chipwrap"}
          >
            <button
              class=${f?"chip on":"chip"}
              aria-pressed=${f}
              @pointerdown=${this.holdStart}
              @pointerup=${this.holdEnd}
              @pointerleave=${this.holdEnd}
              @pointercancel=${this.holdEnd}
              @contextmenu=${x=>x.preventDefault()}
              @click=${()=>{if(this.held){this.held=!1;return}this.wiggling||this.pick({scope:"mine",themes:ft(t.scope==="mine"?t.themes:[],p,e.followed)})}}
            >
              <span
                class="key"
                style="background:${J(r.get(p))}"
              ></span>
              ${p}
            </button>
            ${this.wiggling?n`<button
                    class="remove"
                    aria-label=${`Stop following ${p}`}
                    ?disabled=${this.following}
                    @click=${()=>{this.follow(p,!1)}}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>`:d}
          </span>`})}
        ${this.wiggling?n`<button
                class="chip on"
                @click=${()=>this.wiggling=!1}
              >
                Done
              </button>`:g||!e.followed.length?this.followChip():d}
      </div>
      ${this.adding?this.editor():d}
      ${this.followNote&&!this.adding?n`<p class="caveat" role="status">${this.followNote}</p>`:d}`}followControls(){return this.dash?.can_change?n`<div class="chips">${this.followChip()}</div>
      ${this.adding?this.editor():d}`:d}followChip(){if(!this.dash?.can_change||this.adding)return d;let t=this.dash.followed.length>0;return n`<button class="chip" @click=${()=>{this.openEditor()}}>
      <ha-icon icon=${t?"mdi:pencil":"mdi:plus"}></ha-icon>
      ${t?"Edit themes":"Follow a theme"}
    </button>`}async openEditor(){this.adding=!0,this.followNote="",await this.loadThemes()}async loadThemes(){try{this.themeList=await this.hass.callWS(z("lego/themes",this.entryId||this.dash?.entry_id||""))}catch(t){this.followNote=A(t)}}editor(){let t=this.themeList,e=t?.followed??this.dash?.followed??[],r=new Set(e.map(l=>l.toLowerCase())),a=t?t.follow_cost?E(t.follow_cost,"call","calls"):"free":"\u2026",o=`lego-themes-${this.kind}`;return n`<div class="follow">
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
      ${e.length?n`<div class="chips" role="group" aria-label="Themes you follow">
              ${e.map(l=>n`<button
                    class="chip"
                    aria-label=${`Stop following ${l}`}
                    ?disabled=${this.following}
                    @click=${()=>{this.follow(l,!1)}}
                  >
                    ${l}
                    <ha-icon class="drop" icon="mdi:close"></ha-icon>
                  </button>`)}
            </div>`:d}
      ${this.followNote?n`<p class="caveat" role="status">${this.followNote}</p>`:d}`}async follow(t,e){let r=t.trim();if(!(!r||this.following)){this.following=!0,this.followNote="";try{let a=await this.hass.callWS({...z("lego/themes/follow",this.entryId||this.dash?.entry_id||""),theme:r,follow:e});e&&(this.draft=""),a.complete||(this.followNote=`Following ${r}. Its sets arrive with the next check, as today's budget is spent.`),await this.loadThemes()}catch(a){this.followNote=A(a);return}finally{this.following=!1}this.dispatchEvent(new CustomEvent(ct,{bubbles:!0,composed:!0}))}}stack(t,e,r,a){let o=y=>`${e(y)*100}%`,l=t.at>=r-.01&&t.at<=a+.01,c=qt(t.themes.length),h=qt(t.themes.length,14),g=this.hass?.locale?.language,p=y=>new Date(y).toLocaleDateString(g,{day:"numeric",month:"short"}),f=t.points.slice(0,Ts),x=e(t.at)<.25?"tip start":e(t.at)>.75?"tip end":"tip";return n`<button
      class=${l?"stack":"stack out"}
      style="left:${o(t.at)}"
      aria-label=${t.points.map(y=>`${L(y)}, ${p(y.date)}`).join("; ")}
      aria-pressed=${this.compact?this.openStack?.at===t.at:d}
      @click=${()=>{this.compact&&(this.openStack=this.openStack?.at===t.at?void 0:t)}}
    >
      ${t.themes.map((y,v)=>n`<span
            class="disc"
            style="--rest:${c[v]}px;--fan:${h[v]}px;background:${this.themeColour(y)};z-index:${10-v}"
          ></span>`)}
      ${t.extra?n`<span class="extra">+${t.extra}</span>`:d}
      <span class=${x} aria-hidden="true">
        ${f.map(y=>n`<span class="tipline">
              <span
                class="key"
                style="background:${this.themeColour(y.theme)}"
              ></span>
              <span class="tipname">${L(y)}</span>
              <span class="tipdate">${p(y.date)}</span>
            </span>`)}
        ${t.points.length>f.length?n`<span class="tipmore"
                >+${t.points.length-f.length} more</span
              >`:d}
      </span>
    </button>`}timeline(t){let e=new Date,r=new Date(e.getFullYear(),0,1),a=Math.max(V(r,t.span.from),0),o=t.span.to?Math.min(V(r,t.span.to),B):B,l=ze(a,o,this.compact),c=v=>(v-l.from)/(l.to-l.from),h=v=>`${c(v)*100}%`,g=v=>v>=l.from-.05&&v<=l.to+.05,p=Fe(t.timeline,r).filter(v=>g(v.at)),f=this.hass?.locale?.language,x=t.timeline.filter(v=>{let w=V(r,v.date);return w>=a&&w<=o}).length,y=V(r,e);return n`<div
        class=${this.compact?"timescroll compact":"timescroll"}
      >
        <div
          class="timeline"
          role="group"
          style="width:${l.width*100}%"
          aria-label=${`${E(t.timeline.length,"set","sets")} from January to next March, ${x} in the chosen span`}
        >
          <div class="line"></div>
          <div
            class="window"
            style="left:${h(a)};width:${h(l.from+Math.max(o-a,0))}"
          ></div>
          ${p.map(v=>this.stack(v,c,a,o))}
          ${g(y)?n`<ha-icon
                  class="today"
                  icon="mdi:chevron-down"
                  style="left:${h(y)}"
                ></ha-icon>`:d}
          ${Array.from({length:B},(v,w)=>w).filter(v=>v+1>l.from&&v<l.to).map(v=>{let w=new Date(r.getFullYear(),v,1).toLocaleDateString(f,{month:"short"});return n`<span
                class=${v%3===0?"month quarter":"month"}
                style="left:${h(v)};width:${h(l.from+1)}"
                aria-hidden="true"
                >${w}</span
              >`})}
        </div>
      </div>
      ${this.compact&&this.openStack?this.picked(this.openStack):d}`}picked(t){let e=this.hass?.locale?.language;return n`<div class="picked" role="status">
      ${t.points.map(r=>n`<span class="tipline">
            <span
              class="key"
              style="background:${this.themeColour(r.theme)}"
            ></span>
            <span class="tipname">${L(r)}</span>
            <span class="tipdate"
              >${new Date(r.date).toLocaleDateString(e,{day:"numeric",month:"short"})}</span
            >
          </span>`)}
    </div>`}cards(){let t=this.data?.sets;if(!t)return n`<p class="muted">Loading…</p>`;if(!t.length){let e=this.filter&&this.filter.span==="coming";return this.filler(e?"Nothing due in this span yet.":"Nothing new in this span. Try a longer one.")}return n`<div class="carousel">
      ${t.map(e=>this.card(e,"release",this.themeColour(e.theme)))}
      ${this.tail()}
    </div>`}};S.styles=[b.styles,$`
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
    `],u([k()],S.prototype,"kind",2),u([m()],S.prototype,"filter",2),u([m()],S.prototype,"data",2),u([m()],S.prototype,"error",2),u([m()],S.prototype,"adding",2),u([m()],S.prototype,"themeList",2),u([m()],S.prototype,"draft",2),u([m()],S.prototype,"following",2),u([m()],S.prototype,"followNote",2),u([m()],S.prototype,"themesOpen",2),u([m()],S.prototype,"wiggling",2),u([m()],S.prototype,"compact",2),u([m()],S.prototype,"openStack",2);T("lego-releases-row",S);var Rs=365,zs=12,Ve=70,Yt=2*Math.PI*Ve,Fs=1.5,P=class extends b{constructor(){super(...arguments);this.kind="value";this.hover="";this.trendOpen=!1;this.hoverPoint=null;this.historyFor=""}get row(){return this.kind}willUpdate(t){super.willUpdate(t);let e=`${this.dash?.entry_id}:${this.kind}`;this.dash&&e!==this.historyFor&&(this.historyFor=e,this.history=void 0)}updated(){this.trendOpen&&!this.collapsed&&this.history===void 0&&this.loadHistory()}format(t){return this.kind==="value"?this.money(t):this.num(Math.round(t))}subtitle(){let t=this.dash?.stats;return t?this.kind==="value"?`${this.money(t.value)} at LEGO.com RRP`:E(t.pieces_owned,"piece","pieces"):""}body(){let t=this.dash?.stats;if(!t)return n`<p class="muted">Loading…</p>`;let e=Ee(this.dash?.by_theme??[],this.kind),r=this.kind==="value"?t.value:t.pieces_owned;if(!e.length)return n`<p class="muted">
        Nothing owned with a published figure yet.
      </p>`;let a=Y(e.filter(l=>!l.other).map(l=>l.theme)),o=l=>J(l.other?"other":a.get(l.theme));return n`
      <div class="chart">
        ${this.donut(e,r,o)} ${this.bars(e,r,o)}
      </div>
      <p class="footnote">
        <span
          >${this.kind==="value"&&t.sets_missing_price?`${E(t.sets_missing_price,"set has","sets have")} no published price and ${t.sets_missing_price===1?"is":"are"} not counted.`:""}</span
        >
        ${this.kind==="value"?n`<span>At LEGO.com RRP</span>`:d}
      </p>
      ${this.trend()}
    `}donut(t,e,r){let a=t.reduce((h,g)=>h+g.amount,0)||1,o=0,l=t.map(h=>{let g=Math.max(h.amount/a*Yt-Fs,.5),p=D`<circle
        cx="100"
        cy="100"
        r=${Ve}
        fill="none"
        stroke=${r(h)}
        stroke-width=${this.hover===h.theme?34:28}
        stroke-dasharray=${`${g} ${Yt-g}`}
        stroke-dashoffset=${-o}
        class=${this.hover&&this.hover!==h.theme?"faded":""}
        @mouseenter=${()=>this.hover=h.theme}
        @mouseleave=${()=>this.hover=""}
      ></circle>`;return o+=h.amount/a*Yt,p}),c=t.find(h=>h.theme===this.hover);return n`<div class="donut">
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
        <span class="n">${this.format(c?c.amount:e)}</span>
        <span class="l">${c?c.theme:"in total"}</span>
      </div>
    </div>`}bars(t,e,r){let a=t.reduce((o,l)=>Math.max(o,l.amount),0)||1;return n`<ul class="bars">
      ${t.map((o,l)=>{let c=this.hover===o.theme,h=this.hover&&!c,g=o.setNumbers.slice(0,zs),p=o.setNumbers.length-g.length;return n`<li>
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
                    ${Math.round(o.amount/(e||1)*100)}% of the
                    collection, ${E(o.sets,"set","sets")}
                    ${g.length?n`<span class="numbers"
                            >${g.join(", ")}${p?`, and ${p} more`:""}</span
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
    </div>`}async loadHistory(){let t=this.dash?.history?.[this.kind],e=this.historyFor;if(!t){this.history="none";return}this.history="loading";try{let r=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(Date.now()-Rs*864e5).toISOString(),statistic_ids:[t],period:"week",types:this.kind==="value"?["state"]:["mean"]});if(e!==this.historyFor)return;let a=Se(r[t]??[]);this.history=a.length>=2?a:"none"}catch{e===this.historyFor&&(this.history="none")}}trendChart(){let t=this.history;if(t===void 0||t==="loading")return n`<p class="muted">Loading the trend…</p>`;if(t==="none")return n`<p class="muted">
        No history yet. Home Assistant records it weekly from the sensor, so a
        line appears after a couple of weeks.
      </p>`;let e=t,r=Math.min(...e.map(w=>w.v)),o=Math.max(...e.map(w=>w.v))-r||1,l=e[0].t,c=e[e.length-1].t-l||1,h=w=>(w.t-l)/c*100,g=w=>90-(w.v-r)/o*80,p=e.map(w=>`${h(w)},${g(w)}`).join(" "),f=e[e.length-1],x=this.hoverPoint===null?void 0:e[this.hoverPoint],y=x??f,v=w=>new Date(w).toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short"});return n`
      <div
        class="plot"
        @pointermove=${w=>{let ee=w.currentTarget.getBoundingClientRect(),se=l+(w.clientX-ee.left)/ee.width*c,Ct=0;e.forEach((Xe,Qe)=>{Math.abs(Xe.t-se)<Math.abs(e[Ct].t-se)&&(Ct=Qe)}),this.hoverPoint=Ct}}
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
          ${x?D`<line class="cross" x1=${h(x)} y1="0" x2=${h(x)} y2="100"></line>`:d}
        </svg>
        <span class="dot" style="left:${h(y)}%;top:${g(y)}%"></span>
        <span
          class="readout"
          style="left:${Math.min(Math.max(h(y),12),88)}%"
          >${this.format(y.v)} · ${v(y.t)}</span
        >
      </div>
      <div class="axis">
        <span>${v(e[0].t)}</span><span>${v(f.t)}</span>
      </div>
    `}};P.styles=[b.styles,$`
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
    `],u([k()],P.prototype,"kind",2),u([m()],P.prototype,"hover",2),u([m()],P.prototype,"trendOpen",2),u([m()],P.prototype,"history",2),u([m()],P.prototype,"hoverPoint",2);T("lego-value-row",P);var Ye="Mark sets as wanted on Brickset and they land here.",Jt=class extends b{constructor(){super(...arguments);this.row="wishlist"}subtitle(){return E(this.dash?.wishlist.length??0,"set","sets")}body(){let t=this.dash?.wishlist??[];return t.length?n`<div class="carousel">
      ${t.map(e=>this.card(e,"retirement",this.themeColour(e.theme)))}
      ${this.tail(Ye)}
    </div>`:this.filler(`Nothing on your wishlist yet. ${Ye}`)}};T("lego-wishlist-row",Jt);var Ds={account:"Brickset account",collapsed:"Start folded",measure:"Show",row:"Row",scope:"Themes",themes:"Only these themes",span:"Span"},Os={account:"Leave empty to show the account you opened last in the LEGO panel.",collapsed:"Show only the card's header until it is opened.",scope:"Everything needs Follow releases across all themes in the options.",themes:"Narrows My themes to some of the themes you follow.",span:"Leave empty for the row's own default."},_t={name:"account",selector:{config_entry:{integration:"lego"}}},St={name:"collapsed",selector:{boolean:{}}};function Et(i,s=()=>{}){return{schema:i,computeLabel:t=>Ds[t.name],computeHelper:t=>Os[t.name],assertConfig:s}}var F=class extends C{constructor(){super(...arguments);this.error="";this.loadedFor=null;this.reload=()=>{this.loadedFor=null,this.requestUpdate()}}setConfig(t){if(!t)throw new Error("Invalid configuration");this.config=t,this.loadedFor=null}getCardSize(){return this.config?.collapsed?1:6}getGridOptions(){return{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),window.addEventListener(yt,this.reload)}disconnectedCallback(){window.removeEventListener(yt,this.reload),super.disconnectedCallback()}updated(){let t=this.config?.account??"";this.hass&&this.config&&this.loadedFor!==t&&(this.loadedFor=t,Oe(this.hass,t).then(e=>{this.dash=e,this.error=""}).catch(e=>this.error=A(e)))}render(){return n`<ha-card
      @lego-changed=${()=>bt()}
      @lego-toggle=${t=>t.stopPropagation()}
    >
      ${this.error?n`<div class="error">${this.error}</div>`:this.dash&&this.hass?this.row(this.dash):d}
    </ha-card>`}};F.styles=[X,$`
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
    `],u([k({attribute:!1})],F.prototype,"hass",2),u([m()],F.prototype,"config",2),u([m()],F.prototype,"dash",2),u([m()],F.prototype,"error",2);var Xt=class extends F{static getStubConfig(){return{}}static getConfigForm(){return Et([_t,St])}row(s){return n`<lego-collection-row
      bare
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${s}
      .entryId=${s.entry_id}
    ></lego-collection-row>`}},Qt=class extends F{static getStubConfig(){return{}}static getConfigForm(){return Et([_t,St])}row(s){return n`<lego-wishlist-row
      bare
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${s}
      .entryId=${s.entry_id}
    ></lego-wishlist-row>`}},Zt=class extends F{static getStubConfig(){return{measure:"value"}}static getConfigForm(){return Et([_t,{name:"measure",selector:{select:{mode:"dropdown",options:[{value:"value",label:"Collection value"},{value:"pieces",label:"Pieces"}]}}},St])}row(s){return n`<lego-value-row
      bare
      .kind=${this.config?.measure==="pieces"?"pieces":"value"}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${s}
      .entryId=${s.entry_id}
    ></lego-value-row>`}},te=class extends F{static getStubConfig(){return{row:"releases"}}static getConfigForm(){let s=[...new Set(Object.values(R).flat())];return Et([_t,{name:"row",selector:{select:{mode:"dropdown",options:Object.keys(R).map(t=>({value:t,label:Q[t].title}))}}},{name:"scope",selector:{select:{mode:"dropdown",options:[{value:"mine",label:"My themes"},{value:"all",label:"Everything"}]}}},{name:"themes",selector:{select:{multiple:!0,custom_value:!0,options:[]}}},{name:"span",selector:{select:{mode:"dropdown",options:s.map(t=>({value:t,label:j(t)}))}}},St],t=>{let e=Re(t.row??"releases",t.span);if(e)throw new Error(e)})}row(s){let t=this.config?.row??"releases",e={};this.config?.scope&&(e.scope=this.config.scope),this.config?.themes&&(e.themes=this.config.themes),this.config?.span&&(e.span=this.config.span);let r={...s,release_filters:{...s.release_filters,[t]:{...K(t,s),...e}}};return n`<lego-releases-row
      bare
      .kind=${t}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${r}
      .entryId=${s.entry_id}
    ></lego-releases-row>`}},Ps=[["lego-collection-card",Xt,"LEGO collection","Your Brickset collection's totals, with every set and a search."],["lego-releases-card",te,"LEGO releases","New and upcoming sets, across every theme or the ones you follow."],["lego-wishlist-card",Qt,"LEGO wishlist","The sets you want, soonest to retire first."],["lego-value-card",Zt,"LEGO collection value","What your collection is worth at LEGO.com RRP, by theme."]],Ns="https://github.com/PineappleEmperor/ha-lego#dashboard-cards";for(let[i,s,t,e]of Ps)T(i,s),window.customCards=window.customCards??[],window.customCards.some(r=>r.type===i)||window.customCards.push({type:i,name:t,description:e,preview:!0,documentationURL:Ns});var Je=["releases","recent","upcoming","themes"],_=class extends C{constructor(){super(...arguments);this.narrow=!1;this.dark=!1;this.error="";this.accounts=[];this.account="";this.defaultAccount="";this.switching="";this.picking=!1;this.customising=!1;this.folded={};this.dragging="";this.over="";this.foldedFor="";this.onToggle=t=>{let{row:e,collapsed:r}=t.detail;this.folded={...this.folded,[e]:r}};this.onFilter=t=>{let{row:e,filter:r}=t.detail;this.dash&&(this.dash={...this.dash,release_filters:{...this.dash.release_filters,[e]:r}})};this.onMove=t=>{let{row:e,step:r}=t.detail;this.move(e,r,this.visible())};this.onChanged=()=>{bt(),this.load()};this.onTouchMove=t=>{if(!this.dragging||t.pointerType==="mouse")return;let e=this.renderRoot.elementsFromPoint(t.clientX,t.clientY).map(r=>r.closest(".slot")).find(r=>r&&r.dataset.row);e?.dataset.row&&(this.over=e.dataset.row)};this.onPickerKey=t=>{t.key==="Escape"&&this.picking&&(this.picking=!1,this.renderRoot.querySelector(".account")?.focus())};this.onOutside=t=>{let e=this.renderRoot.querySelector(".accountpick");this.picking&&e&&!t.composedPath().includes(e)&&(this.picking=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this.onOutside),this.load()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this.onOutside)}willUpdate(){this.dark=!!this.hass?.themes?.darkMode}async load(){try{if(!this.accounts.length){let e=await this.hass.callWS({type:"lego/accounts"});this.accounts=e.accounts,this.account=e.selected??"",this.defaultAccount=this.account}let t=await this.hass.callWS(z("lego/dashboard",this.account));t.entry_id!==this.foldedFor&&(this.foldedFor=t.entry_id,this.folded=Object.fromEntries(t.collapsed.map(e=>[e,!0]))),this.dash=t,this.error=""}catch(t){this.error=A(t)}}async selectAccount(t){if(t!==this.account){this.account=t,this.switching=this.accounts.find(e=>e.entry_id===t)?.name??"account";try{await this.load()}finally{this.switching=""}}}async makeDefault(t){try{await this.hass.callWS({type:"lego/account/set",config_entry_id:t}),this.defaultAccount=t}catch(e){this.error=A(e)}}async save(t){if(this.dash){this.dash={...this.dash,...t};try{let e=await this.hass.callWS({type:"lego/panel_config/set",...t});this.dash&&(this.dash={...this.dash,...e})}catch{}}}visible(){let t=this.dash;return t?Wt(t.rows,t.release_mode).filter(e=>!t.hidden.includes(e)):[]}move(t,e,r){if(!this.dash)return;let a=De(this.dash.rows,r,t,e);a!==this.dash.rows&&(this.save({rows:a}),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-row="${t}"] > *`)?.focusHandle?.()))}onTouchStart(t,e){t.pointerType==="mouse"||!t.composedPath().some(a=>a instanceof Element&&a.classList.contains("drag"))||(t.currentTarget.setPointerCapture(t.pointerId),this.dragging=e,this.over=e)}onTouchEnd(t){this.dragging&&this.onDrop(this.over,t)}onDrop(t,e){let r=this.dragging;if(this.dragging="",this.over="",!this.dash||!r||r===t)return;let a=this.dash.rows.filter(c=>c!==r),o=a.indexOf(t),l=e.indexOf(r)<e.indexOf(t);a.splice(o+(l?1:0),0,r),this.save({rows:a})}render(){return n`
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
    `}renderHeader(){let t=this.dash?.quota,e=t?Math.min(t.calls_today/(t.budget||1),1):0,r=!!t&&t.remaining<t.refresh_cost*3;return n`<header class=${this.narrow?"narrow":""}>
      <div class="title">
        ${this.narrow?n`<ha-menu-button
                .hass=${this.hass}
                .narrow=${this.narrow}
              ></ha-menu-button>`:d}
        <span class="logo">${xt(Ne)}</span>
        <span class="heading">
          <h1>LEGO</h1>
          ${this.narrow&&t?n`<span class=${r?"calls tight":"calls"}
                  >${t.calls_today} of ${t.budget} calls</span
                >`:d}
        </span>
      </div>
      ${t&&!this.narrow?n`<div
              class=${r?"meter tight":"meter"}
              title=${Ce(t.calls_today,t.budget,new Date(t.resets_at).toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"}))}
            >
              <span class="meter-label">Brickset calls</span>
              <span
                class="meter-bar"
                role="meter"
                aria-label="Brickset calls used today"
                aria-valuemin="0"
                aria-valuemax=${t.budget}
                aria-valuenow=${t.calls_today}
                ><span style="width:${e*100}%"></span
              ></span>
              <span>${t.calls_today} of ${t.budget} today</span>
            </div>`:d}
      ${this.accounts.length>1?this.accountPicker():d}
    </header>`}accountPicker(){let t=this.accounts.find(e=>e.entry_id===this.account);return n`<div class="accountpick" @keydown=${this.onPickerKey}>
      <div class="accountbar">
        <button
          class="account"
          aria-haspopup="true"
          aria-expanded=${this.picking}
          aria-label=${`Brickset account: ${t?.name??""}`}
          @click=${()=>this.picking=!this.picking}
        >
          <span class="names" aria-hidden="true">
            ${this.accounts.map(e=>n`<span
                  class=${e.entry_id===t?.entry_id?"name":"name ghost"}
                  >${e.name}</span
                >`)}
          </span>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
        ${t?this.brickButton(t):d}
      </div>
      ${this.picking?n`<ul class="menu">
              ${this.accounts.map(e=>n`<li>
                    <button
                      class="pick"
                      aria-current=${e.entry_id===this.account}
                      @click=${()=>{this.picking=!1,this.selectAccount(e.entry_id)}}
                    >
                      ${e.name}
                    </button>
                    ${this.brickButton(e)}
                  </li>`)}
            </ul>`:d}
    </div>`}brickButton(t){let e=t.entry_id===this.defaultAccount,r=e?`${t.name} opens by default`:`Open ${t.name} by default`;return n`<button
      class="brick"
      title=${r}
      aria-label=${r}
      aria-pressed=${e}
      @click=${()=>{e?void 0:this.makeDefault(t.entry_id)}}
    >
      <ha-icon
        icon=${e?"mdi:toy-brick":"mdi:toy-brick-outline"}
      ></ha-icon>
    </button>`}renderHome(){let t=this.dash;if(!t)return n`<p class="muted pad">Loading your collection…</p>`;let e=this.visible(),r=e.some(a=>!this.folded[a]);return n`<div
      class="rows"
      @lego-toggle=${this.onToggle}
      @lego-move=${this.onMove}
      @lego-filter=${this.onFilter}
      @lego-changed=${this.onChanged}
    >
      <div class="homebar">
        <button
          class="link"
          @click=${()=>this.folded=Object.fromEntries(e.map(a=>[a,r]))}
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
      ${e.length?e.map(a=>this.renderRow(a,e)):n`<p class="muted">
              Every row is hidden. Choose Customise to bring some back.
            </p>`}
    </div>`}renderRow(t,e){let r={hass:this.hass,dash:this.dash,entryId:this.dash?.entry_id??"",collapsed:!!this.folded[t]},a;return Je.includes(t)?a=n`<lego-releases-row
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
      @drop=${()=>this.onDrop(t,e)}
      @pointerdown=${o=>this.onTouchStart(o,t)}
      @pointermove=${this.onTouchMove}
      @pointerup=${()=>this.onTouchEnd(e)}
      @pointercancel=${()=>{this.dragging="",this.over=""}}
    >
      ${a}
    </div>`}renderCustomise(t){let e=Wt(t.rows,t.release_mode),r=t.release_status.all!==null;return n`<section class="row customise" aria-label="Customise this page">
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
        ${e.map(a=>this.renderCustomiseRow(t,a,e))}
      </ul>
      ${r?d:n`<p class="muted">
              For Everything, Out recently and Coming soon, turn on Follow
              releases across all themes in the integration's options.
            </p>`}
    </section>`}renderCustomiseRow(t,e,r){let a=Q[e].title,o=!t.hidden.includes(e),l=t.collapsed.includes(e)?"collapsed":"open",c=h=>{let g=t.collapsed.filter(p=>p!==e);h&&g.push(e),this.folded={...this.folded,[e]:h},this.save({collapsed:g})};return n`<li>
      <div class="crow">
        <button
          class="drag"
          data-custom=${e}
          aria-label=${`Move ${a} up or down`}
          title="Use the arrow keys to reorder"
          @keydown=${h=>{let g=h.key==="ArrowUp"?-1:h.key==="ArrowDown"?1:0;g&&(h.preventDefault(),this.move(e,g,r),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-custom="${e}"]`)?.focus()))}}
        >
          <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
        </button>
        <input
          type="checkbox"
          .checked=${o}
          aria-label=${`Show ${a}`}
          @change=${h=>{let g=h.target.checked,p=t.hidden.filter(f=>f!==e);g||p.push(e),this.save({hidden:p})}}
        />
        <span class="rowname"
          ><ha-icon icon=${Q[e].icon}></ha-icon>${a}</span
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
      ${Je.includes(e)?this.renderStartsOn(t,e):d}
    </li>`}renderStartsOn(t,e){let r=K(e,t),a=c=>{let h=t.release_filters[e]??{};this.save({release_filters:{...t.release_filters,[e]:{...h,...c}}})},o=(c,h,g)=>n`<button
        class=${h?"chip small on":"chip small"}
        aria-pressed=${h}
        @click=${g}
      >
        ${c}
      </button>`,l=e==="releases"||e==="themes";return n`<div class="startson">
      <span class="muted-label">Starts on</span>
      ${l&&e==="releases"&&t.release_status.all!==null?o("Everything",r.scope==="all",()=>a({scope:"all",themes:[]})):d}
      ${l&&t.followed.length?o(e==="themes"?"All my themes":"My themes",r.scope==="mine"&&!r.themes.length,()=>a({scope:"mine",themes:[]})):d}
      ${l?t.followed.map(c=>o(c,r.scope==="mine"&&r.themes.includes(c),()=>a({scope:"mine",themes:ft(r.scope==="mine"?r.themes:[],c,t.followed)}))):d}
      <label class="spanpick"
        >Span
        <select
          @change=${c=>a({span:c.target.value})}
        >
          ${R[e].map(c=>n`<option value=${c} ?selected=${c===r.span}>
                ${j(c)}
              </option>`)}
        </select></label
      >
    </div>`}};_.styles=[X,wt,$t,kt,$`
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
      .heading {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .calls {
        color: var(--lego-text-2);
        font-size: var(--ha-font-size-s, 12px);
        white-space: nowrap;
      }
      .calls.tight {
        color: var(--lego-want);
      }
      /* A phone keeps the header to one line, the account on the right. */
      header.narrow {
        column-gap: var(--ha-space-2, 8px);
        flex-wrap: nowrap;
        padding-right: var(--ha-space-2, 8px);
      }
      .accountpick {
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
    `],u([k({attribute:!1})],_.prototype,"hass",2),u([k({type:Boolean})],_.prototype,"narrow",2),u([k({type:Boolean,reflect:!0})],_.prototype,"dark",2),u([m()],_.prototype,"dash",2),u([m()],_.prototype,"error",2),u([m()],_.prototype,"accounts",2),u([m()],_.prototype,"account",2),u([m()],_.prototype,"defaultAccount",2),u([m()],_.prototype,"switching",2),u([m()],_.prototype,"picking",2),u([m()],_.prototype,"customising",2),u([m()],_.prototype,"folded",2),u([m()],_.prototype,"dragging",2),u([m()],_.prototype,"over",2);T("lego-panel",_);export{_ as LegoPanel};
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
