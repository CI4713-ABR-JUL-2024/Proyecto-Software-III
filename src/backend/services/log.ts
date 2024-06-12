import { Tlog_create_object_body} from '../validators/log'
import { log_body_create } from '../interfaces/log';
import prisma from '../../../prisma/prisma';
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
  