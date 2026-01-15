import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, delay } from 'rxjs/operators';
import {
  showNotification,
  hideNotification,
  clearNotifications,
  setError,
  clearError
} from '../actions/ui.actions';

@Injectable()
export class UIEffects {

  constructor(private actions$: Actions) {}

  // Auto-hide notifications after 5 seconds
  autoHideNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(showNotification),
      mergeMap(({ notificationType, title, message, action }) => {
        const notificationId = `notification-${Date.now()}`;
        // Auto-hide success and info notifications after 5 seconds
        if (notificationType === 'success' || notificationType === 'info') {
          return of({ type: '[UI] Auto Hide Notification', notificationId }).pipe(
            delay(5000),
            map(() => hideNotification({ notificationId }))
          );
        }
        // Keep error and warning notifications until manually dismissed
        return of({ type: '[UI] Notification Shown', notificationId });
      })
    )
  );

  // Auto-clear errors after 10 seconds
  autoClearError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setError),
      mergeMap(() =>
        of(clearError()).pipe(
          delay(10000) // Clear error after 10 seconds
        )
      )
    )
  );

  // Handle notification actions (for future enhancement)
  handleNotificationAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(showNotification),
      tap(({ action }) => {
        if (action) {
          // Execute notification action callback
          try {
            action.callback();
          } catch (error) {
            console.error('Error executing notification action:', error);
          }
        }
      })
    ),
    { dispatch: false }
  );

  // Log errors for debugging
  logError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setError),
      tap(({ error }) => {
        console.error('Editor Error:', error);
        // TODO: Send error to logging service or analytics
      })
    ),
    { dispatch: false }
  );

  // Clear all notifications when requested
  clearAllNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clearNotifications),
      tap(() => {
        // Additional cleanup if needed
        console.log('All notifications cleared');
      })
    ),
    { dispatch: false }
  );
}