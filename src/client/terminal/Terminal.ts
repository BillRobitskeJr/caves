/**
 * Terminal interface module
 */

/**
 * Terminal class
 */
export default class Terminal {
  private _element: HTMLElement;

  /**
   * Builds a new terminal interface
   * @param element Element to build the terminal interface in
   */
  constructor(element: HTMLElement) {
    this._element = element;
    this.stampOutElement();
  }

  /**
   * Constructs the elements of this terminal interface
   */
  protected stampOutElement() {
    this._element.classList.add('terminal');
    const output = document.createElement('div');
    output.classList.add('output');
    const outblock = document.createElement('p');
    outblock.classList.add('output-block');
    outblock.classList.add('info');
    outblock.innerHTML = `Welcome to Caves!`;
    output.appendChild(outblock);
    const prompt = document.createElement('div');
    prompt.classList.add('prompt');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('autofocus', '');
    input.classList.add('prompt-input');
    const promptCaret = document.createElement('span');
    promptCaret.classList.add('prompt-caret');
    promptCaret.innerHTML = '&gt; ';
    prompt.appendChild(promptCaret);
    prompt.appendChild(input);
    input.focus();
    input.addEventListener('keydown', (e) => {
      if (e.keyCode !== 13) return;
      this.enterCommand(input.value);
      input.value = '';
    });
    input.addEventListener('blur', () => { input.focus(); });
    this._element.appendChild(output);
    this._element.appendChild(prompt);
  }

  /**
   * Enters a command into this terminal
   * @param command Command entered into this terminal
   */
  enterCommand(command: string) {
    console.log(`Command entered: ${command}`);
    this.echoCommand(command);
    // FOR TESTING
    this.postOutput(`I don't know how to perform "${command}".  Blame Bill.`, 'server');
  }

  /**
   * Echos an entered command to this terminal's output
   * @param command Command entered into this terminal
   */
  protected echoCommand(command: string) {
    this.postOutput(command, 'echo');
  }

  /**
   * Displays a message to this terminal's output
   * @param message Message to display
   * @param type Type of styling to apply to message
   */
  postOutput(message: string, type: string = 'info') {
    const outblock = document.createElement('p');
    outblock.classList.add('output-block');
    outblock.classList.add(type);
    outblock.innerHTML = `${message}`;
    const output = this._element.querySelector('.output');
    if (!output) return;
    output.insertBefore(outblock, output.firstChild);
  }
}