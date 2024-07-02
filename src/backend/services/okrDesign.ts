import prisma from '../../../prisma/prisma';
import { verifyJwt } from '../helpers/jwt';
import { create_log } from './log';

import { TOkrDesignCreateObjectBody, TOkrDesignUpdateObjectBody } from '../validators/okrDesign';
import { add_object_to_array, add_property } from '../utils/utils';
import { okrdesign_body_update } from '../interfaces/okrDesign';
import { custom_error, handle_error_http_response } from '../utils/error_handler';
import { error_object } from '../interfaces/error';



export const create_okrdesign = async (
    body: TOkrDesignCreateObjectBody,
    token: string | null
  ) => {
    try {
      let userWithToken;
  
      if (token) {
        userWithToken = verifyJwt(token);
      }
  
      const data = {
        project_id: body.project_id, 
      };
  
      const new_okrdesign = await prisma.okrDesing.create({
        data,
      });
  
      const body_log = {
        user_id: userWithToken?.id,
        module: 'OkrDesign',
        event: 'create_okrdesign',
        date: new Date(),
      };
      const log = await create_log(body_log);
  
      return new_okrdesign;
    } catch (error) {
      console.error('Error creating OkrDesign:', error); 
      throw error;
    }
  };


export const list_okrdesigns = async (
    search_fields?: string[],
    search_texts?: string[]
  ) => {
    
    try {
      let where_clause = {};
      let okrdesigns;
      if (search_fields != null && search_texts != null) {
        if (search_fields.length > 1) {
          let object_where: any[] = [];
          for (let i = 0; i < search_fields.length; i++) {
            if (search_fields[i] == "project_id") {
                object_where = add_object_to_array(
                object_where,
                search_fields[i],
                Number(search_texts[i])
                );
            } else {
                object_where = add_object_to_array(
                    object_where,
                    search_fields[i],
                    search_texts[i]
                );
            }
          }
          
          okrdesigns = await prisma.okrDesing.findMany({
            where: { AND: object_where },
          });
        } else {
          if (search_fields[0] == "project_id") {
          add_property(where_clause, search_fields[0], Number(search_texts[0]));
          } else {
            add_property(where_clause, search_fields[0], search_texts[0]);
          }
          okrdesigns = await prisma.okrDesing.findMany({
            where: where_clause,
          });
        }
  
        return okrdesigns;
      } else {
        const okrdesigns = await prisma.okrDesing.findMany({});
  
        return okrdesigns;
      }
    } catch (error) {
      throw error;
    }
  };


  export const update_okrdesign = async (id: number, body: okrdesign_body_update, token: string | null) => {
    try {
      const read_okrdesign = await prisma.okrDesing.findFirst({
        where: {
          id: id,
        },
      });
  
      if (!read_okrdesign) {
        throw new Error('OkrDesign does not exist');
      }
  
      let userWithToken;
      
      if (token) {
        userWithToken = verifyJwt(token);
      }
  
      if (body.project_id) {
        const update_okrdesign = await prisma.okrDesing.update({
            where: {
            id: id,
            },
            data: {
            project_id: body.project_id,
            },
        });
    } else {
        const update_okrdesign = await prisma.okrDesing.update({
            where: {
            id: id,
            },
            data: {
            project_id: body.project_id,
            },
        });
    }

      const body_log = {
        user_id:userWithToken?.id,
        module:"OkrDesign",
        event:" update_okrdesign",
        date: new Date()
      }
      const log = await create_log(body_log);
  
      return update_okrdesign;
    } catch (error) {
      throw error;
    }
  };

  export const delete_okrdesign = async (id: number, token: string) => {
    const idToDelete = id;
    console.log('Deleting OkrDesign with id:', idToDelete);
    try {
      const userWithoutPass = verifyJwt(token);
  
      const { role_name } = userWithoutPass;
  
      if (!userWithoutPass) {
        const handle_err: error_object = handle_error_http_response(
          new Error('Error en el token'),
          '0000'
        );
        throw new custom_error(
          handle_err.error_message,
          handle_err.error_message_detail,
          handle_err.error_code,
          handle_err.status
        );
      }
  
  
      const deletedOkrDesign = await prisma.okrDesing.delete({
        where: {
          id: id,
        },
      });
  
      const body_log = {
        user_id: userWithoutPass.id,
        module: 'OkrDesign',
        event: ' deleteOkrDesign',
        date: new Date(),
      };
      await create_log(body_log);
  
      if (!deletedOkrDesign) {
        throw new Error('User does not exist');
      }
  
      return deletedOkrDesign;
    } catch (error) {
      throw error;
    }
  };
  export const okrDesignService = {update_okrdesign, list_okrdesigns, create_okrdesign, delete_okrdesign}