import { AppConfig, UserSession } from "@stacks/connect";

export const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export const STORAGE_KEYS = {
  USER_DATA: "digiwin.user-data",
};

export function disconnectWallet() {
  userSession.signUserOut();
  window.location.reload();
}

export function getUserData() {
  if (userSession.isUserSignedIn()) {
    return userSession.loadUserData();
  }
  return null;
}
