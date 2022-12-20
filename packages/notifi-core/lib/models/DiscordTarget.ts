/**
 * Target object for Dsicord accounts
 *
 * @remarks
 * Target object for Dsicord accounts
 *
 * @property {string | null} id - Id of the DiscordTarget used later to be added into a TargetGroup
 * @property {string | null} name - Friendly name (must be unique)
 *
 */
export type DiscordTarget = Readonly<{
  id: string | null;
  name: string | null;
}>;
