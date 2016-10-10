import * as base64 from "base-64";

const config = {
  api: {
    host: "http://localhost:8080",
    clientAuth: base64.encode([
      "ruubyPAMobileApp",
      "6468dd5c-8590-11e6-ae22-56b6b6499611"
    ].join(":"))
  }
};

export default config;