# Create React Component

Simple package for creating `React` component.

## Installing

```sh
npm i -g @skr571999/create-react-component -n ComponentName
```

or running without installing

```sh
npx @skr571999/create-react-component -n ComponentName
```

## Usage/Options

```sh
Usage: create-react-component -n <name>

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
create-react-app -n TextBox -l js

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
create-react-app -n TextBox

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
create-react-app -n TextBox -c

# will create following component structure
src
├── components
    ├── TextBox
        ├── textbox.container.tsx
        ├── textbox.view.tsx
        └── index.ts
```
