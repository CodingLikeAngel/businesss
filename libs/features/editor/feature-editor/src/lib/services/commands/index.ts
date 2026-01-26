// Command Pattern Implementation for Undo/Redo System
import { Command } from '../../models/editor.model';
import { updateElement, updateSection } from '../../store/actions/page.actions';

// Base Command class with common functionality
export abstract class BaseCommand implements Command {
  id: string;
  type: string;
  timestamp: Date;
  description: string;

  constructor(type: string, description: string) {
    this.id = crypto.randomUUID();
    this.type = type;
    this.timestamp = new Date();
    this.description = description;
  }

  abstract execute(): void;
  abstract undo(): void;
  abstract redo(): void;
}

// Element Movement Command
export class MoveElementCommand extends BaseCommand {
  constructor(
    private sectionId: string,
    private elementId: string,
    private oldPosition: { x: number; y: number },
    private newPosition: { x: number; y: number },
    private store: any // NgRx store
  ) {
    super('move-element', `Move element ${elementId} from (${oldPosition.x}, ${oldPosition.y}) to (${newPosition.x}, ${newPosition.y})`);
  }

  execute(): void {
    this.redo();
  }

  undo(): void {
    this.store.dispatch(updateElement({
      sectionId: this.sectionId,
      elementId: this.elementId,
      changes: { position: this.oldPosition }
    }));
  }

  redo(): void {
    this.store.dispatch(updateElement({
      sectionId: this.sectionId,
      elementId: this.elementId,
      changes: { position: this.newPosition }
    }));
  }
}

// Element Resize Command
export class ResizeElementCommand extends BaseCommand {
  constructor(
    private sectionId: string,
    private elementId: string,
    private oldSize: { width: number; height: number },
    private newSize: { width: number; height: number },
    private store: any
  ) {
    super('resize-element', `Resize element ${elementId} from ${oldSize.width}x${oldSize.height} to ${newSize.width}x${newSize.height}`);
  }

  execute(): void {
    this.redo();
  }

  undo(): void {
    this.store.dispatch(updateElement({
      sectionId: this.sectionId,
      elementId: this.elementId,
      changes: { size: this.oldSize }
    }));
  }

  redo(): void {
    this.store.dispatch(updateElement({
      sectionId: this.sectionId,
      elementId: this.elementId,
      changes: { size: this.newSize }
    }));
  }
}

// Style Change Command
export class StyleChangeCommand extends BaseCommand {
  constructor(
    private targetType: 'element' | 'section',
    private targetId: string,
    private sectionId: string | null, // null for sections
    private oldStyles: any,
    private newStyles: any,
    private store: any
  ) {
    const target = targetType === 'element' ? `element ${targetId}` : `section ${targetId}`;
    super('style-change', `Change styles for ${target}`);
  }

  execute(): void {
    this.redo();
  }

  undo(): void {
    if (this.targetType === 'element') {
      this.store.dispatch(updateElement({
        sectionId: this.sectionId!,
        elementId: this.targetId,
        changes: { styles: this.oldStyles }
      }));
    } else {
      this.store.dispatch(updateSection({
        sectionId: this.targetId,
        changes: { styles: this.oldStyles }
      }));
    }
  }

  redo(): void {
    if (this.targetType === 'element') {
      this.store.dispatch(updateElement({
        sectionId: this.sectionId!,
        elementId: this.targetId,
        changes: { styles: this.newStyles }
      }));
    } else {
      this.store.dispatch(updateSection({
        sectionId: this.targetId,
        changes: { styles: this.newStyles }
      }));
    }
  }
}

// Section Resize Command
export class ResizeSectionCommand extends BaseCommand {
  constructor(
    private sectionId: string,
    private oldSize: { width: number; height: number },
    private newSize: { width: number; height: number },
    private store: any
  ) {
    super('resize-section', `Resize section ${sectionId} from ${oldSize.width}x${oldSize.height} to ${newSize.width}x${newSize.height}`);
  }

  execute(): void {
    this.redo();
  }

  undo(): void {
    this.store.dispatch(updateSection({
      sectionId: this.sectionId,
      changes: { size: this.oldSize }
    }));
  }

  redo(): void {
    this.store.dispatch(updateSection({
      sectionId: this.sectionId,
      changes: { size: this.newSize }
    }));
  }
}

// Composite Command for batch operations
export class CompositeCommand extends BaseCommand {
  constructor(
    private commands: Command[],
    description: string = `Batch operation with ${commands.length} commands`
  ) {
    super('composite', description);
  }

  execute(): void {
    for (const command of this.commands) {
      command.execute();
    }
  }

  undo(): void {
    // Undo in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }

  redo(): void {
    // Redo in forward order
    for (const command of this.commands) {
      command.redo();
    }
  }

  addCommand(command: Command): void {
    this.commands.push(command);
  }

  getCommands(): Command[] {
    return [...this.commands];
  }
}