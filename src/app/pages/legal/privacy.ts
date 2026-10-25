import { Component } from '@angular/core';
import { BackLink } from '../../shared/back-link/back-link';
import { LegalLinks } from '../../shared/legal-links/legal-links';
import { Logo } from '../../shared/logo/logo';

/** Privacy policy that lists which data the app processes and why. */
@Component({
  imports: [BackLink, LegalLinks, Logo],
  selector: 'app-privacy',
  styleUrl: './legal.scss',
  templateUrl: './privacy.html',
})
export class Privacy {}
