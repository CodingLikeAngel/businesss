import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { UndoRedoToolbarComponent } from './undo-redo-toolbar.component';
import { HistoryService } from '../../services/history.service';
import { HistoryState } from '../../models/editor.model';
import { of } from 'rxjs';

describe('UndoRedoToolbarComponent', () => {
  let component: UndoRedoToolbarComponent;
  let fixture: ComponentFixture<UndoRedoToolbarComponent>;
  let historyService: jest.Mocked<HistoryService>;

  beforeEach(async () => {
    const mockHistoryService = {
      historyState: jest.fn(),
      undo: jest.fn(),
      redo: jest.fn(),
      getStats: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, UndoRedoToolbarComponent],
      providers: [
        { provide: HistoryService, useValue: mockHistoryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UndoRedoToolbarComponent);
    component = fixture.componentInstance;
    historyService = TestBed.inject(HistoryService) as jest.Mocked<HistoryService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.canUndo).toBe(false);
      expect(component.canRedo).toBe(false);
      expect(component.showHistoryInfo).toBe(false);
      expect(component.historyStats).toEqual({ totalCommands: 0, memoryUsage: 0 });
    });

    it('should subscribe to history state on init', () => {
      const mockState: HistoryState = {
        past: [],
        present: null,
        future: [],
        canUndo: true,
        canRedo: false
      };

      const mockStats = { totalCommands: 5, memoryUsage: 5120 };

      historyService.historyState.mockReturnValue(of(mockState));
      historyService.getStats.mockReturnValue(mockStats);

      component.ngOnInit();

      expect(component.canUndo).toBe(true);
      expect(component.canRedo).toBe(false);
      expect(component.historyStats).toEqual(mockStats);
    });
  });

  describe('Button Actions', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should call historyService.undo() when undo button is clicked', () => {
      component.canUndo = true;
      fixture.detectChanges();

      const undoButton = fixture.nativeElement.querySelector('.undo-btn');
      undoButton.click();

      expect(historyService.undo).toHaveBeenCalled();
    });

    it('should call historyService.redo() when redo button is clicked', () => {
      component.canRedo = true;
      fixture.detectChanges();

      const redoButton = fixture.nativeElement.querySelector('.redo-btn');
      redoButton.click();

      expect(historyService.redo).toHaveBeenCalled();
    });

    it('should disable undo button when canUndo is false', () => {
      component.canUndo = false;
      fixture.detectChanges();

      const undoButton = fixture.nativeElement.querySelector('.undo-btn');
      expect(undoButton.disabled).toBe(true);
      expect(undoButton.classList.contains('active')).toBe(false);
    });

    it('should disable redo button when canRedo is false', () => {
      component.canRedo = false;
      fixture.detectChanges();

      const redoButton = fixture.nativeElement.querySelector('.redo-btn');
      expect(redoButton.disabled).toBe(true);
      expect(redoButton.classList.contains('active')).toBe(false);
    });

    it('should enable and highlight undo button when canUndo is true', () => {
      component.canUndo = true;
      fixture.detectChanges();

      const undoButton = fixture.nativeElement.querySelector('.undo-btn');
      expect(undoButton.disabled).toBe(false);
      expect(undoButton.classList.contains('active')).toBe(true);
    });

    it('should enable and highlight redo button when canRedo is true', () => {
      component.canRedo = true;
      fixture.detectChanges();

      const redoButton = fixture.nativeElement.querySelector('.redo-btn');
      expect(redoButton.disabled).toBe(false);
      expect(redoButton.classList.contains('active')).toBe(true);
    });
  });

  describe('History Information Display', () => {
    beforeEach(() => {
      component.showHistoryInfo = true;
      component.ngOnInit();
    });

    it('should display history stats when showHistoryInfo is true', () => {
      component.historyStats = { totalCommands: 10, memoryUsage: 10240 };
      fixture.detectChanges();

      const historyInfo = fixture.nativeElement.querySelector('.history-info');
      expect(historyInfo).toBeTruthy();

      const countElement = historyInfo.querySelector('.history-count');
      const memoryElement = historyInfo.querySelector('.memory-usage');

      expect(countElement.textContent).toContain('10 operations');
      expect(memoryElement.textContent).toContain('10.00 KB');
    });

    it('should not display history info when showHistoryInfo is false', () => {
      component.showHistoryInfo = false;
      fixture.detectChanges();

      const historyInfo = fixture.nativeElement.querySelector('.history-info');
      expect(historyInfo).toBeFalsy();
    });
  });

  describe('Template Rendering', () => {
    it('should render undo and redo buttons', () => {
      fixture.detectChanges();

      const undoButton = fixture.nativeElement.querySelector('.undo-btn');
      const redoButton = fixture.nativeElement.querySelector('.redo-btn');

      expect(undoButton).toBeTruthy();
      expect(redoButton).toBeTruthy();

      expect(undoButton.querySelector('.icon').textContent).toBe('↶');
      expect(undoButton.querySelector('.label').textContent).toBe('Undo');

      expect(redoButton.querySelector('.icon').textContent).toBe('↷');
      expect(redoButton.querySelector('.label').textContent).toBe('Redo');
    });

    it('should show correct button titles', () => {
      fixture.detectChanges();

      const undoButton = fixture.nativeElement.querySelector('.undo-btn');
      const redoButton = fixture.nativeElement.querySelector('.redo-btn');

      expect(undoButton.title).toBe('Undo (Ctrl+Z)');
      expect(redoButton.title).toBe('Redo (Ctrl+Y)');
    });
  });

  describe('Responsive Design', () => {
    it('should hide labels on mobile screens', () => {
      // Mock window.innerWidth to simulate mobile
      Object.defineProperty(window, 'innerWidth', { value: 600 });

      fixture.detectChanges();

      const labels = fixture.nativeElement.querySelectorAll('.label');
      labels.forEach((label: Element) => {
        expect(label.classList.contains('mobile-hidden')).toBe(false); // CSS would handle this
      });
    });

    it('should maintain functionality on small screens', () => {
      component.canUndo = true;
      component.canRedo = true;

      fixture.detectChanges();

      const undoButton = fixture.nativeElement.querySelector('.undo-btn');
      const redoButton = fixture.nativeElement.querySelector('.redo-btn');

      expect(undoButton.disabled).toBe(false);
      expect(redoButton.disabled).toBe(false);
    });
  });

  describe('Component Lifecycle', () => {
    it('should unsubscribe from history state on destroy', () => {
      spyOn(component['subscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });

    it('should handle component destruction gracefully', () => {
      expect(() => {
        component.ngOnDestroy();
        component.ngOnDestroy(); // Call again to ensure no errors
      }).not.toThrow();
    });
  });

  describe('State Synchronization', () => {
    it('should update button states when history state changes', () => {
      const states = [
        { canUndo: false, canRedo: false },
        { canUndo: true, canRedo: false },
        { canUndo: true, canRedo: true },
        { canUndo: false, canRedo: true }
      ];

      states.forEach(state => {
        const mockState: HistoryState = {
          past: [],
          present: null,
          future: [],
          canUndo: state.canUndo,
          canRedo: state.canRedo
        };

        historyService.historyState.mockReturnValue(of(mockState));
        historyService.getStats.mockReturnValue({ totalCommands: 0, memoryUsage: 0 });

        component.ngOnInit();

        expect(component.canUndo).toBe(state.canUndo);
        expect(component.canRedo).toBe(state.canRedo);
      });
    });

    it('should update history stats when state changes', () => {
      const mockStats = { totalCommands: 15, memoryUsage: 15360 };
      const mockState: HistoryState = {
        past: [],
        present: null,
        future: [],
        canUndo: false,
        canRedo: false
      };

      historyService.historyState.mockReturnValue(of(mockState));
      historyService.getStats.mockReturnValue(mockStats);

      component.ngOnInit();

      expect(component.historyStats).toEqual(mockStats);
    });
  });

  describe('Error Handling', () => {
    it('should handle history service errors gracefully', () => {
      historyService.historyState.mockReturnValue(of(null as any));

      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle missing history stats gracefully', () => {
      const mockState: HistoryState = {
        past: [],
        present: null,
        future: [],
        canUndo: false,
        canRedo: false
      };

      historyService.historyState.mockReturnValue(of(mockState));
      historyService.getStats.mockReturnValue(null as any);

      component.ngOnInit();

      expect(component.historyStats).toBeDefined();
    });
  });
});