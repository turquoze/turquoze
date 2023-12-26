import { TurquozeEvent } from "../../utils/types.ts";
import INotificationService from "../interfaces/notificationService.ts";

export default class NotificationService extends EventTarget
  implements INotificationService {
  constructor() {
    super();
  }

  addListener(
    callback: EventListenerOrEventListenerObject,
    event: TurquozeEvent,
  ): void {
    this.addEventListener(event, callback);
  }
  notify(event: TurquozeEvent, data: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent("__internal__turquoze__event__stream__", {
        detail: data,
      }),
    );
    this.dispatchEvent(
      new CustomEvent(event, {
        detail: data,
      }),
    );
  }
  removeListener(
    callback: EventListenerOrEventListenerObject,
    event: TurquozeEvent,
  ): void {
    this.removeEventListener(event, callback);
  }
}
