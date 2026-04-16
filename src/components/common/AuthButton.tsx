import { useMsal } from '@azure/msal-react';
import { MSAL_CONFIG } from '../../config';
import { POWERBI_SCOPES } from '../../auth/msalConfig';
import './AuthButton.css';

export function AuthButton() {
  const { instance, accounts } = useMsal();
  const configured = Boolean(MSAL_CONFIG.clientId);

  if (!configured) return null;

  const account = accounts[0];

  if (account) {
    return (
      <div className="auth-button">
        <span className="auth-button__name" title={account.username}>
          {account.name ?? account.username}
        </span>
        <button
          className="auth-button__btn auth-button__btn--out"
          onClick={() => instance.logoutPopup()}
          title="Sign out"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      className="auth-button__btn auth-button__btn--in"
      onClick={() => instance.loginPopup({ scopes: POWERBI_SCOPES })}
    >
      Sign in to load live data
    </button>
  );
}
