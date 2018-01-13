/**
 * Game objects definition file
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr.
 * @license     MIT
 */

export default [
  {
    id: 1, name: 'a small bottle', tags: ['bottle'],
    states: [
      { key: 'description', isImmutable: true, value: (self) => {
        const description = [`There's a hand-written label on the bottle.`];
        description.push(self.getState('isPoured') ? `The bottle is empty.` : `The bottle is filled with a red liquid.`);
        return description.join('\n');
      } }
    ]
  }
];
