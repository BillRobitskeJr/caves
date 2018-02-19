
export interface GameEntityConfig {

}

export interface PlayerEntityConfig {

}

export interface LocationEntitiesConfig {

}

export interface ObjectEntitiesConfig {

}

export interface GameConfig {
  game?: GameEntityConfig;
  player?: PlayerEntityConfig;
  locations?: LocationEntitiesConfig;
  objects?: ObjectEntitiesConfig;
}
