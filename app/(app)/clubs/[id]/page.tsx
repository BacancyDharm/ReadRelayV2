import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ClubWorkSpace from "../components/ClubWorkSpace";
import { getCurrentBook } from "@/actions/books";
import { getSchedule } from "@/actions/schedule";


export default async function ClubPage({params} : {params: {id: string}}){
    const supabase = createClient(cookies());

    const {data: {user}} = await supabase.auth.getUser()
    if(!user) redirect('/login')
    
    const { data: club} = await supabase.from('clubs').select('*').eq('id', (await params).id).single();
    if(!club) redirect('/dashboard')

    const {book} = await getCurrentBook((await params).id);

    const {data:profile} = await supabase.from('users').select('id, role').eq('id', user.id).single();

    const isLeader = profile?.id === club.leader_id

    const sections = book ? (await getSchedule(book.id)).sections : []
    
    
    return (
        <div>
           <ClubWorkSpace club={club} initialBook={book} isLeader={isLeader} initialSections={sections}/> 
        </div>
    )
}