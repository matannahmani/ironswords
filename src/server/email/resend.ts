"server-only";
import "server-only";
import { env } from "@/env.mjs";
import { Resend } from "resend";
import { type CreateEmailOptions } from "resend/build/src/emails/interfaces";

const resend = new Resend(env.RESEND_KEY);

const sendEmail = (data: CreateEmailOptions) => {
  return resend.sendEmail(data);
};

export { sendEmail };
