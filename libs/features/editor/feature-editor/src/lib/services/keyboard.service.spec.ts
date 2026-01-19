import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { KeyboardService, KeyboardShortcut } from './keyboard.service';
import { HistoryService } from './history.service';

describe('KeyboardService', () => {
  let service: KeyboardService;
  let store: jasmine.SpyObj<Store<any>>;
  let historyService: jasmine.SpyObj<HistoryService>;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      dispatch: jasmine.createSpy('dispatch')
    };

    const mockHistoryService = {
      undo: jasmine.createSpy('undo'),
      redo: jasmine.createSpy('redo')
    };

    TestBed.configureTestingModule({
      providers: [
        KeyboardService,
        { provide: Store, useValue: mockStore },
        { provide: HistoryService, useValue: mockHistoryService }
      ]
    });

    service = TestBed.inject(KeyboardService);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store<any>>;
    historyService = TestBed.inject(HistoryService) as jasmine.SpyObj<HistoryService>;
  });

  afterEach(() => {
    // Clean up event listeners
    service.destroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should be enabled by default', () => {
      expect(service.isShortcutsEnabled()).toBeTrue();
    });

    it('should have default shortcuts loaded', () => {
      const shortcuts = service.getShortcuts();
      expect(shortcuts.length).toBeGreaterThan(0);

      // Check for essential shortcuts
      const undoShortcut = shortcuts.find(s => s.action === 'undo');
      const redoShortcut = shortcuts.find(s => s.action === 'redo');

      expect(undoShortcut).toBeDefined();
      expect(redoShortcut).toBeDefined();
    });
  });

  describe('Shortcut Management', () => {
    it('should enable and disable shortcuts', () => {
      service.disable();
      expect(service.isShortcutsEnabled()).toBeFalse();

      service.enable();
      expect(service.isShortcutsEnabled()).toBeTrue();
    });

    it('should add custom shortcut', () => {
      const customShortcut: KeyboardShortcut = {
        key: 's',
        ctrl: true,
        action: 'save',
        description: 'Save document'
      };

      const initialCount = service.getShortcuts().length;
      service.addShortcut(customShortcut);

      const shortcuts = service.getShortcuts();
      expect(shortcuts.length).toBe(initialCount + 1);

      const addedShortcut = shortcuts.find(s => s.action === 'save');
      expect(addedShortcut).toBeDefined();
      expect(addedShortcut?.key).toBe('s');
      expect(addedShortcut?.ctrl).toBeTrue();
    });

    it('should replace existing shortcut with same key combination', () => {
      const shortcut1: KeyboardShortcut = {
        key: 'x',
        ctrl: true,
        action: 'cut',
        description: 'Cut'
      };

      const shortcut2: KeyboardShortcut = {
        key: 'x',
        ctrl: true,
        action: 'custom-cut',
        description: 'Custom Cut'
      };

      service.addShortcut(shortcut1);
      service.addShortcut(shortcut2);

      const shortcuts = service.getShortcuts();
      const cutShortcuts = shortcuts.filter(s => s.key === 'x' && s.ctrl);

      // Should only have one shortcut with Ctrl+X
      expect(cutShortcuts.length).toBe(1);
      expect(cutShortcuts[0].action).toBe('custom-cut');
    });

    it('should remove shortcut', () => {
      const shortcut: KeyboardShortcut = {
        key: 'y',
        ctrl: true,
        action: 'custom-action',
        description: 'Custom Action'
      };

      service.addShortcut(shortcut);
      const countAfterAdd = service.getShortcuts().length;

      service.removeShortcut('y', true); // Remove Ctrl+Y

      const countAfterRemove = service.getShortcuts().length;
      expect(countAfterRemove).toBe(countAfterAdd - 1);

      const removedShortcut = service.getShortcuts().find(s => s.action === 'custom-action');
      expect(removedShortcut).toBeUndefined();
    });

    it('should get shortcuts by category', () => {
      const categories = service.getShortcutsByCategory();

      expect(categories).toBeDefined();
      expect(categories['History']).toBeDefined();
      expect(categories['Selection']).toBeDefined();
      expect(categories['Grouping']).toBeDefined();
      expect(categories['Editing']).toBeDefined();

      // History category should contain undo/redo
      const historyActions = categories['History'].map(s => s.action);
      expect(historyActions).toContain('undo');
      expect(historyActions).toContain('redo');
    });
  });

  describe('Shortcut Display', () => {
    it('should generate display string for shortcuts', () => {
      const shortcuts: KeyboardShortcut[] = [
        { key: 'z', ctrl: true, action: 'undo', description: 'Undo' },
        { key: 'y', ctrl: true, shift: true, action: 'redo', description: 'Redo' },
        { key: 'a', ctrl: true, alt: true, action: 'select-all', description: 'Select All' },
        { key: 'Escape', action: 'clear', description: 'Clear' }
      ];

      const expected = ['Ctrl+Z', 'Ctrl+Shift+Y', 'Ctrl+Alt+A', 'Escape'];

      shortcuts.forEach((shortcut, index) => {
        expect(service.getShortcutDisplay(shortcut)).toBe(expected[index]);
      });
    });

    it('should handle uppercase keys', () => {
      const shortcut: KeyboardShortcut = {
        key: 'a',
        ctrl: true,
        action: 'test',
        description: 'Test'
      };

      expect(service.getShortcutDisplay(shortcut)).toBe('Ctrl+A');
    });
  });

  describe('Keyboard Event Handling', () => {
    let mockEvent: jasmine.SpyObj<KeyboardEvent>;

    beforeEach(() => {
      mockEvent = jasmine.createSpyObj('KeyboardEvent', ['preventDefault', 'stopPropagation']);
      mockEvent.key = 'z';
      mockEvent.ctrlKey = true;
      mockEvent.shiftKey = false;
      mockEvent.altKey = false;
    });

    it('should handle undo shortcut (Ctrl+Z)', () => {
      // Manually trigger keydown event
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        shiftKey: false,
        altKey: false
      });

      document.dispatchEvent(event);

      expect(historyService.undo).toHaveBeenCalled();
    });

    it('should handle redo shortcut (Ctrl+Y)', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'y',
        ctrlKey: true,
        shiftKey: false,
        altKey: false
      });

      document.dispatchEvent(event);

      expect(historyService.redo).toHaveBeenCalled();
    });

    it('should handle redo shortcut (Ctrl+Shift+Z)', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        shiftKey: true,
        altKey: false
      });

      document.dispatchEvent(event);

      expect(historyService.redo).toHaveBeenCalled();
    });

    it('should dispatch custom shortcut actions', () => {
      const customShortcut: KeyboardShortcut = {
        key: 's',
        ctrl: true,
        action: 'save',
        description: 'Save'
      };

      service.addShortcut(customShortcut);

      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true
      });

      document.dispatchEvent(event);

      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should prevent default for shortcuts with preventDefault true', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true
      });

      spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default for shortcuts with preventDefault false', () => {
      const customShortcut: KeyboardShortcut = {
        key: 'h',
        action: 'help',
        description: 'Help',
        preventDefault: false
      };

      service.addShortcut(customShortcut);

      const event = new KeyboardEvent('keydown', {
        key: 'h'
      });

      spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should ignore events when disabled', () => {
      service.disable();

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true
      });

      document.dispatchEvent(event);

      expect(historyService.undo).not.toHaveBeenCalled();
    });

    it('should ignore unmatched key combinations', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'x',
        ctrlKey: false,
        shiftKey: false,
        altKey: false
      });

      document.dispatchEvent(event);

      expect(historyService.undo).not.toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should clean up event listeners on destroy', () => {
      spyOn(document, 'removeEventListener');

      service.destroy();

      expect(document.removeEventListener).toHaveBeenCalledWith('keydown', jasmine.any(Function));
    });
  });

  describe('Edge Cases', () => {
    it('should handle case insensitive key matching', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'Z', // Uppercase
        ctrlKey: true
      });

      document.dispatchEvent(event);

      expect(historyService.undo).toHaveBeenCalled();
    });

    it('should handle multiple modifiers correctly', () => {
      const customShortcut: KeyboardShortcut = {
        key: 'b',
        ctrl: true,
        shift: true,
        alt: true,
        action: 'complex',
        description: 'Complex shortcut'
      };

      service.addShortcut(customShortcut);

      const event = new KeyboardEvent('keydown', {
        key: 'b',
        ctrlKey: true,
        shiftKey: true,
        altKey: true
      });

      document.dispatchEvent(event);

      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should not match partial modifier combinations', () => {
      const customShortcut: KeyboardShortcut = {
        key: 'b',
        ctrl: true,
        shift: true,
        alt: true,
        action: 'complex',
        description: 'Complex shortcut'
      };

      service.addShortcut(customShortcut);

      // Missing alt key
      const event = new KeyboardEvent('keydown', {
        key: 'b',
        ctrlKey: true,
        shiftKey: true,
        altKey: false
      });

      document.dispatchEvent(event);

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});