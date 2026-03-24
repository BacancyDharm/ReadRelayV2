import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import SearchBar from "../components/SearchBar";
import { useUser } from "@/hooks/useUser";


export default async function ClubPage({params} : {params: {id: string}}){
    const supabase = createClient(cookies());
    const {id: clubId} = await params;
    const {data: {user}} = await supabase.auth.getUser()
    if(!user) redirect('/login')
    const { data: club} = await supabase.from('clubs').select('*').eq('id', clubId).single();
    if(!club) redirect('/dashboard')

    
    
    
    return (
        <div>
            <Header name={user?.user_metadata.name || ""} />
            <SearchBar />

        </div>
    )
}