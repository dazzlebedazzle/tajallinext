export async function GET() {
    const baseUrl = 'https://www.tajalli.co.in';
  
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const productdetail = await fetch(`${apiUrl}/api/product/allproduct`,{ cache: "no-store" });
      const data1 = await productdetail.json();
      const blog = await fetch(`${apiUrl}/api/blogs/getBlog`)
      const data2= await blog.json()
      const category = await fetch(`${apiUrl}/api/categories`)
      const data3 = await category.json()
  
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${baseUrl}</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
        <loc>${baseUrl}/Aboutus</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
        <loc>${baseUrl}/Contactus</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
        <loc>${baseUrl}/blogs</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>

        ${data1
          .map((product) => {
            const slug = product.slug;
            return `
            <url>
              <loc>${baseUrl}/product/${slug}</loc>
              <changefreq>weekly</changefreq>
              <priority>0.8</priority>
            </url>`;
          })
          .join('')}
          
          ${data2
            .map((blog) => {
              const slug = blog.slug;
              return `
              <url>
                <loc>${baseUrl}/blogs/${slug}</loc>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
              </url>`;
            })
            .join('')}
            ${data3
                .map((cat) => {
                  const slug = cat.name.replace(/\s+/g, '-');
                  return `
                  <url>
                    <loc>${baseUrl}/Shop/${slug}</loc>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                  </url>`;
                })
                .join('')}
      </urlset>`;
  
      return new Response(sitemap, {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    } catch (error) {
      console.error('Error generating sitemap:', error); // 👈 See this in server logs
      return new Response(
        '<?xml version="1.0"?><urlset></urlset>',
        {
          headers: {
            'Content-Type': 'application/xml',
          },
        }
      );
    }
  }
  