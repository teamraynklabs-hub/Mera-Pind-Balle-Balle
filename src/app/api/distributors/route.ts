import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DistributorsPage from "@/lib/models/DistributorsPage.model";
import Distributor from "@/lib/models/Distributor.model";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    await connectDB();

    let data = await DistributorsPage.findOne({ isActive: true }).lean();

    // If no page data exists, create default
    if (!data) {
      console.log("No distributor page data found. Creating default...");
      try {
        const newPage = new DistributorsPage({
          bannerImage: "",
          benefits: [
            "Competitive commission structure",
            "Marketing support and training",
            "Quality products with guaranteed profits",
            "Dedicated distributor support team",
          ],
          requirements: [
            "Registered business entity",
            "Minimum investment capacity",
            "Valid GST registration",
            "Willingness to maintain quality standards",
          ],
          isActive: true,
        });
        
        data = await newPage.save();
        console.log("Default distributor page created successfully");
      } catch (saveError) {
        console.error("Failed to create default distributor page:", saveError);
        // Return default data even if save fails
        data = {
          bannerImage: "",
          benefits: [
            "Competitive commission structure",
            "Marketing support and training",
            "Quality products with guaranteed profits",
            "Dedicated distributor support team",
          ],
          requirements: [
            "Registered business entity",
            "Minimum investment capacity",
            "Valid GST registration",
            "Willingness to maintain quality standards",
          ],
          isActive: true,
        };
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("DISTRIBUTOR API ERROR:", error);
    // Return default fallback data on error
    return NextResponse.json({
      bannerImage: "",
      benefits: [
        "Competitive commission structure",
        "Marketing support and training",
        "Quality products with guaranteed profits",
        "Dedicated distributor support team",
      ],
      requirements: [
        "Registered business entity",
        "Minimum investment capacity",
        "Valid GST registration",
        "Willingness to maintain quality standards",
      ],
      isActive: true,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Create new distributor submission
    const distributor = await Distributor.create({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      website: body.website?.trim() || undefined,
      status: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Distributor application submitted successfully",
        data: distributor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("DISTRIBUTOR POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to submit distributor application" },
      { status: 500 }
    );
  }
}
