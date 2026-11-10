/**
 * dsh-output-modes — browser half.
 *
 * Registers two compact controls in the composer tool row, one run-status
 * strip above the composer, and the editor/preview modals those controls
 * portal. The client module loader materializes this file only when the
 * package row is enabled.
 */

import { CSS, STYLE_ID } from './styles.js'
import { OutputModePicker, OutputStatus, OutputTypePicker } from './components.jsx'

export const inject = ['slots']

/** Install the plugin stylesheet once per page generation. */
function installStyles(ctx) {
  if (typeof document === 'undefined') return
  ctx.effect(() => {
    // A reload replaces the previous generation's tag rather than sharing it,
    // so the old generation's cleanup cannot remove the new sheet.
    document.getElementById(STYLE_ID)?.remove()
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.dataset.plugin = 'dsh-output-modes'
    style.textContent = CSS
    document.head.appendChild(style)
    return () => { style.remove() }
  }, 'output-modes: styles')
}

/**
 * Register the composer seats. `slots.inject` waits for the surrounding
 * Conversation UI to declare each seat, so the plugin is inert on surfaces
 * without a composer.
 * @param ctx - client root context.
 */
export function apply(ctx) {
  installStyles(ctx)

  ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
    name: 'conversation.input.left',
    id: 'output-type',
    order: 30,
  }, OutputTypePicker))

  ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
    name: 'conversation.input.left',
    id: 'output-level',
    order: 31,
  }, OutputModePicker))

  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
    name: 'conversation.input.dock',
    id: 'output-modes',
    order: 40,
  }, OutputStatus))
}
