"use server";
import { invitationEmail } from "@/lib/resend/invitation-email";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {  z } from "zod";
import { transporter } from "@/lib/nodemailer/client";

const inviteSchema = z.object({
  clubId: z.uuid(),
  email: z.email("Invalid email address"),
});

export async function inviteMember(formData: z.infer<typeof inviteSchema>) {
  const parsed = inviteSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { clubId, email } = parsed.data;
  const supabase = await createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "not authenticated" };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, name")
    .eq("id", user.id)
    .single();
  if (!profile) {
    return { error: "Profile not found" };
  }

  const { data: club } = await supabase
    .from("clubs")
    .select("id, name, leader_id")
    .eq("id", clubId)
    .single();
  if (!club) return { error: "club not found" };
  if (club.leader_id !== profile.id)
    return { error: "You are not the leader of this club" };

  const { data: existingMember } = await supabase
    .from("club_members")
    .select("id")
    .eq("club_id", clubId)
    .eq(
      "user_id",
      (await supabase.from("users").select("id").eq("email", email).single())
        .data?.id ?? "",
    )
    .single();
  if (existingMember) {
    return { error: "User is already a member of this club" };
  }

  const { data: existingInvite } = await supabase
    .from("club_invitations")
    .select("id, expires_at")
    .eq("club_id", clubId)
    .eq("email", email)
    .is("accepted_at", null)
    .single();
  if (existingInvite && new Date(existingInvite.expires_at) > new Date()) {
    return {
      error: "An invitation has already been sent to this email address",
    };
  }

  const { data: invitation, error: inviteError } = await supabase
    .from("club_invitations")
    .insert({
      club_id: clubId,
      email,
    })
    .select("token")
    .single();
  if (inviteError) return { error: "Failed to create invitaion" };

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join/${invitation.token}`;

  // const { error: emailError } = await resend.emails.send({
  //   from: "onboarding@resend.dev",
  //   to: email,
  //   subject: "You're Invited to join the club on ReadRelay",
  //   html: invitationEmail({
  //     clubName: club.name,
  //     leaderName: profile.name!,
  //     inviteUrl,
  //   }),
  // });

  try {
    const res = await transporter.sendMail({
      from: "dharm.thakkar@bacancy.us",
      to: email,
      subject: "You're Invited to join the club on ReadRelay",
      html: invitationEmail({
        clubName: club.name,
        leaderName: profile.name!,
        inviteUrl,
      })
    })
  } catch (error) {
    console.log(error)
    await supabase
      .from("club_invitations")
      .delete()
      .eq("token", invitation.token);
    return { error: "failed to send the invitation email" };
  }

  return { success: true };
}

const invitaionAcceptSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "must contain an uppercase letter")
    .regex(/[a-z]/, "must contain a lowercase letter")
    .regex(/\d/, "must contain a number")
    .regex(/[@$!%*?&]/, "must contain a special character"),
  token: z.uuid(),
});

export async function acceptInvitation(formData: {
  name: string;
  password: string;
  token: string;
}) {
const parsedData = invitaionAcceptSchema.safeParse(formData);

  if (!parsedData.success) {
    return { error: parsedData.error.message };
  }

  const {name, password, token} = parsedData.data;
  const supabase = await createClient(cookies())


  // check for the valid invitations

  const {data: invitation, error: inviteError} = await supabase.from('club_invitations').select('id, club_id, email, expires_at, accepted_at').eq('token', token).single()

  if(inviteError || !invitation) return {error: 'Invitation not found or invalid'}

  if(invitation.accepted_at) return {error: 'Invitation already accepted'}

  if(new Date(invitation.expires_at) < new Date()) return {error: 'This invitation has expired. Ask the club leader to resend it.'}
  

  // User related checking

  const {data: existingUser} = await supabase.from('users').select('id').eq('email', invitation.email).single()

  if(existingUser) {
    const {error: memberError} = await supabase.from('club_members').insert({
      club_id: invitation.club_id,
      user_id: existingUser.id
    })

    if(memberError) return {error: 'Failed to add user to the club'}

    await supabase.from('club_invitations').update({
      accepted_at: new Date().toISOString()
    }).eq('id', invitation.id)

    const {error: signInError} = await supabase.auth.signInWithPassword({
      email: invitation.email,
      password
    })

    if(signInError) return {error: 'Failed to sign in',
      redirectTo: '/login'
    }
  }

  // if the user is new

  const {data: signUpUser, error: signUpError} = await supabase.auth.signUp({
    email: invitation.email,
    password
  })

  if(signUpError) return {error: 'Failed to sign up the new user'}

  const {data: newUser, error: newUserError} = await supabase.from('users').insert({
    id: signUpUser.user!.id,
    name,
    avatar: null,
    email: invitation.email,
    role: 'MEMBER',
    onboarding: true,
    bio: null,
    genre_preference: [],
    notification_preferences: {},
    headline: null,
  }).select('id').single()

  if(newUserError) return {error: 'Failed to create the new user'}

  const userId = newUser.id

  // add it to club

  await supabase.from('club_members').insert({
    club_id: invitation.club_id,
    user_id: userId
  })

  await supabase.from('club_invitations').update({
    accepted_at: new Date().toISOString()
  }).eq('id', invitation.id)

  await supabase.auth.signInWithPassword({
    email: invitation.email,
    password
  })
  

  return {success: true, clubId: invitation.club_id}

}

export async function getPendingInvitations(clubId: string) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("club_invitations")
    .select("id, email, expires_at, created_at")
    .eq("club_id", clubId)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (error)
    return { error: "failed to fetch pending invitations", invitations: [] };
  return { invitations: data ?? [] };
}

export async function removeMember(clubMemberId: string) {
  const supabase = await createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not authenticated" };

  const { error } = await supabase
    .from("club_members")
    .delete()
    .eq("id", clubMemberId);

  if (error) return { error: "failed to remove member" };
  return { success: true };
}

export async function getClubMembers(clubId: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("club_members")
    .select(
      "id, current_page, joined_at",
    )
    .eq("club_id", clubId)
    .single();
  
  if (error) return { error: "failed to fetch members", members: [] };
  return { members: data ?? [] };
}
