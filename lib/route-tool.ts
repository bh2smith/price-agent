import { NextRequest, NextResponse } from "next/server";
import { validateQuery } from "./schema";
import z from "zod";

export async function toolRouter<S extends z.ZodTypeAny, T>(
  request: NextRequest,
  schema: S,
  handler: (input: z.infer<S>) => Promise<T> | T,
  routeName: string,
): Promise<NextResponse> {
  const url = new URL(request.url);
  const validationResult = validateQuery(url.searchParams, schema);
  if (!validationResult.ok) {
    return NextResponse.json(
      { error: validationResult.error },
      { status: 400 },
    );
  }
  console.log(`${routeName}`, validationResult.query);
  try {
    const res = await handler(validationResult.query);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    // TODO: Improve Error Message.
    const publicMessage = "Internal Server Error";
    console.error(publicMessage, error);
    return NextResponse.json({ error: publicMessage }, { status: 500 });
  }
}
