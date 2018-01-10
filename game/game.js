/**
 * Example game definition file
 */

export default {
  name: 'The Quest',
  identity: {
    openingPages: [
      `All your live, you had heard the stories of your crazy Uncle
Simon.  He was an inventor who kept disappearing for long
periods of time, never telling anyone where he had been.`,
      `You never belived the stories, but when your uncle died and left
you his diary, you learned that they were true.  Your uncle had
discovered a magic land and a secret formula that could take him
there.  In that land was a magic ruby, and his diary contained
instructions for going there to find it.`
    ]
  },
  actions: {
  },
  reactions: {
    get: (output, command, location, object, game, player, locations, objects) => {
      if (object.tag === 'ruby') return { game: { isWon: true }};
    }
  }
}
