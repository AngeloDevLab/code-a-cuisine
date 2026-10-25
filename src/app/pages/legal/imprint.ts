import { Component } from '@angular/core';
import { BackLink } from '../../shared/back-link/back-link';
import { LegalLinks } from '../../shared/legal-links/legal-links';
import { Logo } from '../../shared/logo/logo';

/** Legal notice with the operator's contact details and the terms of use. */
@Component({
  imports: [BackLink, LegalLinks, Logo],
  selector: 'app-imprint',
  styleUrl: './legal.scss',
  templateUrl: './imprint.html',
})
export class Imprint {}
