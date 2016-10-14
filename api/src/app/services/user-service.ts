import * as squel from "squel";

import { extractId, convert } from "../utils/urn";
import * as db from "../database";
import { ResourceNotFound } from "../errors";
import { User } from "../business-objects";

const USER_NOT_FOUND = "USER_NOT_FOUND";

function findUserByEmailAndPassword(email: string, password: string): Promise<User> {
  const query = squel.select(db.squelSelectOptions)
    .from("members")
    .where("member_email = ? AND member_passwd = ?", email, password);

  return db.doSelect(query).then((rows) => {
    if (rows.length === 0) {
      throw new ResourceNotFound(USER_NOT_FOUND);
    };

    const row = rows[0];

    return new User({
      urn: convert("user", [row["member_id"]]),
      email: row["member_email"],
    });
  });
}

function fetchUserByUrn(urn: string): Promise<User> {
  const id = extractId("user", urn);

  const query = squel.select(db.squelSelectOptions)
    .from("members")
    .where("member_id = ?", id);

  return db.doSelect(query).then((rows: any) => {
    const row = rows[0];

    return new User({
      urn: convert("user", [row["member_id"]]),
      email: row["member_email"],
    });
  });
}

export default {
  USER_NOT_FOUND,
  fetchUserByUrn,
  findUserByEmailAndPassword,
};
