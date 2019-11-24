import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, mergeMap, take } from "rxjs/operators";
import { ContentManagementService } from "../../services/content-management.service";
import { AppStore } from "../states/app.state";
import {
  DeleteLibraryAction,
  LibraryActionTypes,
  LeaveLibraryAction,
  CreateLibraryAction,
  NavigateLibraryAction,
  UpdateLibraryAction,
  UpdateMemberLibraryAction,
  DeleteMemberLibraryAction,
  AddMemberLibraryAction,
  ApproveMemberLibraryAction,
  RejectMemberLibraryAction,
  AddApproveFolderAction,
  DeleteApproveFolderAction,
  RejectLibraryNodeAction,
  ApproveLibraryNodeAction
} from "../actions/library.actions";
import {
  getAppSelection,
  getRepositoryStatus,
  getNavigationState,
  getCurrentSite
} from "../selectors/app.selector";
import { NavigateRouteAction } from "../actions/router.actions";
import { SnackbarErrorAction } from "../actions/snackbar.actions";
import { ContentApiService } from "app/services/content-api.service";
import { ReloadDocumentListAction } from "../actions/app.action";

@Injectable()
export class LibraryEffects {
  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private content: ContentManagementService,
    private contentApi: ContentApiService
  ) {}

  @Effect({ dispatch: false })
  deleteLibrary$ = this.actions$.pipe(
    ofType<DeleteLibraryAction>(LibraryActionTypes.Delete),
    map(action => {
      if (action.payload) {
        this.content.deleteLibrary(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.library) {
              this.content.deleteLibrary(selection.library.entry.id);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  leaveLibrary$ = this.actions$.pipe(
    ofType<LeaveLibraryAction>(LibraryActionTypes.Leave),
    map(action => {
      if (action.payload) {
        this.content.leaveLibrary(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.library) {
              this.content.leaveLibrary(selection.library.entry.id);
            }
          });
      }
    })
  );

  @Effect()
  createLibrary$ = this.actions$.pipe(
    ofType<CreateLibraryAction>(LibraryActionTypes.Create),
    mergeMap(() => this.content.createLibrary()),
    map(library => new NavigateLibraryAction(library))
  );

  @Effect({ dispatch: false })
  navigateLibrary$ = this.actions$.pipe(
    ofType<NavigateLibraryAction>(LibraryActionTypes.Navigate),
    map(action => {
      const library = action.payload.entry;
      if (library) {
        this.contentApi
          .getNode(library.guid, { relativePath: "/documentLibrary" })
          .subscribe(
            () => {
              this.store.dispatch(
                new NavigateRouteAction(["libraries", library.id])
              );
            },
            () => {
              this.store.dispatch(
                new SnackbarErrorAction("APP.MESSAGES.ERRORS.MISSING_CONTENT")
              );
            }
          );
      }
    })
  );

  @Effect({ dispatch: false })
  updateLibrary$ = this.actions$.pipe(
    ofType<UpdateLibraryAction>(LibraryActionTypes.Update),
    map(action => {
      if (action.payload) {
        const { id, title, description, visibility } = action.payload;
        const siteBody = {
          title,
          description,
          visibility
        };
        this.content.updateLibrary(id, siteBody);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.library) {
              const { id } = selection.library.entry;
              const {
                title,
                description,
                visibility
              } = selection.library.entry;

              const siteBody = {
                title,
                description,
                visibility
              };

              this.content.updateLibrary(id, siteBody);
            }
          });
      }
    })
  );
  @Effect({ dispatch: false })
  addeMemberLibrary$ = this.actions$.pipe(
    ofType<AddMemberLibraryAction>(LibraryActionTypes.AddMember),
    map(action => {
      this.store.select(getNavigationState).subscribe(navigation => {
        if (navigation.currentSite) {
          this.content.addMemberLibrary(navigation.currentSite.id);
        }
      });
    })
  );
  @Effect({ dispatch: false })
  updateMemberLibrary$ = this.actions$.pipe(
    ofType<UpdateMemberLibraryAction>(LibraryActionTypes.UpdateMember),
    map(action => {
      this.store.select(getNavigationState).subscribe(navigation => {
        if (navigation.currentSite) {
          const data = action.payload;
          this.content.updateMemberLibrary(
            navigation.currentSite.id,
            data.personId,
            {
              role: data.role
            }
          );
        }
      });
    })
  );
  @Effect({ dispatch: false })
  deleteMemberLibrary$ = this.actions$.pipe(
    ofType<DeleteMemberLibraryAction>(LibraryActionTypes.DeleteMember),
    map(action => {
      this.store.select(getNavigationState).subscribe(navigation => {
        if (navigation.currentSite) {
          const data = action.payload;
          this.content.deleteMemberLibrary(
            navigation.currentSite.id,
            data.entry.person.id
          );
        }
      });
    })
  );
  @Effect({ dispatch: false })
  ApproveMemberLibrary$ = this.actions$.pipe(
    ofType<ApproveMemberLibraryAction>(LibraryActionTypes.ApproveMember),
    map(action => {
      this.store.select(getNavigationState).subscribe(navigation => {
        if (navigation.currentSite) {
          const data = action.payload;
          this.content.approveMemberLibrary(
            navigation.currentSite.id,
            data.entry.person.id
          );
        }
      });
    })
  );
  @Effect({ dispatch: false })
  RejectMemberLibrary$ = this.actions$.pipe(
    ofType<RejectMemberLibraryAction>(LibraryActionTypes.RejectMember),
    map(action => {
      this.store.select(getNavigationState).subscribe(navigation => {
        if (navigation.currentSite) {
          const data = action.payload;
          this.content.rejectMemberLibrary(
            navigation.currentSite.id,
            data.entry.person.id
          );
        }
      });
    })
  );
  @Effect({ dispatch: false })
  addApproveFolder$ = this.actions$.pipe(
    ofType<AddApproveFolderAction>(LibraryActionTypes.AddApproveFolder),
    map(action => {
      if (action.payload) {
        this.contentApi
          .createApproveFolder(action.payload.guid)
          .subscribe(() => {
            this.store.select(getCurrentSite).subscribe(site => {
              site.isApprove = true;
              this.content.libraryUpdated.next({ entry: site });
            });
          })
          .unsubscribe();
      }
    })
  );
  @Effect({ dispatch: false })
  deleteApproveFolder$ = this.actions$.pipe(
    ofType<DeleteApproveFolderAction>(LibraryActionTypes.DeleteApproveFolder),
    map(action => {
      if (action.payload) {
        this.contentApi
          .deleteNode(action.payload, { permanent: true })
          .subscribe(() => {
            this.store.select(getCurrentSite).subscribe(site => {
              site.isApprove = false;
              this.content.libraryUpdated.next({ entry: site });
            });
          })
          .unsubscribe();
      }
    })
  );
  @Effect({ dispatch: false })
  rejectLibraryNode$ = this.actions$.pipe(
    ofType<RejectLibraryNodeAction>(LibraryActionTypes.RejectLibraryNode),
    map(action => {
      if (action.payload) {
        const data = action.payload.entry;
        this.contentApi
          .deleteNode(data.id, { permanent: true })
          .subscribe(() => {
            this.store.dispatch(new ReloadDocumentListAction());
          });
      }
    })
  );
  @Effect({ dispatch: false })
  approveLibraryNode$ = this.actions$.pipe(
    ofType<ApproveLibraryNodeAction>(LibraryActionTypes.ApproveLibraryNode),
    map(action => {
      if (action.payload) {
        const data = action.payload.entry;
        this.store.select(getNavigationState).subscribe(navigate => {
          if (
            navigate.currentSite &&
            navigate.currentSite.nodeIdFolderDocument
          ) {
            this.contentApi
              .moveFile(data.id, navigate.currentSite.nodeIdFolderDocument)
              .subscribe(() => {
                this.store.dispatch(new ReloadDocumentListAction());
              });
          }
        });
      }
    })
  );
}
