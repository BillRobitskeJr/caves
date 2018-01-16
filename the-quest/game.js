/**
 * The Quest - Game definition file
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 * 
 * This game configuration is based on the example game, The Quest,
 * from How to Create Adventure Games by Christopher Lampton (1986).
 * Used under Fair Use.
 */

export default {
  actions: [
    {
      verbs: ['showPlayerLocation'],
      start: (actor, command, output, entities) => { output.clear(); },
      complete: (actor, command, output, entities) => {
        console.log(`game~complete:`, entities);
        const location = entities.locations.getEntity(entities.player.getState('location'));
        const exits = location ? (location.getState('exits') || []).map(exit => exit.direction) : [];
        const objects = location ? entities.objects.findEntities(object => object.getState('location') === location.id).map(object => `   ${object.name}`) : [];
        output.print(`You are ${location ? location.name : 'nowhere'}.`);
        output.print(`You can go: ${exits.length > 0 ? exits.join(', ') : 'nowhere'}`);
        output.print(`You can see:`);
        output.print(objects.length > 0 ? objects.join('\n') : `   nothing of interest`);
      }
    },
    {
      verbs: ['showPlayerInventory'],
      start: (actor, command, output, entities) => { output.clear(); },
      complete: (actor, command, output, entities) => {
        const inventory = (entities.player.getState('inventory') || [])
          .map(id => entities.objects.getEntity(id))
          .map(object => `   ${object.name}`);
        output.print(`You are carrying:`);
        output.print(inventory.length > 0 ? inventory.join('\n') : `   nothing`);
        const maxCarry = entities.player.getState('maxCarry') || 0;
        if (maxCarry) output.print(`You can carry ${maxCarry - inventory.length} more.`);
      }
    }
  ]
};
