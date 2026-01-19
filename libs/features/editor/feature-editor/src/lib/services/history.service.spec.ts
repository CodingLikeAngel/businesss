import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HistoryService } from './history.service';
import { HistoryState } from '../models/editor.model';
import { MoveElementCommand } from './commands';

describe('HistoryService', () => {
  let service: HistoryService;
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
        { provide: Store, useValue: mockStore }
      ]
    });

    service = TestBed.inject(HistoryService);
    store = TestBed.inject(Store) as jest.Mocked<Store<any>>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty history', () => {
      const initialState: HistoryState = {
        past: [],
        present: null,
        future: [],
        canUndo: false,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(initialState));

      service = new HistoryService(store);

      expect(service.canUndo).toBe(false);
      expect(service.canRedo).toBe(false);
    });
  });

  describe('Command Execution', () => {
    it('should execute a command and update history', () => {
      const command = new MoveElementCommand(
        'section1',
        'element1',
        { x: 0, y: 0 },
        { x: 100, y: 100 },
        store
      );

      service.execute(command);

      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should track command execution in history state', (done) => {
      const command = new MoveElementCommand(
        'section1',
        'element1',
        { x: 0, y: 0 },
        { x: 100, y: 100 },
        store
      );

      // Mock store select to return updated state
      const updatedState: HistoryState = {
        past: [],
        present: command,
        future: [],
        canUndo: true,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(updatedState));

      service.historyState.subscribe(state => {
        expect(state.present).toBe(command);
        expect(state.canUndo).toBeTrue();
        done();
      });
    });
  });

  describe('Undo/Redo Operations', () => {
    beforeEach(() => {
      const stateWithHistory: HistoryState = {
        past: [new MoveElementCommand('s1', 'e1', {x:0,y:0}, {x:10,y:10}, store)],
        present: new MoveElementCommand('s1', 'e2', {x:0,y:0}, {x:20,y:20}, store),
        future: [],
        canUndo: true,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(stateWithHistory));
    });

    it('should perform undo when available', () => {
      service.undo();
      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should perform redo when available', () => {
      // Set up state with future commands
      const stateWithFuture: HistoryState = {
        past: [new MoveElementCommand('s1', 'e1', {x:0,y:0}, {x:10,y:10}, store)],
        present: null,
        future: [new MoveElementCommand('s1', 'e2', {x:0,y:0}, {x:20,y:20}, store)],
        canUndo: true,
        canRedo: true
      };

      mockStore.select.and.returnValue(of(stateWithFuture));

      service = new HistoryService(store);
      service.redo();

      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should not perform undo when not available', () => {
      const emptyState: HistoryState = {
        past: [],
        present: null,
        future: [],
        canUndo: false,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(emptyState));
      service = new HistoryService(store);

      service.undo();

      // Should not dispatch if cannot undo
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('History Management', () => {
    it('should clear history', () => {
      service.clear();
      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should get last command', () => {
      const command = new MoveElementCommand('s1', 'e1', {x:0,y:0}, {x:10,y:10}, store);
      const state: HistoryState = {
        past: [],
        present: command,
        future: [],
        canUndo: true,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(state));
      service = new HistoryService(store);

      expect(service.getLastCommand()).toBe(command);
    });

    it('should return null when no present command', () => {
      const state: HistoryState = {
        past: [],
        present: null,
        future: [],
        canUndo: false,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(state));
      service = new HistoryService(store);

      expect(service.getLastCommand()).toBeNull();
    });

    it('should get past commands', () => {
      const pastCommands = [
        new MoveElementCommand('s1', 'e1', {x:0,y:0}, {x:10,y:10}, store),
        new MoveElementCommand('s1', 'e2', {x:0,y:0}, {x:20,y:20}, store)
      ];

      const state: HistoryState = {
        past: pastCommands,
        present: null,
        future: [],
        canUndo: true,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(state));
      service = new HistoryService(store);

      const result = service.getPastCommands();
      expect(result).toEqual(pastCommands);
      expect(result).not.toBe(pastCommands); // Should return copy
    });

    it('should get future commands', () => {
      const futureCommands = [
        new MoveElementCommand('s1', 'e3', {x:0,y:0}, {x:30,y:30}, store)
      ];

      const state: HistoryState = {
        past: [],
        present: null,
        future: futureCommands,
        canUndo: false,
        canRedo: true
      };

      mockStore.select.and.returnValue(of(state));
      service = new HistoryService(store);

      const result = service.getFutureCommands();
      expect(result).toEqual(futureCommands);
      expect(result).not.toBe(futureCommands); // Should return copy
    });
  });

  describe('Command Navigation', () => {
    it('should find command by ID', () => {
      const command1 = new MoveElementCommand('s1', 'e1', {x:0,y:0}, {x:10,y:10}, store);
      const command2 = new MoveElementCommand('s1', 'e2', {x:0,y:0}, {x:20,y:20}, store);
      command1.id = 'cmd1';
      command2.id = 'cmd2';

      const state: HistoryState = {
        past: [command1],
        present: command2,
        future: [],
        canUndo: true,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(state));
      service = new HistoryService(store);

      expect(service.getCommandById('cmd1')).toBe(command1);
      expect(service.getCommandById('cmd2')).toBe(command2);
      expect(service.getCommandById('nonexistent')).toBeNull();
    });

    it('should undo to specific command', () => {
      const command1 = new MoveElementCommand('s1', 'e1', {x:0,y:0}, {x:10,y:10}, store);
      const command2 = new MoveElementCommand('s1', 'e2', {x:0,y:0}, {x:20,y:20}, store);
      const command3 = new MoveElementCommand('s1', 'e3', {x:0,y:0}, {x:30,y:30}, store);
      command1.id = 'cmd1';
      command2.id = 'cmd2';
      command3.id = 'cmd3';

      const state: HistoryState = {
        past: [command1, command2],
        present: command3,
        future: [],
        canUndo: true,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(state));
      service = new HistoryService(store);

      const result = service.undoToCommand('cmd1');
      expect(result).toBeTrue();
      // Should have called undo multiple times
      expect(store.dispatch).toHaveBeenCalledTimes(2);
    });

    it('should return false when undoing to nonexistent command', () => {
      const state: HistoryState = {
        past: [],
        present: null,
        future: [],
        canUndo: false,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(state));
      service = new HistoryService(store);

      const result = service.undoToCommand('nonexistent');
      expect(result).toBeFalse();
    });
  });

  describe('Statistics and Utilities', () => {
    it('should get history statistics', () => {
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

      mockStore.select.and.returnValue(of(state));
      service = new HistoryService(store);

      const stats = service.getStats();

      expect(stats.totalCommands).toBe(3);
      expect(stats.pastCount).toBe(2);
      expect(stats.futureCount).toBe(0);
      expect(stats.canUndo).toBeTrue();
      expect(stats.canRedo).toBeFalse();
      expect(stats.memoryUsage).toBeDefined();
    });

    it('should estimate memory usage', () => {
      const commands = Array(10).fill(null).map(() =>
        new MoveElementCommand('s1', 'e1', {x:0,y:0}, {x:10,y:10}, store)
      );

      const state: HistoryState = {
        past: commands,
        present: null,
        future: [],
        canUndo: true,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(state));
      service = new HistoryService(store);

      const memoryUsage = service.estimateMemoryUsage();
      expect(memoryUsage).toBe(10 * 1024); // 1KB per command
    });

    it('should set max history size', () => {
      service.setMaxHistorySize(25);
      // This modifies the private property, verify through behavior
      expect(() => service.setMaxHistorySize(5)).not.toThrow();
    });
  });

  describe('History Export', () => {
    it('should export history data', () => {
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

      mockStore.select.and.returnValue(of(state));
      service = new HistoryService(store);

      const exported = service.exportHistory();

      expect(exported.present.id).toBe('test-cmd');
      expect(exported.present.type).toBe('move-element');
      expect(exported.stats.totalCommands).toBe(1);
    });

    it('should handle empty history export', () => {
      const state: HistoryState = {
        past: [],
        present: null,
        future: [],
        canUndo: false,
        canRedo: false
      };

      mockStore.select.and.returnValue(of(state));
      service = new HistoryService(store);

      const exported = service.exportHistory();

      expect(exported.present).toBeNull();
      expect(exported.past).toEqual([]);
      expect(exported.future).toEqual([]);
    });
  });

  describe('History Compression', () => {
    it('should have compressHistory method (placeholder)', () => {
      expect(() => service.compressHistory()).not.toThrow();
      // Method is currently a placeholder
    });
  });
});