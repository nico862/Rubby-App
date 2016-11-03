import ApiRequest from "./request";
import * as tokenStorage from "./token-storage";

export function logIn(username: string, password: string): Promise<any> {
  const request = new ApiRequest();

  return request.authenticatePassword(username, password);
}

export function hasAccessToken(): Promise<boolean> {
  return tokenStorage.getTokens()
    .then(tokenData => {
      return (tokenData && tokenData.accessToken !== undefined);
    });
}

export function removeAccessTokens(): Promise<string> {
  return tokenStorage.removeTokens();
}
