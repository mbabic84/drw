/**
 * Bash shell integration for drw.
 * 
 * Generates shell functions and completion scripts for Bash.
 * 
 * @module shell/bash
 */

/**
 * Generates the Bash initialization script for drw integration.
 * 
 * The generated script includes:
 * - Tab cycling configuration for menu completion
 * - A wrapper function that cds to the resolved directory
 * - Tab completion support for shortcut names
 * 
 * @returns Bash script content
 */
export function generateBashInit(): string {
  const lines = [
    "# drw shell integration for Bash",
    "",
    "# Enable TAB cycling if line editing is available",
    "if [[ ${SHELLOPTS} =~ (vi|emacs) ]]; then",
    "  bind 'set show-all-if-ambiguous on' 2>/dev/null",
    "fi",
    "",
    "# Main drw function - wraps the command and handles cd",
    "drw() {",
    '  if [[ "$1" != -* ]]; then',
    '    local path',
    '    path="$(command drw "$@")" && builtin cd "$path"',
    "  else",
    '    command drw "$@"',
    "  fi",
    "}",
    "",
    "# Completion function for drw shortcuts",
    "_drw_completion() {",
    '  local cur="${COMP_WORDS[${COMP_CWORD}]}"',
    "  local all matches",
    '  all="$(drw --complete)"',
    "  matches=$(compgen -W \"$all\" -- \"$cur\")",
    "  if [[ -z \"$cur\" ]]; then",
    "    COMPREPLY=($matches)",
    "  else",
    "    compopt -o nosort",
    "    COMPREPLY=($matches)",
    "  fi",
    "}",
    "",
    "# Register the completion function",
    "complete -o nosort -F _drw_completion drw"
  ]
  
  return lines.join("\n")
}
