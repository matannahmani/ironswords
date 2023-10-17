type operatorInvite = {
  expires: number;
  invite_id: string;
};

const encodeInvite = (props: operatorInvite) => {
  return encodeURIComponent(
    Buffer.from(JSON.stringify(props)).toString("base64"),
  );
};

const decodeInvite = (invite: string): operatorInvite => {
  return JSON.parse(
    Buffer.from(decodeURIComponent(invite), "base64").toString("utf-8"),
  );
};

export { encodeInvite, decodeInvite };
