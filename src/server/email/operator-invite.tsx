import { getBaseUrl } from "@/trpc/shared";
import { Body } from "@react-email/body";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Heading } from "@react-email/heading";
import { Link } from "@react-email/link";
import * as React from "react";

interface OperatorInviteEmailProps {
  inviteLink?: string;
}

export const OperatorInviteEmail = ({
  inviteLink = "https://ironswords.xyz",
}: OperatorInviteEmailProps) => (
  <Html>
    <Head />
    <Preview>Log in with this magic link.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${getBaseUrl()}/logo.jpg`}
          width={48}
          height={48}
          alt="IronSwords"
        />
        <Heading style={heading}>🪄 קיבלת הזמנה להצטרף למערכת</Heading>
        <Section style={body}>
          <Text style={paragraph}>
            <Link style={link} href={inviteLink}>
              {/* 👉 Click here to sign in 👈 */}
              👈לחץ כאן כדי להתחבר👉
            </Link>
          </Text>
          <Text style={paragraph}>
            {/* If you didn't request this, please ignore this email. */}
            אם לא ביקשת זאת, אנא התעלם מההודעה.
          </Text>
        </Section>
        <Text style={paragraph}>
          {/* Best,
          <br />- IronSwords Team */}
          תודה,
          <br />- צוות חרבות ברזל
        </Text>
        <Hr style={hr} />
        <Img
          src={`${getBaseUrl()}/logo.jpg`}
          width={32}
          height={32}
          style={{
            WebkitFilter: "grayscale(100%)",
            filter: "grayscale(100%)",
            margin: "20px 0",
          }}
        />
        <Text style={footer}>
          {/* IronSwords Technologies Inc. */}
          חרבות ברזל
        </Text>
        <Text style={footer}>
          {/* 2093 Philadelphia Pike #3222, Claymont, DE 19703 */}
          {/* ישראל אילת */}
          ביחד אנחנו חזקים יותר 🇮🇱
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OperatorInviteEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/logo.jpg")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#FF6363",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};
