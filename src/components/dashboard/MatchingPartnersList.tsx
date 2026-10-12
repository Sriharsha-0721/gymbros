import React from 'react';
import { DailyAvailability, UserProfile } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { GymStatusBadge } from '../common/Badge';
import { Dumbbell, Clock, Flame, Sparkles, UserPlus } from 'lucide-react';

interface MatchingPartnersListProps {
  todayAvailabilities: DailyAvailability[];
  currentUserProfile: UserProfile;
  currentUserAvailability?: DailyAvailability;
  onOpenSetPlan: () => void;
  onInviteFriend: () => void;
}

export const MatchingPartnersList: React.FC<MatchingPartnersListProps> = ({
  todayAvailabilities,
  currentUserProfile,
  currentUserAvailability,
  onOpenSetPlan,
  onInviteFriend,
}) => {
  const userStatus = currentUserAvailability?.status;
  const isUserLifting =
    userStatus && userStatus !== 'rest' && userStatus !== 'undecided';

  // Filter partners going at the matching time slot
  const matchingPartners = isUserLifting
    ? todayAvailabilities.filter(
        (a) => a.user_id !== currentUserProfile.id && a.status === userStatus
      )
    : [];

  // All other friends going today (excluding current user and rest days)
  const allGoingToday = todayAvailabilities.filter(
    (a) =>
      a.user_id !== currentUserProfile.id &&
      a.status !== 'rest' &&
      a.status !== 'undecided'
  );

  return (
    <Card className="p-5 bg-[#12141c]/90 border-[#1f2433]">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#1b202e]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#ccff00]/10 text-[#ccff00]">
            <Dumbbell size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              {isUserLifting ? 'Matching Gym Partners' : 'Who is Lifting Today?'}
            </h3>
            <p className="text-xs text-slate-400">
              {isUserLifting
                ? `Friends hitting the gym in the ${userStatus}`
                : 'Friends with plans scheduled for today'}
            </p>
          </div>
        </div>

        {isUserLifting && matchingPartners.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ccff00]/15 text-[#ccff00] text-xs font-bold border border-[#ccff00]/30">
            <Sparkles size={12} />
            {matchingPartners.length} Match{matchingPartners.length === 1 ? '' : 'es'}
          </span>
        )}
      </div>

      <div className="pt-3.5">
        {/* Case 1: User has a plan and has matching partners */}
        {isUserLifting && matchingPartners.length > 0 && (
          <div className="space-y-2.5">
            {matchingPartners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#161a25] border border-[#23293c] hover:border-[#323b54] transition-all"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={partner.profile?.avatar_url}
                    name={partner.profile?.display_name || partner.profile?.username || 'Gym Bro'}
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {partner.profile?.display_name || partner.profile?.username}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        @{partner.profile?.username}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      {partner.preferred_time && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ccff00]">
                          <Clock size={11} />
                          {partner.preferred_time}
                        </span>
                      )}
                      {partner.notes && (
                        <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          • {partner.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <GymStatusBadge status={partner.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Case 2: User has a plan but no direct match for that slot, but others are going in different slots */}
        {isUserLifting && matchingPartners.length === 0 && allGoingToday.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-3 bg-[#151924] p-3 rounded-xl border border-[#202536]">
              No friends have selected <strong className="text-white capitalize">{userStatus}</strong> yet, but {allGoingToday.length} friend{allGoingToday.length === 1 ? '' : 's'} are lifting in other slots:
            </p>
            <div className="space-y-2">
              {allGoingToday.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#161a25] border border-[#222738]"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={partner.profile?.avatar_url}
                      name={partner.profile?.display_name || partner.profile?.username || 'Gym Bro'}
                      size="sm"
                    />
                    <span className="text-xs font-bold text-white">
                      {partner.profile?.display_name || partner.profile?.username}
                    </span>
                    {partner.preferred_time && (
                      <span className="text-[11px] text-slate-400">({partner.preferred_time})</span>
                    )}
                  </div>
                  <GymStatusBadge status={partner.status} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case 3: User is undecided or rest day, show general lifters */}
        {!isUserLifting && allGoingToday.length > 0 && (
          <div className="space-y-2.5">
            {allGoingToday.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#161a25] border border-[#222738]"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={partner.profile?.avatar_url}
                    name={partner.profile?.display_name || partner.profile?.username || 'Gym Bro'}
                    size="md"
                  />
                  <div>
                    <span className="text-sm font-bold text-white block">
                      {partner.profile?.display_name || partner.profile?.username}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {partner.preferred_time && (
                        <span className="text-xs text-[#ccff00] font-semibold">
                          {partner.preferred_time}
                        </span>
                      )}
                      {partner.notes && (
                        <span className="text-xs text-slate-400">• {partner.notes}</span>
                      )}
                    </div>
                  </div>
                </div>
                <GymStatusBadge status={partner.status} size="sm" />
              </div>
            ))}
          </div>
        )}

        {/* Case 4: No friends scheduled today */}
        {allGoingToday.length === 0 && (
          <div className="text-center py-6 px-4 bg-[#141620] rounded-xl border border-dashed border-[#262c3e]">
            <Dumbbell className="mx-auto text-slate-600 mb-2" size={32} />
            <h4 className="text-sm font-bold text-white">No friends have shared plans today</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Be the first to set your gym plan or invite more bros to your squad!
            </p>
            <div className="mt-3.5 flex items-center justify-center gap-2.5">
              <button
                onClick={onOpenSetPlan}
                className="px-3.5 py-1.5 rounded-xl bg-[#ccff00] text-[#090a0f] text-xs font-bold hover:bg-[#d8ff33] transition-colors"
              >
                Set My Plan
              </button>
              <button
                onClick={onInviteFriend}
                className="px-3.5 py-1.5 rounded-xl bg-[#1b1f2c] text-white text-xs font-semibold hover:bg-[#24293a] border border-[#2b3346] transition-colors flex items-center gap-1.5"
              >
                <UserPlus size={12} />
                <span>Invite Bros</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
