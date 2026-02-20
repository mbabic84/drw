# drw (Directory Warp)

A fast CLI tool for jumping to preconfigured directories with tab completion.

## Overview

`drw` scans immediate subdirectories of configured base paths and provides tab completion to quickly navigate to them. Perfect for managing multiple project environments or workspaces.

**Features:**
- **Tab completion** with recently used shortcuts appearing first
- **Smart sorting** - most frequently used directories are prioritized
- **Quick navigation** - jump to any configured directory with a few keystrokes

```bash
$ drw my-project<TAB>
# shows: my-project (and other recently used shortcuts)
$ drw my-project          # Changes to /projects/my-project
```

## Installation

The package includes a standalone binary that works without requiring Bun to be installed.

```bash
# Using npm
npm install -g @kn-org/drw

# Using Bun
bun add -g @kn-org/drw

# Or download the binary directly from GitHub releases
```

## Setup

After installation, run the install command to add shell integration to your rc file:

```bash
drw --install
```

This adds the shell function and tab completion to your `.bashrc` or `.zshrc`.

## Manual Installation

If you prefer to install manually, add the following to your `.bashrc` or `.zshrc`:

### Bash

```bash
# drw (Directory Warp)
# Enable TAB cycling if line editing is available
if [[ ${SHELLOPTS} =~ (vi|emacs) ]]; then
  bind '"\t":menu-complete' 2>/dev/null
  bind 'set show-all-if-ambiguous on' 2>/dev/null
fi

drw() {
  if [[ "$1" != -* ]]; then
    local path
    path="$(command drw "$@")" && builtin cd "$path"
  else
    command drw "$@"
  fi
}

_drw_completion() {
  local cur="${COMP_WORDS[${COMP_CWORD}]}"
  local all
  all="$(drw --complete)"
  COMPREPLY=($(compgen -W "$all" -- "$cur"))
}
complete -o nosort -F _drw_completion drw
# end drw
```

### Zsh

```zsh
# drw shell integration for Zsh
_drw_completion() {
  local completions
  completions="$(command drw --complete 2>/dev/null)"
  if [ -n "$completions" ]; then
    local -a cmd
    cmd=(${(f)completions})
    _describe 'drw-directory' cmd -o
  fi
}
compdef _drw_completion drw

drw() {
  if [[ "$1" != -* ]]; then
    local path
    path="$(command drw "$@")" && cd "$path"
  else
    command drw "$@"
  fi
}
```

## Configuration

You can edit the config file directly or use CLI commands:

```bash
# Add current directory to config
drw --add

# Add a specific folder to config
drw --add /path/to/folder

# Remove a folder from config
drw --remove /path/to/folder

# List configured folders and their shortcuts
drw --list
```

Config file location (in order of priority):

1. `DRW_CONFIG` environment variable (full path to config file)
2. `$XDG_CONFIG_HOME/drw/config.json`
3. `~/.config/drw/config.json`

Example config:

```json
{
  "folders": [
    "/absolute/path/to/base1",
    "/absolute/path/to/base2"
  ]
}
```

**Using custom config path:**
```bash
DRW_CONFIG=/path/to/config.json drw --list
```

`drw` will scan immediate subdirectories of each base path and create shortcuts based on the directory names.

Example:

If you have:
```
/projects/
├── my-project/
├── another-app/
└── work-backend/
```

With config: `{ "folders": ["/projects"] }`

Then `drw my-project` will cd to `/projects/my-project`.

## Usage

### Commands

| Command | Description |
|---------|-------------|
| `drw [name]` | Resolve directory path and cd to it (requires shell function) |
| `drw --list` | List all available shortcuts with their paths (recently used marked with ⭐) |
| `drw --complete` | Output space-separated list of shortcut names (for tab completion) |
| `drw --info [name]` | Show all paths for a shortcut (useful for duplicates) |
| `drw --install` | Install shell integration to .bashrc/.zshrc |
| `drw --add [path]` | Add a folder to config (default: current directory) |
| `drw --remove [path]` | Remove a folder from config |
| `drw --refresh` | Force rebuild of cache (if caching is enabled) |

### Duplicate Shortcut Names

If you have the same folder name in multiple base directories:

- `drw --list` will show all available paths for duplicates
- `drw <name>` will use the first match and warn you
- `drw --info <name>` shows all available paths for a specific shortcut

### Shell Function

After installation, a shell function wraps `drw` to automatically `cd` to the resolved path.

Without the shell function, you can still use `drw` to output paths:

```bash
cd "$(drw my-project)"  # Manual cd
```

## Tab Completion

Once installed, press `<TAB>` after `drw ` to see available shortcuts:

### Features

- **Smart sorting**: Recently used shortcuts appear first (marked with ⭐ in `--list`)
- **TAB cycling**: First TAB shows list, second TAB auto-fills the most recent shortcut
- **Filter as you type**: Type `drw app<TAB>` to filter to shortcuts starting with "app"

### Examples

```bash
# Show all shortcuts (sorted by recent usage)
$ drw <TAB><TAB>
# Shows: my-project api-service frontend-app backend-api ...

# Auto-fill the most recent shortcut
$ drw <TAB>
# Shows list, then second <TAB> fills: my-project

# Filter shortcuts
$ drw api<TAB>
# Shows only: api-service api-gateway api-client
```

Works in both Bash and Zsh.

## Uninstall

1. Run `drw --install` again to remove the drw section from your `.bashrc` or `.zshrc`, or manually remove the drw section
2. Uninstall the package:
   ```bash
   npm uninstall -g @kn-org/drw
   # or
   bun remove -g @kn-org/drw
   ```

## Troubleshooting

### Tab completion not working

1. Ensure you've installed shell integration: `drw --install`
2. Check that your shell is supported (bash 4.0+ or zsh)
3. Restart your shell or re-source your rc file: `source ~/.bashrc` (or `~/.zshrc`)
4. Verify the drw function is loaded: `type drw` should show it's a function, not just a binary

### TAB cycling not working (always shows list, doesn't auto-fill)

Some SSH clients or terminal emulators may not support the `bind` command. If TAB cycling doesn't work:
- The basic TAB completion (showing list) will still work
- You can manually add this to your `.bashrc` after the drw section:
  ```bash
  bind '"\t":menu-complete'
  bind 'set show-all-if-ambiguous on'
  ```

### "Directory not found" errors

- Verify your base paths in config exist and are absolute
- Check that shortcut names are unique across all base directories
- Run `drw --list` to see all available shortcuts

### Permission errors

- Ensure you have read access to all configured base directories
- The config file must be readable

### Usage Tracking

`drw` tracks which shortcuts you use most frequently to prioritize them in completion suggestions. This data is stored in:
- `~/.config/drw/usage.json`

Shortcuts are sorted by most recent usage in both `--list` and tab completion. The ⭐ marker in `--list` indicates recently used shortcuts.

To clear usage history, simply delete the usage file:
```bash
rm ~/.config/drw/usage.json
```

## License

MIT
