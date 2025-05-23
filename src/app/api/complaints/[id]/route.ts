import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import ComplaintModel from '@/app/models/Complaint';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const body = await request.json();
        const complaint = await ComplaintModel.findById(params.id);

        if (!complaint) {
            return NextResponse.json(
                { error: 'Complaint not found' },
                { status: 404 }
            );
        }

        // For student routes, only allow updating description and complaintType
        if (body.description) complaint.description = body.description;
        if (body.complaintType) complaint.complaintType = body.complaintType;
        
        await complaint.save();

        return NextResponse.json(complaint);
    } catch (error: any) {
        console.error('Error updating complaint:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
