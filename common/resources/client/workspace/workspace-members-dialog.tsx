import {useEffect, useState} from 'react';
import {AnimatePresence, m} from 'framer-motion';
import {useWorkspaceWithMembers} from './requests/workspace-with-members';
import {ProgressCircle} from '../ui/progress/progress-circle';
import {Workspace} from './types/workspace';
import {GroupIcon} from '../icons/material/Group';
import {WorkspaceMember} from './types/workspace-member';
import {useAuth} from '../auth/use-auth';
import {
  ChipField,
  ChipValue,
} from '../ui/forms/input-field/chip-field/chip-field';
import {useValueLists} from '../http/value-lists';
import {Button} from '../ui/buttons/button';
import {ArrowDropDownIcon} from '../icons/material/ArrowDropDown';
import {useInviteMembers} from './requests/invite-members';
import {WorkspaceInvite} from './types/workspace-invite';
import {ConfirmationDialog} from '../ui/overlays/dialog/confirmation-dialog';
import {useResendInvite} from './requests/resend-invite';
import {isEmail} from '../utils/string/is-email';
import {ButtonSize} from '../ui/buttons/button-size';
import {useChangeRole} from './requests/change-role';
import {IconButton} from '../ui/buttons/icon-button';
import {useRemoveMember} from './requests/remove-member';
import {CloseIcon} from '../icons/material/Close';
import {ExitToAppIcon} from '../icons/material/ExitToApp';
import {toast} from '../ui/toast/toast';
import {DialogTrigger} from '../ui/overlays/dialog/dialog-trigger';
import {Menu, MenuItem, MenuTrigger} from '../ui/navigation/menu/menu-trigger';
import {useDialogContext} from '../ui/overlays/dialog/dialog-context';
import {Dialog} from '../ui/overlays/dialog/dialog';
import {DialogHeader} from '../ui/overlays/dialog/dialog-header';
import {DialogBody} from '../ui/overlays/dialog/dialog-body';
import {Trans} from '../i18n/trans';
import {useTrans} from '../i18n/use-trans';
import {message} from '../i18n/message';
import {LeaveWorkspaceConfirmation} from './leave-workspace-confirmation';

interface WorkspaceMembersDialogProps {
  workspace: Workspace;
}
export function WorkspaceMembersDialog({
  workspace,
}: WorkspaceMembersDialogProps) {
  const {data, isLoading} = useWorkspaceWithMembers(workspace.id);
  return (
    <Dialog size="lg">
      <DialogHeader>
        <Trans message="Manage workspace members" />
      </DialogHeader>
      <DialogBody>
        {isLoading ? (
          <div className="flex min-h-[238px] items-center justify-center">
            <ProgressCircle isIndeterminate aria-label="Loading workspace..." />
          </div>
        ) : (
          <Manager workspace={data!.workspace} />
        )}
      </DialogBody>
    </Dialog>
  );
}

interface ManagerProps {
  workspace: Workspace;
}
function Manager({workspace}: ManagerProps) {
  const {user} = useAuth();
  const can = usePermissions(workspace);
  const members: (WorkspaceMember | WorkspaceInvite)[] = [
    ...(workspace.members || []),
    ...(workspace.invites || []),
  ];
  const shouldHideOtherMembers = !can.update && !can.delete;

  return (
    <div>
      {can.invite && <InviteChipField workspace={workspace} />}
      <div className="mb-14 flex items-center gap-10 text-base">
        <GroupIcon className="icon-sm" />
        <Trans
          message="Members of `:workspace`"
          values={{workspace: workspace.name}}
        />
      </div>
      <AnimatePresence initial={false}>
        {members.map(member => {
          if (shouldHideOtherMembers && member.id !== user?.id) {
            return null;
          }
          return (
            <MemberListItem
              key={`${member.model_type}.${member.id}`}
              workspace={workspace}
              member={member}
            />
          );
        })}
        {shouldHideOtherMembers && (
          <div className="text-muted">
            <Trans
              message="And [one one other member|:count other members]"
              values={{count: members.length}}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MemberListItemProps {
  member: WorkspaceMember | WorkspaceInvite;
  workspace: Workspace;
}
function MemberListItem({workspace, member}: MemberListItemProps) {
  return (
    <m.div
      initial={{x: '-100%', opacity: 0}}
      animate={{x: 0, opacity: 1}}
      exit={{x: '100%', opacity: 0}}
      transition={{type: 'tween', duration: 0.125}}
      className="mb-20 flex items-start gap-14 text-sm"
      key={`${member.model_type}.${member.id}`}
    >
      <img
        className="h-36 w-36 flex-shrink-0 rounded"
        src={member.avatar}
        alt=""
      />
      <div className="min-w-0 flex-auto items-center justify-between gap-14 md:flex">
        <div className="mb-10 overflow-hidden md:mb-0 md:mr-10">
          <div className="flex items-center justify-start gap-6">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              {member.display_name}
            </div>
            <MemberDisplayNameAppend workspace={workspace} member={member} />
          </div>
          <div className="text-muted">{member.email}</div>
        </div>
        <MemberActions workspace={workspace} member={member} />
      </div>
    </m.div>
  );
}

function usePermissions(workspace: Workspace) {
  const {user: authUser} = useAuth();
  const response = {update: false, invite: false, delete: false};
  const permissions = ['update', 'invite', 'delete'] as const;
  const authMember = workspace.members?.find(mb => mb.id === authUser?.id);

  if (authMember) {
    permissions.forEach(permission => {
      response[permission] =
        authMember.is_owner ||
        !!authMember.permissions?.find(
          p => p.name === `workspace_members.${permission}`,
        );
    });
  }

  return response;
}

interface MemberActionsProps {
  workspace: Workspace;
  member: WorkspaceMember | WorkspaceInvite;
}
function MemberActions({workspace, member}: MemberActionsProps) {
  const [selectedRole, setSelectedRole] = useState<number>(member.role_id);
  const changeRole = useChangeRole();
  const {user} = useAuth();

  const can = usePermissions(workspace);
  const isOwner = member.model_type === 'member' && member.is_owner;
  const isCurrentUser =
    member.model_type === 'member' && user?.id === member.id;

  const roleSelector =
    !can.update || isOwner || isCurrentUser ? (
      <div className="ml-auto text-muted first:capitalize">
        <Trans message={member.role_name} />
      </div>
    ) : (
      <RoleMenuTrigger
        className="ml-auto flex-shrink-0"
        size="xs"
        value={selectedRole}
        isDisabled={changeRole.isPending}
        onChange={roleId => {
          setSelectedRole(roleId);
          changeRole.mutate({
            roleId,
            workspaceId: workspace.id,
            member,
          });
        }}
      />
    );

  return (
    <>
      {roleSelector}
      {!isOwner && (isCurrentUser || can.delete) && (
        <RemoveMemberButton
          type={isCurrentUser ? 'leave' : 'remove'}
          member={member}
          workspace={workspace}
        />
      )}
    </>
  );
}

interface InviteChipFieldProps {
  workspace: Workspace;
}
function InviteChipField({workspace}: InviteChipFieldProps) {
  const {trans} = useTrans();
  const [chips, setChips] = useState<ChipValue[]>([]);
  const allEmailsValid = chips.every(chip => !chip.invalid);
  const displayWith = (chip: ChipValue) => chip.description || chip.name;
  const [selectedRole, setSelectedRole] = useState<number>();
  const inviteMembers = useInviteMembers();
  const {data} = useValueLists(['workspaceRoles']);

  useEffect(() => {
    if (!selectedRole && data?.workspaceRoles?.length) {
      setSelectedRole(data.workspaceRoles[0].id);
    }
  }, [data, selectedRole]);

  return (
    <div className="mb-30">
      <ChipField
        value={chips}
        onChange={setChips}
        displayWith={displayWith}
        validateWith={chip => {
          const invalid = !isEmail(chip.description);
          return {
            ...chip,
            invalid,
            errorMessage: invalid
              ? trans({message: 'Not a valid email'})
              : undefined,
          };
        }}
        placeholder={trans({message: 'Enter email addresses'})}
        label={<Trans message="Invite people" />}
      />
      <div className="mt-14 flex items-center justify-between gap-14">
        <RoleMenuTrigger onChange={setSelectedRole} value={selectedRole} />
        {chips.length && selectedRole ? (
          <Button
            variant="flat"
            color="primary"
            size="sm"
            disabled={inviteMembers.isPending || !allEmailsValid}
            onClick={() => {
              inviteMembers.mutate(
                {
                  emails: chips.map(c => displayWith(c)),
                  roleId: selectedRole,
                  workspaceId: workspace.id,
                },
                {
                  onSuccess: () => {
                    setChips([]);
                  },
                },
              );
            }}
          >
            <Trans message="Invite" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

interface RemoveMemberButtonProps {
  member: WorkspaceMember | WorkspaceInvite;
  workspace: Workspace;
  type: 'leave' | 'remove';
}
function RemoveMemberButton({
  member,
  workspace,
  type,
}: RemoveMemberButtonProps) {
  const removeMember = useRemoveMember();
  const {close} = useDialogContext();
  return (
    <DialogTrigger
      type="modal"
      onClose={isConfirmed => {
        if (isConfirmed) {
          removeMember.mutate({
            workspaceId: workspace.id,
            memberId: member.id,
            memberType: member.model_type,
          });
          if (type === 'leave') {
            close();
            toast(message('Left workspace'));
          }
        }
      }}
    >
      <IconButton
        size="md"
        className="flex-shrink-0 text-muted"
        disabled={removeMember.isPending}
      >
        {type === 'leave' ? <ExitToAppIcon /> : <CloseIcon />}
      </IconButton>
      {type === 'leave' ? (
        <LeaveWorkspaceConfirmation />
      ) : (
        <RemoveMemberConfirmation member={member} />
      )}
    </DialogTrigger>
  );
}

interface RemoveMemberConfirmationProps {
  member: WorkspaceMember | WorkspaceInvite;
}
function RemoveMemberConfirmation({member}: RemoveMemberConfirmationProps) {
  return (
    <ConfirmationDialog
      isDanger
      title={<Trans message="Remove member" />}
      body={
        <div>
          <Trans
            message="Are you sure you want to remove `:name`?"
            values={{name: member.display_name}}
          />
          <div className="mt-8 font-semibold">
            <Trans
              message="All workspace resources created by `:name` will be transferred to workspace owner."
              values={{
                name: member.display_name,
              }}
            />
          </div>
        </div>
      }
      confirm={<Trans message="Remove" />}
    />
  );
}

interface RoleMenuTriggerProps {
  onChange: (value: number) => void;
  value?: number;
  size?: ButtonSize;
  className?: string;
  isDisabled?: boolean;
}
function RoleMenuTrigger({
  value,
  onChange,
  size = 'xs',
  className,
  isDisabled,
}: RoleMenuTriggerProps) {
  const {data} = useValueLists(['workspaceRoles']);
  const role = data?.workspaceRoles?.find(r => r.id === value);
  if (!value || !role || !data?.workspaceRoles) return null;

  return (
    <MenuTrigger
      selectionMode="single"
      selectedValue={value}
      onSelectionChange={newValue => {
        onChange(newValue as number);
      }}
    >
      <Button
        className={className}
        size={size}
        variant="flat"
        color="chip"
        disabled={isDisabled}
        endIcon={<ArrowDropDownIcon />}
      >
        <Trans message={role.name} />
      </Button>
      <Menu>
        {data.workspaceRoles.map(r => (
          <MenuItem value={r.id} key={r.id} description={r.description}>
            <Trans message={r.name} />
          </MenuItem>
        ))}
      </Menu>
    </MenuTrigger>
  );
}

interface MemberDisplayNameAppendProps {
  member: WorkspaceMember | WorkspaceInvite;
  workspace: Workspace;
}
function MemberDisplayNameAppend({
  member,
  workspace,
}: MemberDisplayNameAppendProps) {
  const {user} = useAuth();
  const can = usePermissions(workspace);

  if (user?.id === member.id) {
    return (
      <div className="font-medium">
        (<Trans message="You" />)
      </div>
    );
  }
  if (member.model_type === 'invite') {
    return (
      <div className="flex items-center gap-4">
        <div>·</div>
        <div className="font-medium">
          <Trans message="Invited" />
        </div>
        {can.invite ? (
          <>
            <div>·</div>
            <ResendInviteDialogTrigger member={member} workspace={workspace} />
          </>
        ) : null}
      </div>
    );
  }
  return null;
}

function ResendInviteDialogTrigger({
  member,
  workspace,
}: MemberDisplayNameAppendProps) {
  const resendInvite = useResendInvite();
  return (
    <DialogTrigger
      type="modal"
      onClose={isConfirmed => {
        if (isConfirmed) {
          resendInvite.mutate({
            workspaceId: workspace.id,
            inviteId: member.id as string,
          });
        }
      }}
    >
      <Button
        variant="link"
        size="sm"
        color="primary"
        disabled={resendInvite.isPending}
      >
        <Trans message="Resend invite" />
      </Button>
      <ConfirmationDialog
        title={<Trans message="Resend invite" />}
        body={
          <Trans message="Are you sure you want to send this invite again?" />
        }
        confirm={<Trans message="Send" />}
      />
    </DialogTrigger>
  );
}
