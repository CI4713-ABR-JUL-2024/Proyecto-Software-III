import { z } from 'zod';



const log_create_object_body = z.object({
    user_id: z.number(),
    module:z.string(),
    event: z.string(),
    date:z.date(),

  });
  
  export type Tlog_create_object_body = z.infer<typeof log_create_object_body>;
  
  export const validator_log_create = (body: unknown) => {
    const its_validated = log_create_object_body.parse(body);
    return its_validated;
  };

  export const logValidator = {
    validator_log_create,
   
  };
  