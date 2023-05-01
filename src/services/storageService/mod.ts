/*import { SupabaseClient } from "../../deps.ts";
import { Media } from "../../utils/types.ts";
import IStorageService from "../interfaces/storageService.ts";

export default class StorageService implements IStorageService {
  client: SupabaseClient;
  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async Create(params: { data: Media }): Promise<string> {
    let name = `private/${params.data.name}`;
    let bucket = "private";
    if (params.data.public) {
      name = `public/${params.data.name}`;
      bucket = "public";
    }

    const { error } = await this.client.storage
      .from(bucket)
      .upload(name, params.data.file);

    if (error != null) {
      throw error;
    } else {
      const { publicURL, error } = this.client.storage
        .from(bucket)
        .getPublicUrl(name);

      if (error != null) {
        throw error;
      } else {
        return publicURL ?? "";
      }
    }
  }

  async Get(params: { name: string; public: boolean }): Promise<string> {
    let name = `private/${params.name}`;
    let bucket = "private";
    if (params.public) {
      name = `public/${params.name}`;
      bucket = "public";
    }

    const { publicURL, error } = this.client.storage
      .from(bucket)
      .getPublicUrl(name);

    if (error != null) {
      throw error;
    } else {
      await new Promise((resolve, _) => {
        resolve("");
      });
      return publicURL ?? "";
    }
  }

  async Delete(params: { name: string; public: boolean }): Promise<void> {
    let name = `private/${params.name}`;
    let bucket = "private";
    if (params.public) {
      name = `public/${params.name}`;
      bucket = "public";
    }

    const { error } = await this.client.storage
      .from(bucket)
      .remove([name]);

    if (error != null) {
      throw error;
    }
  }
}
*/
