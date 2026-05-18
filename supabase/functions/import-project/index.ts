import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function detectPlatform(url: string) {
  const hostname = new URL(url).hostname.replace("www.", "");

  if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
    return "youtube";
  }

  if (hostname.includes("tiktok.com")) {
    return "tiktok";
  }

  return "web";
}

function extractYouTubeVideoId(url: string) {
  const parsed = new URL(url);

  if (parsed.hostname.includes("youtu.be")) {
    return parsed.pathname.replace("/", "").split("?")[0];
  }

  if (parsed.pathname.includes("/shorts/")) {
    return parsed.pathname.split("/shorts/")[1]?.split("/")[0] || "";
  }

  return parsed.searchParams.get("v") || "";
}





function extractTimestampChapters(description: string) {
  if (!description) return [];

  return description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^\d{1,2}[:.]\d{2}(:\d{2})?\s+/.test(line))
    .map((line) => line.replace(".", ":"));
}

async function fetchYouTubeTranscript(videoId: string) {
  try {
    const listUrl = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`;

    const listResponse = await fetch(listUrl);
    const listXml = await listResponse.text();

    const langMatch =
      listXml.match(/lang_code="en"/) ||
      listXml.match(/lang_code="en-US"/) ||
      listXml.match(/lang_code="([^"]+)"/);

    if (!langMatch) {
      console.log("No transcript tracks found");
      return "";
    }

    const lang =
      langMatch[0].includes('lang_code="en"')
        ? "en"
        : langMatch[0].includes('lang_code="en-US"')
        ? "en-US"
        : langMatch[1];

    const transcriptUrl =
      `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=json3`;

    const transcriptResponse = await fetch(transcriptUrl);
    const transcriptJson = await transcriptResponse.json();

    const text = transcriptJson.events
      ?.map((event: any) =>
        event.segs?.map((seg: any) => seg.utf8).join("") || ""
      )
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return text || "";
  } catch (error) {
    console.log("Transcript fetch failed:", error?.message || error);
    return "";
  }
}

async function fetchYouTubeMetadata(videoId: string) {
  const apiKey = Deno.env.get("YOUTUBE_API_KEY");

  if (!apiKey || apiKey === "YOUR_YOUTUBE_API_KEY") {
    console.log("Missing real YouTube API key");
    return null;
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`
  );

  const data = await response.json();

  console.log("YouTube API response:", JSON.stringify(data).slice(0, 1200));

  const item = data.items?.[0];

  if (!item) return null;

  return {
    title: item.snippet?.title || "",
    description: item.snippet?.description || "",
    thumbnail:
      item.snippet?.thumbnails?.maxres?.url ||
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url ||
      "",
    channel: item.snippet?.channelTitle || "",
    tags: item.snippet?.tags || [],
  };
}



function splitSupplies(parsed: any) {
  const materialWords = ["fabric", "batting", "interfacing", "stabilizer", "fleece", "thread", "lining"];
  const notionWords = ["zipper", "snap", "button", "elastic", "webbing", "label", "hardware", "magnetic"];
  const toolWords = ["machine", "iron", "mat", "ruler", "rotary", "cutter", "scissors", "pins", "clips", "marker", "snips"];

  const materials: any[] = [];
  const notions: any[] = [];
  const tools: any[] = [];

  const all = [
    ...(parsed.materials || []),
    ...(parsed.notions || []),
    ...(parsed.tools || []),
  ];

  for (const item of all) {
    const name = String(item.name || item).toLowerCase();

    if (toolWords.some((word) => name.includes(word))) {
      tools.push(item);
    } else if (notionWords.some((word) => name.includes(word))) {
      notions.push(item);
    } else if (materialWords.some((word) => name.includes(word))) {
      materials.push(item);
    } else {
      materials.push(item);
    }
  }

  return { materials, notions, tools };
}



function extractImageCandidates(html: string, pageUrl: string, youtubeMetadata: any) {
  const candidates: string[] = [];

  if (youtubeMetadata?.thumbnail) candidates.push(youtubeMetadata.thumbnail);

  const patterns = [
    /property=["']og:image["'] content=["'](.*?)["']/gi,
    /name=["']twitter:image["'] content=["'](.*?)["']/gi,
    /<img[^>]+src=["'](.*?)["']/gi,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const raw = match[1];
      if (!raw) continue;

      try {
        const absolute = new URL(raw, pageUrl).toString();
        if (!absolute.includes("logo") && !absolute.includes("avatar") && !absolute.includes("icon")) {
          candidates.push(absolute);
        }
      } catch (_) {}
    }
  }

  return [...new Set(candidates)].slice(0, 12);
}



function extractTikTokMetadata(html: string, url: string) {
  const title = decode(
    html.match(/property=["']og:title["'] content=["'](.*?)["']/i)?.[1] ||
    html.match(/<title>(.*?)<\/title>/i)?.[1] ||
    "TikTok Sewing Inspiration"
  );

  const description = decode(
    html.match(/property=["']og:description["'] content=["'](.*?)["']/i)?.[1] ||
    html.match(/name=["']description["'] content=["'](.*?)["']/i)?.[1] ||
    ""
  );

  const image =
    html.match(/property=["']og:image["'] content=["'](.*?)["']/i)?.[1] ||
    html.match(/name=["']twitter:image["'] content=["'](.*?)["']/i)?.[1] ||
    "";

  return {
    title,
    description,
    image,
    sourceName: "TikTok",
    sourceUrl: url,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return json({}, 200);

  try {
    const { url } = await req.json();

  const platform = detectPlatform(url);

  console.log("Detected platform:", platform);

  let youtubeMetadata = null;
  let youtubeTranscript = "";

  if (platform === "youtube") {
    try {
      const videoId = extractYouTubeVideoId(url);

      if (videoId) {
        youtubeMetadata = await fetchYouTubeMetadata(videoId);
        youtubeTranscript = await fetchYouTubeTranscript(videoId);
      }

      console.log("YouTube metadata:", youtubeMetadata);
      console.log("YouTube transcript length:", youtubeTranscript.length);
    } catch (youtubeError) {
      console.log("YouTube metadata fetch failed:", youtubeError?.message || youtubeError);
      youtubeMetadata = null;
    }
  }
    if (!url) return json({ success: false, error: "Missing URL" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const { data: cached } = await supabase
      .from("imported_projects_cache")
      .select("response_json")
      .eq("source_url", url)
      .maybeSingle();

    if (cached?.response_json) {
      console.log("CACHE HIT", url);

      return json({
        success: true,
        project: cached.response_json,
        cached: true,
      });
    }

    console.log("CACHE MISS", url);

    const page = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml",
      },
    });

    const html = await page.text();
    const sourceName = new URL(url).hostname.replace("www.", "");

    const tiktokMetadata = platform === "tiktok"
      ? extractTikTokMetadata(html, url)
      : null;

    const fallbackTitle = decode(
      html.match(/<title>(.*?)<\/title>/i)?.[1] ||
      html.match(/property=["']og:title["'] content=["'](.*?)["']/i)?.[1] ||
      "Imported Sewing Project"
    );

    const fallbackImage = platform === "youtube"
      ? youtubeMetadata?.thumbnail || ""
      : extractBestImage(html, url);

    const metaDescription = decode(
      html.match(/name=["']description["'] content=["'](.*?)["']/i)?.[1] ||
      html.match(/property=["']og:description["'] content=["'](.*?)["']/i)?.[1] ||
      ""
    );

    const jsonLd = extractJsonLd(html);
    const usefulText = extractUsefulText(html);

    const youtubeChapters = extractTimestampChapters(youtubeMetadata?.description || "");

    const combinedContent = `
SOURCE NAME:
${youtubeMetadata?.channel || sourceName}

PLATFORM:
${platform}

YOUTUBE TITLE:
${youtubeMetadata?.title || ""}

YOUTUBE DESCRIPTION:
${youtubeMetadata?.description || ""}

YOUTUBE TRANSCRIPT:
${youtubeTranscript || ""}

YOUTUBE CHAPTERS:
${youtubeChapters.join("\n")}

YOUTUBE TAGS:
${youtubeMetadata?.tags?.join(", ") || ""}

PAGE TITLE:
${fallbackTitle}

PAGE DESCRIPTION:
${metaDescription}

STRUCTURED DATA:
${jsonLd}

PAGE TEXT:
${platform === "youtube" ? "" : usefulText}
`.slice(0, 30000);

    console.log("Import debug", {
      url,
      htmlLength: html.length,
      jsonLdLength: jsonLd.length,
      textLength: usefulText.length,
      contentLength: combinedContent.length,
      title: fallbackTitle,
    });

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Extract sewing tutorial data. Return JSON only. Find supplies/materials/tools/notions and step-by-step instructions from visible text, JSON-LD, HowTo schema, lists, captions, and image alt text. Do not invent exact measurements.",
          },
          {
            role: "user",
            content: `
Return this JSON shape:
{
  "title": "",
  "sourceUrl": "",
  "sourceName": "",
  "image": "",
  "description": "",
  "difficulty": "",
  "estimatedTime": "",
  "materials": [{"name": "", "amount": "", "type": ""}],
  "steps": [""],
  "tags": [""]
}

Source URL: ${url}
Fallback image: ${fallbackImage}

Content:
${combinedContent}
`,
          },
        ],
      }),
    });

    const aiJson = await aiResponse.json();
    console.log("OpenAI raw response", JSON.stringify(aiJson).slice(0, 3000));

    if (aiJson.error) {
      return json({ success: false, error: aiJson.error.message }, 500);
    }

    const outputText = aiJson.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(outputText);

    const supplies = splitSupplies(parsed);

    const imageCandidates = extractImageCandidates(html, url, youtubeMetadata);

    const project = {
      title: decode(parsed.title || youtubeMetadata?.title || fallbackTitle),
      sourceUrl: url,
      sourceName: parsed.sourceName || youtubeMetadata?.channel || sourceName,
      image: platform === "youtube"
        ? youtubeMetadata?.thumbnail || fallbackImage || ""
        : parsed.image || imageCandidates[0] || fallbackImage || "",
      imageCandidates,
      description: decode(parsed.description || youtubeMetadata?.description || metaDescription || ""),
      difficulty: parsed.difficulty || "",
      estimatedTime: parsed.estimatedTime || "",
      materials: supplies.materials,
      notions: supplies.notions,
      tools: supplies.tools,
      cuttingMeasurements: parsed.cuttingMeasurements || [],
      steps:
        parsed.steps?.length
          ? parsed.steps
          : youtubeChapters?.length
          ? youtubeChapters
          : [],
      tags: parsed.tags?.length ? parsed.tags : platform === "tiktok" ? ["TikTok", "Inspiration"] : [],
    };

    await supabase
      .from("imported_projects_cache")
      .upsert({
        source_url: url,
        response_json: project,
      });

    return json({
      success: true,
      project,
      cached: false,
      debug: {
        htmlLength: html.length,
        jsonLdLength: jsonLd.length,
        textLength: usefulText.length,
      },
    });
  } catch (error) {
    console.log("Import error", error);
    return json({ success: false, error: error.message }, 500);
  }
});


function extractBestImage(html: string, pageUrl: string) {
  const candidates: string[] = [];

  const jsonLdImageMatches = [...html.matchAll(/"image"\s*:\s*(".*?"|\[.*?\]|\{.*?\})/gis)];
  for (const match of jsonLdImageMatches) {
    candidates.push(...extractUrls(match[1]));
  }

  const ogImage =
    html.match(/property=["']og:image["'] content=["'](.*?)["']/i)?.[1] ||
    html.match(/content=["'](.*?)["'] property=["']og:image["']/i)?.[1];

  if (ogImage) candidates.push(ogImage);

  const twitterImage =
    html.match(/name=["']twitter:image["'] content=["'](.*?)["']/i)?.[1] ||
    html.match(/property=["']twitter:image["'] content=["'](.*?)["']/i)?.[1];

  if (twitterImage) candidates.push(twitterImage);

  const srcsetMatches = [...html.matchAll(/srcset=["']([^"']+)["']/gi)];
  for (const match of srcsetMatches) {
    const urls = match[1]
      .split(",")
      .map((part) => part.trim().split(" ")[0])
      .filter(Boolean);
    candidates.push(...urls);
  }

  const imgMatches = [...html.matchAll(/<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi)];
  for (const match of imgMatches) {
    candidates.push(match[1]);
  }

  const cleaned = candidates
    .map((candidate) => normalizeImageUrl(candidate, pageUrl))
    .filter(Boolean)
    .filter((candidate) => !candidate.includes("logo"))
    .filter((candidate) => !candidate.includes("avatar"))
    .filter((candidate) => !candidate.includes("profile"))
    .filter((candidate) => !candidate.includes("icon"))
    .filter((candidate) => !candidate.includes("blank"))
    .filter((candidate) => !candidate.includes("placeholder"))
    .filter((candidate) => /\.(jpg|jpeg|png|webp)(\?|$)/i.test(candidate));

  const unique = [...new Set(cleaned)];

  const scored = unique
    .map((image) => ({
      image,
      score:
        scoreImage(image) +
        (image.includes("wp-content") ? 10 : 0) +
        (image.includes("uploads") ? 10 : 0) +
        (image.includes("pinimg") ? 6 : 0),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.image || "";
}

function extractUrls(value: string) {
  const matches = [...value.matchAll(/https?:\/\/[^"',\]\s]+/gi)];
  return matches.map((match) => match[0]);
}

function normalizeImageUrl(value: string, pageUrl: string) {
  try {
    const decoded = decode(value).trim();

    if (!decoded || decoded.startsWith("data:")) return "";

    if (decoded.startsWith("//")) {
      return `https:${decoded}`;
    }

    if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
      return decoded;
    }

    return new URL(decoded, pageUrl).toString();
  } catch {
    return "";
  }
}

function scoreImage(image: string) {
  let score = 0;

  const widthMatch = image.match(/[-_](\d{3,4})x(\d{3,4})/);
  if (widthMatch) {
    const width = Number(widthMatch[1]);
    const height = Number(widthMatch[2]);
    score += Math.min(width, 1200) / 20;
    score += Math.min(height, 1200) / 30;
  }

  if (image.includes("featured")) score += 25;
  if (image.includes("hero")) score += 25;
  if (image.includes("tutorial")) score += 20;
  if (image.includes("sewing")) score += 20;
  if (image.includes("pattern")) score += 15;
  if (image.includes("finished")) score += 10;

  return score;
}


function extractJsonLd(html: string) {
  const matches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

  return matches
    .map((match) => decode(match[1]))
    .join("\n\n")
    .slice(0, 15000);
}

function extractUsefulText(html: string) {
  let text = html;

  text = text.replace(/<script[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

  text = text.replace(/<h1[^>]*>/gi, "\n\nHEADING: ");
  text = text.replace(/<h2[^>]*>/gi, "\n\nHEADING: ");
  text = text.replace(/<h3[^>]*>/gi, "\n\nHEADING: ");
  text = text.replace(/<h4[^>]*>/gi, "\n\nHEADING: ");
  text = text.replace(/<li[^>]*>/gi, "\n- ");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n");
  text = text.replace(/<\/div>/gi, "\n");

  text = text.replace(/alt=["']([^"']+)["']/gi, "\nIMAGE ALT: $1\n");
  text = text.replace(/title=["']([^"']+)["']/gi, "\nTITLE ATTR: $1\n");

  text = text.replace(/<[^>]+>/g, " ");
  text = decode(text);
  text = text.replace(/\s+\n/g, "\n");
  text = text.replace(/\n\s+/g, "\n");
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim().slice(0, 15000);
}

function decode(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    },
  });
}
