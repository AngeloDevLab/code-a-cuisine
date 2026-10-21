import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

/** Looping salad bowl animation shown while recipes are generated. */
@Component({
  imports: [NgOptimizedImage],
  selector: 'app-cooking-animation',
  styleUrl: './cooking-animation.scss',
  template: `
    <div class="cooking">
      <div class="cooking__bowl">
        <img class="cooking__bowl-back" ngSrc="images/loading/bowl-back.svg" alt="" width="204" height="54" priority />
        <img class="cooking__leaf-light" ngSrc="images/loading/salad.svg" alt="" width="111" height="181" priority />
        <img class="cooking__leaf-dark" ngSrc="images/loading/salad-dark.svg" alt="" width="111" height="181" priority />
        <img class="cooking__pepper-specks" ngSrc="images/loading/pepper.svg" alt="" width="37" height="38" priority />
        <img class="cooking__salt-specks" ngSrc="images/loading/salt.svg" alt="" width="37" height="38" priority />
        <img class="cooking__carrot" ngSrc="images/loading/carrot.svg" alt="" width="120" height="180" priority />
        <img class="cooking__tomato" ngSrc="images/loading/tomato.svg" alt="" width="113" height="105" priority />
        <img class="cooking__spoon" ngSrc="images/loading/spoon.svg" alt="" width="61" height="293" priority />
        <img class="cooking__bowl-front" ngSrc="images/loading/bowl-front.svg" alt="" width="204" height="115" priority />
      </div>
      <img class="cooking__pepper-mill" ngSrc="images/loading/pepper-mill.svg" alt="" width="92" height="260" priority />
      <img class="cooking__salt-shaker" ngSrc="images/loading/salt-shaker.svg" alt="" width="70" height="140" priority />
      <img class="cooking__pepper" ngSrc="images/loading/pepper.svg" alt="" width="37" height="38" priority />
      <img class="cooking__salt" ngSrc="images/loading/salt.svg" alt="" width="37" height="38" priority />
    </div>
  `,
  host: { 'aria-hidden': 'true' },
})
export class CookingAnimation {}
