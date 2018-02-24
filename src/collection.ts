export interface FilterFunc<T> {
  (item: T): boolean;
}

export default class Collection<T> {
  private readonly items: T[];

  constructor(items: T[]) {
    this.items = items.map(item => item);
  }

  public findOne(findFunc: FilterFunc<T>): T|null {
    return this.items.filter(findFunc)[0] || null;
  }

  public findAll(findFunc: FilterFunc<T>): T[] {
    return this.items.filter(findFunc);
  }
}