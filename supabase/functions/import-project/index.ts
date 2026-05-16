import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method === "OPTIONS") return json({}, 200);

  try {
    const { url } = await req.json();
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

    const fallbackTitle = decode(
      html.match(/<title>(.*?)<\/title>/i)?.[1] ||
      html.match(/property=["']og:title["'] content=["'](.*?)["']/i)?.[1] ||
      "Imported Sewing Project"
    );

    const fallbackImage = extractBestImage(html, url);

    const metaDescription = decode(
      html.match(/name=["']description["'] content=["'](.*?)["']/i)?.[1] ||
      html.match(/property=["']og:description["'] content=["'](.*?)["']/i)?.[1] ||
      ""
    );

    const jsonLd = extractJsonLd(html);
    const usefulText = extractUsefulText(html);

    const combinedContent = `
SOURCE NAME:
${sourceName}

TITLE:
${fallbackTitle}

DESCRIPTION:
${metaDescription}

STRUCTURED DATA:
${jsonLd}

PAGE TEXT:
${usefulText}
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

    const project = {
      title: decode(parsed.title || fallbackTitle),
      sourceUrl: url,
      sourceName: parsed.sourceName || sourceName,
      image: parsed.image || fallbackImage || "",
      description: decode(parsed.description || metaDescription || ""),
      difficulty: parsed.difficulty || "",
      estimatedTime: parsed.estimatedTime || "",
      materials: parsed.materials || [],
      steps: parsed.steps || [],
      tags: parsed.tags || [],
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
