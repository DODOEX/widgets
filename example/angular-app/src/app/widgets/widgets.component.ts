import { Component, OnInit } from '@angular/core';
import { InitSwapWidget } from '@dodoex/widgets';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent {
  ngOnInit() {
    InitSwapWidget({
      colorMode: 'dark',
      // apikey: '55ea0a80b62316d9bc', // for default test
    });
  }
}

