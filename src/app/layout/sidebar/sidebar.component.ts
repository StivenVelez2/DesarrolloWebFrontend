//este archivo es el modelo de usuario que se utiliza en la aplicacion, contiene las propiedades que se utilizan para autenticar al usuario y su informacion personal
import {
  Router,
  NavigationEnd,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import { AuthService } from '@core';
import { Renderer2 } from '@angular/core';
import { RouteInfo } from './sidebar.metadata';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbar } from 'ngx-scrollbar';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

//importa el decorador Component de Angular, que se utiliza para definir un componente
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    NgScrollbar,
    MatButtonModule,
    RouterLink,
    MatTooltipModule,
    RouterLinkActive,
    NgClass,
  ],
})

// SidebarComponent es una clase que representa el componente de la barra lateral de la aplicación
export class SidebarComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  public sidebarItems!: RouteInfo[];
  public innerHeight?: number;
  public bodyTag!: HTMLElement;
  listMaxHeight?: string;
  listMaxWidth?: string;
  userFullName?: string;
  userImg?: string;
  userType?: string;
  headerHeight = 60;
  currentRoute?: string;

  userLogged: string | undefined = '';
  
  //es el constructor de la clase SidebarComponent, se utiliza para inyectar dependencias y inicializar propiedades
  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    private readonly _renderer: Renderer2,
    public readonly _elementRef: ElementRef,
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _domSanitizer: DomSanitizer
  ) {
    super();
    this.subs.sink = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this._renderer.removeClass(this._document.body, 'overlay-open');
      }
    });
     const roleInfo = this._authService.getRoleInfoByToken();
     this.userLogged = roleInfo ? roleInfo.roleName : undefined;
  }
  
  //este método se ejecuta cuando el componente se destruye, se utiliza para limpiar recursos y suscripciones
  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }

  // Este método se ejecuta cuando el mouse hace clic en cualquier parte del documento
  // y se utiliza para cerrar el menú lateral si el clic no está dentro del elemento de la barra lateral
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this._renderer.removeClass(this._document.body, 'overlay-open');
    }
  }

  // Este método se utiliza para alternar la clase "active" en el elemento padre del evento
  callToggleMenu(event: Event, length: number): void {
    if (!this.isValidLength(length) || !this.isValidEvent(event)) {
      return;
    }

    const parentElement = (event.target as HTMLElement).closest('li');
    if (!parentElement) {
      return;
    }

    const activeClass = parentElement.classList.contains('active');

    if (activeClass) {
      this._renderer.removeClass(parentElement, 'active');
    } else {
      this._renderer.addClass(parentElement, 'active');
    }
  }

  // Este método se utiliza para validar la longitud del elemento
  private isValidLength(length: number): boolean {
    return length > 0;
  }

  // Este método se utiliza para validar si el evento es válido
  private isValidEvent(event: Event): boolean {
    return event && event.target instanceof HTMLElement;
  }

  // Este método se utiliza para sanitizar el HTML y evitar problemas de seguridad
  sanitizeHtml(html: string): SafeHtml {
    return this._domSanitizer.bypassSecurityTrustHtml(html);
  }

  // Este método se ejecuta cuando el componente se inicializa, se utiliza para cargar los elementos de la barra lateral y establecer el tamaño del menú
  ngOnInit() {
     const rolAuthority = this._authService.getAuthFromSessionStorage().rol_id;
     this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem?.rolAuthority.includes(rolAuthority));
     this.initLeftSidebar();
     this.bodyTag = this._document.body;
  }

  // Este método se ejecuta cuando el componente se destruye, se utiliza para limpiar recursos y suscripciones
  initLeftSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1025) {
      this._renderer.addClass(this._document.body, 'ls-closed');
    } else {
      this._renderer.removeClass(this._document.body, 'ls-closed');
    }
  }

  // Este método se utiliza para cerrar el menú lateral
  mouseHover() {
    const body = this._elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this._renderer.addClass(this._document.body, 'side-closed-hover');
      this._renderer.removeClass(this._document.body, 'submenu-closed');
    }
  }

  // Este método se utiliza para cerrar el menú lateral cuando el mouse sale del área
  mouseOut() {
    const body = this._elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this._renderer.removeClass(this._document.body, 'side-closed-hover');
      this._renderer.addClass(this._document.body, 'submenu-closed');
    }
  }
}
