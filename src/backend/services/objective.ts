import prisma from '../../../prisma/prisma';
import { verifyJwt } from '../helpers/jwt';
import { create_log } from './log';

import { TObjectiveCreateObjectBody, TObjectiveUpdateObjectBody } from '../validators/objective';
import { add_object_to_array, add_property } from '../utils/utils';
import { objective_body_update } from '../interfaces/objective';
import { custom_error, handle_error_http_response } from '../utils/error_handler';
import { error_object } from '../interfaces/error';

export const create_objective = async (
  body: TObjectiveCreateObjectBody,
  token: string | null
) => {
  try {
    let userWithToken;

    if (token) {
      userWithToken = verifyJwt(token);
    }

    
    const new_objective = await prisma.objective.create({
      data: {
        name: body.name,
        okrDesignId: body.okrDesignId 
      },
    });
    console.log(userWithToken);

    const body_log = {
      user_id: userWithToken?.id,
      module: 'Objective',
      event: 'create_objective',
      date: new Date(),
    };
    const log = await create_log(body_log);

    return new_objective;
  } catch (error) {
    throw error;
  }
};


export const list_objectives = async (
    search_fields?: string[],
    search_texts?: string[]
  ) => {
    
    try {
      let where_clause = {};
      let objectives;
      if (search_fields != null && search_texts != null) {
        if (search_fields.length > 1) {
          let object_where: any[] = [];
          for (let i = 0; i < search_fields.length; i++) {
            if (search_fields[i] == "okrDesignId") {
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
          
          objectives = await prisma.objective.findMany({
            where: { AND: object_where },
          });
        } else {
          if (search_fields[0] == "okrDesignId") {
          add_property(where_clause, search_fields[0], Number(search_texts[0]));
          } else {
            add_property(where_clause, search_fields[0], search_texts[0]);
          }
          objectives = await prisma.objective.findMany({
            where: where_clause,
          });
        }
  
        return objectives;
      } else {
        const objectives = await prisma.objective.findMany({});
  
        return objectives;
      }
    } catch (error) {
      throw error;
    }
  };

  export const get_objective = async (id: number) => {
    try {
      const objective = await prisma.objective.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
  
      return objective;
    } catch (error) {
      throw error;
    }
  };


  export const update_objective = async (id: number, body: objective_body_update, token: string | null) => {
    try {
      const read_objective = await prisma.objective.findFirst({
        where: {
          id: id,
        },
      });
  
      if (!read_objective) {
        throw new Error('Objective does not exists');
      }
  
      let userWithToken;
      
      if (token) {
        userWithToken = verifyJwt(token);
      }
  
      if (body.okrDesignId) {
        const update_objective = await prisma.objective.update({
            where: {
            id: id,
            },
            data: {
            name: body.name,
            okrDesignId: body.okrDesignId,
            },
        });
    } else {
        const update_objective = await prisma.objective.update({
            where: {
            id: id,
            },
            data: {
            name: body.name,
            okrDesignId: read_objective.okrDesignId,
            },
        });
    }

      const body_log = {
        user_id:userWithToken?.id,
        module:"Objective",
        event:" update_objective",
        date: new Date()
      }
      const log = await create_log(body_log);
  
      return update_objective;
    } catch (error) {
      throw error;
    }
  };

  export const update_completed_objective = async (id: number, token: string | null) => {
    try {
      const read_objective = await prisma.objective.findFirst({
        where: {
          id: id,
        },
      });
  
      if (!read_objective) {
        throw new Error('Objective does not exists');
      }
  
      let userWithToken;
      
      if (token) {
        userWithToken = verifyJwt(token);
      }

      const value = !read_objective.completed;

   
      const updated_objective = await prisma.objective.update({
      where: { id: id },
      data: { completed: value },
     });

      const body_log = {
        user_id:userWithToken?.id,
        module:"Objective",
        event:" update_completed_objective",
        date: new Date()
      }
      const log = await create_log(body_log);
  
      return updated_objective;
    } catch (error) {
      throw error;
    }
  };



  export const delete_objective = async (id: number, token: string) => {
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
  
  
      const deletedObjective = await prisma.objective.delete({
        where: {
          id: id,
        },
      });
  
      const body_log = {
        user_id: userWithoutPass.id,
        module: 'Objective',
        event: ' deleteObjective',
        date: new Date(),
      };
      await create_log(body_log);
  
      if (!deletedObjective) {
        throw new Error('User does not exist');
      }
  
      return deletedObjective;
    } catch (error) {
      throw error;
    }
  };
  export const objectiveService = {update_objective, list_objectives, update_completed_objective,create_objective, delete_objective, get_objective}