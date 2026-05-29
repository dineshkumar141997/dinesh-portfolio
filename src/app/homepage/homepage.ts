import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  signal,
  afterNextRender,
} from '@angular/core';

export type NavSectionId = 'about' | 'skills' | 'projects' | 'contact';

interface Project {
  title: string;
  description: string;
  stack: string[];
  link?: string;
}

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly themeStorageKey = 'portfolio-theme';

  /** Section order matters: last section whose top is above the offset wins while scrolling. */
  private readonly navSectionIds: readonly NavSectionId[] = [
    'about',
    'skills',
    'projects',
    'contact',
  ];

  readonly activeNav = signal<NavSectionId | null>(null);
  readonly theme = signal<'dark' | 'light'>('dark');
  readonly year = new Date().getFullYear();
  readonly skills = [
    'Angular version 15+',
    'Angular (AngularJS → 18)',
    'TypeScript',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Ionic',
    'Angular Material',
    'NgRx',
    'Git',
    'RxJS',
    'REST APIs',
    'Ajax',
    'Webpack',
    'Nginx',
    'Postman',
  ];

  readonly projects: Project[] = [
    {
      title: 'OptiPrime — Aravind Eye Hospital',
      description:
        'Healthcare e-commerce front end: scalable Angular UI, close work with UI/UX, product and order flows via APIs, and performance tuning for load time and scale.',
      stack: ['Angular', 'REST', 'Healthcare'],
    },
    {
      title: 'Freedom RS — Billing software',
      description:
        'Billing product in Angular with real-time invoice generation and an Angular Material–based interface for a clear, modern workflow.',
      stack: ['Angular', 'Angular Material', 'Real-time'],
    },
    {
      title: 'DocPanel — USA',
      description:
        'Large AngularJS → Angular 18 migration: refactored components and services, NgRx for state, and real-time data sync for a smoother user experience.',
      stack: ['Angular 18', 'NgRx', 'Migration'],
    },
    {
      title: 'TVS - HRMS',
      description:
        'HRMS for TVS Motor Company Ltd. - A comprehensive HR management system for TVS Motor Company Ltd. with features like employee management, leave management, attendance management, payroll management, and more. This project is a part of the TVS Motor Company Ltd. HRMS project.',
      stack: ['Angular 18', 'Angular Material', 'REST APIs','RxJS (State Management with Observables & BehaviorSubject)'],
    },
    {
      title: 'BMS (Service management) - UK',
      description:
        'BMS (Service management) for UK - A comprehensive BMS (Service management) system for UK with features like service management, service request management, service order management, service invoice management, and more. This project is a part of the UK BMS (Service management) project.',
      stack: ['Angular 18', 'Angular Material', 'REST APIs','RxJS (State Management with Observables & BehaviorSubject)'],
    },
    {
      title: 'Nitro (Service management) - UK',
      description:
        'Nitro (Service management) for UK - A comprehensive Nitro (Service management) system for UK with features like service management, service request management, service order management, service invoice management, and more. This project is a part of the UK Nitro (Service management) project.',
      stack: ['Angular 18', 'Angular Material', 'REST APIs','RxJS (State Management with Observables & BehaviorSubject)'],
    },
    {
      title: 'CustomerPortalService (Service management) - UK',
      description:
        'CustomerPortalService (Service management) for UK - A comprehensive CustomerPortalService (Service management) system for UK with features like service management, service request management, service order management, service invoice management, and more. This project is a part of the UK CustomerPortalService (Service management) project.',
      stack: ['Angular 18', 'Angular Material', 'REST APIs','RxJS (State Management with Observables & BehaviorSubject)'],
    },
    {
      title: 'BMS Mobile App (Service management) - UK',
      description:
        'BMS Mobile App for UK - A comprehensive BMS (Service management) system for UK with features like service management, service request management, service order management, service invoice management, and more. This project is a part of the UK BMS (Service management) project.',
      stack: ['Ionic 8', 'REST APIs','Android','IOS','RxJS (State Management with Observables & BehaviorSubject)','Offline Storage (LocalStorage / IndexedDB)'],
    },
  ];

  constructor() {
    afterNextRender(() => {
      const win = this.doc.defaultView;
      if (!win) return;

      this.initializeTheme();

      const onScroll = () => this.syncActiveFromScroll();
      win.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => win.removeEventListener('scroll', onScroll));

      const hash = win.location.hash.replace(/^#/, '');
      if (this.isNavId(hash)) {
        this.activeNav.set(hash);
      }
      onScroll();
    });
  }

  onNavActivate(id: NavSectionId): void {
    this.activeNav.set(id);
    queueMicrotask(() => this.syncActiveFromScroll());
  }

  isActiveNav(id: NavSectionId): boolean {
    return this.activeNav() === id;
  }

  toggleTheme(): void {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
  }

  private isNavId(value: string): value is NavSectionId {
    return (this.navSectionIds as readonly string[]).includes(value);
  }

  private syncActiveFromScroll(): void {
    const win = this.doc.defaultView;
    if (!win) return;

    const offset = 72;
    let current: NavSectionId | null = null;
    for (const id of this.navSectionIds) {
      const el = this.doc.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= offset) {
        current = id;
      }
    }
    this.activeNav.set(current);
  }

  private initializeTheme(): void {
    const win = this.doc.defaultView;
    if (!win) return;

    const storedTheme = win.localStorage.getItem(this.themeStorageKey);
    if (storedTheme === 'dark' || storedTheme === 'light') {
      this.applyTheme(storedTheme, false);
      return;
    }

    const prefersLight = win.matchMedia?.('(prefers-color-scheme: light)').matches ?? false;
    this.applyTheme(prefersLight ? 'light' : 'dark', false);
  }

  private applyTheme(theme: 'dark' | 'light', persist = true): void {
    this.theme.set(theme);
    this.doc.documentElement.setAttribute('data-theme', theme);
    if (persist) {
      this.doc.defaultView?.localStorage.setItem(this.themeStorageKey, theme);
    }
  }
}
