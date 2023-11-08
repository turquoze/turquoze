import { OrganizationLink } from "../../utils/schema.ts";

export default interface IOrganizationLinkService {
  Link(params: {
    data: OrganizationLink;
  }): Promise<OrganizationLink>;

  Delete(params: {
    data: OrganizationLink;
  }): Promise<void>;

  GetOrganizations(params: {
    personId: string;
  }): Promise<Array<OrganizationLink>>;
}
