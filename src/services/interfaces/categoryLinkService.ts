import { CategoryLink } from "../../utils/types.ts";

export default interface ICategoryLinkService {
  Link(params: {
    data: CategoryLink;
  }): Promise<CategoryLink>;

  Delete(params: {
    data: CategoryLink;
  }): Promise<void>;
}
