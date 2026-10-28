var Dr=Object.defineProperty;var Or=Object.getOwnPropertyDescriptor;var p=(i,r,e,t)=>{for(var s=t>1?void 0:t?Or(r,e):r,a=i.length-1,o;a>=0;a--)(o=i[a])&&(s=(t?o(r,e,s):o(s))||s);return t&&s&&Dr(r,e,s),s};var me=globalThis,fe=me.ShadowRoot&&(me.ShadyCSS===void 0||me.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ue=Symbol(),ft=new WeakMap,ae=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==Ue)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(fe&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=ft.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&ft.set(e,r))}return r}toString(){return this.cssText}},vt=i=>new ae(typeof i=="string"?i:i+"",void 0,Ue),$=(i,...r)=>{let e=i.length===1?i[0]:r.reduce((t,s,a)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[a+1],i[0]);return new ae(e,i,Ue)},bt=(i,r)=>{if(fe)i.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),s=me.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,i.appendChild(t)}},We=fe?i=>i:i=>i instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return vt(e)})(i):i;var{is:Fr,defineProperty:Lr,getOwnPropertyDescriptor:Nr,getOwnPropertyNames:Br,getOwnPropertySymbols:jr,getPrototypeOf:Hr}=Object,ve=globalThis,wt=ve.trustedTypes,Ir=wt?wt.emptyScript:"",Ur=ve.reactiveElementPolyfillSupport,oe=(i,r)=>i,ne={toAttribute(i,r){switch(r){case Boolean:i=i?Ir:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,r){let e=i;switch(r){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},be=(i,r)=>!Fr(i,r),yt={attribute:!0,type:String,converter:ne,reflect:!1,useDefault:!1,hasChanged:be};Symbol.metadata??=Symbol("metadata"),ve.litPropertyMetadata??=new WeakMap;var F=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=yt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(r,t,e);s!==void 0&&Lr(this.prototype,r,s)}}static getPropertyDescriptor(r,e,t){let{get:s,set:a}=Nr(this.prototype,r)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let l=s?.call(this);a?.call(this,o),this.requestUpdate(r,l,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??yt}static _$Ei(){if(this.hasOwnProperty(oe("elementProperties")))return;let r=Hr(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(oe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(oe("properties"))){let e=this.properties,t=[...Br(e),...jr(e)];for(let s of t)this.createProperty(s,e[s])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let s of t)e.unshift(We(s))}else r!==void 0&&e.push(We(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bt(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),s=this.constructor._$Eu(r,t);if(s!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:ne).toAttribute(e,t.type);this._$Em=r,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(r,e){let t=this.constructor,s=t._$Eh.get(r);if(s!==void 0&&this._$Em!==s){let a=t.getPropertyOptions(s),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:ne;this._$Em=s;let l=o.fromAttribute(e,a.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(r,e,t,s=!1,a){if(r!==void 0){let o=this.constructor;if(s===!1&&(a=this[r]),t??=o.getPropertyOptions(r),!((t.hasChanged??be)(a,e)||t.useDefault&&t.reflect&&a===this._$Ej?.get(r)&&!this.hasAttribute(o._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:s,wrapped:a},o){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,o??e??this[r]),a!==!0||o!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),s===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,a]of t){let{wrapped:o}=a,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,a,l)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};F.elementStyles=[],F.shadowRootOptions={mode:"open"},F[oe("elementProperties")]=new Map,F[oe("finalized")]=new Map,Ur?.({ReactiveElement:F}),(ve.reactiveElementVersions??=[]).push("2.1.2");var Ge=globalThis,xt=i=>i,we=Ge.trustedTypes,$t=we?we.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ke="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,Ve="?"+L,Wr=`<${Ve}>`,W=document,ce=()=>W.createComment(""),de=i=>i===null||typeof i!="object"&&typeof i!="function",Ye=Array.isArray,Ct=i=>Ye(i)||typeof i?.[Symbol.iterator]=="function",qe=`[ 	
\f\r]`,le=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,kt=/-->/g,_t=/>/g,I=RegExp(`>|${qe}(?:([^\\s"'>=/]+)(${qe}*=${qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),St=/'/g,Et=/"/g,Tt=/^(?:script|style|textarea|title)$/i,Xe=i=>(r,...e)=>({_$litType$:i,strings:r,values:e}),n=Xe(1),O=Xe(2),Ts=Xe(3),q=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),At=new WeakMap,U=W.createTreeWalker(W,129);function zt(i,r){if(!Ye(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return $t!==void 0?$t.createHTML(r):r}var Rt=(i,r)=>{let e=i.length-1,t=[],s,a=r===2?"<svg>":r===3?"<math>":"",o=le;for(let l=0;l<e;l++){let d=i[l],h,u,g=-1,v=0;for(;v<d.length&&(o.lastIndex=v,u=o.exec(d),u!==null);)v=o.lastIndex,o===le?u[1]==="!--"?o=kt:u[1]!==void 0?o=_t:u[2]!==void 0?(Tt.test(u[2])&&(s=RegExp("</"+u[2],"g")),o=I):u[3]!==void 0&&(o=I):o===I?u[0]===">"?(o=s??le,g=-1):u[1]===void 0?g=-2:(g=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?I:u[3]==='"'?Et:St):o===Et||o===St?o=I:o===kt||o===_t?o=le:(o=I,s=void 0);let b=o===I&&i[l+1].startsWith("/>")?" ":"";a+=o===le?d+Wr:g>=0?(t.push(h),d.slice(0,g)+Ke+d.slice(g)+L+b):d+L+(g===-2?l:b)}return[zt(i,a+(i[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},he=class i{constructor({strings:r,_$litType$:e},t){let s;this.parts=[];let a=0,o=0,l=r.length-1,d=this.parts,[h,u]=Rt(r,e);if(this.el=i.createElement(h,t),U.currentNode=this.el.content,e===2||e===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(s=U.nextNode())!==null&&d.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let g of s.getAttributeNames())if(g.endsWith(Ke)){let v=u[o++],b=s.getAttribute(g).split(L),k=/([.?@])?(.*)/.exec(v);d.push({type:1,index:a,name:k[2],strings:b,ctor:k[1]==="."?xe:k[1]==="?"?$e:k[1]==="@"?ke:K}),s.removeAttribute(g)}else g.startsWith(L)&&(d.push({type:6,index:a}),s.removeAttribute(g));if(Tt.test(s.tagName)){let g=s.textContent.split(L),v=g.length-1;if(v>0){s.textContent=we?we.emptyScript:"";for(let b=0;b<v;b++)s.append(g[b],ce()),U.nextNode(),d.push({type:2,index:++a});s.append(g[v],ce())}}}else if(s.nodeType===8)if(s.data===Ve)d.push({type:2,index:a});else{let g=-1;for(;(g=s.data.indexOf(L,g+1))!==-1;)d.push({type:7,index:a}),g+=L.length-1}a++}}static createElement(r,e){let t=W.createElement("template");return t.innerHTML=r,t}};function G(i,r,e=i,t){if(r===q)return r;let s=t!==void 0?e._$Co?.[t]:e._$Cl,a=de(r)?void 0:r._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),a===void 0?s=void 0:(s=new a(i),s._$AT(i,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(r=G(i,s._$AS(i,r.values),s,t)),r}var ye=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,s=(r?.creationScope??W).importNode(e,!0);U.currentNode=s;let a=U.nextNode(),o=0,l=0,d=t[0];for(;d!==void 0;){if(o===d.index){let h;d.type===2?h=new X(a,a.nextSibling,this,r):d.type===1?h=new d.ctor(a,d.name,d.strings,this,r):d.type===6&&(h=new _e(a,this,r)),this._$AV.push(h),d=t[++l]}o!==d?.index&&(a=U.nextNode(),o++)}return U.currentNode=W,s}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},X=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=G(this,r,e),de(r)?r===c||r==null||r===""?(this._$AH!==c&&this._$AR(),this._$AH=c):r!==this._$AH&&r!==q&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Ct(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==c&&de(this._$AH)?this._$AA.nextSibling.data=r:this.T(W.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,s=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=he.createElement(zt(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let a=new ye(s,this),o=a.u(this.options);a.p(e),this.T(o),this._$AH=a}}_$AC(r){let e=At.get(r.strings);return e===void 0&&At.set(r.strings,e=new he(r)),e}k(r){Ye(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let a of r)s===e.length?e.push(t=new i(this.O(ce()),this.O(ce()),this,this.options)):t=e[s],t._$AI(a),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=xt(r).nextSibling;xt(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},K=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,s,a){this.type=1,this._$AH=c,this._$AN=void 0,this.element=r,this.name=e,this._$AM=s,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=c}_$AI(r,e=this,t,s){let a=this.strings,o=!1;if(a===void 0)r=G(this,r,e,0),o=!de(r)||r!==this._$AH&&r!==q,o&&(this._$AH=r);else{let l=r,d,h;for(r=a[0],d=0;d<a.length-1;d++)h=G(this,l[t+d],e,d),h===q&&(h=this._$AH[d]),o||=!de(h)||h!==this._$AH[d],h===c?r=c:r!==c&&(r+=(h??"")+a[d+1]),this._$AH[d]=h}o&&!s&&this.j(r)}j(r){r===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},xe=class extends K{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===c?void 0:r}},$e=class extends K{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==c)}},ke=class extends K{constructor(r,e,t,s,a){super(r,e,t,s,a),this.type=5}_$AI(r,e=this){if((r=G(this,r,e,0)??c)===q)return;let t=this._$AH,s=r===c&&t!==c||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,a=r!==c&&(t===c||s);s&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},_e=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){G(this,r)}},Mt={M:Ke,P:L,A:Ve,C:1,L:Rt,R:ye,D:Ct,V:G,I:X,H:K,N:$e,U:ke,B:xe,F:_e},qr=Ge.litHtmlPolyfillSupport;qr?.(he,X),(Ge.litHtmlVersions??=[]).push("3.3.3");var Pt=(i,r,e)=>{let t=e?.renderBefore??r,s=t._$litPart$;if(s===void 0){let a=e?.renderBefore??null;t._$litPart$=s=new X(r.insertBefore(ce(),a),a,void 0,e??{})}return s._$AI(i),s};var Qe=globalThis,C=class extends F{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=Pt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};C._$litElement$=!0,C.finalized=!0,Qe.litElementHydrateSupport?.({LitElement:C});var Gr=Qe.litElementPolyfillSupport;Gr?.({LitElement:C});(Qe.litElementVersions??=[]).push("4.2.2");var Kr={attribute:!0,type:String,converter:ne,reflect:!1,hasChanged:be},Vr=(i=Kr,r,e)=>{let{kind:t,metadata:s}=e,a=globalThis.litPropertyMetadata.get(s);if(a===void 0&&globalThis.litPropertyMetadata.set(s,a=new Map),t==="setter"&&((i=Object.create(i)).wrapped=!0),a.set(e.name,i),t==="accessor"){let{name:o}=e;return{set(l){let d=r.get.call(this);r.set.call(this,l),this.requestUpdate(o,d,i,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(t==="setter"){let{name:o}=e;return function(l){let d=this[o];r.call(this,l),this.requestUpdate(o,d,i,!0,l)}}throw Error("Unsupported decorator location: "+t)};function x(i){return(r,e)=>typeof e=="object"?Vr(i,r,e):((t,s,a)=>{let o=s.hasOwnProperty(a);return s.constructor.createProperty(a,t),o?Object.getOwnPropertyDescriptor(s,a):void 0})(i,r,e)}function m(i){return x({...i,state:!0,attribute:!1})}function Ft(i,r){let e=i.reduce((h,u)=>h+u,0)/(i.length||1),t=h=>12*(i[h]+i[h+1])/2/e,s=0,a=0;for(let[h,u]of i.entries()){let g=a+(h?t(h-1):0)+u;if(g>r)break;a=g,s=h+1}let o=Array.from({length:Math.max(s-1,0)},(h,u)=>t(u)),l=r-a,d=o.map((h,u)=>u);for(;l>.5&&d.length;){let h=d.reduce((g,v)=>g+t(v),0),u=l;l=0,d=d.filter(g=>{let v=t(g)*10,b=o[g]+u*t(g)/h;return o[g]=Math.min(b,v),l+=b-o[g],o[g]<v})}return{count:s,gaps:o.map(h=>Math.round(h*10)/10)}}var Yr="{?}";function Lt(i,r){return{device_id:i,set_number:r.set_number,owned:!r.owned,...!r.owned&&r.wanted?{wanted:!1}:{}}}function Nt(i,r){return{device_id:i,set_number:r.set_number,wanted:!r.wanted}}function Bt(i){return{device_id:i}}function z(i,r){return r?{type:i,config_entry_id:r}:{type:i}}function jt(i,r){if(!i)return"Not synced yet";let e=Math.floor((r.getTime()-new Date(i).getTime())/6e4);if(e<1)return"Updated just now";let t=new Intl.RelativeTimeFormat("en",{numeric:"always"});if(e<60)return`Updated ${t.format(-e,"minute")}`;let s=Math.floor(e/60);return s<48?`Updated ${t.format(-s,"hour")}`:`Updated ${t.format(-Math.floor(s/24),"day")}`}function et(i,r,e,t=!1){return i==null||!r?"":new Intl.NumberFormat(e,{style:"currency",currency:r,...t?{maximumFractionDigits:0}:{}}).format(i)}function E(i){return i instanceof Error?i.message:i&&typeof i=="object"&&"message"in i?String(i.message):String(i)}function Ht(i){let r=[];for(let e of i){let t=e.state??e.mean;t!=null&&r.push({t:new Date(e.start).getTime(),v:t})}return r}function It(i,r,e=6){let t=[...i].filter(o=>o[r]>0).sort((o,l)=>l[r]-o[r]),s=t.slice(0,e).map(o=>({theme:o.theme,amount:o[r],sets:o.sets,setNumbers:o.set_numbers??[],other:!1})),a=t.slice(e);return a.length&&s.push({theme:`Other (${A(a.length,"theme","themes")})`,amount:a.reduce((o,l)=>o+l[r],0),sets:a.reduce((o,l)=>o+l.sets,0),setNumbers:a.flatMap(o=>o.set_numbers??[]).sort(),other:!0}),s}function A(i,r,e){return`${i.toLocaleString()} ${i===1?r:e}`}var Je=100;function Ut(i,r,e){let t=Je-r;return[`${i} of today's ${r} calls used.`,t>0?`The other ${t} of the ${Je} Brickset allows each API key a day are left unused, for anything else on your key.`:`Your budget is all ${Je} calls Brickset allows each API key a day.`,`The count starts again at ${e}.`].join(" ")}var Xr=60;function Wt(i,r,e="retirement"){if(e==="release"&&i.available_from)return new Date(i.available_from)>r?"due":"";if(i.available_until){let t=new Date(i.available_until).getTime();return t<r.getTime()?"retired":(t-r.getTime())/864e5<=Xr?"retiring":""}return i.available_from&&new Date(i.available_from)>r?"due":""}function qt(i,r,e,t="retirement"){return i.partial?"Details not loaded":t==="release"&&i.available_from?`${new Date(i.available_from)>r?"Due":"Out"} ${e(i.available_from)}`:i.available_until?`${new Date(i.available_until)<r?"Retired":"Retires"} ${e(i.available_until)}`:i.available_from?`${new Date(i.available_from)>r?"Due":"Out"} ${e(i.available_from)}`:pe(i)?"Date unknown":"Details tbd"}function Ee(i){if(!i)return null;try{let r=new URL(i);return r.protocol==="https:"||r.protocol==="http:"?r.href:null}catch{return null}}var tt="/api/lego/image/";function Dt(i){return i?.startsWith(tt)?i:Ee(i)}var Ae=["small","medium","large"],Ce={small:"Small",medium:"Medium",large:"Large"},Qr={small:140,medium:280,large:420},Jr=240,Zr=690;function Te(i){if(i==="on")return!0;if(i==="off")return!1}function Gt(i,r="small",e=!0){let t=Dt(i.image),s=e?Dt(i.image_large):null,a=Ee(i.image_remote);return{src:t,sharp:t&&s?{srcset:`${t} ${Jr}w, ${s} ${Zr}w`,sizes:`${Qr[r]}px`}:null,fallback:a&&a!==t?a:null}}function pe(i){let r=(i.name??"").trim();return r!==""&&r!==Yr}function H(i){return pe(i)?i.name:"Name tbd"}var es={around:"Now",year:"This year",past3:"Past 3 months",past1:"Past month",next1:"Next month",next3:"Next 3 months",coming:"Unreleased"},Kt={around:"Three months either side of today",year:"January to December",coming:"Every set announced and not yet out, with a date or without"};function j(i,r=new Date){return i==="year"?String(r.getFullYear()):es[i]}function Vt(i,r){return!r||M[i].includes(r)?"":`This row offers ${M[i].map(t=>j(t)).join(", ")}, not ${j(r)}.`}var M={releases:["past3","around","year","coming"],themes:["past3","around","year","coming"],recent:["past3"],upcoming:["coming"]},ts={recent:"all",upcoming:"all",themes:"mine"};function Q(i,r){let e=r.release_filters?.[i]??{},t=r.release_status.all!==null,s=ts[i],a=r.followed.length||!t?"mine":"all",o=s??e.scope??a;o==="all"&&!t&&(o="mine");let l=new Set(r.followed.map(g=>g.toLowerCase())),d=o==="mine"?(e.themes??[]).filter(g=>l.has(g.toLowerCase())):[],h=M[i],u=e.span&&h.includes(e.span)?e.span:i==="upcoming"?"coming":i==="recent"?"past3":"around";return{scope:o,themes:d,span:u}}function ze(i,r,e){let t=i.includes(r)?i.filter(s=>s!==r):[...i,r];return t.length===e.length?[]:t}var B=15,rs=3,Ze=2,Ot=.25;function Yt(i,r,e){if(!e)return{from:0,to:B,width:1};let t=Math.max(i-Ot,0),s=Math.min(r+Ot,B),a=Ze-(s-t);return a>0&&(t=Math.max(t-a/2,0),s=Math.min(t+Ze,B),t=Math.max(s-Ze,0)),{from:t,to:s,width:Math.max((s-t)/rs,1)}}function J(i,r){let e=typeof r=="string"?new Date(`${r.slice(0,10)}T00:00:00`):r,t=(e.getFullYear()-i.getFullYear())*12+e.getMonth()-i.getMonth(),s=new Date(e.getFullYear(),e.getMonth()+1,0).getDate();return t+(e.getDate()-1)/s}function Xt(i,r,e=.15,t=4){let s=[];for(let a of[...i].sort((o,l)=>o.date.localeCompare(l.date))){let o=J(r,a.date);if(o<0||o>B)continue;let l=s[s.length-1];l&&o-l.at<=e?l.points.push(a):s.push({at:o,points:[a]})}return s.map(a=>{let o=a.points.length>t?t-1:t;return{at:a.at,themes:a.points.slice(0,o).map(l=>l.theme),extra:Math.max(a.points.length-o,0),points:a.points}})}function Qt(i,r,e){return i>0?e*r/i:.15}function rt(i,r=5){return Array.from({length:i},(e,t)=>(t-(i-1)/2)*r)}var ss=["recent","upcoming","themes"];function st(i,r){let e=r==="combined"?ss:["releases"];return i.filter(t=>!e.includes(t))}function Jt(i,r,e,t){let s=r[r.indexOf(e)+t];if(!s)return i;let a=i.filter(o=>o!==e);return a.splice(a.indexOf(s)+(t>0?1:0),0,e),a}var Re=new Map,V="lego-invalidated";function tr(i,r){let e=Re.get(r);return e||(e=i.callWS(z("lego/dashboard",r)),Re.set(r,e),e.catch(()=>Re.delete(r))),e}function Z(){Re.clear(),window.dispatchEvent(new Event(V))}function is(i=import.meta.url){try{return new URL(i).searchParams.get("v")}catch{return null}}function rr(i,r=import.meta.url){let e=is(r);return!!i&&!!e&&i!==e}var Zt=new WeakSet;function Me(i){let r=i.connection;!r||Zt.has(r)||(Zt.add(r),r.addEventListener("ready",Z))}var as=6e4,er=Number.NEGATIVE_INFINITY;function sr(i=Date.now()){return i-er<as?!1:(er=i,Z(),!0)}function ir(i,r,e){return i.callWS({...z("lego/releases",r),scope:e.scope,themes:e.themes,span:e.span})}var ar=i=>(...r)=>({_$litDirective$:i,values:r}),Pe=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,e,t){this._$Ct=r,this._$AM=e,this._$Ci=t}_$AS(r,e){return this.update(r,e)}update(r,e){return this.render(...e)}};var{I:yi}=Mt;var os={},or=(i,r=os)=>i._$AH=r;var nr=ar(class extends Pe{constructor(){super(...arguments),this.key=c}render(i,r){return this.key=i,r}update(i,[r,e]){return r!==this.key&&(or(i),this.key=r),e}});var lr={tag:"svg",attrs:{viewBox:"0.50 1.19 99.00 99.00"},children:[{tag:"polygon",attrs:{points:"4.000,34.558 50.000,61.116 50.000,93.389 4.000,66.831",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 88%, black)"}},{tag:"polygon",attrs:{points:"50.000,61.116 96.000,34.558 96.000,66.831 50.000,93.389",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 59%, black)"}},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 50.000,61.116 4.000,34.558",style:"fill:var(--primary-color, #009ac7)"}},{tag:"g",attrs:{"stroke-width":"0.5",fill:"none","stroke-linecap":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M4.000,34.558 L50.000,61.116 L96.000,34.558"}},{tag:"path",attrs:{d:"M50.000,61.116 L50.000,93.389"}}]},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 96.000,66.831 50.000,93.389 4.000,66.831 4.000,34.558",fill:"none","stroke-width":"2.0","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"}},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,16.236 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"16.236",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M18.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"27.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M64.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"73.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,42.794 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"42.794",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{transform:"translate(11.596,34.314) scale(0.12837)"},children:[{tag:"g",attrs:{stroke:"#FFFFFF","stroke-width":"17.0","stroke-linecap":"round",fill:"none"},children:[{tag:"line",attrs:{x1:"120.00",y1:"153.05",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"60.00",y1:"214.40",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"180.00",y1:"249.69",x2:"120.00",y2:"275.05"}}]},{tag:"g",attrs:{fill:"#FFFFFF"},children:[{tag:"circle",attrs:{cx:"120.00",cy:"153.05",r:"19.38"}},{tag:"circle",attrs:{cx:"60.00",cy:"214.40",r:"19.38"}},{tag:"circle",attrs:{cx:"180.00",cy:"249.69",r:"19.38"}}]}]}]},it=[{part:"3005",size:"1x1",colour:"Red",width:38.44,svg:{tag:"svg",attrs:{viewBox:"0 0 38.44 55.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 19.220,29.723 19.220,54.027 1.900,44.027",fill:"#B01708"}},{tag:"polygon",attrs:{points:"19.220,29.723 36.540,19.723 36.540,44.027 19.220,54.027",fill:"#770F05"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 19.220,29.723 1.900,19.723",fill:"#C91A09"}},{tag:"path",attrs:{d:"M1.90,19.72 L19.22,29.72 L36.54,19.72 M19.22,29.72 L19.22,54.03",stroke:"#550B04","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 36.540,44.027 19.220,54.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#550B04","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#550B04","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#A11507",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F01F0B",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3004",size:"1x2",colour:"Orange",width:55.76,svg:{tag:"svg",attrs:{viewBox:"0 0 55.76 65.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 36.540,39.723 36.540,64.027 1.900,44.027",fill:"#F27901"}},{tag:"polygon",attrs:{points:"36.540,39.723 53.860,29.723 53.860,54.027 36.540,64.027",fill:"#A45201"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 36.540,39.723 1.900,19.723",fill:"#FE8A18"}},{tag:"path",attrs:{d:"M1.90,19.72 L36.54,39.72 L53.86,29.72 M36.54,39.72 L36.54,64.03",stroke:"#763B01","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 53.860,54.027 36.540,64.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#763B01","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3010",size:"1x4",colour:"Yellow",width:90.4,svg:{tag:"svg",attrs:{viewBox:"0 0 90.40 85.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 71.180,59.723 71.180,84.027 1.900,44.027",fill:"#F0C414"}},{tag:"polygon",attrs:{points:"71.180,59.723 88.500,49.723 88.500,74.027 71.180,84.027",fill:"#A6870B"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 71.180,59.723 1.900,19.723",fill:"#F2CD37"}},{tag:"path",attrs:{d:"M1.90,19.72 L71.18,59.72 L88.50,49.72 M71.18,59.72 L71.18,84.03",stroke:"#766108","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 88.500,74.027 71.180,84.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#766108","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3001",size:"2x4",colour:"Green",width:107.72,svg:{tag:"svg",attrs:{viewBox:"0 0 107.72 95.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 71.180,69.723 71.180,94.027 1.900,54.027",fill:"#1F6939"}},{tag:"polygon",attrs:{points:"71.180,69.723 105.820,49.723 105.820,74.027 71.180,94.027",fill:"#154727"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 71.180,69.723 1.900,29.723",fill:"#237841"}},{tag:"path",attrs:{d:"M1.90,29.72 L71.18,69.72 L105.82,49.72 M71.18,69.72 L71.18,94.03",stroke:"#0F331C","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 105.820,74.027 71.180,94.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#0F331C","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3009",size:"1x6",colour:"Dark Azure",width:125.04,svg:{tag:"svg",attrs:{viewBox:"0 0 125.04 105.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 105.820,79.723 105.820,104.027 1.900,44.027",fill:"#067AB0"}},{tag:"polygon",attrs:{points:"105.820,79.723 123.140,69.723 123.140,94.027 105.820,104.027",fill:"#045377"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 105.820,79.723 1.900,19.723",fill:"#078BC9"}},{tag:"path",attrs:{d:"M1.90,19.72 L105.82,79.72 L123.14,69.72 M105.82,79.72 L105.82,104.03",stroke:"#033B55","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 123.140,94.027 105.820,104.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#033B55","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"2456",size:"2x6",colour:"Blue",width:142.36,svg:{tag:"svg",attrs:{viewBox:"0 0 142.36 115.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 105.820,89.723 105.820,114.027 1.900,54.027",fill:"#004AA7"}},{tag:"polygon",attrs:{points:"105.820,89.723 140.460,69.723 140.460,94.027 105.820,114.027",fill:"#003271"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 105.820,89.723 1.900,29.723",fill:"#0055BF"}},{tag:"path",attrs:{d:"M1.90,29.72 L105.82,89.72 L140.46,69.72 M105.82,89.72 L105.82,114.03",stroke:"#002451","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 140.460,94.027 105.820,114.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#002451","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3008",size:"1x8",colour:"Dark Purple",width:159.68,svg:{tag:"svg",attrs:{viewBox:"0 0 159.68 125.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 140.460,99.723 140.460,124.027 1.900,44.027",fill:"#372F7F"}},{tag:"polygon",attrs:{points:"140.460,99.723 157.780,89.723 157.780,114.027 140.460,124.027",fill:"#252056"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 140.460,99.723 1.900,19.723",fill:"#3F3691"}},{tag:"path",attrs:{d:"M1.90,19.72 L140.46,99.72 L157.78,89.72 M140.46,99.72 L140.46,124.03",stroke:"#1B173E","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 157.780,114.027 140.460,124.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#1B173E","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M116.43,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"123.14",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M133.75,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"140.46",cy:"85.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3007",size:"2x8",colour:"Medium Lavender",width:177,svg:{tag:"svg",attrs:{viewBox:"0 0 177.00 135.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 140.460,109.723 140.460,134.027 1.900,54.027",fill:"#9D5FAD"}},{tag:"polygon",attrs:{points:"140.460,109.723 175.100,89.723 175.100,114.027 140.460,134.027",fill:"#6C3D78"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 140.460,109.723 1.900,29.723",fill:"#AC78BA"}},{tag:"path",attrs:{d:"M1.90,29.72 L140.46,109.72 L175.10,89.72 M140.46,109.72 L140.46,134.03",stroke:"#4D2C56","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 175.100,114.027 140.460,134.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#4D2C56","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M151.07,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"157.78",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,95.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"95.93",rx:"6.71",ry:"3.87"}}]}]}}];function De(i){return n`<svg
    viewBox=${i.attrs.viewBox??c}
    aria-hidden="true"
    focusable="false"
  >
    ${(i.children??[]).map(cr)}
  </svg>`}function cr(i){let r=t=>i.attrs[t]??c,e=()=>(i.children??[]).map(cr);switch(i.tag){case"g":return O`<g transform=${r("transform")} fill=${r("fill")} stroke=${r("stroke")}
        stroke-width=${r("stroke-width")} stroke-linecap=${r("stroke-linecap")}
        stroke-linejoin=${r("stroke-linejoin")} style=${r("style")}>${e()}</g>`;case"polygon":return O`<polygon points=${r("points")} fill=${r("fill")} stroke=${r("stroke")}
        stroke-width=${r("stroke-width")} stroke-linejoin=${r("stroke-linejoin")}
        style=${r("style")}></polygon>`;case"path":return O`<path d=${r("d")} fill=${r("fill")} stroke=${r("stroke")}
        stroke-width=${r("stroke-width")} stroke-linecap=${r("stroke-linecap")}
        stroke-linejoin=${r("stroke-linejoin")} style=${r("style")}></path>`;case"ellipse":return O`<ellipse cx=${r("cx")} cy=${r("cy")} rx=${r("rx")} ry=${r("ry")}
        fill=${r("fill")} style=${r("style")}></ellipse>`;case"circle":return O`<circle cx=${r("cx")} cy=${r("cy")} r=${r("r")} fill=${r("fill")}
        style=${r("style")}></circle>`;case"line":return O`<line x1=${r("x1")} y1=${r("y1")} x2=${r("x2")} y2=${r("y2")}
        stroke=${r("stroke")} stroke-width=${r("stroke-width")}
        style=${r("style")}></line>`;default:return c}}var ns=.54,dr=it.map(i=>Math.round(i.width*ns)),ue=class extends C{constructor(){super(...arguments);this.width=0}connectedCallback(){super.connectedCallback(),this.observer=new ResizeObserver(([e])=>{this.width=Math.floor(e.contentRect.width)}),this.observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.observer?.disconnect()}render(){let{count:e,gaps:t}=Ft(dr,this.width);return n`<div class="bricks" aria-hidden="true">
      ${it.slice(0,e).map((s,a)=>n`<div style="width:${dr[a]}px;margin-right:${t[a]??0}px">
            ${De(s.svg)}
          </div>`)}
    </div>`}};ue.styles=$`
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
  `,p([m()],ue.prototype,"width",2);customElements.get("lego-bricks")||customElements.define("lego-bricks",ue);var Oe=$`
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
`,hr=1,ls=2,pr=3,at=4,cs=5,ot=6,ur=7,gr=8,ds={"star wars":hr,botanicals:ot,"botanical collection":ot,icons:at,"creator expert":at,technic:ur,"harry potter":gr,city:pr},hs=[ls,cs,hr,pr,at,ot,ur,gr];function ee(i){let r=new Map,e=new Set;for(let t of i){let s=ds[t.toLowerCase()];s&&!e.has(s)&&(r.set(t,s),e.add(s))}for(let t of i){if(r.has(t))continue;let s=hs.find(a=>!e.has(a));s===void 0?r.set(t,"other"):(r.set(t,s),e.add(s))}return r}function te(i){return i===void 0||i==="other"?"var(--lego-series-other)":`var(--lego-series-${i})`}function mr(i){let r=!i.owned;return{owned:r,qty_owned:r?Math.max(i.qty_owned,1):0}}function fr(i){return i.filter(r=>r.partial).map(r=>r.set_number)}function vr(i,r){return!!i&&!!r&&i.entry_id===r.entry_id}function Fe(i){return i.trim().length>=2}function br(i,r){let e=i.some(t=>!r[t]);return{anyOpen:e,next:Object.fromEntries(i.map(t=>[t,e]))}}function wr(i){return{share:Math.min(i.calls_today/(i.budget||1),1),tight:i.remaining<i.refresh_cost*3}}function yr(i){let r=i.mine&&i.open,e=i.wiggling?"done":r||!i.followed?"edit":"none";return{themes:r,trailing:e}}function xr(i,r){return i?{open:!r,pick:!1}:{open:!1,pick:!0}}function $r(i,r){return i?"spent":r?"ignored":"pick"}var re=$`
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
`,Le=$`
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
`,se=$`
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
  /* Asks a window still running an older bundle to reload. */
  .updated {
    align-items: center;
    background: var(--lego-pick);
    border-radius: var(--ha-border-radius-md, 8px);
    display: flex;
    flex-wrap: wrap;
    font-size: var(--ha-font-size-m, 14px);
    gap: 0 var(--ha-space-2, 8px);
    justify-content: space-between;
    padding: 0 var(--ha-space-2, 8px) 0 var(--ha-space-4, 16px);
  }
`,kr=$`
  /* Medium and large draw the picture two and three times the size; the card
     widens with it, and never past the row on a narrow screen. */
  :host {
    --lego-card-w: 156px;
    --lego-pic-h: 104px;
    --lego-stamp: 10px;
  }
  :host([picture-size="medium"]) {
    --lego-card-w: 296px;
    --lego-pic-h: 208px;
    --lego-stamp: 13px;
  }
  :host([picture-size="large"]) {
    --lego-card-w: 436px;
    --lego-pic-h: 312px;
    --lego-stamp: 16px;
  }
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
    flex: 0 0 min(var(--lego-card-w), 85%);
    scroll-snap-align: start;
  }
  .grid {
    display: grid;
    gap: var(--ha-space-3, 12px);
    grid-template-columns: repeat(
      auto-fill,
      minmax(min(var(--lego-card-w), 100%), 1fr)
    );
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
    position: relative;
  }
  /* A rubber stamp pressed onto the picture's corner: a ruled border, spaced
     capitals and a tilt. */
  .stamp,
  .seal {
    /* Ink on paper in either theme: the photo behind is white, or the dark edge
       of the picture box, and only a paper backing reads on both. Paper and ink
       are both solid, so nothing in the photo shows through either. */
    --lego-stamp-ink: #b3121b;
    --lego-stamp-paper: #fffaf3;
  }
  .stamp {
    background: var(--lego-stamp-paper);
    border: 0.18em solid currentColor;
    border-radius: 0.35em;
    color: var(--lego-stamp-ink);
    font-size: var(--lego-stamp);
    font-weight: var(--ha-font-weight-bold, 700);
    letter-spacing: 0.16em;
    line-height: 1;
    padding: 0.35em 0.45em 0.3em 0.6em;
    pointer-events: none;
    position: absolute;
    left: calc(var(--ha-space-2, 8px) + 0.9em);
    text-transform: uppercase;
    top: calc(var(--ha-space-2, 8px) + 1.1em);
    transform: rotate(-9deg);
  }
  /* A round date stamp in the opposite corner, in black, on a wanted set that
     has left sale: a double ring, the word, and the year. */
  .seal {
    --lego-stamp-ink: #161616;
    align-content: center;
    background: var(--lego-stamp-paper);
    border: 0.16em solid currentColor;
    border-radius: 50%;
    box-shadow:
      inset 0 0 0 0.26em var(--lego-stamp-paper),
      inset 0 0 0 0.38em currentColor;
    box-sizing: border-box;
    color: var(--lego-stamp-ink);
    display: grid;
    font-size: var(--lego-stamp);
    font-weight: var(--ha-font-weight-bold, 700);
    gap: 0.12em;
    height: 5.6em;
    justify-items: center;
    line-height: 1;
    pointer-events: none;
    position: absolute;
    right: calc(var(--ha-space-2, 8px) + 0.3em);
    text-transform: uppercase;
    top: calc(var(--ha-space-2, 8px) + var(--lego-pic-h) - 6em);
    transform: rotate(12deg);
    width: 5.6em;
  }
  .seal span:first-child {
    font-size: 0.72em;
    letter-spacing: 0.08em;
  }
  .seal .year {
    font-size: 1.2em;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;
  }
  /* Set photos come on white; inset and rounded they read as photos rather
     than as gaps in a dark card. */
  .pic {
    background: var(--lego-ground);
    border-radius: var(--ha-border-radius-md, 8px);
    display: block;
    height: var(--lego-pic-h);
    margin: var(--ha-space-2, 8px) var(--ha-space-2, 8px) 0;
    overflow: hidden;
    position: relative;
  }
  .pic img {
    box-sizing: border-box;
    height: 100%;
    inset: 0;
    object-fit: contain;
    position: absolute;
    width: 100%;
  }
  /* The sharper copy fades in over the standard one once it has loaded. */
  .pic img.sharp {
    opacity: 0;
    transition: opacity 240ms ease-out;
  }
  .pic img.sharp.ready {
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    .pic img.sharp {
      transition: none;
    }
  }
  /* Stand-in art, so it must read as absent rather than as the set. */
  .pic img.noart {
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
  /* What a hold does, shown on hover: the native title tooltip is slow, and
     some browsers never show one at all. */
  .act::after {
    background: var(--lego-surface);
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--ha-border-radius-sm, 4px);
    bottom: calc(100% - var(--ha-space-1, 4px));
    color: var(--lego-text);
    content: attr(data-hint);
    font-size: var(--ha-font-size-s, 12px);
    max-width: calc(var(--lego-card-w) - var(--ha-space-6, 24px));
    opacity: 0;
    padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
    pointer-events: none;
    position: absolute;
    right: var(--ha-space-1, 4px);
    text-align: end;
    transition: opacity var(--ha-animation-duration-fast, 150ms);
    width: max-content;
  }
  @media (hover: hover) {
    .act:hover::after {
      opacity: 1;
      transition-delay: 400ms;
    }
  }
  /* The picture and the name can be held too, so neither selects nor opens a
     menu on a long press. */
  .pic,
  .name {
    -webkit-touch-callout: none;
    user-select: none;
  }
  /* Held, the ring inks in red over the half second that makes it a hold. */
  .act.holding::before {
    border-color: #b3121b;
  }
  @media (prefers-reduced-motion: no-preference) {
    .act.holding::before {
      animation: inking 500ms linear forwards;
    }
  }
  @keyframes inking {
    from {
      box-shadow: 0 0 0 0 #b3121b;
    }
    to {
      box-shadow: 0 0 0 3px #b3121b;
    }
  }
  /* A stamp a hold has just put there comes down onto the picture. */
  @media (prefers-reduced-motion: no-preference) {
    .stamp.landed {
      animation: land var(--ha-animation-duration-slow, 350ms) ease-in;
    }
  }
  @keyframes land {
    from {
      opacity: 0;
      transform: rotate(-9deg) scale(1.6);
    }
    70% {
      opacity: 1;
      transform: rotate(-9deg) scale(0.94);
    }
    to {
      transform: rotate(-9deg) scale(1);
    }
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
    min-height: 236px;
  }
  /* The bricks sit in a card like the sets beside them, open at the right edge, as
     if the row ran on past it. */
  .fillcard {
    background: var(--lego-surface);
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--lego-radius) 0 0 var(--lego-radius);
    border-right: 0;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--ha-space-4, 16px);
    justify-content: center;
    min-width: 0;
    padding: var(--ha-space-4, 16px) var(--ha-space-3, 12px);
  }
  /* After a short row of cards, the room the cards leave; none once they fill it. */
  .carousel .tail {
    align-self: stretch;
    container-type: inline-size;
    flex: 1 1 0;
    min-height: auto;
    min-width: 0;
  }
  /* Too little room for any bricks, so not even a sliver of empty card. */
  @container (max-width: 56px) {
    .tail .fillcard {
      display: none;
    }
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
`;var _r="/lego_panel/icon.png";function Ne(i){return rr(i?.version)?n`<div class="updated" role="status">
    <span>LEGO was updated. Reload to finish.</span>
    <button class="link" @click=${()=>location.reload()}>Reload</button>
  </div>`:c}function R(i,r){customElements.get(i)||customElements.define(i,r)}var ge="lego-changed",ps="lego-toggle",us="lego-move",Sr="lego-filter",nt=500,gs=".pic, .name, .act",ie={collection:{title:"My collection",icon:"mdi:toy-brick-outline"},releases:{title:"New releases",icon:"mdi:new-box"},recent:{title:"Out recently",icon:"mdi:new-box"},upcoming:{title:"Coming soon",icon:"mdi:calendar-clock"},themes:{title:"New in my themes",icon:"mdi:tag-heart-outline"},wishlist:{title:"My wishlist",icon:"mdi:heart-outline"},value:{title:"Collection value",icon:"mdi:chart-donut"},pieces:{title:"Pieces",icon:"mdi:shape-outline"}},w=class extends C{constructor(){super(...arguments);this.entryId="";this.collapsed=!1;this.handle=!1;this.bare=!1;this.dark=!1;this.pending=new Set;this.writeError="";this.wishing="";this.toggle=()=>{this.collapsed=!this.collapsed,this.dispatchEvent(new CustomEvent(ps,{detail:{row:this.row,collapsed:this.collapsed},bubbles:!0,composed:!0}))};this.onHandleKey=e=>{let t=e.key==="ArrowUp"?-1:e.key==="ArrowDown"?1:0;t&&(e.preventDefault(),this.dispatchEvent(new CustomEvent(us,{detail:{row:this.row,step:t},bubbles:!0,composed:!0})))};this.stamped=new Set;this.wished="";this.wishEnd=()=>{window.clearTimeout(this.wishTimer),this.wishFrom=void 0,this.wishing=""};this.holdMove=e=>{let t=this.wishFrom;t&&Math.hypot(e.clientX-t.x,e.clientY-t.y)>8&&this.wishEnd()};this.reveal=e=>{e.target.classList.add("ready")};this.dropSharp=e=>{e.target.remove()};this.noArt=e=>{let t=e.target;if(t.classList.contains("noart"))return;t.src.includes(tt)&&sr();let s=t.dataset.fallback;if(s&&t.src!==s){t.removeAttribute("srcset"),t.src=s;return}t.classList.add("noart"),t.removeAttribute("srcset"),t.src=_r}}actions(){return c}willUpdate(e){e.has("hass")&&(this.dark=!!this.hass?.themes?.darkMode),this.setAttribute("picture-size",this.size())}render(){let e=ie[this.row];return n`
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
                </button>`:c}
        </div>
        ${this.collapsed?c:this.body()}
        ${this.writeError?n`<p class="caveat bad" role="alert">
                Brickset would not save that change: ${this.writeError}
              </p>`:c}
      </section>
    `}focusHandle(){this.renderRoot.querySelector(".drag")?.focus()}date(e){let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short",year:"numeric"})}num(e){return e.toLocaleString(this.hass?.locale?.language)}money(e,t=!0){return et(e,this.dash?.currency??null,this.hass?.locale?.language,t)||this.num(Math.round(e))}toggleOwned(e){let t=Lt(this.dash?.device_id??"",e);return this.write(e,t,{...mr(e),..."wanted"in t?{wanted:!1}:{}})}toggleWanted(e){return e.wanted||this.stamped.add(e.set_number),this.write(e,Nt(this.dash?.device_id??"",e),{wanted:!e.wanted})}async write(e,t,s){if(!this.pending.has(e.set_number)){this.writeError="",this.setPending(e.set_number,!0);try{await this.hass.callService("lego","set_collection",t)}catch(a){this.writeError=E(a),this.stamped.delete(e.set_number);return}finally{this.setPending(e.set_number,!1)}Object.assign(e,s),this.requestUpdate(),this.dispatchEvent(new CustomEvent(ge,{bubbles:!0,composed:!0}))}}wishStart(e){window.clearTimeout(this.wishTimer),this.wished="",this.wishing=e.set_number,this.wishTimer=window.setTimeout(()=>{this.wished=e.set_number,this.wishing="",this.toggleWanted(e)},nt)}holdDown(e,t){let s=e.composedPath()[0];e.button!==0||!s.closest?.(gs)||(this.wishFrom={x:e.clientX,y:e.clientY},this.wishStart(t))}holdClick(e,t){this.wished===t.set_number&&(this.wished="",e.preventDefault(),e.stopPropagation())}setPending(e,t){let s=new Set(this.pending);t?s.add(e):s.delete(e),this.pending=s}linked(e,t,s=!1){let a=Ee(e.url);return a?n`<a
      class="open"
      href=${a}
      target="_blank"
      rel="noopener noreferrer"
      tabindex=${s?"-1":c}
      aria-hidden=${s?"true":c}
      >${t}</a
    >`:t}themeColour(e){let t=this.dash?.followed??[],s=t.find(a=>a.toLowerCase()===e.toLowerCase());return te(s?ee(t).get(s):"other")}size(){return this.pictureSize??this.dash?.picture_size??"medium"}sharp(){return this.sharpPictures??this.dash?.sharp_pictures??!1}card(e,t="retirement",s,a=!0){let o=new Date,l=e.available_until?new Date(e.available_until):null,d=l&&l<o?l:null,h=Gt(e,this.size(),this.sharp()),u=h.src??h.fallback,g=a?et(e.retail_price,this.dash?.currency??null,this.hass?.locale?.language):"",v=e.wanted?"Hold to take off your wishlist":"Hold to add to your wishlist";return n`
      <article
        class="card"
        @pointerdown=${b=>this.holdDown(b,e)}
        @pointermove=${this.holdMove}
        @pointerup=${this.wishEnd}
        @pointercancel=${this.wishEnd}
        @dragstart=${this.wishEnd}
        @click=${{handleEvent:b=>this.holdClick(b,e),capture:!0}}
        @contextmenu=${b=>{(this.wishing||this.wished)&&b.preventDefault()}}
      >
        ${this.linked(e,n`${nr(e.set_number,n`<span class="pic"
              >${u?n`<img
                      src=${u}
                      data-fallback=${h.fallback??c}
                      alt=""
                      loading="lazy"
                      @error=${this.noArt}
                    />`:n`<img
                      class="noart"
                      src=${_r}
                      alt=""
                      loading="lazy"
                    />`}${h.sharp?n`<img
                      class="sharp"
                      srcset=${h.sharp.srcset}
                      sizes=${h.sharp.sizes}
                      alt=""
                      loading="lazy"
                      @load=${this.reveal}
                      @error=${this.dropSharp}
                    />`:c}</span
            >`)}`,!0)}
        ${e.wanted?n`<span
                class=${this.stamped.has(e.set_number)?"stamp landed":"stamp"}
                >Wanted</span
              >`:c}
        ${e.wanted&&d?n`<span class="seal"
                ><span>Retired</span
                ><span class="year">${d.getFullYear()}</span></span
              >`:c}
        <div class="meta">
          ${this.linked(e,n`<span
              class=${pe(e)?"name":"name unnamed"}
              title=${pe(e)?e.name:"Brickset has not published a name yet"}
              >${H(e)}</span
            >`)}
          <span class="num"
            >${s?n`<span
                    class="key"
                    style="background:${s}"
                    title=${e.theme}
                  ></span>`:c}${[e.set_number,g].filter(Boolean).join(" \xB7 ")}</span
          >
          <span class="when ${Wt(e,o,t)}"
            >${qt(e,o,b=>this.date(b),t)}</span
          >
          <div class="foot">
            <span class=${e.owned?"state own":"state"}
              >${e.owned?e.qty_owned>1?`Owned \xD7${e.qty_owned}`:"Owned":""}</span
            >
            <button
              class=${["act",e.owned?"on":"",this.pending.has(e.set_number)?"pending":"",this.wishing===e.set_number?"holding":""].join(" ")}
              ?disabled=${this.pending.has(e.set_number)}
              aria-label=${e.owned?`Remove ${H(e)} from your collection`:`Add ${H(e)} to your collection`}
              aria-description=${v}
              data-hint=${v}
              @keydown=${b=>{b.key===" "&&!b.repeat&&this.wishStart(e),b.key==="Enter"&&(this.wished="")}}
              @keyup=${this.wishEnd}
              @click=${()=>{this.toggleOwned(e)}}
            >
              <ha-icon icon=${e.owned?"mdi:check":"mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `}filler(e){return n`<div class="filler">
      <div class="fillcard">
        <lego-bricks></lego-bricks>
        <span class="hint">${e}</span>
      </div>
    </div>`}tail(e=""){return n`<div class="filler tail">
      <div class="fillcard">
        <lego-bricks></lego-bricks>
        ${e?n`<span class="hint">${e}</span>`:c}
      </div>
    </div>`}};w.styles=[re,Oe,Le,se,kr],p([x({attribute:!1})],w.prototype,"hass",2),p([x({attribute:!1})],w.prototype,"dash",2),p([x({attribute:!1})],w.prototype,"entryId",2),p([x({type:Boolean,reflect:!0})],w.prototype,"collapsed",2),p([x({type:Boolean})],w.prototype,"handle",2),p([x({type:Boolean,reflect:!0})],w.prototype,"bare",2),p([x({type:Boolean,reflect:!0})],w.prototype,"dark",2),p([x({attribute:!1})],w.prototype,"pictureSize",2),p([x({attribute:!1})],w.prototype,"sharpPictures",2),p([m()],w.prototype,"pending",2),p([m()],w.prototype,"writeError",2),p([m()],w.prototype,"wishing",2);var T=class extends w{constructor(){super(...arguments);this.row="collection";this.refreshing=!1;this.refreshError="";this.setsOpen=!1;this.ownedError="";this.query="";this.results=[];this.loadingDetails=!1;this.detailsError=""}willUpdate(e){super.willUpdate(e),e.has("dash")&&(this.pricesPick=void 0),e.has("dash")&&this.dash!==this.ownedFor&&(vr(this.ownedFor,this.dash)||(this.owned=void 0),Fe(this.query)&&this.search(this.query))}updated(){this.setsOpen&&!this.collapsed&&this.dash!==this.ownedFor&&this.loadOwned()}async loadOwned(){let e=this.dash;if(!(!e||this.ownedFor===e)){this.ownedFor=e;try{let t=await this.hass.callWS({...z("lego/collection",e.entry_id),filter:"owned"});this.ownedFor===e&&(this.owned=t.sets,this.ownedError="")}catch(t){this.ownedFor===e&&(this.ownedError=E(t))}}}async search(e){if(this.query=e,!Fe(e)){this.results=[];return}try{let t=await this.hass.callWS({...z("lego/search",this.dash?.entry_id??""),query:e,limit:24});this.query===e&&(this.results=t.sets)}catch{this.results=[]}}showPrices(){return this.pricesPick??this.dash?.collection_prices??!0}detailsBar(){let e=fr(this.results);if(!e.length&&!this.detailsError)return c;let t=this.dash?.quota,s=!!this.dash?.can_change&&!!t&&t.remaining>0;return n`<div class="details" role="status">
      <span class="muted">
        ${this.detailsError||`Dates and prices for ${e.length} of these aren't loaded from Brickset yet.`}
      </span>
      ${s&&e.length?n`<button
              class="update"
              ?disabled=${this.loadingDetails}
              title="Ask Brickset about all of them at once, using 1 of the ${t?.remaining} calls left today"
              @click=${()=>{this.loadDetails(e)}}
            >
              <ha-icon icon="mdi:cloud-download-outline"></ha-icon>
              ${this.loadingDetails?"Loading\u2026":"Load details"}
              <span class="sep" aria-hidden="true"></span>
              <span class="cost">1 call</span>
            </button>`:c}
    </div>`}async loadDetails(e){this.loadingDetails=!0,this.detailsError="";try{await this.hass.callWS({...z("lego/set_details",this.dash?.entry_id??""),numbers:e}),await this.search(this.query)}catch(t){this.detailsError=E(t)}finally{this.loadingDetails=!1}}setPrices(e){this.pricesPick=e,this.hass.callWS({type:"lego/panel_config/set",collection_prices:e}).catch(()=>{})}async refresh(){this.refreshing=!0,this.refreshError="";try{await this.hass.callService("lego","refresh_collection",Bt(this.dash?.device_id??"")),this.dispatchEvent(new CustomEvent(ge,{bubbles:!0,composed:!0}))}catch(e){this.refreshError=E(e)}finally{this.refreshing=!1}}subtitle(){return jt(this.dash?.last_synced??null,new Date)}short(){let e=this.dash?.quota;return!!e&&e.remaining<e.refresh_cost}actions(){let e=this.dash?.quota;if(!e)return c;let t=A(e.refresh_cost,"call","calls");return n`<button
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
    </button>`}resumes(e){let t=new Date(e),s=t.toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"});return t.toDateString()===new Date().toDateString()?`at ${s}`:`tomorrow at ${s}`}body(){let e=this.dash?.stats,t=this.dash?.quota;if(!e)return n`<p class="muted">Loading your collection…</p>`;let s=[[e.sets_owned,"Sets owned"],[e.sets_distinct,"Distinct sets"],[e.pieces_owned,"Pieces"],[e.minifigs_owned,"Minifigures"]];return n`
      <div class="stats">
        ${s.map(([a,o])=>n`<div class="stat">
              <span class="n">${this.num(a)}</span
              ><span class="l">${o}</span>
            </div>`)}
      </div>
      ${this.short()&&t?n`<p class="caveat">
              Daily budget spent, ${t.calls_today} of ${t.budget} used,
              so this is the last sync's data. Updates resume
              ${this.resumes(t.resets_at)}.
            </p>`:c}
      ${this.refreshError?n`<p class="caveat bad">${this.refreshError}</p>`:c}
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
        ${this.setsOpen?this.sets():c}
      </div>
    `}sets(){let e=Fe(this.query),t=e?this.results:this.owned??[];return n`
      <div class="searchbox">
        <input
          class="search"
          type="search"
          .value=${this.query}
          placeholder="Search your sets and the full catalogue…"
          aria-label="Search sets"
          @input=${s=>{this.search(s.target.value)}}
        />
        ${this.query?n`<button
                class="clear"
                aria-label="Clear search"
                @click=${()=>{this.search("")}}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`:c}
      </div>
      ${this.ownedError&&!e?n`<p class="caveat bad">${this.ownedError}</p>`:this.owned===void 0&&!e?n`<p class="muted">Loading your sets…</p>`:n`<div class="count">
                  <p class="muted">
                    ${e?A(t.length,"matching set","matching sets"):`${A(t.length,"set owned","sets owned")}, by theme then name`}
                  </p>
                  <label class="prices">
                    <input
                      type="checkbox"
                      .checked=${this.showPrices()}
                      @change=${s=>this.setPrices(s.target.checked)}
                    />
                    Show prices
                  </label>
                </div>
                ${e?this.detailsBar():c}
                <div class="grid">
                  ${t.map(s=>this.card(s,"retirement",this.themeColour(s.theme),this.showPrices()))}
                </div>`}
    `}};T.styles=[w.styles,$`
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
      .details {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: var(--ha-space-2, 8px) var(--ha-space-4, 16px);
        justify-content: space-between;
        margin-bottom: var(--ha-space-3, 12px);
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
    `],p([m()],T.prototype,"refreshing",2),p([m()],T.prototype,"refreshError",2),p([m()],T.prototype,"setsOpen",2),p([m()],T.prototype,"owned",2),p([m()],T.prototype,"ownedError",2),p([m()],T.prototype,"query",2),p([m()],T.prototype,"results",2),p([m()],T.prototype,"loadingDetails",2),p([m()],T.prototype,"detailsError",2),p([m()],T.prototype,"pricesPick",2);R("lego-collection-row",T);var Er=["releases","themes"],ms=6,fs=1100,Ar={normal:7,wide:10},Cr={normal:18,wide:24},S=class extends w{constructor(){super(...arguments);this.kind="releases";this.error="";this.adding=!1;this.draft="";this.following=!1;this.followNote="";this.themesOpen=!1;this.wiggling=!1;this.held=!1;this.holdStart=()=>{!this.dash?.can_change||this.wiggling||(window.clearTimeout(this.holdTimer),this.holdTimer=window.setTimeout(()=>{this.held=!0,this.wiggling=!0},nt))};this.holdEnd=()=>{window.clearTimeout(this.holdTimer)};this.onKey=e=>{e.key==="Escape"&&this.wiggling&&(this.wiggling=!1)};this.width=0;this.scrolledFor="";this.filterFor="";this.requested=""}get compact(){return this.width>0&&this.width<720}get wide(){return this.width>=fs}connectedCallback(){super.connectedCallback(),this.sizer=new ResizeObserver(([e])=>{this.width=Math.round(e.contentRect.width/8)*8}),this.sizer.observe(this),this.addEventListener("keydown",this.onKey)}disconnectedCallback(){super.disconnectedCallback(),this.sizer?.disconnect(),this.removeEventListener("keydown",this.onKey),window.clearTimeout(this.holdTimer)}get row(){return this.kind}willUpdate(e){super.willUpdate(e);let t=`${this.dash?.entry_id}:${this.kind}`;this.dash&&t!==this.filterFor&&(this.filterFor=t,this.filter=Q(this.kind,this.dash),this.data=void 0)}updated(){!this.collapsed&&this.filter&&this.dash&&this.hass&&this.fetch(),this.scrollToToday()}scrollToToday(){let e=this.renderRoot.querySelector(".timescroll.compact"),t=e?.querySelector(".today"),s=`${this.filter?.span}:${this.data?.span.from}`;!e||!t||s===this.scrolledFor||(this.scrolledFor=s,e.scrollLeft=t.offsetLeft-e.clientWidth/2)}async fetch(){let e=this.filter,t=this.dash;if(!e||!t||t.release_status[e.scope]===null)return;let s=JSON.stringify([t.entry_id,e]);if(!(s===this.requested&&this.requestedWith===t)){this.requested=s,this.requestedWith=t;try{let a=await ir(this.hass,t.entry_id,e);this.requested===s&&(this.data=a,this.error="")}catch(a){this.requested===s&&(this.error=E(a))}}}pick(e){if(!this.filter)return;this.filter={...this.filter,...e},this.openStack=void 0;let{scope:t,themes:s,span:a}=this.filter,o={scope:t,themes:s,span:a};this.hass.callWS({type:"lego/panel_config/set",release_filters:{[this.kind]:o}}).catch(()=>{}),this.dispatchEvent(new CustomEvent(Sr,{detail:{row:this.kind,filter:o},bubbles:!0,composed:!0}))}status(){return this.filter?this.dash?.release_status[this.filter.scope]:void 0}subtitle(){let e=this.status();return e==null?"":e==="fetching"?"Fetching releases\u2026":e==="failed"?"Couldn't fetch releases":this.data?A(this.data.sets.length,"set","sets"):"Loading\u2026"}actions(){return!this.filter||this.status()===null||M[this.kind].length<2?c:n`<div class="pills" role="group" aria-label="Time span">
      ${M[this.kind].map(e=>n`<button
            class=${e===this.filter?.span?"pill on":"pill"}
            aria-pressed=${e===this.filter?.span}
            title=${Kt[e]??c}
            @click=${()=>this.pick({span:e})}
          >
            ${j(e)}
          </button>`)}
    </div>`}body(){let e=this.filter,t=this.dash;if(!e||!t)return n`<p class="muted">Loading…</p>`;let s=this.status();return s===null?n`<p class="muted">${this.unavailable()}</p>
        ${this.kind==="recent"||this.kind==="upcoming"?c:this.followControls()}`:s==="fetching"?n`<p class="muted">Fetching this year's releases…</p>`:s==="failed"?n`<p class="muted">
        Couldn't fetch this year's releases. They're tried again every few hours
        until they arrive.
      </p>`:n`
      ${Er.includes(this.kind)?this.chips(e):c}
      ${Er.includes(this.kind)&&this.data?this.timeline(this.data):c}
      ${this.error?n`<p class="caveat bad">${this.error}</p>`:c}
      ${this.cards()}
    `}unavailable(){return this.kind==="recent"||this.kind==="upcoming"?"Turn on Follow releases across all themes in the integration's options for this row.":this.kind==="themes"?this.dash?.can_change?"No themes followed yet. Follow one to see its new sets here.":"No themes followed yet.":this.dash?.can_change?"Follow a theme, or turn on Follow releases across all themes in the integration's options, to see new sets here.":"No themes followed yet."}chips(e){let t=this.dash,s=ee(t.followed),a=e.scope==="mine",o=t.release_status.all!==null,l=n`<button
      class=${e.scope==="all"?"chip on":o?"chip":"chip off"}
      aria-pressed=${e.scope==="all"}
      aria-disabled=${!o}
      @click=${()=>{if(!o){this.followNote="Everything needs Follow releases across all themes, in the integration's options. It reads every set of the year once a day, about 3 Brickset calls, where your own themes alone take fewer.";return}this.pick({scope:"all",themes:[]})}}
    >
      Everything
    </button>`,d=a?e.themes.length:0,h=n`<button
      class=${a?"chip on":"chip"}
      aria-pressed=${a}
      aria-expanded=${a&&this.themesOpen}
      @click=${()=>{this.wiggling=!1;let v=xr(a,this.themesOpen);this.themesOpen=v.open,v.pick&&this.pick({scope:"mine",themes:[]})}}
    >
      ${this.kind==="themes"?"All my themes":"My themes"}
      ${d&&!this.themesOpen?n`<span>· ${d}</span>`:c}
      <ha-icon
        class="drop"
        icon=${a&&this.themesOpen?"mdi:chevron-up":"mdi:chevron-down"}
      ></ha-icon>
    </button>`,u=yr({mine:a,open:this.themesOpen,wiggling:this.wiggling,followed:t.followed.length}),g=u.themes;return n`<div class="chips">
        ${this.kind==="releases"?l:c}
        ${t.followed.length?h:c}
        ${g&&this.kind==="releases"?n`<span class="divider" aria-hidden="true"></span>`:c}
        ${(g?t.followed:[]).map(v=>{let b=e.scope==="mine"&&e.themes.includes(v);return n`<span
            class=${this.wiggling?"chipwrap wiggle":"chipwrap"}
          >
            <button
              class=${b?"chip on":"chip"}
              aria-pressed=${b}
              @pointerdown=${this.holdStart}
              @pointerup=${this.holdEnd}
              @pointerleave=${this.holdEnd}
              @pointercancel=${this.holdEnd}
              @contextmenu=${k=>k.preventDefault()}
              @click=${()=>{let k=$r(this.held,this.wiggling);this.held=!1,k==="pick"&&this.pick({scope:"mine",themes:ze(e.scope==="mine"?e.themes:[],v,t.followed)})}}
            >
              <span
                class="key"
                style="background:${te(s.get(v))}"
              ></span>
              ${v}
            </button>
            ${this.wiggling?n`<button
                    class="remove"
                    aria-label=${`Stop following ${v}`}
                    ?disabled=${this.following}
                    @click=${()=>{this.follow(v,!1)}}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>`:c}
          </span>`})}
        ${u.trailing==="done"?n`<button
                class="chip on"
                @click=${()=>this.wiggling=!1}
              >
                Done
              </button>`:u.trailing==="edit"?this.followChip():c}
      </div>
      ${this.adding?this.editor():c}
      ${this.followNote&&!this.adding?n`<p class="caveat" role="status">${this.followNote}</p>`:c}`}followControls(){return this.dash?.can_change?n`<div class="chips">${this.followChip()}</div>
      ${this.adding?this.editor():c}`:c}followChip(){if(!this.dash?.can_change||this.adding)return c;let e=this.dash.followed.length>0;return n`<button class="chip" @click=${()=>{this.openEditor()}}>
      <ha-icon icon=${e?"mdi:pencil":"mdi:plus"}></ha-icon>
      ${e?"Edit themes":"Follow a theme"}
    </button>`}async openEditor(){this.adding=!0,this.followNote="",await this.loadThemes()}async loadThemes(){try{this.themeList=await this.hass.callWS(z("lego/themes",this.entryId||this.dash?.entry_id||""))}catch(e){this.followNote=E(e)}}editor(){let e=this.themeList,t=e?.followed??this.dash?.followed??[],s=new Set(t.map(l=>l.toLowerCase())),a=e?e.follow_cost?A(e.follow_cost,"call","calls"):"free":"\u2026",o=`lego-themes-${this.kind}`;return n`<div class="follow">
        <input
          list=${o}
          .value=${this.draft}
          placeholder="Theme name, such as Technic"
          aria-label="Theme to follow"
          @input=${l=>{this.draft=l.target.value}}
          @keydown=${l=>{l.key==="Enter"&&this.follow(this.draft,!0)}}
        />
        <datalist id=${o}>
          ${(e?.themes??[]).filter(l=>!s.has(l.toLowerCase())).map(l=>n`<option value=${l}></option>`)}
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
            </div>`:c}
      ${this.followNote?n`<p class="caveat" role="status">${this.followNote}</p>`:c}`}async follow(e,t){let s=e.trim();if(!(!s||this.following)){this.following=!0,this.followNote="";try{let a=await this.hass.callWS({...z("lego/themes/follow",this.entryId||this.dash?.entry_id||""),theme:s,follow:t});t&&(this.draft=""),a.complete||(this.followNote=`Following ${s}. Its sets arrive with the next check, as today's budget is spent.`),await this.loadThemes()}catch(a){this.followNote=E(a);return}finally{this.following=!1}this.dispatchEvent(new CustomEvent(ge,{bubbles:!0,composed:!0}))}}stack(e,t,s,a){let o=y=>`${t(y)*100}%`,l=e.at>=s-.01&&e.at<=a+.01,d=this.wide?Ar.wide:Ar.normal,h=e.extra?1:0,u=e.themes.length+h,g=rt(u,d-1).map(Math.round),v=rt(u,d*2),b=this.hass?.locale?.language,k=y=>new Date(y).toLocaleDateString(b,{day:"numeric",month:"short"}),D=e.points.slice(0,ms),f=t(e.at)<.25?"tip start":t(e.at)>.75?"tip end":"tip";return n`<button
      class=${l?"stack":"stack out"}
      style="left:${o(e.at)};left:round(nearest, ${o(e.at)}, 1px)"
      aria-label=${e.points.map(y=>`${H(y)}, ${k(y.date)}`).join("; ")}
      aria-pressed=${this.compact?this.openStack?.at===e.at:c}
      @click=${()=>{this.compact&&(this.openStack=this.openStack?.at===e.at?void 0:e)}}
    >
      ${e.extra?n`<span
              class="extra"
              style="--rest:${g[0]}px;--fan:${v[0]}px"
              >+${e.extra}</span
            >`:c}
      ${e.themes.map((y,Y)=>n`<span
            class="brick"
            style="--rest:${g[Y+h]}px;--fan:${v[Y+h]}px;--brick:${this.themeColour(y)};z-index:${10-Y-h}"
          ></span>`)}
      <span class=${f} aria-hidden="true">
        ${D.map(y=>n`<span class="tipline">
              <span
                class="key"
                style="background:${this.themeColour(y.theme)}"
              ></span>
              <span class="tipname">${H(y)}</span>
              <span class="tipdate">${k(y.date)}</span>
            </span>`)}
        ${e.points.length>D.length?n`<span class="tipmore"
                >+${e.points.length-D.length} more</span
              >`:c}
      </span>
    </button>`}timeline(e){let t=new Date,s=new Date(t.getFullYear(),0,1),a=Math.max(J(s,e.span.from),0),o=e.span.to?Math.min(J(s,e.span.to),B):B,l=Yt(a,o,this.compact),d=f=>(f-l.from)/(l.to-l.from),h=f=>`${d(f)*100}%`,u=f=>f>=l.from-.05&&f<=l.to+.05,g=Qt(this.width*l.width,l.to-l.from,this.wide?Cr.wide:Cr.normal),v=Xt(e.timeline,s,g).filter(f=>u(f.at)),b=this.hass?.locale?.language,k=e.timeline.filter(f=>{let y=J(s,f.date);return y>=a&&y<=o}).length,D=J(s,t);return n`<div
        class=${this.compact?"timescroll compact":"timescroll"}
      >
        <div
          class=${this.wide?"timeline wide":"timeline"}
          role="group"
          style="width:${l.width*100}%"
          aria-label=${`${A(e.timeline.length,"set","sets")} from January to next March, ${k} in the chosen span`}
        >
          <div class="line"></div>
          <div
            class="window"
            style="left:${h(a)};width:${h(l.from+Math.max(o-a,0))}"
          ></div>
          ${u(D)?n`<span class="today" style="left:${h(D)}"
                  ><ha-icon icon="mdi:chevron-down"></ha-icon
                  ><span class="todaytip"
                    >Today,
                    ${t.toLocaleDateString(b,{day:"numeric",month:"long"})}</span
                  ></span
                >`:c}
          ${v.map(f=>this.stack(f,d,a,o))}
          ${Array.from({length:B},(f,y)=>y).filter(f=>f+1>l.from&&f<l.to).map(f=>{let y=new Date(s.getFullYear(),f,1).toLocaleDateString(b,{month:"short"});return n`<span
                class=${f%3===0?"month quarter":"month"}
                style="left:${h(f)};width:${h(l.from+1)}"
                aria-hidden="true"
                >${y}</span
              >`})}
        </div>
      </div>
      ${this.compact&&this.openStack?this.picked(this.openStack):c}`}picked(e){let t=this.hass?.locale?.language;return n`<div class="picked" role="status">
      ${e.points.map(s=>n`<span class="tipline">
            <span
              class="key"
              style="background:${this.themeColour(s.theme)}"
            ></span>
            <span class="tipname">${H(s)}</span>
            <span class="tipdate"
              >${new Date(s.date).toLocaleDateString(t,{day:"numeric",month:"short"})}</span
            >
          </span>`)}
    </div>`}cards(){let e=this.data?.sets;if(!e)return n`<p class="muted">Loading…</p>`;if(!e.length){let t=this.filter&&this.filter.span==="coming";return this.filler(t?"Nothing due in this span yet.":"Nothing new in this span. Try a longer one.")}return n`<div class="carousel">
      ${e.map(t=>this.card(t,"release",this.themeColour(t.theme)))}
      ${this.tail()}
    </div>`}};S.styles=[w.styles,$`
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
      /* The brick and the band it sits in, in whole pixels; a wide row draws both
         bigger. --b-h matches BRICK, which stacks the bricks. */
      .timeline {
        --b-w: 10px;
        --b-h: 7px;
        --b-x: 5px;
        --b-y: 4px;
        --stud-w: 6px;
        --stud-h: 2px;
        --stud-x: 2px;
        --lit: 2px;
        --count-h: 11px;
        --count-font: 9px;
        --mid: 21px;
        --band: 34px;
        --tip: 32px;
        height: calc(var(--band) + 30px);
        margin: var(--ha-space-2, 8px) 0 var(--ha-space-3, 12px);
        position: relative;
      }
      .timeline.wide {
        --b-w: 14px;
        --b-h: 10px;
        --b-x: 7px;
        --b-y: 5px;
        --stud-w: 8px;
        --stud-h: 3px;
        --stud-x: 3px;
        --lit: 3px;
        --count-h: 14px;
        --count-font: 11px;
        --mid: 28px;
        --band: 48px;
        --tip: 39px;
      }
      .timeline .line {
        background: var(--lego-outline);
        height: 2px;
        left: 0;
        position: absolute;
        right: 0;
        top: calc(var(--mid) - 1px);
      }
      .timeline .window {
        background: var(--lego-pick);
        border-radius: var(--ha-border-radius-sm, 4px);
        height: var(--band);
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
        top: var(--mid);
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
      /* Each set is a 1×1 brick seen side on, so sets on one date stack up like
         bricks: the body, its stud behind it, and a lit top edge. */
      .timeline .brick {
        /* Outlined in a darker shade of its own colour, as the logo and the filler
           bricks are (the edge in scripts/generate_brand.py), and as fine: their
           edge is a fortieth of a brick across, so half a point is the nearest. */
        --brick-edge: color-mix(in srgb, var(--brick) 42%, black);
        /* The underside in shade, lying over the top of the brick below. */
        background: linear-gradient(
          to top,
          color-mix(in srgb, var(--brick) 70%, black) 1px,
          var(--brick) 1px
        );
        border-radius: 1px;
        box-shadow: 0 0 0 0.5px var(--brick-edge);
        height: var(--b-h);
        /* Whole pixels from the stack's own snapped centre: an edge between two
           pixels smears, and one side reads heavier than the other. */
        left: calc(50% - var(--b-x));
        position: absolute;
        top: calc(50% - var(--b-y));
        transform: translateY(var(--rest, 0px));
        transition: transform var(--ha-animation-duration-normal, 250ms)
          ease-out;
        width: var(--b-w);
      }
      .timeline .brick::before {
        background: var(--brick);
        border-radius: 0.5px;
        box-shadow: 0 0 0 0.5px var(--brick-edge);
        content: "";
        height: var(--stud-h);
        left: var(--stud-x);
        position: absolute;
        top: calc(-1 * var(--stud-h));
        width: var(--stud-w);
        z-index: -1;
      }
      .timeline .brick::after {
        background: rgb(255 255 255 / 25%);
        border-radius: 1px 1px 0 0;
        content: "";
        height: var(--lit);
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
      }
      /* A full stack's top place: the count of the sets past the bricks, sat on
         the stack where a brick would be, so it never reaches a neighbour. */
      .timeline .extra {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-pill, 9999px);
        box-sizing: border-box;
        color: var(--lego-text);
        font-size: var(--count-font);
        font-variant-numeric: tabular-nums;
        font-weight: var(--ha-font-weight-bold, 700);
        height: var(--count-h);
        left: 50%;
        line-height: calc(var(--count-h) - 2 * var(--lego-line));
        min-width: var(--b-w);
        padding: 0 3px;
        position: absolute;
        top: calc(50% - var(--b-y) + var(--b-h) - var(--count-h));
        transform: translate(-50%, var(--rest, 0px));
        transition: transform var(--ha-animation-duration-normal, 250ms)
          ease-out;
        z-index: 11;
      }
      /* The stacked bricks lift apart, so each can be told from the next. */
      .timeline .stack:hover .brick,
      .timeline .stack:focus-visible .brick {
        transform: translateY(var(--fan, 0px));
      }
      .timeline .stack:hover .extra,
      .timeline .stack:focus-visible .extra {
        transform: translate(-50%, var(--fan, 0px));
      }
      @media (prefers-reduced-motion: reduce) {
        .timeline .brick,
        .timeline .extra {
          transition: none;
        }
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
        top: calc(100% + var(--tip));
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
        display: flex;
        position: absolute;
        top: calc(var(--mid) - 15px);
        transform: translateX(-50%);
      }
      /* Today's date, over the arrow while it is hovered. */
      .timeline .todaytip {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-sm, 4px);
        bottom: 100%;
        color: var(--lego-text);
        font-size: var(--ha-font-size-s, 12px);
        left: 50%;
        opacity: 0;
        padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
        pointer-events: none;
        position: absolute;
        transform: translateX(-50%);
        transition: opacity var(--ha-animation-duration-fast, 150ms);
        white-space: nowrap;
        z-index: 31;
      }
      .timeline .today:hover {
        z-index: 32;
      }
      .timeline .today:hover .todaytip {
        opacity: 1;
      }
      .timeline .month {
        color: var(--lego-text-2);
        font-size: 11px;
        position: absolute;
        text-align: center;
        top: calc(var(--band) + 12px);
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
    `],p([x()],S.prototype,"kind",2),p([m()],S.prototype,"filter",2),p([m()],S.prototype,"data",2),p([m()],S.prototype,"error",2),p([m()],S.prototype,"adding",2),p([m()],S.prototype,"themeList",2),p([m()],S.prototype,"draft",2),p([m()],S.prototype,"following",2),p([m()],S.prototype,"followNote",2),p([m()],S.prototype,"themesOpen",2),p([m()],S.prototype,"wiggling",2),p([m()],S.prototype,"width",2),p([m()],S.prototype,"openStack",2);R("lego-releases-row",S);var vs=365,bs=12,Tr=70,lt=2*Math.PI*Tr,ws=1.5,N=class extends w{constructor(){super(...arguments);this.kind="value";this.hover="";this.trendOpen=!1;this.hoverPoint=null;this.historyFor=""}get row(){return this.kind}willUpdate(e){super.willUpdate(e);let t=`${this.dash?.entry_id}:${this.kind}`;this.dash&&t!==this.historyFor&&(this.historyFor=t,this.history=void 0)}updated(){this.trendOpen&&!this.collapsed&&this.history===void 0&&this.loadHistory()}format(e){return this.kind==="value"?this.money(e):this.num(Math.round(e))}subtitle(){let e=this.dash?.stats;return e?this.kind==="value"?`${this.money(e.value)} at LEGO.com RRP`:A(e.pieces_owned,"piece","pieces"):""}body(){let e=this.dash?.stats;if(!e)return n`<p class="muted">Loading…</p>`;let t=It(this.dash?.by_theme??[],this.kind),s=this.kind==="value"?e.value:e.pieces_owned;if(!t.length)return n`<p class="muted">
        Nothing owned with a published figure yet.
      </p>`;let a=ee(t.filter(l=>!l.other).map(l=>l.theme)),o=l=>te(l.other?"other":a.get(l.theme));return n`
      <div class="chart">
        ${this.donut(t,s,o)} ${this.bars(t,s,o)}
      </div>
      <p class="footnote">
        <span
          >${this.kind==="value"&&e.sets_missing_price?`${A(e.sets_missing_price,"set has","sets have")} no published price and ${e.sets_missing_price===1?"is":"are"} not counted.`:""}</span
        >
        ${this.kind==="value"?n`<span>At LEGO.com RRP</span>`:c}
      </p>
      ${this.trend()}
    `}donut(e,t,s){let a=e.reduce((h,u)=>h+u.amount,0)||1,o=0,l=e.map(h=>{let u=Math.max(h.amount/a*lt-ws,.5),g=O`<circle
        cx="100"
        cy="100"
        r=${Tr}
        fill="none"
        stroke=${s(h)}
        stroke-width=${this.hover===h.theme?34:28}
        stroke-dasharray=${`${u} ${lt-u}`}
        stroke-dashoffset=${-o}
        class=${this.hover&&this.hover!==h.theme?"faded":""}
        @mouseenter=${()=>this.hover=h.theme}
        @mouseleave=${()=>this.hover=""}
      ></circle>`;return o+=h.amount/a*lt,g}),d=e.find(h=>h.theme===this.hover);return n`<div class="donut">
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
        <span class="n">${this.format(d?d.amount:t)}</span>
        <span class="l">${d?d.theme:"in total"}</span>
      </div>
    </div>`}bars(e,t,s){let a=e.reduce((o,l)=>Math.max(o,l.amount),0)||1;return n`<ul class="bars">
      ${e.map((o,l)=>{let d=this.hover===o.theme,h=this.hover&&!d,u=o.setNumbers.slice(0,bs),g=o.setNumbers.length-u.length;return n`<li>
          <button
            class=${d?"bar-row on":"bar-row"}
            aria-describedby=${`tip-${l}`}
            @mouseenter=${()=>this.hover=o.theme}
            @mouseleave=${()=>this.hover=""}
            @focus=${()=>this.hover=o.theme}
            @blur=${()=>this.hover=""}
          >
            <span class="label"
              ><span class="key" style="background:${s(o)}"></span
              >${o.theme}</span
            >
            <span class="track">
              <span
                class=${h?"bar faded":"bar"}
                style="width:${Math.max(o.amount/a*100,1)}%;background:${s(o)}"
              ></span>
              <span class="amount">${this.format(o.amount)}</span>
            </span>
            ${d?n`<span class="tip" role="tooltip" id=${`tip-${l}`}>
                    <b>${o.theme} · ${this.format(o.amount)}</b>
                    ${Math.round(o.amount/(t||1)*100)}% of the
                    collection, ${A(o.sets,"set","sets")}
                    ${u.length?n`<span class="numbers"
                            >${u.join(", ")}${g?`, and ${g} more`:""}</span
                          >`:c}
                  </span>`:c}
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
              >`:c}
      </button>
      ${this.trendOpen?this.trendChart():c}
    </div>`}async loadHistory(){let e=this.dash?.history?.[this.kind],t=this.historyFor;if(!e){this.history="none";return}this.history="loading";try{let s=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(Date.now()-vs*864e5).toISOString(),statistic_ids:[e],period:"week",types:this.kind==="value"?["state"]:["mean"]});if(t!==this.historyFor)return;let a=Ht(s[e]??[]);this.history=a.length>=2?a:"none"}catch{t===this.historyFor&&(this.history="none")}}trendChart(){let e=this.history;if(e===void 0||e==="loading")return n`<p class="muted">Loading the trend…</p>`;if(e==="none")return n`<p class="muted">
        No history yet. Home Assistant records it weekly from the sensor, so a
        line appears after a couple of weeks.
      </p>`;let t=e,s=Math.min(...t.map(f=>f.v)),o=Math.max(...t.map(f=>f.v))-s||1,l=t[0].t,d=t[t.length-1].t-l||1,h=f=>(f.t-l)/d*100,u=f=>90-(f.v-s)/o*80,g=t.map(f=>`${h(f)},${u(f)}`).join(" "),v=t[t.length-1],b=this.hoverPoint===null?void 0:t[this.hoverPoint],k=b??v,D=f=>new Date(f).toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short"});return n`
      <div
        class="plot"
        @pointermove=${f=>{let y=f.currentTarget.getBoundingClientRect(),Y=l+(f.clientX-y.left)/y.width*d,Ie=0;t.forEach((Mr,Pr)=>{Math.abs(Mr.t-Y)<Math.abs(t[Ie].t-Y)&&(Ie=Pr)}),this.hoverPoint=Ie}}
        @pointerleave=${()=>this.hoverPoint=null}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line class="base" x1="0" y1="100" x2="100" y2="100"></line>
          <polygon class="wash" points=${`0,100 ${g} 100,100`}></polygon>
          <polyline class="trace" points=${g}></polyline>
          ${b?O`<line class="cross" x1=${h(b)} y1="0" x2=${h(b)} y2="100"></line>`:c}
        </svg>
        <span class="dot" style="left:${h(k)}%;top:${u(k)}%"></span>
        <span
          class="readout"
          style="left:${Math.min(Math.max(h(k),12),88)}%"
          >${this.format(k.v)} · ${D(k.t)}</span
        >
      </div>
      <div class="axis">
        <span>${D(t[0].t)}</span><span>${D(v.t)}</span>
      </div>
    `}};N.styles=[w.styles,$`
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
    `],p([x()],N.prototype,"kind",2),p([m()],N.prototype,"hover",2),p([m()],N.prototype,"trendOpen",2),p([m()],N.prototype,"history",2),p([m()],N.prototype,"hoverPoint",2);R("lego-value-row",N);var zr="Hold + on any set to add it to your wishlist.",ct=class extends w{constructor(){super(...arguments);this.row="wishlist"}subtitle(){return A(this.dash?.wishlist.length??0,"set","sets")}body(){let e=this.dash?.wishlist??[];return e.length?n`<div class="carousel">
      ${e.map(t=>this.card(t,"retirement",this.themeColour(t.theme)))}
      ${this.tail(zr)}
    </div>`:this.filler(`Nothing on your wishlist yet. ${zr}`)}};R("lego-wishlist-row",ct);var ys={account:"Brickset account",collapsed:"Start folded",picture_size:"Picture size",sharp_pictures:"Sharper pictures",measure:"Show",row:"Row",scope:"Themes",themes:"Only these themes",span:"Span"},xs={account:"Leave empty to show the account you opened last in the LEGO panel.",collapsed:"Show only the card's header until it is opened.",picture_size:"Medium and Large draw pictures two and three times the size. They look sharp only with Sharper pictures on.",sharp_pictures:"Leave empty to follow the account's own option. On downloads the larger pictures, about five times the data each, for this card alone.",scope:"Everything needs Follow releases across all themes in the options.",themes:"Narrows My themes to some of the themes you follow.",span:"Leave empty for the row's own default."},Be={name:"account",selector:{config_entry:{integration:"lego"}}},je={name:"collapsed",selector:{boolean:{}}},gt={name:"picture_size",selector:{select:{mode:"dropdown",options:Ae.map(i=>({value:i,label:Ce[i]}))}}},mt={name:"sharp_pictures",selector:{select:{mode:"dropdown",options:[{value:"on",label:"On"},{value:"off",label:"Off"}]}}};function He(i,r=()=>{}){return{schema:i,computeLabel:e=>ys[e.name],computeHelper:e=>xs[e.name],assertConfig:r}}var P=class extends C{constructor(){super(...arguments);this.error="";this.loadedFor=null;this.reload=()=>{this.loadedFor=null,this.requestUpdate()}}setConfig(e){if(!e)throw new Error("Invalid configuration");this.config=e,this.loadedFor=null}getCardSize(){return this.config?.collapsed?1:6}getGridOptions(){return{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),window.addEventListener(V,this.reload)}disconnectedCallback(){window.removeEventListener(V,this.reload),super.disconnectedCallback()}updated(){let e=this.config?.account??"";this.hass&&Me(this.hass),this.hass&&this.config&&this.loadedFor!==e&&(this.loadedFor=e,tr(this.hass,e).then(t=>{this.dash=t,this.error=""}).catch(t=>this.error=E(t)))}render(){return n`<ha-card
      @lego-changed=${()=>Z()}
      @lego-toggle=${e=>e.stopPropagation()}
    >
      ${Ne(this.dash)}
      ${this.error?n`<div class="error">${this.error}</div>`:this.dash&&this.hass?this.row(this.dash):c}
    </ha-card>`}};P.styles=[re,se,$`
      :host {
        display: block;
        min-width: 0;
      }
      ha-card {
        overflow: hidden;
      }
      .updated {
        margin: var(--ha-space-2, 8px) var(--ha-space-2, 8px) 0;
      }
      .error {
        color: var(--ha-color-on-danger-normal, #b30532);
        padding: var(--ha-space-4, 16px);
      }
    `],p([x({attribute:!1})],P.prototype,"hass",2),p([m()],P.prototype,"config",2),p([m()],P.prototype,"dash",2),p([m()],P.prototype,"error",2);var dt=class extends P{static getStubConfig(){return{}}static getConfigForm(){return He([Be,gt,mt,je])}row(r){return n`<lego-collection-row
      bare
      .pictureSize=${this.config?.picture_size}
      .sharpPictures=${Te(this.config?.sharp_pictures)}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${r}
      .entryId=${r.entry_id}
    ></lego-collection-row>`}},ht=class extends P{static getStubConfig(){return{}}static getConfigForm(){return He([Be,gt,mt,je])}row(r){return n`<lego-wishlist-row
      bare
      .pictureSize=${this.config?.picture_size}
      .sharpPictures=${Te(this.config?.sharp_pictures)}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${r}
      .entryId=${r.entry_id}
    ></lego-wishlist-row>`}},pt=class extends P{static getStubConfig(){return{measure:"value"}}static getConfigForm(){return He([Be,{name:"measure",selector:{select:{mode:"dropdown",options:[{value:"value",label:"Collection value"},{value:"pieces",label:"Pieces"}]}}},je])}row(r){return n`<lego-value-row
      bare
      .kind=${this.config?.measure==="pieces"?"pieces":"value"}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${r}
      .entryId=${r.entry_id}
    ></lego-value-row>`}},ut=class extends P{static getStubConfig(){return{row:"releases"}}static getConfigForm(){let r=[...new Set(Object.values(M).flat())];return He([Be,{name:"row",selector:{select:{mode:"dropdown",options:Object.keys(M).map(e=>({value:e,label:ie[e].title}))}}},{name:"scope",selector:{select:{mode:"dropdown",options:[{value:"mine",label:"My themes"},{value:"all",label:"Everything"}]}}},{name:"themes",selector:{select:{multiple:!0,custom_value:!0,options:[]}}},{name:"span",selector:{select:{mode:"dropdown",options:r.map(e=>({value:e,label:j(e)}))}}},gt,mt,je],e=>{let t=Vt(e.row??"releases",e.span);if(t)throw new Error(t)})}row(r){let e=this.config?.row??"releases",t={};this.config?.scope&&(t.scope=this.config.scope),this.config?.themes&&(t.themes=this.config.themes),this.config?.span&&(t.span=this.config.span);let s={...r,release_filters:{...r.release_filters,[e]:{...Q(e,r),...t}}};return n`<lego-releases-row
      bare
      .kind=${e}
      .pictureSize=${this.config?.picture_size}
      .sharpPictures=${Te(this.config?.sharp_pictures)}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${s}
      .entryId=${r.entry_id}
    ></lego-releases-row>`}},$s=[["lego-collection-card",dt,"LEGO collection","Your Brickset collection's totals, with every set and a search."],["lego-releases-card",ut,"LEGO releases","New and upcoming sets, across every theme or the ones you follow."],["lego-wishlist-card",ht,"LEGO wishlist","The sets you want, soonest to retire first."],["lego-value-card",pt,"LEGO collection value","What your collection is worth at LEGO.com RRP, by theme."]],ks="https://github.com/PineappleEmperor/ha-lego#dashboard-cards";for(let[i,r,e,t]of $s)R(i,r),window.customCards=window.customCards??[],window.customCards.some(s=>s.type===i)||window.customCards.push({type:i,name:e,description:t,preview:!0,documentationURL:ks});var Rr=["releases","recent","upcoming","themes"],_=class extends C{constructor(){super(...arguments);this.narrow=!1;this.dark=!1;this.error="";this.accounts=[];this.account="";this.defaultAccount="";this.switching="";this.picking=!1;this.customising=!1;this.folded={};this.dragging="";this.over="";this.foldedFor="";this.onInvalidated=()=>{this.load()};this.onToggle=e=>{let{row:t,collapsed:s}=e.detail;this.folded={...this.folded,[t]:s}};this.onFilter=e=>{let{row:t,filter:s}=e.detail;this.dash&&(this.dash={...this.dash,release_filters:{...this.dash.release_filters,[t]:s}})};this.onMove=e=>{let{row:t,step:s}=e.detail;this.move(t,s,this.visible())};this.onChanged=()=>Z();this.onTouchMove=e=>{if(!this.dragging||e.pointerType==="mouse")return;let t=this.renderRoot.elementsFromPoint(e.clientX,e.clientY).map(s=>s.closest(".slot")).find(s=>s&&s.dataset.row);t?.dataset.row&&(this.over=t.dataset.row)};this.onPickerKey=e=>{e.key==="Escape"&&this.picking&&(this.picking=!1,this.renderRoot.querySelector(".account")?.focus())};this.onOutside=e=>{let t=this.renderRoot.querySelector(".accountpick");this.picking&&t&&!e.composedPath().includes(t)&&(this.picking=!1)}}get down(){let e=this.accounts.find(t=>t.entry_id===this.account);return e&&!e.loaded?e:void 0}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this.onOutside),window.addEventListener(V,this.onInvalidated),this.load()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this.onOutside),window.removeEventListener(V,this.onInvalidated)}willUpdate(){this.dark=!!this.hass?.themes?.darkMode,this.hass&&Me(this.hass)}async load(){try{let e=!!this.accounts.length;if(!e||this.down){let s=await this.hass.callWS({type:"lego/accounts"});this.accounts=s.accounts,e||(this.account=s.selected??"",this.defaultAccount=this.account)}if(this.down){this.dash=void 0,this.error="";return}let t=await this.hass.callWS(z("lego/dashboard",this.account));t.entry_id!==this.foldedFor&&(this.foldedFor=t.entry_id,this.folded=Object.fromEntries(t.collapsed.map(s=>[s,!0]))),this.dash=t,this.error=""}catch(e){this.error=E(e)}}async selectAccount(e){if(e!==this.account){this.account=e,this.switching=this.accounts.find(t=>t.entry_id===e)?.name??"account";try{await this.load()}finally{this.switching=""}}}async makeDefault(e){try{await this.hass.callWS({type:"lego/account/set",config_entry_id:e}),this.defaultAccount=e}catch(t){this.error=E(t)}}async save(e){if(this.dash){this.dash={...this.dash,...e};try{let t=await this.hass.callWS({type:"lego/panel_config/set",...e});this.dash&&(this.dash={...this.dash,...t})}catch{}}}visible(){let e=this.dash;return e?st(e.rows,e.release_mode).filter(t=>!e.hidden.includes(t)):[]}move(e,t,s){if(!this.dash)return;let a=Jt(this.dash.rows,s,e,t);a!==this.dash.rows&&(this.save({rows:a}),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-row="${e}"] > *`)?.focusHandle?.()))}onTouchStart(e,t){e.pointerType==="mouse"||!e.composedPath().some(a=>a instanceof Element&&a.classList.contains("drag"))||(e.currentTarget.setPointerCapture(e.pointerId),this.dragging=t,this.over=t)}onTouchEnd(e){this.dragging&&this.onDrop(this.over,e)}onDrop(e,t){let s=this.dragging;if(this.dragging="",this.over="",!this.dash||!s||s===e)return;let a=this.dash.rows.filter(d=>d!==s),o=a.indexOf(e),l=t.indexOf(s)<t.indexOf(e);a.splice(o+(l?1:0),0,s),this.save({rows:a})}render(){return n`
      <div class="app">
        ${this.renderHeader()}
        <div class="page">
          ${this.switching?n`<p class="muted switching" role="status">
                  Loading ${this.switching}…
                </p>`:c}
          <div
            class=${this.switching?"busy":""}
            aria-busy=${!!this.switching}
          >
            ${this.error?n`<div class="error" role="alert">
                    <p>${this.error}</p>
                    <button class="link" @click=${()=>{this.load()}}>
                      Try again
                    </button>
                  </div>`:this.down?this.renderDown(this.down):this.renderHome()}
          </div>
        </div>
      </div>
    `}renderDown(e){return n`<div class="error" role="status">
      <p>${e.name} is unavailable. ${e.reason??""}</p>
      <button class="link" @click=${()=>{this.load()}}>Check again</button>
    </div>`}renderHeader(){return n`<header class=${this.narrow?"narrow":""}>
      <div class="title">
        ${this.narrow?n`<ha-menu-button
                .hass=${this.hass}
                .narrow=${this.narrow}
              ></ha-menu-button>`:c}
        <span class="logo">${De(lr)}</span>
        <h1>LEGO</h1>
      </div>
      ${this.accounts.length>1?this.accountPicker():this.accounts.length?this.accountName(this.accounts[0]):c}
    </header>`}renderMeter(e){let{share:t,tight:s}=wr(e);return n`<div
      class=${s?"meter tight":"meter"}
      title=${Ut(e.calls_today,e.budget,new Date(e.resets_at).toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"}))}
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
        ${e?this.brickButton(e):c}
      </div>
      ${this.picking?n`<ul class="menu">
              ${this.accounts.map(t=>n`<li>
                    <button
                      class="pick"
                      aria-current=${t.entry_id===this.account}
                      @click=${()=>{this.picking=!1,this.selectAccount(t.entry_id)}}
                    >
                      ${t.name}${t.loaded?c:n`<span class="unavailable">
                              · unavailable</span
                            >`}
                    </button>
                    ${this.brickButton(t)}
                  </li>`)}
            </ul>`:c}
    </div>`}accountName(e){return n`<div class="accountpick">
      <div class="accountbar">
        <span class="account single" title="Brickset account">
          <span class="names"><span class="name">${e.name}</span></span>
        </span>
      </div>
    </div>`}brickButton(e){let t=e.entry_id===this.defaultAccount,s=t?`${e.name} opens by default`:`Open ${e.name} by default`;return n`<button
      class="brick"
      title=${s}
      aria-label=${s}
      aria-pressed=${t}
      @click=${()=>{t?void 0:this.makeDefault(e.entry_id)}}
    >
      <ha-icon
        icon=${t?"mdi:toy-brick":"mdi:toy-brick-outline"}
      ></ha-icon>
    </button>`}renderHome(){let e=this.dash;if(!e)return n`<p class="muted pad">Loading your collection…</p>`;let t=this.visible(),{anyOpen:s,next:a}=br(t,this.folded);return n`${Ne(e)}
      <div
        class="rows"
        @lego-toggle=${this.onToggle}
        @lego-move=${this.onMove}
        @lego-filter=${this.onFilter}
        @lego-changed=${this.onChanged}
      >
        <div class="homebar">
          ${this.renderMeter(e.quota)}
          <button class="link" @click=${()=>this.folded=a}>
            ${s?"Collapse all":"Expand all"}
          </button>
          <button
            class="link"
            aria-expanded=${this.customising}
            @click=${()=>this.customising=!this.customising}
          >
            ${this.customising?"Done":"Customise"}
          </button>
        </div>
        ${this.customising?this.renderCustomise(e):c}
        ${t.length?t.map(o=>this.renderRow(o,t)):n`<p class="muted">
                Every row is hidden. Choose Customise to bring some back.
              </p>`}
      </div>`}renderRow(e,t){let s={hass:this.hass,dash:this.dash,entryId:this.dash?.entry_id??"",collapsed:!!this.folded[e]},a;return Rr.includes(e)?a=n`<lego-releases-row
        .kind=${e}
        .hass=${s.hass}
        .dash=${s.dash}
        .entryId=${s.entryId}
        .collapsed=${s.collapsed}
        handle
      ></lego-releases-row>`:e==="value"||e==="pieces"?a=n`<lego-value-row
        .kind=${e}
        .hass=${s.hass}
        .dash=${s.dash}
        .entryId=${s.entryId}
        .collapsed=${s.collapsed}
        handle
      ></lego-value-row>`:e==="wishlist"?a=n`<lego-wishlist-row
        .hass=${s.hass}
        .dash=${s.dash}
        .entryId=${s.entryId}
        .collapsed=${s.collapsed}
        handle
      ></lego-wishlist-row>`:a=n`<lego-collection-row
        .hass=${s.hass}
        .dash=${s.dash}
        .entryId=${s.entryId}
        .collapsed=${s.collapsed}
        handle
      ></lego-collection-row>`,n`<div
      class=${["slot",this.dragging===e?"dragging":"",this.dragging&&this.over===e?"over":""].join(" ")}
      data-row=${e}
      @dragstart=${()=>this.dragging=e}
      @dragend=${()=>{this.dragging="",this.over=""}}
      @dragover=${o=>o.preventDefault()}
      @dragenter=${()=>this.over=e}
      @drop=${()=>this.onDrop(e,t)}
      @pointerdown=${o=>this.onTouchStart(o,e)}
      @pointermove=${this.onTouchMove}
      @pointerup=${()=>this.onTouchEnd(t)}
      @pointercancel=${()=>{this.dragging="",this.over=""}}
    >
      ${a}
    </div>`}renderCustomise(e){let t=st(e.rows,e.release_mode),s=e.release_status.all!==null;return n`<section class="row customise" aria-label="Customise this page">
      <h2>Customise this page</h2>
      <p class="muted">
        Saved to your Home Assistant user, so it follows you to every device.
      </p>
      <div class="setting">
        <span>Release rows</span>
        <div class="pills" role="group" aria-label="Release rows">
          ${["combined","separate"].map(a=>n`<button
                class=${e.release_mode===a?"pill on":"pill"}
                aria-pressed=${e.release_mode===a}
                @click=${()=>{this.save({release_mode:a})}}
              >
                ${a==="combined"?"Combined":"Separate"}
              </button>`)}
        </div>
      </div>
      <div class="setting">
        <span>Pictures</span>
        <div class="pills" role="group" aria-label="Picture size">
          ${Ae.map(a=>n`<button
                class=${e.picture_size===a?"pill on":"pill"}
                aria-pressed=${e.picture_size===a}
                @click=${()=>{this.save({picture_size:a})}}
              >
                ${Ce[a]}
              </button>`)}
        </div>
      </div>
      <div class="crow heading" aria-hidden="true">
        <span></span><span>Show</span><span>Row</span><span>Starts</span>
      </div>
      <ul>
        ${t.map(a=>this.renderCustomiseRow(e,a,t))}
      </ul>
      ${s?c:n`<p class="muted">
              For Everything, Out recently and Coming soon, turn on Follow
              releases across all themes in the integration's options.
            </p>`}
    </section>`}renderCustomiseRow(e,t,s){let a=ie[t].title,o=!e.hidden.includes(t),l=e.collapsed.includes(t)?"collapsed":"open",d=h=>{let u=e.collapsed.filter(g=>g!==t);h&&u.push(t),this.folded={...this.folded,[t]:h},this.save({collapsed:u})};return n`<li>
      <div class="crow">
        <button
          class="drag"
          data-custom=${t}
          aria-label=${`Move ${a} up or down`}
          title="Use the arrow keys to reorder"
          @keydown=${h=>{let u=h.key==="ArrowUp"?-1:h.key==="ArrowDown"?1:0;u&&(h.preventDefault(),this.move(t,u,s),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-custom="${t}"]`)?.focus()))}}
        >
          <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
        </button>
        <input
          type="checkbox"
          .checked=${o}
          aria-label=${`Show ${a}`}
          @change=${h=>{let u=h.target.checked,g=e.hidden.filter(v=>v!==t);u||g.push(t),this.save({hidden:g})}}
        />
        <span class="rowname"
          ><ha-icon icon=${ie[t].icon}></ha-icon>${a}</span
        >
        <div class="pills" role="group" aria-label=${`${a} starts`}>
          <button
            class=${l==="open"?"pill on":"pill"}
            aria-pressed=${l==="open"}
            @click=${()=>d(!1)}
          >
            Open
          </button>
          <button
            class=${l==="collapsed"?"pill on":"pill"}
            aria-pressed=${l==="collapsed"}
            @click=${()=>d(!0)}
          >
            Collapsed
          </button>
        </div>
      </div>
      ${Rr.includes(t)?this.renderStartsOn(e,t):c}
    </li>`}renderStartsOn(e,t){let s=Q(t,e),a=d=>{let h=e.release_filters[t]??{};this.save({release_filters:{...e.release_filters,[t]:{...h,...d}}})},o=(d,h,u)=>n`<button
        class=${h?"chip small on":"chip small"}
        aria-pressed=${h}
        @click=${u}
      >
        ${d}
      </button>`,l=t==="releases"||t==="themes";return n`<div class="startson">
      <span class="muted-label">Starts on</span>
      ${l&&t==="releases"&&e.release_status.all!==null?o("Everything",s.scope==="all",()=>a({scope:"all",themes:[]})):c}
      ${l&&e.followed.length?o(t==="themes"?"All my themes":"My themes",s.scope==="mine"&&!s.themes.length,()=>a({scope:"mine",themes:[]})):c}
      ${l?e.followed.map(d=>o(d,s.scope==="mine"&&s.themes.includes(d),()=>a({scope:"mine",themes:ze(s.scope==="mine"?s.themes:[],d,e.followed)}))):c}
      <label class="spanpick"
        >Span
        <select
          @change=${d=>a({span:d.target.value})}
        >
          ${M[t].map(d=>n`<option value=${d} ?selected=${d===s.span}>
                ${j(d)}
              </option>`)}
        </select></label
      >
    </div>`}};_.styles=[re,Oe,Le,se,$`
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
      .account.single {
        cursor: default;
        padding-inline-end: var(--ha-space-3, 12px);
      }
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
      .pick .unavailable {
        color: var(--lego-text-2);
        font-size: var(--ha-font-size-s, 12px);
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
    `],p([x({attribute:!1})],_.prototype,"hass",2),p([x({type:Boolean})],_.prototype,"narrow",2),p([x({type:Boolean,reflect:!0})],_.prototype,"dark",2),p([m()],_.prototype,"dash",2),p([m()],_.prototype,"error",2),p([m()],_.prototype,"accounts",2),p([m()],_.prototype,"account",2),p([m()],_.prototype,"defaultAccount",2),p([m()],_.prototype,"switching",2),p([m()],_.prototype,"picking",2),p([m()],_.prototype,"customising",2),p([m()],_.prototype,"folded",2),p([m()],_.prototype,"dragging",2),p([m()],_.prototype,"over",2);R("lego-panel",_);export{_ as LegoPanel};
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
lit-html/directive.js:
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
lit-html/directives/keyed.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
