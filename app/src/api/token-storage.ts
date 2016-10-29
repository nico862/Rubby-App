import { AsyncStorage } from "react-native";

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

export function getTokens(): Promise<TokenData> {
  return AsyncStorage.getItem("apiAccessToken")
    .then(data => {
      return JSON.parse(data);
    });
}

export function storeTokens(rawTokenData: RawTokenData): Promise<boolean> {
  console.log(rawTokenData);
  const tokenData: TokenData = {
    accessToken: rawTokenData.access_token,
    refreshToken: rawTokenData.refresh_token
  };

  return AsyncStorage.setItem("apiAccessToken", JSON.stringify(tokenData))
    .then(() => { return true; });
}
