import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { SiteEntry, SiteMembershipRequestBody } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { BehaviorSubject, from } from 'rxjs';

export interface LibraryMembershipToggleEvent {
  updatedEntry?: any;
  shouldReload: boolean;
  i18nKey: string;
}

export interface LibraryMembershipErrorEvent {
  error: any;
  i18nKey: string;
}

@Directive({
  selector: '[appLibraryMembership]',
  exportAs: 'libraryMembership'
})
export class LibraryMembershipDirective implements OnChanges {
  targetSite: any = null;

  isJoinRequested: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /** Site for which to toggle the membership request. */
  @Input('appLibraryMembership')
  selection: SiteEntry = null;

  @Output() toggle: EventEmitter<
    LibraryMembershipToggleEvent
  > = new EventEmitter();
  @Output() error: EventEmitter<
    LibraryMembershipErrorEvent
  > = new EventEmitter();

  @HostListener('click')
  onClick() {
    this.toggleMembershipRequest();
  }

  constructor(private alfrescoApiService: AlfrescoApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      !changes.selection.currentValue ||
      !changes.selection.currentValue.entry
    ) {
      this.targetSite = null;

      return;
    }
    this.targetSite = changes.selection.currentValue.entry;
    this.markMembershipRequest();
  }

  toggleMembershipRequest() {
    if (!this.targetSite) {
      return;
    }

    if (this.targetSite.joinRequested) {
      this.cancelJoinRequest().subscribe(
        () => {
          this.targetSite.joinRequested = false;
          this.isJoinRequested.next(false);
          const info = {
            updatedEntry: this.targetSite,
            shouldReload: false,
            i18nKey: 'APP.MESSAGES.INFO.JOIN_CANCELED'
          };
          this.toggle.emit(info);
        },
        error => {
          const errWithMessage = {
            error,
            i18nKey: 'APP.MESSAGES.ERRORS.JOIN_CANCEL_FAILED'
          };
          this.error.emit(errWithMessage);
        }
      );
    }

    if (!this.targetSite.joinRequested) {
      this.joinLibraryRequest().subscribe(
        createdMembership => {
          this.targetSite.joinRequested = true;
          this.isJoinRequested.next(true);

          if (
            createdMembership.entry &&
            createdMembership.entry.site &&
            createdMembership.entry.site.role
          ) {
            const info = {
              shouldReload: true,
              i18nKey: 'APP.MESSAGES.INFO.JOINED'
            };
            this.toggle.emit(info);
          } else {
            const info = {
              updatedEntry: this.targetSite,
              shouldReload: false,
              i18nKey: 'APP.MESSAGES.INFO.JOIN_REQUESTED'
            };
            this.toggle.emit(info);
          }
        },
        error => {
          const errWithMessage = {
            error,
            i18nKey: 'APP.MESSAGES.ERRORS.JOIN_REQUEST_FAILED'
          };

          const senderEmailCheck = 'Failed to resolve sender mail address';
          const receiverEmailCheck =
            'All recipients for the mail action were invalid';

          if (error.message) {
            if (error.message.includes(senderEmailCheck)) {
              errWithMessage.i18nKey =
                'APP.MESSAGES.ERRORS.INVALID_SENDER_EMAIL';
            } else if (error.message.includes(receiverEmailCheck)) {
              errWithMessage.i18nKey =
                'APP.MESSAGES.ERRORS.INVALID_RECEIVER_EMAIL';
            }
          }

          this.error.emit(errWithMessage);
        }
      );
    }
  }

  markMembershipRequest() {
    if (!this.targetSite) {
      return;
    }

    this.getMembershipRequest().subscribe(
      data => {
        if (data.entry.id === this.targetSite.id) {
          this.targetSite.joinRequested = true;
          this.isJoinRequested.next(true);
        }
      },
      () => {
        this.targetSite.joinRequested = false;
        this.isJoinRequested.next(false);
      }
    );
  }

  private joinLibraryRequest() {
    const memberBody = <SiteMembershipRequestBody>{
      id: this.targetSite.id
    };
    return from(
      this.alfrescoApiService.peopleApi.addSiteMembershipRequest(
        '-me-',
        memberBody
      )
    );
  }

  private cancelJoinRequest() {
    return from(
      this.alfrescoApiService.peopleApi.removeSiteMembershipRequest(
        '-me-',
        this.targetSite.id
      )
    );
  }

  private getMembershipRequest() {
    return from(
      this.alfrescoApiService.peopleApi.getSiteMembershipRequest(
        '-me-',
        this.targetSite.id
      )
    );
  }
}
