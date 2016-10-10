import * as pg from "pg";
import * as squel from "squel";
import config from "./config";
import {logger} from "./logger";

squel.useFlavour("postgres");

export const squelSelectOptions: any = {
  tableAliasQuoteCharacter: "",
  replaceSingleQuotes: true,
};

export function doSelect(query: any): Promise<any[]> {
  return new Promise<any[]>((resolve, reject) => {
    logger.debug(`Running query: ${query.toString()}`);

    pg.connect(config.database.ruuby, (err, client, done) => {
      if (err) {
        reject(err);
        return;
      }

      client.query(query.toString(), (err, result) => {
        done();
        if (err) {
          reject(err);
          return;
        }
        resolve(result.rows);
      });
    });
  });
}

export function doUpsert(query: any): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    logger.debug(`Running query: ${query.toString()}`);

    pg.connect(config.database.ruuby, (err, client, done) => {
      if (err) {
        reject(err);
        return;
      }

      client.query(query.toString(), (err, result) => {
        done();

        if (err) {
          reject(err);
          return;
        }

        resolve(true);
      });
    });
  });
}
