import { Component, OnInit } from '@angular/core';
import { InitSwapWidget } from '@dodoex/widgets';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss'],
})
export class WidgetsComponent {
  ngOnInit() {
    InitSwapWidget({
      colorMode: 'dark',
      crossChain: true,
      apikey: 'ef9apopzq9qrgntjubojbxe7hy4z5eez', // for default test
    });
  }
}
