import {ColumnConfig} from '@common/datatable/column-config';
import {User} from '@common/auth/user';
import {Trans} from '@common/i18n/trans';
import {NameWithAvatar} from '@common/datatable/column-templates/name-with-avatar';
import {CheckIcon} from '@common/icons/material/Check';
import {CloseIcon} from '@common/icons/material/Close';
import {ChipList} from '@common/ui/forms/input-field/chip-field/chip-list';
import {Chip} from '@common/ui/forms/input-field/chip-field/chip';
import {Link} from 'react-router-dom';
import clsx from 'clsx';
import {FormattedDate} from '@common/i18n/formatted-date';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {IconButton} from '@common/ui/buttons/icon-button';
import {EditIcon} from '@common/icons/material/Edit';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {PersonOffIcon} from '@common/icons/material/PersonOff';
import {BanUserDialog} from '@common/admin/users/ban-user-dialog';
import React from 'react';
import {useUnbanUser} from '@common/admin/users/requests/use-unban-user';
import {ConfirmationDialog} from '@common/ui/overlays/dialog/confirmation-dialog';
import {useImpersonateUser} from '@common/admin/users/requests/use-impersonate-user';
import {LoginIcon} from '@common/icons/material/Login';

export const userDatatableColumns: ColumnConfig<User>[] = [
  {
    key: 'name',
    allowsSorting: true,
    sortingKey: 'email',
    width: 'flex-3 min-w-200',
    visibleInMode: 'all',
    header: () => <Trans message="User" />,
    body: user => (
      <NameWithAvatar
        image={user.avatar}
        label={user.display_name}
        description={user.email}
      />
    ),
  },
  {
    key: 'subscribed',
    header: () => <Trans message="Subscribed" />,
    width: 'w-96',
    body: user =>
      user.subscriptions?.length ? (
        <CheckIcon className="text-positive icon-md" />
      ) : (
        <CloseIcon className="text-danger icon-md" />
      ),
  },
  {
    key: 'roles',
    header: () => <Trans message="Roles" />,
    body: user => (
      <ChipList radius="rounded" size="xs">
        {user?.roles?.map(role => (
          <Chip key={role.id} selectable>
            <Link
              className={clsx('capitalize')}
              target="_blank"
              to={`/admin/roles/${role.id}/edit`}
            >
              <Trans message={role.name} />
            </Link>
          </Chip>
        ))}
      </ChipList>
    ),
  },
  {
    key: 'firstName',
    allowsSorting: true,
    header: () => <Trans message="First name" />,
    body: user => user.first_name,
  },
  {
    key: 'lastName',
    allowsSorting: true,
    header: () => <Trans message="Last name" />,
    body: user => user.last_name,
  },
  {
    key: 'createdAt',
    allowsSorting: true,
    width: 'w-96',
    header: () => <Trans message="Created at" />,
    body: user => (
      <time>
        <FormattedDate date={user.created_at} />
      </time>
    ),
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    width: 'w-128 flex-shrink-0',
    hideHeader: true,
    align: 'end',
    visibleInMode: 'all',
    body: user => (
      <div className="text-muted">
        <Link to={`${user.id}/edit`}>
          <Tooltip label={<Trans message="Edit user" />}>
            <IconButton size="md">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Link>
        {user.banned_at ? (
          <UnbanButton user={user} />
        ) : (
          <DialogTrigger type="modal">
            <Tooltip label={<Trans message="Suspend user" />}>
              <IconButton size="md">
                <PersonOffIcon />
              </IconButton>
            </Tooltip>
            <BanUserDialog user={user} />
          </DialogTrigger>
        )}
        <ImpersonateButton user={user} />
      </div>
    ),
  },
];

interface UnbanButtonProps {
  user: User;
}
function UnbanButton({user}: UnbanButtonProps) {
  const unban = useUnbanUser(user.id);
  return (
    <DialogTrigger
      type="modal"
      onClose={confirmed => {
        if (confirmed) {
          unban.mutate();
        }
      }}
    >
      <Tooltip label={<Trans message="Remove suspension" />}>
        <IconButton size="md" color="danger">
          <PersonOffIcon />
        </IconButton>
      </Tooltip>
      <ConfirmationDialog
        isDanger
        title={
          <Trans message="Suspend “:name“" values={{name: user.display_name}} />
        }
        body={
          <Trans message="Are you sure you want to remove suspension from this user?" />
        }
        confirm={<Trans message="Unsuspend" />}
      />
    </DialogTrigger>
  );
}

interface ImpersonateButtonProps {
  user: User;
}
function ImpersonateButton({user}: ImpersonateButtonProps) {
  const impersonate = useImpersonateUser();
  return (
    <DialogTrigger type="modal">
      <Tooltip label={<Trans message="Login as user" />}>
        <IconButton size="md">
          <LoginIcon />
        </IconButton>
      </Tooltip>
      <ConfirmationDialog
        title={
          <Trans
            message="Login as “:name“"
            values={{name: user.display_name}}
          />
        }
        isLoading={impersonate.isPending}
        body={<Trans message="Are you sure you want to login as this user?" />}
        confirm={<Trans message="Login" />}
        onConfirm={() => {
          impersonate.mutate({userId: user.id});
        }}
      />
    </DialogTrigger>
  );
}
