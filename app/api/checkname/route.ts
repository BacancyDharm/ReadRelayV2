import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";


export async function POST(req: NextRequest,) {
    console.log("api hit 1")
    const supabase = createClient(cookies());
    console.log("api hit 2")
    const body = await req.json();
    console.log("body is", body)
    const username = body.username
    console.log(username)
    const { data, error} = await supabase.from('users').select('name').eq('name', username).single();
    if(error) console.log("error",error)
    
    console.log("---------", data)
    if(data?.name === username){
        return NextResponse.json({nameTaken: true, message: "name is taken"});
    }else{
        return NextResponse.json({nameTaken: false, message: "name is not taken"});
    }
}