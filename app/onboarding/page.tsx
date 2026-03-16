import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers";
import { json } from "stream/consumers";

export default async function OnboardingPage(){
    const supabase = createClient(cookies());
    const {data, error} = await supabase.auth.getSession();

    return(
        <div>
            
        </div>
    )
}