import { Injectable } from '@nestjs/common';
import { type ResourceWithOptions } from 'adminjs';

@Injectable()
class AdminResourceService {
  private static resources: Set<ResourceWithOptions | any> = new Set();

  public static add(resources: (ResourceWithOptions | any)[]) {
    for (const resource of resources) {
      if (AdminResourceService.resources.has(resource)) {
        return;
      }
      AdminResourceService.resources.add(resource);
    }
  }

  public static getResources() {
    return Array.from(AdminResourceService.resources);
  }
}
  
export default AdminResourceService;
