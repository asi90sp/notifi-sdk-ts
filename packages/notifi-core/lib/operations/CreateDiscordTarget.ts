import { DiscordTarget, Operation } from '../models';

export type CreateDiscordTargetInput = Readonly<{
  name: string;
  value: string;
}>;

export type CreateDiscordTargetResult = DiscordTarget;

export type CreateDiscordTargetService = Readonly<{
  createDiscordTarget: Operation<
    CreateDiscordTargetInput,
    CreateDiscordTargetResult
  >;
}>;
