import { TurquozeEvent } from "../../utils/types.ts";

export default interface INotificationService {
  addListener(
    callback: EventListenerOrEventListenerObject,
    event: TurquozeEvent,
  ): void;

  notify(event: TurquozeEvent, data: Record<string, unknown>): void;

  removeListener(
    callback: EventListenerOrEventListenerObject,
    event: TurquozeEvent,
  ): void;
}
