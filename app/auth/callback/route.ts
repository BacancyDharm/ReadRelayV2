import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){
    const requestUrl = new URL(req.url);
    const code = requestUrl.searchParams.get("code");

    if(!code) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const supabase = createClient(cookies())

    const {data, error} = await supabase.auth.exchangeCodeForSession(code);

    if(error || !data.session) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const {data: existingUser} = await supabase.from('users').select('id, role, onboarding').eq('id', data.user.id).single();

    if(!existingUser){
        const { data: userData,error} = await supabase.from('users').insert({
            id: data.session.user.id,
            email: data.session.user.email as string,
            name: data.session.user.user_metadata.full_name ?? '',
            avatar: data.session.user.user_metadata.avatar_url ?? null,
            role: "LEADER",
            onboarding: false
        })
        // console.log(userData)

        if(error){
            console.error('failed to create user profile:', error.message)
            return NextResponse.redirect(new URL("/", req.url));
        }
        
        return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    if(!existingUser.onboarding)
    return NextResponse.redirect(new URL("/onboarding", req.url));

    if(existingUser.role ==='LEADER') return NextResponse.redirect(new URL("/leader/dashboard", req.url));

    return NextResponse.redirect(new URL("/member/dashboard", req.url));
}

