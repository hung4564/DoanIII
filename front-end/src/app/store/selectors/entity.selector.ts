import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromEntity from "../reducers/entity.reducer";

export const selectEntityState = createFeatureSelector<fromEntity.State>(
  fromEntity.entitiesFeatureKey
);
const getLoading = (state: fromEntity.State) => state.loading;
const getPaging = (state: fromEntity.State) => state.paging;
export const getEntityLoading = createSelector(selectEntityState, getLoading);
export const getEntityPaging = createSelector(selectEntityState, getPaging);
