import { Action, createReducer, on } from "@ngrx/store";
import * as EntityActions from "../actions/entity.actions";
import { Paging } from "../models/entity.model";

export const entitiesFeatureKey = "entities";

export interface State {
  paging: Paging;
  loading: boolean;
}

export const initialState: State = {
  loading: false,
  paging: {}
};

const entityReducer = createReducer(
  initialState,
  on(EntityActions.loadPaging, (state, action) => ({
    ...state,
    paging: action.paging
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return entityReducer(state, action);
}
