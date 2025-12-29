import { AppConfig, UserSession } from "@stacks/connect";

export const appConfig = new AppConfig(["store_write", "publish_data"]);

// Only instantiate UserSession on the client
export const userSession = typeof window !== 'undefined' 
  ? new UserSession({ appConfig }) 
  : undefined as unknown as UserSession;
