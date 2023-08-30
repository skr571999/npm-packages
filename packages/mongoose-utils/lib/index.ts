import mongoose, {
    FilterQuery,
    Model,
    PipelineStage,
    Schema,
    SchemaDefinition,
    SortOrder,
    connect,
    model,
    Types,
    ClientSession,
} from 'mongoose';

export interface QueryOptions {
    pageSize: number;
    pageNumber: number;
    sortBy: string;
    sortOrder: SortOrder;
    populateParams: {
        populate: string | string[];
        select: string;
    };
}

export interface DbService {
    getOne: any;
    getMany: any;
    count: any;
    exists: any;
    create: any;
    deleteOne: any;
    updateOne: any;
    getManyUsingUserId: ({}: any) => any;
}

export class DbServiceWrapper<T> implements DbService {
    private _model: Model<T>;
    constructor(model: Model<T>) {
        this._model = model;
    }

    getOne(filter: FilterQuery<T>, select = '') {
        return this._model.findOne(filter, select + ' -__v').lean();
    }

    getMany(filter: FilterQuery<T>, select = '', options: Partial<QueryOptions> = {}) {
        const { pageSize, pageNumber, sortBy, sortOrder, populateParams } = options;

        const _query = this._model.find(filter, select + ' -__v');

        if (pageSize && pageNumber) {
            _query.skip((pageNumber - 1) * pageSize).limit(pageSize);
        }
        if (sortBy && sortOrder) {
            _query.sort({ [sortBy]: sortOrder });
        }
        if (populateParams?.populate || populateParams?.select) {
            _query.populate(populateParams.populate, populateParams.select);
        }

        return _query.lean().exec();
    }

    count = (filter: FilterQuery<T>) => this._model.count(filter).lean();

    exists = (filter: FilterQuery<T>) => this._model.exists(filter).lean();

    create = (details: FilterQuery<T>) => this._model.create(details);

    updateOne = (filter: FilterQuery<T>, details: object) => this._model.updateOne(filter, details).lean();

    deleteOne = (filter: FilterQuery<T>) => this._model.deleteOne(filter).lean();

    deleteMany = (filter: any) => this._model.deleteMany(filter).lean();

    aggregate = (pipeline: PipelineStage[]) => this._model.aggregate<T>(pipeline);

    getManyUsingUserId = async ({ userId, filter, pageNumber, pageSize, sortOrder, sortBy }: any): Promise<any> => {
        throw new Error('Not Implemented');
    };

    createSession = (details: FilterQuery<T>, session: ClientSession) => this._model.create([details], { session });
}

export interface Base {
    _id?: string | Types.ObjectId;
    createdAt?: string;
    updatedAt?: string;
}

export const getDbSchema = <T>(schemaDefinition: SchemaDefinition) => {
    return new Schema<T & Base>(schemaDefinition, { timestamps: true });
};

export const getDbModel = <T>(collectionName: string, schema: Schema) => {
    return model<T & Base>(collectionName, schema);
};

export const connectDb = async (dbUri: string, dbName = 'test') => {
    try {
        const conn = await connect(dbUri, { dbName });
        console.log(`[MongoDB] Connected to '${conn.connection.name}' DB`);
    } catch (error) {
        console.error('[MongoDB] Error 🙈 ', { error });
        process.exit(1);
    }
};

// TODO: Add return types
export const executeTransaction = async (fn: (session: ClientSession) => {}) => {
    const session = await mongoose.connection.startSession();

    try {
        await session.startTransaction();

        const result = await fn(session);

        // throw new Error('Invalid');

        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

export const getObjectId = (id = '') => new Types.ObjectId(id);
