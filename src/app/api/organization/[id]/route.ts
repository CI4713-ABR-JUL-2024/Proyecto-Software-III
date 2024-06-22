import { NextRequest, NextResponse } from 'next/server';

import { organizationController } from '@/backend/controllers/organization';

export async function DELETE(
  req: NextRequest,
  params: { params: { id: string } }
) {
  try {
    const organization = await organizationController.deleteOrganization(
      req,
      params
    );
    return NextResponse.json(organization, { status: 200 });
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    };
    return NextResponse.json(error_json, { status: err.status });
  }
}

export async function PUT(
  req: NextRequest,
  params: { params: { id: string } }
) {
  try {
    const organization = await organizationController.updateOrganization(
      req,
      params
    );
    return NextResponse.json(organization, { status: 200 });
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    };
    return NextResponse.json(error_json, { status: err.status });
  }
}
