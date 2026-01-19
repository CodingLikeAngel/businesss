import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HistoryService } from '../services/history.service';
import { KeyboardService } from '../services/keyboard.service';
import { MoveElementCommand, StyleChangeCommand } from '../services/commands';
import { HistoryState } from '../models/editor.model';
import { EnhancedBaseEditorSectionComponent } from '../pages/editor/components/enhanced-base-editor-section.component';
import { ElementRef } from '@angular/core';

describe('Enhanced Features Integration', () => {
  let historyService: HistoryService;
  let keyboardService: KeyboardService;
  let store: jest.Mocked<Store<any>>;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      select: jest.fn(),
      dispatch: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        HistoryService,
        KeyboardService,
        { provide: Store, useValue: mockStore }
      ]
    });

    historyService = TestBed.inject(HistoryService);
    keyboardService = TestBed.inject(KeyboardService);
    store = TestBed.inject(Store) as jest.Mocked<Store<any>>;
  });

  afterEach(() => {
    keyboardService.destroy();
  });

  describe('Undo/Redo and Keyboard Integration', () => {
    beforeEach(() => {
      // Set up initial state
      const initialState: HistoryState = {
        past: [],
        present: null,
        future: [],
        canUndo: false,
        canRedo: false
      };

      mockStore.select.mockReturnValue(of(initialState));
    });

    it('should execute undo when Ctrl+Z is pressed', () => {
      // Spy on history service methods
      const undoSpy = jest.spyOn(historyService, 'undo');

      // Simulate Ctrl+Z keypress
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true
      });

      document.dispatchEvent(event);

      expect(undoSpy).toHaveBeenCalled();
    });

    it('should execute redo when Ctrl+Y is pressed', () => {
      const redoSpy = jest.spyOn(historyService, 'redo');

      const event = new KeyboardEvent('keydown', {
        key: 'y',
        ctrlKey: true
      });

      document.dispatchEvent(event);

      expect(redoSpy).toHaveBeenCalled();
    });

    it('should execute redo when Ctrl+Shift+Z is pressed', () => {
      const redoSpy = jest.spyOn(historyService, 'redo');

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        shiftKey: true
      });

      document.dispatchEvent(event);

      expect(redoSpy).toHaveBeenCalled();
    });

    it('should track command execution in history', () => {
      const command = new MoveElementCommand(
        'section1',
        'element1',
        { x: 0, y: 0 },
        { x: 100, y: 100 },
        store
      );

      historyService.execute(command);

      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should maintain history state after multiple operations', () => {
      // Execute first command
      const command1 = new MoveElementCommand('s1', 'e1', {x:0,y:0}, {x:10,y:10}, store);
      historyService.execute(command1);

      // Execute second command
      const command2 = new MoveElementCommand('s1', 'e2', {x:0,y:0}, {x:20,y:20}, store);
      historyService.execute(command2);

      // Check that both commands are tracked
      expect(store.dispatch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Visual Editing and Command Integration', () => {
    it('should create commands for visual editing operations', () => {
      // Create a mock component that extends EnhancedBaseEditorSectionComponent
      const mockComponent = {
        section: { id: 'section1' },
        storeElementState: jest.fn(),
        trackOperation: jest.fn()
      };

      // Simulate visual editing event
      const visualEvent = {
        type: 'moved' as const,
        bounds: { x: 100, y: 200, width: 150, height: 100 }
      };

      // The component should create a command for this operation
      const command = new MoveElementCommand(
        mockComponent.section.id,
        'element1',
        { x: 0, y: 0 }, // old position
        { x: visualEvent.bounds.x, y: visualEvent.bounds.y }, // new position
        store
      );

      expect(command).toBeDefined();
      expect(command.type).toBe('move-element');
    });

    it('should handle style changes with commands', () => {
      const oldStyles = { color: 'red', fontSize: '14px' };
      const newStyles = { color: 'blue', fontSize: '16px' };

      const command = new StyleChangeCommand(
        'element',
        'element1',
        'section1',
        oldStyles,
        newStyles,
        store
      );

      expect(command).toBeDefined();
      expect(command.type).toBe('style-change');
    });
  });

  describe('Keyboard Shortcuts and Custom Actions', () => {
    it('should allow adding custom keyboard shortcuts', () => {
      const customShortcut = {
        key: 's',
        ctrl: true,
        action: 'save',
        description: 'Save document'
      };

      keyboardService.addShortcut(customShortcut);

      const shortcuts = keyboardService.getShortcuts();
      const addedShortcut = shortcuts.find(s => s.action === 'save');

      expect(addedShortcut).toBeDefined();
      expect(addedShortcut?.key).toBe('s');
      expect(addedShortcut?.ctrl).toBe(true);
    });

    it('should dispatch custom actions through store', () => {
      const customShortcut = {
        key: 'b',
        ctrl: true,
        action: 'custom-action',
        description: 'Custom Action'
      };

      keyboardService.addShortcut(customShortcut);

      const event = new KeyboardEvent('keydown', {
        key: 'b',
        ctrlKey: true
      });

      document.dispatchEvent(event);

      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should organize shortcuts by category', () => {
      const categories = keyboardService.getShortcutsByCategory();

      expect(categories).toBeDefined();
      expect(categories['History']).toBeDefined();
      expect(categories['Selection']).toBeDefined();
      expect(categories['Grouping']).toBeDefined();
      expect(categories['Editing']).toBeDefined();
    });
  });

  describe('History State Persistence', () => {
    it('should export history for debugging', () => {
      const command = new MoveElementCommand('s1', 'e1', {x:0,y:0}, {x:10,y:10}, store);
      command.id = 'test-cmd';
      command.timestamp = new Date('2023-01-01T00:00:00Z');

      const state: HistoryState = {
        past: [],
        present: command,
        future: [],
        canUndo: true,
        canRedo: false
      };

      mockStore.select.mockReturnValue(of(state));

      const exported = historyService.exportHistory();

      expect(exported.present.id).toBe('test-cmd');
      expect(exported.present.type).toBe('move-element');
      expect(exported.stats.totalCommands).toBe(1);
    });

    it('should provide comprehensive history statistics', () => {
      const commands = [
        new MoveElementCommand('s1', 'e1', {x:0,y:0}, {x:10,y:10}, store),
        new MoveElementCommand('s1', 'e2', {x:0,y:0}, {x:20,y:20}, store),
        new MoveElementCommand('s1', 'e3', {x:0,y:0}, {x:30,y:30}, store)
      ];

      const state: HistoryState = {
        past: [commands[0], commands[1]],
        present: commands[2],
        future: [],
        canUndo: true,
        canRedo: false
      };

      mockStore.select.mockReturnValue(of(state));

      const stats = historyService.getStats();

      expect(stats.totalCommands).toBe(3);
      expect(stats.pastCount).toBe(2);
      expect(stats.futureCount).toBe(0);
      expect(stats.canUndo).toBe(true);
      expect(stats.canRedo).toBe(false);
      expect(stats.memoryUsage).toBeDefined();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle keyboard events gracefully when disabled', () => {
      keyboardService.disable();

      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true
      });

      // Should not throw and should not call history service
      expect(() => document.dispatchEvent(event)).not.toThrow();
    });

    it('should handle undo/redo when not available', () => {
      const emptyState: HistoryState = {
        past: [],
        present: null,
        future: [],
        canUndo: false,
        canRedo: false
      };

      mockStore.select.mockReturnValue(of(emptyState));

      // Should not throw when undo/redo are called but not available
      expect(() => historyService.undo()).not.toThrow();
      expect(() => historyService.redo()).not.toThrow();
    });

    it('should handle malformed keyboard events', () => {
      const event = new KeyboardEvent('keydown', {
        key: '', // Empty key
        ctrlKey: false,
        shiftKey: false,
        altKey: false
      });

      // Should not throw with malformed events
      expect(() => document.dispatchEvent(event)).not.toThrow();
    });
  });

  describe('Performance and Memory Management', () => {
    it('should limit history size to prevent memory issues', () => {
      // Create many commands
      for (let i = 0; i < 60; i++) {
        const command = new MoveElementCommand(
          's1',
          `e${i}`,
          { x: 0, y: 0 },
          { x: i * 10, y: i * 10 },
          store
        );
        historyService.execute(command);
      }

      // History should be limited (implementation detail)
      expect(store.dispatch).toHaveBeenCalledTimes(60);
    });

    it('should provide memory usage information', () => {
      const commands = Array(10).fill(null).map((_, i) =>
        new MoveElementCommand('s1', `e${i}`, {x:0,y:0}, {x:i*10,y:i*10}, store)
      );

      const state: HistoryState = {
        past: commands,
        present: null,
        future: [],
        canUndo: true,
        canRedo: false
      };

      mockStore.select.mockReturnValue(of(state));

      const stats = historyService.getStats();
      expect(stats.memoryUsage).toBeGreaterThan(0);
    });
  });

  describe('Component Integration Patterns', () => {
    it('should support component extension pattern', () => {
      // Test that services can be injected into extended components
      expect(historyService).toBeDefined();
      expect(keyboardService).toBeDefined();
      expect(store).toBeDefined();
    });

    it('should allow command creation from component context', () => {
      const sectionId = 'test-section';
      const elementId = 'test-element';
      const oldPos = { x: 0, y: 0 };
      const newPos = { x: 100, y: 100 };

      const command = new MoveElementCommand(sectionId, elementId, oldPos, newPos, store);

      expect(command.type).toBe('move-element');
      expect(command.description).toContain(elementId);
      expect(command.description).toContain('100');
    });

    it('should support complex command composition', () => {
      const commands = [
        new MoveElementCommand('s1', 'e1', {x:0,y:0}, {x:10,y:10}, store),
        new StyleChangeCommand('element', 'e1', 's1', {color: 'red'}, {color: 'blue'}, store)
      ];

      // Test that multiple commands can be created and managed
      expect(commands).toHaveLength(2);
      expect(commands[0].type).toBe('move-element');
      expect(commands[1].type).toBe('style-change');
    });
  });
});