/**
 * The Quest - Game player definition file
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 * 
 * This game configuration is based on the example game, The Quest,
 * from How to Create Adventure Games by Christopher Lampton (1986).
 * Used under Fair Use.
 */

export default {
  states: [
    { key: 'maxCarry', isImmutable: true, value: 5 },
    { key: 'location', value: 1 },
    { key: 'inventory', value: [] }
  ],
  actions: [
    {
      verbs: ['go'],
      start: (actor, command, output, entities) => {
        if (!command.predicate) {
          output.print(`Where do you want to go?`, 'error');
          return { abort: true };
        }
        const exit = (command.setting ? command.setting.getState('exits') || [] : []).find(exit => exit.direction === command.predicate);
        if (!exit) {
          output.print(`You can't go there!`, 'error');
          return { abort: true };
        }
        output.print(`You head ${exit.direction}...`, 'story');
      },
      complete: (actor, command, output, entities) => {
        const destination = entities.locations.getEntity((command.setting ? command.setting.getState('exits') || [] : []).find(exit => exit.direction === command.predicate).destination);
        if (!destination) {
          output.print(`...but it goes nowhere.  You head back the way you came.`, 'story');
        } else {
          output.print(`You arrive ${destination.name}.`, 'story');
          return {
            player: {
              location: destination.id
            }
          }
        }
      }
    },
    {
      verbs: ['get', 'take'],
      start: (actor, command, output, entities) => {
        if (!command.predicate) {
          output.print(`What do you want to ${command.verb}?`, 'error');
          return { abort: true };
        }
        if (!command.object) {
          output.print(`You can't ${command.verb} that!`, 'error');
          return { abort: true };
        }
        if (command.object.getState('location') !== command.setting.id) {
          output.print(`It's not here!`, 'error');
          return { abort: true };
        }
        if (command.object.getState('isUngettable')) {
          output.print(`Try as you might, you cannnot pick up ${command.object.name}.`, 'story');
          return { abort: true };
        }
      },
      complete: (actor, command, output, entities) => {
        output.print(`You pick up ${command.object.name}.`, 'story');
        const objectUpdates = {
          [command.object.id]: { location: null }
        };
        const container = entities.objects.findEntity(object => (object.getState('contents') || []).indexOf(command.object.id) !== -1);
        if (container) {
          const contents = container.getState('contents');
          contents.splice(contents.indexOf(command.object.id), 1);
          objectUpdates[container.id] = { contents };
        }
        return {
          player: {
            inventory: (actor.getState('inventory') || []).concat([command.object.id])
          },
          objects: objectUpdates
        };
      }
    },
    {
      verbs: ['drop'],
      start: (actor, command, output, entities) => {
        if (!command.predicate) {
          output.print(`What do you want to drop?`, 'error');
          return { abort: true };
        }
        if (!command.object ||
            (actor.getState('inventory') || []).indexOf(command.object.id) === -1) {
          output.print(`You don't have that!`, 'error');
          return { abort: true };
        }
      },
      complete: (actor, command, output, entities) => {
        output.print(`You drop ${command.object.name}.`, 'story');
        const inventory = Array.from(actor.getState('inventory'));
        inventory.splice(inventory.indexOf(command.object.id), 1);
        return {
          player: {
            inventory
          },
          objects: {
            [command.object.id]: { location: command.setting.id }
          }
        };
      }
    },
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
        if (command.object.getState('location') !== command.setting.id &&
            (actor.getState('inventory') || []).indexOf(command.object.id) === -1) {
          output.print(`It's not here!`, 'error');
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
    {
      verbs: ['read'],
      start: (actor, command, output, entities) => {
        if (!command.predicate) {
          output.print(`What do you want to read?`, 'error');
          return { abort: true };
        }
        if (!command.object || command.object.getState('writing') === null) {
          output.print(`You can't read that!`, 'error');
          return { abort: true };
        }
        if (command.object.getState('location') !== command.setting.id &&
            (actor.getState('inventory') || []).indexOf(command.object.id) === -1) {
          output.print(`It's not here!`, 'error');
          return { abort: true };
        }
      },
      complete: (actor, command, output, entities) => {
        const text = command.object.getState('writing');
        if (!text || text.length === 0) {
          output.print(`It's blank.`, 'story');
        } else {
          output.print(`It reads:`, 'story');
          const lines = Array.isArray(text) ? text : text.split(/\s+/gi).reduce((lines, word, index) => {
            if (index === 0) {
              lines.push(word);
            } else if (lines[lines.length - 1].length + word.length + 1 <= 58) {
              lines[lines.length - 1] += ` ${word}`;
            } else {
              lines.push(word);
            }
            return lines;
          }, []);
          output.print(`${lines.map(line => `   ${line}`).join('\n')}`, 'text');
        }
      }
    },
    {
      verbs: ['open'],
      start: (actor, command, output, entities) => {
        if (!command.predicate) {
          output.print(`What do you want to open?`, 'error');
          return { abort: true };
        }
        if (!command.object || !command.object.getState('isOpenable')) {
          output.print(`You can't open that!`, 'error');
          return { abort: true };
        }
        if (command.object.getState('location') !== command.setting.id &&
            (actor.getState('inventory') || []).indexOf(command.object.id) === -1) {
          output.print(`It's not here!`, 'error');
          return { abort: true };
        }
        if (command.object.getState('isOpen')) {
          output.print(`It's already open!`, 'error');
          return { abort: true };
        }
      },
      complete: (actor, command, output, entities) => {
        output.print(`You open ${command.object.name}.`, 'story');
        const contents = (command.object.getState('contents') || []).map(id => entities.objects.getEntity(id));
        if (contents.length === 0) {
          output.print(`It's empty.`, 'story');
        } else {
          output.print(`There's something inside.`, 'story');
        }
        const objectUpdates = {
          [command.object.id]: { isOpen: true }
        };
        contents.forEach(object => {
          objectUpdates[object.id] = { location: command.setting.id }
        });
        return {
          objects: objectUpdates
        };
      }
    },
    {
      verbs: ['close'],
      start: (actor, command, output, entities) => {
        if (!command.predicate) {
          output.print(`What do you want to close?`, 'error');
          return { abort: true };
        }
        if (!command.object || !command.object.getState('isOpenable')) {
          output.print(`You can't close that!`, 'error');
          return { abort: true };
        }
        if (command.object.getState('location') !== command.setting.id &&
            (actor.getState('inventory') || []).indexOf(command.object.id) === -1) {
          output.print(`It's not here!`, 'error');
          return { abort: true };
        }
        if (!command.object.getState('isOpen')) {
          output.print(`It's already close!`, 'error');
          return { abort: true };
        }
      },
      complete: (actor, command, output, entities) => {
        output.print(`You close ${command.object.name}.`, 'story');
        const contents = (command.object.getState('contents') || []).map(id => entities.objects.getEntity(id));
        const objectUpdates = {
          [command.object.id]: { isOpen: false }
        };
        contents.forEach(object => {
          objectUpdates[object.id] = { location: null }
        });
        return {
          objects: objectUpdates
        };
      }
    },
    {
      verbs: ['pour'],
      start: (actor, command, output, entities) => {
        if (!command.predicate) {
          output.print(`What do you want to pour?`, 'error');
          return { abort: true };
        }
        if (!command.object || !command.object.getState('isPourable')) {
          output.print(`You can't pour that!`, 'error');
          return { abort: true };
        }
        if (command.object.getState('location') !== command.setting.id &&
            (actor.getState('inventory') || []).indexOf(command.object.id) === -1) {
          output.print(`It's not here!`, 'error');
          return { abort: true };
        }
        if (command.object.getState('isEmpty')) {
          output.print(`You pour ${command.object.name}, but it's empty.`, 'story');
          return { abort: true };
        }
      },
      complete: (actor, command, output, entities) => {
        output.print(`You pour ${command.object.name}.`, 'story');
      }
    },
    {
      verbs: ['jump'],
      start: (actor, command, output, entities) => {
        if (command.object) {
          output.print(`Why...?`, 'error');
          return { abort: true };
        }
        output.print(`You jump into the air!`, 'story');
        return {};
      },
      complete: (actor, command, output, entities) => {
        return {};
      }
    },
    {
      verbs: ['climb'],
      start: (actor, command, output, entities) => {
        if (!command.predicate && !command.setting.getState('isClimbable')) {
          output.print(`What do you want to climb?`, 'error');
          return { abort: true };
        }
        if (command.predicate && (!command.object || !command.object.getState('isClimbable'))) {
          output.print(`You can't climb that!`, 'error');
          return { abort: true };
        }
        return {};
      },
      complete: (actor, command, output, entities) => {
        output.print(`You climb ${command.object ? command.object.name : 'up'}.`, 'story');
        return {};
      }
    }
  ]
};
