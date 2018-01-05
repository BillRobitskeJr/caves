export default [
  {
    id: 1, name: 'in your living room',
    state: {
      exits: [
        { direction: 'north', destination: 4 },
        { direction: 'south', destination: 3 },
        { direction: 'east', destination: 2 }
      ]
    }
  },
  {
    id: 2, name: 'in the kitchen',
    state: {
      exits: [
        { direction: 'west', destination: 1 }
      ]
    }
  },
  {
    id: 3, name: 'in the library',
    state: {
      exits: [
        { direction: 'north', destination: 1 }
      ]
    }
  },
  {
    id: 4, name: 'in the front yard',
    state: {
      exits: [
        { direction: 'south', destination: 1 },
        { direction: 'west', destination: 5 }
      ]
    }
  },
  {
    id: 5, name: 'in the garage',
    state: {
      exits: [
        { direction: 'east', destination: 4 }
      ]
    }
  },
  {
    id: 6, name: 'in an open field',
    state: {
      exits: [
        { direction: 'north', destination: 9 },
        { direction: 'south', destination: 7 }
      ],
      buriedObjects: [ 11 ]
    }
  },
  {
    id: 7, name: 'at the edge of a forest',
    state: {
      exits: [
        { direction: 'north', destination: 6 }
      ]
    }
  },
  {
    id: 8, name: 'on a branch of a tree',
    state: {
      exits: [
        { direction: 'down', destination: 7 }
      ]
    }
  },
  {
    id: 9, name: 'on a long, winding road',
    state: {
      exits: [
        { direction: 'south', destination: 6 },
        { direction: 'east', destination: 10 }
      ]
    }
  },
  {
    id: 10, name: 'on a long, widing road',
    state: {
      exits: [
        { direction: 'north', destination: 11 },
        { direction: 'west', destination: 9 }
      ]
    }
  },
  {
    id: 11, name: 'on a long, winding road',
    state: {
      exits: [
        { direction: 'south', destination: 10 },
        { direction: 'west', destination: 12 }
      ]
    }
  },
  {
    id: 12, name: 'on the south bank of a river',
    state: {
      exits: [
        { direction: 'east', destination: 11 }
      ]
    }
  },
  {
    id: 13, name: 'inside a wooden boat',
    state: {
      isLeavable: true,
      leaveDestinationObject: 12,
      leaveTransition: 'You climb out of the boat and back onto land.'
    }
  },
  {
    id: 14, name: 'on the north bank of a river',
    state: {
      exits: [
        { direction: 'north', destination: 15 }
      ]
    }
  },
  {
    id: 15, name: 'on a well-traveled road',
    state: {
      exits: [
        { direction: 'north', destination: 16 },
        { direction: 'south', destination: 14 }
      ]
    }
  },
  {
    id: 16, name: 'in front of a large castle',
    state: {
      exits: [
        { direction: 'north', destination: 17 },
        { direction: 'south', destination: 15 }
      ]
    }
  },
  {
    id: 17, name: 'in a narrow hall',
    state: {
      exits: [
        { direction: 'south', destination: 16 },
        { direction: 'up', destination: 18 }
      ]
    }
  },
  {
    id: 18, name: 'in a large hall',
    state: {
      exits: [
        { direction: 'down', destination: 17 }
      ]
    }
  },
  {
    id: 19, name: 'at the top of a tree',
    state: {
      exits: [
        { direction: 'down', destination: 8 }
      ]
    }
  }
]