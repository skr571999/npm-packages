"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectId = exports.executeTransaction = exports.connectDb = exports.getDbModel = exports.getDbSchema = exports.DbServiceWrapper = void 0;
const mongoose_1 = __importStar(require("mongoose"));
class DbServiceWrapper {
    constructor(model) {
        this.count = (filter) => this._model.count(filter).lean();
        this.exists = (filter) => this._model.exists(filter).lean();
        this.create = (details) => this._model.create(details);
        this.updateOne = (filter, details) => this._model.updateOne(filter, details).lean();
        this.deleteOne = (filter) => this._model.deleteOne(filter).lean();
        this.deleteMany = (filter) => this._model.deleteMany(filter).lean();
        this.aggregate = (pipeline) => this._model.aggregate(pipeline);
        this.getManyUsingUserId = ({ userId, filter, pageNumber, pageSize, sortOrder, sortBy }) => __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not Implemented');
        });
        this.createSession = (details, session) => this._model.create([details], { session });
        this._model = model;
    }
    getOne(filter, select = '') {
        return this._model.findOne(filter, select + ' -__v').lean();
    }
    getMany(filter, select = '', options = {}) {
        const { pageSize, pageNumber, sortBy, sortOrder, populateParams } = options;
        const _query = this._model.find(filter, select + ' -__v');
        if (pageSize && pageNumber) {
            _query.skip((pageNumber - 1) * pageSize).limit(pageSize);
        }
        if (sortBy && sortOrder) {
            _query.sort({ [sortBy]: sortOrder });
        }
        if ((populateParams === null || populateParams === void 0 ? void 0 : populateParams.populate) || (populateParams === null || populateParams === void 0 ? void 0 : populateParams.select)) {
            _query.populate(populateParams.populate, populateParams.select);
        }
        return _query.lean().exec();
    }
}
exports.DbServiceWrapper = DbServiceWrapper;
const getDbSchema = (schemaDefinition) => {
    return new mongoose_1.Schema(schemaDefinition, { timestamps: true });
};
exports.getDbSchema = getDbSchema;
const getDbModel = (collectionName, schema) => {
    return (0, mongoose_1.model)(collectionName, schema);
};
exports.getDbModel = getDbModel;
const connectDb = (dbUri, dbName = 'test') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, mongoose_1.connect)(dbUri, { dbName });
        console.log(`[MongoDB] Connected to '${conn.connection.name}' DB`);
    }
    catch (error) {
        console.error('[MongoDB] Error 🙈 ', { error });
        process.exit(1);
    }
});
exports.connectDb = connectDb;
// TODO: Add return types
const executeTransaction = (fn) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.connection.startSession();
    try {
        yield session.startTransaction();
        const result = yield fn(session);
        // throw new Error('Invalid');
        yield session.commitTransaction();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
exports.executeTransaction = executeTransaction;
const getObjectId = (id = '') => new mongoose_1.Types.ObjectId(id);
exports.getObjectId = getObjectId;
