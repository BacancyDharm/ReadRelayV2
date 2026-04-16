import { inviteMember, removeMember } from "@/actions/invitations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Member = {
  id: string;
  current_page: number;
  last_active: string | null;
  is_co_leader: boolean;
  joined_at: string;
  users: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
};

type Invitation = {
  id: string;
  email: string;
  expires_at: string;
  created_at: string;
};

const inviteSchema = z.object({
  email: z.email("Invalid email address"),
});

type InviteForm = z.infer<typeof inviteSchema>;

export default function MembersTab({
  clubId,
  initialMembers,
  initialInvitations,
  isLeader,
}: {
  clubId: string;
  initialMembers: Member[];
  initialInvitations: Invitation[];
  isLeader: boolean;
}) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [invitations, setInvitations] =
    useState<Invitation[]>(initialInvitations);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
  });

  const onInvite = async (data: InviteForm) => {
    setIsInviting(true);
    setInviteError(null);
    setInviteSuccess(null);

    const result = await inviteMember({ clubId, email: data.email });

    if (result.error) {
      setInviteError(result.error);
      setIsInviting(false);
      return;
    }

    setInviteSuccess(`Invitation sent to ${data.email}`);
    reset();
    setIsInviting(false);
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from the club?`)) return;

    const result = await removeMember(memberId);
    if (result.error) {
      alert(result.error);
      return;
    }

    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  return (
    <div className="space-y-5">
      {isLeader && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Invite a member</h3>

          <form onSubmit={handleSubmit(onInvite)} className="flex gap-2">
            <div className="flex-1">
              <input
                type="email"
                {...register("email")}
                placeholder="member@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isInviting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 shrink-0"
            >
              {isInviting ? "Inviting..." : "Send Invite"}
            </button>
          </form>
          {inviteSuccess && (
            <p className="text-sm text-green-600 mt-2">{inviteSuccess}</p>
          )}
          {inviteError && (
            <p className="text-sm text-red-600 mt-2">{inviteError}</p>
          )}
        </div>
      )}
      {/* current members */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-3">
          Members ({members.length})
        </h3>

        {members.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No members yet. Send an invitation
          </p>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                className="flex items-center justify-between py-2"
                key={member.id}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-semibold shrink-0">
                    {member.users.name.charAt(0).toUpperCase()}
                    <p className="text-xs text-gray-400">
                      {member.users.email}
                    </p>
                  </div>
                </div>

                {isLeader && (
                  <button
                    onClick={() =>
                      handleRemoveMember(member.id, member.users.name)
                    }
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {isLeader && invitations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">
            Pending invitations ({invitations.length})
          </h3>
          <div className="space-y-2">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between py-1.5"
              >
                <p className="text-sm text-gray-700">{inv.email}</p>
                <p className="text-xs text-gray-400">
                  Expires{" "}
                  {new Date(inv.expires_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
