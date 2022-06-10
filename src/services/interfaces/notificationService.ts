import { TurquozeEvent } from "../../utils/types.ts";

export default interface INotificationService {
  // deno-lint-ignore ban-types
  add(events: Array<TurquozeEvent>, fn: Function, id?: string): string;

  notify(event: TurquozeEvent, id: string): void;

  remove(id: string): boolean;
}
