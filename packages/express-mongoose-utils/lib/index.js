"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbControllerWithPermission = exports.DbController = exports.successResponse = void 0;
const permission_service_1 = __importDefault(require("./resources/permission/permission.service"));
const permission_models_1 = require("./resources/permission/permission.models");
const successResponse = ({ message = 'Successful', data = {}, status = true, metadata = {}, }) => {
    return Object.assign({ status, message, data }, metadata);
};
exports.successResponse = successResponse;
class DbController {
    constructor(service, entityName) {
        this._filter = {};
        this.create = (self = this) => (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield self._service.create(req.body);
            return res.send((0, exports.successResponse)({ data: {} }));
        });
        this.getDetail = (self = this) => (req, res) => __awaiter(this, void 0, void 0, function* () {
            const filter = { _id: req.params[self._metaData[0]] };
            const detail = yield self._service.getOne(filter);
            return res.send((0, exports.successResponse)({ data: { [self._metaData[1]]: detail } }));
        });
        this.getList = (self = this) => (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortOrder, sortBy } = req.query;
            const filterArray = Object.keys(self._filter)
                .filter((key) => req.query[key])
                .map((key) => ({
                [key]: typeof self._filter[key] === 'string'
                    ? req.query[key]
                    : self._filter[key](req.query[key]),
            }));
            // TODO: Remove any and add key from T
            const filter = filterArray.length
                ? filterArray.reduce((p, n) => (Object.assign(Object.assign({}, p), n)))
                : {};
            const list = yield self._service.getMany(filter, '', {
                pageNumber,
                pageSize,
                sortOrder,
                sortBy,
            });
            const totalCount = yield self._service.count(filter);
            return res.send((0, exports.successResponse)({
                data: { [self._metaData[2]]: list },
                metadata: Object.assign(Object.assign({}, req.query), { totalCount }),
            }));
        });
        this.updateDetail = (self = this) => (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield self._service.updateOne({ _id: req.params[self._metaData[0]] }, req.body);
            return res.send((0, exports.successResponse)({ message: 'Details Updated' }));
        });
        this.deleteOne = (self = this) => (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield self._service.deleteOne({ _id: req.params[self._metaData[0]] });
            return res.send({ message: 'Deleted Successfully' });
        });
        this.checkExists = (self = this) => (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield self._service.exists({
                    _id: req.params[self._metaData[0]],
                });
                if (isExist) {
                    return next();
                }
                res.status(404);
                throw new Error('Does not exists.');
            }
            catch (error) {
                return next(error);
            }
        });
        this._service = service;
        this._metaData = entityName;
    }
    addFilter(property, value = property) {
        this._filter[property] = value;
    }
}
exports.DbController = DbController;
class DbControllerWithPermission extends DbController {
    constructor() {
        super(...arguments);
        this.create = (self = this) => (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userid: userId } = req.headers;
            const createdEntity = yield self._service.create(Object.assign(Object.assign({}, req.body), { userId }));
            yield permission_service_1.default.create({
                userId,
                entity: self._metaData[1],
                entityId: createdEntity._id,
                lastUpdatedBy: userId,
                permissions: [...Object.values(permission_models_1.Permissions)],
            });
            return res.send((0, exports.successResponse)({ data: {} }));
        });
        this.getDetail = (self = this) => (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userid: userId } = req.headers;
            const entityId = req.params[self._metaData[0]];
            const detail = yield self._service.getOne({ _id: entityId }, '-userId');
            const permissions = yield permission_service_1.default.getOne({ entityId, userId });
            return res.send((0, exports.successResponse)({
                data: {
                    [self._metaData[1]]: Object.assign(Object.assign({}, detail), { permissions: permissions === null || permissions === void 0 ? void 0 : permissions.permissions }),
                },
            }));
        });
        this.getList = (self = this) => (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userid: userId } = req.headers;
            const { pageNumber, pageSize, sortOrder, sortBy } = req.query;
            const filterArray = Object.keys(self._filter)
                .filter((key) => req.query[key])
                .map((key) => ({
                [key]: typeof self._filter[key] === 'string'
                    ? req.query[key]
                    : self._filter[key](req.query[key]),
            }));
            // TODO: Remove any and add key from T
            const filter = filterArray.length
                ? filterArray.reduce((p, n) => (Object.assign(Object.assign({}, p), n)))
                : {};
            const { list, totalCount } = yield self._service.getManyUsingUserId({
                userId: userId,
                pageNumber,
                pageSize,
                sortOrder,
                sortBy,
                filter,
            });
            return res.send((0, exports.successResponse)({
                data: { [self._metaData[2]]: list },
                metadata: Object.assign(Object.assign({}, req.query), { totalCount }),
            }));
        });
        this.updateDetail = (self = this) => (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield self._service.updateOne({ _id: req.params[self._metaData[0]] }, req.body);
            return res.send((0, exports.successResponse)({ message: 'Details Updated' }));
        });
        this.deleteOne = (self = this) => (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield permission_service_1.default.deleteMany({
                entityId: req.params[self._metaData[0]],
            });
            yield self._service.deleteOne({ _id: req.params[self._metaData[0]] });
            return res.send({ message: 'Deleted Successfully' });
        });
        this.checkPermission = (permission, self = this) => (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield permission_service_1.default.exists({
                    userId: req.headers.userid,
                    entityId: req.params[self._metaData[0]],
                    permissions: { $in: [permission] },
                });
                if (result) {
                    return next();
                }
                return res.send('Invalid Permission');
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
exports.DbControllerWithPermission = DbControllerWithPermission;
