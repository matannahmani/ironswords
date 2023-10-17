import { ImageResponse } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET() {
  const image = await fetch(new URL("/public/logo.jpg", import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 60,
          color: "white",
          background: "#181619",
          width: "100%",
          height: "100%",
          paddingTop: 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* @ts-expect-error not type correctly on vercel side. */}
        <img width="256" height="256" src={image} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <span>.לזרב תוברח תכרעמ</span>
          <span>🇮🇱 םיקזח ונחנא דחי</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
