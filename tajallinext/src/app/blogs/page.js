import Link from "next/link";
import style from './BlogList.module.css'
import Image from "next/image";

async function fetchAllBlogs() {
    const baseURL = "https://api.tajalli.co.in";
    try {
        const response = await fetch(`${baseURL}/api/blogs/getBlog`, { cache: "no-store" }); // No cache ensures fresh data
        return await response.json();
    } catch (error) {
        console.error("Error fetching blog data:", error);
        return [];
    }
}
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

export default async function BlogListPage() {
    const blogs = await fetchAllBlogs();

    return (
        <div className="bloglist">
          <section className={style.aboutus_header}>
    
            <h1>
              <strong>Blogs</strong>
            </h1>
            
          </section>
          <section>
          <div className="container py-5">
              <div className="row">
                  {blogs.map((data)=>{
                      const urltitle = data.title.slice(0, data.title.indexOf("|")).trim();
                      const formattedTitle = urltitle.replace(/\s+/g, '-').replace(/[%|]/g, '');
                                        
                      return(
                          <div className="col-lg-4 col-md-6 mt-4" key={data._id}>
                              <Link href={`/blogs/${data.slug }`} className={style.bloglink}>
                              <div className={style.bloglistitem}>
                              <Image width={500} height={500} src={data.image} alt={data.title} />
                              <div className={style.blogdesc}>
                              <h3>{data.title}</h3>
                              <p>{data.desc}</p>
                              <div className={style.writerdetail}><p>{data.author}</p><p>{formatDate(data.createdAt)}</p></div>
                              </div>
                              </div>
                              </Link>
                          </div>
  
                      )
                  })}
              </div>
          </div>
          </section>
      </div>
    );
}
