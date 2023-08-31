import { Types } from 'mongoose';

import { getDbModel, getDbSchema } from '@skrmain/mongoose-utils';

enum DbCollections {
    permissions = 'permissions',
}

export enum Permissions {
    read = 'read',
    write = 'write',
    delete = 'delete',
    share = 'share',
}

export interface Permission {
    userId: any;
    entity: string;
    entityId: any;
    lastUpdatedBy: any;
    permissions: Permissions;
}

const PermissionSchema = getDbSchema<Permissions>({
    userId: {
        type: Types.ObjectId,
        required: true,
        // ref: DbCollections.user,// TODO: Check is it required
    },
    entity: {
        type: String,
        required: true,
    },
    entityId: {
        type: Types.ObjectId,
        required: true,
    },
    lastUpdatedBy: {
        type: Types.ObjectId,
        required: true,
        // ref: DbCollections.user, // TODO: check is it required
    },
    permissions: {
        type: [String],
        default: [],
        enum: Object.values(Permissions),
    },
});

export const PermissionModel = getDbModel<Permission>(DbCollections.permissions, PermissionSchema);
