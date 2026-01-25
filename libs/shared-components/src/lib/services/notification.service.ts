import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

/**
 * Service for displaying notifications to the user
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new Subject<Notification>();
  private dismissals$ = new Subject<string>();
  
  // Observable for new notifications
  public notifications = this.notifications$.asObservable();
  
  // Observable for dismissed notifications
  public dismissals = this.dismissals$.asObservable();

  private activeNotifications = new Map<string, NodeJS.Timeout>();

  /**
   * Show a success notification
   */
  success(message: string, duration: number = 3000): string {
    return this.show({
      id: this.generateId(),
      type: 'success',
      message,
      duration
    });
  }

  /**
   * Show an error notification
   */
  error(message: string, duration: number = 5000): string {
    return this.show({
      id: this.generateId(),
      type: 'error',
      message,
      duration
    });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, duration: number = 4000): string {
    return this.show({
      id: this.generateId(),
      type: 'warning',
      message,
      duration
    });
  }

  /**
   * Show an info notification
   */
  info(message: string, duration: number = 3000): string {
    return this.show({
      id: this.generateId(),
      type: 'info',
      message,
      duration
    });
  }

  /**
   * Show a notification with an action button
   */
  withAction(
    type: NotificationType,
    message: string,
    actionLabel: string,
    actionCallback: () => void,
    duration: number = 5000
  ): string {
    return this.show({
      id: this.generateId(),
      type,
      message,
      duration,
      action: {
        label: actionLabel,
        callback: actionCallback
      }
    });
  }

  /**
   * Show a notification
   */
  private show(notification: Notification): string {
    this.notifications$.next(notification);

    // Auto-dismiss after duration
    if (notification.duration && notification.duration > 0) {
      const timeout = setTimeout(() => {
        this.dismiss(notification.id);
      }, notification.duration);
      
      this.activeNotifications.set(notification.id, timeout);
    }

    return notification.id;
  }

  /**
   * Dismiss a notification
   */
  dismiss(id: string): void {
    // Clear timeout if exists
    const timeout = this.activeNotifications.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.activeNotifications.delete(id);
    }

    this.dismissals$.next(id);
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    this.activeNotifications.forEach((timeout, id) => {
      clearTimeout(timeout);
      this.dismissals$.next(id);
    });
    this.activeNotifications.clear();
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.dismissAll();
    this.notifications$.complete();
    this.dismissals$.complete();
  }
}
