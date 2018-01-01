/**
 * `<brj-terminal>` custom element
 * @copyright   Bill Robitske, Jr. 2017-2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

/**
 * `<brj-terminal>` element behavior class
 */
class BRJTerminalElement extends HTMLElement {

  /**
   * Create a new `<brj-terminal>` element
   */
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }
        .terminal {
          display: flex;
          flex-direction: column;
          margin: 0;
          background-color: var(--terminal-background-color, black);
          width: calc(1em * var(--terminal-character-box-ratio, calc(100 / 166.5)) * var(--terminal-columns, 80) + 2em);
          height: calc(1em * var(--terminal-rows, 24) + 1em);
          padding: 0.5em 1em;
          font-family: var(--terminal-font, monospace);
          color: var(--terminal-foreground-color, lime);
        }
        .terminal__output {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          margin: 0;
          height: calc(100% - 1em);
          padding: 0;
        }
        ::slotted(*) {
          margin: 0;
          line-height: 1;
          padding: 0;
          font-family: inherit;
          font-size: inherit;
          letter-spacing: 0;
        }
        .terminal__prompt {
          display: flex;
          margin: 0;
          height: 1em;
          padding: 0;
        }
        .terminal__prompt-marker {
          width: calc(2em * var(--terminal-character-box-ratio, 0.625));
        }
        .terminal__prompt-input {
          margin: 0;
          border: none;
          outline: none;
          background-color: transparent;
          width: calc(100% - 2em * var(--terminal-character-box-ratio, 0.625));
          padding: 0;
          font-family: inherit;
          font-size: inherit;
          color: inherit;
        }

        :host([output-only]) .terminal__output {
          height: 100%;
        }
        :host([output-only]) .terminal__prompt {
          display: none;
        }

        :host([top-down]) .terminal__output {
          position: relative;
          bottom: 0;
          overflow: visble;
          justify-content: flex-start;
        }
      </style>
      <section class="terminal">
        <div class="terminal__output">
          <slot></slot>
        </div>
        <footer class="terminal__prompt">
          <span class="terminal__prompt-marker">&gt;</span>
          <input class="terminal__prompt-input" type="text">
        </footer>
      </section>
    `;

    this.addEventListener('click', () => { this.focus(); });
    this.shadowRoot.querySelector('input').addEventListener('keydown', this._handleInput.bind(this));
  }

  /**
   * @property  {boolean} echo        - This teriminal echos input to its output
   */
  get echo() {
    return this.hasAttribute('echo');
  }
  set echo(value) {
    if (!!value) {
      this.setAttribute('echo', '');
    } else {
      this.removeAttribute('echo');
    }
  }

  /**
   * @property  {boolean} outputOnly  - This terminal doesn't have an input prompt
   */
  get outputOnly() {
    return this.hasAttribute('output-only');
  }
  set outputOnly(value) {
    if (!!value) {
      this.setAttribute('output-only', '');
    } else {
      this.removeAttribute('output-only');
    }
  }

  /**
   * @property  {boolean} topDown     - This terminal displays output from the top
   *                                    of the screen down
   */
  get topDown() {
    return this.hasAttribute('top-down');
  }
  set topDown(value) {
    if (!!value) {
      this.setAttribute('top-down', '');
    } else {
      this.removeAttribute('top-down');
    }
  }

  /**
   * Output text to this terminal's output
   * @param   {string} message  - Message to output to this terminal 
   * @param   {string} [style]  - Optional style metadata to attach to output
   */
  print(message, style) {
    const rows = window.getComputedStyle(this).getPropertyValue('--terminal-rows') || 24;
    const output = document.createDocumentFragment();
    message.split(/\n/g).forEach(line => {
      const pre = document.createElement('pre');
      pre.innerHTML = line;
      if (style) pre.setAttribute('data-style', style);
      output.appendChild(pre);
    });
    this.appendChild(output);
    while (this.childElementCount > (this.outputOnly ? rows : rows - 1)) this.removeChild(this.firstElementChild);
  }

  /**
   * Clear this terminal's output
   */
  clear() {
    while (this.childElementCount > 0) this.removeChild(this.firstElementChild);
  }

  /**
   * Focus on this terminal's input prompt
   */
  focus() {
    if (!this.outputOnly) this.shadowRoot.querySelector('input').focus();
  }

  /**
   * @event   BRJTerminalElement~input
   * @param   {BRJTerminalElement}  target  - Terminal receiving the input
   * @param   {object}       detail         - Input event details
   * @param   {string}       detail.input   - Input provided
   */

  /**
   * Check keyboard events for Return presses, dispatching a custom `input`
   * event if it did
   * @private
   * @param   {KeyboardEvent} event
   * @fires   BRJTerminalElement~input
   */
  _handleInput(event) {
    if (event.keyCode === 13) {
      const input = event.target.value;
      event.target.value = '';
      if (this.echo) this.print(input);
      this.dispatchEvent(new CustomEvent('input', { detail: {
        input: input
      }}));
    }
  }
}

window.customElements.define('brj-terminal', BRJTerminalElement);
