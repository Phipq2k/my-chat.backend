import { FilterQuery } from "mongoose";

export interface FilterQueryOption<T> {
    entityFilterQuery?: FilterQuery<T>,
    projection?: Record<string, unknown>,
}