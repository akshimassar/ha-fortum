var oi=Object.defineProperty;var nt=(n,t)=>()=>(n&&(t=n(n=0)),t);var We=(n,t)=>{for(var e in t)oi(n,e,{get:t[e],enumerable:!0})};var Ce,Ei,wr,ht,Ae,Ct=nt(()=>{Ce=n=>typeof n=="number"&&Number.isFinite(n)?String(Math.trunc(n)):typeof n=="string"&&n.trim()||"",Ei=(n,t)=>{let e=/^\d+$/.test(n.number),r=/^\d+$/.test(t.number);return e&&r?Number(n.number)-Number(t.number):e?-1:r?1:n.number.localeCompare(t.number)},wr=n=>n?.states&&typeof n.states=="object"?n.states:n&&typeof n=="object"?n:null,ht=n=>{let t=wr(n);if(!t)return[];let e=new Map;return Object.entries(t).forEach(([r,i])=>{if(!r.startsWith("sensor."))return;let s=Ce(i?.attributes?.metering_point_no);if(!s)return;let o=i?.attributes?.address,a=typeof o=="string"?o.trim():"",c=e.get(s);if(!c){e.set(s,{number:s,address:a,label:a?`${a} (${s})`:s,entityIds:[r]});return}!c.address&&a&&(c.address=a,c.label=`${a} (${s})`),c.entityIds.includes(r)||(c.entityIds.push(r),c.entityIds.sort((d,h)=>d.localeCompare(h)))}),Array.from(e.values()).sort(Ei)},Ae=(n,t)=>{let e=Ce(t);if(!e)return null;let r=wr(n);if(!r)return null;let i=[];return Object.entries(r).forEach(([s,o])=>{if(!s.startsWith("sensor.")||Ce(o?.attributes?.metering_point_no)!==e)return;let c=o?.attributes?.address,d=typeof c=="string"&&c.trim().length>0;i.push({entityId:s,stateObj:o,hasAddress:d})}),i.length?(i.sort((s,o)=>s.hasAddress!==o.hasAddress?s.hasAddress?-1:1:s.entityId.localeCompare(o.entityId)),{entityId:i[0].entityId,stateObj:i[0].stateObj}):null}});var Gt,Li,Ui,Or,ke,$t,Lr,Ur,Kt,Wt,Pt=nt(()=>{Gt=n=>n&&typeof n=="object"&&!Array.isArray(n),Li=`Valid single strategy example:

\`\`\`yaml
type: custom:fortum-energy-single
metering_point:
  number: "6094111"
  name: Home
  temperature: sensor.custom_outdoor_temp
  itemization:
    - stat: sensor.sauna_energy
      name: Sauna
\`\`\``,Ui=`Valid multipoint strategy example:

\`\`\`yaml
type: custom:fortum-energy-multipoint
metering_points:
  - number: "6094111"
    name: Home
    temperature: sensor.custom_outdoor_temp
    itemization:
      - stat: sensor.sauna_energy
        name: Sauna
\`\`\``,Or=(n,t)=>`${n}

${t==="multipoint"?Ui:Li}`,ke=(n,t)=>{if(typeof n=="number"&&Number.isFinite(n))return String(Math.trunc(n));if(typeof n!="string")throw new Error(t+" must be a string.");let e=n.trim();if(!e)throw new Error(t+" must be a non-empty string.");return e},$t=(n,t)=>{if(n==null)return;if(typeof n!="string")throw new Error(t+" must be a string when provided.");return n.trim()||void 0},Lr=(n,t)=>{if(!Array.isArray(n))throw new Error(t+" must be a list.");return n.map((e,r)=>{if(!Gt(e))throw new Error(`${t}[${r}] must be an object.`);let i=ke(e.stat,`${t}[${r}].stat`),s=$t(e.name,`${t}[${r}].name`);return{stat:i,...s?{name:s}:{}}})},Ur=n=>{if(!Gt(n))throw new Error("strategy config must be an object.");let t={...n};if(Object.prototype.hasOwnProperty.call(t,"debug")&&typeof t.debug!="boolean")throw new Error("strategy.debug must be a boolean when provided.");if(t.metering_point!==void 0){if(!Gt(t.metering_point))throw new Error("strategy.metering_point must be an object when provided.");let e={...t.metering_point};e.number!==void 0&&(e.number=ke(e.number,"strategy.metering_point.number"));let r=$t(e.name,"strategy.metering_point.name");r?e.name=r:delete e.name;let i=$t(e.temperature,"strategy.metering_point.temperature");i?e.temperature=i:delete e.temperature,Object.prototype.hasOwnProperty.call(e,"itemization")&&(e.itemization=Lr(e.itemization,"strategy.metering_point.itemization")),t.metering_point=e}return t},Kt=n=>{try{return Ur(n)}catch(t){let e=t&&t.message?t.message:String(t);throw new Error(Or(e,"single"))}},Wt=n=>{try{let t=Ur(n);if(!Array.isArray(t.metering_points)||t.metering_points.length===0)throw new Error("strategy.metering_points must be a non-empty list.");return t.metering_points=t.metering_points.map((e,r)=>{if(!Gt(e))throw new Error(`strategy.metering_points[${r}] must be an object.`);let i=ke(e.number,`strategy.metering_points[${r}].number`),s=$t(e.name,`strategy.metering_points[${r}].name`),o=$t(e.temperature,`strategy.metering_points[${r}].temperature`);if(!Object.prototype.hasOwnProperty.call(e,"itemization"))throw new Error(`strategy.metering_points[${r}].itemization must be a list.`);return{number:i,...s?{name:s}:{},...o?{temperature:o}:{},itemization:Lr(e.itemization,`strategy.metering_points[${r}].itemization`)}}),t}catch(t){let e=t&&t.message?t.message:String(t);throw new Error(Or(e,"multipoint"))}}});var Bi,gt,Br,Hr,De=nt(()=>{Bi=(n,t)=>Object.prototype.hasOwnProperty.call(n||{},t),gt=n=>(Array.isArray(n)?n:[]).map(t=>{if(!t||typeof t!="object")return null;let e=typeof t.stat=="string"?t.stat.trim():"";if(!e)return null;let r=typeof t.name=="string"?t.name.trim():"";return{stat:e,...r?{name:r}:{}}}).filter(Boolean),Br=n=>{let t=n&&typeof n=="object"?{...n}:{},e=t.metering_point&&typeof t.metering_point=="object"?t.metering_point:{},r=typeof e.number=="string"?e.number:"",i=typeof e.name=="string"?e.name:"",s=typeof e.temperature=="string"?e.temperature:"",o=t.debug===!0,a=Bi(e,"itemization"),c=Array.isArray(e.itemization)?e.itemization.map(d=>({stat:typeof d?.stat=="string"?d.stat:"",name:typeof d?.name=="string"?d.name:""})):[];return{baseConfig:t,meteringPointNumber:r,meteringPointName:i,meteringPointTemperature:s,debug:o,hasExplicitItemization:a,itemizationRows:c}},Hr=n=>{let t={...n?.baseConfig&&typeof n.baseConfig=="object"?n.baseConfig:{}},e=t.metering_point&&typeof t.metering_point=="object"?{...t.metering_point}:{},r=typeof n?.meteringPointNumber=="string"?n.meteringPointNumber.trim():"";r?e.number=r:delete e.number;let i=typeof n?.meteringPointName=="string"?n.meteringPointName.trim():"";i?e.name=i:delete e.name;let s=typeof n?.meteringPointTemperature=="string"?n.meteringPointTemperature.trim():"";return s?e.temperature=s:delete e.temperature,n?.debug===!0?t.debug=!0:delete t.debug,n?.hasExplicitItemization?e.itemization=gt(n.itemizationRows):delete e.itemization,delete t.itemization,delete t.fortum,Object.keys(e).length>0?t.metering_point=e:delete t.metering_point,t}});var Yt,Hi,Vr,qr,jr=nt(()=>{De();Yt=n=>typeof n!="string"?"":n.trim(),Hi=n=>({number:typeof n?.number=="string"||typeof n?.number=="number"?String(n.number).trim():"",name:Yt(n?.name),temperature:Yt(n?.temperature),itemizationRows:Array.isArray(n?.itemization)?n.itemization.map(t=>({stat:typeof t?.stat=="string"?t.stat:"",name:typeof t?.name=="string"?t.name:""})):[]}),Vr=n=>{let t=n&&typeof n=="object"?{...n}:{},e=Array.isArray(t.metering_points)?t.metering_points.map(Hi):[];return{baseConfig:t,debug:t.debug===!0,points:e.length?e:[{number:"",name:"",temperature:"",itemizationRows:[]}]}},qr=n=>{let t={...n?.baseConfig&&typeof n.baseConfig=="object"?n.baseConfig:{}};n?.debug===!0?t.debug=!0:delete t.debug,delete t.itemization;let e=Array.isArray(n?.points)?n.points:[];return t.metering_points=e.map(r=>{let i=typeof r?.number=="string"||typeof r?.number=="number"?String(r.number).trim():"",s=Yt(r?.name),o=Yt(r?.temperature);return{number:i,...s?{name:s}:{},...o?{temperature:o}:{},itemization:gt(r?.itemizationRows)}}),t}});var Gr={};We(Gr,{FortumEnergyMultipointStrategyEditor:()=>_t});var Vi,U,_t,Ie=nt(()=>{Pt();jr();Ct();Vi=(n,t)=>{n.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))},U=n=>String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),_t=class extends HTMLElement{connectedCallback(){this._maybeEnsureStatisticPickerLoaded()}setConfig(t){this._state=Vr(t),this._temperatureOverrideEnabledByPoint=this._state.points.map(e=>typeof e?.temperature=="string"&&e.temperature.trim().length>0),this._error="",this._draftErrors={},this._statisticPickerAvailable=!!customElements.get("ha-statistic-picker"),this.shadowRoot||this.attachShadow({mode:"open"}),this._render(),this._maybeEnsureStatisticPickerLoaded()}set hass(t){this._hass=t,this._applyStatisticPickerProps(),this._render(),this._maybeEnsureStatisticPickerLoaded()}_render(){if(!this.shadowRoot||!this._state)return;let t=this._statisticPickerAvailable??!!customElements.get("ha-statistic-picker");this._ensureTemperatureOverrideFlags();let e=this._state.points.map((r,i)=>this._renderPoint(r,i,t)).join("");this.shadowRoot.innerHTML=`
      <style>
        :host { display: block; color: var(--primary-text-color); }
        .wrapper { display: grid; gap: 16px; }
        .field { display: grid; gap: 6px; }
        .label { font-size: 14px; font-weight: 600; }
        .hint { font-size: 12px; color: var(--secondary-text-color); }
        .hint.error-hint { color: var(--error-color); }
        .input {
          width: 100%; box-sizing: border-box; border: 1px solid var(--input-border-color, var(--divider-color));
          border-radius: 10px; min-height: 40px; background: var(--card-background-color);
          color: var(--primary-text-color); padding: 8px 10px;
        }
        .name-input { min-height: 52px; }
        .row { display: flex; align-items: center; gap: 10px; }
        .checkbox { width: 18px; height: 18px; }
        .points { display: grid; gap: 14px; }
        .point {
          border: 1px solid var(--divider-color); border-radius: 12px; padding: 12px;
          display: grid; gap: 12px;
        }
        .point-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .point-title { font-size: 14px; font-weight: 600; }
        .itemization { display: grid; gap: 10px; }
        .item-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
          gap: 8px;
          align-items: center;
        }
        .stat-picker { width: 100%; }
        .actions { display: flex; gap: 8px; flex-wrap: wrap; }
        button {
          border: 1px solid var(--divider-color); border-radius: 10px;
          background: transparent; color: var(--primary-text-color);
          min-height: 38px; padding: 0 12px; cursor: pointer;
        }
        .error {
          border-radius: 10px; border: 1px solid var(--error-color); color: var(--error-color);
          background: color-mix(in srgb, var(--error-color) 10%, transparent);
          padding: 10px; white-space: pre-wrap; font-size: 13px;
        }
        @media (max-width: 900px) {
          .item-row { grid-template-columns: minmax(0, 1fr); }
        }
      </style>
      <div class="wrapper">
        <div class="field">
          <div class="row">
            <input
              id="debug"
              class="checkbox"
              type="checkbox"
              data-field="debug"
              ${this._state.debug?"checked":""}
            />
            <label for="debug">Debug</label>
          </div>
        </div>

        <div class="points">${e}</div>

        <div class="actions">
          <button type="button" data-action="add-point">Add metering point</button>
        </div>

        ${this._error?`<div class="error">${U(this._error)}</div>`:""}
      </div>
    `,this._bindEvents()}_ensureTemperatureOverrideFlags(){let t=Array.isArray(this._state?.points)?this._state.points:[],e=Array.isArray(this._temperatureOverrideEnabledByPoint)?this._temperatureOverrideEnabledByPoint:[];this._temperatureOverrideEnabledByPoint=t.map((r,i)=>typeof e[i]=="boolean"?e[i]:typeof r?.temperature=="string"&&r.temperature.trim().length>0)}_renderPoint(t,e,r){let i=this._getMeteringPointOptions(),s=t.number||"",o=i.some(u=>u.number===s),a=s&&!o?{number:s,label:`${s} (not currently discovered)`}:null,c=this._draftErrors?.[e]||{},d=this._temperatureOverrideEnabledByPoint?.[e]===!0,h=(t.itemizationRows||[]).map((u,_)=>`
        <div class="item-row" data-point-index="${e}" data-row-index="${_}">
          ${r?`<ha-statistic-picker
                  data-field="row_stat"
                  data-point-index="${e}"
                  data-row-index="${_}"
                  class="stat-picker"
                  hide-clear-icon
                ></ha-statistic-picker>`:`<input
                  data-field="row_stat"
                  data-point-index="${e}"
                  data-row-index="${_}"
                  class="input"
                  type="text"
                  placeholder="statistic id"
                  value="${U(u?.stat||"")}"
                />`}
          <input
            data-field="row_name"
            data-point-index="${e}"
            data-row-index="${_}"
            class="input name-input"
            type="text"
            placeholder="Name (optional)"
            value="${U(u?.name||"")}"
          />
          <button type="button" data-action="remove-row" data-point-index="${e}" data-row-index="${_}">Remove</button>
        </div>`).join("");return`
      <section class="point" data-point-index="${e}">
        <div class="point-header">
          <div class="point-title">Metering point ${e+1}</div>
          <button type="button" data-action="remove-point" data-point-index="${e}">Remove point</button>
        </div>

        <div class="field">
          <label class="label" for="point-number-${e}">Metering point number</label>
          <select id="point-number-${e}" class="input" data-field="point_number" data-point-index="${e}">
            <option value="">Select metering point</option>
            ${a?`<option value="${U(a.number)}" selected>${U(a.label)}</option>`:""}
            ${i.map(u=>`<option value="${U(u.number)}" ${u.number===s?"selected":""}>${U(u.label)}</option>`).join("")}
          </select>
          ${c.number?`<div class="hint error-hint">${U(c.number)}</div>`:""}
        </div>

        <div class="field">
          <label class="label" for="point-name-${e}">Display name</label>
          <input id="point-name-${e}" class="input" data-field="point_name" data-point-index="${e}" type="text" placeholder="Name (optional)" value="${U(t?.name||"")}" />
        </div>

        <div class="field">
          <div class="row">
            <input
              id="point-override-temperature-${e}"
              class="checkbox"
              type="checkbox"
              data-field="point_override_temperature"
              data-point-index="${e}"
              ${d?"checked":""}
            />
            <label for="point-override-temperature-${e}">Override temperature source</label>
          </div>
          ${d?r?`<ha-statistic-picker
                    id="point-temperature-${e}"
                    class="stat-picker"
                    data-field="point_temperature_stat"
                    data-point-index="${e}"
                    hide-clear-icon
                  ></ha-statistic-picker>`:`<input id="point-temperature-${e}" class="input" data-field="point_temperature" data-point-index="${e}" type="text" placeholder="Temperature source" value="${U(t?.temperature||"")}" />`:""}
        </div>

        <div class="field">
          <div class="label">Itemization</div>
          ${r?"":'<div class="hint">Statistic picker is unavailable here. Enter statistic IDs manually.</div>'}
          <div class="itemization">
            ${h}
            <div class="actions">
              <button type="button" data-action="add-row" data-point-index="${e}">Add itemization row</button>
            </div>
          </div>
        </div>
      </section>
    `}_bindEvents(){this.shadowRoot&&(this.shadowRoot.querySelectorAll("[data-field]").forEach(t=>{t.addEventListener("change",e=>this._handleFieldChange(e))}),this.shadowRoot.querySelectorAll("button[data-action]").forEach(t=>{t.addEventListener("click",e=>this._handleAction(e))}),this._applyStatisticPickerProps())}_getMeteringPointOptions(){return ht(this._hass).map(t=>({number:t.number,address:t.address,label:t.label}))}_buildExcludeStatistics(t,e){return(this._state?.points?.[t]?.itemizationRows||[]).map((i,s)=>s===e||typeof i?.stat!="string"?"":i.stat.trim()).filter(Boolean)}_applyStatisticPickerProps(){!this.shadowRoot||!this._state||(this.shadowRoot.querySelectorAll("ha-statistic-picker[data-field='row_stat']").forEach(t=>{if(t.allowCustomEntity=!0,t.statisticTypes="sum",t.includeUnitClass=["energy"],!t.dataset.suppressMissingEntityItem){t.dataset.suppressMissingEntityItem="1";try{typeof t._getAdditionalItems=="function"&&(t._getAdditionalItems=()=>[])}catch{}}this._hass&&(t.hass=this._hass);let e=Number(t.dataset.pointIndex),r=Number(t.dataset.rowIndex),i=this._state?.points?.[e]?.itemizationRows?.[r];t.value=i?.stat||"",t.excludeStatistics=this._buildExcludeStatistics(e,r),t.dataset.boundValueChanged||(t.dataset.boundValueChanged="1",t.addEventListener("value-changed",s=>this._handleStatisticPickerChange(s))),typeof t.requestUpdate=="function"&&t.requestUpdate()}),this.shadowRoot.querySelectorAll("ha-statistic-picker[data-field='point_temperature_stat']").forEach(t=>{if(t.allowCustomEntity=!0,t.statisticTypes="mean",t.includeUnitClass=["temperature"],!t.dataset.suppressMissingEntityItem){t.dataset.suppressMissingEntityItem="1";try{typeof t._getAdditionalItems=="function"&&(t._getAdditionalItems=()=>[])}catch{}}this._hass&&(t.hass=this._hass);let e=Number(t.dataset.pointIndex),r=this._state?.points?.[e];t.value=r?.temperature||"",t.dataset.boundValueChanged||(t.dataset.boundValueChanged="1",t.addEventListener("value-changed",i=>this._handleStatisticPickerChange(i))),typeof t.requestUpdate=="function"&&t.requestUpdate()}))}_handleStatisticPickerChange(t){let e=t.currentTarget,r=e?.dataset?.field,i=Number(e?.dataset?.pointIndex);if(!Number.isInteger(i))return;let s=this._state?.points?.[i];if(!s)return;let o=typeof t?.detail?.value=="string"?t.detail.value:"";if(r==="point_temperature_stat"){s.temperature=o,this._validateAndEmit();return}let a=Number(e?.dataset?.rowIndex);!Number.isInteger(a)||!s.itemizationRows?.[a]||(s.itemizationRows[a].stat=o,this._validateAndEmit())}_handleFieldChange(t){if(!this._state)return;let e=t.currentTarget,r=e?.dataset?.field;if(r==="debug"){this._state.debug=e.checked,this._validateAndEmit();return}let i=Number(e?.dataset?.pointIndex);if(!Number.isInteger(i)||!this._state.points[i])return;let s=this._state.points[i];if(r==="point_number"){s.number=e.value,this._validateAndEmit();return}if(r==="point_name"){s.name=e.value,this._validateAndEmit();return}if(r==="point_override_temperature"){this._temperatureOverrideEnabledByPoint[i]=e.checked,e.checked||(s.temperature=""),this._validateAndEmit();return}if(r==="point_temperature"){s.temperature=e.value,this._validateAndEmit();return}if(r==="row_stat"||r==="row_name"){let o=Number(e?.dataset?.rowIndex);if(!Number.isInteger(o)||!s.itemizationRows[o])return;s.itemizationRows[o]={...s.itemizationRows[o],[r==="row_stat"?"stat":"name"]:e.value},this._validateAndEmit()}}_handleAction(t){if(!this._state)return;let e=t.currentTarget,r=e?.dataset?.action;if(r==="add-point"){this._state.points=this._state.points.concat({number:"",name:"",temperature:"",itemizationRows:[]}),this._temperatureOverrideEnabledByPoint=(this._temperatureOverrideEnabledByPoint||[]).concat(!1),this._validateAndEmit();return}let i=Number(e?.dataset?.pointIndex);if(!(!Number.isInteger(i)||!this._state.points[i])){if(r==="remove-point"){this._state.points=this._state.points.filter((s,o)=>o!==i),this._temperatureOverrideEnabledByPoint=(this._temperatureOverrideEnabledByPoint||[]).filter((s,o)=>o!==i),this._state.points.length===0&&(this._state.points=[{number:"",name:"",temperature:"",itemizationRows:[]}],this._temperatureOverrideEnabledByPoint=[!1]),this._validateAndEmit();return}if(r==="add-row"){this._state.points[i].itemizationRows=this._state.points[i].itemizationRows.concat({stat:"",name:""}),this._validateAndEmit();return}if(r==="remove-row"){let s=Number(e?.dataset?.rowIndex);if(!Number.isInteger(s))return;this._state.points[i].itemizationRows=this._state.points[i].itemizationRows.filter((o,a)=>a!==s),this._validateAndEmit()}}}_validateAndEmit(){if(this._draftErrors=this._collectDraftErrors(),Object.keys(this._draftErrors).length){this._error="",this._render();return}try{let t=qr(this._state),e=Wt(t);this._error="",Vi(this,e)}catch(t){this._error=t&&t.message?t.message:String(t)}this._render()}_collectDraftErrors(){let t={};return(Array.isArray(this._state?.points)?this._state.points:[]).forEach((r,i)=>{let s={};(typeof r?.number=="string"||typeof r?.number=="number"?String(r.number).trim():"")||(s.number="Select metering point number."),Object.keys(s).length&&(t[i]=s)}),t}_maybeEnsureStatisticPickerLoaded(){if(this._statisticPickerAvailable||customElements.get("ha-statistic-picker")){this._statisticPickerAvailable=!0;return}this._ensureStatisticPickerPromise||!this._hass||!this.shadowRoot||!this.isConnected||(this._ensureStatisticPickerPromise=this._ensureStatisticPickerLoaded().finally(()=>{this._ensureStatisticPickerPromise=void 0}))}async _ensureStatisticPickerLoaded(){if(!customElements.get("ha-selector"))return;let t=document.createElement("ha-selector");t.hass=this._hass,t.selector={statistic:{}},t.style.display="none",this.shadowRoot.appendChild(t);try{await Promise.race([customElements.whenDefined("ha-statistic-picker"),new Promise(e=>window.setTimeout(e,1200))])}finally{t.remove(),this._statisticPickerAvailable=!!customElements.get("ha-statistic-picker"),this._render()}}};if(typeof customElements<"u"){let n="fortum-energy-multipoint-strategy-editor";customElements.get(n)||customElements.define(n,_t)}});var Kr={};We(Kr,{FortumEnergySingleStrategyEditor:()=>ft});var qi,q,ft,Te=nt(()=>{Pt();De();Ct();qi=(n,t)=>{n.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))},q=n=>String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),ft=class extends HTMLElement{connectedCallback(){this._maybeEnsureStatisticPickerLoaded()}setConfig(t){this._state=Br(t),this._temperatureOverrideEnabled=typeof this._state.meteringPointTemperature=="string"&&this._state.meteringPointTemperature.trim().length>0,this._state.hasExplicitItemization||(this._state.itemizationRows=this._readSingleItemizationBackup()),this._error="",this._statisticPickerAvailable=!!customElements.get("ha-statistic-picker"),this.shadowRoot||this.attachShadow({mode:"open"}),this._render(),this._maybeEnsureStatisticPickerLoaded()}set hass(t){this._hass=t,this._applyStatisticPickerProps(),this._render(),this._maybeEnsureStatisticPickerLoaded()}get hass(){return this._hass}_render(){if(!this.shadowRoot||!this._state)return;let t=this._statisticPickerAvailable??!!customElements.get("ha-statistic-picker"),e=this._getMeteringPointOptions(),r=this._state.meteringPointNumber||"",i=e.some(c=>c.number===r),s=r&&!i?{number:r,label:`${r} (not currently discovered)`}:null,o=this._state.itemizationRows,a=this._state.hasExplicitItemization?o.map((c,d)=>`
          <div class="item-row" data-index="${d}">
            ${t?`<ha-statistic-picker
                    data-field="stat"
                    data-index="${d}"
                    class="stat-picker"
                    hide-clear-icon
                  ></ha-statistic-picker>`:`<input
                    data-field="stat"
                    data-index="${d}"
                    class="input stat"
                    type="text"
                    placeholder="statistic id"
                    value="${q(c?.stat||"")}"
                  />`}
            <input
              data-field="name"
              data-index="${d}"
              class="input name-input"
              type="text"
              placeholder="Name (optional)"
              value="${q(c?.name||"")}"
            />
            <button type="button" class="remove" data-action="remove-item" data-index="${d}">
              Remove
            </button>
          </div>`).join(""):"";this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          color: var(--primary-text-color);
        }
        .wrapper {
          display: grid;
          gap: 16px;
        }
        .field {
          display: grid;
          gap: 6px;
        }
        .label {
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-text-color);
        }
        .hint {
          font-size: 12px;
          color: var(--secondary-text-color);
        }
        .input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid var(--input-border-color, var(--divider-color));
          border-radius: 10px;
          min-height: 40px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          padding: 8px 10px;
        }
        .name-input {
          min-height: 52px;
        }
        .row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .checkbox {
          width: 18px;
          height: 18px;
        }
        .itemization {
          display: grid;
          gap: 10px;
        }
        .mode-option {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .item-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
          gap: 8px;
          align-items: center;
        }
        .stat-picker {
          width: 100%;
        }
        .actions {
          display: flex;
        }
        button {
          border: 1px solid var(--divider-color);
          border-radius: 10px;
          background: transparent;
          color: var(--primary-text-color);
          min-height: 38px;
          padding: 0 12px;
          cursor: pointer;
        }
        .error {
          border-radius: 10px;
          border: 1px solid var(--error-color);
          color: var(--error-color);
          background: color-mix(in srgb, var(--error-color) 10%, transparent);
          padding: 10px;
          white-space: pre-wrap;
          font-size: 13px;
        }
        @media (max-width: 800px) {
          .item-row {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      </style>
      <div class="wrapper">
        <div class="field">
          <label class="label" for="metering-point">Metering point number</label>
          <select
            id="metering-point"
            class="input"
            data-field="metering_point_number"
          >
            <option value="">Auto-discover (single point only)</option>
            ${s?`<option value="${q(s.number)}" selected>${q(s.label)}</option>`:""}
            ${e.map(c=>`<option
                  value="${q(c.number)}"
                  ${c.number===r?"selected":""}
                >${q(c.label)}</option>`).join("")}
          </select>
          <div class="hint">
            Leave empty to auto-discover when exactly one Fortum metering point exists.
          </div>
        </div>

        <div class="field">
          <label class="label" for="metering-point-name">Display name</label>
          <input
            id="metering-point-name"
            class="input"
            data-field="metering_point_name"
            type="text"
            placeholder="Name (optional)"
            value="${q(this._state.meteringPointName||"")}"
          />
        </div>

        <div class="field">
          <div class="row">
            <input
              id="override-temperature"
              class="checkbox"
              type="checkbox"
              data-field="override_temperature"
              ${this._temperatureOverrideEnabled?"checked":""}
            />
            <label for="override-temperature">Override temperature source</label>
          </div>
          ${this._temperatureOverrideEnabled?t?`<ha-statistic-picker
                    id="metering-point-temperature"
                    class="stat-picker"
                    data-field="temperature_stat"
                    hide-clear-icon
                  ></ha-statistic-picker>`:`<input
                    id="metering-point-temperature"
                    class="input"
                    data-field="metering_point_temperature"
                    type="text"
                    placeholder="Temperature source"
                    value="${q(this._state.meteringPointTemperature||"")}"
                  />`:""}
        </div>

        <div class="field">
          <div class="row">
            <input
              id="debug"
              class="checkbox"
              type="checkbox"
              data-field="debug"
              ${this._state.debug?"checked":""}
            />
            <label for="debug">Debug</label>
          </div>
        </div>

        <div class="field">
          <div class="mode-option">
            <input
              id="itemization-source-energy"
              class="checkbox"
              type="radio"
              name="itemization-source"
              data-field="itemization_mode"
              data-value="energy"
              ${this._state.hasExplicitItemization?"":"checked"}
            />
            <label for="itemization-source-energy">Use Energy dashboard itemization</label>
          </div>
          ${this._state.hasExplicitItemization?"":'<div class="hint">Manage itemizations in Energy settings. <a href="/config/energy/electricity?historyBack=1">Open Energy settings</a>.</div>'}
          <div class="mode-option">
            <input
              id="itemization-source-manual"
              class="checkbox"
              type="radio"
              name="itemization-source"
              data-field="itemization_mode"
              data-value="manual"
              ${this._state.hasExplicitItemization?"checked":""}
            />
            <label for="itemization-source-manual">Specify itemizations manually</label>
          </div>
        </div>

        ${this._state.hasExplicitItemization?`<div class="itemization">
            ${t?"":'<div class="hint">Statistic picker is unavailable here. Enter statistic IDs manually.</div>'}
            ${a}
            <div class="actions">
              <button type="button" data-action="add-item">Add itemization row</button>
            </div>
          </div>`:""}

        ${this._error?`<div class="error">${q(this._error)}</div>`:""}
      </div>
    `,this._bindEvents()}_bindEvents(){this.shadowRoot&&(this.shadowRoot.querySelectorAll("[data-field]").forEach(t=>{t.addEventListener("change",e=>{this._handleFieldChange(e)})}),this._applyStatisticPickerProps(),this.shadowRoot.querySelectorAll("button[data-action]").forEach(t=>{t.addEventListener("click",e=>{this._handleAction(e)})}))}_getMeteringPointOptions(){return ht(this._hass).map(t=>({number:t.number,address:t.address,label:t.label}))}_buildExcludeStatistics(t){return!this._state||!Array.isArray(this._state.itemizationRows)?[]:this._state.itemizationRows.map((e,r)=>r===t||typeof e?.stat!="string"?"":e.stat.trim()).filter(Boolean)}_applyStatisticPickerProps(){!this.shadowRoot||!this._state||(this.shadowRoot.querySelectorAll("ha-statistic-picker[data-field='stat']").forEach(t=>{if(t.allowCustomEntity=!0,t.statisticTypes="sum",t.includeUnitClass=["energy"],!t.dataset.suppressMissingEntityItem){t.dataset.suppressMissingEntityItem="1";try{typeof t._getAdditionalItems=="function"&&(t._getAdditionalItems=()=>[])}catch{}}this._hass&&(t.hass=this._hass);let e=Number(t.dataset.index),r=Number.isInteger(e)?this._state.itemizationRows[e]:void 0;t.value=r?.stat||"",t.excludeStatistics=this._buildExcludeStatistics(e),t.dataset.boundValueChanged||(t.dataset.boundValueChanged="1",t.addEventListener("value-changed",i=>{this._handleStatisticPickerChange(i)})),typeof t.requestUpdate=="function"&&t.requestUpdate()}),this.shadowRoot.querySelectorAll("ha-statistic-picker[data-field='temperature_stat']").forEach(t=>{if(t.allowCustomEntity=!0,t.statisticTypes="mean",t.includeUnitClass=["temperature"],!t.dataset.suppressMissingEntityItem){t.dataset.suppressMissingEntityItem="1";try{typeof t._getAdditionalItems=="function"&&(t._getAdditionalItems=()=>[])}catch{}}this._hass&&(t.hass=this._hass),t.value=this._state.meteringPointTemperature||"",t.dataset.boundValueChanged||(t.dataset.boundValueChanged="1",t.addEventListener("value-changed",e=>{this._handleStatisticPickerChange(e)})),typeof t.requestUpdate=="function"&&t.requestUpdate()}))}_maybeEnsureStatisticPickerLoaded(){if(this._statisticPickerAvailable||customElements.get("ha-statistic-picker")){this._statisticPickerAvailable=!0;return}this._ensureStatisticPickerPromise||!this._hass||!this.shadowRoot||!this.isConnected||(this._ensureStatisticPickerPromise=this._ensureStatisticPickerLoaded().finally(()=>{this._ensureStatisticPickerPromise=void 0}))}async _ensureStatisticPickerLoaded(){let t="ha-selector";if(!customElements.get(t))return;let e=document.createElement(t);e.hass=this._hass,e.selector={statistic:{}},e.style.display="none",this.shadowRoot.appendChild(e);try{await Promise.race([customElements.whenDefined("ha-statistic-picker"),new Promise(r=>window.setTimeout(r,1200))])}finally{e.remove(),this._statisticPickerAvailable=!!customElements.get("ha-statistic-picker"),this._render()}}_handleStatisticPickerChange(t){if(!this._state)return;let e=t.currentTarget,r=e?.dataset?.field,i=t?.detail?.value;if(r==="temperature_stat"){this._state.meteringPointTemperature=typeof i=="string"?i:"",this._validateAndEmit();return}let s=Number(e?.dataset?.index);!Number.isInteger(s)||s<0||s>=this._state.itemizationRows.length||(this._state.itemizationRows[s]={...this._state.itemizationRows[s],stat:typeof i=="string"?i:""},this._persistSingleItemizationBackup(),this._validateAndEmit())}_handleFieldChange(t){if(!this._state)return;let e=t.currentTarget,r=e?.dataset?.field;if(r==="metering_point_number"){this._state.meteringPointNumber=e.value,this._validateAndEmit();return}if(r==="metering_point_name"){this._state.meteringPointName=e.value,this._validateAndEmit();return}if(r==="metering_point_temperature"){this._state.meteringPointTemperature=e.value,this._validateAndEmit();return}if(r==="override_temperature"){this._temperatureOverrideEnabled=e.checked,this._temperatureOverrideEnabled||(this._state.meteringPointTemperature=""),this._validateAndEmit();return}if(r==="debug"){this._state.debug=e.checked,this._validateAndEmit();return}if(r==="itemization_mode"){let i=e.dataset.value==="manual";if(!i&&this._state.hasExplicitItemization&&this._persistSingleItemizationBackup(),this._state.hasExplicitItemization=i,this._state.hasExplicitItemization&&this._state.itemizationRows.length===0){let s=this._readSingleItemizationBackup();this._state.itemizationRows=s.length?s:[{stat:"",name:""}]}this._validateAndEmit();return}if(r==="stat"||r==="name"){let i=Number(e.dataset.index);if(!Number.isInteger(i)||i<0||i>=this._state.itemizationRows.length)return;this._state.itemizationRows[i]={...this._state.itemizationRows[i],[r]:e.value},this._persistSingleItemizationBackup(),this._validateAndEmit()}}_handleAction(t){if(!this._state)return;let e=t.currentTarget,r=e?.dataset?.action;if(r==="add-item"){this._state.itemizationRows=this._state.itemizationRows.concat({stat:"",name:""}),this._persistSingleItemizationBackup(),this._validateAndEmit();return}if(r==="remove-item"){let i=Number(e.dataset.index);if(!Number.isInteger(i)||i<0||i>=this._state.itemizationRows.length)return;this._state.itemizationRows=this._state.itemizationRows.filter((s,o)=>o!==i),this._persistSingleItemizationBackup(),this._validateAndEmit()}}_persistSingleItemizationBackup(){if(!this._state||!this._state.hasExplicitItemization)return;let t=this._singleItemizationBackupKey();if(!t)return;let e=gt(this._state.itemizationRows);try{globalThis.localStorage?.setItem(t,JSON.stringify(e))}catch{}}_singleItemizationBackupKey(){let t=typeof globalThis?.location?.pathname=="string"?globalThis.location.pathname:"";return t?`fortum_energy_itemization_backup_single_${t}`:null}_readSingleItemizationBackup(){let t=this._singleItemizationBackupKey();if(!t)return[];try{let e=globalThis.localStorage?.getItem(t);return e?gt(JSON.parse(e)):[]}catch{return[]}}_validateAndEmit(){try{let t=Hr(this._state),e=Kt(t);this._error="",qi(this,e)}catch(t){this._error=t&&t.message?t.message:String(t)}this._render()}};if(typeof customElements<"u"){let n="fortum-energy-single-strategy-editor";customElements.get(n)||customElements.define(n,ft)}});var I="energy_fortum_energy_dashboard",j={energy_sources:[],device_consumption:[],device_consumption_water:[]},de="fortum-energy-range-";var Nt=async n=>{try{return await n.callWS({type:"energy/get_prefs"})||j}catch(t){if(t&&t.code==="not_found")return j;throw t}};var Xe={energy_sources:[],device_consumption:[],device_consumption_water:[]},Qe=n=>typeof n=="string"&&/^[^:]*fortum:hourly_consumption_/.test(n),ot=n=>Array.isArray(n)?n.map(t=>{if(!t||typeof t!="object")return null;let e=typeof t.stat_energy_from=="string"?t.stat_energy_from.trim():"";if(!e)return null;let r=typeof t.stat_cost=="string"?t.stat_cost.trim():"";return{stat_energy_from:e,stat_cost:r||void 0}}).filter(Boolean):[],ai=n=>Array.isArray(n?.flow_from)&&n.flow_from.length?n.flow_from:[n],ci=n=>Array.isArray(n?.flow_to)&&n.flow_to.length?n.flow_to:[n],Ye=n=>Qe(n)?n.replace("hourly_consumption_","hourly_price_"):null,Je=n=>Qe(n)?n.replace("hourly_consumption_","hourly_temperature_"):null,Ze=n=>(typeof n!="string"||!n.includes("hourly_price_"),null),ue=({prefs:n,info:t,overrides:e,strictOverride:r=!1})=>{let i=n||Xe,s=t||{cost_sensors:{}},o=ot(e),a=Array.isArray(e),c=r?a:o.length>0,d={fromGrid:[],toGrid:[],solar:[],fromBattery:[],toBattery:[]},h={importCost:[],exportCompensation:[],price:[],temperature:[]},u=[],_=[];return c?(o.length||_.push("override_provided_but_no_valid_energy_sources"),o.forEach(p=>{d.fromGrid.push(p.stat_energy_from);let y=p.stat_cost||s.cost_sensors[p.stat_energy_from];y&&h.importCost.push(y);let x=Ye(p.stat_energy_from);if(x){h.price.push(x);let b=Ze(x);b&&u.push(b)}let g=Je(p.stat_energy_from);g&&h.temperature.push(g)})):(i.energy_sources||[]).forEach(p=>{if(p.type==="grid"){ai(p).forEach(y=>{if(!y?.stat_energy_from)return;d.fromGrid.push(y.stat_energy_from);let x=y.stat_cost||s.cost_sensors[y.stat_energy_from];x&&h.importCost.push(x);let g=Ye(y.stat_energy_from);if(g){h.price.push(g);let v=Ze(g);v&&u.push(v)}let b=Je(y.stat_energy_from);b&&h.temperature.push(b)}),ci(p).forEach(y=>{if(!y?.stat_energy_to)return;d.toGrid.push(y.stat_energy_to);let x=y.stat_compensation||y.stat_cost||s.cost_sensors[y.stat_energy_to];x&&h.exportCompensation.push(x)});return}if(p.type==="solar"&&p.stat_energy_from){d.solar.push(p.stat_energy_from);return}p.type==="battery"&&(p.stat_energy_from&&d.fromBattery.push(p.stat_energy_from),p.stat_energy_to&&d.toBattery.push(p.stat_energy_to))}),{source:c?"override":"prefs",strictOverride:!!r,hasOverrideInput:a,overridesCount:o.length,issues:_,flowIds:{fromGrid:Array.from(new Set(d.fromGrid)),toGrid:Array.from(new Set(d.toGrid)),solar:Array.from(new Set(d.solar)),fromBattery:Array.from(new Set(d.fromBattery)),toBattery:Array.from(new Set(d.toBattery))},overlayIds:{importCost:Array.from(new Set(h.importCost)),exportCompensation:Array.from(new Set(h.exportCompensation)),price:Array.from(new Set(h.price)),temperature:Array.from(new Set(h.temperature))},forecastIds:Array.from(new Set(u))}},li={EMPTY_PREFS:Xe,normalizeEnergySourceOverrides:ot,deriveEnergyRuntimeConfig:ue};typeof globalThis<"u"&&(globalThis.__fortumEnergyRuntimeConfig=li);var Rt=class extends HTMLElement{setConfig(t){this._config=t||{},this._energySourceOverrides=ot(this._config.energy_sources),this.shadowRoot||this.attachShadow({mode:"open"}),this._trySubscribe(),this._render()}set hass(t){this._hassUpdateCount=(this._hassUpdateCount||0)+1;let e=this._hass?.locale?.language!==t?.locale?.language,r=this._hass?.config?.currency!==t?.config?.currency;this._hass=t,this._trySubscribe(),this._ensureLatestPrefs(),(!this._hasRendered||e||r)&&this._render()}async _ensureLatestPrefs(){if(!this._hass||this._loadingPrefs)return;let t=Date.now();if(!(this._latestPrefs&&this._lastPrefsFetch&&t-this._lastPrefsFetch<3e5)){this._loadingPrefs=!0;try{let e=await Nt(this._hass);this._latestPrefs=e,this._lastPrefsFetch=Date.now(),this._scheduleRender()}catch{}finally{this._loadingPrefs=!1}}}disconnectedCallback(){this._unsubscribe&&(this._unsubscribe(),this._unsubscribe=void 0)}getCardSize(){return 5}_getCollection(){let e=`_${this._config?.collection_key||I}`;return this._hass?.connection?.[e]}_trySubscribe(){let t=this._getCollection();!t||t===this._collection||!t.subscribe||(this._unsubscribe&&this._unsubscribe(),this._collection=t,this._unsubscribe=t.subscribe(e=>{this._energyData=e,this._updateCount=(this._updateCount||0)+1,this._lastUpdateAt=Date.now(),this._scheduleRender()}))}_scheduleRender(){this._renderQueued||(this._renderQueued=!0,requestAnimationFrame(()=>{this._renderQueued=!1,this._render()}))}_sumStatistic(t,e){return!e||!t||!t[e]?0:t[e].reduce((r,i)=>{let s=i?.change;return r+(typeof s=="number"?s:0)},0)}_sumStatisticsByTimestamp(t,e){let r={},i=0;return e.forEach(s=>{let o=t[s];o&&o.forEach(a=>{if(a.change===null||a.change===void 0)return;let c=a.change;i+=c,r[a.start]=(r[a.start]||0)+c})}),{totals:r,sum:i}}_getGridImportFlows(t){return Array.isArray(t.flow_from)&&t.flow_from.length?t.flow_from:[t]}_getGridExportFlows(t){return Array.isArray(t.flow_to)&&t.flow_to.length?t.flow_to:[t]}_computeConsumptionSingle(t){let e=Math.max(t.to_grid||0,0),r=Math.max(t.to_battery||0,0),i=Math.max(t.solar||0,0),s=Math.max(t.from_grid||0,0),o=Math.max(t.from_battery||0,0),a=s+i+o-e-r,c=Math.max(a,0),d=Math.max(0,Math.min(r,s-c));r-=d,s-=d;let h=Math.min(i,r);r-=h,i-=h;let u=Math.min(i,e);e-=u,i-=u;let _=Math.min(o,e);o-=_,e-=_;let p=Math.min(s,r);s-=p;let y=Math.min(c,i);c-=y;let x=Math.min(o,c);c-=x;let g=Math.min(c,s);return{used_total:a,used_grid:g,used_solar:y,used_battery:x}}_computeTotalConsumptionFromEnergyModel(t,e){let r=[],i=[],s=[],o=[],a=[];this._energySourceOverrides.length&&this._energySourceOverrides.forEach(x=>{r.push(x.stat_energy_from)}),t.energy_sources.forEach(x=>{if(x.type==="grid"){this._energySourceOverrides.length||this._getGridImportFlows(x).forEach(g=>{g.stat_energy_from&&r.push(g.stat_energy_from)}),this._getGridExportFlows(x).forEach(g=>{g.stat_energy_to&&i.push(g.stat_energy_to)});return}if(x.type==="solar"){s.push(x.stat_energy_from);return}x.type==="battery"&&(a.push(x.stat_energy_from),o.push(x.stat_energy_to))});let c=this._sumStatisticsByTimestamp(e,r).totals,d=this._sumStatisticsByTimestamp(e,i).totals,h=this._sumStatisticsByTimestamp(e,s).totals,u=this._sumStatisticsByTimestamp(e,a).totals,_=this._sumStatisticsByTimestamp(e,o).totals,p=new Set([...Object.keys(c),...Object.keys(d),...Object.keys(h),...Object.keys(u),...Object.keys(_)]),y=0;return p.forEach(x=>{let g=Number(x),b=this._computeConsumptionSingle({from_grid:c[g]||0,to_grid:d[g]||0,solar:h[g]||0,from_battery:u[g]||0,to_battery:_[g]||0});y+=b.used_total||0}),Math.max(0,y)}_computeTotals(t){let e=t.stats||{},r=this._latestPrefs||t.prefs||j,i=t.info||{cost_sensors:{}},s=(r.energy_sources||[]).filter(m=>m.type==="grid"),o=0,a=0,c=0,d=0,h=0,u=0,_=0,p={gridFromIds:[],gridToIds:[],costImportIds:[],costExportIds:[],statKeys:Object.keys(e).length,prefsEnergySources:(t.prefs?.energy_sources||[]).length,activePrefsEnergySources:r.energy_sources.length,prefsTypes:(t.prefs?.energy_sources||[]).map(m=>m.type),activePrefsTypes:r.energy_sources.map(m=>m.type),firstCollectionSource:t.prefs?.energy_sources?.[0]||null,firstActiveSource:r.energy_sources?.[0]||null};this._energySourceOverrides.length?this._energySourceOverrides.forEach(m=>{p.gridFromIds.push(m.stat_energy_from),o+=this._sumStatistic(e,m.stat_energy_from);let w=m.stat_cost||i.cost_sensors[m.stat_energy_from];w&&p.costImportIds.push(w),u+=this._sumStatistic(e,w)}):s.forEach(m=>{this._getGridImportFlows(m).forEach(w=>{if(!w.stat_energy_from)return;p.gridFromIds.push(w.stat_energy_from),o+=this._sumStatistic(e,w.stat_energy_from);let S=w.stat_cost||i.cost_sensors[w.stat_energy_from];S&&p.costImportIds.push(S),u+=this._sumStatistic(e,S)})}),s.forEach(m=>{this._getGridExportFlows(m).forEach(w=>{if(!w.stat_energy_to)return;p.gridToIds.push(w.stat_energy_to),a+=this._sumStatistic(e,w.stat_energy_to);let S=w.stat_compensation||w.stat_cost||i.cost_sensors[w.stat_energy_to];S&&p.costExportIds.push(S),_+=this._sumStatistic(e,S)})});for(let m of r.energy_sources)if(m.type!=="grid"){if(m.type==="solar"){c+=this._sumStatistic(e,m.stat_energy_from);continue}m.type==="battery"&&(d+=this._sumStatistic(e,m.stat_energy_from),h+=this._sumStatistic(e,m.stat_energy_to))}let y=this._computeTotalConsumptionFromEnergyModel(r,e),x=u-_,g=r.device_consumption.map(m=>({name:m.name||m.stat,consumption:this._sumStatistic(e,m.stat)})),b=g.reduce((m,w)=>m+w.consumption,0),v=Math.max(0,y-b),E=y>0?x/y:0;return{totalConsumption:y,totalCost:x,devices:g.map(m=>({...m,cost:m.consumption*E})),unspecifiedConsumption:v,unspecifiedCost:v*E,__debug:{...p,hassUpdateCount:this._hassUpdateCount||0,renderCount:this._renderCount||0,updateCount:this._updateCount||0,lastUpdateAt:this._lastUpdateAt||0,fromGrid:o,toGrid:a,solar:c,fromBattery:d,toBattery:h,importCost:u,exportCompensation:_}}}_formatEnergy(t){let e=this._hass?.locale?.language||"en";return`${new Intl.NumberFormat(e,{maximumFractionDigits:2}).format(t)} kWh`}_formatCost(t){let e=this._hass?.locale?.language||"en";return new Intl.NumberFormat(e,{style:"currency",currency:this._hass.config.currency||"EUR",maximumFractionDigits:2}).format(t)}_render(){if(!this.shadowRoot)return;if(!this._hass){this.shadowRoot.innerHTML="";return}let t=this._energyData||this._getCollection()?.state;if(!t||!t.prefs||!t.stats){this.shadowRoot.innerHTML=`
        <style>
          :host { display: block; }
          .content { padding: 16px; color: var(--secondary-text-color); }
        </style>
        <ha-card><div class="content">Loading...</div></ha-card>
      `;return}try{this._renderCount=(this._renderCount||0)+1;let e=this._computeTotals(t),i=[{name:"Total",consumption:e.totalConsumption,cost:e.totalCost,bold:!0},...e.devices.map(s=>({name:s.name,consumption:s.consumption,cost:s.cost})),{name:"Unspecified",consumption:e.unspecifiedConsumption,cost:e.unspecifiedCost}].map(s=>`
          <tr class="${s.bold?"bold":""}">
            <td>${s.name}</td>
            <td class="num">${this._formatEnergy(s.consumption)}</td>
            <td class="num">${this._formatCost(s.cost)}</td>
          </tr>
        `).join("");this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          height: 100%;
          user-select: text;
          -webkit-user-select: text;
        }
        ha-card {
          height: 100%;
        }
        .wrap {
          padding: 12px 16px 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--ha-font-size-s);
        }
        th,
        td {
          padding: 8px 0;
          border-bottom: 1px solid var(--divider-color);
          user-select: text;
          -webkit-user-select: text;
        }
        th {
          text-align: left;
          color: var(--secondary-text-color);
          font-weight: var(--ha-font-weight-medium);
        }
        .num {
          text-align: right;
          white-space: nowrap;
        }
        tr.bold td {
          font-weight: var(--ha-font-weight-medium);
        }
      </style>
      <ha-card>
        <div class="wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="num">Consumption</th>
                <th class="num">Cost</th>
              </tr>
            </thead>
            <tbody>${i}</tbody>
          </table>
        </div>
      </ha-card>
    `,this._hasRendered=!0}catch(e){console.error("[fortum-energy] custom legend render failed",e),this.shadowRoot.innerHTML=`
        <ha-card>
          <div style="padding:12px;color:var(--error-color);">Custom legend failed to render</div>
        </ha-card>
      `}}};var zt=globalThis,Ot=zt.ShadowRoot&&(zt.ShadyCSS===void 0||zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,er=Symbol(),tr=new WeakMap,Ft=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==er)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Ot&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=tr.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&tr.set(e,t))}return t}toString(){return this.cssText}},rr=n=>new Ft(typeof n=="string"?n:n+"",void 0,er);var ir=(n,t)=>{if(Ot)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),i=zt.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,n.appendChild(r)}},he=Ot?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return rr(e)})(n):n;var{is:di,defineProperty:ui,getOwnPropertyDescriptor:hi,getOwnPropertyNames:mi,getOwnPropertySymbols:pi,getPrototypeOf:gi}=Object,Lt=globalThis,sr=Lt.trustedTypes,_i=sr?sr.emptyScript:"",fi=Lt.reactiveElementPolyfillSupport,bt=(n,t)=>n,me={toAttribute(n,t){switch(t){case Boolean:n=n?_i:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},or=(n,t)=>!di(n,t),nr={attribute:!0,type:String,converter:me,reflect:!1,useDefault:!1,hasChanged:or};Symbol.metadata??=Symbol("metadata"),Lt.litPropertyMetadata??=new WeakMap;var H=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=nr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(t,r,e);i!==void 0&&ui(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){let{get:i,set:s}=hi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let a=i?.call(this);s?.call(this,o),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??nr}static _$Ei(){if(this.hasOwnProperty(bt("elementProperties")))return;let t=gi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(bt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(bt("properties"))){let e=this.properties,r=[...mi(e),...pi(e)];for(let i of r)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let i of r)e.unshift(he(i))}else t!==void 0&&e.push(he(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ir(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:me).toAttribute(e,r.type);this._$Em=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(t,e){let r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:me;this._$Em=i;let a=o.fromAttribute(e,s.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,r,i=!1,s){if(t!==void 0){let o=this.constructor;if(i===!1&&(s=this[t]),r??=o.getPropertyOptions(t),!((r.hasChanged??or)(s,e)||r.useDefault&&r.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:i,wrapped:s},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),s!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:o}=s,a=this[i];o!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,s,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};H.elementStyles=[],H.shadowRootOptions={mode:"open"},H[bt("elementProperties")]=new Map,H[bt("finalized")]=new Map,fi?.({ReactiveElement:H}),(Lt.reactiveElementVersions??=[]).push("2.1.2");var ve=globalThis,ar=n=>n,Ut=ve.trustedTypes,cr=Ut?Ut.createPolicy("lit-html",{createHTML:n=>n}):void 0,pr="$lit$",G=`lit$${Math.random().toFixed(9).slice(2)}$`,gr="?"+G,yi=`<${gr}>`,X=document,wt=()=>X.createComment(""),St=n=>n===null||typeof n!="object"&&typeof n!="function",we=Array.isArray,bi=n=>we(n)||typeof n?.[Symbol.iterator]=="function",pe=`[ 	
\f\r]`,vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,lr=/-->/g,dr=/>/g,J=RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ur=/'/g,hr=/"/g,_r=/^(?:script|style|textarea|title)$/i,Se=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),V=Se(1),fs=Se(2),ys=Se(3),Q=Symbol.for("lit-noChange"),k=Symbol.for("lit-nothing"),mr=new WeakMap,Z=X.createTreeWalker(X,129);function fr(n,t){if(!we(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return cr!==void 0?cr.createHTML(t):t}var vi=(n,t)=>{let e=n.length-1,r=[],i,s=t===2?"<svg>":t===3?"<math>":"",o=vt;for(let a=0;a<e;a++){let c=n[a],d,h,u=-1,_=0;for(;_<c.length&&(o.lastIndex=_,h=o.exec(c),h!==null);)_=o.lastIndex,o===vt?h[1]==="!--"?o=lr:h[1]!==void 0?o=dr:h[2]!==void 0?(_r.test(h[2])&&(i=RegExp("</"+h[2],"g")),o=J):h[3]!==void 0&&(o=J):o===J?h[0]===">"?(o=i??vt,u=-1):h[1]===void 0?u=-2:(u=o.lastIndex-h[2].length,d=h[1],o=h[3]===void 0?J:h[3]==='"'?hr:ur):o===hr||o===ur?o=J:o===lr||o===dr?o=vt:(o=J,i=void 0);let p=o===J&&n[a+1].startsWith("/>")?" ":"";s+=o===vt?c+yi:u>=0?(r.push(d),c.slice(0,u)+pr+c.slice(u)+G+p):c+G+(u===-2?a:p)}return[fr(n,s+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},xt=class n{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let s=0,o=0,a=t.length-1,c=this.parts,[d,h]=vi(t,e);if(this.el=n.createElement(d,r),Z.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=Z.nextNode())!==null&&c.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(pr)){let _=h[o++],p=i.getAttribute(u).split(G),y=/([.?@])?(.*)/.exec(_);c.push({type:1,index:s,name:y[2],strings:p,ctor:y[1]==="."?_e:y[1]==="?"?fe:y[1]==="@"?ye:ct}),i.removeAttribute(u)}else u.startsWith(G)&&(c.push({type:6,index:s}),i.removeAttribute(u));if(_r.test(i.tagName)){let u=i.textContent.split(G),_=u.length-1;if(_>0){i.textContent=Ut?Ut.emptyScript:"";for(let p=0;p<_;p++)i.append(u[p],wt()),Z.nextNode(),c.push({type:2,index:++s});i.append(u[_],wt())}}}else if(i.nodeType===8)if(i.data===gr)c.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(G,u+1))!==-1;)c.push({type:7,index:s}),u+=G.length-1}s++}}static createElement(t,e){let r=X.createElement("template");return r.innerHTML=t,r}};function at(n,t,e=n,r){if(t===Q)return t;let i=r!==void 0?e._$Co?.[r]:e._$Cl,s=St(t)?void 0:t._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(n),i._$AT(n,e,r)),r!==void 0?(e._$Co??=[])[r]=i:e._$Cl=i),i!==void 0&&(t=at(n,i._$AS(n,t.values),i,r)),t}var ge=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,i=(t?.creationScope??X).importNode(e,!0);Z.currentNode=i;let s=Z.nextNode(),o=0,a=0,c=r[0];for(;c!==void 0;){if(o===c.index){let d;c.type===2?d=new Et(s,s.nextSibling,this,t):c.type===1?d=new c.ctor(s,c.name,c.strings,this,t):c.type===6&&(d=new be(s,this,t)),this._$AV.push(d),c=r[++a]}o!==c?.index&&(s=Z.nextNode(),o++)}return Z.currentNode=X,i}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},Et=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,i){this.type=2,this._$AH=k,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=at(this,t,e),St(t)?t===k||t==null||t===""?(this._$AH!==k&&this._$AR(),this._$AH=k):t!==this._$AH&&t!==Q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):bi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==k&&St(this._$AH)?this._$AA.nextSibling.data=t:this.T(X.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=xt.createElement(fr(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new ge(i,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(t){let e=mr.get(t.strings);return e===void 0&&mr.set(t.strings,e=new xt(t)),e}k(t){we(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,i=0;for(let s of t)i===e.length?e.push(r=new n(this.O(wt()),this.O(wt()),this,this.options)):r=e[i],r._$AI(s),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=ar(t).nextSibling;ar(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ct=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,i,s){this.type=1,this._$AH=k,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=k}_$AI(t,e=this,r,i){let s=this.strings,o=!1;if(s===void 0)t=at(this,t,e,0),o=!St(t)||t!==this._$AH&&t!==Q,o&&(this._$AH=t);else{let a=t,c,d;for(t=s[0],c=0;c<s.length-1;c++)d=at(this,a[r+c],e,c),d===Q&&(d=this._$AH[c]),o||=!St(d)||d!==this._$AH[c],d===k?t=k:t!==k&&(t+=(d??"")+s[c+1]),this._$AH[c]=d}o&&!i&&this.j(t)}j(t){t===k?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},_e=class extends ct{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===k?void 0:t}},fe=class extends ct{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==k)}},ye=class extends ct{constructor(t,e,r,i,s){super(t,e,r,i,s),this.type=5}_$AI(t,e=this){if((t=at(this,t,e,0)??k)===Q)return;let r=this._$AH,i=t===k&&r!==k||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==k&&(r===k||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},be=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){at(this,t)}};var wi=ve.litHtmlPolyfillSupport;wi?.(xt,Et),(ve.litHtmlVersions??=[]).push("3.3.3");var yr=(n,t,e)=>{let r=e?.renderBefore??t,i=r._$litPart$;if(i===void 0){let s=e?.renderBefore??null;r._$litPart$=i=new Et(t.insertBefore(wt(),s),s,void 0,e??{})}return i._$AI(n),i};var xe=globalThis,lt=class extends H{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=yr(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Q}};lt._$litElement$=!0,lt.finalized=!0,xe.litElementHydrateSupport?.({LitElement:lt});var Si=xe.litElementPolyfillSupport;Si?.({LitElement:lt});(xe.litElementVersions??=[]).push("4.2.2");var Ee=(n,t,e)=>n.localize?.(t)||e,dt=(n,t=6,e=2)=>{let r=(n||[]).filter(d=>Number.isFinite(d));if(!r.length)return 0;let i=Math.min(...r),s=Math.max(...r),o=s-i;if(o<=0)return Math.abs(s)>0&&Math.abs(s)<1?e:0;let a=o/Math.max(1,t-1);if(!Number.isFinite(a)||a<=0)return 0;let c=Math.ceil(-Math.log10(a));return Math.max(0,Math.min(e,c))},br=(n,t)=>{let e=/^fortum:price_forecast_([a-z0-9_]+)$/i.exec(n||"");return e?`Price [${String(e[1]||"").toUpperCase()}]`:t===0?"Price":`Price ${t+1}`},ut=(n,t)=>{if(!n||!t)return!1;let e=s=>String(s).split(".").map(o=>parseInt(o,10)||0),r=e(n),i=e(t);for(let s=0;s<Math.max(r.length,i.length);s++){let o=r[s]||0,a=i[s]||0;if(o>a)return!0;if(o<a)return!1}return!0};var xi=n=>typeof n=="string"&&/^[^:]*fortum:hourly_consumption_/.test(n),Bt=class extends HTMLElement{setConfig(t){this._config=t||{},this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`
        <style>
          :host {
            display: block;
            height: 100%;
          }
          .container {
            height: 100%;
          }
        </style>
        <div class="container"></div>
      `),this._ensureInnerCard()}set hass(t){this._hass=t,this._ensureInnerCard(),this._innerCard&&(this._innerCard.hass=t),this._subscribeCollection(),this._overlayInitialized||(this._overlayInitialized=!0,this._scheduleOverlayApply())}disconnectedCallback(){this._unsubscribe&&(this._unsubscribe(),this._unsubscribe=void 0)}getCardSize(){return 3}_ensureInnerCard(){if(!this.shadowRoot||this._innerCard)return;let t=this.shadowRoot.querySelector(".container");t&&(this._innerCard=document.createElement("hui-card"),this._innerCard.config={...this._config,type:"energy-devices-detail-graph"},this._hass&&(this._innerCard.hass=this._hass),t.appendChild(this._innerCard))}_subscribeCollection(){let t=this._config?.collection_key||I,e=this._hass?.connection?.[`_${t}`];!e||e===this._collection||!e.subscribe||(this._unsubscribe&&this._unsubscribe(),this._collection=e,this._unsubscribe=e.subscribe(r=>{this._energyData=r,this._scheduleOverlayApply()}))}_scheduleOverlayApply(){this._overlayScheduled||(this._overlayScheduled=!0,requestAnimationFrame(()=>{this._overlayScheduled=!1,this._applyCostOverlay()}))}_collectCostByTimestamp(t){let e={},r=t?.prefs||j,i=t?.stats||{},s=t?.statsMetadata||{},o=t?.info||{cost_sensors:{}},a=new Set,c=(d,h=1)=>{!d||!i[d]||(a.add(d),i[d].forEach(u=>{u.change===null||u.change===void 0||(e[u.start]=(e[u.start]||0)+u.change*h)}))};r.energy_sources.forEach(d=>{if(d.type!=="grid")return;(Array.isArray(d.flow_from)?d.flow_from:[d]).forEach(_=>{if(!_.stat_energy_from)return;let p=_.stat_cost||o.cost_sensors[_.stat_energy_from];c(p,1)}),(Array.isArray(d.flow_to)?d.flow_to:[d]).forEach(_=>{if(!_.stat_energy_to)return;let p=_.stat_compensation||_.stat_cost||o.cost_sensors[_.stat_energy_to];c(p,-1)})});for(let d of a){let h=s?.[d]?.statistics_unit_of_measurement;if(h){this._costUnit=h;break}}return Object.keys(e).map(d=>[Number(d),e[d]]).sort((d,h)=>d[0]-h[0])}_toFortumPriceStatId(t){return xi(t)?t.replace("hourly_consumption_","hourly_price_"):null}_getStatsTimeBounds(t){let e=t?.start instanceof Date?t.start.getTime():NaN,r=t?.end instanceof Date?t.end.getTime():NaN;return Number.isFinite(e)&&Number.isFinite(r)&&r>e?{start:e,end:r}:Number.isFinite(e)?{start:e,end:Date.now()}:null}_normalizeExternalStats(t){return Array.isArray(t)?t.map(e=>{let r=e?.start,i=e?.end,s=typeof r=="number"?r:typeof r=="string"?Date.parse(r):NaN,o=typeof i=="number"?i:typeof i=="string"?Date.parse(i):NaN;if(!Number.isFinite(s))return null;let a=c=>c==null?null:Number(c);return{start:s,end:Number.isFinite(o)?o:s,change:a(e?.change),sum:a(e?.sum),mean:a(e?.mean),min:a(e?.min),max:a(e?.max),state:a(e?.state),last_reset:a(e?.last_reset)}}).filter(Boolean).sort((e,r)=>e.start-r.start):[]}_collectDetailStatIds(t){return Object.keys(t?.stats||{}).filter(Boolean)}_ensureExternalDetailStats(t,e){if(!this._hass||!t)return;let r=this._getStatsTimeBounds(t);if(!r)return;let i=this._collectDetailStatIds(t);if(!i.length)return;let s=[...new Set(i)].sort(),o=`${r.start}:${r.end}:${s.join("|")}`;this._externalDetailRangeKey!==o&&(this._externalDetailRangeKey=o,this._externalDetailStats={},this._externalDetailInflight=new Set),this._externalDetailInflight||(this._externalDetailInflight=new Set);let a=s.filter(c=>!this._externalDetailStats?.[c]&&!this._externalDetailInflight?.has(c));a.length&&(a.forEach(c=>this._externalDetailInflight.add(c)),this._hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(r.start).toISOString(),end_time:new Date(r.end).toISOString(),statistic_ids:a,period:"hour",types:["change","sum","state","mean","min","max","last_reset"]}).then(c=>{if(this._externalDetailRangeKey!==o)return;let d={...this._externalDetailStats||{}};a.forEach(h=>{d[h]=this._normalizeExternalStats(c?.[h])}),this._externalDetailStats=d,typeof e=="function"&&e()}).catch(c=>{console.warn("[fortum-energy] detail statistics fetch failed",c)}).finally(()=>{a.forEach(c=>this._externalDetailInflight.delete(c))}))}_withHourlyDetailStats(t,e){return!t||(this._ensureExternalDetailStats(t,e),!this._externalDetailStats||!Object.keys(this._externalDetailStats).length)?t:{...t,stats:{...t.stats||{},...this._externalDetailStats}}}_normalizeExternalPriceSeries(t){return Array.isArray(t)?t.map(e=>{let r=e?.start,i=typeof r=="number"?r:typeof r=="string"?Date.parse(r):NaN,s=e?.mean!==void 0&&e?.mean!==null?Number(e.mean):e?.state!==void 0&&e?.state!==null?Number(e.state):null;return!Number.isFinite(i)||!Number.isFinite(s)?null:{start:i,change:s}}).filter(Boolean).sort((e,r)=>e.start-r.start):[]}_ensureExternalPriceMetadata(t){if(!this._hass||!t.length)return;this._externalPriceMeta||(this._externalPriceMeta={}),this._externalPriceMetaInflight||(this._externalPriceMetaInflight=new Set);let e=t.filter(r=>r&&!this._externalPriceMeta?.[r]&&!this._externalPriceMetaInflight?.has(r));e.length&&(e.forEach(r=>this._externalPriceMetaInflight.add(r)),this._hass.callWS({type:"recorder/get_statistics_metadata",statistic_ids:e}).then(r=>{let i={...this._externalPriceMeta||{}};r?.forEach(s=>{s?.statistic_id&&(i[s.statistic_id]=s)}),this._externalPriceMeta=i}).catch(r=>{console.warn("[fortum-energy] price metadata fetch failed",r)}).finally(()=>{e.forEach(r=>this._externalPriceMetaInflight.delete(r))}))}_ensureExternalPriceStats(t,e){if(!this._hass||!t.length)return;let r=this._getStatsTimeBounds(e);if(!r)return;let i=`${r.start}:${r.end}`;this._externalPriceRangeKey!==i&&(this._externalPriceRangeKey=i,this._externalPriceStats={},this._externalPriceInflight=new Set),this._externalPriceInflight||(this._externalPriceInflight=new Set);let s=t.filter(o=>o&&!this._externalPriceStats?.[o]&&!this._externalPriceInflight?.has(o));s.length&&(s.forEach(o=>this._externalPriceInflight.add(o)),this._hass.callWS({type:"recorder/statistics_during_period",start_time:new Date(r.start).toISOString(),end_time:new Date(r.end).toISOString(),statistic_ids:s,period:"hour"}).then(o=>{if(this._externalPriceRangeKey!==i)return;let a={...this._externalPriceStats||{}};s.forEach(c=>{a[c]=this._normalizeExternalPriceSeries(o?.[c])}),this._externalPriceStats=a,this._scheduleOverlayApply()}).catch(o=>{console.warn("[fortum-energy] price statistics fetch failed",o)}).finally(()=>{s.forEach(o=>this._externalPriceInflight.delete(o))}))}_collectPriceByTimestamp(t){let e={},r=t?.prefs||j,i=[],s=[],o=h=>{if(!h)return;let u=this._externalPriceStats?.[h];u&&(s.push(h),u.forEach(_=>{_.change===null||_.change===void 0||(e[_.start]=(e[_.start]||0)+_.change)}))};r.energy_sources.forEach(h=>{if(h.type!=="grid")return;(Array.isArray(h.flow_from)?h.flow_from:[h]).forEach(_=>{let p=this._toFortumPriceStatId(_.stat_energy_from);p&&i.push(p),o(p)})});let a=Array.from(new Set(i));this._ensureExternalPriceStats(a,t),this._ensureExternalPriceMetadata(a);let c=s[0],d=c?this._externalPriceMeta?.[c]?.statistics_unit_of_measurement:void 0;return this._priceUnit=d||this._priceUnit||"",Object.keys(e).map(h=>[Number(h),e[h]]).sort((h,u)=>h[0]-u[0])}_getOverlayColor(){return getComputedStyle(this).getPropertyValue("--warning-color").trim()||"#f59f00"}_getPriceOverlayColor(){return getComputedStyle(this).getPropertyValue("--info-color").trim()||"#2f7ed8"}_formatCost(t){let e=typeof t=="number"?t:Number(t||0),r=this._hass?.locale?.language||"en",i=this._costUnit||this._hass?.config?.currency||"EUR";return/^[A-Z]{3}$/.test(i)?new Intl.NumberFormat(r,{style:"currency",currency:i,maximumFractionDigits:2}).format(e):`${new Intl.NumberFormat(r,{maximumFractionDigits:2}).format(e)} ${i}`}_formatPrice(t){let e=typeof t=="number"?t:Number(t||0),r=this._hass?.locale?.language||"en";return`${new Intl.NumberFormat(r,{minimumFractionDigits:1,maximumFractionDigits:1}).format(e)} ${this._priceUnit||"EUR/kWh"}`}_escapeRegExp(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}_applyOverlayToDetailCard(t,e){let r=this._collectCostByTimestamp(e),i=this._collectPriceByTimestamp(e);if(!r.length&&!i.length||!Array.isArray(t._chartData))return;let s=this._getOverlayColor(),o=this._getPriceOverlayColor();if(t._chartData=t._chartData.filter(a=>a.id!=="fortum-energy-cost-overlay"&&a.id!=="fortum-energy-price-overlay"),r.length&&(t._chartData=t._chartData.concat({id:"fortum-energy-cost-overlay",name:"Cost",type:"line",smooth:.2,symbol:"none",showSymbol:!1,yAxisIndex:1,z:80,lineStyle:{width:2,color:s},itemStyle:{color:s},tooltip:{valueFormatter:a=>this._formatCost(a)},data:r})),i.length&&(t._chartData=t._chartData.concat({id:"fortum-energy-price-overlay",name:"Price",type:"line",smooth:.05,symbol:"none",showSymbol:!1,yAxisIndex:2,z:79,lineStyle:{width:2,type:"dashed",color:o},itemStyle:{color:o},data:i})),Array.isArray(t._legendData)){let a=t._legendData.filter(c=>c.id!=="fortum-energy-cost-overlay"&&c.id!=="fortum-energy-price-overlay");r.length&&a.push({id:"fortum-energy-cost-overlay",secondaryIds:[],name:"Cost",itemStyle:{color:s,borderColor:s}}),i.length&&a.push({id:"fortum-energy-price-overlay",secondaryIds:[],name:"Price",itemStyle:{color:o,borderColor:o}}),t._legendData=a}typeof t.requestUpdate=="function"&&t.requestUpdate()}_applyCostOverlay(){let t=this._innerCard?.querySelector("hui-energy-devices-detail-graph-card");if(!t)return;let e=this._energyData||this._collection?.state;if(e){if(!t.__myEnergyOverlayPatched){t.__myEnergyOverlayPatched=!0;let r=t._createOptions?.bind(t);r&&(t._createOptions=(...s)=>{let o=r(...s),a=Array.isArray(o?.yAxis)?o.yAxis[0]||{type:"value"}:o?.yAxis||{type:"value"},c={type:"value",position:"right",splitLine:{show:!1},axisLabel:{formatter:p=>this._formatCost(p)}},d={type:"value",position:"right",offset:56,splitLine:{show:!1},axisLabel:{formatter:p=>this._formatPrice(p)}},h=o?.tooltip?.formatter,u={...o?.tooltip||{},formatter:p=>{let y=typeof h=="function"?h(p):h,g=(Array.isArray(p)?p:[p]).filter(v=>v&&(v.seriesId==="fortum-energy-cost-overlay"||v.seriesId==="fortum-energy-price-overlay"));if(ut(this._hass?.config?.version,"2026.6.0")){if(!g.length)return y;let v="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;",E=g.map(m=>{let w=m.seriesName||"Cost",S=Array.isArray(m.value)?Number(m.value[1]||0):0,$=m.seriesId==="fortum-energy-price-overlay"?this._formatPrice(S):this._formatCost(S);return V`<br /><span style="${v}background-color:${m.color};"></span>
                    ${w}: <span style="direction:ltr; display: inline;">${$}</span>`});return V`${y}${E}`}if(typeof y!="string")return y;let b=y;return g.forEach(v=>{let E=v.seriesName||"Cost",m=Array.isArray(v.value)?Number(v.value[1]||0):0,w=v.seriesId==="fortum-energy-price-overlay"?this._formatPrice(m):this._formatCost(m),S=`${E}: <div style="direction:ltr; display: inline;">${w}</div>`,$=new RegExp(`${this._escapeRegExp(E)}: <div style="direction:ltr; display: inline;">[^<]*?<\\/div>`);b=b.replace($,S)}),b}},_=o?.legend?{...o.legend,data:Array.isArray(t._legendData)?t._legendData:o.legend.data}:o?.legend;return{...o,tooltip:u,legend:_,yAxis:[a,c,d]}});let i=t._processStatistics?.bind(t);i&&(t._processStatistics=()=>{let s=this._energyData||this._collection?.state||t._data;i(),s&&this._applyOverlayToDetailCard(t,s)})}this._applyOverlayToDetailCard(t,e)}}};var vr=({usedTotalByMathBucket:n,deviceTotalsByMathBucket:t,bucketMs:e,flowBucketMs:r})=>{let i=new Map,s=new Map;return Array.from(new Set([...Array.from((n||new Map).keys()),...Array.from((t||new Map).keys())])).sort((a,c)=>a-c).forEach(a=>{let c=n.has(a),d=n.get(a)||0,h=t.get(a)||0,u=c?d-h:0;if(!c){i.set(a,0),s.set(a,0);return}if(e<r){i.set(a,(i.get(a)||0)+d),s.set(a,(s.get(a)||0)+u);return}i.set(a,(i.get(a)||0)+d),s.set(a,(s.get(a)||0)+u)}),{totalConsumedByBucket:i,untrackedByBucket:s}};Ct();var xr="[REDACTED]",Ci=new Set(["access_token","refreshtoken","refresh_token","idtoken","id_token","token","authorization","cookie","cookies","set-cookie","session","session_data","session_cookies","password","username","customerid","customer_id","postaladdress","postal_address","postoffice","post_office","name","address","label","entity_id","entity_ids"]),Ai=new Set(["access_token","refreshtoken","refresh_token","idtoken","id_token","token","authorization","cookie","cookies","set-cookie","session","session_data","session_cookies","password"]),$i=[[/\b(Bearer)\s+([^\s,;]+)/gi,"$1 [REDACTED]"],[/\b(authorization|access_token|refresh_token|id_token|token|password|cookie|set-cookie|csrftoken)\b\s*[:=]\s*(?:Bearer\s+)?([^\s,;]+)/gi,"$1=[REDACTED]"],[/("(?:authorization|access_token|refresh_token|id_token|token|password|cookie|set-cookie|csrftoken)"\s*:\s*")([^"]+)(")/gi,"$1[REDACTED]$3"]],Pi=()=>({personalMap:new Map,personalCounter:0}),Er=n=>typeof n=="string"&&/^\d+$/.test(n.trim()),ki=n=>String(n||"value").trim().toLowerCase().replace(/[^a-z0-9_]+/g,"_").replace(/^_+|_+$/g,"")||"value",Ht=(n,t,e)=>{let r=typeof n=="string"?n.trim():"";if(!r)return"";let i=e.personalMap.get(r);if(i)return i;e.personalCounter+=1;let o=`[REDACTED ${ki(t)} ${e.personalCounter}]`;return e.personalMap.set(r,o),o},Di=n=>typeof n!="string"?n:$i.reduce((t,[e,r])=>t.replace(e,r),n),Sr=(n,t,e)=>typeof n!="string"?n:Ai.has(t)?xr:t==="number"||t==="metering_point_no"?Er(n)?n.trim():Ht(n,t,e):Ht(n,t==="entity_ids"?"entity_id":t,e),At=(n,t,e)=>{if(Array.isArray(n))return(typeof t=="string"?t.toLowerCase():"")==="entity_ids"?n.map(i=>typeof i=="string"?Ht(i,"entity_id",e):At(i,"",e)):n.map(i=>At(i,t,e));if(n&&typeof n=="object"){let r={};return Object.entries(n).forEach(([i,s])=>{let o=i.toLowerCase();if(Ci.has(o)){Array.isArray(s)?r[i]=s.map(a=>Sr(a,o,e)):s&&typeof s=="object"?r[i]=At(s,i,e):r[i]=Sr(s,o,e);return}if((o==="number"||o==="metering_point_no")&&typeof s=="string"){r[i]=Er(s)?s.trim():Ht(s,o,e);return}r[i]=At(s,i,e)}),r}return typeof n=="string"?Di(n):n},Cr=n=>{let t=Pi();return At(n,"",t)},Ar=xr;var $e="__fortumEnergyDashboardDebugStore",$r=160,Pr=400,kr="fortum-energy-debug-tab-id",Pe=n=>{let t=Math.random().toString(36).slice(2,10);return`${n}_${Date.now().toString(36)}_${t}`},Dr=()=>{let n=mt();if(n.clientContext)return n.clientContext;let t="tab_unknown";if(typeof sessionStorage<"u")try{let e=sessionStorage.getItem(kr);e&&e.trim().length?t=e.trim():(t=Pe("tab"),sessionStorage.setItem(kr,t))}catch{t=Pe("tab")}return n.clientContext={tab_id:t,session_id:Pe("session"),created_at:new Date().toISOString()},n.clientContext},Ii=n=>{let t=n?.config?.version;return typeof t=="string"&&t.trim().length?t.trim():"unknown"},Ti=()=>{let n=globalThis.__fortumEnergyIntegrationVersion;return typeof n=="string"&&n.trim().length?n.trim():"unknown"},Mi=()=>{if(typeof navigator>"u")return{user_agent:"unknown",language:"unknown",platform:"unknown"};let n=navigator.userAgentData?.platform;return{user_agent:navigator.userAgent||"unknown",language:navigator.language||"unknown",platform:typeof n=="string"&&n||navigator.platform||"unknown"}},F=n=>{if(typeof structuredClone=="function")try{return structuredClone(n)}catch{}return JSON.parse(JSON.stringify(n))},mt=()=>(globalThis[$e]||(globalThis[$e]={adaptiveHistory:[],latestAdaptive:null,latestFuturePrice:null,cardConfigs:{},sequence:0,eventSequence:0,eventTimeline:[],clientContext:null}),globalThis[$e]),Ir=()=>F(Dr()),Tr=n=>{if(!n||typeof n!="object")return;let t=mt();t.eventSequence+=1;let e={event_sequence:t.eventSequence,recorded_at:new Date().toISOString(),...F(n)};t.eventTimeline.push(e),t.eventTimeline.length>Pr&&t.eventTimeline.splice(0,t.eventTimeline.length-Pr)},pt=(n,t)=>{if(typeof n!="string"||!n.length)return;let e=mt();e.cardConfigs[n]=F(t||{})},Mr=n=>{if(!n||typeof n!="object")return;let t=mt();t.sequence+=1;let e={sequence:t.sequence,recorded_at:new Date().toISOString(),...F(n)};t.latestAdaptive=e,t.adaptiveHistory.push(e),t.adaptiveHistory.length>$r&&t.adaptiveHistory.splice(0,t.adaptiveHistory.length-$r)},Nr=n=>{if(!n||typeof n!="object")return;let t=mt();t.sequence+=1,t.latestFuturePrice={sequence:t.sequence,recorded_at:new Date().toISOString(),...F(n)}},Ni=n=>ht(n).map(t=>({number:t.number,address:t.address,label:t.label,entity_ids:t.entityIds})),Rr=({collectionKey:n,hass:t,adaptiveDebugInfo:e,adaptiveExportData:r})=>{let i=mt(),s=Dr(),o={generated_at:new Date().toISOString(),format_version:4,collection_key:n||"",redaction:{enabled:!0,personal_placeholder_format:"[REDACTED <field> <n>]",token_placeholder:Ar},environment:{home_assistant_version:Ii(t),integration_version:Ti(),browser:Mi()},client_context:F(s),dashboard_config:F(i.cardConfigs),discoverable_metering_points:Ni(t),adaptive_graph:{latest_debug:e||i.latestAdaptive,latest_export_data:r?F(r):null,history:F(i.adaptiveHistory),event_timeline:F(i.eventTimeline)},future_price:{latest_debug:F(i.latestFuturePrice)}};return Cr(o)};var Vt=class extends HTMLElement{setConfig(t){this._config=t||{},this._resolvedMetrics=this._config.resolved_metrics||{},this._debugEnabled=this._config.debug===!0,pt("adaptive_graph",this._config),this._debugEnabled||(this._lastAdaptiveDebugSignature=void 0,this._latestAdaptiveDebugInfo=void 0),this._syncDebugLifecycleListeners(),this.shadowRoot||this.attachShadow({mode:"open"}),this._renderBase(),this._trySubscribe()}set hass(t){this._hass=t,this._trySubscribe(),this._ensureChart();let e=this._getCollectionRangeKey();e&&e!==this._lastCollectionRangeKey&&(this._lastCollectionRangeKey=e,this._scheduleUpdate("hass_range_changed"))}connectedCallback(){this._ensureDebugIdentity(),this._ensureResizeObserver(),this._rangeChangedHandler||(this._rangeChangedHandler=t=>this._handleRangeChangedEvent(t),window.addEventListener("fortum-energy:range-changed",this._rangeChangedHandler)),this._exportDebugInfoHandler||(this._exportDebugInfoHandler=t=>this._handleExportDebugInfoRequest(t),window.addEventListener("fortum-energy:export-debug-info",this._exportDebugInfoHandler)),this._syncDebugLifecycleListeners(),this._recordDebugEvent("card_connected")}disconnectedCallback(){this._unsubscribe&&(this._unsubscribe(),this._unsubscribe=void 0),this._collection=void 0,this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=void 0),this._rangeChangedHandler&&(window.removeEventListener("fortum-energy:range-changed",this._rangeChangedHandler),this._rangeChangedHandler=void 0),this._exportDebugInfoHandler&&(window.removeEventListener("fortum-energy:export-debug-info",this._exportDebugInfoHandler),this._exportDebugInfoHandler=void 0),this._teardownDebugLifecycleListeners(),this._recordDebugEvent("subscription_state",{action:"disconnected",has_active_subscription:!1,collection_key:this._getCollectionKey()}),this._recordDebugEvent("card_disconnected")}getCardSize(){return 3}_buildCardInstanceId(){let t=Math.random().toString(36).slice(2,10);return`adaptive_card_${Date.now().toString(36)}_${t}`}_ensureDebugIdentity(){if(this._debugIdentity)return this._debugIdentity;let t=Ir(),e=typeof window<"u"&&window.location?`${window.location.pathname}${window.location.search}${window.location.hash}`:"unknown";return this._debugIdentity={...t,card_instance_id:this._buildCardInstanceId(),collection_key:this._getCollectionKey(),location_path:e},this._debugIdentity}_buildDebugContext(t={}){let e=this._ensureDebugIdentity(),r=typeof document<"u"&&typeof document.visibilityState=="string"?document.visibilityState:"unknown";return{...e,visibility_state:r,...t}}_recordDebugEvent(t,e={}){this._debugEnabled&&Tr({source:"adaptive_graph",event_type:t,context:this._buildDebugContext(),payload:e})}_syncDebugLifecycleListeners(){if(this.isConnected){if(!this._debugEnabled){this._teardownDebugLifecycleListeners();return}this._ensureDebugIdentity(),!this._visibilityHandler&&typeof document<"u"&&(this._visibilityHandler=()=>{this._recordDebugEvent("document_visibilitychange")},document.addEventListener("visibilitychange",this._visibilityHandler)),!this._focusHandler&&typeof window<"u"&&(this._focusHandler=()=>this._recordDebugEvent("window_focus"),window.addEventListener("focus",this._focusHandler)),!this._blurHandler&&typeof window<"u"&&(this._blurHandler=()=>this._recordDebugEvent("window_blur"),window.addEventListener("blur",this._blurHandler)),!this._pageshowHandler&&typeof window<"u"&&(this._pageshowHandler=t=>this._recordDebugEvent("window_pageshow",{persisted:t?.persisted===!0}),window.addEventListener("pageshow",this._pageshowHandler)),!this._pagehideHandler&&typeof window<"u"&&(this._pagehideHandler=t=>this._recordDebugEvent("window_pagehide",{persisted:t?.persisted===!0}),window.addEventListener("pagehide",this._pagehideHandler)),!this._storageHandler&&typeof window<"u"&&(this._storageHandler=t=>{this._recordDebugEvent("window_storage",{key:t?.key||null})},window.addEventListener("storage",this._storageHandler))}}_teardownDebugLifecycleListeners(){this._visibilityHandler&&typeof document<"u"&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=void 0),this._focusHandler&&typeof window<"u"&&(window.removeEventListener("focus",this._focusHandler),this._focusHandler=void 0),this._blurHandler&&typeof window<"u"&&(window.removeEventListener("blur",this._blurHandler),this._blurHandler=void 0),this._pageshowHandler&&typeof window<"u"&&(window.removeEventListener("pageshow",this._pageshowHandler),this._pageshowHandler=void 0),this._pagehideHandler&&typeof window<"u"&&(window.removeEventListener("pagehide",this._pagehideHandler),this._pagehideHandler=void 0),this._storageHandler&&typeof window<"u"&&(window.removeEventListener("storage",this._storageHandler),this._storageHandler=void 0)}_getCollection(){let t=this._config?.collection_key||I;return this._hass?.connection?.[`_${t}`]}_getCollectionKey(){return this._config?.collection_key||I}_getCollectionRangeKey(){let t=this._getCollection(),e=t?.start instanceof Date?t.start.getTime():null,r=t?.end instanceof Date?t.end.getTime():null;return!Number.isFinite(e)||!Number.isFinite(r)?null:`${e}:${r}`}_handleRangeChangedEvent(t){let e=t?.detail||{};if(e.collectionKey&&e.collectionKey!==this._getCollectionKey())return;let r=Number(e.start),i=Number(e.end),s=Number.isFinite(r)&&Number.isFinite(i)?`${r}:${i}`:this._getCollectionRangeKey();!s||s===this._lastCollectionRangeKey||(this._lastCollectionRangeKey=s,this._recordDebugEvent("range_changed_event",{detail:e,resolved_range_key:s}),this._scheduleUpdate("range_changed_event"))}_trySubscribe(){let t=this._getCollection();if(!t||!t.subscribe){this._recordDebugEvent("subscription_state",{action:"missing_collection_or_subscribe",has_collection:!!t,has_subscribe:!!t?.subscribe});return}if(t===this._collection&&this._unsubscribe){this._recordDebugEvent("subscription_state",{action:"already_subscribed",has_active_subscription:!0,collection_key:this._getCollectionKey()});return}this._unsubscribe&&this._unsubscribe(),this._collection=t,this._unsubscribe=t.subscribe(()=>{let e=this._collection?.state,r=this._getBounds(e),i=r?`${r.start.getTime()}:${r.end.getTime()}`:this._getCollectionRangeKey();i&&i===this._lastSubscribedRangeKey||(this._lastSubscribedRangeKey=i||null,this._recordDebugEvent("collection_subscribe_range",{range_key:i||null}),this._scheduleUpdate("collection_subscribe_range"))}),this._recordDebugEvent("subscription_state",{action:"subscribed",has_active_subscription:!0,collection_key:this._getCollectionKey()})}_ensureResizeObserver(){this._resizeObserver||typeof ResizeObserver>"u"||(this._resizeObserver=new ResizeObserver(t=>{let e=Array.isArray(t)&&t.length?t[0]:null,r=Number(e?.contentRect?.width),i=Number(e?.contentRect?.height),s=Number.isFinite(r)&&Number.isFinite(i),o=Number.isFinite(this._lastObservedWidth)?this._lastObservedWidth:null,a=Number.isFinite(this._lastObservedHeight)?this._lastObservedHeight:null,c=s&&Number.isFinite(o)?r-o:null,d=s&&Number.isFinite(a)?i-a:null;s&&(this._lastObservedWidth=r,this._lastObservedHeight=i);let h={width:s?r:null,height:s?i:null,prev_width:o,prev_height:a,delta_width:c,delta_height:d};this._recordDebugEvent("resize_observer",h),this._scheduleUpdate("resize",h)}),this._resizeObserver.observe(this))}_renderBase(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
      <style>
        :host { display: block; }
        ha-card { height: 100%; }
        .card-header { padding-bottom: 0; }
        .content { padding: 16px; }
        .content.has-header { padding-top: 0; }
        .empty {
          color: var(--secondary-text-color);
          user-select: text;
          -webkit-user-select: text;
          cursor: text;
          white-space: pre-wrap;
        }
        .warning {
          margin-top: 10px;
          color: var(--warning-color);
          user-select: text;
          -webkit-user-select: text;
          cursor: text;
          white-space: pre-wrap;
          font-size: var(--ha-font-size-s);
        }
        .consumption-stats {
          margin-top: 12px;
          border-top: 1px solid var(--divider-color);
          padding-top: 10px;
          font-size: var(--ha-font-size-s);
          color: var(--primary-text-color);
        }
        .consumption-stats table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .consumption-stats th,
        .consumption-stats td {
          padding: 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .consumption-stats th {
          color: var(--secondary-text-color);
          font-weight: 500;
        }
        .consumption-stats .series {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }
        .consumption-stats .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 1px solid currentColor;
          flex: 0 0 auto;
        }
        .consumption-stats .label {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .consumption-stats th.num,
        .consumption-stats td.num {
          text-align: right;
        }
        .consumption-stats tr.toggleable {
          cursor: pointer;
        }
        .consumption-stats tr.hidden {
          color: var(--secondary-text-color);
        }
        .consumption-stats tr.hidden .dot {
          background: transparent !important;
        }
      </style>
      <ha-card>
        ${this._config?.title?`<h1 class="card-header">${this._config.title}</h1>`:""}
        <div class="content ${this._config?.title?"has-header":""}">
          <ha-chart-base id="chart"></ha-chart-base>
          <div id="empty" class="empty" style="display:none;">No data</div>
          <div id="warning" class="warning" style="display:none;"></div>
          <div id="consumption-stats" class="consumption-stats"></div>
        </div>
      </ha-card>
    `,this._ensureChart())}_ensureChart(){this.shadowRoot&&(this._chart=this.shadowRoot.querySelector("#chart"),this._chart&&this._hass&&(this._chart.hass=this._hass,this._chart.height="320px"))}_scheduleUpdate(t="unspecified",e=null){Number.isFinite(this._updateSequence)||(this._updateSequence=0),Number.isFinite(this._pendingUpdateId)||(this._pendingUpdateId=this._updateSequence+1,this._updateSequence=this._pendingUpdateId),Array.isArray(this._pendingUpdateTriggers)||(this._pendingUpdateTriggers=[]),this._pendingUpdateTriggers.push(t),this._pendingTriggerContexts||(this._pendingTriggerContexts={}),e&&typeof e=="object"&&(this._pendingTriggerContexts[t]=e),!this._updateScheduled&&(this._updateScheduled=!0,requestAnimationFrame(()=>{this._updateScheduled=!1;let r=this._pendingUpdateTriggers?.length?this._pendingUpdateTriggers.slice():["unspecified"],i=r[0]||"unspecified",s=r[r.length-1]||"unspecified",o=this._pendingUpdateId;this._lastUpdateMeta={updateId:o,primaryTrigger:i,finalTrigger:s,triggerChain:r,triggerContexts:{...this._pendingTriggerContexts||{}}},this._lastUpdateTrigger=s,this._pendingUpdateId=void 0,this._pendingUpdateTriggers=[],this._pendingTriggerContexts=void 0,this._updateChart()}))}_getBounds(t){let e=t?.start instanceof Date?t.start:null,r=t?.end instanceof Date?t.end:null;return!e||!r?null:{start:e,end:r}}_normalizeStatsSeries(t){return Array.isArray(t)?t.map(e=>{let r=typeof e?.start=="number"?e.start:typeof e?.start=="string"?Date.parse(e.start):NaN,i=Number(e?.change);return!Number.isFinite(r)||!Number.isFinite(i)?null:{start:r,change:i}}).filter(Boolean).sort((e,r)=>e.start-r.start):[]}_pickBucketMs(t,e,r,i){let s=Math.max(1,e.getTime()-t.getTime()),o=Math.max(1,Math.floor(Math.max(240,r||0)/12)),a=[15*60*1e3,60*60*1e3,3*60*60*1e3,6*60*60*1e3,12*60*60*1e3,24*60*60*1e3].filter(c=>c>=i);for(let c of a)if(Math.ceil(s/c)<=o)return c;return 24*60*60*1e3}_bucketStart(t,e){let r=new Date(t);r.setHours(0,0,0,0);let i=r.getTime();return e>=24*60*60*1e3?i:i+Math.floor((t-i)/e)*e}_bucketSeries(t,e){let r=new Map;return(t||[]).forEach(i=>{let s=this._bucketStart(i.start,e);r.set(s,(r.get(s)||0)+i.change)}),r}_accumulateSeriesAverage(t,e,r,i){(t||[]).forEach(s=>{let o=this._bucketStart(s.start,e);r.set(o,(r.get(o)||0)+s.change),i.set(o,(i.get(o)||0)+1)})}_mergeInto(t,e){e.forEach((r,i)=>{t.set(i,(t.get(i)||0)+r)})}_fetchStats(t,e,r,i,s=["change"]){return t.length?this._hass.callWS({type:"recorder/statistics_during_period",start_time:e.toISOString(),end_time:r.toISOString(),statistic_ids:t,period:i,types:s}):Promise.resolve({})}_normalizePriceSeries(t){return Array.isArray(t)?t.map(e=>{let r=typeof e?.start=="number"?e.start:typeof e?.start=="string"?Date.parse(e.start):NaN,i=Number(e?.mean);return!Number.isFinite(r)||!Number.isFinite(i)?null:{start:r,change:i}}).filter(Boolean).sort((e,r)=>e.start-r.start):[]}_fetchStatsMetadata(t){let e=Array.from(new Set((t||[]).filter(Boolean)));return e.length?this._hass.callWS({type:"recorder/get_statistics_metadata",statistic_ids:e}).then(r=>{let i={};return(r||[]).forEach(s=>{s?.statistic_id&&(i[s.statistic_id]=s)}),i}):Promise.resolve({})}_resolveItemizationName(t,e){let r=typeof t?.name=="string"?t.name.trim():"";if(r)return r;let i=typeof t?.stat=="string"?t.stat:"";if(!i)return"";let s=this._resolveDeviceNameFromEntity(i);if(s)return s;let o=this._hass?.states?.[i]?.attributes?.friendly_name;if(typeof o=="string"&&o.trim())return o.trim();let a=typeof e?.name=="string"?e.name.trim():"";return a||i}_resolveDeviceNameFromEntity(t){let e=this._hass?.entities?.[t];if(!e||typeof e!="object")return"";let r=e.device_id;if(typeof r!="string"||!r)return"";let i=this._hass?.devices?.[r];if(!i||typeof i!="object")return"";let s=typeof i.name_by_user=="string"?i.name_by_user.trim():"";return s||(typeof i.name=="string"?i.name.trim():"")}_getGraphColorByIndex(t){let e=getComputedStyle(this);return(e.getPropertyValue(`--graph-color-${t+1}`)||e.getPropertyValue(`--color-${t%54+1}`)).trim()||"#5B8FF9"}_getUntrackedColor(){return getComputedStyle(this).getPropertyValue("--history-unknown-color").trim()||"#9DA0A2"}_getCostColor(){return getComputedStyle(this).getPropertyValue("--warning-color").trim()||"#f59f00"}_getPriceColor(){return getComputedStyle(this).getPropertyValue("--info-color").trim()||"#2f7ed8"}_getTemperatureColor(){return getComputedStyle(this).getPropertyValue("--error-color").trim()||"#d9480f"}_formatCostValue(t){let e=typeof t=="number"?t:Number(t||0),r=this._hass?.locale?.language||"en",i=this._costUnit||"";if(/^[A-Z]{3}$/.test(i))return new Intl.NumberFormat(r,{style:"currency",currency:i,maximumFractionDigits:2}).format(e);let s=new Intl.NumberFormat(r,{maximumFractionDigits:2}).format(e);return i?`${s} ${i}`:s}_formatCostAxisValue(t){let e=typeof t=="number"?t:Number(t||0),r=this._hass?.locale?.language||"en",i=this._costUnit||"",s=this._costAxisDigits||0;if(/^[A-Z]{3}$/.test(i))return new Intl.NumberFormat(r,{style:"currency",currency:i,minimumFractionDigits:s,maximumFractionDigits:s}).format(e);let o=new Intl.NumberFormat(r,{minimumFractionDigits:s,maximumFractionDigits:s}).format(e);return i?`${o} ${i}`:o}_formatPriceValue(t){let e=typeof t=="number"?t:Number(t||0),r=this._hass?.locale?.language||"en",i=new Intl.NumberFormat(r,{minimumFractionDigits:1,maximumFractionDigits:1}).format(e);return this._priceUnit?`${i} ${this._priceUnit}`:i}_formatPriceAxisValue(t){let e=typeof t=="number"?t:Number(t||0),r=this._hass?.locale?.language||"en",i=this._priceAxisDigits||0,s=new Intl.NumberFormat(r,{minimumFractionDigits:i,maximumFractionDigits:i}).format(e),o=(this._priceUnit||"").split("/")[0].trim();return o?`${s} ${o}`:s}_formatTemperatureAxisValue(t){let e=typeof t=="number"?t:Number(t||0),r=this._hass?.locale?.language||"en",i=this._temperatureAxisDigits||0,s=new Intl.NumberFormat(r,{minimumFractionDigits:i,maximumFractionDigits:i}).format(e);return this._temperatureUnit?`${s} ${this._temperatureUnit}`:s}_formatTemperatureValue(t){let e=typeof t=="number"?t:Number(t||0),r=this._hass?.locale?.language||"en",i=new Intl.NumberFormat(r,{minimumFractionDigits:1,maximumFractionDigits:1}).format(e);return this._temperatureUnit?`${i} ${this._temperatureUnit}`:i}_formatEnergyStatValue(t){let e=typeof t=="number"?t:Number(t||0),r=this._hass?.locale?.language||"en",i=new Intl.NumberFormat(r,{minimumFractionDigits:0,maximumFractionDigits:2}).format(e);return this._energyUnit?`${i} ${this._energyUnit}`:i}_renderCustomLegendTable(t,e){let r=this.shadowRoot?.querySelector("#consumption-stats");if(!r)return;let i=(s,o)=>o==null||Number.isNaN(Number(o))?"":s?.kind==="cost"?this._formatCostValue(o):s?.kind==="price"?this._formatPriceValue(o):s?.kind==="temperature"?this._formatTemperatureValue(o):this._formatEnergyStatValue(o);r.innerHTML=`
      <table>
        <thead>
          <tr>
            <th>Series</th>
            <th class="num">Min</th>
            <th class="num">Max</th>
            <th class="num">Avg</th>
            <th class="num">Sum</th>
            <th class="num">Last</th>
          </tr>
        </thead>
        <tbody>
          ${(t||[]).map(s=>`
            <tr class="${s.id?"toggleable":""} ${s.id&&e?.has(s.id)?"hidden":""}" ${s.id?`data-series-id="${s.id}"`:""}>
              <td><span class="series"><span class="dot" style="color: ${s.color}; background-color: ${s.color};"></span><span class="label">${s.name}</span></span></td>
              <td class="num">${i(s,s.min)}</td>
              <td class="num">${i(s,s.max)}</td>
              <td class="num">${i(s,s.avg)}</td>
              <td class="num">${i(s,s.sum)}</td>
              <td class="num">${i(s,s.last)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `,r.onclick=s=>{let a=s.target?.closest?.("tr[data-series-id]")?.getAttribute?.("data-series-id");a&&this._toggleSeriesVisibility(a)}}_toggleSeriesVisibility(t){this._hiddenSeriesIds||(this._hiddenSeriesIds=new Set),this._hiddenSeriesIds.has(t)?this._hiddenSeriesIds.delete(t):this._hiddenSeriesIds.add(t),this._applySeriesVisibility()}_initializeSeriesVisibility(t){let e=new Set((t||[]).map(r=>r?.id).filter(Boolean));this._hiddenSeriesIds||(this._hiddenSeriesIds=new Set),this._defaultHiddenSeriesIdsApplied||(this._defaultHiddenSeriesIdsApplied=new Set),["adaptive-price-overlay","adaptive-temperature-overlay"].forEach(r=>{e.has(r)&&!this._defaultHiddenSeriesIdsApplied.has(r)&&(this._hiddenSeriesIds.add(r),this._defaultHiddenSeriesIdsApplied.add(r))}),this._seriesVisibilityInitialized=!0}_formatDebugDateTime(t){if(!Number.isFinite(t))return null;let e=new Date(t);return{ts:t,iso:e.toISOString(),local:e.toString()}}_getSeriesEdge(t){let e=(t?.data||[]).map(s=>{if(!Array.isArray(s)||s.length<2)return null;let o=Number(s[0]),a=Number(s[1]);return!Number.isFinite(o)||!Number.isFinite(a)?null:[o,a]}).filter(Boolean).sort((s,o)=>s[0]-o[0]);if(!e.length)return{id:t?.id||"",name:t?.name||"",pointCount:0,nonZeroPointCount:0,xStart:null,xEnd:null,yMin:null,yMax:null,firstPoint:null,lastPoint:null};let r=e.map(s=>s[0]),i=e.map(s=>s[1]);return{id:t?.id||"",name:t?.name||"",pointCount:e.length,nonZeroPointCount:i.filter(s=>Math.abs(s)>1e-12).length,xStart:this._formatDebugDateTime(Math.min(...r)),xEnd:this._formatDebugDateTime(Math.max(...r)),yMin:Math.min(...i),yMax:Math.max(...i),firstPoint:{at:this._formatDebugDateTime(e[0][0]),value:e[0][1]},lastPoint:{at:this._formatDebugDateTime(e[e.length-1][0]),value:e[e.length-1][1]}}}_getOverallSeriesEdges(t){let e=[];if((t||[]).forEach(s=>{(s?.data||[]).forEach(o=>{if(!Array.isArray(o)||o.length<2)return;let a=Number(o[0]),c=Number(o[1]);!Number.isFinite(a)||!Number.isFinite(c)||e.push([a,c])})}),!e.length)return{pointCount:0,nonZeroPointCount:0,xStart:null,xEnd:null,yMin:null,yMax:null};let r=e.map(s=>s[0]),i=e.map(s=>s[1]);return{pointCount:e.length,nonZeroPointCount:i.filter(s=>Math.abs(s)>1e-12).length,xStart:this._formatDebugDateTime(Math.min(...r)),xEnd:this._formatDebugDateTime(Math.max(...r)),yMin:Math.min(...i),yMax:Math.max(...i)}}_buildFetchPointCounts(t,e){return(t||[]).map(r=>({id:r,points:Array.isArray(e?.[r])?e[r].length:0}))}_buildRangeTransition(t){let e=t?.start?.getTime?.(),r=t?.end?.getTime?.(),i=this._lastDebugBounds?.start??null,s=this._lastDebugBounds?.end??null,o={relation:"unknown",gapMs:null,previous:{start:this._formatDebugDateTime(i),end:this._formatDebugDateTime(s)},current:{start:this._formatDebugDateTime(e),end:this._formatDebugDateTime(r)}};return!Number.isFinite(e)||!Number.isFinite(r)?o:!Number.isFinite(i)||!Number.isFinite(s)?(this._lastDebugBounds={start:e,end:r},o.relation="initial",o):e===i&&r===s?(o.relation="same",this._lastDebugBounds={start:e,end:r},o):e===s+1?(o.relation="adjacent_forward",this._lastDebugBounds={start:e,end:r},o):r+1===i?(o.relation="adjacent_backward",this._lastDebugBounds={start:e,end:r},o):e<=s&&r>=i?(o.relation="overlap",this._lastDebugBounds={start:e,end:r},o):e>s?(o.relation="gap_after_previous",o.gapMs=e-s-1,this._lastDebugBounds={start:e,end:r},o):(o.relation="gap_before_previous",o.gapMs=i-r-1,this._lastDebugBounds={start:e,end:r},o)}_buildAdaptiveDebugSignature(t){return JSON.stringify(t)}_logAdaptiveGraphDebug({updateMeta:t,bounds:e,bucketMs:r,devicePeriod:i,flowPeriod:s,deviceIds:o,flowAndCostIds:a,flowIds:c,overlayIds:d,deviceRaw:h,flowRaw:u,priceRaw:_,temperatureRaw:p,series:y,costPoints:x,pricePoints:g,temperaturePoints:b,untrackedPoints:v}){if(!this._debugEnabled)return;let E=this._hiddenSeriesIds||new Set,m=(y||[]).filter(A=>!E.has(A.id)),w=m.map(A=>this._getSeriesEdge(A)),S=t||{primaryTrigger:"unspecified",finalTrigger:"unspecified",triggerChain:["unspecified"],triggerContexts:{}},$=this._buildRangeTransition(e),K=Number(this._chart?.clientWidth),L=Number(this.clientWidth),te={range:{start:this._formatDebugDateTime(e?.start?.getTime?.()),end:this._formatDebugDateTime(e?.end?.getTime?.())},updateTrigger:S.finalTrigger,updatePrimaryTrigger:S.primaryTrigger,updateTriggerChain:S.triggerChain,updateTriggerContext:S.triggerContexts,rangeTransition:$,renderContext:{chartWidth:Number.isFinite(K)?K:null,hostWidth:Number.isFinite(L)?L:null},bucketMs:r,period:{device:i,flowAndCost:s,price:"hour",temperature:"hour"},ids:{deviceIds:o||[],flowAndCostIds:a||[],flowFromGrid:c?.fromGrid||[],flowToGrid:c?.toGrid||[],flowSolar:c?.solar||[],flowFromBattery:c?.fromBattery||[],flowToBattery:c?.toBattery||[],costImport:d?.importCost||[],costExportComp:d?.exportCompensation||[],price:d?.price||[],temperature:d?.temperature||[]},fetchPointCounts:{device:this._buildFetchPointCounts(o,h),flowAndCost:this._buildFetchPointCounts(a,u),price:this._buildFetchPointCounts(d?.price,_),temperature:this._buildFetchPointCounts(d?.temperature,p)},chart:{allSeriesIds:(y||[]).map(A=>A.id),hiddenSeriesIds:Array.from(E),visibleSeriesIds:m.map(A=>A.id),pointCounts:{untracked:v.length,cost:x.length,price:g.length,temperature:b.length},nonZeroPointCounts:{untracked:v.filter(A=>Math.abs(Number(A?.[1])||0)>1e-12).length,cost:x.filter(A=>Math.abs(Number(A?.[1])||0)>1e-12).length,price:g.filter(A=>Math.abs(Number(A?.[1])||0)>1e-12).length,temperature:b.filter(A=>Math.abs(Number(A?.[1])||0)>1e-12).length},visibleSeriesEdges:w,overallVisibleEdges:this._getOverallSeriesEdges(m),overallAllSeriesEdges:this._getOverallSeriesEdges(y||[])}},et=this._buildAdaptiveDebugSignature(te);if(et===this._lastAdaptiveDebugSignature)return;this._lastAdaptiveDebugSignature=et;let rt=[];(d?.importCost?.length||d?.exportCompensation?.length)&&!x.length&&rt.push({code:"cost_overlay_without_points",importCostIds:d.importCost,exportCompensationIds:d.exportCompensation}),(!v.length||!v.some(A=>Math.abs(Number(A?.[1])||0)>1e-12))&&rt.push({code:"untracked_without_non_zero_points"});let R={source:"adaptive_graph",context:this._buildDebugContext(),payload:te,warnings:rt};this._latestAdaptiveDebugInfo=R,Mr(R)}_applySeriesVisibility(){if(!this._chart||!this._allSeries||!this._chartOptions)return;let t=this._hiddenSeriesIds||new Set,e=this._allSeries.filter(d=>!t.has(d.id)),r=e.some(d=>Array.isArray(d.data)&&d.data.length),i=this.shadowRoot?.querySelector("#empty");i&&(i.style.display=r?"none":"block"),this._chart.hass=this._hass,this._chart.data=e,this._chart.options=this._chartOptions;let s=this._lastUpdateMeta?.updateId??null,o=this._latestAdaptiveDebugInfo?.payload?.range?.start?.iso||null,a=this._latestAdaptiveDebugInfo?.payload?.range?.end?.iso||null;this._recordDebugEvent("update_applied",{update_id:s,range_start:o,range_end:a,visible_series_count:e.length}),this._chart.requestUpdate?.();let c=this._chart.updateComplete;c&&typeof c.then=="function"&&c.then(()=>{this._recordDebugEvent("render_committed",{update_id:s,range_start:o,range_end:a})}).catch(()=>{this._recordDebugEvent("render_commit_failed",{update_id:s})}),this._renderCustomLegendTable(this._legendRows||[],t)}_showCardError(t){this._setLoadingState(!1);let e=this.shadowRoot?.querySelector("#empty");e&&(e.textContent=t,e.style.display="block"),this._allSeries=[],this._chartOptions={legend:{show:!1,type:"custom"},xAxis:{type:"time"},yAxis:[{type:"value"}],tooltip:{show:!1}},this._legendRows=[],this._chart&&(this._chart.hass=this._hass,this._chart.data=[],this._chart.options=this._chartOptions,this._chart.requestUpdate?.()),this._renderCustomLegendTable([],this._hiddenSeriesIds||new Set)}_setCardWarning(t){let e=this.shadowRoot?.querySelector("#warning");if(!e)return;let r=typeof t=="string"?t.trim():"";e.textContent=r,e.style.display=r?"block":"none"}_setLoadingState(t,e="Loading consumption data..."){this._isLoading=t===!0;let r=this.shadowRoot?.querySelector("#empty");if(r){if(this._isLoading){r.textContent=e,r.style.display="block";return}r.textContent===e&&(r.style.display="none")}}_buildUpdateSignature(t,e){let r={rangeKey:t,consumption:Array.isArray(e?.consumption)?e.consumption:[],itemizations:Array.isArray(e?.itemizations)?e.itemizations.map(i=>({stat:i?.stat||"",name:i?.name||""})).sort((i,s)=>String(i.stat).localeCompare(String(s.stat))):[],cost:Array.isArray(e?.cost)?e.cost:[],price:Array.isArray(e?.price)?e.price:[],temperature:Array.isArray(e?.temperature)?e.temperature:[],temperatureOverride:e?.temperature_override===!0};return JSON.stringify(r)}_queueRetryForRange(t,e=800){!t||this._pendingRetryRangeKey===t||(this._pendingRetryRangeKey=t,window.setTimeout(()=>{this._pendingRetryRangeKey===t&&(this._pendingRetryRangeKey=null,this._scheduleUpdate("retry"))},e))}_energyUnitToJouleFactor(t){let e=typeof t=="string"?t.trim():"",r={J:1,kJ:1e3,MJ:1e6,GJ:1e9,cal:4.184,kcal:4184,Mcal:4184e3,Gcal:4184e6,mWh:3.6,Wh:3600,kWh:36e5,MWh:36e8,GWh:36e11,TWh:36e14};return Number.isFinite(r[e])?r[e]:null}_energyUnitConversionFactor(t,e){if(!t||!e)return null;if(t===e)return 1;let r=this._energyUnitToJouleFactor(t),i=this._energyUnitToJouleFactor(e);return!r||!i?null:r/i}_normalizeStatsSeriesWithFactor(t,e=1){return Array.isArray(t)?t.map(r=>{let i=typeof r?.start=="number"?r.start:typeof r?.start=="string"?Date.parse(r.start):NaN,s=Number(r?.change);return!Number.isFinite(i)||!Number.isFinite(s)?null:{start:i,change:s*e}}).filter(Boolean).sort((r,i)=>r.start-i.start):[]}_serializeMap(t){return Array.from((t||new Map).entries()).map(([e,r])=>[Number(e),Number(r)]).sort((e,r)=>e[0]-r[0])}_downloadDebugInfo(t){let e=JSON.stringify(t,null,2),r=new Blob([e],{type:"application/json"}),i=URL.createObjectURL(r),s=document.createElement("a"),o=new Date().toISOString().replace(/[:.]/g,"-");s.href=i,s.download=`fortum-dashboard-debug-${o}.json`,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(i)}_handleExportDebugInfoRequest(t){if(!this._debugEnabled)return;let e=t?.detail||{};if(e.collectionKey&&e.collectionKey!==this._getCollectionKey())return;let r={source:"adaptive_graph",error:"No adaptive graph debug info available yet. Wait for chart data to load."},i=Rr({collectionKey:this._getCollectionKey(),hass:this._hass,adaptiveDebugInfo:this._latestAdaptiveDebugInfo||r,adaptiveExportData:this._latestAdaptiveExportData});e.download!==!1&&this._downloadDebugInfo(i)}_resolveEnergyUnit(t,e){let r=t?.statsMetadata||{};return(e||[]).map(s=>r?.[s]?.statistics_unit_of_measurement).find(s=>typeof s=="string"&&s.length)||""}_formatBucketDate(t,e){return new Date(t).toLocaleDateString(e,{day:"2-digit",month:"short"})}_formatHourRange(t,e){let r=new Date(t),i=new Date(t+e),s=o=>String(o).padStart(2,"0");return e<60*60*1e3?`${s(r.getHours())}:${s(r.getMinutes())}-${s(i.getHours())}:${s(i.getMinutes())}`:`${s(r.getHours())}-${s(i.getHours())}`}_formatBucketLabel(t,e,r,i){if(e>=24*60*60*1e3)return this._formatBucketDate(t,i);let s=r>24*60*60*1e3,o=this._formatHourRange(t,e);return s?`${this._formatBucketDate(t,i)} ${o}`:o}async _updateChart(){if(this._hass&&(this._ensureChart(),!!this._chart))try{let t=this._collection?.state,e=this._getBounds(t);if(!t||!e){this._showCardError("Energy data is unavailable.");return}let r=this._resolvedMetrics||{},i=`${e.start.getTime()}:${e.end.getTime()}`,s=this._buildUpdateSignature(i,r);if(s===this._lastRenderedUpdateSignature){this._recordDebugEvent("update_skipped_same_signature",{update_id:this._lastUpdateMeta?.updateId??null,range_key:i});return}this._setLoadingState(!0);let o=(this._token||0)+1;this._token=o;let a=Array.isArray(r.itemizations)?r.itemizations:[],c=a.map(l=>l?.stat).filter(l=>typeof l=="string"&&l.length),d=Array.isArray(r.consumption)?r.consumption.filter(l=>typeof l=="string"&&l.length):[];if(!d.length){this._showCardError("No Fortum consumption source configured for single strategy.");return}let h=await this._fetchStatsMetadata([...d,...c]);if(this._token!==o)return;if(d.filter(l=>!h?.[l]).length===d.length){let l=this._resolvedMetrics?.consumption?.[0]?.replace("fortum:hourly_consumption_","")?.toUpperCase?.(),f=l?`Configured metering point ${l} has no Fortum consumption data.`:"Configured Fortum metering point has no consumption data.";this._showCardError(`${f} Check strategy metering point number.`);return}let _=c.filter(l=>!h?.[l]),p=d.map(l=>h?.[l]?.statistics_unit_of_measurement).find(l=>typeof l=="string"&&l.length),y=[],x=a.filter(l=>{let f=l?.stat;if(typeof f!="string"||!f.length||_.includes(f))return!1;let C=h?.[f]?.statistics_unit_of_measurement;return this._energyUnitConversionFactor(C,p)===null?(y.push(`${f} (${typeof C=="string"&&C?C:"unknown unit"})`),!1):!0}),g=[];_.length&&g.push(..._.map(l=>`Missing itemization statistic: ${l}.`)),y.length&&g.push(...y.map(l=>`Excluded itemization statistic with unsupported unit conversion: ${l}.`)),this._setCardWarning(g.join(`
`));let b={importCost:Array.isArray(r.cost)?r.cost.filter(l=>typeof l=="string"&&l.length):[],exportCompensation:[],price:Array.isArray(r.price)?r.price.filter(l=>typeof l=="string"&&l.length):[],temperature:Array.isArray(r.temperature)?r.temperature.filter(l=>typeof l=="string"&&l.length):[]},v={fromGrid:d,toGrid:[],solar:[],fromBattery:[],toBattery:[]},E=this._chart.clientWidth||this.clientWidth||0,m=this._pickBucketMs(e.start,e.end,E,15*60*1e3),w=m<=15*60*1e3?"5minute":"hour",S="hour",$=60*60*1e3;this._energyUnit=p||this._resolveEnergyUnit(t,[...c,...v.fromGrid,...v.toGrid,...v.solar,...v.fromBattery,...v.toBattery]);let K=Array.from(new Set([...v.fromGrid,...b.importCost])),L=await this._fetchStats(c,e.start,e.end,w);if(this._token!==o||w==="5minute"&&c.some(l=>!Array.isArray(L?.[l])||L[l].length===0)&&(w="hour",m=this._pickBucketMs(e.start,e.end,E,60*60*1e3),L=await this._fetchStats(c,e.start,e.end,w),this._token!==o))return;let et=await this._fetchStats(K,e.start,e.end,S);if(this._token!==o)return;let rt={...et||{},...L||{}},R={};Object.keys(rt||{}).forEach(l=>{R[l]=this._normalizeStatsSeries(rt[l])});let A=await this._fetchStats(b.price,e.start,e.end,"hour",["mean"]);if(this._token!==o)return;let Me={};Object.keys(A||{}).forEach(l=>{Me[l]=this._normalizePriceSeries(A[l])});let kt=await this._fetchStats(b.temperature,e.start,e.end,"hour",["mean"]);if(this._token!==o)return;let Ne={};Object.keys(kt||{}).forEach(l=>{Ne[l]=this._normalizePriceSeries(kt[l])}),this._costUnit="",this._priceUnit="",this._temperatureUnit="";let Re=[...b.importCost,...b.exportCompensation,...b.price,...b.temperature];if(Re.length)try{let l=await this._fetchStatsMetadata(Re);if(this._token!==o)return;let f=[...b.importCost,...b.exportCompensation].map(P=>l[P]?.statistics_unit_of_measurement).find(P=>typeof P=="string"&&P.length),C=b.price.map(P=>l[P]).find(P=>P?.statistics_unit_of_measurement),T=b.temperature.map(P=>l[P]).find(P=>P?.statistics_unit_of_measurement);f&&(this._costUnit=f),C?.statistics_unit_of_measurement&&(this._priceUnit=C.statistics_unit_of_measurement),T?.statistics_unit_of_measurement&&(this._temperatureUnit=T.statistics_unit_of_measurement)}catch{this._costUnit="",this._priceUnit="",this._temperatureUnit=""}let ee=new Map,M=x.map((l,f)=>{let C=l.stat,T=h?.[C]?.statistics_unit_of_measurement,P=this._energyUnitConversionFactor(T,this._energyUnit)||1,st=this._bucketSeries(this._normalizeStatsSeriesWithFactor(L[C],P),m);this._mergeInto(ee,st);let W=this._getGraphColorByIndex(f);return{id:`adaptive-${C}`,name:this._resolveItemizationName(l,h?.[C]),type:"bar",stack:"consumption",barMaxWidth:50,color:W,itemStyle:{borderColor:W,borderWidth:1,borderRadius:[4,4,0,0],opacity:.5},data:[],__bucketMap:st}}),it=m<$?$:m,re=new Map,ie=new Map,se=new Map,ne=new Map,oe=new Map;v.fromGrid.forEach(l=>this._mergeInto(re,this._bucketSeries(R[l]||[],it))),v.toGrid.forEach(l=>this._mergeInto(ie,this._bucketSeries(R[l]||[],it))),v.solar.forEach(l=>this._mergeInto(se,this._bucketSeries(R[l]||[],it))),v.fromBattery.forEach(l=>this._mergeInto(ne,this._bucketSeries(R[l]||[],it))),v.toBattery.forEach(l=>this._mergeInto(oe,this._bucketSeries(R[l]||[],it)));let ze=new Map;new Set([...re.keys(),...ie.keys(),...se.keys(),...ne.keys(),...oe.keys()]).forEach(l=>{let f=Math.max(re.get(l)||0,0)+Math.max(se.get(l)||0,0)+Math.max(ne.get(l)||0,0)-Math.max(ie.get(l)||0,0)-Math.max(oe.get(l)||0,0);ze.set(l,f)});let ae=new Map;ee.forEach((l,f)=>{let C=this._bucketStart(f,it);ae.set(C,(ae.get(C)||0)+l)});let{totalConsumedByBucket:Dt,untrackedByBucket:ce}=vr({usedTotalByMathBucket:ze,deviceTotalsByMathBucket:ae,bucketMs:m,flowBucketMs:$}),Fe=new Set([...Array.from(ce.keys()),...Array.from(Dt.keys())]);M.forEach(l=>{(l.__bucketMap||new Map).forEach((C,T)=>Fe.add(T))});let Oe=Array.from(Fe).sort((l,f)=>l-f),Le=Oe.map(l=>[l,ce.get(l)||0]);M.forEach(l=>{let f=l.__bucketMap||new Map;l.data=Oe.map(C=>[C,f.get(C)||0]),delete l.__bucketMap});let Ue=this._getUntrackedColor();M.push({id:"adaptive-untracked",name:"Untracked",type:"bar",stack:"consumption",barMaxWidth:50,color:Ue,itemStyle:{borderColor:Ue,borderWidth:1,borderRadius:[4,4,0,0],opacity:.5},data:Le});let le=new Map;b.importCost.forEach(l=>{this._mergeInto(le,this._bucketSeries(R[l]||[],m))}),b.exportCompensation.forEach(l=>{let f=new Map;this._bucketSeries(R[l]||[],m).forEach((C,T)=>{f.set(T,-C)}),this._mergeInto(le,f)});let It=Array.from(le.entries()).map(([l,f])=>[l,f]).sort((l,f)=>l[0]-f[0]),Be=new Map,He=new Map;b.price.forEach(l=>{this._accumulateSeriesAverage(Me[l]||[],m,Be,He)});let Tt=Array.from(Be.entries()).map(([l,f])=>[l,f/Math.max(1,He.get(l)||1)]).sort((l,f)=>l[0]-f[0]),Ve=new Map,qe=new Map;b.temperature.forEach(l=>{this._accumulateSeriesAverage(Ne[l]||[],m,Ve,qe)});let Mt=Array.from(Ve.entries()).map(([l,f])=>[l,f/Math.max(1,qe.get(l)||1)]).sort((l,f)=>l[0]-f[0]);if(this._costAxisDigits=dt(It.map(l=>Number(l[1]))),this._priceAxisDigits=dt(Tt.map(l=>Number(l[1]))),this._temperatureAxisDigits=dt(Mt.map(l=>Number(l[1]))),It.length){let l=this._getCostColor();M.push({id:"adaptive-cost-overlay",name:"Cost",type:"line",smooth:.2,symbol:"none",showSymbol:!1,yAxisIndex:1,z:80,lineStyle:{width:2,color:l},itemStyle:{color:l},data:It})}if(Tt.length){let l=this._getPriceColor();M.push({id:"adaptive-price-overlay",name:"Price",type:"line",smooth:.05,symbol:"none",showSymbol:!1,yAxisIndex:2,z:79,lineStyle:{width:2,type:"dashed",color:l},itemStyle:{color:l},data:Tt})}if(Mt.length){let l=this._getTemperatureColor(),f=r?.temperature_override?"Temperature (override)":"Temperature";M.push({id:"adaptive-temperature-overlay",name:f,type:"line",smooth:.1,symbol:"none",showSymbol:!1,yAxisIndex:3,z:78,lineStyle:{width:2,type:"dotted",color:l},itemStyle:{color:l},data:Mt})}if(!M.some(l=>Array.isArray(l.data)&&l.data.length)){let l=(this._rangeAttemptCounts?.[i]||0)+1;if(this._rangeAttemptCounts={...this._rangeAttemptCounts||{},[i]:l},l<2){this._queueRetryForRange(i);return}this._showCardError("No consumption data available for the selected range.");return}this._rangeAttemptCounts={...this._rangeAttemptCounts||{},[i]:0};let je=this._hass?.locale?.language||"en",Ge=e.end.getTime()-e.start.getTime(),ei=m>=24*60*60*1e3?"1d":m>=60*60*1e3?`${Math.round(m/(60*60*1e3))}h`:"15m",ri={grid:{top:20,bottom:0,left:1,right:1,containLabel:!0},legend:{show:!1,type:"custom",data:[{id:"adaptive-total",secondaryIds:[],name:"Total",itemStyle:{color:"var(--primary-text-color)",borderColor:"var(--primary-text-color)"}},...M.map(l=>{let f=l?.itemStyle?.color||l?.lineStyle?.color||l?.itemStyle?.borderColor||l?.color;return{id:l.id,secondaryIds:[],name:l.name,itemStyle:{color:f,borderColor:f}}})]},xAxis:{type:"time",axisLabel:{formatter:l=>this._formatBucketLabel(Number(l),m,Ge,je)}},yAxis:[{type:"value",axisLabel:{formatter:l=>this._energyUnit?`${l} ${this._energyUnit}`:`${l}`}},{type:"value",position:"right",splitLine:{show:!1},axisLabel:{formatter:l=>this._formatCostAxisValue(l)}},{type:"value",position:"right",offset:56,splitLine:{show:!1},axisLabel:{formatter:l=>this._formatPriceAxisValue(l)}},{type:"value",position:"right",offset:112,splitLine:{show:!1},axisLabel:{formatter:l=>this._formatTemperatureAxisValue(l)}}],tooltip:{show:!0,trigger:"axis",formatter:l=>{let f=Array.isArray(l)?l:[l];if(!f.length)return"";let C=Array.isArray(f[0].value)?f[0].value[0]:f[0].value,T=this._bucketStart(Number(C),m),P=`${this._formatBucketLabel(T,m,Ge,je)} (${ei})`,st=Number(Dt.get(T)||0),W=this._formatEnergyStatValue(st),z=f.filter(D=>Array.isArray(D.value)&&Math.abs(Number(D.value[1])||0)>0).map(D=>{let B=Number(D.value[1]),ni=D.seriesId==="adaptive-cost-overlay"?this._formatCostValue(B):D.seriesId==="adaptive-price-overlay"?this._formatPriceValue(B):D.seriesId==="adaptive-temperature-overlay"?this._formatTemperatureValue(B):this._energyUnit?`${B.toFixed(2)} ${this._energyUnit}`:`${B.toFixed(2)}`;return{marker:D.marker,color:D.color,name:D.seriesName,value:ni}});if(ut(this._hass?.config?.version,"2026.6.0")){let D="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;";return V`
              <h4 style="text-align: center; margin: 0;">${P}</h4>
              Total: <span style="direction:ltr; display: inline;">${W}</span>
              ${z.map(B=>V`<br /><span style="${D}background-color:${B.color};"></span>
                  ${B.name}: <span style="direction:ltr; display: inline;">${B.value}</span>`)}
            `}let yt=`Total: <div style="direction:ltr; display: inline;">${W}</div>`,Ke=z.map(D=>`${D.marker} ${D.name}: <div style="direction:ltr; display: inline;">${D.value}</div>`).join("<br>");return`<h4 style="text-align: center; margin: 0;">${P}</h4>${yt}${Ke?`<br>${Ke}`:""}`}}},ii=M.map(l=>{let f=(Array.isArray(l?.data)?l.data:[]).map(z=>Array.isArray(z)?Number(z[1]):NaN).filter(z=>Number.isFinite(z)),C=f.length?Math.min(...f):0,T=f.length?Math.max(...f):0,P=f.length?f.reduce((z,yt)=>z+yt,0)/f.length:0,st=f.length?f.reduce((z,yt)=>z+yt,0):0,W=f.length?f[f.length-1]:0,Y="energy";return l.id==="adaptive-cost-overlay"?Y="cost":l.id==="adaptive-price-overlay"?Y="price":l.id==="adaptive-temperature-overlay"&&(Y="temperature"),{id:l.id||"",name:l.name||"",color:l?.itemStyle?.color||l?.lineStyle?.color||l?.itemStyle?.borderColor||l?.color||"var(--primary-color)",min:C,max:T,avg:P,sum:Y==="price"||Y==="temperature"?null:st,last:W,kind:Y}}),N=Array.from(Dt.values()).filter(l=>Number.isFinite(l)),si={id:"",name:"Total",color:"var(--primary-text-color)",min:N.length?Math.min(...N):0,max:N.length?Math.max(...N):0,avg:N.length?N.reduce((l,f)=>l+f,0)/N.length:0,sum:N.length?N.reduce((l,f)=>l+f,0):0,last:N.length?N[N.length-1]:0,kind:"energy"};this._allSeries=M,this._chartOptions=ri,this._legendRows=[si,...ii],this._debugEnabled&&(this._latestAdaptiveExportData={generated_at:new Date().toISOString(),collection_key:this._getCollectionKey(),range:{start:e.start.toISOString(),end:e.end.toISOString()},bucket_ms:m,period:{device:w,flow_and_cost:S,price:"hour",temperature:"hour"},ids:{device:c,flow:v,overlay:b},metadata:{energy:h,units:{energy:this._energyUnit,cost:this._costUnit,price:this._priceUnit,temperature:this._temperatureUnit}},raw:{device:L,flow_and_cost:et,price:A,temperature:kt},computed:{total_consumed_by_bucket:this._serializeMap(Dt),device_totals_by_bucket:this._serializeMap(ee),untracked_by_bucket:this._serializeMap(ce)},series:M}),this._initializeSeriesVisibility(M),this._logAdaptiveGraphDebug({updateMeta:this._lastUpdateMeta||{primaryTrigger:this._lastUpdateTrigger||"unspecified",finalTrigger:this._lastUpdateTrigger||"unspecified",triggerChain:[this._lastUpdateTrigger||"unspecified"],triggerContexts:{}},bounds:e,bucketMs:m,devicePeriod:w,flowPeriod:S,deviceIds:c,flowAndCostIds:K,flowIds:v,overlayIds:b,deviceRaw:L,flowRaw:et,priceRaw:A,temperatureRaw:kt,series:M,costPoints:It,pricePoints:Tt,temperaturePoints:Mt,untrackedPoints:Le}),this._pendingRetryRangeKey=null,this._setLoadingState(!1),this._lastRenderedUpdateSignature=s,this._applySeriesVisibility()}catch(t){let e=t?.message||String(t);this._showCardError(`Failed to render adaptive graph: ${e}`)}}};var qt=class extends HTMLElement{setConfig(t){this._config=t||{},this._resolvedMetrics=this._config.resolved_metrics||{},this._debugEnabled=this._config.debug===!0,pt("future_price",this._config),this._debugEnabled||(this._lastFuturePriceDebugStatus=void 0),this.shadowRoot||this.attachShadow({mode:"open"}),this._renderBase()}set hass(t){this._hass=t,this._trySubscribe(),this._ensureChart()}connectedCallback(){!this._resizeObserver&&typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(()=>this._scheduleUpdate()),this._resizeObserver.observe(this)),this._scheduleNowTick()}disconnectedCallback(){this._unsubscribe&&(this._unsubscribe(),this._unsubscribe=void 0),this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=void 0),this._clearNowTick(),this._unbindShadeFromChart()}getCardSize(){return 3}_renderBase(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
      <style>
        :host { display: block; }
        ha-card { height: 100%; }
        .card-header { padding-bottom: 0; }
        .content { padding: 16px; }
        .content.has-header { padding-top: 0; }
        .empty {
          color: var(--secondary-text-color);
          user-select: text;
          -webkit-user-select: text;
          cursor: text;
          white-space: pre-wrap;
        }
        .chart-wrap {
          position: relative;
          isolation: isolate;
        }
        .chart-wrap ha-chart-base {
          position: relative;
          z-index: 3;
          pointer-events: auto;
        }
        .tomorrow-shade {
          position: absolute;
          pointer-events: none !important;
          user-select: none;
          display: none;
          z-index: 0;
        }
        .now-indicator {
          position: absolute;
          pointer-events: none !important;
          user-select: none;
          display: none;
          z-index: 4;
          border-left: 2px solid color-mix(in srgb, var(--error-color) 80%, white);
        }
        .now-indicator.offscreen {
          border-left-color: transparent;
        }
        .now-indicator-label {
          position: absolute;
          top: 4px;
          left: 6px;
          font-size: var(--ha-font-size-xs);
          font-weight: 600;
          color: color-mix(in srgb, var(--error-color) 80%, white);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .now-indicator-time {
          display: block;
          margin-top: 2px;
          font-size: var(--ha-font-size-2xs);
          font-weight: 500;
          letter-spacing: 0.02em;
          text-transform: none;
        }
        .now-indicator-hint {
          display: block;
          margin-top: 2px;
          font-size: 2.5em;
          line-height: 1;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-transform: none;
        }
        .now-indicator.offscreen-right .now-indicator-label {
          left: auto;
          right: 6px;
          text-align: right;
        }
        .now-indicator.offscreen .now-indicator-time {
          opacity: 0.8;
        }
        .day-shade-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: calc(100% - 8px);
          text-align: center;
          font-size: var(--ha-font-size-xs);
          color: transparent;
          -webkit-text-stroke: 0;
          text-shadow: 0 0 0 var(--card-background-color);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
          pointer-events: none !important;
        }
        .stats {
          margin-top: 12px;
          border-top: 1px solid var(--divider-color);
          padding-top: 10px;
          font-size: var(--ha-font-size-s);
          color: var(--primary-text-color);
        }
        .stats table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .stats th,
        .stats td {
          padding: 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .stats th {
          color: var(--secondary-text-color);
          font-weight: 500;
        }
        .stats .series {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }
        .stats .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 1px solid currentColor;
          flex: 0 0 auto;
        }
        .stats .label {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .stats th.num,
        .stats td.num {
          text-align: right;
        }
        .stats tr.toggleable {
          cursor: pointer;
        }
        .stats tr.hidden {
          color: var(--secondary-text-color);
        }
        .stats tr.hidden .dot {
          background: transparent !important;
        }
      </style>
      <ha-card>
        ${this._config?.title?`<h1 class="card-header">${this._config.title}</h1>`:""}
        <div class="content ${this._config?.title?"has-header":""}">
          <div id="chart-wrap" class="chart-wrap">
            <ha-chart-base id="chart"></ha-chart-base>
            <div id="today-shade" class="tomorrow-shade">
              <span class="day-shade-label">Today</span>
            </div>
            <div id="tomorrow-shade" class="tomorrow-shade">
              <span class="day-shade-label">Tomorrow</span>
            </div>
            <div id="now-indicator" class="now-indicator">
              <span class="now-indicator-label">Now<span id="now-indicator-time" class="now-indicator-time"></span><span id="now-indicator-hint" class="now-indicator-hint"></span></span>
            </div>
          </div>
          <div id="empty" class="empty" style="display:none;">No data</div>
          <div id="stats" class="stats"></div>
        </div>
      </ha-card>
    `,this._ensureChart())}_ensureChart(){this.shadowRoot&&(this._chart=this.shadowRoot.querySelector("#chart"),this._chart&&this._hass&&(this._chart.hass=this._hass,this._chart.height="280px"))}_getCollection(){let t=this._config?.collection_key||I;return this._hass?.connection?.[`_${t}`]}_trySubscribe(){let t=this._getCollection();!t||t===this._collection||!t.subscribe||(this._unsubscribe&&this._unsubscribe(),this._collection=t,this._unsubscribe=t.subscribe(e=>{this._energyData=e,this._scheduleUpdate()}))}_scheduleUpdate(){this._updateScheduled||(this._updateScheduled=!0,requestAnimationFrame(()=>{this._updateScheduled=!1,this._updateChart()}))}_scheduleNowTick(){this._clearNowTick(),this._nowTickInterval=setInterval(()=>{this._applyTomorrowShadeGraphic()},6e4)}_clearNowTick(){this._nowTickInterval&&(clearInterval(this._nowTickInterval),this._nowTickInterval=void 0)}_fetchStats(t,e,r,i,s){return t.length?this._hass.callWS({type:"recorder/statistics_during_period",start_time:e.toISOString(),end_time:r.toISOString(),statistic_ids:t,period:i,types:s}):Promise.resolve({})}_fetchStatsMetadata(t){let e=Array.from(new Set((t||[]).filter(Boolean)));return e.length?this._hass.callWS({type:"recorder/get_statistics_metadata",statistic_ids:e}).then(r=>{let i={};return(r||[]).forEach(s=>{s?.statistic_id&&(i[s.statistic_id]=s)}),i}):Promise.resolve({})}_normalizeMaxSeries(t){return Array.isArray(t)?t.map(e=>{let r=typeof e?.start=="number"?e.start:typeof e?.start=="string"?Date.parse(e.start):NaN,i=Number(e?.max);return!Number.isFinite(r)||!Number.isFinite(i)?null:[r,i]}).filter(Boolean).sort((e,r)=>e[0]-r[0]):[]}_getFixedRange(){let t=new Date;t.setHours(0,0,0,0);let e=new Date(t);return e.setDate(e.getDate()+1),e.setHours(23,59,59,999),{start:t,end:e}}_formatDate(t){let e=this._hass?.locale?.language||"en";return new Date(t).toLocaleDateString(e,{day:"2-digit",month:"short"})}_formatHourRange(t){let e=new Date(t),r=new Date(t+60*60*1e3),i=s=>String(s).padStart(2,"0");return`${i(e.getHours())}-${i(r.getHours())}`}_formatBucketLabel(t){return`${this._formatDate(t)} ${this._formatHourRange(t)}`}_formatClock(t){let e=new Date(t),r=i=>String(i).padStart(2,"0");return`${r(e.getHours())}:${r(e.getMinutes())}`}_getNowForecastValue(t){if(!Array.isArray(t)||!t.length)return 0;let e=Date.now(),r=new Date(e);r.setMinutes(0,0,0);let i=r.getTime(),s=t.find(c=>Number(c?.[0])===i);if(s&&Number.isFinite(Number(s[1])))return Number(s[1]);let o=[...t].filter(c=>Number.isFinite(Number(c?.[0]))&&Number(c[0])<=e).sort((c,d)=>Number(d[0])-Number(c[0]))[0];if(o&&Number.isFinite(Number(o[1])))return Number(o[1]);let a=t[t.length-1];return Number.isFinite(Number(a?.[1]))?Number(a[1]):0}_formatPriceValue(t){let e=typeof t=="number"?t:Number(t||0),r=this._hass?.locale?.language||"en",i=new Intl.NumberFormat(r,{minimumFractionDigits:1,maximumFractionDigits:1}).format(e);return this._priceUnit?`${i} ${this._priceUnit}`:i}_formatPriceAxisValue(t){let e=typeof t=="number"?t:Number(t||0),r=this._hass?.locale?.language||"en",i=this._priceAxisDigits||0,s=new Intl.NumberFormat(r,{minimumFractionDigits:i,maximumFractionDigits:i}).format(e),o=(this._priceUnit||"").split("/")[0].trim();return o?`${s} ${o}`:s}_getPriceForecastColor(t=0){let e=getComputedStyle(this),r=[e.getPropertyValue("--info-color").trim()||"#2f7ed8",e.getPropertyValue("--warning-color").trim()||"#f59e0b",e.getPropertyValue("--success-color").trim()||"#16a34a",e.getPropertyValue("--accent-color").trim()||"#0ea5e9",e.getPropertyValue("--error-color").trim()||"#ef4444"];return r[t%r.length]}_toggleSeriesVisibility(t){this._hiddenSeriesIds||(this._hiddenSeriesIds=new Set),this._hiddenSeriesIds.has(t)?this._hiddenSeriesIds.delete(t):this._hiddenSeriesIds.add(t),this._applySeriesVisibility()}_renderLegendTable(t,e){let r=this.shadowRoot?.querySelector("#stats");r&&(r.innerHTML=`
      <table>
        <thead>
          <tr>
            <th>Series</th>
            <th class="num">Min</th>
            <th class="num">Max</th>
            <th class="num">Avg</th>
            <th class="num">Now</th>
          </tr>
        </thead>
        <tbody>
          ${(t||[]).map(i=>`
            <tr class="${i.id&&e?.has(i.id)?"hidden":""}">
              <td><span class="series"><span class="dot" style="color: ${i.color}; background-color: ${i.color};"></span><span class="label">${i.name}</span></span></td>
              <td class="num">${this._formatPriceValue(i.min)}</td>
              <td class="num">${this._formatPriceValue(i.max)}</td>
              <td class="num">${this._formatPriceValue(i.avg)}</td>
              <td class="num">${this._formatPriceValue(i.now??i.last)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `)}_applySeriesVisibility(){if(!this._chart||!this._allSeries||!this._chartOptions)return;let t=this._hiddenSeriesIds||new Set,e=this._allSeries.filter(i=>!t.has(i.id)),r=this.shadowRoot?.querySelector("#empty");r&&(r.style.display=e.some(i=>i.data?.length)?"none":"block"),this._chart.hass=this._hass,this._chart.data=e,this._chart.options=this._chartOptions,this._chart.requestUpdate?.(),this._bindShadeToChart(),requestAnimationFrame(()=>this._applyTomorrowShadeGraphic()),this._renderLegendTable(this._legendRows||[],t)}_bindShadeToChart(){if(!this.isConnected)return;let t=this._chart?.chart;if(!t){requestAnimationFrame(()=>this._bindShadeToChart());return}this._shadeBoundChart!==t&&(this._unbindShadeFromChart(),this._shadeFinishedHandler=()=>this._applyTomorrowShadeGraphic(),t.on("finished",this._shadeFinishedHandler),this._shadeBoundChart=t)}_unbindShadeFromChart(){this._shadeBoundChart&&this._shadeFinishedHandler&&this._shadeBoundChart.off("finished",this._shadeFinishedHandler),this._shadeBoundChart=void 0,this._shadeFinishedHandler=void 0}_applyTomorrowShadeGraphic(){let t=this._chart?.chart;if(!t||!Number.isFinite(this._tomorrowStartMs))return;let e=this.shadowRoot?.querySelector("#today-shade"),r=this.shadowRoot?.querySelector("#tomorrow-shade"),i=this.shadowRoot?.querySelector("#now-indicator"),s=this.shadowRoot?.querySelector("#now-indicator-time"),o=this.shadowRoot?.querySelector("#now-indicator-hint");if(!e||!r||!i)return;let a=e.querySelector(".day-shade-label"),c=r.querySelector(".day-shade-label"),d=()=>{e.style.display="none",r.style.display="none",i.style.display="none",i.classList.remove("offscreen","offscreen-left","offscreen-right"),o&&(o.textContent="")};if(!Array.isArray(this._allSeries)||!this._allSeries.length){d();return}let u=t.getModel()?.getComponent?.("grid",0)?.coordinateSystem?.getRect?.();if(!u){d();return}let _=Number(t.convertToPixel({xAxisIndex:0},this._tomorrowStartMs));if(!Number.isFinite(_)){d();return}if(u.width<=0||u.height<=0){d();return}let p=Math.max(u.x,Math.min(u.x+u.width,_)),y=Math.max(0,p-u.x),x=Math.max(0,u.x+u.width-p),g=this._hass?.themes?.darkMode??(typeof window<"u"&&window.matchMedia?.("(prefers-color-scheme: dark)")?.matches),b=g?"rgba(34, 197, 94, 0.07)":"rgba(148, 163, 184, 0.12)",v=g?"rgba(250, 204, 21, 0.11)":"rgba(100, 116, 139, 0.16)",E=Math.max(12,Math.round(u.height*.25));a&&(a.style.fontSize=`${E}px`),c&&(c.style.fontSize=`${E}px`),y>0?(e.style.display="block",e.style.left=`${u.x}px`,e.style.top=`${u.y}px`,e.style.width=`${y}px`,e.style.height=`${u.height}px`,e.style.background=b):e.style.display="none",x>0?(r.style.display="block",r.style.left=`${p}px`,r.style.top=`${u.y}px`,r.style.width=`${x}px`,r.style.height=`${u.height}px`,r.style.background=v):r.style.display="none";let m=Date.now();if(Number.isFinite(this._rangeStartMs)&&Number.isFinite(this._rangeEndMs)&&m>=this._rangeStartMs&&m<=this._rangeEndMs){let w=Number(t.convertToPixel({xAxisIndex:0},m));if(Number.isFinite(w)){if(i.style.display="block",i.style.top=`${u.y}px`,i.style.height=`${u.height}px`,s&&(s.textContent=this._formatClock(m)),w<u.x){i.classList.add("offscreen","offscreen-left"),i.classList.remove("offscreen-right"),i.style.left=`${u.x}px`,o&&(o.textContent="\u2190");return}if(w>u.x+u.width){i.classList.add("offscreen","offscreen-right"),i.classList.remove("offscreen-left"),i.style.left=`${u.x+u.width}px`,o&&(o.textContent="\u2192");return}i.classList.remove("offscreen","offscreen-left","offscreen-right"),i.style.left=`${w}px`,o&&(o.textContent="")}else i.style.display="none",i.classList.remove("offscreen","offscreen-left","offscreen-right"),o&&(o.textContent="")}else i.style.display="none",i.classList.remove("offscreen","offscreen-left","offscreen-right"),o&&(o.textContent="")}_formatDebugTime(t){if(!Number.isFinite(t))return null;let e=new Date(t);return{ts:t,iso:e.toISOString(),local:e.toString()}}_logFuturePriceDebug(t){if(!this._debugEnabled)return;let e=t?.result?.status||"unknown";e!==this._lastFuturePriceDebugStatus&&(this._lastFuturePriceDebugStatus=e,Nr({source:"future_price",payload:t}))}_showCardError(t){let e=this.shadowRoot?.querySelector("#empty");e&&(e.textContent=t,e.style.display="block"),this._allSeries=[],this._chartOptions={legend:{show:!1,type:"custom"},xAxis:{type:"time"},yAxis:[{type:"value",position:"right",splitLine:{show:!1}}],tooltip:{show:!1}},this._legendRows=[],this._chart&&(this._chart.hass=this._hass,this._chart.data=[],this._chart.options=this._chartOptions,this._chart.requestUpdate?.());let r=this.shadowRoot?.querySelector("#today-shade"),i=this.shadowRoot?.querySelector("#tomorrow-shade"),s=this.shadowRoot?.querySelector("#now-indicator");r&&(r.style.display="none"),i&&(i.style.display="none"),s&&(s.style.display="none"),this._renderLegendTable([],this._hiddenSeriesIds||new Set)}async _updateChart(){if(!this._hass||(this._ensureChart(),!this._chart))return;let t=this._resolvedMetrics||{},e=typeof t.future_price_error=="string"&&t.future_price_error.trim()?t.future_price_error.trim():null,r=Array.isArray(t.price_forecast)?t.price_forecast.filter(s=>typeof s=="string"&&s.length):[],i={resolvedMetrics:{forecastIds:r},fetch:{requestedIds:[],pointCounts:{},metadataUnit:""},result:{status:"pending"}};try{if(e){i.result={status:"forecast_error",message:e},this._logFuturePriceDebug(i),this._showCardError(e);return}if(!r.length){i.result={status:"no_area_ids",message:"No Fortum price forecast statistics configured."},this._logFuturePriceDebug(i),this._showCardError("No Fortum price forecast statistics configured.");return}let{start:s,end:o}=this._getFixedRange();this._rangeStartMs=s.getTime(),this._rangeEndMs=o.getTime();let a=(this._token||0)+1;this._token=a,i.range={start:this._formatDebugTime(s.getTime()),end:this._formatDebugTime(o.getTime())},i.fetch.requestedIds=r;let c=await this._fetchStats(r,s,o,"hour",["max"]);if(this._token!==a)return;let d={};r.forEach(g=>{d[g]=this._normalizeMaxSeries(c?.[g]),i.fetch.pointCounts[g]=d[g].length}),this._priceUnit="";let h={};try{if(h=await this._fetchStatsMetadata(r),this._token!==a)return;let g=r.map(b=>h?.[b]?.statistics_unit_of_measurement).find(b=>typeof b=="string");this._priceUnit=typeof g=="string"?g:"",i.fetch.metadataUnit=this._priceUnit}catch{this._priceUnit="",h={},i.fetch.metadataError=!0}let u=[],_=[],p=[];if(r.forEach((g,b)=>{let v=d[g]||[],E=this._getPriceForecastColor(b),m=`future-price-overlay-${b}`,w=br(g,b),S=v.map($=>Number($[1])).filter($=>Number.isFinite($));p.push(...S),u.push({id:m,name:w,type:"line",smooth:.05,symbol:"none",showSymbol:!1,yAxisIndex:0,z:10,lineStyle:{width:2,type:"dashed",color:E},itemStyle:{color:E},data:v}),_.push({id:m,name:w,color:E,min:S.length?Math.min(...S):0,max:S.length?Math.max(...S):0,avg:S.length?S.reduce(($,K)=>$+K,0)/S.length:0,now:this._getNowForecastValue(v)})}),!u.some(g=>Array.isArray(g.data)&&g.data.length)){let g=r.length===1?`Price statistic ${r[0]} has no values for the selected range.`:"No forecast price data available for configured Fortum sources.";i.result={status:"no_points",message:g},this._logFuturePriceDebug(i),this._showCardError(g);return}this._priceAxisDigits=dt(p);let y=new Date(s);y.setDate(y.getDate()+1);let x={grid:{top:20,bottom:0,left:1,right:1,containLabel:!0},legend:{show:!1,type:"custom"},xAxis:{type:"time",min:s,max:o,axisLabel:{formatter:g=>this._formatClock(Number(g))}},yAxis:[{type:"value",position:"right",splitLine:{show:!1},axisLabel:{formatter:g=>this._formatPriceAxisValue(g)}}],tooltip:{show:!0,trigger:"axis",formatter:g=>{let b=Array.isArray(g)?g:[g];if(!b.length)return"";let v=Array.isArray(b[0].value)?b[0].value[0]:b[0].value,E=this._formatClock(Number(v)),m=b.filter(S=>Array.isArray(S.value)).map(S=>{let $=Number(S.value[1]);return{marker:S.marker,color:S.color,name:S.seriesName,value:this._formatPriceValue($)}});if(ut(this._hass?.config?.version,"2026.6.0")){let S="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;";return V`
              <h4 style="text-align: center; margin: 0;">${E}</h4>
              ${m.map($=>V`<span style="${S}background-color:${$.color};"></span>
                  ${$.name}: <span style="direction:ltr; display: inline;">${$.value}</span><br />`)}
            `}let w=m.map(S=>`${S.marker} ${S.name}: <div style="direction:ltr; display: inline;">${S.value}</div>`).join("<br>");return`<h4 style="text-align: center; margin: 0;">${E}</h4>${w}`}}};this._allSeries=u,this._chartOptions=x,this._legendRows=_,this._tomorrowStartMs=y.getTime(),i.result={status:"ok",seriesCount:u.length,legendRows:_.map(g=>g.id)},this._logFuturePriceDebug(i),this._applySeriesVisibility()}catch(s){let o=s?.message||String(s);i.result={status:"error",message:o},this._logFuturePriceDebug(i),this._showCardError(`Failed to load forecast prices: ${o}`)}}};var zr=0,Ri=(n,t,e,r)=>{let i=n instanceof Date?n.getTime():null,s=e instanceof Date?e.getTime():null,o=t instanceof Date?t.getTime():null,a=r instanceof Date?r.getTime():null;return i===s&&o===a},zi=()=>{let n=new Date;n.setHours(0,0,0,0);let t=new Date(n);return t.setHours(23,59,59,999),{start:n,end:t}},Fi=n=>{try{let t=localStorage.getItem(`${de}${n}`);if(!t)return null;let e=JSON.parse(t),r=Number(e?.start),i=Number(e?.end);return!Number.isFinite(r)||!Number.isFinite(i)||i<=r?null:{start:new Date(r),end:new Date(i)}}catch{return null}},Oi=(n,t,e)=>{!(t instanceof Date)||!(e instanceof Date)||localStorage.setItem(`${de}${n}`,JSON.stringify({start:t.getTime(),end:e.getTime()}))},Fr=(n,t)=>{let e=n?.connection?.[`_${t}`];if(!e||typeof e.setPeriod!="function")return;if(!e.__myEnergyRangePatched){let s=e.setPeriod.bind(e);e.setPeriod=(o,a)=>{s(o,a),o instanceof Date&&a instanceof Date&&(Oi(t,o,a),typeof window<"u"&&typeof window.dispatchEvent=="function"&&(zr+=1,window.dispatchEvent(new CustomEvent("fortum-energy:range-changed",{detail:{collectionKey:t,start:o.getTime(),end:a.getTime(),source:"range_persistence_set_period_patch",rangeChangeSequence:zr,changedAt:new Date().toISOString()}}))))},e.__myEnergyRangePatched=!0}if(e.__myEnergyRangeInitialized)return;e.__myEnergyRangeInitialized=!0;let i=Fi(t)||zi();Ri(e.start,e.end,i.start,i.end)||(e.setPeriod(i.start,i.end),typeof e.refresh=="function"&&e.refresh())};var jt=class extends HTMLElement{setConfig(t){this._config=t||{},pt("quick_ranges",this._config),this.shadowRoot||this.attachShadow({mode:"open"}),this._render()}set hass(t){let e=this._hass?.locale?.language!==t?.locale?.language;this._hass=t;let r=this._config?.collection_key||I;Fr(t,r),(!this._rendered||e)&&this._render()}getCardSize(){return 1}_setDefaultRange(t){let e=this._config?.collection_key||I,r=this._hass?.connection?.[`_${e}`],s=(()=>{let d=r?.start instanceof Date?r.start:null,h=r?.end instanceof Date?r.end:null;return!d||!h?new Date:new Date((d.getTime()+h.getTime())/2)})();s.setHours(12,0,0,0);let o=d=>{let h=Math.floor((d-1)/2),u=new Date(s);u.setDate(s.getDate()-h),u.setHours(0,0,0,0);let _=new Date(u);return _.setDate(u.getDate()+d-1),_.setHours(23,59,59,999),{start:u,end:_}},a,c;if(t==="month"?{start:a,end:c}=o(31):t==="week"?{start:a,end:c}=o(7):{start:a,end:c}=o(1),r&&r.setPeriod&&r.refresh){r.setPeriod(a,c),r.refresh();return}window.location.reload()}_render(){if(!this.shadowRoot||!this._hass)return;let t="Day",e="Week",r="Month";this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          height: 100%;
        }
        .card {
          background: var(--ha-card-background, var(--card-background-color));
          border-radius: var(--ha-card-border-radius, 12px);
          border: 1px solid var(--divider-color);
          box-sizing: border-box;
          height: 100%;
          display: flex;
          align-items: center;
        }
        .row {
          display: flex;
          gap: 8px;
          padding: 8px 12px;
          align-items: center;
          width: 100%;
        }
        ha-button {
          flex: 1;
          --ha-button-theme-color: currentColor;
        }
        ha-button.export {
          flex: 0 0 auto;
          min-width: 92px;
        }
      </style>
      <div class="card">
        <div class="row">
          <ha-button appearance="filled" size="small" data-range="day">${t}</ha-button>
          <ha-button appearance="filled" size="small" data-range="week">${e}</ha-button>
          <ha-button appearance="filled" size="small" data-range="month">${r}</ha-button>
          ${this._config?.debug===!0?'<ha-button class="export" appearance="outlined" size="small" data-range="export">Export Debug</ha-button>':""}
        </div>
      </div>
    `,this._boundClick||(this._boundClick=i=>{let s=i.target;if(!(s instanceof Element))return;let o=s.closest("ha-button");if(!o)return;let a=o.getAttribute("data-range");if(a){if(a==="export"){let c=this._config?.collection_key||I;window.dispatchEvent(new CustomEvent("fortum-energy:export-debug-info",{detail:{collectionKey:c,download:!0}}));return}this._setDefaultRange(a)}},this.shadowRoot.addEventListener("click",this._boundClick)),this._rendered=!0}};Ie();Te();var Jt=class extends HTMLElement{setConfig(t){}getCardSize(){return 1}getGridOptions(){return{rows:1,columns:4}}connectedCallback(){this.style.display="block",this.style.height="100%",this.style.pointerEvents="none"}};Pt();var Wr=/^fortum:hourly_consumption_[a-z0-9_]+$/i,ji=/^fortum:price_forecast_[a-z0-9_]+$/i,Gi=(n,t)=>Object.prototype.hasOwnProperty.call(n||{},t),Yr=n=>Array.from(new Set((Array.isArray(n)?n:[]).map(t=>typeof t=="string"?t:t?.statistic_id).filter(t=>typeof t=="string"&&t.length))),Ki=n=>{let t=String(n||"").trim().toLowerCase().replace(/[^0-9a-z_]/g,"_").replace(/^_+|_+$/g,"");if(!t)throw new Error("Invalid metering_point.number value.");return t},Zt=(n,t)=>`fortum:hourly_${n}_${Ki(t)}`,Wi=n=>{if(typeof n!="string"||!Wr.test(n))throw new Error(`Invalid Fortum consumption statistic id: ${n||"<empty>"}`);return{consumption:n,cost:n.replace("hourly_consumption_","hourly_cost_"),price:n.replace("hourly_consumption_","hourly_price_"),temperature:n.replace("hourly_consumption_","hourly_temperature_")}},Yi=n=>(Array.isArray(n)?n:[]).map(t=>{if(!t||typeof t!="object")return null;let e=typeof t.stat=="string"?t.stat.trim():"";if(!e)return null;let r=typeof t.name=="string"?t.name.trim():"";return{stat:e,...r?{name:r}:{}}}).filter(Boolean),Ji=n=>(Array.isArray(n)?n:[]).map(t=>{if(!t||typeof t!="object")return null;let e=typeof t.stat_consumption=="string"?t.stat_consumption.trim():"";if(!e)return null;let r=typeof t.name=="string"?t.name.trim():"";return{stat:e,...r?{name:r}:{}}}).filter(Boolean),Zi=n=>Yr(n).filter(t=>Wr.test(t)).sort(),Xi=n=>Yr(n).filter(t=>ji.test(t)).sort(),Jr=({config:n,prefs:t,statisticIds:e})=>{let r=n?.metering_point,i=typeof r?.number=="string"?r.number.trim():"",s="auto",o;if(i)s="yaml",o={consumption:Zt("consumption",i),cost:Zt("cost",i),price:Zt("price",i),temperature:Zt("temperature",i)};else{let h=Zi(e);if(!h.length)throw new Error("No Fortum metering point statistics found. Set strategy.metering_point.number.");if(h.length>1)throw new Error(`Single strategy found multiple Fortum metering points: ${h.join(", ")}. Set strategy.metering_point.number.`);o=Wi(h[0])}let a;if(Gi(r,"itemization")){if(!Array.isArray(r.itemization))throw new Error("strategy.metering_point.itemization must be a list when provided.");a=Yi(r.itemization)}else a=Ji(t?.device_consumption);let c=typeof r?.temperature=="string"?r.temperature.trim():"",d=!!c;return{source:s,metrics:{consumption:[o.consumption],cost:[o.cost],price:[o.price],temperature:[c||o.temperature],temperature_override:d,itemizations:a,price_forecast:Xi(e)}}};var Qi=(n,t,e=!1,r,i)=>{let s={title:typeof i=="string"&&i.trim()?i.trim():Ee(t,"ui.panel.energy.title.electricity","Electricity"),path:"electricity",type:"sections",sections:[]},o=[];return o.push({type:"custom:fortum-energy-spacer-card",grid_options:{columns:6}}),o.push({title:Ee(t,"ui.panel.energy.cards.energy_date_selection_title","Time range"),type:"energy-date-selection",collection_key:n,disable_compare:!0,opening_direction:"right",vertical_opening_direction:"down",grid_options:{columns:12}}),o.push({type:"custom:fortum-energy-quick-ranges-card",collection_key:n,debug:e,grid_options:{columns:12}}),o.push({type:"custom:fortum-energy-spacer-card",grid_options:{columns:6}}),o.push({type:"custom:fortum-energy-devices-adaptive-graph-card",collection_key:n,debug:e,resolved_metrics:r,grid_options:{columns:36}}),o.push({title:"Price of Tomorrow",type:"custom:fortum-energy-future-price-card",collection_key:n,debug:e,resolved_metrics:r,grid_options:{columns:36}}),o.push({type:"custom:fortum-energy-spacer-card"}),s.sections.push({type:"grid",column_span:3,cards:o}),s},tt=class extends HTMLElement{static async getConfigElement(){return await Promise.resolve().then(()=>(Te(),Kr)),document.createElement("fortum-energy-single-strategy-editor")}static async generate(t,e){try{let r=Kt(t||{}),i=r.collection_key||r.collectionKey||I,s=r.debug===!0,o=await Nt(e),a=typeof r?.metering_point?.number=="string"&&r.metering_point.number.trim().length>0,c=[];try{c=await e.callWS({type:"recorder/list_statistic_ids"})}catch(h){if(!a)throw h}let{metrics:d}=Jr({config:r,prefs:o,statisticIds:c});return{views:[Qi(i,e,s,d,r.electricity_title||r?.metering_point?.name)]}}catch(r){return{views:[{title:"Error",path:"error",cards:[{type:"markdown",content:`Error loading fortum-energy strategy:
> ${r&&r.message?r.message:String(r)}`}]}]}}}static async generateDashboard(t){return this.generate(t.strategy||{},t.hass)}},Xt=class extends tt{};Pt();Ct();var ts=n=>typeof n=="number"&&Number.isFinite(n)?String(Math.trunc(n)):typeof n=="string"&&n.trim()||null,Zr=n=>new Set((Array.isArray(n)?n:[]).map(t=>typeof t=="string"?t:t?.statistic_id).filter(t=>typeof t=="string"&&t.length)),Xr=(n,t,e)=>{let r=Ae(n,t);if(!r)return{forecastIds:[],forecastError:`Metering point sensor with metering_point_no=${t} is missing.`};let i=r.entityId,o=r.stateObj?.attributes?.price_area;if(typeof o!="string"||!o.trim())return{forecastIds:[],forecastError:`Sensor ${i} has no attribute price_area.`};let a=`fortum:price_forecast_${o.trim().toLowerCase()}`;return e.has(a)?{forecastIds:[a],forecastError:null}:{forecastIds:[],forecastError:`Price statistic ${a} has no values.`}},Qr=(n,t,e)=>(!n||!Array.isArray(n.sections)||n.sections.forEach(r=>{Array.isArray(r?.cards)&&r.cards.forEach(i=>{if(i?.type!=="custom:fortum-energy-future-price-card")return;let s=i.resolved_metrics||{};i.resolved_metrics={...s,price_forecast:t,future_price_error:e}})}),n),ti=(n,t)=>(Array.isArray(n?.metering_points)?n.metering_points:[]).map(e=>{let r=ts(e.number),s=(r?Ae(t,r):null)?.stateObj?.attributes?.address,o=typeof s=="string"&&s.trim()?s.trim():void 0,a={...n,metering_point:{...n?.metering_point||{}}};return delete a.metering_points,r&&(a.metering_point.number=r),a.metering_point.itemization=e.itemization,e.name?a.metering_point.name=e.name:delete a.metering_point.name,typeof e.temperature=="string"&&e.temperature.trim()?a.metering_point.temperature=e.temperature.trim():delete a.metering_point.temperature,a.electricity_title=e.name||o||e.number,a});var Qt=class extends tt{static async getConfigElement(){return await Promise.resolve().then(()=>(Ie(),Gr)),document.createElement("fortum-energy-multipoint-strategy-editor")}static async generate(t,e){let r=Wt(t||{}),i=r.metering_points,s=[];try{s=await e.callWS({type:"recorder/list_statistic_ids"})}catch{s=[]}let o=Zr(s),a=[],c=ti(r,e);for(let d=0;d<i.length;d+=1){let h=i[d],u=c[d],_=u?.metering_point?.number||String(h.number),p=await super.generate(u,e),y=Array.isArray(p?.views)?p.views:[],x=y.find(w=>w?.path==="electricity"),g=y[0],b=x||g;if(!b)continue;let{forecastIds:v,forecastError:E}=Xr(e,_,o),m={...b,title:u.electricity_title,path:`electricity-${d+1}`};a.push(Qr(m,v,E))}return{views:a}}};var es=()=>{try{let t=new URL(import.meta.url,globalThis?.location?.href).searchParams.get("v");if(typeof t=="string"&&t.trim().length)return t.trim()}catch{}return"unknown"};globalThis.__fortumEnergyIntegrationVersion=es();var O=(n,t)=>{typeof customElements>"u"||customElements.get(n)||customElements.define(n,t)};typeof process<"u"&&process?.versions?.node&&(globalThis.__fortumEnergyStrategyTestHooks={normalizeEnergySourceOverrides:ot,deriveEnergyRuntimeConfig:ue});O("fortum-energy-custom-legend-card",Rt);O("fortum-energy-spacer-card",Jt);O("fortum-energy-quick-ranges-card",jt);O("fortum-energy-devices-detail-overlay-card",Bt);O("fortum-energy-devices-adaptive-graph-card",Vt);O("fortum-energy-future-price-card",qt);O("fortum-energy-single-strategy-editor",ft);O("fortum-energy-multipoint-strategy-editor",_t);try{O("ll-strategy-dashboard-fortum-energy-single",tt),O("ll-strategy-dashboard-fortum-energy-multipoint",Qt),O("ll-strategy-dashboard-fortum-energy",Xt)}catch(n){console.error("[fortum-energy] strategy registration failed",n)}
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
*/
