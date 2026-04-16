import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ClubWorkSpace from "./components/ClubWorkSpace";
import { getCurrentBook } from "@/actions/books";
import { getSchedule } from "@/actions/schedule";
import { getClubMembers, getPendingInvitations } from "@/actions/invitations";

export default async function ClubPage({ params }: { params: { id: string } }) {
  const supabase = createClient(cookies());
  const id = (await params).id
  console.log("clubId is ", typeof id, id)

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("user is not here")
    redirect("/login")
  };

  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", id)
    .single();
  if (!club) {
    console.log("club not found")
    if(user?.role === 'LEADER') redirect('/dashboard');
    else redirect('/');
  };

  const { book } = await getCurrentBook(id);
  console.log("book is", book)

  const { data: profile } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", user.id)
    .single();

  const isLeader = profile?.id === club.leader_id;

  const sections = book ? (await getSchedule(book.id)).sections : [];

  const [{ members }, { invitations }] = await Promise.all([
    getClubMembers(id),
    isLeader
      ? getPendingInvitations((await params).id)
      : Promise.resolve({
          invitations: [],
        }),
  ]);
  console.log("club members are", members)
  console.log("invitations are", invitations)

  return (
    <div>
      <ClubWorkSpace
        club={club}
        initialBook={book}
        isLeader={isLeader}
        initialSections={sections}
        initialMembers={members}
        initialInvitations={invitations}
      />
    </div>
  );
}
