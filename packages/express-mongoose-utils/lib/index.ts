import { Request, Response, NextFunction } from 'express';

import { DbServiceWrapper as DbService } from '@skrmain/mongoose-utils';

import permissionService from './resources/permission/permission.service';
import { Permissions } from './resources/permission/permission.models';

export const successResponse = ({ message = 'Successful', data = {}, status = true, metadata = {} }) => {
    return { status, message, data, ...metadata };
};

export interface Controller {
    create: (self: this) => {};
    getDetail: (self: this) => {};
    getList: (self: this) => {};
    updateDetail: (self: this) => {};
    deleteOne: (self: this) => {};
}

export class DbController<T> implements Controller {
    protected _service: DbService<T>;
    protected _metaData: string[]; // NOTE: 1- id key, 2-singular, 3-plural
    protected _filter: { [key: string]: any } = {};
    constructor(service: DbService<T>, entityName: string[]) {
        this._service = service;
        this._metaData = entityName;
    }

    create =
        (self = this) =>
        async (req: Request, res: Response) => {
            await self._service.create(req.body);
            return res.send(successResponse({ data: {} }));
        };

    getDetail =
        (self = this) =>
        async (req: Request, res: Response) => {
            const filter = { _id: req.params[self._metaData[0]] };
            const detail = await self._service.getOne(filter);
            return res.send(successResponse({ data: { [self._metaData[1]]: detail } }));
        };

    getList =
        (self = this) =>
        async (req: Request, res: Response) => {
            const { pageNumber, pageSize, sortOrder, sortBy } = req.query as any;

            const filterArray = Object.keys(self._filter)
                .filter((key) => req.query[key])
                .map((key) => ({
                    [key]: typeof self._filter[key] === 'string' ? req.query[key] : self._filter[key](req.query[key]),
                }));
            // TODO: Remove any and add key from T
            const filter: any = filterArray.length ? filterArray.reduce((p, n) => ({ ...p, ...n })) : {};

            const list = await self._service.getMany(filter, '', {
                pageNumber,
                pageSize,
                sortOrder,
                sortBy,
            });
            const totalCount = await self._service.count(filter);

            return res.send(
                successResponse({
                    data: { [self._metaData[2]]: list },
                    metadata: { ...req.query, totalCount },
                })
            );
        };

    updateDetail =
        (self = this) =>
        async (req: Request, res: Response) => {
            await self._service.updateOne({ _id: req.params[self._metaData[0]] }, req.body);
            return res.send(successResponse({ message: 'Details Updated' }));
        };

    deleteOne =
        (self = this) =>
        async (req: Request, res: Response) => {
            await self._service.deleteOne({ _id: req.params[self._metaData[0]] });
            return res.send({ message: 'Deleted Successfully' });
        };

    checkExists =
        (self = this) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const isExist = await self._service.exists({ _id: req.params[self._metaData[0]] });
                if (isExist) {
                    return next();
                }
                res.status(404);
                throw new Error('Does not exists.');
            } catch (error) {
                return next(error);
            }
        };

    addFilter(property: string, value: any = property) {
        this._filter[property] = value;
    }
}

export class DbControllerWithPermission<T> extends DbController<T> {
    create =
        (self = this) =>
        async (req: Request, res: Response) => {
            const { userid: userId } = req.headers;
            const createdEntity = await self._service.create({ ...req.body, userId });
            await permissionService.create({
                userId,
                entity: self._metaData[1],
                entityId: createdEntity._id,
                lastUpdatedBy: userId,
                permissions: [...Object.values(Permissions)],
            });

            return res.send(successResponse({ data: {} }));
        };

    getDetail =
        (self = this) =>
        async (req: Request, res: Response) => {
            const { userid: userId } = req.headers;
            const entityId = req.params[self._metaData[0]];
            const detail = await self._service.getOne({ _id: entityId }, '-userId');
            const permissions = await permissionService.getOne({ entityId, userId });

            return res.send(
                successResponse({ data: { [self._metaData[1]]: { ...detail, permissions: permissions?.permissions } } })
            );
        };

    getList =
        (self = this) =>
        async (req: Request, res: Response) => {
            const { userid: userId } = req.headers;
            const { pageNumber, pageSize, sortOrder, sortBy } = req.query as any;

            const filterArray = Object.keys(self._filter)
                .filter((key) => req.query[key])
                .map((key) => ({
                    [key]: typeof self._filter[key] === 'string' ? req.query[key] : self._filter[key](req.query[key]),
                }));
            // TODO: Remove any and add key from T
            const filter: any = filterArray.length ? filterArray.reduce((p, n) => ({ ...p, ...n })) : {};

            const { list, totalCount } = await self._service.getManyUsingUserId({
                userId: userId,
                pageNumber,
                pageSize,
                sortOrder,
                sortBy,
                filter,
            });

            return res.send(
                successResponse({
                    data: { [self._metaData[2]]: list },
                    metadata: { ...req.query, totalCount },
                })
            );
        };

    updateDetail =
        (self = this) =>
        async (req: Request, res: Response) => {
            await self._service.updateOne({ _id: req.params[self._metaData[0]] }, req.body);
            return res.send(successResponse({ message: 'Details Updated' }));
        };

    deleteOne =
        (self = this) =>
        async (req: Request, res: Response) => {
            await permissionService.deleteMany({ entityId: req.params[self._metaData[0]] });
            await self._service.deleteOne({ _id: req.params[self._metaData[0]] });
            return res.send({ message: 'Deleted Successfully' });
        };

    checkPermission =
        (permission: Permissions, self = this) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await permissionService.exists({
                    userId: req.headers.userid,
                    entityId: req.params[self._metaData[0]],
                    permissions: { $in: [permission] },
                });

                if (result) {
                    return next();
                }
                return res.send('Invalid Permission');
            } catch (error) {
                return next(error);
            }
        };
}
