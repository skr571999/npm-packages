import { DbService } from '@skrmain/mongoose-utils';

import { PermissionModel } from './permission.models';

class PermissionService<T> extends DbService<T> {}

export default new PermissionService(PermissionModel);
