import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";


export async function GET(req: NextRequest,) {
    const supabase = createClient(cookies());
    const username = req.nextUrl.searchParams.get('username');
    console.log(username)
    const { data, error} = await supabase.from('users').select('name').eq('name', username).single();
    if(error) console.log("error",error)
    
    console.log("---------", data)
    if(data?.name === username){
        return NextResponse.json({nameTaken: true});
    }else{
        return NextResponse.json({nameTaken: false});
    }
}