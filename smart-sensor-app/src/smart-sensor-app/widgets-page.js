import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

import '@polymer/paper-styles/paper-styles.js';

import './bmp280-widget.js';
import './bme280-widget.js';
import './bme680-widget.js';
import './hardware-widget.js';
import './widget-layout.js';

class WidgetsPage extends PolymerElement {
  static get template() {
    return html`
      <style include="app-grid-style">
        :host {
          display: block;
          @apply --paper-font-common-base;
          --app-grid-columns: 2;
          --app-grid-item-height: 100%;
          --app-grid-gutter: 5px;
        }

        @media screen and (min-width: 1200px) {
          :host {
            --app-grid-columns: 3;
          }
        }

        @media screen and (max-width: 700px) {
          :host {
            --app-grid-columns: 1;
          }
        }

        .content-area {
          background-color: white;
        }

        .widget-label {
          margin: 0px 2px 0px 2px;
          padding: 5px 15px 5px 15px;
          border-radius: 20px;
          background-color: var(--paper-red-500);
          color: white;
          font-size: 0.8em;
          font-weight: 500;
          line-height: 1.5em;
          white-space: nowrap;
          @apply --layout-horizontal;
          @apply --layout-center;
        }

        .spacer {
          @apply --layout-flex;
          width: 100%;
        }
      </style>

      <div class="content-area">
        <div id="_grid" class="app-grid">

          <widget-layout key="__kitchen">
            <div slot="title">
              <div>Temperature [[__kitchen_temperature]]°</div>
              <div>Humidity [[__kitchen_humidity]] %</div>
              <div>Pressure [[__kitchen_pressure]] Pa</div>
              <div>Altitude [[__kitchen_altitude]] m</div>
            </div>
            <div class="widget-label" slot="label">
              <div>Kitchen</div>
            </div>
            <bme280-widget 
              device="ESP-2391099"
              last-temperature="{{__kitchen_temperature}}" 
              last-humidity="{{__kitchen_humidity}}" 
              last-pressure="{{__kitchen_pressure}}" 
              last-altitude="{{__kitchen_altitude}}"
              ticks="{{ticks}}">
            </bme280-widget>
          </widget-layout>

          <widget-layout key="__bedroom">
            <div slot="title">
              <div>Temperature [[__bedroom_temperature]]°</div>
              <div>Humidity [[__bedroom_humidity]] %</div>
              <div>Pressure [[__bedroom_pressure]] Pa</div>
              <div>Altitude [[__bedroom_altitude]] m</div>
            </div>
            <div class="widget-label" slot="label">
              <div>Bedroom</div>
            </div>
            <bme280-widget 
              device="ESP-2355357"
              last-temperature="{{__bedroom_temperature}}" 
              last-humidity="{{__bedroom_humidity}}" 
              last-pressure="{{__bedroom_pressure}}" 
              last-altitude="{{__bedroom_altitude}}"
              ticks="{{ticks}}">
            </bme280-widget>
          </widget-layout>

          <!--
          
          Inactive widgets ...
          
          <widget-layout key="__hardware">
            <div slot="title">
              <div>Hardware diagnostics</div>
            </div>
            <div class="widget-label" slot="label">
              <div>ESP8266</div>
            </div>
            <hardware-widget></hardware-widget>
          </widget-layout>

          <widget-layout key="__bmp280">
            <div slot="title">
              <div>Temperature [[__bmp280_temperature]]°</div>
              <div>Pressure [[__bmp280_pressure]] Pa</div>
              <div>Altitude [[__bmp280_altitude]] m</div>
            </div>
            <div class="widget-label" slot="label">
              <div>BMP280</div>
            </div>
            <bmp280-widget 
              device="ESP8266-0001"
              last-temperature="{{__bmp280_temperature}}" 
              last-pressure="{{__bmp280_pressure}}" 
              last-altitude="{{__bmp280_altitude}}"
              ticks="{{ticks}}">
            </bmp280-widget>
          </widget-layout>

          <widget-layout key="__bmp6280">
            <div slot="title">
              <div>Temperature [[__bme680_temperature]]°</div>
              <div>Humidity [[__bme680_humidity]] %</div>
              <div>Pressure [[__bme680_pressure]] Pa</div>
              <div>Gas resistance [[__bme680_gas]] Ω</div>
              <div>Altitude approx. [[__bme680_altitude]] m</div>
            </div>
            <div class="widget-label" slot="label">
              <div>BME680</div>
            </div>
            <bme680-widget 
              device="ESP8266-0001"
              last-temperature="{{__bme680_temperature}}" 
              last-humidity="{{__bme680_humidity}}" 
              last-pressure="{{__bme680_pressure}}" 
              last-gas="{{__bme680_gas}}" 
              last-altitude="{{__bme680_altitude}}"
              ticks="{{ticks}}">
            </bme680-widget>
          </widget-layout>

          -->

        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      ticks: {
        type: Number,
        notify: true
      },
      collapsed: {
        type: Boolean,
        notify: true
      }
    };
  }

  constructor() {
    super();

    // add tasks after next render ...
    afterNextRender(this, function () {
      // listen to window resizing events
      this.__updateGridStyles = this.__updateGridStyles || function () {
        this.updateStyles();
      }.bind(this);
      window.addEventListener('resize', this.__updateGridStyles);
      // initial compute of collapsed state
      this.__computeCollapsedState();
    });
  }

  /**
   * compute collapsed state according to all containing widgets
   */
  __computeCollapsedState() {

    var nodes = this.$._grid.querySelectorAll('widget-layout');
    var state = 0;
    for (var i = 0; i < nodes.length; i++) {
      state += nodes[i].isCollapsed();
    }
    this.collapsed = state === 0 ? false : true;
  }

  /*
   * toggle all widgets synchronous
   */
  __toggleWidgets() {

    var nodes = this.$._grid.querySelectorAll('widget-layout');
    this.collapsed = !this.collapsed;
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].collapse(this.collapsed);
    }
  }
}

window.customElements.define('widgets-page', WidgetsPage);