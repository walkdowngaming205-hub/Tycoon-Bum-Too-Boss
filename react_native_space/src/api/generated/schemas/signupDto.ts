// @ts-nocheck

export interface SignupDto {
  email: string;
  /** @minLength 6 */
  password: string;
  /** @minLength 1 */
  name: string;
  /** @minLength 1 */
  playerName: string;
  avatarEmoji?: string;
}
