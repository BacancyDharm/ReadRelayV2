'use server'

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { z} from "zod"

const createClubSchema = z.object({
    name: z.string().min(4,"The name should be at least 4 characters long").max(80, "The name should be at most 80 characters long"),
    description: z.string().max(300, "The description should be at most 300 characters long").optional(),
    is_public: z.boolean().default(true),
    max_members: z.number().min(2, "The maximum number of members should be at least 2").max(100, "The maximum number of members should be at most 100").default(10),
    genre_tags: z.array(z.string()).default([]),
})

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function createClub(formData:z.infer<typeof createClubSchema>) {
   const parsed = createClubSchema.safeParse(formData)
   if(!parsed.success){
    return {error: parsed.error.issues[0].message}
   } 

   const supabase = createClient(cookies());

   const {data: {user}} = await supabase.auth.getUser();
   if(!user) return {error: "not authenticated"};

   const {data: profile} = await supabase.from('users').select('*').eq('id', user.id).single();

   if(!profile) return {error: "Profile not found"};

   let slug = generateSlug(parsed.data.name);

   const {data: existing} = await supabase.from('clubs').select('id').eq('slug', slug).single();

   if(existing){
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
   }

   const {data: club, error} = await supabase.from('clubs').insert({
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    is_public: parsed.data.is_public,
    max_members: parsed.data.max_members,
    genre_tags: parsed.data.genre_tags,
    leader_id: profile.id,
    slug,
   }).select('id, slug').single();

   if(error) return {error: error.message};
   return {success: true, club}
}

export async function getMyClubs() {
    const supabase = createClient(cookies());

    const {data: {user}} = await supabase.auth.getUser();
    if(!user) return {error: "not authenticated", clubs: []};

    const {data: profile} = await supabase.from('users').select('*').eq('id', user.id).single();

    if(!profile) return {error: "Profile not found", clubs: []};

    const {data: clubs, error} = await supabase.from('clubs').select('*').eq('leader_id', profile.id).order('created_at', {ascending: false});

    if(error) return {error: error.message, clubs: []};
    return {success: true, clubs: clubs ?? []};
    
}