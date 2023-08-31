"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_utils_1 = require("@skrmain/mongoose-utils");
const permission_models_1 = require("./permission.models");
class PermissionService extends mongoose_utils_1.DbService {
}
exports.default = new PermissionService(permission_models_1.PermissionModel);
