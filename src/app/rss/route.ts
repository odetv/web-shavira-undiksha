export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
 
<channel>
  <title>Virtual Assistant Undiksha</title>
  <link>https://undiksha.ac.id</link>
  <description>Virtual Assistant Universitas Pendidikan Ganesha</description>
</channel>
 
</rss>`,
    {
      headers: {
        "Content-Type": "text/xml",
      },
    }
  );
}
