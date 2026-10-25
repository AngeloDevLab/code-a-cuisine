import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../shared/button/button';
import { LegalLinks } from '../../shared/legal-links/legal-links';
import { Logo } from '../../shared/logo/logo';

/** Landing page that introduces the app and leads to the generator. */
@Component({
  imports: [Button, LegalLinks, Logo, NgOptimizedImage, RouterLink],
  selector: 'app-hero',
  styleUrl: './hero.scss',
  templateUrl: './hero.html',
})
export class Hero {
  protected readonly imageSizes = '(min-width: 1440px) 470px, calc(15.18vw + 252px)';
  protected readonly responsive = { responsive: true };
}
