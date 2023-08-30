# Create React Component

A package for creating `React` component for `TS` and `JS`.

## Installation

```sh
npm i -g @skr571999/crc
```

or running using `npx` (without Installing)

```sh
npx @skr571999/crc -n ComponentName
```

## Usage/Options

```sh
Usage: crc -n <name>

Options:
      --help       Show help                                       [boolean]
      --version    Show version number                             [boolean]
  -n, --compName   Component name                        [string] [required]
  -l, --language   Language [js, ts(default)]                       [string]
  -c, --component  Make component [No(default)]                    [boolean]
```

## Examples

- For `JavaScript`

```sh
cd src
crc -n TextBox -l js

# will create following component structure
src
├── components
    ├── TextBox
        ├── textbox.view.jsx
        └── index.js
```

- For `TypeScript`

```sh
cd src
crc -n TextBox

# will create following component structure
src
├── components
    ├── TextBox
        ├── textbox.view.tsx
        └── index.ts
```

- For `TypeScript` with a `.container.tsx` file

```sh
cd src
crc -n TextBox -c

# will create following component structure
src
├── components
    ├── TextBox
        ├── textbox.container.tsx
        ├── textbox.view.tsx
        └── index.ts
```

## Similar Project

- https://github.com/arminbro/generate-react-cli

## TODO

- [ ] Add feature to create (SCSS, model) files
- [ ] Add feature to create page Ex. pages/Login
