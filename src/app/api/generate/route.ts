import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey: string = process.env.GEMINI_API_KEY || "";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const data = await req.json();

    // Ensure the body property exists
    if (!data?.body || !data?.categories) {
      return NextResponse.json(
        { error: 'Missing "fields" in request data' },
        { status: 400 }
      );
    }

    const userPrompt = data.body;
    const selectedCategories = data.categories;
    const categoryList = selectedCategories.join(", ");
    const customPrompt = `
    Based on the input "${userPrompt}", analyze and incorporate the following categories: ${categoryList}.
    Your task is to craft a unique and innovative project title specifically tailored for computer science students. 
    
    The output should:
    1. Begin with a **clear and concise title** that captures attention.
    2. Include a **detailed description or tagline** that elaborates on the project's purpose.
    3. Highlight **relevant features** or functionalities as bullet points (optional but encouraged).
    4. Provide a **one-line summary** explaining the project's objective or significance.
    
    Ensure the output is:
    - Relevant to the input and aligned with the specified categories.
    - Reflective of emerging trends and technologies in computer science.
    - Unique, creative, and appealing to the target audience (computer science students).
    
    Format the response as follows:
    - **Title**: [Project Title]
    - **Description**: A brief paragraph explaining the project.
    - **Key Features**: (Optional) Use bullet points to list innovative or significant features.
    - **One-Line Summary**: A concise sentence summarizing the project's core idea.
    
    Remember to prioritize clarity, innovation, and alignment with the categories. Avoid generic or overused ideas, and ensure the project feels fresh and forward-thinking.
    `;

    // Initialize the AI client
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Use the prompt from the request

    // Generate content using the AI model
    const result = await model.generateContent(customPrompt);
    const response = await result.response;
    const output = await response.text();

    // Return the generated output
    return NextResponse.json({ output });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
