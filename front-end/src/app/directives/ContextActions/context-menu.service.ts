import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContextmenuOverlayConfig } from './interfaces';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Directionality } from '@angular/cdk/bidi';
import { CONTEXT_MENU_DIRECTION } from './direction.token';
import { ContextMenuComponent } from './context-menu/context-menu.component';
@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  private direction: Directionality;

  constructor(
    private injector: Injector,
    private overlay: Overlay,
    private userPreferenceService: UserPreferencesService
  ) {
    this.userPreferenceService.select('textOrientation').subscribe(textOrientation => {
      this.direction = textOrientation;
    });
  }

  open(config: ContextmenuOverlayConfig) {
    const overlay = this.createOverlay(config);
    const overlayRef = new ContextMenuOverlayRef(overlay);

    this.attachDialogContainer(overlay, overlayRef);

    return overlayRef;
  }

  private createOverlay(config: ContextmenuOverlayConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlay: OverlayRef, contextmenuOverlayRef: ContextMenuOverlayRef) {
    const injector = this.createInjector(contextmenuOverlayRef);

    const containerPortal = new ComponentPortal(ContextMenuComponent, null, injector);
    const containerRef: ComponentRef<ContextMenuComponent> = overlay.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(contextmenuOverlayRef: ContextMenuOverlayRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(ContextMenuOverlayRef, contextmenuOverlayRef);
    injectionTokens.set(CONTEXT_MENU_DIRECTION, this.direction);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private getOverlayConfig(config: ContextmenuOverlayConfig): OverlayConfig {
    const positionStrategy: PositionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(
        <HTMLElement>config.source.srcElement || <HTMLElement>config.source.target
      )
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        }
      ]);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy,
      direction: this.direction
    });

    return overlayConfig;
  }
}
