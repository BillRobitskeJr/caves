/**
 * Built-in action definitions
 * @copyright Bill Robitske, Jr. 2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

export default [
  {
    tags: ['get', 'take'],
    action: (output, command, location, object, game, player, locations, objects) => {
      if (!object) return output.print(`You can't get that!`, 'error');
      if (player.state.inventory.indexOf(object.id) !== -1) return output.print(`You're already carrying it!`, 'error');
      if (object.state.room !== location.id) return output.print(`It's not here!`, 'error');
      if (player.state.inventory.length >= player.identity.maxCary) return output.print(`You can't carry any more!`, 'error');
      if (object.identity.isFixed) return output.print(`Try as you might, you can't pick up it up.`, 'story');
      
      output.print(`You pick up ${object.name}.`, 'story');
      let inventory = Array.from(player.state.inventory)
      inventory.push(object.id);
      let objectsChanges = {};
      objectsChanges[object.id] = { room: null }

      return {
        player: { inventory },
        objects: objectsChanges
      }
    }
  },
  {
    tag: 'drop',
    action: (output, command, location, object, game, player, locations, objects) => {
      if (!object) return output.print(`You can't drop that!`, 'error');
      const index = player.state.inventory.indexOf(object.id);
      if (index === -1) return output.print(`You don't have it!`, 'error');
      
      output.print(`You drop up ${object.name}.`, 'story');
      let inventory = Array.from(player.state.inventory)
      inventory.splice(index, 1);
      let objectsChanges = {};
      objectsChanges[object.id] = { room: location.id }

      return {
        player: { inventory },
        objects: objectsChanges
      }
    }
  },
  {
    tag: 'go',
    action: (output, command, location, object, game, player, locations, objects) => {
      if (!location || !location.state.exits) return output.print(`You can't go there!`, 'error');
      const exit = location.state.exits.find(exit => exit.direction === command.object);
      if (!exit || !exit.destination) return output.print(`You can't go there!`, 'error');

      output.print(`You head ${exit.direction}.`, 'story');

      return {
        player: { room: exit.destination }
      };
    }
  },
  {
    tag: 'enter',
    action: (output, command, location, object, game, player, locations, objects) => {
      if (!object || !object.state.isEnterable) {
        output.print(`You can't enter that!`, 'error');
        return { abort: true };
      }
      const destination = locations.getItem(object.state.enterDestination);
      if (!destination) {
        output.print(`It doesn't seem to lead anywhere...`, 'story');
        return { abort: true };
      }

      output.print(object.state.enterTransition || `You enter ${object.name}.`, 'story');

      return {
        player: { room: destination.id }
      }
    }
  },
  {
    tag: 'leave',
    action: (output, command, location, object, game, player, locations, objects) => {
      if (!location.state.isLeavable) {
        output.print(`You can't leave here!`, 'error');
        return { abort: true };
      }
      const destinationObject = objects.getItem(location.state.leaveDestinationObject);
      if (!destinationObject || !destinationObject.state.room) {
        output.print(`...and go where?`, 'story');
        return { abort: true };
      }

      output.print(location.state.leaveTransition || `You leave ${destinationObject.name}.`, 'story');

      return {
        player: { room: destinationObject.state.room }
      }
    }
  },
  {
    tag: 'jump',
    action: (output, command, location, object, game, player, locations, objects) => {
      output.print(`You jump into the air!`, 'story');
    }
  }
]
