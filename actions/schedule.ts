'use server'

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { scheduleSchema } from "@/types/section.shcema"


export async function createSchedule(formData: {
    club_book_id: string,
    page_count: number,
    sections: {
        section_number: number
        title: string
        start_page: number
        end_page: number
        deadline: string
    }[]
}){
    
    const parsedData = scheduleSchema.safeParse(formData);
    

    if(!parsedData.success){
        return {
            error: parsedData.error.issues[0].message
        }
    }

    const { club_book_id, page_count, sections} = parsedData.data

    const lastSection = sections[sections.length - 1];
    if(lastSection.end_page !== page_count){
        return {
            error: "Last section end page must be equal to page count"
        }
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {data: {user}} = await supabase.auth.getUser();
    if(!user) return {error: "not authenticated"};

    const {data: clubBook, error: clubBookError} = await supabase.from("book_club_status").select('id, club_id, clubs(leader_id)').eq('id', club_book_id).single();
    console.log("clubbook is",clubBook)

    if(!clubBook) return {error: clubBookError.message};
    
    const {data: profile} = await supabase.from('users').select('*').eq('id', user.id).single();
    
    const club = clubBook.clubs as {leader_id: string}

    if(club.leader_id !== profile?.id) return {error: "You are not the leader of this club"};

    const {error} = await supabase.from('schedule_sections').insert(
        sections.map((s) => ({
            club_book_id,
            section_number: s.section_number,
            title: s.title,
            start_page: s.start_page,
            end_page: s.end_page,
            deadline: s.deadline
        }))       
    )

    if(error) return {error: error.message};
    return {success: true};
}

export async function getSchedule(clubBookId: string){
    const supabase = createClient(cookies());

    const {data, error} = await supabase.from('schedule_sections').select('*').eq('club_book_id', clubBookId).order('section_number', {ascending: true});

    if(error) return {error: error.message, sections: []};
    return {success: true, sections: data ?? []};
}