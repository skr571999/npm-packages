import { DbServiceWrapper } from '@skrmain/mongoose-utils';

import { PermissionModel } from './permission.models';

class PermissionService<T> extends DbServiceWrapper<T> {}

export default new PermissionService(PermissionModel);
