/**
 * Install command handler for drw.
 * 
 * Installs shell integration into the user's shell rc file.
 * 
 * @module commands/install
 */

import { detectShell, installShellIntegration } from "../shell/index.ts"

/**
 * Handles the --install command.
 * 
 * Detects the current shell and installs the appropriate
 * shell integration (functions and completions) into the
 * shell's rc file (~/.bashrc or ~/.zshrc).
 */
export async function handleInstall(): Promise<void> {
  const shell = detectShell()
  const rcFile = shell === "zsh" 
    ? `${process.env.HOME}/.zshrc`
    : `${process.env.HOME}/.bashrc`

  try {
    installShellIntegration(shell)
    
    console.log(`\n✅ Added to ${rcFile}`)
    console.log(`   Restart your shell or run: source ${rcFile}`)
  } catch (err) {
    console.error(`\n❌ Failed: ${err}`)
  }

  process.exit(0)
}
