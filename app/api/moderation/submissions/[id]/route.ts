import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { moderateChannelSubmission } from "@/lib/channels";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "moderator") {
    return NextResponse.json({ message: "Доступ заборонено" }, { status: 403 });
  }

  const body = (await request.json()) as { action?: "approve" | "reject" };
  if (body.action !== "approve" && body.action !== "reject") {
    return NextResponse.json({ message: "Невірна дія" }, { status: 400 });
  }

  const { id } = await params;
  const result = await moderateChannelSubmission({
    submissionId: id,
    moderatorId: user.id,
    action: body.action,
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
