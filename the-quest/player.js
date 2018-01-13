/**
 * Game player definition file
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

export default {
  states: [
    { key: 'location', value: 1 }
  ],
  actions: [
    { verbs: ['go'] },
    { verbs: ['get', 'take'] },
    { verbs: ['drop'] },
    {
      verbs: ['examine', 'look at'],
      start: (actor, command, output, entities) => {
        if (!command.predicate) {
          output.print(`What do you want to examine?`, 'error');
          return { abort: true };
        }
        if (!command.object) {
          output.print(`You can't examine that!`, 'error');
          return { abort: true };
        }
        output.print(`You examine ${command.object.name} more closely...`, 'story');
      },
      complete: (actor, command, output, entities) => {
        const description = command.object.getState('description');
        if (!description) {
          output.print(`You see nothing unsual.`, 'story');
        } else {
          output.print(`${description}`, 'story');
        }
      }
    },
    { verbs: ['read'] }
  ]
};
