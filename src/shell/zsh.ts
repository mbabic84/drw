/**
 * Zsh shell integration for drw.
 * 
 * Generates shell functions and completion scripts for Zsh.
 * 
 * @module shell/zsh
 */

/**
 * Generates the Zsh initialization script for drw integration.
 * 
 * The generated script includes:
 * - A completion function using _describe for shortcut names
 * - A wrapper function that cds to the resolved directory
 * - compdef registration for the completion function
 * 
 * @returns Zsh script content
 */
export function generateZshInit(): string {
  const lines = [
    "# drw shell integration for Zsh",
    "",
    "# Completion function for drw shortcuts",
    "_drw_completion() {",
    "  local completions",
    '  completions="$(command drw --complete 2>/dev/null)"',
    '  if [ -n "$completions" ]; then',
    "    local -a cmd",
    '    cmd=(${(f)completions})',
    "    _describe 'drw-directory' cmd -o",
    "  fi",
    "}",
    "",
    "# Register the completion function",
    "compdef _drw_completion drw",
    "",
    "# Main drw function - wraps the command and handles cd",
    "drw() {",
    "  # Only cd for name argument, not for flags",
    '  if [[ "$1" != -* ]]; then',
    "    local path",
    '    path="$(command drw "$@")" && cd "$path"',
    "  else",
    '    command drw "$@"',
    "  fi",
    "}"
  ]
  
  return lines.join("\n")
}
