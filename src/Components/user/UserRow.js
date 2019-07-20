import React from 'react';
import { ButtonGroup } from 'reactstrap';
import { ButtonIconEdit, ButtonIconDelete } from 'Components/Icons';

export default function UserRow({ user, history, deleteUser }) {
  return (
    <tr onClick={() => history.push(`/user/${user.id}`)}>
      <td>{user.email}</td>
      <td>{user.nombre}</td>
      <td>
        <ButtonGroup size="sm">
          <ButtonIconEdit
            outline
            onClick={ev => {
              ev.stopPropagation();
              history.push(`/user/edit/${user.id}`);
            }}
          />
          <ButtonIconDelete
            outline
            onClick={ev => {
              ev.stopPropagation();
              deleteUser(user.id);
            }}
          />
        </ButtonGroup>
      </td>
    </tr>
  );
}
