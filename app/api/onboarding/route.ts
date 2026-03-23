import { createClient } from "@/lib/supabase/server";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const body = await req.json();
    console.log("body is", body)

    const supabase = createClient(cookies());

    const {data: currentUser, error: currentUserError} = await supabase.auth.getUser();
    console.log("currentUser -----------", currentUser)

    const {data: updataedUser, error: userUpdateError} = await supabase.from('users').update({
        name: body.name,
        onboarding: true,
        genre_preference: body.genre_preferences,
        bio: body.bio,
        headline: body.headline
    }).eq('id', currentUser.user?.id).select('name, onboarding, genre_preference, bio').single();

    // const {data: updataedUser, error: userUpdateError} = await supabase.from('users').update(body).eq('id', currentUser.user?.id).select('name, onboarding, genre_preference, bio').single(); 

    if(userUpdateError) console.log("error-------",userUpdateError.message);

    return NextResponse.json({message: "user updated successfully", data: updataedUser, success: true});
}