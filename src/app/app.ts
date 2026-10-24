import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Popup } from './shared/popup/popup';

@Component({
  imports: [Popup, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
