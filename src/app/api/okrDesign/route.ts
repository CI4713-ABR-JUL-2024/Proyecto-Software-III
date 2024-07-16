import { NextRequest, NextResponse } from 'next/server'
import { okrDesignController } from '@/backend/controllers/okrDesign'
import { okrDesignValidator } from '@/backend/validators/okrDesign';
import { headers } from 'next/headers';
import { custom_error } from '@/backend/utils/error_handler';
import { okrDesignService } from '@/backend/services/okrDesign';
import prisma from '../../../../prisma/prisma';

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
  
      const validatedBody = okrDesignValidator.validatorOkrDesignCreate(body);
  
      const accessToken = headers().get('Authorization');
  
      
      if (validatedBody.project_id) {
        const existingProject = await prisma.project.findUnique({
          where: { id: validatedBody.project_id },
        });
        if (!existingProject) {
          throw new custom_error(
            "Error creating OkrDesign",
            "The provided project_id does not exist",
            "0028",
            400 
          );
        }
      }
  
      const new_okrdesign = await okrDesignService.create_okrdesign(validatedBody, accessToken);
  
      return NextResponse.json(new_okrdesign, { status: 201 });
    } catch (err: any) {
      const error_json = {
        error_message: err.error_message,
        error_message_detail: err.error_message_detail,
        error_code: err.error_code,
      };
      return NextResponse.json(error_json, { status: err.status || 500 });
    }
  }
  

  export async function GET(req: NextRequest) {
    try {
      const list_okrdesign = await okrDesignController.get_okrdesigns(req)
      return NextResponse.json(list_okrdesign, { status: 200 })
    } catch (err: any) {
      const error_json = {
        error_message: err.error_message,
        error_message_detail: err.error_message_detail,
        error_code: err.error_code,
      }
      return NextResponse.json(error_json, { status: err.status })
    }
  }