import { createClient } from "@/lib/supabase/client";
import JoinForm from "./components/JoinForm";
import { supabaseAdmin } from "@/lib/supabase/admin";


export default async function JoinPage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = await createClient();
  const token = (await params).token;

  const { data: invitation } = await supabaseAdmin
    .from("club_invitations")
    .select("id, email, expires_at, accepted_at, clubs( id, name, description)")
    .eq("token", token)
    .single();


  if (!invitation)
    return (
    <JoiningError title="Invitation Not Found" message="This link is invalid or has already been used. Ask your club leader to send a new one"/>
    );

  if (new Date(invitation.expires_at) < new Date())
    return (
      <>
        <JoiningError title="Invitation Expired" message="This invitation has expired. Ask your club leader to send a new one"/>
      </>
    );

    if(invitation.accepted_at){
        return (
            <JoiningError title="Alredy Joined" message="This invitation has already been used. Try logging in instead"/>
        )
    }

    const club = invitation.clubs as {id: string; name: string; description: string | null}

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-900">
                        You're Invited to join
                    </h1>
                    <p className="text-blue-600 font-semibold mt-1">{club.name}</p>
                    {club.description && (
                        <p className="text-gray-500 text-sm mt-2">{club.description}</p>
                    )}
                </div>

                <div className="mb-5 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-700">
                        Joining as {invitation.email}
                    </p>
                </div>
                
            <JoinForm token={token} email={invitation.email} clubId={club.id} />
            </div>
        </div>
    )
}

function JoiningError({
    title, message
} : {
    title: string,
    message: string
}){
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-500 text-sm">{message}</p>
              </div>
            </div>
    )
}
