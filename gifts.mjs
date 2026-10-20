import { getStore } from "@netlify/blobs";

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function json(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

export default async (request) => {
  const store = getStore("birthday-gifts");

  if (request.method === "POST") {
    let gift;
    try {
      gift = JSON.parse(request.body || "{}");
    } catch {
      return json(400, { error: "The birthday data was not valid JSON." });
    }

    const serialized = JSON.stringify(gift);
    if (!gift || typeof gift !== "object" || !gift.to || !Array.isArray(gift.wishes)) {
      return json(400, { error: "The birthday data is incomplete. Please return to the creator and try again." });
    }
    if (Buffer.byteLength(serialized, "utf8") > 4_500_000) {
      return json(413, { error: "This birthday has too many or too-large uploads. Remove a few photos or the optional gift song and try again." });
    }

    let id;
    for (let attempt = 0; attempt < 3; attempt++) {
      id = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
      if (!(await store.get(id))) break;
      id = null;
    }
    if (!id) return json(500, { error: "Could not create a unique share ID. Please try again." });

    await store.setJSON(id, gift, {
      metadata: { createdAt: new Date().toISOString(), version: "1" },
    });
    return json(201, { id });
  }

  if (request.method === "GET") {
    const url = new URL(request.url);
    const id = url.searchParams.get("id") || "";
    if (!/^[a-f0-9]{10}$/i.test(id)) return json(400, { error: "This birthday link is invalid." });
    const gift = await store.get(id, { type: "json" });
    if (!gift) return json(404, { error: "This birthday link was not found. Ask the sender to create a new link." });
    return json(200, { gift });
  }

  return { statusCode: 405, headers: { ...headers, Allow: "GET, POST" }, body: JSON.stringify({ error: "Method not allowed." }) };
};
