import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { Profile } from '../../account-editor/profile-editor/profile-editor.component';

export interface Contracts {
  accountContract: ERC725Account;
  accountData: Profile;
  keyManagerContract: ERC734KeyManager | undefined;
}
