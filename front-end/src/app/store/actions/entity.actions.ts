import { createAction, props } from "@ngrx/store";
import { Paging } from "../models/entity.model";

export const loadPaging = createAction(
  "[Entity/API] Load Paging",
  props<{ paging: Paging }>()
);
