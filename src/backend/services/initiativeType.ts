import prisma from '../../../prisma/prisma'
import { verifyJwt } from '../helpers/jwt';
import { create_log } from './log';


import { TInitiative_create_object_body } from '../validators/initiativeType';
import { add_object_to_array, add_property } from '../utils/utils';
import { initiative_body_update } from '../interfaces/initiativetype';


export const create_initiative = async (body: TInitiative_create_object_body, token: string | null) => {
  try {
    let userWithToken;
    
    if (token) {
      userWithToken = verifyJwt(token);
    }


    const new_initiative = await prisma.initiativeType.create({
      data:{
        name:body.name
      }
    })


    const body_log = {
      user_id:userWithToken?.id,
      module:"InitiativeType",
      event:" create_initiative",
      date: new Date()
    }
    const log = await create_log(body_log);


    return new_initiative;
  } catch (error) {
    throw error;
  }
};


export const list_initiatives = async (
  search_fields?: string[],
  search_texts?: string[]
) => {
  try {
    let where_clause = {};
    let initiatives;
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
        initiatives = await prisma.initiativeType.findMany({
          where: { AND: object_where },
        });
      } else {
        add_property(where_clause, search_fields[0], search_texts[0]);
        initiatives = await prisma.initiativeType.findMany({
          where: where_clause,
        });
      }

      return initiatives;
    } else {
      const initiatives = await prisma.initiativeType.findMany({});

      return initiatives;
    }
  } catch (error) {
    throw error;
  }
};



export const update_initiative = async (id: number, body: initiative_body_update, token: string | null) => {
  try {
    const read_initiative = await prisma.initiativeType.findFirst({
      where: {
        id: id,
      },
    });

    if (!read_initiative) {
      throw new Error('Initiative type does not exists');
    }

    let userWithToken;
    
    if (token) {
      userWithToken = verifyJwt(token);
    }


    const update_initiative = await prisma.initiativeType.update({
      where: {
        id: id,
      },
      data: {
        name: body.name,
      },
    });

    const body_log = {
      user_id:userWithToken?.id,
      module:"InitiativeType",
      event:" update_initiative",
      date: new Date()
    }
    const log = await create_log(body_log);

    return update_initiative;
  } catch (error) {
    throw error;
  }
};





export const initiativeService = {
  create_initiative,
  list_initiatives,
  update_initiative
};
