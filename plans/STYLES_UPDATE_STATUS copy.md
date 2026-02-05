Based on the comprehensive analysis of your component system, here's a detailed prompt you can use to instruct an AI assistant or development team to implement the improvements:

---

**Component Enhancement & Standardization Prompt**

**Project Context:**
You are working on an Angular-based business template system with two key libraries:
- **Editor Components Library**: `libs/features/editor/feature-editor/src/lib/pages/editor/components/` - Contains wrapper components that extend `BaseEditorSectionComponent` and use `VisualEditableDirective` for drag/resize functionality
- **UI Components Library**: `libs/ui-components/src/lib/` - Contains reusable UI components with extensive variant systems and custom styling capabilities

**Current State Analysis:**
- 40+ editor wrapper components with inconsistent drag/resize implementations
- Mixed styling approaches (`customStyles` vs `applyDynamicStyles`)
- Desktop-only visual editing (mobile lacks editing capabilities)
- No unified style inheritance system
- Inconsistent element selection and grouping

**Required Improvements:**

1. **Standardize All Components:**
   - Ensure every wrapper component follows identical patterns for visual editing
   - Implement consistent mobile editing support with touch-based resize handles
   - Standardize styling application using a unified `customStyles` interface

2. **Implement Consistent Drag Resize:**
   - Add drag/resize functionality to all components where missing
   - Implement mobile-friendly editing with long-press activation
   - Add boundary constraints and collision detection
   - Support element grouping for multi-selection operations

3. **Enhance Styling System:**
   - Make all wrappers configurable for styles at parent level (section styles)
   - Allow individual child element styling inheritance/overrides
   - Implement cascading style system with configurable inheritance rules
   - Add style validation and sanitization

4. **Code Structure Requirements:**
   - Extend or create `EnhancedBaseEditorSectionComponent` with unified methods
   - Use `EnhancedVisualEditableDirective` with standardized configuration
   - Implement services: `EnhancedVisualEditorService`, `StyleInheritanceService`, `ElementGroupingService`
   - Follow the template pattern provided in the enhancement plan

**Implementation Phases:**

**Phase 1 (High Priority):**
- Standardize `VisualEditableDirective` usage across all components
- Add mobile editing capabilities to all components
- Fix styling inconsistencies (unify `customStyles` application)
- Add basic boundary constraints

**Phase 2 (Medium Priority):**
- Implement element grouping system
- Add style validation and presets
- Enhance undo/redo functionality
- Create style inheritance service

**Phase 3 (Low Priority):**
- Add real-time collaboration features
- Implement advanced constraints (snapping, collision detection)
- Create component theming system

**Technical Specifications:**
- Use TypeScript interfaces for all configurations
- Maintain backward compatibility
- Ensure performance (< 16ms response times)
- Follow Angular best practices and RxJS patterns
- Include comprehensive error handling

**Success Criteria:**
- All 40+ components follow identical patterns
- Mobile editing works on all components
- Styles cascade properly from parent to children
- Drag/resize operations are smooth and constrained
- Code duplication reduced by >90%

**Deliverables:**
- Updated component files with standardized implementations
- New services and directives as specified
- Comprehensive documentation of patterns used
- Test cases covering all new functionality

**Constraints:**
- Maintain existing API compatibility where possible
- Do not break current functionality
- Ensure responsive design works on all screen sizes
- Follow project's existing coding standards and folder structure

---

This prompt provides a complete roadmap for standardizing and enhancing your component system. Use it to guide AI assistants or development teams in implementing these improvements systematically.