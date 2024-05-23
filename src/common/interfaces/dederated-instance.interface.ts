export interface IFederatedInstance<T extends string> {
  readonly __typename: T;
  readonly id: number;
}
