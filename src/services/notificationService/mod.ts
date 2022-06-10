import { TurquozeEvent } from "../../utils/types.ts";
import INotificationService from "../interfaces/notificationService.ts";

export default class NotificationService implements INotificationService {
  // deno-lint-ignore ban-types
  notifyListeners: Map<string, { event: TurquozeEvent; fn: Function }>;

  constructor() {
    this.notifyListeners = new Map();
  }

  // deno-lint-ignore ban-types
  add(events: TurquozeEvent[], fn: Function, id?: string): string {
    if (id == undefined) {
      id = crypto.randomUUID();
    }
    events.forEach((event) => {
      this.notifyListeners.set(id!, { event, fn });
    });

    return id;
  }

  notify(event: TurquozeEvent, id: string) {
    this.notifyListeners.forEach((listener) => {
      if (listener.event == event) {
        listener.fn(event, id);
      }
    });
  }

  remove(id: string): boolean {
    if (this.notifyListeners.has(id)) {
      this.notifyListeners.delete(id);
      return true;
    } else {
      return false;
    }
  }
}
