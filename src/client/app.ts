import Terminal from './terminal/Terminal';

window.addEventListener('load', () => {
  const terminalElement = document.getElementById('terminal');
  if (!terminalElement) return;
  const terminal = new Terminal(terminalElement);
});
