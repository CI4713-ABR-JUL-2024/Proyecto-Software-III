import { Tlog_create_object_body} from '../validators/log'
import { add_object_to_array, add_property } from '../utils/utils';
import { log_body_create } from '../interfaces/log';
import prisma from '../../../prisma/prisma';
import { verifyJwt } from '../helpers/jwt';

export const create_log = async (body:   log_body_create) => {
    try {
        const new_log = await prisma.log.create({
          data :{
            user_id:body.user_id,
            module:body.module,
            event:body.event,
            date: body.date
          }
        });
  
      return new_log;
    } catch (error) {
      throw error;
    }
  };

/**
 * Retrieves a list of logs based on the provided search fields and search texts.
 * If no search fields and search texts are provided, it returns all logs.
 * @param search_fields - An optional array of search fields.
 * @param search_texts - An optional array of search texts.
 * @returns A Promise that resolves to an array of logs.
 * @throws Throws an error if there's an issue retrieving the logs.
 */
export const list_logs = async (
  token: string,
  search_fields?: string[],
  search_texts?: string[]
) => {
  try {
    let where_clause = {};
    let logs;
    const userWithoutPass = verifyJwt(token);
    if (search_fields != null && search_texts != null) {
      if (search_fields.length > 1) {
        let object_where: any[] = [];
        for (let i = 0; i < search_fields.length; i++) {
          if (search_fields[i] == 'id') {
            object_where = add_object_to_array(
              object_where,
              search_fields[i],
              parseInt(search_texts[i])
            );
          } else {
            object_where = add_object_to_array(
              object_where,
              search_fields[i],
              search_texts[i]
            );
          }
          
        }
        logs = await prisma.log.findMany({
          where: { 
            AND: [
              ...object_where,
              { user_id: userWithoutPass.id }
            ]
          },
        });
      } else {
        if (search_fields[0] == 'id') {
          add_property(where_clause, search_fields[0], parseInt(search_texts[0]));
        } else {
          add_property(where_clause, search_fields[0], search_texts[0]);
        }
        logs = await prisma.log.findMany({
          where: {
            ...where_clause,
            user_id: userWithoutPass.id
          },
        });
      }

      return logs;
    } else {
      const logs = await prisma.log.findMany({});

      return logs;
    }
  } catch (error) {
    throw error;
  }
};
  
export const logService = {
    create_log,
    list_logs,
};
