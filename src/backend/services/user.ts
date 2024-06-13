import prisma from '../../../prisma/prisma';
import bcrypt from 'bcrypt';
import { verifyJwt } from '../helpers/jwt';
import { create_log } from './log';
import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';
import { error_object } from '../interfaces/error';
import {
  user_body_create,
  user_body_update,
  user_body_update_password,
} from '../interfaces/user';
import { add_object_to_array, add_property } from '../utils/utils';
import { TUpdateUserRole, TUser_create_object_body } from '../validators/user';

export const create_user = async (
  body: TUser_create_object_body,
  token: string | null
) => {
  try {
    let userWithToken;
    if (token) {
      userWithToken = verifyJwt(token);
    }

    const isAdmin = userWithToken?.role_name === 'admin';

    if (isAdmin && !body.role_name) {
      const handle_err: error_object = handle_error_http_response(
        new Error(
          'El nombre del role es requerido para crear un usuario desde admin'
        ),
        '0000'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }
    console.log(body);

    const new_user = await prisma.user.create({
      data: {
        name: body.name,
        last_name: body.last_name,
        email: body.email ?? '',
        telephone: body.telephone ?? '',
        password: await bcrypt.hash(body.password, 10),
        role_name: isAdmin ? body.role_name : 'not_assigned', // default value for new users
      },
    });

    const { password, ...userWithoutPass } = new_user;

    const body_log = {
      user_id:userWithoutPass.id,
      module:"User",
      event:" create_user",
      date: new Date()
    }
    const log = await create_log(body_log);

    return userWithoutPass;
  } catch (error) {
    throw error;
  }
};

export const read_user = async (id: number) => {
  try {
    const read_user = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!read_user) {
      throw new Error('User does not exists');
    }

    return read_user;
  } catch (error) {
    throw error;
  }
};

export const list_users = async (
  search_fields?: string[],
  search_texts?: string[]
) => {
  try {
    let where_clause = {};
    let users;
    if (search_fields != null && search_texts != null) {
      if (search_fields.length > 1) {
        let object_where: any[] = [];
        for (let i = 0; i < search_fields.length; i++) {
          object_where = add_object_to_array(
            object_where,
            search_fields[i],
            search_texts[i]
          );
        }
        users = await prisma.user.findMany({
          where: { AND: object_where },
        });
      } else {
        add_property(where_clause, search_fields[0], search_texts[0]);
        users = await prisma.user.findMany({
          where: where_clause,
        });
      }

      return users;
    } else {
      const users = await prisma.user.findMany({});

      return users;
    }
  } catch (error) {
    throw error;
  }
};

export const delete_my_user = async (id: number, token: string) => {
  try {
    const userWithoutPass = verifyJwt(token);

    const { role_name } = userWithoutPass;
    if (role_name !== `admin`) {
      const handle_err: error_object = handle_error_http_response(
        new Error('Only admin user can delete another users'),
        '0005'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }

    const delete_user = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    const body_log = {
      user_id:userWithoutPass.id,
      module:"User",
      event:" delete_my_user",
      date: new Date()
    }
    const log = await create_log(body_log);

    if (!delete_user) {
      throw new Error('User does not exists');
    }

    return delete_user;
  } catch (error) {
    throw error;
  }
};

export const update_my_user = async (id: number, body: user_body_update) => {
  try {
    const read_user = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!read_user) {
      throw new Error('User does not exists');
    }

    const update_user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: body.name,
      },
    });

    const body_log = {
      user_id:id,
      module:"User",
      event:" update_my_password",
      date: new Date()
    }
    const log = await create_log(body_log);

    return update_user;
  } catch (error) {
    throw error;
  }
};

export const update_my_user_password = async (
  body: user_body_update_password,
  token: string
) => {
  try {
    const userWithoutPass = verifyJwt(token);

    if (!userWithoutPass) {
      const handle_err: error_object = handle_error_http_response(
        new Error('No autorizado'),
        '0005'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userWithoutPass.id,
      },
    });

    if (!user) {
      const handle_err: error_object = handle_error_http_response(
        new Error('User not found'),
        '0005'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }

    const passwordMatches = await bcrypt.compare(
      body.oldPassword,
      user.password!
    );

    if (passwordMatches) {
      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
        },
      });

      const body_log = {
        user_id:userWithoutPass.id,
        module:"User",
        event:" update_my_user_password",
        date: new Date()
      }
      const log = await create_log(body_log);

      return updatedUser;
    } else {
      const handle_err: error_object = handle_error_http_response(
        new Error('User not found'),
        '0005'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }
  } catch (error) {
    const handle_err: error_object = handle_error_http_response(error, '0005');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

const getSelfUser = async (token: string) => {
  const userWithoutPass = verifyJwt(token);

  if (!userWithoutPass) {
    const handle_err: error_object = handle_error_http_response(
      new Error('No autorizado'),
      '0005'
    );
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }

  return userWithoutPass;
};

const updateUserRole = async (
  data: TUpdateUserRole,
  userId: string,
  token: string
) => {
  const userWithoutPass = verifyJwt(token);

  if (!userWithoutPass) {
    const handle_err: error_object = handle_error_http_response(
      new Error('No autorizado'),
      '0005'
    );
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }

  const { role_name } = userWithoutPass;
  if (role_name !== `admin`) {
    const handle_err: error_object = handle_error_http_response(
      new Error(
        'Solo los usuarios de tipo admin pueden actualizar roles de usuarios'
      ),
      '0005'
    );
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
  const userUpdated = await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      role_name: data.role,
    },
  });

  const body_log = {
    user_id:userWithoutPass.id,
    module:"User",
    event:"updateUserRole",
    date: new Date()
  }
  const log = await create_log(body_log);

  return userUpdated;
};

export const userService = {
  create_user,
  read_user,
  list_users,
  delete_my_user,
  update_my_user,
  update_my_user_password,
  getSelfUser,
  updateUserRole,
};
