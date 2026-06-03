import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  RED_POLICY_CACHE_TAG,
  fetchRedPolicyDocument,
} from "@/lib/red-policy-source";

/** Принудительно подтянуть редполитику из Google Doc и сбросить кэш страницы */
export async function POST() {
  const document = await fetchRedPolicyDocument({ fresh: true });
  revalidateTag(RED_POLICY_CACHE_TAG, "max");
  revalidatePath("/red-policy");

  return NextResponse.json({
    ok: true,
    blocks: document.blocks.length,
    title: document.hero.title,
  });
}
