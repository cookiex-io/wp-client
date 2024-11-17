# Contributing to CookieX Wordpress Plugin.

We welcome contributions to the CookieX WordPress plugin! This document provides guidelines for contributing to the project.

## Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/cookiex-io/wp-plugin.git
   ```

2. Install dependencies:
   ```
   composer install
   npm install
   ```

3. Set up the plugin development environment:
   - Ensure you have a local WordPress installation.
   - Symlink or copy the plugin directory to your WordPress plugins folder.

4. Create a zip file for deployment:
   ```
   ./build.sh
   ```

5. For admin interface development with hot reloading: in resources/admin/js/pages/SettingsPage.tsx, look for and follow the following instruction: "Uncomment following apiFetch for development mode". 
   You can then:
   ```
   npm run development
   ```

## Project Structure

- `resources/`: Contains admin interface source files
  - `admin/`: Admin-related React components and styles
- `bud.config.js`: Configuration for Bud.js
- `index.php`: Main plugin file

## Coding Standards

- Follow WordPress Coding Standards for PHP.
- Use ESLint for JavaScript and TypeScript.
- Use Prettier for code formatting.

## Making Changes

1. Create a new branch for your feature or bug fix.
2. Make your changes and commit them with a clear, descriptive message.
3. Push your branch and create a pull request.

## Building the Plugin

- Use `npm run build` to create production-ready assets.
- The build process is managed by Bud.js as configured in `bud.config.js`.

## Testing

- Write unit tests for PHP code using PHPUnit.
- For React components, use Jest and React Testing Library.

## Submitting Pull Requests

1. Ensure your code adheres to the project's coding standards.
2. Update documentation if you're changing functionality.
3. Include tests for new features or bug fixes.
4. Make sure all tests pass before submitting.

## Reporting Issues

- Use the GitHub issue tracker to report bugs or suggest features.
- Provide as much detail as possible, including steps to reproduce for bugs.

Thank you for contributing to CookieX wordpress plugin!
