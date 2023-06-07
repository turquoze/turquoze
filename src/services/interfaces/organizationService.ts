import { Organization } from "../../utils/types.ts";

export default interface IOrganizationService {
  Create(params: {
    data: Organization;
  }): Promise<Organization>;

  Get(params: {
    id: string;
  }): Promise<Organization>;

  Update(params: {
    data: Organization;
  }): Promise<Organization>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
