import { memo } from 'react';

import Image from 'next/image';

import adminIcon from '/public/img/admin-icon.svg?url';
import userIcon from '/public/img/user-icon.svg?url';

import s from './ProfileBoxIcon.module.sass';

const ProfileBox = memo(({ name }: { name?: string }) => {
  return (
    <div className={s['profile-box']}>
      <Image
        alt="profile-icon"
        className={s['admin-icon']}
        src={name === 'user' ? userIcon : adminIcon}
      />
      <span>{name}</span>
    </div>
  );
});

ProfileBox.displayName = 'ProfileBox';

export default ProfileBox;
