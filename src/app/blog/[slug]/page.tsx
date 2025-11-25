export default function BlogPost() {

  return (
    <div style={{ padding: "20px" }}>
      <h1>Blog Post: </h1>
      <p>This is a dynamically loaded blog article based on the URL slug.</p>

      <div>
        <h2>Post Title</h2>
        <p>Published on: 01 Jan 2025</p>
        <p>
          This is sample blog content. Replace this text with your actual article
          description. The content is loaded dynamically for each post.
        </p>
      </div>
    </div>
  );
}
