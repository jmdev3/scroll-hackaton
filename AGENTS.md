# Agent Guidelines

## Project Context

This is a **prediction market application** where users can bet on yes/no outcomes of different events. The app is built with Next.js and follows a modular, component-based architecture.

### Key Design Patterns

- **Reusable Components**: Follow the existing pattern of creating modular, reusable components like `PredictionButton`
- **Modular Architecture**: Components are organized in the `components/` directory with their own CSS modules
- **Type Safety**: Use TypeScript types defined in `types/index.ts`
- **Consistent Styling**: Use CSS modules for component-specific styles (`.module.css` files)

### Component Structure

- `components/ui/` - Reusable UI components (e.g., `PredictionButton`)
- `components/` - Feature-specific components (e.g., `EventCard`, `EventSlider`)
- Each component has its own `.module.css` file for scoped styling
- Follow the existing naming conventions and file organization

### Development Guidelines

- Create reusable, modular components when adding new features
- Use existing patterns like `PredictionButton` for consistent UI elements
- Maintain the established file structure and naming conventions
- Ensure components are self-contained with their own styles

### CSS Modules Usage

**IMPORTANT**: Always use CSS modules for component-specific styling. Follow these rules:

- **Use CSS Modules**: All component-specific styles must use CSS modules (`.module.css` files)
- **Import Styles**: Import CSS modules as `import styles from "./ComponentName.module.css"`
- **Class Names**: Use `styles.className` syntax instead of string literals
- **Global Styles Only When Necessary**: Only use `globals.css` for:
  - CSS custom properties (CSS variables)
  - Global resets and base styles
  - Third-party library overrides (e.g., Ant Design)
  - Utility classes that are truly global
- **No Global Class Selectors**: Avoid adding new global class selectors to `globals.css` for component-specific styling
- **Consistent Naming**: Use kebab-case for CSS class names and follow existing naming patterns

**Example**:

```tsx
// ✅ Correct - Using CSS modules
import styles from "./MyComponent.module.css";
<div className={styles.container}>

// ❌ Incorrect - Using global classes
<div className="my-container">
```

## Development Server Rules

**IMPORTANT**: Agents should NOT start the development server under any circumstances. Do not run commands like:

- `npm run dev`
- `yarn dev`
- `bun dev`
- `next dev`

The development server should only be started manually by the user when needed.
