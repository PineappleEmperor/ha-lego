var Rr=Object.defineProperty;var zr=Object.getOwnPropertyDescriptor;var p=(i,t,e,r)=>{for(var s=r>1?void 0:r?zr(t,e):t,a=i.length-1,o;a>=0;a--)(o=i[a])&&(s=(r?o(t,e,s):o(s))||s);return r&&s&&Rr(t,e,s),s};var me=globalThis,fe=me.ShadowRoot&&(me.ShadyCSS===void 0||me.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,He=Symbol(),ut=new WeakMap,ae=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==He)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(fe&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=ut.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ut.set(e,t))}return t}toString(){return this.cssText}},gt=i=>new ae(typeof i=="string"?i:i+"",void 0,He),$=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((r,s,a)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[a+1],i[0]);return new ae(e,i,He)},mt=(i,t)=>{if(fe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),s=me.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Ue=fe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return gt(e)})(i):i;var{is:Mr,defineProperty:Dr,getOwnPropertyDescriptor:Pr,getOwnPropertyNames:Or,getOwnPropertySymbols:Fr,getPrototypeOf:Lr}=Object,ve=globalThis,ft=ve.trustedTypes,Nr=ft?ft.emptyScript:"",Br=ve.reactiveElementPolyfillSupport,oe=(i,t)=>i,ne={toAttribute(i,t){switch(t){case Boolean:i=i?Nr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},be=(i,t)=>!Mr(i,t),vt={attribute:!0,type:String,converter:ne,reflect:!1,useDefault:!1,hasChanged:be};Symbol.metadata??=Symbol("metadata"),ve.litPropertyMetadata??=new WeakMap;var F=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=vt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Dr(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){let{get:s,set:a}=Pr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let l=s?.call(this);a?.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??vt}static _$Ei(){if(this.hasOwnProperty(oe("elementProperties")))return;let t=Lr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(oe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(oe("properties"))){let e=this.properties,r=[...Or(e),...Fr(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(Ue(s))}else t!==void 0&&e.push(Ue(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let a=(r.converter?.toAttribute!==void 0?r.converter:ne).toAttribute(e,r.type);this._$Em=t,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let a=r.getPropertyOptions(s),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:ne;this._$Em=s;let l=o.fromAttribute(e,a.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,r,s=!1,a){if(t!==void 0){let o=this.constructor;if(s===!1&&(a=this[t]),r??=o.getPropertyOptions(t),!((r.hasChanged??be)(a,e)||r.useDefault&&r.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:a},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),a!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,a]of r){let{wrapped:o}=a,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,a,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};F.elementStyles=[],F.shadowRootOptions={mode:"open"},F[oe("elementProperties")]=new Map,F[oe("finalized")]=new Map,Br?.({ReactiveElement:F}),(ve.reactiveElementVersions??=[]).push("2.1.2");var We=globalThis,bt=i=>i,ye=We.trustedTypes,yt=ye?ye.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ge="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,Ve="?"+L,jr=`<${Ve}>`,q=document,ce=()=>q.createComment(""),de=i=>i===null||typeof i!="object"&&typeof i!="function",Ke=Array.isArray,St=i=>Ke(i)||typeof i?.[Symbol.iterator]=="function",qe=`[ 	
\f\r]`,le=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xt=/-->/g,wt=/>/g,H=RegExp(`>|${qe}(?:([^\\s"'>=/]+)(${qe}*=${qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$t=/'/g,kt=/"/g,Et=/^(?:script|style|textarea|title)$/i,Ye=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),n=Ye(1),O=Ye(2),Ss=Ye(3),W=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),_t=new WeakMap,U=q.createTreeWalker(q,129);function At(i,t){if(!Ke(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return yt!==void 0?yt.createHTML(t):t}var Ct=(i,t)=>{let e=i.length-1,r=[],s,a=t===2?"<svg>":t===3?"<math>":"",o=le;for(let l=0;l<e;l++){let d=i[l],h,u,g=-1,v=0;for(;v<d.length&&(o.lastIndex=v,u=o.exec(d),u!==null);)v=o.lastIndex,o===le?u[1]==="!--"?o=xt:u[1]!==void 0?o=wt:u[2]!==void 0?(Et.test(u[2])&&(s=RegExp("</"+u[2],"g")),o=H):u[3]!==void 0&&(o=H):o===H?u[0]===">"?(o=s??le,g=-1):u[1]===void 0?g=-2:(g=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?H:u[3]==='"'?kt:$t):o===kt||o===$t?o=H:o===xt||o===wt?o=le:(o=H,s=void 0);let b=o===H&&i[l+1].startsWith("/>")?" ":"";a+=o===le?d+jr:g>=0?(r.push(h),d.slice(0,g)+Ge+d.slice(g)+L+b):d+L+(g===-2?l:b)}return[At(i,a+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},he=class i{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let a=0,o=0,l=t.length-1,d=this.parts,[h,u]=Ct(t,e);if(this.el=i.createElement(h,r),U.currentNode=this.el.content,e===2||e===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(s=U.nextNode())!==null&&d.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let g of s.getAttributeNames())if(g.endsWith(Ge)){let v=u[o++],b=s.getAttribute(g).split(L),k=/([.?@])?(.*)/.exec(v);d.push({type:1,index:a,name:k[2],strings:b,ctor:k[1]==="."?we:k[1]==="?"?$e:k[1]==="@"?ke:V}),s.removeAttribute(g)}else g.startsWith(L)&&(d.push({type:6,index:a}),s.removeAttribute(g));if(Et.test(s.tagName)){let g=s.textContent.split(L),v=g.length-1;if(v>0){s.textContent=ye?ye.emptyScript:"";for(let b=0;b<v;b++)s.append(g[b],ce()),U.nextNode(),d.push({type:2,index:++a});s.append(g[v],ce())}}}else if(s.nodeType===8)if(s.data===Ve)d.push({type:2,index:a});else{let g=-1;for(;(g=s.data.indexOf(L,g+1))!==-1;)d.push({type:7,index:a}),g+=L.length-1}a++}}static createElement(t,e){let r=q.createElement("template");return r.innerHTML=t,r}};function G(i,t,e=i,r){if(t===W)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl,a=de(t)?void 0:t._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),a===void 0?s=void 0:(s=new a(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=G(i,s._$AS(i,t.values),s,r)),t}var xe=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??q).importNode(e,!0);U.currentNode=s;let a=U.nextNode(),o=0,l=0,d=r[0];for(;d!==void 0;){if(o===d.index){let h;d.type===2?h=new X(a,a.nextSibling,this,t):d.type===1?h=new d.ctor(a,d.name,d.strings,this,t):d.type===6&&(h=new _e(a,this,t)),this._$AV.push(h),d=r[++l]}o!==d?.index&&(a=U.nextNode(),o++)}return U.currentNode=q,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},X=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),de(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==W&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):St(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&de(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=he.createElement(At(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{let a=new xe(s,this),o=a.u(this.options);a.p(e),this.T(o),this._$AH=a}}_$AC(t){let e=_t.get(t.strings);return e===void 0&&_t.set(t.strings,e=new he(t)),e}k(t){Ke(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let a of t)s===e.length?e.push(r=new i(this.O(ce()),this.O(ce()),this,this.options)):r=e[s],r._$AI(a),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=bt(t).nextSibling;bt(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},V=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,a){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=c}_$AI(t,e=this,r,s){let a=this.strings,o=!1;if(a===void 0)t=G(this,t,e,0),o=!de(t)||t!==this._$AH&&t!==W,o&&(this._$AH=t);else{let l=t,d,h;for(t=a[0],d=0;d<a.length-1;d++)h=G(this,l[r+d],e,d),h===W&&(h=this._$AH[d]),o||=!de(h)||h!==this._$AH[d],h===c?t=c:t!==c&&(t+=(h??"")+a[d+1]),this._$AH[d]=h}o&&!s&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},we=class extends V{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},$e=class extends V{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},ke=class extends V{constructor(t,e,r,s,a){super(t,e,r,s,a),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??c)===W)return;let r=this._$AH,s=t===c&&r!==c||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,a=t!==c&&(r===c||s);s&&this.element.removeEventListener(this.name,this,r),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},_e=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}},Tt={M:Ge,P:L,A:Ve,C:1,L:Ct,R:xe,D:St,V:G,I:X,H:V,N:$e,U:ke,B:we,F:_e},Ir=We.litHtmlPolyfillSupport;Ir?.(he,X),(We.litHtmlVersions??=[]).push("3.3.3");var Rt=(i,t,e)=>{let r=e?.renderBefore??t,s=r._$litPart$;if(s===void 0){let a=e?.renderBefore??null;r._$litPart$=s=new X(t.insertBefore(ce(),a),a,void 0,e??{})}return s._$AI(i),s};var Xe=globalThis,C=class extends F{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};C._$litElement$=!0,C.finalized=!0,Xe.litElementHydrateSupport?.({LitElement:C});var Hr=Xe.litElementPolyfillSupport;Hr?.({LitElement:C});(Xe.litElementVersions??=[]).push("4.2.2");var Ur={attribute:!0,type:String,converter:ne,reflect:!1,hasChanged:be},qr=(i=Ur,t,e)=>{let{kind:r,metadata:s}=e,a=globalThis.litPropertyMetadata.get(s);if(a===void 0&&globalThis.litPropertyMetadata.set(s,a=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),a.set(e.name,i),r==="accessor"){let{name:o}=e;return{set(l){let d=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,d,i,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(r==="setter"){let{name:o}=e;return function(l){let d=this[o];t.call(this,l),this.requestUpdate(o,d,i,!0,l)}}throw Error("Unsupported decorator location: "+r)};function w(i){return(t,e)=>typeof e=="object"?qr(i,t,e):((r,s,a)=>{let o=s.hasOwnProperty(a);return s.constructor.createProperty(a,r),o?Object.getOwnPropertyDescriptor(s,a):void 0})(i,t,e)}function m(i){return w({...i,state:!0,attribute:!1})}function Dt(i,t){let e=i.reduce((h,u)=>h+u,0)/(i.length||1),r=h=>12*(i[h]+i[h+1])/2/e,s=0,a=0;for(let[h,u]of i.entries()){let g=a+(h?r(h-1):0)+u;if(g>t)break;a=g,s=h+1}let o=Array.from({length:Math.max(s-1,0)},(h,u)=>r(u)),l=t-a,d=o.map((h,u)=>u);for(;l>.5&&d.length;){let h=d.reduce((g,v)=>g+r(v),0),u=l;l=0,d=d.filter(g=>{let v=r(g)*10,b=o[g]+u*r(g)/h;return o[g]=Math.min(b,v),l+=b-o[g],o[g]<v})}return{count:s,gaps:o.map(h=>Math.round(h*10)/10)}}var Wr="{?}";function Pt(i,t){return{device_id:i,set_number:t.set_number,owned:!t.owned}}function Ot(i){return{device_id:i}}function R(i,t){return t?{type:i,config_entry_id:t}:{type:i}}function Ft(i,t){if(!i)return"Not synced yet";let e=Math.floor((t.getTime()-new Date(i).getTime())/6e4);if(e<1)return"Updated just now";let r=new Intl.RelativeTimeFormat("en",{numeric:"always"});if(e<60)return`Updated ${r.format(-e,"minute")}`;let s=Math.floor(e/60);return s<48?`Updated ${r.format(-s,"hour")}`:`Updated ${r.format(-Math.floor(s/24),"day")}`}function Ze(i,t,e,r=!1){return i==null||!t?"":new Intl.NumberFormat(e,{style:"currency",currency:t,...r?{maximumFractionDigits:0}:{}}).format(i)}function E(i){return i instanceof Error?i.message:i&&typeof i=="object"&&"message"in i?String(i.message):String(i)}function Lt(i){let t=[];for(let e of i){let r=e.state??e.mean;r!=null&&t.push({t:new Date(e.start).getTime(),v:r})}return t}function Nt(i,t,e=6){let r=[...i].filter(o=>o[t]>0).sort((o,l)=>l[t]-o[t]),s=r.slice(0,e).map(o=>({theme:o.theme,amount:o[t],sets:o.sets,setNumbers:o.set_numbers??[],other:!1})),a=r.slice(e);return a.length&&s.push({theme:`Other (${A(a.length,"theme","themes")})`,amount:a.reduce((o,l)=>o+l[t],0),sets:a.reduce((o,l)=>o+l.sets,0),setNumbers:a.flatMap(o=>o.set_numbers??[]).sort(),other:!0}),s}function A(i,t,e){return`${i.toLocaleString()} ${i===1?t:e}`}var Qe=100;function Bt(i,t,e){let r=Qe-t;return[`${i} of today's ${t} calls used.`,r>0?`The other ${r} of the ${Qe} Brickset allows each API key a day are left unused, for anything else on your key.`:`Your budget is all ${Qe} calls Brickset allows each API key a day.`,`The count starts again at ${e}.`].join(" ")}var Gr=60;function jt(i,t,e="retirement"){if(e==="release"&&i.available_from)return new Date(i.available_from)>t?"due":"";if(i.available_until){let r=new Date(i.available_until).getTime();return r<t.getTime()?"retired":(r-t.getTime())/864e5<=Gr?"retiring":""}return i.available_from&&new Date(i.available_from)>t?"due":""}function It(i,t,e,r="retirement"){return i.partial?"Details not loaded":r==="release"&&i.available_from?`${new Date(i.available_from)>t?"Due":"Out"} ${e(i.available_from)}`:i.available_until?`${new Date(i.available_until)<t?"Retired":"Retires"} ${e(i.available_until)}`:i.available_from?`${new Date(i.available_from)>t?"Due":"Out"} ${e(i.available_from)}`:pe(i)?"Date unknown":"Details tbd"}function Ee(i){if(!i)return null;try{let t=new URL(i);return t.protocol==="https:"||t.protocol==="http:"?t.href:null}catch{return null}}var et="/api/lego/image/";function zt(i){return i?.startsWith(et)?i:Ee(i)}var Ae=["small","medium","large"],Ce={small:"Small",medium:"Medium",large:"Large"},Vr={small:140,medium:280,large:420},Kr=240,Yr=690;function Ht(i,t="small"){let e=zt(i.image),r=zt(i.image_large),s=Ee(i.image_remote);return{src:e,sharp:e&&r?{srcset:`${e} ${Kr}w, ${r} ${Yr}w`,sizes:`${Vr[t]}px`}:null,fallback:s&&s!==e?s:null}}function pe(i){let t=(i.name??"").trim();return t!==""&&t!==Wr}function I(i){return pe(i)?i.name:"Name tbd"}var Xr={around:"Now",year:"This year",past3:"Past 3 months",past1:"Past month",next1:"Next month",next3:"Next 3 months",coming:"Unreleased"},Ut={around:"Three months either side of today",year:"January to December",coming:"Every set announced and not yet out, with a date or without"};function j(i,t=new Date){return i==="year"?String(t.getFullYear()):Xr[i]}function qt(i,t){return!t||M[i].includes(t)?"":`This row offers ${M[i].map(r=>j(r)).join(", ")}, not ${j(t)}.`}var M={releases:["past3","around","year","coming"],themes:["past3","around","year","coming"],recent:["past3"],upcoming:["coming"]},Qr={recent:"all",upcoming:"all",themes:"mine"};function Q(i,t){let e=t.release_filters?.[i]??{},r=t.release_status.all!==null,s=Qr[i],a=t.followed.length||!r?"mine":"all",o=s??e.scope??a;o==="all"&&!r&&(o="mine");let l=new Set(t.followed.map(g=>g.toLowerCase())),d=o==="mine"?(e.themes??[]).filter(g=>l.has(g.toLowerCase())):[],h=M[i],u=e.span&&h.includes(e.span)?e.span:i==="upcoming"?"coming":i==="recent"?"past3":"around";return{scope:o,themes:d,span:u}}function Te(i,t,e){let r=i.includes(t)?i.filter(s=>s!==t):[...i,t];return r.length===e.length?[]:r}var B=15,Jr=3,Je=2,Mt=.25;function Wt(i,t,e){if(!e)return{from:0,to:B,width:1};let r=Math.max(i-Mt,0),s=Math.min(t+Mt,B),a=Je-(s-r);return a>0&&(r=Math.max(r-a/2,0),s=Math.min(r+Je,B),r=Math.max(s-Je,0)),{from:r,to:s,width:Math.max((s-r)/Jr,1)}}function J(i,t){let e=typeof t=="string"?new Date(`${t.slice(0,10)}T00:00:00`):t,r=(e.getFullYear()-i.getFullYear())*12+e.getMonth()-i.getMonth(),s=new Date(e.getFullYear(),e.getMonth()+1,0).getDate();return r+(e.getDate()-1)/s}function Gt(i,t,e=.15,r=4){let s=[];for(let a of[...i].sort((o,l)=>o.date.localeCompare(l.date))){let o=J(t,a.date);if(o<0||o>B)continue;let l=s[s.length-1];l&&o-l.at<=e?l.points.push(a):s.push({at:o,points:[a]})}return s.map(a=>{let o=a.points.length>r?r-1:r;return{at:a.at,themes:a.points.slice(0,o).map(l=>l.theme),extra:Math.max(a.points.length-o,0),points:a.points}})}function Vt(i,t,e){return i>0?e*t/i:.15}function tt(i,t=5){return Array.from({length:i},(e,r)=>(r-(i-1)/2)*t)}var Zr=["recent","upcoming","themes"];function rt(i,t){let e=t==="combined"?Zr:["releases"];return i.filter(r=>!e.includes(r))}function Kt(i,t,e,r){let s=t[t.indexOf(e)+r];if(!s)return i;let a=i.filter(o=>o!==e);return a.splice(a.indexOf(s)+(r>0?1:0),0,e),a}var Re=new Map,K="lego-invalidated";function Qt(i,t){let e=Re.get(t);return e||(e=i.callWS(R("lego/dashboard",t)),Re.set(t,e),e.catch(()=>Re.delete(t))),e}function Z(){Re.clear(),window.dispatchEvent(new Event(K))}function es(i=import.meta.url){try{return new URL(i).searchParams.get("v")}catch{return null}}function Jt(i,t=import.meta.url){let e=es(t);return!!i&&!!e&&i!==e}var Yt=new WeakSet;function ze(i){let t=i.connection;!t||Yt.has(t)||(Yt.add(t),t.addEventListener("ready",Z))}var ts=6e4,Xt=Number.NEGATIVE_INFINITY;function Zt(i=Date.now()){return i-Xt<ts?!1:(Xt=i,Z(),!0)}function er(i,t,e){return i.callWS({...R("lego/releases",t),scope:e.scope,themes:e.themes,span:e.span})}var tr=i=>(...t)=>({_$litDirective$:i,values:t}),Me=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:fi}=Tt;var rs={},rr=(i,t=rs)=>i._$AH=t;var sr=tr(class extends Me{constructor(){super(...arguments),this.key=c}render(i,t){return this.key=i,t}update(i,[t,e]){return t!==this.key&&(rr(i),this.key=t),e}});var ir={tag:"svg",attrs:{viewBox:"0.50 1.19 99.00 99.00"},children:[{tag:"polygon",attrs:{points:"4.000,34.558 50.000,61.116 50.000,93.389 4.000,66.831",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 88%, black)"}},{tag:"polygon",attrs:{points:"50.000,61.116 96.000,34.558 96.000,66.831 50.000,93.389",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 59%, black)"}},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 50.000,61.116 4.000,34.558",style:"fill:var(--primary-color, #009ac7)"}},{tag:"g",attrs:{"stroke-width":"0.5",fill:"none","stroke-linecap":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M4.000,34.558 L50.000,61.116 L96.000,34.558"}},{tag:"path",attrs:{d:"M50.000,61.116 L50.000,93.389"}}]},{tag:"polygon",attrs:{points:"50.000,8.000 96.000,34.558 96.000,66.831 50.000,93.389 4.000,66.831 4.000,34.558",fill:"none","stroke-width":"2.0","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"}},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,16.236 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"16.236",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M18.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"27.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M64.091,29.515 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"73.000",cy:"29.515",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{"stroke-width":"0.5","stroke-linejoin":"round",style:"stroke:color-mix(in srgb, var(--primary-color, #009ac7) 42%, black)"},children:[{tag:"path",attrs:{d:"M41.091,42.794 v5.043 a8.909,5.143 0 0 0 17.817,0 v-5.043 z",style:"fill:color-mix(in srgb, var(--primary-color, #009ac7) 80%, black)"}},{tag:"ellipse",attrs:{cx:"50.000",cy:"42.794",rx:"8.909",ry:"5.143",style:"fill:var(--primary-color, #009ac7)"}}]},{tag:"g",attrs:{transform:"translate(11.596,34.314) scale(0.12837)"},children:[{tag:"g",attrs:{stroke:"#FFFFFF","stroke-width":"17.0","stroke-linecap":"round",fill:"none"},children:[{tag:"line",attrs:{x1:"120.00",y1:"153.05",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"60.00",y1:"214.40",x2:"120.00",y2:"309.04"}},{tag:"line",attrs:{x1:"180.00",y1:"249.69",x2:"120.00",y2:"275.05"}}]},{tag:"g",attrs:{fill:"#FFFFFF"},children:[{tag:"circle",attrs:{cx:"120.00",cy:"153.05",r:"19.38"}},{tag:"circle",attrs:{cx:"60.00",cy:"214.40",r:"19.38"}},{tag:"circle",attrs:{cx:"180.00",cy:"249.69",r:"19.38"}}]}]}]},st=[{part:"3005",size:"1x1",colour:"Red",width:38.44,svg:{tag:"svg",attrs:{viewBox:"0 0 38.44 55.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 19.220,29.723 19.220,54.027 1.900,44.027",fill:"#B01708"}},{tag:"polygon",attrs:{points:"19.220,29.723 36.540,19.723 36.540,44.027 19.220,54.027",fill:"#770F05"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 19.220,29.723 1.900,19.723",fill:"#C91A09"}},{tag:"path",attrs:{d:"M1.90,19.72 L19.22,29.72 L36.54,19.72 M19.22,29.72 L19.22,54.03",stroke:"#550B04","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 36.540,19.723 36.540,44.027 19.220,54.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#550B04","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#550B04","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#A11507",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F01F0B",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3004",size:"1x2",colour:"Orange",width:55.76,svg:{tag:"svg",attrs:{viewBox:"0 0 55.76 65.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 36.540,39.723 36.540,64.027 1.900,44.027",fill:"#F27901"}},{tag:"polygon",attrs:{points:"36.540,39.723 53.860,29.723 53.860,54.027 36.540,64.027",fill:"#A45201"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 36.540,39.723 1.900,19.723",fill:"#FE8A18"}},{tag:"path",attrs:{d:"M1.90,19.72 L36.54,39.72 L53.86,29.72 M36.54,39.72 L36.54,64.03",stroke:"#763B01","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 53.860,29.723 53.860,54.027 36.540,64.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#763B01","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#763B01","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DE6E01",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#FE9F41",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3010",size:"1x4",colour:"Yellow",width:90.4,svg:{tag:"svg",attrs:{viewBox:"0 0 90.40 85.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 71.180,59.723 71.180,84.027 1.900,44.027",fill:"#F0C414"}},{tag:"polygon",attrs:{points:"71.180,59.723 88.500,49.723 88.500,74.027 71.180,84.027",fill:"#A6870B"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 71.180,59.723 1.900,19.723",fill:"#F2CD37"}},{tag:"path",attrs:{d:"M1.90,19.72 L71.18,59.72 L88.50,49.72 M71.18,59.72 L71.18,84.03",stroke:"#766108","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 88.500,49.723 88.500,74.027 71.180,84.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#766108","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#766108","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#DFB60F",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#F4D75D",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3001",size:"2x4",colour:"Green",width:107.72,svg:{tag:"svg",attrs:{viewBox:"0 0 107.72 95.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 71.180,69.723 71.180,94.027 1.900,54.027",fill:"#1F6939"}},{tag:"polygon",attrs:{points:"71.180,69.723 105.820,49.723 105.820,74.027 71.180,94.027",fill:"#154727"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 71.180,69.723 1.900,29.723",fill:"#237841"}},{tag:"path",attrs:{d:"M1.90,29.72 L71.18,69.72 L105.82,49.72 M71.18,69.72 L71.18,94.03",stroke:"#0F331C","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 105.820,49.723 105.820,74.027 71.180,94.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#0F331C","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#0F331C","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#1C6034",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#2C9852",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3009",size:"1x6",colour:"Dark Azure",width:125.04,svg:{tag:"svg",attrs:{viewBox:"0 0 125.04 105.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 105.820,79.723 105.820,104.027 1.900,44.027",fill:"#067AB0"}},{tag:"polygon",attrs:{points:"105.820,79.723 123.140,69.723 123.140,94.027 105.820,104.027",fill:"#045377"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 105.820,79.723 1.900,19.723",fill:"#078BC9"}},{tag:"path",attrs:{d:"M1.90,19.72 L105.82,79.72 L123.14,69.72 M105.82,79.72 L105.82,104.03",stroke:"#033B55","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 123.140,69.723 123.140,94.027 105.820,104.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#033B55","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#033B55","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#066FA1",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#08A6F0",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"2456",size:"2x6",colour:"Blue",width:142.36,svg:{tag:"svg",attrs:{viewBox:"0 0 142.36 115.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 105.820,89.723 105.820,114.027 1.900,54.027",fill:"#004AA7"}},{tag:"polygon",attrs:{points:"105.820,89.723 140.460,69.723 140.460,94.027 105.820,114.027",fill:"#003271"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 105.820,89.723 1.900,29.723",fill:"#0055BF"}},{tag:"path",attrs:{d:"M1.90,29.72 L105.82,89.72 L140.46,69.72 M105.82,89.72 L105.82,114.03",stroke:"#002451","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 140.460,69.723 140.460,94.027 105.820,114.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#002451","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#002451","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#004499",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#0067E8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3008",size:"1x8",colour:"Dark Purple",width:159.68,svg:{tag:"svg",attrs:{viewBox:"0 0 159.68 125.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,19.723 140.460,99.723 140.460,124.027 1.900,44.027",fill:"#372F7F"}},{tag:"polygon",attrs:{points:"140.460,99.723 157.780,89.723 157.780,114.027 140.460,124.027",fill:"#252056"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 140.460,99.723 1.900,19.723",fill:"#3F3691"}},{tag:"path",attrs:{d:"M1.90,19.72 L140.46,99.72 L157.78,89.72 M140.46,99.72 L140.46,124.03",stroke:"#1B173E","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"19.220,9.723 157.780,89.723 157.780,114.027 140.460,124.027 1.900,44.027 1.900,19.723",fill:"none",stroke:"#1B173E","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M12.51,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"19.22",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M29.83,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"36.54",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M47.15,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"53.86",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M64.47,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"71.18",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M81.79,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"88.50",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M99.11,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"105.82",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M116.43,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"123.14",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#1B173E","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#322B74",d:"M133.75,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#4C41AF",cx:"140.46",cy:"85.93",rx:"6.71",ry:"3.87"}}]}]}},{part:"3007",size:"2x8",colour:"Medium Lavender",width:177,svg:{tag:"svg",attrs:{viewBox:"0 0 177.00 135.93","aria-hidden":"true"},children:[{tag:"polygon",attrs:{points:"1.900,29.723 140.460,109.723 140.460,134.027 1.900,54.027",fill:"#9D5FAD"}},{tag:"polygon",attrs:{points:"140.460,109.723 175.100,89.723 175.100,114.027 140.460,134.027",fill:"#6C3D78"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 140.460,109.723 1.900,29.723",fill:"#AC78BA"}},{tag:"path",attrs:{d:"M1.90,29.72 L140.46,109.72 L175.10,89.72 M140.46,109.72 L140.46,134.03",stroke:"#4D2C56","stroke-width":"0.24",fill:"none","stroke-linecap":"round"}},{tag:"polygon",attrs:{points:"36.540,9.723 175.100,89.723 175.100,114.027 140.460,134.027 1.900,54.027 1.900,29.723",fill:"none",stroke:"#4D2C56","stroke-width":"0.90","stroke-linejoin":"round"}},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,15.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"15.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M12.51,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"19.22",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,25.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"25.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M29.83,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"36.54",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,35.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"35.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M47.15,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"53.86",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,45.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"45.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M64.47,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"71.18",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,55.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"55.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M81.79,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"88.50",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,65.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"65.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M99.11,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"105.82",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,75.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"75.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M116.43,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"123.14",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M151.07,85.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"157.78",cy:"85.93",rx:"6.71",ry:"3.87"}}]},{tag:"g",attrs:{stroke:"#4D2C56","stroke-width":"0.24","stroke-linejoin":"round"},children:[{tag:"path",attrs:{fill:"#9153A2",d:"M133.75,95.93 v3.80 a6.71,3.87 0 0 0 13.42,0 v-3.80 z"}},{tag:"ellipse",attrs:{fill:"#BD93C8",cx:"140.46",cy:"95.93",rx:"6.71",ry:"3.87"}}]}]}}];function De(i){return n`<svg
    viewBox=${i.attrs.viewBox??c}
    aria-hidden="true"
    focusable="false"
  >
    ${(i.children??[]).map(ar)}
  </svg>`}function ar(i){let t=r=>i.attrs[r]??c,e=()=>(i.children??[]).map(ar);switch(i.tag){case"g":return O`<g transform=${t("transform")} fill=${t("fill")} stroke=${t("stroke")}
        stroke-width=${t("stroke-width")} stroke-linecap=${t("stroke-linecap")}
        stroke-linejoin=${t("stroke-linejoin")} style=${t("style")}>${e()}</g>`;case"polygon":return O`<polygon points=${t("points")} fill=${t("fill")} stroke=${t("stroke")}
        stroke-width=${t("stroke-width")} stroke-linejoin=${t("stroke-linejoin")}
        style=${t("style")}></polygon>`;case"path":return O`<path d=${t("d")} fill=${t("fill")} stroke=${t("stroke")}
        stroke-width=${t("stroke-width")} stroke-linecap=${t("stroke-linecap")}
        stroke-linejoin=${t("stroke-linejoin")} style=${t("style")}></path>`;case"ellipse":return O`<ellipse cx=${t("cx")} cy=${t("cy")} rx=${t("rx")} ry=${t("ry")}
        fill=${t("fill")} style=${t("style")}></ellipse>`;case"circle":return O`<circle cx=${t("cx")} cy=${t("cy")} r=${t("r")} fill=${t("fill")}
        style=${t("style")}></circle>`;case"line":return O`<line x1=${t("x1")} y1=${t("y1")} x2=${t("x2")} y2=${t("y2")}
        stroke=${t("stroke")} stroke-width=${t("stroke-width")}
        style=${t("style")}></line>`;default:return c}}var ss=.54,or=st.map(i=>Math.round(i.width*ss)),ue=class extends C{constructor(){super(...arguments);this.width=0}connectedCallback(){super.connectedCallback(),this.observer=new ResizeObserver(([e])=>{this.width=Math.floor(e.contentRect.width)}),this.observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.observer?.disconnect()}render(){let{count:e,gaps:r}=Dt(or,this.width);return n`<div class="bricks" aria-hidden="true">
      ${st.slice(0,e).map((s,a)=>n`<div style="width:${or[a]}px;margin-right:${r[a]??0}px">
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
  `,p([m()],ue.prototype,"width",2);customElements.get("lego-bricks")||customElements.define("lego-bricks",ue);var Pe=$`
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
`,nr=1,is=2,lr=3,it=4,as=5,at=6,cr=7,dr=8,os={"star wars":nr,botanicals:at,"botanical collection":at,icons:it,"creator expert":it,technic:cr,"harry potter":dr,city:lr},ns=[is,as,nr,lr,it,at,cr,dr];function ee(i){let t=new Map,e=new Set;for(let r of i){let s=os[r.toLowerCase()];s&&!e.has(s)&&(t.set(r,s),e.add(s))}for(let r of i){if(t.has(r))continue;let s=ns.find(a=>!e.has(a));s===void 0?t.set(r,"other"):(t.set(r,s),e.add(s))}return t}function te(i){return i===void 0||i==="other"?"var(--lego-series-other)":`var(--lego-series-${i})`}function hr(i){let t=!i.owned;return{owned:t,qty_owned:t?Math.max(i.qty_owned,1):0}}function pr(i){return i.filter(t=>t.partial).map(t=>t.set_number)}function ur(i,t){return!!i&&!!t&&i.entry_id===t.entry_id}function Oe(i){return i.trim().length>=2}function gr(i,t){let e=i.some(r=>!t[r]);return{anyOpen:e,next:Object.fromEntries(i.map(r=>[r,e]))}}function mr(i){return{share:Math.min(i.calls_today/(i.budget||1),1),tight:i.remaining<i.refresh_cost*3}}function fr(i){let t=i.mine&&i.open,e=i.wiggling?"done":t||!i.followed?"edit":"none";return{themes:t,trailing:e}}function vr(i,t){return i?{open:!t,pick:!1}:{open:!1,pick:!0}}function br(i,t){return i?"spent":t?"ignored":"pick"}var re=$`
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
`,Fe=$`
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
`,yr=$`
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
`;var xr="/lego_panel/icon.png";function Le(i){return Jt(i?.version)?n`<div class="updated" role="status">
    <span>LEGO was updated. Reload to finish.</span>
    <button class="link" @click=${()=>location.reload()}>Reload</button>
  </div>`:c}function z(i,t){customElements.get(i)||customElements.define(i,t)}var ge="lego-changed",ls="lego-toggle",cs="lego-move",wr="lego-filter",ie={collection:{title:"My collection",icon:"mdi:toy-brick-outline"},releases:{title:"New releases",icon:"mdi:new-box"},recent:{title:"Out recently",icon:"mdi:new-box"},upcoming:{title:"Coming soon",icon:"mdi:calendar-clock"},themes:{title:"New in my themes",icon:"mdi:tag-heart-outline"},wishlist:{title:"My wishlist",icon:"mdi:heart-outline"},value:{title:"Collection value",icon:"mdi:chart-donut"},pieces:{title:"Pieces",icon:"mdi:shape-outline"}},y=class extends C{constructor(){super(...arguments);this.entryId="";this.collapsed=!1;this.handle=!1;this.bare=!1;this.dark=!1;this.pending=new Set;this.writeError="";this.toggle=()=>{this.collapsed=!this.collapsed,this.dispatchEvent(new CustomEvent(ls,{detail:{row:this.row,collapsed:this.collapsed},bubbles:!0,composed:!0}))};this.onHandleKey=e=>{let r=e.key==="ArrowUp"?-1:e.key==="ArrowDown"?1:0;r&&(e.preventDefault(),this.dispatchEvent(new CustomEvent(cs,{detail:{row:this.row,step:r},bubbles:!0,composed:!0})))};this.reveal=e=>{e.target.classList.add("ready")};this.dropSharp=e=>{e.target.remove()};this.noArt=e=>{let r=e.target;if(r.classList.contains("noart"))return;r.src.includes(et)&&Zt();let s=r.dataset.fallback;if(s&&r.src!==s){r.removeAttribute("srcset"),r.src=s;return}r.classList.add("noart"),r.removeAttribute("srcset"),r.src=xr}}actions(){return c}willUpdate(e){e.has("hass")&&(this.dark=!!this.hass?.themes?.darkMode),this.setAttribute("picture-size",this.size())}render(){let e=ie[this.row];return n`
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
    `}focusHandle(){this.renderRoot.querySelector(".drag")?.focus()}date(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:r.toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short",year:"numeric"})}num(e){return e.toLocaleString(this.hass?.locale?.language)}money(e,r=!0){return Ze(e,this.dash?.currency??null,this.hass?.locale?.language,r)||this.num(Math.round(e))}async toggleOwned(e){if(!this.pending.has(e.set_number)){this.writeError="",this.setPending(e.set_number,!0);try{await this.hass.callService("lego","set_collection",Pt(this.dash?.device_id??"",e))}catch(r){this.writeError=E(r);return}finally{this.setPending(e.set_number,!1)}Object.assign(e,hr(e)),this.requestUpdate(),this.dispatchEvent(new CustomEvent(ge,{bubbles:!0,composed:!0}))}}setPending(e,r){let s=new Set(this.pending);r?s.add(e):s.delete(e),this.pending=s}linked(e,r,s=!1){let a=Ee(e.url);return a?n`<a
      class="open"
      href=${a}
      target="_blank"
      rel="noopener noreferrer"
      tabindex=${s?"-1":c}
      aria-hidden=${s?"true":c}
      >${r}</a
    >`:r}themeColour(e){let r=this.dash?.followed??[],s=r.find(a=>a.toLowerCase()===e.toLowerCase());return te(s?ee(r).get(s):"other")}size(){return this.pictureSize??this.dash?.picture_size??"medium"}card(e,r="retirement",s,a=!0){let o=new Date,l=e.available_until?new Date(e.available_until):null,d=l&&l<o?l:null,h=Ht(e,this.size()),u=h.src??h.fallback,g=a?Ze(e.retail_price,this.dash?.currency??null,this.hass?.locale?.language):"";return n`
      <article class="card">
        ${this.linked(e,n`${sr(e.set_number,n`<span class="pic"
              >${u?n`<img
                      src=${u}
                      data-fallback=${h.fallback??c}
                      alt=""
                      loading="lazy"
                      @error=${this.noArt}
                    />`:n`<img
                      class="noart"
                      src=${xr}
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
        ${e.wanted?n`<span class="stamp">Wanted</span>`:c}
        ${e.wanted&&d?n`<span class="seal"
                ><span>Retired</span
                ><span class="year">${d.getFullYear()}</span></span
              >`:c}
        <div class="meta">
          ${this.linked(e,n`<span
              class=${pe(e)?"name":"name unnamed"}
              title=${pe(e)?e.name:"Brickset has not published a name yet"}
              >${I(e)}</span
            >`)}
          <span class="num"
            >${s?n`<span
                    class="key"
                    style="background:${s}"
                    title=${e.theme}
                  ></span>`:c}${[e.set_number,g].filter(Boolean).join(" \xB7 ")}</span
          >
          <span class="when ${jt(e,o,r)}"
            >${It(e,o,v=>this.date(v),r)}</span
          >
          <div class="foot">
            <span class=${e.owned?"state own":"state"}
              >${e.owned?e.qty_owned>1?`Owned \xD7${e.qty_owned}`:"Owned":""}</span
            >
            <button
              class=${["act",e.owned?"on":"",this.pending.has(e.set_number)?"pending":""].join(" ")}
              ?disabled=${this.pending.has(e.set_number)}
              title=${e.owned?"Remove from your collection":"Add to your collection"}
              aria-label=${e.owned?`Remove ${I(e)} from your collection`:`Add ${I(e)} to your collection`}
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
    </div>`}};y.styles=[re,Pe,Fe,se,yr],p([w({attribute:!1})],y.prototype,"hass",2),p([w({attribute:!1})],y.prototype,"dash",2),p([w({attribute:!1})],y.prototype,"entryId",2),p([w({type:Boolean,reflect:!0})],y.prototype,"collapsed",2),p([w({type:Boolean})],y.prototype,"handle",2),p([w({type:Boolean,reflect:!0})],y.prototype,"bare",2),p([w({type:Boolean,reflect:!0})],y.prototype,"dark",2),p([w({attribute:!1})],y.prototype,"pictureSize",2),p([m()],y.prototype,"pending",2),p([m()],y.prototype,"writeError",2);var T=class extends y{constructor(){super(...arguments);this.row="collection";this.refreshing=!1;this.refreshError="";this.setsOpen=!1;this.ownedError="";this.query="";this.results=[];this.loadingDetails=!1;this.detailsError=""}willUpdate(e){super.willUpdate(e),e.has("dash")&&(this.pricesPick=void 0),e.has("dash")&&this.dash!==this.ownedFor&&(ur(this.ownedFor,this.dash)||(this.owned=void 0),Oe(this.query)&&this.search(this.query))}updated(){this.setsOpen&&!this.collapsed&&this.dash!==this.ownedFor&&this.loadOwned()}async loadOwned(){let e=this.dash;if(!(!e||this.ownedFor===e)){this.ownedFor=e;try{let r=await this.hass.callWS({...R("lego/collection",e.entry_id),filter:"owned"});this.ownedFor===e&&(this.owned=r.sets,this.ownedError="")}catch(r){this.ownedFor===e&&(this.ownedError=E(r))}}}async search(e){if(this.query=e,!Oe(e)){this.results=[];return}try{let r=await this.hass.callWS({...R("lego/search",this.dash?.entry_id??""),query:e,limit:24});this.query===e&&(this.results=r.sets)}catch{this.results=[]}}showPrices(){return this.pricesPick??this.dash?.collection_prices??!0}detailsBar(){let e=pr(this.results);if(!e.length&&!this.detailsError)return c;let r=this.dash?.quota,s=!!this.dash?.can_change&&!!r&&r.remaining>0;return n`<div class="details" role="status">
      <span class="muted">
        ${this.detailsError||`Dates and prices for ${e.length} of these aren't loaded from Brickset yet.`}
      </span>
      ${s&&e.length?n`<button
              class="update"
              ?disabled=${this.loadingDetails}
              title="Ask Brickset about all of them at once, using 1 of the ${r?.remaining} calls left today"
              @click=${()=>{this.loadDetails(e)}}
            >
              <ha-icon icon="mdi:cloud-download-outline"></ha-icon>
              ${this.loadingDetails?"Loading\u2026":"Load details"}
              <span class="sep" aria-hidden="true"></span>
              <span class="cost">1 call</span>
            </button>`:c}
    </div>`}async loadDetails(e){this.loadingDetails=!0,this.detailsError="";try{await this.hass.callWS({...R("lego/set_details",this.dash?.entry_id??""),numbers:e}),await this.search(this.query)}catch(r){this.detailsError=E(r)}finally{this.loadingDetails=!1}}setPrices(e){this.pricesPick=e,this.hass.callWS({type:"lego/panel_config/set",collection_prices:e}).catch(()=>{})}async refresh(){this.refreshing=!0,this.refreshError="";try{await this.hass.callService("lego","refresh_collection",Ot(this.dash?.device_id??"")),this.dispatchEvent(new CustomEvent(ge,{bubbles:!0,composed:!0}))}catch(e){this.refreshError=E(e)}finally{this.refreshing=!1}}subtitle(){return Ft(this.dash?.last_synced??null,new Date)}short(){let e=this.dash?.quota;return!!e&&e.remaining<e.refresh_cost}actions(){let e=this.dash?.quota;if(!e)return c;let r=A(e.refresh_cost,"call","calls");return n`<button
      class="update"
      ?disabled=${this.refreshing||this.short()}
      title=${this.short()?"Today's Brickset budget is spent":`Fetch your collection from Brickset now, using ${r} of the ${e.remaining} left today`}
      @click=${()=>{this.refresh()}}
    >
      <ha-icon
        icon=${this.refreshing?"mdi:sync":"mdi:cloud-sync"}
      ></ha-icon>
      ${this.refreshing?"Updating\u2026":"Update"}
      <span class="sep" aria-hidden="true"></span>
      <span class="cost">${r}</span>
    </button>`}resumes(e){let r=new Date(e),s=r.toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"});return r.toDateString()===new Date().toDateString()?`at ${s}`:`tomorrow at ${s}`}body(){let e=this.dash?.stats,r=this.dash?.quota;if(!e)return n`<p class="muted">Loading your collection…</p>`;let s=[[e.sets_owned,"Sets owned"],[e.sets_distinct,"Distinct sets"],[e.pieces_owned,"Pieces"],[e.minifigs_owned,"Minifigures"]];return n`
      <div class="stats">
        ${s.map(([a,o])=>n`<div class="stat">
              <span class="n">${this.num(a)}</span
              ><span class="l">${o}</span>
            </div>`)}
      </div>
      ${this.short()&&r?n`<p class="caveat">
              Daily budget spent, ${r.calls_today} of ${r.budget} used,
              so this is the last sync's data. Updates resume
              ${this.resumes(r.resets_at)}.
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
    `}sets(){let e=Oe(this.query),r=e?this.results:this.owned??[];return n`
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
                    ${e?A(r.length,"matching set","matching sets"):`${A(r.length,"set owned","sets owned")}, by theme then name`}
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
                  ${r.map(s=>this.card(s,"retirement",this.themeColour(s.theme),this.showPrices()))}
                </div>`}
    `}};T.styles=[y.styles,$`
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
    `],p([m()],T.prototype,"refreshing",2),p([m()],T.prototype,"refreshError",2),p([m()],T.prototype,"setsOpen",2),p([m()],T.prototype,"owned",2),p([m()],T.prototype,"ownedError",2),p([m()],T.prototype,"query",2),p([m()],T.prototype,"results",2),p([m()],T.prototype,"loadingDetails",2),p([m()],T.prototype,"detailsError",2),p([m()],T.prototype,"pricesPick",2);z("lego-collection-row",T);var $r=["releases","themes"],ds=6,hs=500,ps=1100,kr={normal:7,wide:10},_r={normal:18,wide:24},S=class extends y{constructor(){super(...arguments);this.kind="releases";this.error="";this.adding=!1;this.draft="";this.following=!1;this.followNote="";this.themesOpen=!1;this.wiggling=!1;this.held=!1;this.holdStart=()=>{!this.dash?.can_change||this.wiggling||(window.clearTimeout(this.holdTimer),this.holdTimer=window.setTimeout(()=>{this.held=!0,this.wiggling=!0},hs))};this.holdEnd=()=>{window.clearTimeout(this.holdTimer)};this.onKey=e=>{e.key==="Escape"&&this.wiggling&&(this.wiggling=!1)};this.width=0;this.scrolledFor="";this.filterFor="";this.requested=""}get compact(){return this.width>0&&this.width<720}get wide(){return this.width>=ps}connectedCallback(){super.connectedCallback(),this.sizer=new ResizeObserver(([e])=>{this.width=Math.round(e.contentRect.width/8)*8}),this.sizer.observe(this),this.addEventListener("keydown",this.onKey)}disconnectedCallback(){super.disconnectedCallback(),this.sizer?.disconnect(),this.removeEventListener("keydown",this.onKey),window.clearTimeout(this.holdTimer)}get row(){return this.kind}willUpdate(e){super.willUpdate(e);let r=`${this.dash?.entry_id}:${this.kind}`;this.dash&&r!==this.filterFor&&(this.filterFor=r,this.filter=Q(this.kind,this.dash),this.data=void 0)}updated(){!this.collapsed&&this.filter&&this.dash&&this.hass&&this.fetch(),this.scrollToToday()}scrollToToday(){let e=this.renderRoot.querySelector(".timescroll.compact"),r=e?.querySelector(".today"),s=`${this.filter?.span}:${this.data?.span.from}`;!e||!r||s===this.scrolledFor||(this.scrolledFor=s,e.scrollLeft=r.offsetLeft-e.clientWidth/2)}async fetch(){let e=this.filter,r=this.dash;if(!e||!r||r.release_status[e.scope]===null)return;let s=JSON.stringify([r.entry_id,e]);if(!(s===this.requested&&this.requestedWith===r)){this.requested=s,this.requestedWith=r;try{let a=await er(this.hass,r.entry_id,e);this.requested===s&&(this.data=a,this.error="")}catch(a){this.requested===s&&(this.error=E(a))}}}pick(e){if(!this.filter)return;this.filter={...this.filter,...e},this.openStack=void 0;let{scope:r,themes:s,span:a}=this.filter,o={scope:r,themes:s,span:a};this.hass.callWS({type:"lego/panel_config/set",release_filters:{[this.kind]:o}}).catch(()=>{}),this.dispatchEvent(new CustomEvent(wr,{detail:{row:this.kind,filter:o},bubbles:!0,composed:!0}))}status(){return this.filter?this.dash?.release_status[this.filter.scope]:void 0}subtitle(){let e=this.status();return e==null?"":e==="fetching"?"Fetching releases\u2026":e==="failed"?"Couldn't fetch releases":this.data?A(this.data.sets.length,"set","sets"):"Loading\u2026"}actions(){return!this.filter||this.status()===null||M[this.kind].length<2?c:n`<div class="pills" role="group" aria-label="Time span">
      ${M[this.kind].map(e=>n`<button
            class=${e===this.filter?.span?"pill on":"pill"}
            aria-pressed=${e===this.filter?.span}
            title=${Ut[e]??c}
            @click=${()=>this.pick({span:e})}
          >
            ${j(e)}
          </button>`)}
    </div>`}body(){let e=this.filter,r=this.dash;if(!e||!r)return n`<p class="muted">Loading…</p>`;let s=this.status();return s===null?n`<p class="muted">${this.unavailable()}</p>
        ${this.kind==="recent"||this.kind==="upcoming"?c:this.followControls()}`:s==="fetching"?n`<p class="muted">Fetching this year's releases…</p>`:s==="failed"?n`<p class="muted">
        Couldn't fetch this year's releases. They're tried again every few hours
        until they arrive.
      </p>`:n`
      ${$r.includes(this.kind)?this.chips(e):c}
      ${$r.includes(this.kind)&&this.data?this.timeline(this.data):c}
      ${this.error?n`<p class="caveat bad">${this.error}</p>`:c}
      ${this.cards()}
    `}unavailable(){return this.kind==="recent"||this.kind==="upcoming"?"Turn on Follow releases across all themes in the integration's options for this row.":this.kind==="themes"?this.dash?.can_change?"No themes followed yet. Follow one to see its new sets here.":"No themes followed yet.":this.dash?.can_change?"Follow a theme, or turn on Follow releases across all themes in the integration's options, to see new sets here.":"No themes followed yet."}chips(e){let r=this.dash,s=ee(r.followed),a=e.scope==="mine",o=r.release_status.all!==null,l=n`<button
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
      @click=${()=>{this.wiggling=!1;let v=vr(a,this.themesOpen);this.themesOpen=v.open,v.pick&&this.pick({scope:"mine",themes:[]})}}
    >
      ${this.kind==="themes"?"All my themes":"My themes"}
      ${d&&!this.themesOpen?n`<span>· ${d}</span>`:c}
      <ha-icon
        class="drop"
        icon=${a&&this.themesOpen?"mdi:chevron-up":"mdi:chevron-down"}
      ></ha-icon>
    </button>`,u=fr({mine:a,open:this.themesOpen,wiggling:this.wiggling,followed:r.followed.length}),g=u.themes;return n`<div class="chips">
        ${this.kind==="releases"?l:c}
        ${r.followed.length?h:c}
        ${g&&this.kind==="releases"?n`<span class="divider" aria-hidden="true"></span>`:c}
        ${(g?r.followed:[]).map(v=>{let b=e.scope==="mine"&&e.themes.includes(v);return n`<span
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
              @click=${()=>{let k=br(this.held,this.wiggling);this.held=!1,k==="pick"&&this.pick({scope:"mine",themes:Te(e.scope==="mine"?e.themes:[],v,r.followed)})}}
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
    </button>`}async openEditor(){this.adding=!0,this.followNote="",await this.loadThemes()}async loadThemes(){try{this.themeList=await this.hass.callWS(R("lego/themes",this.entryId||this.dash?.entry_id||""))}catch(e){this.followNote=E(e)}}editor(){let e=this.themeList,r=e?.followed??this.dash?.followed??[],s=new Set(r.map(l=>l.toLowerCase())),a=e?e.follow_cost?A(e.follow_cost,"call","calls"):"free":"\u2026",o=`lego-themes-${this.kind}`;return n`<div class="follow">
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
      ${r.length?n`<div class="chips" role="group" aria-label="Themes you follow">
              ${r.map(l=>n`<button
                    class="chip"
                    aria-label=${`Stop following ${l}`}
                    ?disabled=${this.following}
                    @click=${()=>{this.follow(l,!1)}}
                  >
                    ${l}
                    <ha-icon class="drop" icon="mdi:close"></ha-icon>
                  </button>`)}
            </div>`:c}
      ${this.followNote?n`<p class="caveat" role="status">${this.followNote}</p>`:c}`}async follow(e,r){let s=e.trim();if(!(!s||this.following)){this.following=!0,this.followNote="";try{let a=await this.hass.callWS({...R("lego/themes/follow",this.entryId||this.dash?.entry_id||""),theme:s,follow:r});r&&(this.draft=""),a.complete||(this.followNote=`Following ${s}. Its sets arrive with the next check, as today's budget is spent.`),await this.loadThemes()}catch(a){this.followNote=E(a);return}finally{this.following=!1}this.dispatchEvent(new CustomEvent(ge,{bubbles:!0,composed:!0}))}}stack(e,r,s,a){let o=x=>`${r(x)*100}%`,l=e.at>=s-.01&&e.at<=a+.01,d=this.wide?kr.wide:kr.normal,h=e.extra?1:0,u=e.themes.length+h,g=tt(u,d-1).map(Math.round),v=tt(u,d*2),b=this.hass?.locale?.language,k=x=>new Date(x).toLocaleDateString(b,{day:"numeric",month:"short"}),P=e.points.slice(0,ds),f=r(e.at)<.25?"tip start":r(e.at)>.75?"tip end":"tip";return n`<button
      class=${l?"stack":"stack out"}
      style="left:${o(e.at)};left:round(nearest, ${o(e.at)}, 1px)"
      aria-label=${e.points.map(x=>`${I(x)}, ${k(x.date)}`).join("; ")}
      aria-pressed=${this.compact?this.openStack?.at===e.at:c}
      @click=${()=>{this.compact&&(this.openStack=this.openStack?.at===e.at?void 0:e)}}
    >
      ${e.extra?n`<span
              class="extra"
              style="--rest:${g[0]}px;--fan:${v[0]}px"
              >+${e.extra}</span
            >`:c}
      ${e.themes.map((x,Y)=>n`<span
            class="brick"
            style="--rest:${g[Y+h]}px;--fan:${v[Y+h]}px;--brick:${this.themeColour(x)};z-index:${10-Y-h}"
          ></span>`)}
      <span class=${f} aria-hidden="true">
        ${P.map(x=>n`<span class="tipline">
              <span
                class="key"
                style="background:${this.themeColour(x.theme)}"
              ></span>
              <span class="tipname">${I(x)}</span>
              <span class="tipdate">${k(x.date)}</span>
            </span>`)}
        ${e.points.length>P.length?n`<span class="tipmore"
                >+${e.points.length-P.length} more</span
              >`:c}
      </span>
    </button>`}timeline(e){let r=new Date,s=new Date(r.getFullYear(),0,1),a=Math.max(J(s,e.span.from),0),o=e.span.to?Math.min(J(s,e.span.to),B):B,l=Wt(a,o,this.compact),d=f=>(f-l.from)/(l.to-l.from),h=f=>`${d(f)*100}%`,u=f=>f>=l.from-.05&&f<=l.to+.05,g=Vt(this.width*l.width,l.to-l.from,this.wide?_r.wide:_r.normal),v=Gt(e.timeline,s,g).filter(f=>u(f.at)),b=this.hass?.locale?.language,k=e.timeline.filter(f=>{let x=J(s,f.date);return x>=a&&x<=o}).length,P=J(s,r);return n`<div
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
          ${u(P)?n`<span class="today" style="left:${h(P)}"
                  ><ha-icon icon="mdi:chevron-down"></ha-icon
                  ><span class="todaytip"
                    >Today,
                    ${r.toLocaleDateString(b,{day:"numeric",month:"long"})}</span
                  ></span
                >`:c}
          ${v.map(f=>this.stack(f,d,a,o))}
          ${Array.from({length:B},(f,x)=>x).filter(f=>f+1>l.from&&f<l.to).map(f=>{let x=new Date(s.getFullYear(),f,1).toLocaleDateString(b,{month:"short"});return n`<span
                class=${f%3===0?"month quarter":"month"}
                style="left:${h(f)};width:${h(l.from+1)}"
                aria-hidden="true"
                >${x}</span
              >`})}
        </div>
      </div>
      ${this.compact&&this.openStack?this.picked(this.openStack):c}`}picked(e){let r=this.hass?.locale?.language;return n`<div class="picked" role="status">
      ${e.points.map(s=>n`<span class="tipline">
            <span
              class="key"
              style="background:${this.themeColour(s.theme)}"
            ></span>
            <span class="tipname">${I(s)}</span>
            <span class="tipdate"
              >${new Date(s.date).toLocaleDateString(r,{day:"numeric",month:"short"})}</span
            >
          </span>`)}
    </div>`}cards(){let e=this.data?.sets;if(!e)return n`<p class="muted">Loading…</p>`;if(!e.length){let r=this.filter&&this.filter.span==="coming";return this.filler(r?"Nothing due in this span yet.":"Nothing new in this span. Try a longer one.")}return n`<div class="carousel">
      ${e.map(r=>this.card(r,"release",this.themeColour(r.theme)))}
      ${this.tail()}
    </div>`}};S.styles=[y.styles,$`
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
    `],p([w()],S.prototype,"kind",2),p([m()],S.prototype,"filter",2),p([m()],S.prototype,"data",2),p([m()],S.prototype,"error",2),p([m()],S.prototype,"adding",2),p([m()],S.prototype,"themeList",2),p([m()],S.prototype,"draft",2),p([m()],S.prototype,"following",2),p([m()],S.prototype,"followNote",2),p([m()],S.prototype,"themesOpen",2),p([m()],S.prototype,"wiggling",2),p([m()],S.prototype,"width",2),p([m()],S.prototype,"openStack",2);z("lego-releases-row",S);var us=365,gs=12,Sr=70,ot=2*Math.PI*Sr,ms=1.5,N=class extends y{constructor(){super(...arguments);this.kind="value";this.hover="";this.trendOpen=!1;this.hoverPoint=null;this.historyFor=""}get row(){return this.kind}willUpdate(e){super.willUpdate(e);let r=`${this.dash?.entry_id}:${this.kind}`;this.dash&&r!==this.historyFor&&(this.historyFor=r,this.history=void 0)}updated(){this.trendOpen&&!this.collapsed&&this.history===void 0&&this.loadHistory()}format(e){return this.kind==="value"?this.money(e):this.num(Math.round(e))}subtitle(){let e=this.dash?.stats;return e?this.kind==="value"?`${this.money(e.value)} at LEGO.com RRP`:A(e.pieces_owned,"piece","pieces"):""}body(){let e=this.dash?.stats;if(!e)return n`<p class="muted">Loading…</p>`;let r=Nt(this.dash?.by_theme??[],this.kind),s=this.kind==="value"?e.value:e.pieces_owned;if(!r.length)return n`<p class="muted">
        Nothing owned with a published figure yet.
      </p>`;let a=ee(r.filter(l=>!l.other).map(l=>l.theme)),o=l=>te(l.other?"other":a.get(l.theme));return n`
      <div class="chart">
        ${this.donut(r,s,o)} ${this.bars(r,s,o)}
      </div>
      <p class="footnote">
        <span
          >${this.kind==="value"&&e.sets_missing_price?`${A(e.sets_missing_price,"set has","sets have")} no published price and ${e.sets_missing_price===1?"is":"are"} not counted.`:""}</span
        >
        ${this.kind==="value"?n`<span>At LEGO.com RRP</span>`:c}
      </p>
      ${this.trend()}
    `}donut(e,r,s){let a=e.reduce((h,u)=>h+u.amount,0)||1,o=0,l=e.map(h=>{let u=Math.max(h.amount/a*ot-ms,.5),g=O`<circle
        cx="100"
        cy="100"
        r=${Sr}
        fill="none"
        stroke=${s(h)}
        stroke-width=${this.hover===h.theme?34:28}
        stroke-dasharray=${`${u} ${ot-u}`}
        stroke-dashoffset=${-o}
        class=${this.hover&&this.hover!==h.theme?"faded":""}
        @mouseenter=${()=>this.hover=h.theme}
        @mouseleave=${()=>this.hover=""}
      ></circle>`;return o+=h.amount/a*ot,g}),d=e.find(h=>h.theme===this.hover);return n`<div class="donut">
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
        <span class="n">${this.format(d?d.amount:r)}</span>
        <span class="l">${d?d.theme:"in total"}</span>
      </div>
    </div>`}bars(e,r,s){let a=e.reduce((o,l)=>Math.max(o,l.amount),0)||1;return n`<ul class="bars">
      ${e.map((o,l)=>{let d=this.hover===o.theme,h=this.hover&&!d,u=o.setNumbers.slice(0,gs),g=o.setNumbers.length-u.length;return n`<li>
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
                    ${Math.round(o.amount/(r||1)*100)}% of the
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
    </div>`}async loadHistory(){let e=this.dash?.history?.[this.kind],r=this.historyFor;if(!e){this.history="none";return}this.history="loading";try{let s=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(Date.now()-us*864e5).toISOString(),statistic_ids:[e],period:"week",types:this.kind==="value"?["state"]:["mean"]});if(r!==this.historyFor)return;let a=Lt(s[e]??[]);this.history=a.length>=2?a:"none"}catch{r===this.historyFor&&(this.history="none")}}trendChart(){let e=this.history;if(e===void 0||e==="loading")return n`<p class="muted">Loading the trend…</p>`;if(e==="none")return n`<p class="muted">
        No history yet. Home Assistant records it weekly from the sensor, so a
        line appears after a couple of weeks.
      </p>`;let r=e,s=Math.min(...r.map(f=>f.v)),o=Math.max(...r.map(f=>f.v))-s||1,l=r[0].t,d=r[r.length-1].t-l||1,h=f=>(f.t-l)/d*100,u=f=>90-(f.v-s)/o*80,g=r.map(f=>`${h(f)},${u(f)}`).join(" "),v=r[r.length-1],b=this.hoverPoint===null?void 0:r[this.hoverPoint],k=b??v,P=f=>new Date(f).toLocaleDateString(this.hass?.locale?.language,{day:"numeric",month:"short"});return n`
      <div
        class="plot"
        @pointermove=${f=>{let x=f.currentTarget.getBoundingClientRect(),Y=l+(f.clientX-x.left)/x.width*d,Ie=0;r.forEach((Cr,Tr)=>{Math.abs(Cr.t-Y)<Math.abs(r[Ie].t-Y)&&(Ie=Tr)}),this.hoverPoint=Ie}}
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
          >${this.format(k.v)} · ${P(k.t)}</span
        >
      </div>
      <div class="axis">
        <span>${P(r[0].t)}</span><span>${P(v.t)}</span>
      </div>
    `}};N.styles=[y.styles,$`
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
    `],p([w()],N.prototype,"kind",2),p([m()],N.prototype,"hover",2),p([m()],N.prototype,"trendOpen",2),p([m()],N.prototype,"history",2),p([m()],N.prototype,"hoverPoint",2);z("lego-value-row",N);var Er="Mark sets as wanted on Brickset and they land here.",nt=class extends y{constructor(){super(...arguments);this.row="wishlist"}subtitle(){return A(this.dash?.wishlist.length??0,"set","sets")}body(){let e=this.dash?.wishlist??[];return e.length?n`<div class="carousel">
      ${e.map(r=>this.card(r,"retirement",this.themeColour(r.theme)))}
      ${this.tail(Er)}
    </div>`:this.filler(`Nothing on your wishlist yet. ${Er}`)}};z("lego-wishlist-row",nt);var fs={account:"Brickset account",collapsed:"Start folded",picture_size:"Picture size",measure:"Show",row:"Row",scope:"Themes",themes:"Only these themes",span:"Span"},vs={account:"Leave empty to show the account you opened last in the LEGO panel.",collapsed:"Show only the card's header until it is opened.",picture_size:"Medium and Large draw pictures two and three times the size. They look sharp only with Sharper pictures on in the integration's options.",scope:"Everything needs Follow releases across all themes in the options.",themes:"Narrows My themes to some of the themes you follow.",span:"Leave empty for the row's own default."},Ne={name:"account",selector:{config_entry:{integration:"lego"}}},Be={name:"collapsed",selector:{boolean:{}}},pt={name:"picture_size",selector:{select:{mode:"dropdown",options:Ae.map(i=>({value:i,label:Ce[i]}))}}};function je(i,t=()=>{}){return{schema:i,computeLabel:e=>fs[e.name],computeHelper:e=>vs[e.name],assertConfig:t}}var D=class extends C{constructor(){super(...arguments);this.error="";this.loadedFor=null;this.reload=()=>{this.loadedFor=null,this.requestUpdate()}}setConfig(e){if(!e)throw new Error("Invalid configuration");this.config=e,this.loadedFor=null}getCardSize(){return this.config?.collapsed?1:6}getGridOptions(){return{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),window.addEventListener(K,this.reload)}disconnectedCallback(){window.removeEventListener(K,this.reload),super.disconnectedCallback()}updated(){let e=this.config?.account??"";this.hass&&ze(this.hass),this.hass&&this.config&&this.loadedFor!==e&&(this.loadedFor=e,Qt(this.hass,e).then(r=>{this.dash=r,this.error=""}).catch(r=>this.error=E(r)))}render(){return n`<ha-card
      @lego-changed=${()=>Z()}
      @lego-toggle=${e=>e.stopPropagation()}
    >
      ${Le(this.dash)}
      ${this.error?n`<div class="error">${this.error}</div>`:this.dash&&this.hass?this.row(this.dash):c}
    </ha-card>`}};D.styles=[re,se,$`
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
    `],p([w({attribute:!1})],D.prototype,"hass",2),p([m()],D.prototype,"config",2),p([m()],D.prototype,"dash",2),p([m()],D.prototype,"error",2);var lt=class extends D{static getStubConfig(){return{}}static getConfigForm(){return je([Ne,pt,Be])}row(t){return n`<lego-collection-row
      bare
      .pictureSize=${this.config?.picture_size}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${t}
      .entryId=${t.entry_id}
    ></lego-collection-row>`}},ct=class extends D{static getStubConfig(){return{}}static getConfigForm(){return je([Ne,pt,Be])}row(t){return n`<lego-wishlist-row
      bare
      .pictureSize=${this.config?.picture_size}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${t}
      .entryId=${t.entry_id}
    ></lego-wishlist-row>`}},dt=class extends D{static getStubConfig(){return{measure:"value"}}static getConfigForm(){return je([Ne,{name:"measure",selector:{select:{mode:"dropdown",options:[{value:"value",label:"Collection value"},{value:"pieces",label:"Pieces"}]}}},Be])}row(t){return n`<lego-value-row
      bare
      .kind=${this.config?.measure==="pieces"?"pieces":"value"}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${t}
      .entryId=${t.entry_id}
    ></lego-value-row>`}},ht=class extends D{static getStubConfig(){return{row:"releases"}}static getConfigForm(){let t=[...new Set(Object.values(M).flat())];return je([Ne,{name:"row",selector:{select:{mode:"dropdown",options:Object.keys(M).map(e=>({value:e,label:ie[e].title}))}}},{name:"scope",selector:{select:{mode:"dropdown",options:[{value:"mine",label:"My themes"},{value:"all",label:"Everything"}]}}},{name:"themes",selector:{select:{multiple:!0,custom_value:!0,options:[]}}},{name:"span",selector:{select:{mode:"dropdown",options:t.map(e=>({value:e,label:j(e)}))}}},pt,Be],e=>{let r=qt(e.row??"releases",e.span);if(r)throw new Error(r)})}row(t){let e=this.config?.row??"releases",r={};this.config?.scope&&(r.scope=this.config.scope),this.config?.themes&&(r.themes=this.config.themes),this.config?.span&&(r.span=this.config.span);let s={...t,release_filters:{...t.release_filters,[e]:{...Q(e,t),...r}}};return n`<lego-releases-row
      bare
      .kind=${e}
      .pictureSize=${this.config?.picture_size}
      .collapsed=${this.config?.collapsed??!1}
      .hass=${this.hass}
      .dash=${s}
      .entryId=${t.entry_id}
    ></lego-releases-row>`}},bs=[["lego-collection-card",lt,"LEGO collection","Your Brickset collection's totals, with every set and a search."],["lego-releases-card",ht,"LEGO releases","New and upcoming sets, across every theme or the ones you follow."],["lego-wishlist-card",ct,"LEGO wishlist","The sets you want, soonest to retire first."],["lego-value-card",dt,"LEGO collection value","What your collection is worth at LEGO.com RRP, by theme."]],ys="https://github.com/PineappleEmperor/ha-lego#dashboard-cards";for(let[i,t,e,r]of bs)z(i,t),window.customCards=window.customCards??[],window.customCards.some(s=>s.type===i)||window.customCards.push({type:i,name:e,description:r,preview:!0,documentationURL:ys});var Ar=["releases","recent","upcoming","themes"],_=class extends C{constructor(){super(...arguments);this.narrow=!1;this.dark=!1;this.error="";this.accounts=[];this.account="";this.defaultAccount="";this.switching="";this.picking=!1;this.customising=!1;this.folded={};this.dragging="";this.over="";this.foldedFor="";this.onInvalidated=()=>{this.load()};this.onToggle=e=>{let{row:r,collapsed:s}=e.detail;this.folded={...this.folded,[r]:s}};this.onFilter=e=>{let{row:r,filter:s}=e.detail;this.dash&&(this.dash={...this.dash,release_filters:{...this.dash.release_filters,[r]:s}})};this.onMove=e=>{let{row:r,step:s}=e.detail;this.move(r,s,this.visible())};this.onChanged=()=>Z();this.onTouchMove=e=>{if(!this.dragging||e.pointerType==="mouse")return;let r=this.renderRoot.elementsFromPoint(e.clientX,e.clientY).map(s=>s.closest(".slot")).find(s=>s&&s.dataset.row);r?.dataset.row&&(this.over=r.dataset.row)};this.onPickerKey=e=>{e.key==="Escape"&&this.picking&&(this.picking=!1,this.renderRoot.querySelector(".account")?.focus())};this.onOutside=e=>{let r=this.renderRoot.querySelector(".accountpick");this.picking&&r&&!e.composedPath().includes(r)&&(this.picking=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this.onOutside),window.addEventListener(K,this.onInvalidated),this.load()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this.onOutside),window.removeEventListener(K,this.onInvalidated)}willUpdate(){this.dark=!!this.hass?.themes?.darkMode,this.hass&&ze(this.hass)}async load(){try{if(!this.accounts.length){let r=await this.hass.callWS({type:"lego/accounts"});this.accounts=r.accounts,this.account=r.selected??"",this.defaultAccount=this.account}let e=await this.hass.callWS(R("lego/dashboard",this.account));e.entry_id!==this.foldedFor&&(this.foldedFor=e.entry_id,this.folded=Object.fromEntries(e.collapsed.map(r=>[r,!0]))),this.dash=e,this.error=""}catch(e){this.error=E(e)}}async selectAccount(e){if(e!==this.account){this.account=e,this.switching=this.accounts.find(r=>r.entry_id===e)?.name??"account";try{await this.load()}finally{this.switching=""}}}async makeDefault(e){try{await this.hass.callWS({type:"lego/account/set",config_entry_id:e}),this.defaultAccount=e}catch(r){this.error=E(r)}}async save(e){if(this.dash){this.dash={...this.dash,...e};try{let r=await this.hass.callWS({type:"lego/panel_config/set",...e});this.dash&&(this.dash={...this.dash,...r})}catch{}}}visible(){let e=this.dash;return e?rt(e.rows,e.release_mode).filter(r=>!e.hidden.includes(r)):[]}move(e,r,s){if(!this.dash)return;let a=Kt(this.dash.rows,s,e,r);a!==this.dash.rows&&(this.save({rows:a}),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-row="${e}"] > *`)?.focusHandle?.()))}onTouchStart(e,r){e.pointerType==="mouse"||!e.composedPath().some(a=>a instanceof Element&&a.classList.contains("drag"))||(e.currentTarget.setPointerCapture(e.pointerId),this.dragging=r,this.over=r)}onTouchEnd(e){this.dragging&&this.onDrop(this.over,e)}onDrop(e,r){let s=this.dragging;if(this.dragging="",this.over="",!this.dash||!s||s===e)return;let a=this.dash.rows.filter(d=>d!==s),o=a.indexOf(e),l=r.indexOf(s)<r.indexOf(e);a.splice(o+(l?1:0),0,s),this.save({rows:a})}render(){return n`
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
                  </div>`:this.renderHome()}
          </div>
        </div>
      </div>
    `}renderHeader(){return n`<header class=${this.narrow?"narrow":""}>
      <div class="title">
        ${this.narrow?n`<ha-menu-button
                .hass=${this.hass}
                .narrow=${this.narrow}
              ></ha-menu-button>`:c}
        <span class="logo">${De(ir)}</span>
        <h1>LEGO</h1>
      </div>
      ${this.accounts.length>1?this.accountPicker():this.accounts.length?this.accountName(this.accounts[0]):c}
    </header>`}renderMeter(e){let{share:r,tight:s}=mr(e);return n`<div
      class=${s?"meter tight":"meter"}
      title=${Bt(e.calls_today,e.budget,new Date(e.resets_at).toLocaleTimeString(this.hass?.locale?.language,{hour:"2-digit",minute:"2-digit"}))}
    >
      <span class="meter-label">Brickset calls</span>
      <span
        class="meter-bar"
        role="meter"
        aria-label="Brickset calls used today"
        aria-valuemin="0"
        aria-valuemax=${e.budget}
        aria-valuenow=${e.calls_today}
        ><span style="width:${r*100}%"></span
      ></span>
      <span class="meter-count"
        >${e.calls_today} of ${e.budget}<span class="when"> today</span
        ><span class="unit"> calls</span></span
      >
    </div>`}accountPicker(){let e=this.accounts.find(r=>r.entry_id===this.account);return n`<div class="accountpick" @keydown=${this.onPickerKey}>
      <div class="accountbar">
        <button
          class="account"
          aria-haspopup="true"
          aria-expanded=${this.picking}
          aria-label=${`Brickset account: ${e?.name??""}`}
          @click=${()=>this.picking=!this.picking}
        >
          <span class="names" aria-hidden="true">
            ${this.accounts.map(r=>n`<span
                  class=${r.entry_id===e?.entry_id?"name":"name ghost"}
                  >${r.name}</span
                >`)}
          </span>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
        ${e?this.brickButton(e):c}
      </div>
      ${this.picking?n`<ul class="menu">
              ${this.accounts.map(r=>n`<li>
                    <button
                      class="pick"
                      aria-current=${r.entry_id===this.account}
                      @click=${()=>{this.picking=!1,this.selectAccount(r.entry_id)}}
                    >
                      ${r.name}
                    </button>
                    ${this.brickButton(r)}
                  </li>`)}
            </ul>`:c}
    </div>`}accountName(e){return n`<div class="accountpick">
      <div class="accountbar">
        <span class="account single" title="Brickset account">
          <span class="names"><span class="name">${e.name}</span></span>
        </span>
      </div>
    </div>`}brickButton(e){let r=e.entry_id===this.defaultAccount,s=r?`${e.name} opens by default`:`Open ${e.name} by default`;return n`<button
      class="brick"
      title=${s}
      aria-label=${s}
      aria-pressed=${r}
      @click=${()=>{r?void 0:this.makeDefault(e.entry_id)}}
    >
      <ha-icon
        icon=${r?"mdi:toy-brick":"mdi:toy-brick-outline"}
      ></ha-icon>
    </button>`}renderHome(){let e=this.dash;if(!e)return n`<p class="muted pad">Loading your collection…</p>`;let r=this.visible(),{anyOpen:s,next:a}=gr(r,this.folded);return n`${Le(e)}
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
        ${r.length?r.map(o=>this.renderRow(o,r)):n`<p class="muted">
                Every row is hidden. Choose Customise to bring some back.
              </p>`}
      </div>`}renderRow(e,r){let s={hass:this.hass,dash:this.dash,entryId:this.dash?.entry_id??"",collapsed:!!this.folded[e]},a;return Ar.includes(e)?a=n`<lego-releases-row
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
      @drop=${()=>this.onDrop(e,r)}
      @pointerdown=${o=>this.onTouchStart(o,e)}
      @pointermove=${this.onTouchMove}
      @pointerup=${()=>this.onTouchEnd(r)}
      @pointercancel=${()=>{this.dragging="",this.over=""}}
    >
      ${a}
    </div>`}renderCustomise(e){let r=rt(e.rows,e.release_mode),s=e.release_status.all!==null;return n`<section class="row customise" aria-label="Customise this page">
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
        ${r.map(a=>this.renderCustomiseRow(e,a,r))}
      </ul>
      ${s?c:n`<p class="muted">
              For Everything, Out recently and Coming soon, turn on Follow
              releases across all themes in the integration's options.
            </p>`}
    </section>`}renderCustomiseRow(e,r,s){let a=ie[r].title,o=!e.hidden.includes(r),l=e.collapsed.includes(r)?"collapsed":"open",d=h=>{let u=e.collapsed.filter(g=>g!==r);h&&u.push(r),this.folded={...this.folded,[r]:h},this.save({collapsed:u})};return n`<li>
      <div class="crow">
        <button
          class="drag"
          data-custom=${r}
          aria-label=${`Move ${a} up or down`}
          title="Use the arrow keys to reorder"
          @keydown=${h=>{let u=h.key==="ArrowUp"?-1:h.key==="ArrowDown"?1:0;u&&(h.preventDefault(),this.move(r,u,s),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-custom="${r}"]`)?.focus()))}}
        >
          <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
        </button>
        <input
          type="checkbox"
          .checked=${o}
          aria-label=${`Show ${a}`}
          @change=${h=>{let u=h.target.checked,g=e.hidden.filter(v=>v!==r);u||g.push(r),this.save({hidden:g})}}
        />
        <span class="rowname"
          ><ha-icon icon=${ie[r].icon}></ha-icon>${a}</span
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
      ${Ar.includes(r)?this.renderStartsOn(e,r):c}
    </li>`}renderStartsOn(e,r){let s=Q(r,e),a=d=>{let h=e.release_filters[r]??{};this.save({release_filters:{...e.release_filters,[r]:{...h,...d}}})},o=(d,h,u)=>n`<button
        class=${h?"chip small on":"chip small"}
        aria-pressed=${h}
        @click=${u}
      >
        ${d}
      </button>`,l=r==="releases"||r==="themes";return n`<div class="startson">
      <span class="muted-label">Starts on</span>
      ${l&&r==="releases"&&e.release_status.all!==null?o("Everything",s.scope==="all",()=>a({scope:"all",themes:[]})):c}
      ${l&&e.followed.length?o(r==="themes"?"All my themes":"My themes",s.scope==="mine"&&!s.themes.length,()=>a({scope:"mine",themes:[]})):c}
      ${l?e.followed.map(d=>o(d,s.scope==="mine"&&s.themes.includes(d),()=>a({scope:"mine",themes:Te(s.scope==="mine"?s.themes:[],d,e.followed)}))):c}
      <label class="spanpick"
        >Span
        <select
          @change=${d=>a({span:d.target.value})}
        >
          ${M[r].map(d=>n`<option value=${d} ?selected=${d===s.span}>
                ${j(d)}
              </option>`)}
        </select></label
      >
    </div>`}};_.styles=[re,Pe,Fe,se,$`
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
    `],p([w({attribute:!1})],_.prototype,"hass",2),p([w({type:Boolean})],_.prototype,"narrow",2),p([w({type:Boolean,reflect:!0})],_.prototype,"dark",2),p([m()],_.prototype,"dash",2),p([m()],_.prototype,"error",2),p([m()],_.prototype,"accounts",2),p([m()],_.prototype,"account",2),p([m()],_.prototype,"defaultAccount",2),p([m()],_.prototype,"switching",2),p([m()],_.prototype,"picking",2),p([m()],_.prototype,"customising",2),p([m()],_.prototype,"folded",2),p([m()],_.prototype,"dragging",2),p([m()],_.prototype,"over",2);z("lego-panel",_);export{_ as LegoPanel};
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
