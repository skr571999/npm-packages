"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModel = exports.Permissions = void 0;
const mongoose_1 = require("mongoose");
const mongoose_utils_1 = require("@skrmain/mongoose-utils");
var DbCollections;
(function (DbCollections) {
    DbCollections["permissions"] = "permissions";
})(DbCollections || (DbCollections = {}));
var Permissions;
(function (Permissions) {
    Permissions["read"] = "read";
    Permissions["write"] = "write";
    Permissions["delete"] = "delete";
    Permissions["share"] = "share";
})(Permissions || (exports.Permissions = Permissions = {}));
const PermissionSchema = (0, mongoose_utils_1.getDbSchema)({
    userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        // ref: DbCollections.user,// TODO: Check is it required
    },
    entity: {
        type: String,
        required: true,
    },
    entityId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    lastUpdatedBy: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        // ref: DbCollections.user, // TODO: check is it required
    },
    permissions: {
        type: [String],
        default: [],
        enum: Object.values(Permissions),
    },
});
exports.PermissionModel = (0, mongoose_utils_1.getDbModel)(DbCollections.permissions, PermissionSchema);
