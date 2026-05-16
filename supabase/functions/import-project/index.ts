import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "Missing URL" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await response.text();

    const titleMatch =
      html.match(/<title>(.*?)<\/title>/i);

    const imageMatch =
      html.match(/property="og:image" content="(.*?)"/i);

    const title = titleMatch?.[1] || "Imported Sewing Project";

    const heroImage = imageMatch?.[1] || "";

    const fakeMaterials = [
      {
        name: "Main Fabric",
        amount: "1 yard",
        type: "fabric",
      },
      {
        name: "Zipper",
        amount: "14 inch",
        type: "notion",
      },
      {
        name: "Thread",
        amount: "Matching",
        type: "notion",
      },
    ];

    const fakeSteps = [
      "Cut exterior fabric pieces",
      "Cut lining pieces",
      "Attach zipper",
      "Sew exterior together",
      "Insert lining and finish",
    ];

    return new Response(
      JSON.stringify({
        success: true,
        project: {
          title,
          sourceUrl: url,
          image: heroImage,
          description: "Imported from online sewing tutorial",
          materials: fakeMaterials,
          steps: fakeSteps,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});
