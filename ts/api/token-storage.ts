import { AsyncStorage } from "react-native";
import * as React from "react";

const TOKEN_STORAGE_KEY = "apiAccessToken";

export interface RawTokenData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenData {
  refreshToken: string;
  accessToken: string;
}

export function getTokens(): React.Promise<TokenData> {
  return AsyncStorage.getItem(TOKEN_STORAGE_KEY)
    .then(data => {
      return JSON.parse(data);
    });
}

export function removeTokens(): React.Promise<string> {
  return AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function storeTokens(rawTokenData: RawTokenData): React.Promise<boolean> {
  const tokenData: TokenData = {
    accessToken: rawTokenData.access_token,
    refreshToken: rawTokenData.refresh_token
  };

  return AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData))
    .then(() => { return true; });
}
