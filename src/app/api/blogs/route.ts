import { NextResponse } from "next/server";
import blogs from "@/lib/dummy/blogs.json";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = (searchParams.get("search") || "").toLowerCase();
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 6;

    // SEARCH FILTER
    let filteredBlogs = blogs;

    if (search) {
      filteredBlogs = blogs.filter((b) =>
        b.title.toLowerCase().includes(search)
      );
    }

    // PAGINATION
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedBlogs = filteredBlogs.slice(start, end);

    return NextResponse.json({
      blogs: paginatedBlogs,
      total: filteredBlogs.length,
      page,
      limit,
    });
  } catch (error) {
    console.error("BLOG API ERROR:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
