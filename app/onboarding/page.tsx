
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers";
import { useContext } from "react";
// import { UserContext } from "@/context/UserContext";
// import { useRouter } from "next/navigation";

export default async function OnboardingPage(){
    const supabase = createClient(cookies());
    // const data = useContext(UserContext);
    const {data: {session}, error} = await supabase.auth.getSession();
    console.log(session)
    if(session === null){
        console.log("session is null")
        // router.push('/login');
    }
    const {data: UserData, error: userError} = await supabase.from('users').select('*').eq('id', session!.user.id).single();
    return(
        <div>
            <h1>Welcome to ReadRelay</h1>
            <p>Please complete following details to get Started</p>
            <div>
                <form>
                    <label htmlFor="headline">Tell us in short about yourself</label>
                    <input type="text" />
                    <label htmlFor="bio">
                        Your Bio
                    </label>
                    <textarea  id="bio"></textarea>
                    <label htmlFor="genre">Genre Preference</label>
                </form>
            </div>
            <div>
                <h2>Let's get started</h2>
                <button>Create Your first club</button>
                <button>Skip for now, go to dashboard</button>
            </div>
        </div>
    )
}