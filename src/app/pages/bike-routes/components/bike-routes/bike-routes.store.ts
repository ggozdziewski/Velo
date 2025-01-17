import { Injectable, inject } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { EMPTY, catchError, switchMap, tap } from 'rxjs';

import { BikeRoutesResponse } from '@models/bike-routes.interface';
import { BikeRouteService } from '@services/bike-route.service';

@Injectable()
export class BikeRoutesComponentStore extends ComponentStore<{ data: BikeRoutesResponse[] }> implements OnStoreInit {
  #service = inject(BikeRouteService);

  readonly dataSignal = this.selectSignal(state => state.data);

  readonly getAllBikeRoutes = this.effect(trigger$ =>
    trigger$.pipe(
      switchMap(() =>
        this.#service.getAllBikeRoutes().pipe(
          tap({
            next: data => this.patchState({ data }),
            error: e => console.error(e),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  ngrxOnStoreInit(): void {
    this.getAllBikeRoutes();
  }

  constructor() {
    super({ data: [] });
  }
}
